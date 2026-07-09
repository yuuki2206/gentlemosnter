/**
 * AuthContext - Quản lý đăng nhập, đăng ký và thông tin hồ sơ khách hàng kết nối API Backend.
 * - Sử dụng localStorage để lưu trữ JWT Token.
 * - Cung cấp các hàm liên kết API Backend NodeJS & Database MongoDB.
 * - Tích hợp CASL v7 để quản lý phân quyền theo Role.
 */
import React, { createContext, useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { API_BASE_URL, getAuthHeaders } from "../config/api";
import { defineAbilitiesFor } from "../config/ability";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { logout: privyLogout } = usePrivy();
  
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]); // Dành cho bảng điều khiển Users Manager
  const [loading, setLoading] = useState(true);
  
  // Quản lý trạng thái phân quyền CASL v7
  const [ability, setAbility] = useState(() => defineAbilitiesFor(null));

  // Tải thông tin hồ sơ tài khoản từ Backend nếu có JWT Token
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("gm_auth_token");
      if (token) {
        try {
          const res = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: getAuthHeaders(),
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
          } else {
            // Token hết hạn hoặc không hợp lệ
            localStorage.removeItem("gm_auth_token");
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  // Tự động cập nhật bộ phân quyền CASL khi user đăng nhập/thay đổi
  useEffect(() => {
    setAbility(defineAbilitiesFor(user));
  }, [user]);

  // Tự động tải danh sách người dùng cho bảng quản trị khi đăng nhập thành công
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/users`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  useEffect(() => {
    // Chỉ tải danh sách user nếu tài khoản hiện tại là Admin
    if (user && user.role === "admin") {
      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [user]);

  // Kiểm tra email đã đăng ký tài khoản chưa
  const checkEmailExists = async (email) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/check-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.exists;
      }
      return false;
    } catch (error) {
      console.error("Error checking email existence:", error);
      return false;
    }
  };

  // Đăng nhập bằng Email & Mật khẩu
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("gm_auth_token", data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: data.message || "Đăng nhập thất bại." };
    } catch (error) {
      return { success: false, message: "Không thể kết nối đến máy chủ API." };
    }
  };

  // Đăng ký tài khoản mới (Có thể truyền kèm adminKey)
  const register = async (userData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("gm_auth_token", data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: data.message || "Đăng ký thất bại." };
    } catch (error) {
      return { success: false, message: "Không thể kết nối đến máy chủ API." };
    }
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
    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        if (data.role === "admin") {
          fetchUsers();
        }
        return { success: true };
      }
      return { success: false, message: data.message || "Cập nhật hồ sơ thất bại." };
    } catch (error) {
      return { success: false, message: "Không thể kết nối đến máy chủ API." };
    }
  };

  // Xóa tài khoản hiện tại
  const deleteAccount = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        logout();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Error deleting account:", error);
      return { success: false };
    }
  };

  // Admin xóa người dùng
  const adminDeleteUser = async (email) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/users/${encodeURIComponent(email)}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setUsers((prevUsers) => prevUsers.filter((u) => u.email !== email));
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Error deleting user by admin:", error);
      return { success: false };
    }
  };

  // Thêm đơn hàng mua hàng mới (Ghi nhận hóa đơn)
  const addPurchase = async (purchaseData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(purchaseData),
      });
      if (res.ok) {
        const newOrder = await res.json();
        // Đồng bộ cập nhật danh sách đơn hàng của User trên UI
        setUser((prevUser) => {
          if (!prevUser) return null;
          return {
            ...prevUser,
            purchases: [newOrder, ...(prevUser.purchases || [])],
          };
        });
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Error adding purchase order:", error);
      return { success: false };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        ability, // Chia sẻ đối tượng phân quyền cho các page/components check
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
