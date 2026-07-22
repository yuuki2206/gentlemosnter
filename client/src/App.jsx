/**
 * App Component - Quản lý Định tuyến (Routing) của website.
 * - Router: Giúp chuyển trang mượt mà không tải lại trình duyệt.
 * - Route: Ánh xạ từng đường dẫn URL đến trang giao diện tương ứng.
 * - React.lazy & Suspense: Code splitting giúp tải trang ban đầu siêu nhanh.
 */
import React, { useContext, useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { SlidersHorizontal, Eye } from "lucide-react";

import { CartProvider, CartContext } from "./context/CartContext";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { PrivyProvider } from "@privy-io/react-auth";

import ScrollToTopButton from "./components/ScrollToTopButton";
import Preloader from "./components/Preloader";
import ToastNotification from "./components/ToastNotification";

// Lazy load dynamic imports for routes
const Home = lazy(() => import("./pages/Home"));
const Sunglasses = lazy(() => import("./pages/Sunglasses"));
const Glasses = lazy(() => import("./pages/Glasses"));
const IntelligentEyewear = lazy(() => import("./pages/IntelligentEyewear"));
const Services = lazy(() => import("./pages/Services"));
const Stories = lazy(() => import("./pages/Stories"));
const StoryDetail = lazy(() => import("./pages/StoryDetail"));
const Signup = lazy(() => import("./pages/Signup"));
const Account = lazy(() => import("./pages/Account"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));

/**
 * AppContent - Component phụ trợ chạy bên trong AuthProvider để lấy được Context thông tin User đăng nhập
 */
function AppContent() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const location = useLocation();

  const [showPreloader, setShowPreloader] = useState(() => {
    // Chỉ hiển thị preloader 1 lần duy nhất trong mỗi phiên duyệt web (Session)
    return !sessionStorage.getItem("preloader_shown");
  });

  const handlePreloaderComplete = () => {
    sessionStorage.setItem("preloader_shown", "true");
    setShowPreloader(false);
  };

  const isAdmin = user && user.role === "admin";
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {showPreloader && <Preloader ready={!authLoading} onComplete={handlePreloaderComplete} />}
      <ToastNotification />
      
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <Routes>
          {/* Trang chủ */}
          <Route path="/" element={<Home />} />

          {/* Trang đăng ký và quản lý tài khoản */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/account" element={<Account />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/shop/:sku" element={<ProductDetail />} />
          <Route path="/profile" element={<Account />} />

          {/* Trang danh mục sản phẩm (đường dẫn ngắn) */}
          <Route path="/sunglasses" element={<Sunglasses />} />
          <Route path="/glasses" element={<Glasses />} />
          <Route path="/intelligent-eyewear" element={<IntelligentEyewear />} />
          <Route path="/services" element={<Services />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/stories/:id" element={<StoryDetail />} />

          {/* Trang danh mục sản phẩm (đường dẫn dài theo cấu trúc website gốc Gentle Monster) */}
          <Route path="/int/en/category/sunglasses/*" element={<Sunglasses />} />
          <Route path="/int/en/category/glasses/*" element={<Glasses />} />
          <Route path="/int/en/intelligent-eyewear" element={<IntelligentEyewear />} />
          <Route path="/int/en/services" element={<Services />} />
          <Route path="/int/en/stories" element={<Stories />} />
          <Route path="/int/en/stories/:id" element={<StoryDetail />} />

          {/* Wildcard: Mọi URL không khớp sẽ được chuyển hướng về trang chủ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      {/* Floating Action Button (Nút nổi chuyển đổi nhanh chế độ xem của Admin) */}
      {isAdmin && (
        <div className="fixed bottom-6 right-6 z-[9999]">
          {isAdminPage ? (
            <Link
              to="/"
              className="bg-black hover:bg-gray-800 text-white text-[10px] font-bold tracking-[0.25em] uppercase px-5 py-3 shadow-2xl transition-all border border-gray-800 flex items-center gap-2.5 rounded-none"
            >
              <Eye size={13} /> Switch to User View
            </Link>
          ) : (
            <Link
              to="/admin"
              className="bg-black hover:bg-gray-800 text-white text-[10px] font-bold tracking-[0.25em] uppercase px-5 py-3 shadow-2xl transition-all border border-gray-800 flex items-center gap-2.5 rounded-none"
            >
              <SlidersHorizontal size={13} /> Switch to Admin View
            </Link>
          )}
        </div>
      )}
      <ScrollToTopButton />
    </>
  );
}

function App() {
  return (
    <PrivyProvider
      appId="cl7ydg25e00003b5xp9r4g93z" // Sandbox App ID của Privy (Chạy thử nghiệm lập tức)
      config={{
        loginMethods: ["email", "google"],
        appearance: {
          theme: "light",
          accentColor: "#000000",
          showWalletLoginFirst: false,
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets", // Tự tạo ví Web3 nhúng khi người dùng login
        },
      }}
    >
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </AuthProvider>
    </PrivyProvider>
  );
}

export default App;