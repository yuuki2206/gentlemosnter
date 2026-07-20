/**
 * AuthContext - Quản lý đăng nhập, đăng ký và thông tin hồ sơ khách hàng.
 * - Phiên bản Serverless (FE-only): Sử dụng localStorage làm cơ sở dữ liệu giả lập.
 */
import React, { createContext, useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { API_BASE_URL, getAuthHeaders } from "../config/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { logout: privyLogout } = usePrivy();
  
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]); // Dành cho bảng điều khiển Users Manager
  const [loading, setLoading] = useState(true);

  // Khởi tạo cơ sở dữ liệu người dùng giả lập trên localStorage nếu chưa tồn tại
  useEffect(() => {
    const mockUsers = localStorage.getItem("gm_mock_users");
    if (!mockUsers) {
      const initialUsers = [
        {
          email: "admin@gentlemonster.com",
          password: "admin",
          role: "admin",
          name: "Admin Gentle Monster",
          purchases: [],
        },
        {
          email: "user@gentlemonster.com",
          password: "user",
          role: "user",
          name: "Tri Gentle Monster",
          purchases: [],
        }
      ];
      localStorage.setItem("gm_mock_users", JSON.stringify(initialUsers));
    }

    // Tải thông tin phiên đăng nhập hiện tại từ localStorage (token chính là email)
    const token = localStorage.getItem("gm_auth_token");
    if (token) {
      const usersList = JSON.parse(localStorage.getItem("gm_mock_users") || "[]");
      const foundUser = usersList.find((u) => u.email === token);
      if (foundUser) {
        setUser(foundUser);
      } else {
        localStorage.removeItem("gm_auth_token");
      }
    }
    setLoading(false);
  }, []);

  // Tải danh sách người dùng cho bảng quản trị (Admin Panel)
  const fetchUsers = () => {
    const usersList = JSON.parse(localStorage.getItem("gm_mock_users") || "[]");
    setUsers(usersList);
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [user]);

  // Kiểm tra email đã tồn tại chưa
  const checkEmailExists = async (email) => {
    const usersList = JSON.parse(localStorage.getItem("gm_mock_users") || "[]");
    const exists = usersList.some((u) => u.email === email);
    return exists;
  };

  // Đăng nhập bằng Email & Mật khẩu
  const login = async (email, password) => {
    const usersList = JSON.parse(localStorage.getItem("gm_mock_users") || "[]");
    const foundUser = usersList.find((u) => u.email === email && u.password === password);
    if (foundUser) {
      localStorage.setItem("gm_auth_token", email);
      setUser(foundUser);
      return { success: true };
    }
    return { success: false, message: "Email hoặc mật khẩu không chính xác." };
  };

  // Đăng ký tài khoản mới (Hỗ trợ phân quyền adminKey)
  const register = async (userData) => {
    const usersList = JSON.parse(localStorage.getItem("gm_mock_users") || "[]");
    const exists = usersList.some((u) => u.email === userData.email);
    if (exists) {
      return { success: false, message: "Email này đã được đăng ký tài khoản." };
    }

    // Xác định vai trò user (nếu điền đúng adminKey)
    const role = userData.adminKey === "123456789" ? "admin" : "user";
    const fullName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || userData.name || userData.email;

    const newUser = {
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      name: fullName,
      country: userData.country || "Vietnam",
      phone: userData.phone || "",
      walletAddress: userData.walletAddress || "",
      role: role,
      purchases: [],
    };

    usersList.push(newUser);
    localStorage.setItem("gm_mock_users", JSON.stringify(usersList));
    localStorage.setItem("gm_auth_token", userData.email);
    setUser(newUser);
    return { success: true };
  };

  // Đăng xuất và xóa session
  const logout = () => {
    localStorage.removeItem("gm_auth_token");
    setUser(null);
    try {
      privyLogout();
    } catch (e) {
      console.error("Privy logout error:", e);
    }
  };

  // Cập nhật thông tin hồ sơ
  const updateProfile = async (updatedData) => {
    const usersList = JSON.parse(localStorage.getItem("gm_mock_users") || "[]");
    const userIndex = usersList.findIndex((u) => u.email === user.email);
    if (userIndex !== -1) {
      const updatedUser = {
        ...usersList[userIndex],
        ...updatedData,
      };
      usersList[userIndex] = updatedUser;
      localStorage.setItem("gm_mock_users", JSON.stringify(usersList));
      setUser(updatedUser);
      return { success: true };
    }
    return { success: false, message: "Không tìm thấy thông tin tài khoản." };
  };

  // Xóa tài khoản hiện tại
  const deleteAccount = async () => {
    const usersList = JSON.parse(localStorage.getItem("gm_mock_users") || "[]");
    const filteredUsers = usersList.filter((u) => u.email !== user.email);
    localStorage.setItem("gm_mock_users", JSON.stringify(filteredUsers));
    logout();
    return { success: true };
  };

  // Admin xóa người dùng
  const adminDeleteUser = async (email) => {
    const usersList = JSON.parse(localStorage.getItem("gm_mock_users") || "[]");
    const filteredUsers = usersList.filter((u) => u.email !== email);
    localStorage.setItem("gm_mock_users", JSON.stringify(filteredUsers));
    setUsers(filteredUsers);
    return { success: true };
  };

  // Thêm đơn hàng mua hàng mới (Ghi nhận hóa đơn)
  const addPurchase = async (purchaseData) => {
    // 1. Tạo mới đơn hàng mock
    const newOrder = {
      _id: `ord_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      ...purchaseData,
      status: "paid",
      createdAt: new Date().toISOString(),
    };

    // 2. Cập nhật lịch sử mua hàng của user hiện tại
    const usersList = JSON.parse(localStorage.getItem("gm_mock_users") || "[]");
    const userIndex = usersList.findIndex((u) => u.email === user.email);
    if (userIndex !== -1) {
      usersList[userIndex].purchases = [newOrder, ...(usersList[userIndex].purchases || [])];
      localStorage.setItem("gm_mock_users", JSON.stringify(usersList));
      setUser(usersList[userIndex]);
    }

    // 3. Cập nhật vào danh sách đơn hàng toàn cục (cho Admin Dashboard xem hóa đơn)
    const globalOrders = JSON.parse(localStorage.getItem("gm_mock_orders") || "[]");
    localStorage.setItem("gm_mock_orders", JSON.stringify([newOrder, ...globalOrders]));

    // 4. Đồng bộ hóa đơn lên CSDL MongoDB phia Backend (Server-side Database)
    try {
      await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          orderId: newOrder.id || newOrder._id,
          items: newOrder.items || [],
          total: newOrder.total || 0,
          ethTotal: newOrder.ethTotal || "0",
          txHash: newOrder.txHash || "",
          sender: newOrder.sender || "",
          receiver: newOrder.receiver || "",
          status: "Completed",
          type: newOrder.type || "Web3",
        }),
      });
      console.log("[MongoDB Sync] Ghi nhận hóa đơn mua hàng thành công lên CSDL MongoDB!");
    } catch (err) {
      console.log("[Offline Mode] Server MongoDB tạm nghỉ, hóa đơn được lưu an toàn tại LocalStorage.");
    }

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        loading,
        checkEmailExists,
        login,
        register,
        logout,
        updateProfile,
        deleteAccount,
        adminDeleteUser,
        addPurchase,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
