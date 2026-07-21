/**
 * Account Component - Trang Dashboard quản lý tài khoản của người dùng.
 * Thiết kế chuẩn tối giản 100% khớp ảnh chụp mockup Screenshot 4 và 5.
 */
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { Trash2, ShoppingBag } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";

const Account = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, users, logout, updateProfile, deleteAccount, adminDeleteUser } = useContext(AuthContext);
  const { wishlist, removeFromWishlist, addToCart } = useContext(CartContext);
  const { logout: privyLogout } = usePrivy();

  const [activeTab, setActiveTab] = useState("Account");

  // === FORM STATES CHO EDIT PROFILE ===
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("Vietnam");
  const [phone, setPhone] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Bảo vệ route: Chỉ chuyển hướng khi đã tải xong trạng thái xác thực và KHÔNG có user
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/");
      } else {
        // Prefill dữ liệu khi có user
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setCountry(user.country || "Vietnam");
        setPhone(user.phone || "");
      }
    }
  }, [user, authLoading, navigate]);

  if (authLoading || !user) return null;

  // Xử lý lưu thay đổi thông tin cá nhân
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveSuccess(false);
    const result = await updateProfile({
      firstName,
      lastName,
      country,
      phone,
    });
    if (result?.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  // Xử lý xóa tài khoản
  const handleDelete = () => {
    const confirm = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone."
    );
    if (confirm) {
      deleteAccount();
      navigate("/");
    }
  };

  // Lấy lịch sử giao dịch thật từ tài khoản người dùng
  const purchases = user.purchases || [];

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased flex flex-col justify-between">
      <Header forceSolid={true} />

      {/* ================= THÂN TRANG ACCOUNT DASHBOARD ================= */}
      <main className="flex-grow pt-[120px] pb-24 px-6 md:px-12 w-full max-w-6xl mx-auto">
        
        {/* ================= SUB-MENU TABS & NÚT LOGOUT (Khớp Mockup 4) ================= */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-12">
          {/* Tabs bên trái */}
          <div className="flex gap-2 flex-wrap">
            {["Account", "Purchases", "Wishlist", "Profile", "Users Manager"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSaveSuccess(false);
                }}
                className={`text-[11px] font-semibold tracking-widest uppercase transition-all duration-300 rounded-full px-5 py-1.5 ${
                  activeTab === tab
                    ? "border border-gray-200 bg-[#f3f3f3] text-black"
                    : "text-gray-400 hover:text-black border border-transparent"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Nút đăng xuất bên phải */}
          <button
            onClick={() => {
              logout();
              privyLogout();
              navigate("/");
            }}
            className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 hover:text-black transition-colors duration-300"
          >
            LOGOUT
          </button>
        </div>

        {/* ================= TAB 1: OVERVIEW (Account Tab) - Khớp Mockup 4 ================= */}
        {activeTab === "Account" && (
          <div className="text-center w-full max-w-[600px] mx-auto space-y-16">
            
            {/* Lời chào chào đón */}
            <h1 className="text-sm font-bold tracking-[0.25em] uppercase text-black mt-6">
              HELLO, {(user.firstName || user.name || user.email || "USER").toUpperCase()}
            </h1>

            {/* Mục: Recent Purchases */}
            <div className="text-left space-y-4">
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 border-b border-gray-100 pb-2">
                RECENT PURCHASES
              </h3>
              {purchases.length === 0 ? (
                <p className="text-[11px] text-gray-500 font-light tracking-wide py-4">
                  You have no purchase history.
                </p>
              ) : (
                <div className="space-y-4 py-2">
                  {purchases.slice(0, 1).map((purchase) => (
                    <div key={purchase.id || purchase._id || Math.random()} className="border border-gray-100 p-4 text-[11px] bg-[#fdfdfd]">
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-3">
                        <span className="font-semibold text-black">{purchase.id || purchase.orderId || purchase._id} - {purchase.date || "Today"}</span>
                        <span className="text-blue-600 font-bold uppercase tracking-wider text-[9px]">{purchase.type || "Web3"} Payment</span>
                      </div>
                      <div className="space-y-2">
                        {(purchase.items || []).map((item, idx) => (
                          <div key={item.sku || idx} className="flex justify-between items-center text-[10px] text-gray-600">
                            <span>{item.name || "Gentle Monster Frame"} x{item.quantity || 1}</span>
                            <span>₫ {Number((item.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-gray-100 pt-2 mt-3 flex justify-between font-semibold text-[11px]">
                        <span>TOTAL</span>
                        <span className="text-blue-600">
                          {purchase.ethTotal ? `${purchase.ethTotal} ETH` : `₫ ${Number(purchase.total || 0).toLocaleString()}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mục: Wishlist */}
            <div className="text-left space-y-4">
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 border-b border-gray-100 pb-2">
                WISHLIST
              </h3>
              {wishlist.length === 0 ? (
                <p className="text-[11px] text-gray-500 font-light tracking-wide py-4">
                  You have nothing in your wishlist, yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-2">
                  {wishlist.slice(0, 2).map((item) => (
                    <div key={item.sku} className="flex gap-4 items-center bg-[#fcfcfc] p-3 border border-gray-100">
                      <img src={item.thumbnail} alt={item.name} className="w-16 h-12 object-contain bg-[#f4f4f4]" />
                      <div className="flex-grow min-w-0">
                        <h4 className="text-[11px] font-semibold tracking-wider text-black truncate">{item.name}</h4>
                        <p className="text-[10px] text-gray-600 mt-0.5">₫ {Number(item.price || 0).toLocaleString("en-US")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mục: Profile Overview */}
            <div className="text-left space-y-4">
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 border-b border-gray-100 pb-2">
                PROFILE
              </h3>
              <div className="text-[11px] text-black font-light tracking-wide space-y-1 py-2">
                <p className="font-semibold text-black">{user.firstName || user.name || "Customer"} {user.lastName || ""}</p>
                <p className="text-gray-500">{user.email}</p>
                {user.phone && <p className="text-gray-500">{user.phone}</p>}
                <p className="text-gray-500">{user.country || "Vietnam"}</p>
                
                {/* ĐỊA CHỈ VÍ WEB3 NHÚNG TỰ ĐỘNG TẠO QUA GOOGLE LOGIN */}
                {user.walletAddress ? (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-100 text-left">
                    <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Embedded Web3 Wallet</p>
                    <p className="text-[10px] font-mono text-blue-800 mt-1 break-all select-all cursor-pointer font-semibold" title="Nhấp đúp chuột để copy">
                      {user.walletAddress}
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 p-3 bg-gray-50 border border-gray-100 text-left">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Web3 Wallet Status</p>
                    <p className="text-[10px] text-gray-500 mt-1 font-light leading-relaxed">
                      No embedded wallet linked. Connect with Google in Sidebar to generate an on-chain Web3 wallet automatically.
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setActiveTab("Profile")}
                className="w-full py-4 border border-black hover:bg-black hover:text-white text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300"
              >
                EDIT PROFILE
              </button>
            </div>
            
          </div>
        )}

        {/* ================= TAB 2: PURCHASES (Chi tiết đơn hàng/Hóa đơn) ================= */}
        {activeTab === "Purchases" && (
          <div className="w-full max-w-[700px] mx-auto text-left">
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-black mb-6 border-b border-gray-100 pb-2">
              PURCHASE HISTORY
            </h2>
            {purchases.length === 0 ? (
              <div className="py-12 text-center text-gray-500 font-light text-[11px]">
                You have no purchase history yet. When you complete a transaction, it will be catalogued here.
              </div>
            ) : (
              <div className="space-y-6">
                {purchases.map((purchase) => (
                  <div key={purchase.id} className="border border-gray-200 p-6 text-[11px] space-y-4 bg-white">
                    {/* Hóa đơn Header */}
                    <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                      <div>
                        <p className="text-[12px] font-bold text-black">{purchase.id}</p>
                        <p className="text-[10px] text-gray-400 mt-1">Date: {purchase.date}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-100 rounded-none font-bold uppercase text-[9px] tracking-wider">
                          {purchase.status}
                        </span>
                        <p className="text-[9px] text-blue-600 font-bold uppercase tracking-widest mt-1.5">{purchase.type} Payment</p>
                      </div>
                    </div>

                    {/* Danh sách kính trong đơn */}
                    <div className="space-y-3">
                      {purchase.items.map((item) => (
                        <div key={item.sku} className="flex gap-4 items-center justify-between py-1 border-b border-gray-50">
                          <img src={item.thumbnail} alt={item.name} className="w-12 h-9 object-contain bg-[#f4f4f4]" />
                          <div className="flex-grow text-left">
                            <p className="font-semibold text-black">{item.name}</p>
                            <p className="text-[9px] text-gray-400">SKU: {item.sku} | Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium text-black">₫ {Number(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>

                    {/* Thông tin Blockchain (nếu thanh toán Web3) */}
                    {purchase.txHash && (
                      <div className="p-3 bg-blue-50 border border-blue-100 font-mono text-[9px] text-left">
                        <p className="font-bold text-blue-600 uppercase tracking-widest mb-1 font-sans">Blockchain Tx Hash</p>
                        <p className="text-blue-850 break-all select-all cursor-pointer" title="Double click to copy">
                          {purchase.txHash}
                        </p>
                      </div>
                    )}

                    {/* Tổng cộng */}
                    <div className="flex justify-between items-center bg-gray-50 p-4 font-semibold text-[11px]">
                      <span>ORDER TOTAL</span>
                      <div className="text-right">
                        <p className="text-black">₫ {purchase.total.toLocaleString()}</p>
                        {purchase.ethTotal && (
                          <p className="text-blue-600 text-[10px] mt-0.5">{purchase.ethTotal} ETH</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: WISHLIST DETAILED ================= */}
        {activeTab === "Wishlist" && (
          <div className="w-full max-w-[700px] mx-auto text-left">
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-black mb-6 border-b border-gray-100 pb-2">
              MY WISHLIST
            </h2>
            {wishlist.length === 0 ? (
              <div className="py-12 text-center text-gray-500 font-light text-[11px]">
                You have nothing in your wishlist, yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {wishlist.map((item) => (
                  <div key={item.sku} className="flex gap-4 border border-gray-100 p-4 items-center justify-between">
                    <img src={item.thumbnail} alt={item.name} className="w-20 h-15 object-contain bg-[#f4f4f4]" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold tracking-wider truncate text-black">{item.name}</h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">SKU: {item.sku}</p>
                      <p className="text-xs text-gray-700 mt-2">₫ {Number(item.price).toLocaleString("en-US")}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          addToCart(item);
                          removeFromWishlist(item.sku);
                        }}
                        className="px-3 py-1.5 bg-black text-white text-[9px] font-bold tracking-wider uppercase hover:bg-gray-800"
                      >
                        ADD TO BAG
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.sku)}
                        className="text-[9px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-wider"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: EDIT PROFILE - Khớp Mockup 5 ================= */}
        {activeTab === "Profile" && (
          <div className="text-center w-full max-w-[500px] mx-auto space-y-8">
            <h2 className="text-sm font-bold tracking-[0.25em] uppercase text-black mb-2">
              EDIT PROFILE
            </h2>

            {saveSuccess && (
              <p className="text-[11px] text-green-600 font-medium tracking-wide bg-green-50 py-2.5 px-4 text-left border-l-2 border-green-500">
                Profile updated successfully.
              </p>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-left">
              {/* Email Address (Read-only + EDIT text link) */}
              <div className="relative border-b border-gray-200 py-2 flex items-center justify-between">
                <div className="flex-grow">
                  <label className="block text-[9px] text-gray-400 uppercase tracking-widest">
                    Email Address*
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="w-full bg-transparent border-none text-[12px] text-gray-400 outline-none font-medium mt-1 focus:ring-0 p-0 cursor-not-allowed"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => alert("Email verification cannot be changed directly for security. Please contact customer support.")}
                  className="text-[9px] font-bold tracking-widest text-black hover:opacity-50 transition-opacity"
                >
                  EDIT
                </button>
              </div>

              {/* First Name */}
              <div className="border-b border-gray-200 py-2">
                <label className="block text-[9px] text-gray-400 uppercase tracking-widest">
                  First Name*
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-transparent border-none text-[12px] text-black outline-none font-medium mt-1 focus:ring-0 p-0"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="border-b border-gray-200 py-2">
                <label className="block text-[9px] text-gray-400 uppercase tracking-widest">
                  Last Name*
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-transparent border-none text-[12px] text-black outline-none font-medium mt-1 focus:ring-0 p-0"
                  required
                />
              </div>

              {/* Country dropdown */}
              <div className="border-b border-gray-200 py-2">
                <label className="block text-[9px] text-gray-400 uppercase tracking-widest">
                  Country*
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-transparent border-none text-[12px] text-black outline-none font-medium mt-1 focus:ring-0 p-0 cursor-pointer appearance-none"
                >
                  <option value="Vietnam">Vietnam</option>
                  <option value="United States">United States</option>
                  <option value="Korea">South Korea</option>
                  <option value="Japan">Japan</option>
                </select>
              </div>

              {/* Phone Number */}
              <div className="border-b border-gray-200 py-2">
                <label className="block text-[9px] text-gray-400 uppercase tracking-widest">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent border-none text-[12px] text-black outline-none font-medium mt-1 focus:ring-0 p-0"
                />
              </div>

              {/* Nút bấm SAVE màu xám đặc (Khớp Mockup 5) */}
              <button
                type="submit"
                className="w-full py-4 mt-8 bg-gray-500 hover:bg-black text-white text-[11px] font-bold tracking-[0.2em] uppercase rounded-none transition-colors duration-300"
              >
                SAVE
              </button>

              {/* Nút Delete Account (Khớp Mockup 5) */}
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 hover:text-red-600 transition-colors duration-300 underline"
                >
                  DELETE ACCOUNT
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= TAB 5: USERS MANAGER (Admin console) ================= */}
        {activeTab === "Users Manager" && (
          <div className="w-full text-left max-w-4xl mx-auto space-y-6">
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-black mb-4 border-b border-gray-100 pb-2">
              USERS MANAGER
            </h2>
            <p className="text-[11px] text-gray-500 font-light mb-6 leading-relaxed">
              Bảng điều khiển danh sách tài khoản đã đăng ký trên hệ thống. Dùng để xem thông tin và lấy địa chỉ ví Ganache tương ứng phục vụ chạy thử nghiệm.
            </p>

            <div className="overflow-x-auto border border-gray-100 bg-[#fefefe]">
              <table className="w-full border-collapse text-[11px] text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[9px]">
                    <th className="px-6 py-4">Họ và Tên</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Quốc gia</th>
                    <th className="px-6 py-4">Ganache Wallet Address</th>
                    <th className="px-6 py-4 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u.email} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-black">
                        {u.firstName} {u.lastName}
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{u.email}</td>
                      <td className="px-6 py-4 text-gray-500">{u.country}</td>
                      <td className="px-6 py-4">
                        {u.walletAddress ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-blue-800 bg-blue-50 border border-blue-100 px-2.5 py-1 text-[10px] break-all select-all font-semibold">
                              {u.walletAddress}
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(u.walletAddress);
                                alert(`Đã copy địa chỉ ví: ${u.walletAddress}`);
                              }}
                              className="text-[9px] font-bold text-blue-600 hover:underline uppercase tracking-widest flex-shrink-0"
                            >
                              Copy
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">No wallet address</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            if (window.confirm(`Bạn có chắc muốn xóa tài khoản ${u.email}?`)) {
                              adminDeleteUser(u.email);
                              alert("Đã xóa tài khoản khỏi hệ thống.");
                            }
                          }}
                          className="text-[9px] font-bold text-red-500 hover:text-red-700 uppercase tracking-wider transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* Footer tối giản */}
      <footer className="border-t border-gray-100 py-6 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-400 tracking-wider uppercase font-light w-full">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-center">
          <span className="cursor-pointer hover:text-black transition-colors">Contact Us</span>
          <span className="cursor-pointer hover:text-black transition-colors">Customer Service</span>
          <span className="cursor-pointer hover:text-black transition-colors">Store Locator</span>
          <span className="cursor-pointer hover:text-black transition-colors">Legal Notice</span>
          <span className="cursor-pointer hover:text-black transition-colors">Subscribe</span>
          <span className="cursor-pointer hover:text-black transition-colors">Social</span>
          <span className="text-black font-normal underline">Country : Vietnam</span>
        </div>
        <div>
          <span>© 2026 GENTLE MONSTER</span>
        </div>
      </footer>
    </div>
  );
};

export default Account;
