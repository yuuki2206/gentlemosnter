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

    // Hàm gom nhóm và làm sạch danh sách đơn hàng cho user
    const mergePurchases = (userObj) => {
      if (!userObj) return null;
      const serverPurchases = userObj.purchases || [];
      const globalMock = JSON.parse(localStorage.getItem("gm_mock_orders") || "[]");
      const usersList = JSON.parse(localStorage.getItem("gm_mock_users") || "[]");
      const localUser = usersList.find(u => (u.email || "").toLowerCase() === (userObj.email || "").toLowerCase());
      const localUserPurchases = localUser?.purchases || [];

      // Lọc các đơn hàng liên quan đến user này trong gm_mock_orders
      const matchedGlobal = globalMock.filter(o => 
        (o.userEmail || "").toLowerCase() === (userObj.email || "").toLowerCase() ||
        (o.sender || "").toLowerCase() === (userObj.walletAddress || "").toLowerCase()
      );

      const combined = [...serverPurchases, ...localUserPurchases, ...matchedGlobal];
      const uniqueMap = new Map();
      combined.forEach(p => {
        const key = p.orderId || p.id || p._id || p.txHash;
        if (key && !uniqueMap.has(key)) {
          uniqueMap.set(key, {
            ...p,
            id: p.id || p.orderId || p._id,
            date: p.date || (p.createdAt ? new Date(p.createdAt).toLocaleDateString("vi-VN") : new Date().toLocaleDateString("vi-VN")),
          });
        }
      });
      return {
        ...userObj,
        purchases: Array.from(uniqueMap.values()),
      };
    };

    // Tải thông tin phiên đăng nhập hiện tại
    const initAuth = async () => {
      const token = localStorage.getItem("gm_auth_token");
      if (token) {
        // 1. Thử nạp hồ sơ từ Server Backend MongoDB (Timeout 2s cho Vercel/Offline)
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 2000);

          const res = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: getAuthHeaders(),
            signal: controller.signal,
          });
          clearTimeout(timer);
          if (res.ok) {
            const data = await res.json();
            setUser(mergePurchases(data));
            setLoading(false);
            return;
          }
        } catch (e) {
          console.log("[Offline Mode] Server MongoDB offline, nạp thông tin từ LocalStorage");
        }

        // 2. Dự phòng nạp từ LocalStorage Mock DB
        const usersList = JSON.parse(localStorage.getItem("gm_mock_users") || "[]");
        const foundUser = usersList.find((u) => u.email === token || u.token === token);
        if (foundUser) {
          setUser(mergePurchases(foundUser));
        } else {
          localStorage.removeItem("gm_auth_token");
        }
      }
      setLoading(false);
    };

    initAuth();

    // Lắng nghe sự kiện thay đổi bộ nhớ giữa các tab (Cross-tab Real-time Sync)
    const handleStorageChange = (e) => {
      if (e.key === "gm_mock_orders" || e.key === "gm_mock_users" || e.key === "gm_auth_token") {
        initAuth();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Tải danh sách người dùng cho bảng quản trị (Admin Panel)
  const fetchUsers = async () => {
    let serverUsers = [];
    try {
      const res = await fetch(`${API_BASE_URL}/auth/users`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          serverUsers = data;
        }
      }
    } catch (e) {
      console.log("[Offline Mode] Server offline, nạp danh sách user từ LocalStorage");
    }

    const localUsers = JSON.parse(localStorage.getItem("gm_mock_users") || "[]");
    const combined = [...serverUsers, ...localUsers];
    const uniqueMap = new Map();

    combined.forEach((u) => {
      const email = (u.email || "").trim().toLowerCase();
      if (email && !uniqueMap.has(email)) {
        uniqueMap.set(email, {
          ...u,
          firstName: u.firstName || (u.name ? u.name.split(" ")[0] : "User"),
          lastName: u.lastName || "",
          email: u.email,
          role: u.role || "user",
          registrationIp: u.registrationIp || "127.0.0.1",
          walletAddress: u.walletAddress || "",
        });
      }
    });

    setUsers(Array.from(uniqueMap.values()));
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [user]);

  // Kiểm tra email đã tồn tại chưa (Hỗ trợ Server MongoDB + LocalStorage)
  const checkEmailExists = async (email) => {
    const cleanEmail = (email || "").trim().toLowerCase();

    // 1. Thử kiểm tra qua Server MongoDB trước
    try {
      const res = await fetch(`${API_BASE_URL}/auth/check-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.exists) return true;
      }
    } catch (e) {
      console.log("[Offline Mode] Server MongoDB offline, kiểm tra email bằng LocalStorage");
    }

    // 2. Dự phòng kiểm tra LocalStorage Mock DB
    const usersList = JSON.parse(localStorage.getItem("gm_mock_users") || "[]");
    const exists = usersList.some(
      (u) => (u.email || "").trim().toLowerCase() === cleanEmail
    );
    return exists;
  };

  // Đăng nhập bằng Email & Mật khẩu (Hỗ trợ Server MongoDB + LocalStorage)
  const login = async (email, password) => {
    const cleanEmail = (email || "").trim().toLowerCase();

    // 1. Thử đăng nhập qua Server MongoDB
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("gm_auth_token", data.token);
        setUser(mergePurchases(data.user));
        return { success: true };
      }
    } catch (e) {
      console.log("[Offline Mode] Server MongoDB chưa bật, sử dụng đăng nhập LocalStorage");
    }

    // 2. Dự phòng LocalStorage Mock DB (xử lý không phân biệt hoa thường)
    const usersList = JSON.parse(localStorage.getItem("gm_mock_users") || "[]");
    const foundUser = usersList.find(
      (u) => (u.email || "").trim().toLowerCase() === cleanEmail && u.password === password
    );

    if (foundUser) {
      localStorage.setItem("gm_auth_token", foundUser.email);
      setUser(mergePurchases(foundUser));

      // Tự động đồng bộ tài khoản này lên MongoDB Server nếu server đang bật
      try {
        const regRes = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: foundUser.firstName || foundUser.name || "User",
            lastName: foundUser.lastName || "",
            email: foundUser.email,
            password: foundUser.password,
            country: foundUser.country || "Vietnam",
            phone: foundUser.phone || "",
            walletAddress: foundUser.walletAddress || "",
            adminKey: foundUser.role === "admin" ? "123456789" : "",
          }),
        });
        const regData = await regRes.json();
        if (regRes.ok && regData.token) {
          localStorage.setItem("gm_auth_token", regData.token);
          setUser(mergePurchases(regData.user));
        }
      } catch (err) {}

      return { success: true };
    }

    return { success: false, message: "Email hoặc mật khẩu không chính xác." };
  };

  // Đăng ký tài khoản mới (Hỗ trợ Server MongoDB + LocalStorage)
  const register = async (userData) => {
    const fullName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || userData.name || userData.email;

    // 1. Thử đăng ký qua Server MongoDB
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: userData.password,
          country: userData.country || "Vietnam",
          phone: userData.phone || "",
          walletAddress: userData.walletAddress || "",
          adminKey: userData.adminKey || "",
        }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("gm_auth_token", data.token);
        setUser(data.user);
        return { success: true };
      } else if (!res.ok && data.message) {
        if (data.message.includes("đã được đăng ký")) {
          return { success: false, message: data.message };
        }
      }
    } catch (e) {
      console.log("[Offline Mode] Server MongoDB chưa bật, sử dụng đăng ký LocalStorage");
    }

    // 2. Dự phòng LocalStorage Mock DB
    const usersList = JSON.parse(localStorage.getItem("gm_mock_users") || "[]");
    const exists = usersList.some((u) => u.email === userData.email);
    if (exists) {
      return { success: false, message: "Email này đã được đăng ký tài khoản." };
    }

    const role = userData.adminKey === "123456789" ? "admin" : "user";
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

  // Cập nhật thông tin hồ sơ (Hỗ trợ Server MongoDB + LocalStorage)
  const updateProfile = async (updatedData) => {
    let newUserData = null;

    // 1. Thử cập nhật lên Server MongoDB trước
    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        newUserData = await res.json();
        setUser(newUserData);
        console.log("[MongoDB Sync] Cập nhật thông tin hồ sơ thành công lên CSDL MongoDB Atlas!");
      }
    } catch (e) {
      console.log("[Offline Mode] Server MongoDB offline, cập nhật thông tin tại LocalStorage");
    }

    // 2. Cập nhật vào LocalStorage Mock DB
    const usersList = JSON.parse(localStorage.getItem("gm_mock_users") || "[]");
    const userIndex = usersList.findIndex(
      (u) => (u.email || "").trim().toLowerCase() === (user?.email || "").trim().toLowerCase()
    );

    if (userIndex !== -1) {
      const updatedUser = {
        ...usersList[userIndex],
        ...updatedData,
        name: `${updatedData.firstName || usersList[userIndex].firstName || ""} ${updatedData.lastName || usersList[userIndex].lastName || ""}`.trim(),
      };
      usersList[userIndex] = updatedUser;
      localStorage.setItem("gm_mock_users", JSON.stringify(usersList));
      if (!newUserData) {
        setUser(updatedUser);
      }
      return { success: true };
    }

    if (newUserData) return { success: true };
    return { success: false, message: "Không tìm thấy thông tin tài khoản." };
  };

  // Xóa tài khoản hiện tại (Hỗ trợ Server MongoDB + LocalStorage)
  const deleteAccount = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
    } catch (e) {}

    const usersList = JSON.parse(localStorage.getItem("gm_mock_users") || "[]");
    const filteredUsers = usersList.filter(
      (u) => (u.email || "").trim().toLowerCase() !== (user?.email || "").trim().toLowerCase()
    );
    localStorage.setItem("gm_mock_users", JSON.stringify(filteredUsers));
    logout();
    return { success: true };
  };

  // Admin xóa người dùng (Hỗ trợ Server MongoDB + LocalStorage)
  const adminDeleteUser = async (email) => {
    try {
      await fetch(`${API_BASE_URL}/auth/users/${encodeURIComponent(email)}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
    } catch (e) {}

    const usersList = JSON.parse(localStorage.getItem("gm_mock_users") || "[]");
    const filteredUsers = usersList.filter(
      (u) => (u.email || "").trim().toLowerCase() !== (email || "").trim().toLowerCase()
    );
    localStorage.setItem("gm_mock_users", JSON.stringify(filteredUsers));
    setUsers(filteredUsers);
    return { success: true };
  };

  // Thêm đơn hàng mua hàng mới (Ghi nhận hóa đơn)
  const addPurchase = async (purchaseData) => {
    // 1. Tạo mới đơn hàng
    const newOrder = {
      _id: `ord_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      userEmail: user?.email || purchaseData?.userEmail || "customer@gentlemonster.com",
      ...purchaseData,
      status: "paid",
      createdAt: new Date().toISOString(),
    };

    // 2. Cập nhật state user hiện tại NGAY LẬP TỨC để giao diện hiển thị ngay!
    setUser((prevUser) => {
      if (!prevUser) return prevUser;
      const prevPurchases = prevUser.purchases || [];
      return {
        ...prevUser,
        purchases: [newOrder, ...prevPurchases],
      };
    });

    // 3. Cập nhật vào LocalStorage Mock DB (Bảo lưu cho mọi phiên Đăng nhập / Đăng xuất)
    if (user && user.email) {
      const usersList = JSON.parse(localStorage.getItem("gm_mock_users") || "[]");
      const userIndex = usersList.findIndex(
        (u) => (u.email || "").trim().toLowerCase() === user.email.trim().toLowerCase()
      );
      if (userIndex !== -1) {
        usersList[userIndex].purchases = [newOrder, ...(usersList[userIndex].purchases || [])];
      } else {
        usersList.push({
          ...user,
          purchases: [newOrder],
        });
      }
      localStorage.setItem("gm_mock_users", JSON.stringify(usersList));
    }

    const globalOrders = JSON.parse(localStorage.getItem("gm_mock_orders") || "[]");
    localStorage.setItem("gm_mock_orders", JSON.stringify([newOrder, ...globalOrders]));

    // 4. Đồng bộ hóa đơn lên CSDL MongoDB phía Backend (Server-side Database)
    try {
      const formattedItems = (newOrder.items || []).map((item) => ({
        sku: item.sku || item.id || "N/A",
        name: item.name || item.title || "Gentle Monster Eyewear",
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        thumbnail: item.thumbnail || item.url || (Array.isArray(item.images) ? item.images[0] : "") || "",
      }));

      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          orderId: newOrder.id || newOrder._id,
          userEmail: user?.email || purchaseData?.sender || "customer@gentlemonster.com",
          items: formattedItems,
          total: newOrder.total || 0,
          ethTotal: newOrder.ethTotal || "0",
          txHash: newOrder.txHash || "",
          sender: newOrder.sender || "",
          receiver: newOrder.receiver || "",
          status: "Completed",
          type: newOrder.type || "Web3",
        }),
      });

      if (res.ok) {
        console.log("[MongoDB Sync] Ghi nhận hóa đơn thành công lên MongoDB Atlas!");
      }
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
