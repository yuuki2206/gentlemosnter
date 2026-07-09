export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Lấy Header mặc định chứa token JWT để xác thực trên API Server
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem("gm_auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};
