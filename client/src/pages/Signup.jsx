/**
 * Signup Page - Trang đăng ký tài khoản toàn màn hình.
 * Thiết kế chuẩn tối giản 100% khớp ảnh chụp mockup Screenshot 3.
 */
import React, { useState, useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Header from "../components/Header";
import { AuthContext } from "../context/AuthContext";

const Signup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  // Lấy email truyền từ Sidebar qua URL query param
  const emailFromUrl = searchParams.get("email") || "";

  // === FORM STATES ===
  const [email, setEmail] = useState(emailFromUrl);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("Vietnam");
  const [phone, setPhone] = useState("");
  const [walletAddress, setWalletAddress] = useState(""); // Lưu địa chỉ ví Ganache nhập thủ công
  const [adminKey, setAdminKey] = useState(""); // Mã bí mật đăng ký Admin
  const [over16, setOver16] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  // States ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Trạng thái lỗi hoặc thành công
  const [error, setError] = useState("");

  // Cập nhật lại email nếu tham số URL thay đổi
  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [emailFromUrl]);

  // Xử lý khi nhấn nút Đăng Ký (Sign Up)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Kiểm tra dữ liệu hợp lệ
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!over16) {
      setError("You must confirm you are over 16 years old.");
      return;
    }

    // Tiến hành đăng ký
    const result = await register({
      email,
      password,
      firstName,
      lastName,
      country,
      phone,
      walletAddress: walletAddress.trim(), // Truyền ví Ganache nếu người dùng nhập
      adminKey: adminKey.trim(), // Truyền mã xác thực Admin
    });

    if (result.success) {
      // Đăng ký thành công, chuyển hướng thẳng vào Dashboard tài khoản
      navigate("/account");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased flex flex-col justify-between">
      {/* Khóa Header ở trạng thái Solid đặc để dễ đọc chữ trên nền trắng */}
      <Header forceSolid={true} />

      {/* ================= THÂN TRANG FORM ĐĂNG KÝ (Khớp Mockup 3) ================= */}
      <main className="flex-grow pt-[120px] pb-20 px-6 flex justify-center items-center">
        <div className="w-full max-w-[500px] text-center">
          
          <h1 className="text-sm font-bold tracking-[0.25em] uppercase text-black mb-2">
            CREATING ACCOUNT
          </h1>
          <p className="text-[11px] text-gray-500 font-light tracking-wide leading-relaxed mb-10">
            Please fill in the fields below to create your account and get access to exclusive services.
          </p>

          {/* Hiển thị thông báo lỗi nếu có */}
          {error && (
            <p className="text-[11px] text-red-500 font-medium tracking-wide mb-6 bg-red-50 py-2.5 px-4 text-left border-l-2 border-red-500">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            
            {/* Trường Email Address (Prefilled & Verify label) */}
            <div className="relative border-b border-gray-200 py-2 flex items-center justify-between">
              <div className="flex-grow">
                <label className="block text-[9px] text-gray-400 uppercase tracking-widest">
                  Email Address*
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-none text-[12px] text-black outline-none font-medium mt-1 focus:ring-0 p-0"
                  required
                />
              </div>
              <button
                type="button"
                className="text-[9px] font-bold tracking-widest text-black hover:opacity-50 transition-opacity"
              >
                VERIFY
              </button>
            </div>

            {/* Trường Password */}
            <div className="relative border-b border-gray-200 py-2 flex items-center justify-between">
              <div className="flex-grow">
                <label className="block text-[9px] text-gray-400 uppercase tracking-widest">
                  Password*
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-transparent border-none text-[12px] text-black outline-none font-medium mt-1 focus:ring-0 p-0 placeholder-gray-300"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
              </button>
            </div>

            {/* Trường Confirm Password */}
            <div className="relative border-b border-gray-200 py-2 flex items-center justify-between">
              <div className="flex-grow">
                <label className="block text-[9px] text-gray-400 uppercase tracking-widest">
                  Confirm Password*
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent border-none text-[12px] text-black outline-none font-medium mt-1 focus:ring-0 p-0"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
              </button>
            </div>

            {/* Trường First Name */}
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

            {/* Trường Last Name */}
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

            {/* Trường Ví Ganache (Không bắt buộc, phục vụ test Web3) */}
            <div className="border-b border-gray-200 py-2">
              <label className="block text-[9px] text-gray-400 uppercase tracking-widest">
                Ganache Wallet Address (Optional for Web3 Demo)
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="e.g. 0x..."
                className="w-full bg-transparent border-none text-[12px] text-black outline-none font-medium mt-1 focus:ring-0 p-0 placeholder-gray-300 font-mono"
              />
            </div>

            {/* Trường Admin Secret Key (Không bắt buộc, nhập 123456789 để test Admin) */}
            <div className="border-b border-gray-200 py-2">
              <label className="block text-[9px] text-gray-400 uppercase tracking-widest">
                Admin Secret Key (Optional - Nhập 123456789 để làm Admin)
              </label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Nhập mã bí mật đăng ký Admin"
                className="w-full bg-transparent border-none text-[12px] text-black outline-none font-medium mt-1 focus:ring-0 p-0 placeholder-gray-300"
              />
            </div>

            {/* Trường Quốc gia (Dropdown) */}
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

            {/* Trường Số điện thoại */}
            <div className="border-b border-gray-200 py-2">
              <label className="block text-[9px] text-gray-400 uppercase tracking-widest">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Optional"
                className="w-full bg-transparent border-none text-[12px] text-black outline-none font-medium mt-1 focus:ring-0 p-0 placeholder-gray-300"
              />
            </div>

            {/* Checkbox điều khoản */}
            <div className="pt-6 space-y-3">
              <p className="text-[10px] text-gray-500 font-light leading-relaxed">
                By continuing, you agree to Gentle Monster's <span className="underline cursor-pointer text-black font-normal">Terms of Use</span>.
              </p>
              
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={over16}
                  onChange={(e) => setOver16(e.target.checked)}
                  className="mt-0.5 border-gray-300 rounded-none text-black focus:ring-black cursor-pointer"
                />
                <span className="text-[10px] text-gray-700 font-light tracking-wide group-hover:text-black transition-colors leading-relaxed">
                  I'm over 16 years old. <span className="text-red-500 font-medium">(Required)</span>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                  className="mt-0.5 border-gray-300 rounded-none text-black focus:ring-black cursor-pointer"
                />
                <span className="text-[10px] text-gray-700 font-light tracking-wide group-hover:text-black transition-colors leading-relaxed">
                  I would like to receive Gentle Monster newsletter. <span className="text-gray-400 font-medium">(Optional)</span>
                </span>
              </label>
            </div>

            {/* Nút bấm Sign Up màu xám (Khớp Mockup 3) */}
            <button
              type="submit"
              className="w-full py-4 mt-8 bg-gray-500 hover:bg-black text-white text-[11px] font-bold tracking-[0.2em] uppercase rounded-none transition-colors duration-300"
            >
              SIGN UP
            </button>
          </form>
          
        </div>
      </main>

      {/* ================= CHÂN TRANG FOOTER TỐI GIẢN ================= */}
      <footer className="border-t border-gray-100 py-6 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-400 tracking-wider uppercase font-light">
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

export default Signup;
