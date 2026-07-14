/**
 * Header Component - Thanh điều hướng đầu trang (Navigation Bar).
 * - useState: Quản lý đóng/mở menu di động, trạng thái cuộn chuột, và mở sidebar.
 * - useEffect: Lắng nghe scroll để tự động chuyển từ trong suốt sang nền đặc.
 * - useLocation: Nhận diện trang hiện tại để bật/tắt trong suốt cho Header.
 */
import { useState, useEffect, useContext, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import AuthSidebar from "./AuthSidebar";
import CartOverlay from "./CartOverlay";
import SearchDrawer from "./SearchDrawer";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useLenis } from "lenis/react";

const Header = ({ forceSolid = false, forceTransparent = false }) => {
  const { cartCount } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  // === STATE MANAGEMENT (Quản lý trạng thái nội bộ bằng useState) ===
  const [isOpen, setIsOpen] = useState(false);           // Trạng thái đóng/mở menu toàn màn hình trên Mobile
  const [isScrolled, setIsScrolled] = useState(false);   // Trạng thái người dùng đã cuộn trang xuống > 50px chưa
  const [isAuthOpen, setIsAuthOpen] = useState(false);    // Trạng thái đóng/mở sidebar Đăng nhập
  const [isCartOpen, setIsCartOpen] = useState(false);    // Trạng thái đóng/mở Shopping Bag Overlay
  const [cartActiveTab, setCartActiveTab] = useState("BAG"); // Tab mặc định khi mở giỏ hàng
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Trạng thái đóng/mở thanh tìm kiếm (Search Drawer)
  const [expandedItem, setExpandedItem] = useState(null); // Trạng thái mở rộng menu con trên Mobile
  const [showHeader, setShowHeader] = useState(true);
  const progressBarRef = useRef(null);
  const showHeaderRef = useRef(true);

  // Helper tắt toàn bộ overlay cùng một lúc tránh chồng chéo giao diện
  const closeAllDrawers = () => {
    setIsOpen(false);
    setIsCartOpen(false);
    setIsSearchOpen(false);
    setIsAuthOpen(false);
  };

  const lenis = useLenis((lenisInstance) => {
    // Cập nhật tiến độ cuộn qua DOM trực tiếp để tránh React Re-render liên tục gây giật lag
    if (progressBarRef.current) {
      progressBarRef.current.style.transform = `scaleX(${lenisInstance.progress})`;
    }
    
    // Ẩn/hiện Header dựa trên hướng cuộn (chỉ gọi set state khi có sự thay đổi thật sự)
    const currentScroll = lenisInstance.scroll;
    const direction = lenisInstance.direction; // 1 = xuống, -1 = lên
    
    if (currentScroll > 100) {
      if (direction === 1 && showHeaderRef.current) {
        showHeaderRef.current = false;
        setShowHeader(false);
      } else if (direction === -1 && !showHeaderRef.current) {
        showHeaderRef.current = true;
        setShowHeader(true);
      }
    } else if (!showHeaderRef.current) {
      showHeaderRef.current = true;
      setShowHeader(true);
    }
  });

  // Tự động dừng/khởi động cuộn mượt Lenis khi mở các Drawer/Overlay để tránh lỗi double scroll
  useEffect(() => {
    if (!lenis) return;
    if (isCartOpen || isSearchOpen || isOpen || isAuthOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [isCartOpen, isSearchOpen, isOpen, isAuthOpen, lenis]);

  // === REACT ROUTER: useLocation ===
  // Hook này trả về object chứa thông tin URL hiện tại, trong đó pathname là phần đường dẫn (VD: "/", "/sunglasses", "/intelligent-eyewear").
  // Mỗi khi người dùng chuyển trang, useLocation sẽ re-render component này với pathname mới.
  const location = useLocation();

  // === LOGIC XÁC ĐỊNH NỀN HEADER ===
  // Trang chủ ("/"), Intelligent Eyewear, và Services có thiết kế nền video/ảnh full-screen,
  // nên Header cần trong suốt ban đầu để không che mất nội dung.
  const isTransparentPage =
    location.pathname === "/" ||
    location.pathname.includes("intelligent-eyewear") ||
    location.pathname.includes("services") ||
    location.pathname.includes("stories");

  // Quyết định cuối cùng: Header có nền đặc (solid) hay trong suốt?
  // - forceSolid: Props cha ép nền đặc (trang Category).
  // - isScrolled: Người dùng cuộn xuống → hiện nền để đọc menu dễ hơn.
  // - isOpen: Menu mobile đang mở → cần nền đặc.
  // - !isTransparentPage: Các trang khác (Sunglasses, Glasses) mặc định nền đặc.
  const isSolid = forceSolid || isScrolled || isOpen || !isTransparentPage;

  // === DỮ LIỆU MENU ĐIỀU HƯỚNG (Static Data) ===
  // Object với key là tên mục chính, value là mảng các mục con (sub-menu).
  // Mảng rỗng [] nghĩa là mục đó không có dropdown (VD: "Intelligent Eyewear").
  const menuData = {
    "Sunglasses": [
      "View all", "Veggie Collection", "Bestselling", "2026 Collection",
      "Circuit Collection", "BOLD Collection", "Tinted Lenses", "Gifts"
    ],
    "Glasses": [
      "View all", "Veggie Collection", "Bestselling", "2026 Collection",
      "BOLD Collection", "Blue Light Lenses", "Tinted Lenses", "Gifts"
    ],
    "Collections": [
      "Veggie", "Circuit", "2026 Collection", "2025 FALL",
      "2025 BOLD", "Pocket", "Maison Margiela", "2025 Collection",
      "TEKKEN 8", "Mugler"
    ],
    "Intelligent Eyewear": [],
    "Explore": [
      "Stories", "Services"
    ]
  };

  // === VỊ TRÍ DROPDOWN MENU (padding-left tĩnh cho từng mục) ===
  // Vì dropdown được fixed full-width, cần padding-left khác nhau để dropdown con
  // xuất hiện ngay phía dưới mục cha tương ứng trên thanh menu ngang.
  const menuPosition = {
    "Sunglasses": "pl-[40px]",
    "Glasses": "pl-[140px]",
    "Collections": "pl-[220px]",
    "Intelligent Eyewear": "pl-[520px]",
    "Explore": "pl-[505px]",
  };

  // === useEffect: LẮNG NGHE SỰ KIỆN SCROLL ===
  // Kỹ thuật: Đăng ký event listener "scroll" trên window khi component mount,
  // và gỡ bỏ (cleanup) khi component unmount để tránh memory leak.
  // Dependency array [] rỗng = chỉ chạy 1 lần duy nhất sau lần render đầu tiên.
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Ngưỡng 50px trước khi Header đổi màu nền
    };
    
    const handleOpenCart = () => {
      setCartActiveTab("BAG");
      setIsCartOpen(true);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("openCart", handleOpenCart);
    window.addEventListener("triggerOpenCart", handleOpenCart);
    
    return () => {
      window.removeEventListener("scroll", handleScroll); // Cleanup function
      window.removeEventListener("openCart", handleOpenCart);
      window.removeEventListener("triggerOpenCart", handleOpenCart);
    };
  }, []);

  // Tự động đóng các overlay/sidebar khi chuyển trang (route change)
  useEffect(() => {
    setIsCartOpen(false);
    setIsAuthOpen(false);
    setIsOpen(false);
    setIsSearchOpen(false);
    if (progressBarRef.current) {
      progressBarRef.current.style.transform = "scaleX(0)";
    }
  }, [location.pathname, location.search]);

  return (
    // === React Fragment (<>): Bọc nhiều element cùng cấp mà không tạo thẻ DOM thừa ===
    <>
      {/* Scroll Progress Bar - Thanh tiến trình cuộn tối giản 1.5px ở trên cùng */}
      <div 
        ref={progressBarRef}
        className={`fixed top-0 left-0 h-[1.5px] z-[1000] w-full origin-left transition-transform duration-75 ease-out ${
          location.pathname.includes("intelligent-eyewear") ? "bg-white" : "bg-black"
        }`}
        style={{ transform: "scaleX(0)" }}
      />

      <header
        className={`fixed top-0 left-0 w-full z-[999] px-4 py-5 md:px-8 transition-all duration-500 ease-in-out ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        } ${
          isSolid || isOpen
            ? (location.pathname.includes("intelligent-eyewear") ? "bg-black text-white" : "bg-[#f8f8f8] text-black border-b border-gray-100")
            : "bg-transparent text-white"
        }`}
      >
        {/* === BỐ CỤC 3 CỘT: Menu trái | Logo giữa | Icons phải === */}
        <div className="flex items-center justify-between gap-4">

          {/* CỘT TRÁI: Nút hamburger (Mobile) + Menu ngang (Desktop) */}
          <div className="flex-1 flex justify-start items-center">
            
            {/* NÚT HAMBURGER / CLOSE: Chỉ hiện trên Mobile (lg:hidden) */}
            <button
              className="lg:hidden p-1 hover:opacity-70 transition-opacity"
              onClick={() => {
                if (isOpen) {
                  setIsOpen(false);
                } else {
                  closeAllDrawers();
                  setIsOpen(true);
                }
              }}
            >
              {isOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>

            {/* MENU NGANG DESKTOP: Ẩn trên Mobile (hidden lg:flex)
                === KỸ THUẬT CSS GROUP HOVER ===
                - Thẻ cha có class "group", thẻ con dropdown có class "group-hover:visible group-hover:opacity-100".
                - Khi hover chuột vào thẻ cha, Tailwind CSS tự động kích hoạt các class trên thẻ con.
                - Hoàn toàn không cần JavaScript để xử lý hover, giúp giảm re-render React không cần thiết.
            */}
            <nav className="hidden lg:flex gap-6 xl:gap-8 text-sm font-medium tracking-wide whitespace-nowrap">
              {Object.keys(menuData).map((item) => (
                <div key={item} className="group py-2">
                  
                  {/* Link mục chính: Điều hướng bằng React Router <Link> thay vì <a> để tránh tải lại trang (SPA behavior) */}
                  <Link
                    to={
                      item === "Sunglasses" || item === "Glasses" ? `/${item.toLowerCase()}`
                        : item === "Intelligent Eyewear" ? "/intelligent-eyewear"
                        : "#"
                    }
                    className="hover:opacity-70 transition-opacity cursor-pointer"
                  >
                    {item}
                  </Link>

                  {/* DROPDOWN SUB-MENU: Chỉ render nếu mục có sub-items (Conditional Rendering) */}
                  {menuData[item].length > 0 && (
                    <div
                      className={`fixed left-0 top-[50px] w-full h-fit
                        opacity-0 invisible group-hover:opacity-100 group-hover:visible
                        transition-all duration-300 flex flex-col gap-4 pt-4 pb-4
                        ${menuPosition[item]} z-[999]
                        ${
                          isSolid
                            ? (location.pathname.includes("intelligent-eyewear") ? "bg-black text-white" : "bg-[#f8f8f8] text-black")
                            : "bg-transparent text-white font-bold"
                        }`}
                    >
                      {menuData[item].map((subItem) => (
                        <Link
                          key={subItem}
                          to={
                            item === "Explore" && subItem === "Services"
                              ? "/int/en/services"
                              : item === "Explore" && subItem === "Stories"
                              ? "/int/en/stories"
                              : item === "Sunglasses" || item === "Glasses"
                              ? `/${item.toLowerCase()}?category=${encodeURIComponent(subItem)}`
                              : item === "Collections" && subItem === "Veggie"
                              ? "/stories/850266286345551416"
                              : item === "Collections" && subItem === "Circuit"
                              ? "/stories/817695100293913422"
                              : "#"
                          }
                          className="text-[12px] hover:opacity-60 transition-opacity font-normal tracking-wide"
                        >
                          {subItem}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* CỘT GIỮA: Logo thương hiệu */}
          <div className="flex-none text-center">
            <Link to="/" className="font-serif text-xl md:text-2xl lg:text-3xl font-bold tracking-[0.15em] whitespace-nowrap inline-block">
              GENTLE MONSTER
            </Link>
          </div>

          {/* CỘT PHẢI: Các nút tiện ích (Search, User, Cart) */}
          <div className="flex-1 flex justify-end items-center gap-4 md:gap-6">
            {user && user.role === "admin" && (
              <Link
                to="/admin"
                className="text-[9px] font-bold tracking-[0.25em] bg-black text-white px-3 py-1 uppercase rounded-none hover:bg-gray-800 transition-colors cursor-pointer mr-1"
              >
                Admin Panel
              </Link>
            )}
            <button 
              onClick={() => { closeAllDrawers(); setIsSearchOpen(true); }}
              className="hover:opacity-70 transition-opacity"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            {/* Nút User: Bấm chuyển sang /account nếu đã đăng nhập, hoặc mở sidebar đăng nhập nếu chưa */}
            <button
              onClick={() => {
                if (user) {
                  navigate("/account");
                } else {
                  closeAllDrawers();
                  setIsAuthOpen(true);
                }
              }}
              className="hidden sm:flex items-center gap-1.5 hover:opacity-70 transition-opacity"
            >
              <User size={20} strokeWidth={1.5} />
              {user && (
                <span className="text-[11px] font-semibold lowercase max-md:hidden">
                  {user.firstName}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                closeAllDrawers();
                setCartActiveTab("BAG");
                setIsCartOpen(true);
              }}
              className="hover:opacity-70 transition-opacity flex items-center gap-1.5 text-xs tracking-wider"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="text-[11px] font-semibold lowercase max-md:hidden">bag ({cartCount})</span>
            </button>
          </div>
        </div>

      </header>

      {/* === MENU TOÀN MÀN HÌNH MOBILE (Slide Down List Animation) === */}
      <div 
        className={`fixed left-0 w-full bg-[#f8f8f8] text-black z-[998] overflow-y-auto transition-all duration-500 ease-out origin-top border-t border-gray-100 ${
          isOpen 
            ? "top-[64px] md:top-[80px] h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] opacity-100 scale-y-100" 
            : "top-[64px] md:top-[80px] h-0 opacity-0 scale-y-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col px-6 py-6 space-y-4 text-base font-normal pb-24 text-left">
          {Object.keys(menuData).map((item) => {
            const hasSubItems = menuData[item].length > 0;
            const isExpanded = expandedItem === item;

            return (
              <div key={item} className="border-b border-gray-100 pb-3">
                {hasSubItems ? (
                  <div>
                    {/* Tiêu đề menu cha dạng Accordion */}
                    <button
                      onClick={() => setExpandedItem(isExpanded ? null : item)}
                      className="w-full flex justify-between items-center text-left py-1 text-black font-semibold text-[15px] tracking-widest uppercase hover:text-gray-500 transition-colors"
                    >
                      <span>{item}</span>
                      <span className="text-[12px] text-gray-400 font-light">
                        {isExpanded ? "▲" : "▼"}
                      </span>
                    </button>
                    
                    {/* Danh sách menu con khi được mở rộng */}
                    {isExpanded && (
                      <div className="flex flex-col gap-3 pl-4 pt-3 pb-1 text-[13px] font-normal text-gray-600 tracking-wider">
                        {menuData[item].map((subItem) => (
                          <Link
                            key={subItem}
                            to={
                              item === "Explore" && subItem === "Services"
                                ? "/int/en/services"
                                : item === "Explore" && subItem === "Stories"
                                ? "/int/en/stories"
                                : item === "Sunglasses" || item === "Glasses"
                                ? `/${item.toLowerCase()}?category=${encodeURIComponent(subItem)}`
                                : item === "Collections" && subItem === "Veggie"
                                ? "/stories/850266286345551416"
                                : item === "Collections" && subItem === "Circuit"
                                ? "/stories/817695100293913422"
                                : "#"
                            }
                            onClick={() => {
                              setIsOpen(false);
                              setExpandedItem(null);
                            }}
                            className="hover:text-black py-1 block"
                          >
                            {subItem}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Menu không có mục con (ví dụ: Intelligent Eyewear) */
                  <Link
                    to={item === "Intelligent Eyewear" ? "/intelligent-eyewear" : "#"}
                    onClick={() => {
                      setIsOpen(false);
                      setExpandedItem(null);
                    }}
                    className="block py-1 text-black font-semibold text-[15px] tracking-widest uppercase hover:text-gray-500 transition-colors"
                  >
                    {item}
                  </Link>
                )}
              </div>
            );
          })}

          {/* Menu phụ ở dưới cùng của Mobile Menu (khớp 100% Mockup hình 2) */}
          <div className="pt-8 space-y-6 text-left border-t border-gray-200 mt-10">
            <div className="flex flex-col gap-4 text-[11px] font-bold tracking-[0.2em] uppercase text-black">
              {user ? (
                <Link to="/account" onClick={() => setIsOpen(false)} className="hover:opacity-60 transition-opacity">
                  My Account
                </Link>
              ) : (
                <button onClick={() => { closeAllDrawers(); setIsAuthOpen(true); }} className="text-left uppercase hover:opacity-60 transition-opacity font-bold">
                  Login / Create Account
                </button>
              )}
              <Link to="/account" onClick={() => setIsOpen(false)} className="hover:opacity-60 transition-opacity">
                Track My Order
              </Link>
            </div>
            
            <div className="pt-6 border-t border-gray-100">
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-black">
                Wishlist
              </span>
              <p className="text-[10px] text-gray-400 mt-2 tracking-wider">
                You have nothing in your wishlist, yet.
              </p>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <Link to="/services" onClick={() => setIsOpen(false)} className="text-[11px] font-bold tracking-[0.2em] uppercase text-black hover:opacity-60 transition-opacity">
                Customer Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* === COMPONENT CON: AuthSidebar ===
          Kỹ thuật Component Composition: Header quản lý trạng thái isAuthOpen,
          rồi truyền xuống AuthSidebar qua props. AuthSidebar gọi onClose callback
          để yêu cầu Header đóng nó lại (One-way Data Flow — luồng dữ liệu 1 chiều).
      */}
      <AuthSidebar isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <CartOverlay isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} initialTab={cartActiveTab} />
      <SearchDrawer isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;