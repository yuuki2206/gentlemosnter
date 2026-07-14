/**
 * AuthSidebar Component - Sidebar trượt từ bên phải để Đăng nhập / Đăng ký.
 * Tích hợp Privy Embedded Wallet để tự động tạo ví Web3 khi kết nối Google.
 */
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Mail, ChevronLeft } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { usePrivy } from "@privy-io/react-auth";

const AuthSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    checkEmailExists,
    login: localLogin,
    register: localRegister,
    user: localUser,
    users,
    updateProfile,
  } = useContext(AuthContext);
  const { wishlist } = useContext(CartContext);

  // === PRIVY EMBEDDED WALLET HOOK ===
  const { login: privyLogin, authenticated, user: privyUser } = usePrivy();

  // === DYNAMIC STATES ===
  const [step, setStep] = useState("EMAIL");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Tự động đồng bộ phiên đăng nhập Privy Google sang hệ thống Local Context
  useEffect(() => {
    const syncPrivy = async () => {
      if (authenticated && privyUser && !localUser) {
        const privyEmail = privyUser.email?.address || `user_${privyUser.id.substring(10, 18)}@gmail.com`;
        const walletAddress = privyUser.wallet?.address || "";
        
        const exists = await checkEmailExists(privyEmail);
        if (exists) {
          // Nếu tài khoản đã có, tự động đăng nhập localUser và cập nhật ví Web3
          await localLogin(privyEmail, "google_login_no_password");
          await updateProfile({ walletAddress });
        } else {
          // Nếu chưa có, tự động tạo tài khoản localUser liên kết ví Web3 nhúng
          await localRegister({
            email: privyEmail,
            firstName: privyEmail.split("@")[0],
            lastName: "Web3 User",
            password: "google_login_no_password",
            country: "Vietnam",
            phone: "",
            walletAddress: walletAddress,
          });
        }
        onClose();
      }
    };
    syncPrivy();
  }, [authenticated, privyUser, localUser]);

  // Reset trạng thái khi đóng/mở sidebar
  useEffect(() => {
    if (!isOpen) {
      setStep("EMAIL");
      setEmail("");
      setPassword("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Bước 1: Kiểm tra email
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const exists = await checkEmailExists(email);
    if (exists) {
      setStep("PASSWORD"); // Đã có tài khoản, yêu cầu password
    } else {
      setStep("SIGNUP_PROMPT"); // Chưa có tài khoản, chuyển hướng đăng ký
    }
  };

  // Bước 2: Đăng nhập bằng mật khẩu
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    const result = await localLogin(email, password);
    if (result.success) {
      onClose();
      navigate("/account");
    } else {
      setError(result.message);
    }
  };

  return (
    <>
      {/* Backdrop che mờ */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-[99998] transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] md:w-[480px] bg-[#fdfdfd] z-[99999] transform transition-transform duration-500 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Nút Đóng (X) và Back */}
        <div className="flex justify-between items-center p-5 border-b border-gray-50 sm:border-none">
          {step !== "EMAIL" ? (
            <button
              onClick={() => {
                setStep("EMAIL");
                setError("");
                setPassword("");
              }}
              className="text-gray-400 hover:text-black flex items-center gap-1 text-[10px] tracking-wider font-semibold uppercase"
            >
              <ChevronLeft size={16} /> Back
            </button>
          ) : (
            <div />
          )}
          <button onClick={onClose} className="hover:opacity-60 transition-opacity">
            <X size={24} strokeWidth={1} />
          </button>
        </div>

        {/* NỘI DUNG CHÍNH */}
        <div className="flex-1 overflow-y-auto px-8 md:px-12 pb-10 flex flex-col justify-between">
          <div className="flex-1">
            
            {/* Lỗi hiển thị */}
            {error && (
              <p className="text-[10px] text-red-500 font-medium tracking-wide mb-4 bg-red-50 py-2 px-3 text-left border-l-2 border-red-500">
                {error}
              </p>
            )}

            {/* MÀN HÌNH 1: NHẬP EMAIL (Ảnh 1) */}
            {step === "EMAIL" && (
              <div>
                <h2 className="text-[11px] font-bold tracking-widest uppercase mb-4 text-black">
                  LOGIN / CREATE ACCOUNT
                </h2>
                <p className="text-[11px] text-gray-500 font-light leading-relaxed mb-8">
                  Please enter your email address, and we'll check if you already have an account. You may also continue as a Guest.
                </p>

                <form onSubmit={handleEmailSubmit}>
                  <p className="text-[8px] text-gray-400 text-right mb-2 tracking-wider">*Required Fields</p>
                  
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address*"
                    className="w-full border border-gray-200 bg-white px-4 py-4 text-[12px] focus:outline-none focus:border-black transition-colors mb-4 placeholder-gray-300"
                    required
                  />

                  <button
                    type="submit"
                    className="w-full bg-[#888888] hover:bg-black text-white text-[10px] font-bold tracking-[0.2em] uppercase py-4 transition-colors mb-6"
                  >
                    CONTINUE
                  </button>
                </form>

                <div className="text-center text-[10px] text-gray-300 mb-6 font-light uppercase tracking-widest">
                  or
                </div>

                {/* Nút đăng nhập Google qua Privy Embedded Wallet */}
                <button
                  onClick={() => privyLogin()}
                  className="w-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-3 py-3 mb-3 transition-colors rounded-none"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-black">Continue with Google</span>
                </button>

                <button
                  onClick={() => privyLogin()}
                  className="w-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-3 py-3 mb-8 transition-colors rounded-none"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.15 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.61 1.54-1.47 3.06-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.35 2.45-1.92 4.41-3.74 4.25z"/>
                  </svg>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-black">Continue with Apple</span>
                </button>

                <button className="w-full bg-transparent border border-gray-300 hover:border-black text-black text-[10px] font-bold tracking-widest uppercase py-4 transition-colors mb-8 rounded-none">
                  TRACK MY ORDER
                </button>
              </div>
            )}

            {/* MÀN HÌNH 2: GỢI Ý ĐĂNG KÝ (Ảnh 2) */}
            {step === "SIGNUP_PROMPT" && (
              <div>
                <h2 className="text-[11px] font-bold tracking-widest uppercase mb-4 text-black">
                  LOGIN / CREATE ACCOUNT
                </h2>
                <p className="text-[11px] text-gray-500 font-light leading-relaxed mb-8">
                  We couldn't find an existing account with your email.
                </p>

                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => privyLogin()}
                    className="w-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-3 py-3.5 transition-colors rounded-none"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-black">Sign up with Google</span>
                  </button>

                  <button
                    onClick={() => privyLogin()}
                    className="w-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-3 py-3.5 transition-colors rounded-none"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.15 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.61 1.54-1.47 3.06-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.35 2.45-1.92 4.41-3.74 4.25z"/>
                    </svg>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-black">Sign up with Apple</span>
                  </button>
                </div>

                <div className="text-center text-[10px] text-gray-300 mb-6 font-light uppercase tracking-widest">
                  or
                </div>

                <button
                  onClick={() => {
                    onClose();
                    navigate(`/signup?email=${encodeURIComponent(email)}`);
                  }}
                  className="w-full bg-black hover:bg-gray-800 text-white text-[10px] font-bold tracking-widest uppercase py-4 transition-colors mb-8 rounded-none flex items-center justify-center gap-2"
                >
                  <Mail size={14} /> SIGN UP WITH EMAIL
                </button>

                <button className="w-full bg-transparent border border-gray-300 hover:border-black text-black text-[10px] font-bold tracking-widest uppercase py-4 transition-colors mb-8 rounded-none">
                  TRACK MY ORDER
                </button>
              </div>
            )}

            {/* MÀN HÌNH 3: NHẬP MẬT KHẨU CỤC BỘ */}
            {step === "PASSWORD" && (
              <div>
                <h2 className="text-[11px] font-bold tracking-widest uppercase mb-4 text-black">
                  ENTER PASSWORD
                </h2>
                <p className="text-[11px] text-gray-500 font-light leading-relaxed mb-8">
                  Welcome back! Please enter the password associated with <span className="font-semibold text-black">{email}</span>.
                </p>

                <form onSubmit={handlePasswordSubmit}>
                  <p className="text-[8px] text-gray-400 text-right mb-2 tracking-wider">*Required Fields</p>
                  
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password*"
                    className="w-full border border-gray-200 bg-white px-4 py-4 text-[12px] focus:outline-none focus:border-black transition-colors mb-4 placeholder-gray-300"
                    required
                  />

                  <button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800 text-white text-[10px] font-bold tracking-widest uppercase py-4 transition-colors mb-6 rounded-none"
                  >
                    LOGIN
                  </button>
                </form>

                <button
                  onClick={() => {
                    setStep("EMAIL");
                    setError("");
                    setPassword("");
                  }}
                  className="w-full bg-transparent border border-gray-300 hover:border-black text-black text-[10px] font-bold tracking-widest uppercase py-4 transition-colors mb-8 rounded-none"
                >
                  USE A DIFFERENT ACCOUNT
                </button>
              </div>
            )}

            {/* WISHLIST SECTION */}
            <div className="mt-8 pt-8 border-t border-gray-100 flex-grow">
              <h3 className="text-[11px] font-bold tracking-widest uppercase mb-4 text-black">
                WISHLIST<sup className="ml-1 text-[8px]">{wishlist.length}</sup>
              </h3>
              {wishlist.length === 0 ? (
                <p className="text-[11px] text-gray-400 font-light tracking-wide">
                  You have nothing in your wishlist, yet.
                </p>
              ) : (
                <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2">
                  {wishlist.map((item) => (
                    <div key={item.sku} className="flex gap-4 items-center justify-between py-2 border-b border-gray-55">
                      <img src={item.thumbnail} alt={item.name} className="w-12 h-9 object-contain bg-[#f4f4f4]" />
                      <div className="flex-grow min-w-0 text-left">
                        <h4 className="text-[10px] font-semibold tracking-wider text-black truncate">{item.name}</h4>
                        <p className="text-[9px] text-gray-500">₫ {Number(item.price).toLocaleString("en-US")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* FOOTER */}
          <div className="pt-6 border-t border-gray-100 flex flex-col gap-2 items-start text-left">
            <a href="#" className="text-[10px] text-gray-400 hover:text-black tracking-widest uppercase font-semibold transition-colors duration-300">
              Customer Service
            </a>
            <p className="text-[10px] text-black tracking-widest uppercase font-semibold">
              Country : <span className="underline cursor-pointer">Vietnam</span>
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default AuthSidebar;