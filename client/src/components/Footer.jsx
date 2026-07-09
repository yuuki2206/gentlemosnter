/**
 * Component chân trang (Footer).
 * Chứa các liên kết chính sách, dịch vụ khách hàng, và phần bản quyền.
 *
 * @param {Boolean} darkMode - Chế độ giao diện tối.
 *                             Nếu true: Nền đen chữ trắng (Dành riêng cho trang Intelligent Eyewear).
 *                             Nếu false: Nền xám nhạt chữ đen (Mặc định).
 */
const Footer = ({ darkMode = false }) => {
  const footerLinks = [
    "Contact Us",
    "Customer Service",
    "Store Locator",
    "Legal Notice",
    "Subscribe",
    "Social",
  ];

  return (
    // Thiết lập padding dọc nhỏ gọn (py-5) và chữ nhỏ (text-[9px] hoặc text-[10px] trên PC) theo đúng tỉ lệ chuẩn của website gốc.
    <footer className={`w-full py-5 px-4 md:px-8 text-[9px] md:text-[10px] font-medium transition-colors duration-300 ${darkMode ? "bg-black text-white" : "bg-[#f8f8f8] text-black"}`}>
      
      {/* Lưới bố cục: Dọc trên mobile và ngang trên PC (lg:flex-row) */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        
        {/* KHU VỰC LIÊN KẾT BÊN TRÁI: Tự động xuống dòng linh hoạt (flex-wrap) trên màn hình nhỏ */}
        <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 md:gap-5">
          {footerLinks.map((link, index) => (
            <a 
              key={index} 
              href="#" 
              className="hover:opacity-60 transition-opacity whitespace-nowrap"
            >
              {link}
            </a>
          ))}
          
          <span className="whitespace-nowrap">
            Country :{" "}
            <a href="#" className="underline hover:opacity-60 transition-opacity">
              Vietnam
            </a>
          </span>
        </div>

        {/* KHU VỰC BẢN QUYỀN BÊN PHẢI */}
        <div className="font-bold tracking-[0.15em] text-center whitespace-nowrap">
          © 2026 GENTLE MONSTER
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;