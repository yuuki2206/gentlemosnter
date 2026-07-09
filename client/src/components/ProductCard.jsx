/**
 * ProductCard Component — Thẻ sản phẩm đơn lẻ (có nút chuyển đổi Product View / Model View).
 * Dùng trên trang chủ trong slider "Best This Week".
 *
 * === KIẾN THỨC REACT SỬ DỤNG ===
 * 1. useState: Quản lý 3 trạng thái:
 *    - viewMode ("product" | "model"): Chế độ xem hiện tại.
 *    - isHovered: Có đang hover chuột lên thẻ hay không.
 *    - activeThumb: Ảnh thumbnail nào đang được hover (để preview nhanh góc chụp khác).
 * 2. Conditional Rendering: Dùng toán tử && và ternary (? :) để hiển thị video hoặc ảnh tùy theo loại media.
 * 3. Derived State (Trạng thái phái sinh): `mediaUrl` và `isVideo` không phải state, mà được tính toán
 *    trực tiếp từ state khác (viewMode, activeThumb) mỗi lần render. Đây là best practice React —
 *    chỉ lưu state tối thiểu cần thiết, phần còn lại tính toán khi render.
 * 4. Event Handlers: onMouseEnter/onMouseLeave trên thẻ cha để quản lý hover state.
 * 5. Array Methods: .find() để tìm ảnh phù hợp, .filter() để lọc thumbnails, .slice() để giới hạn số lượng.
 *
 * @param {Object} item - Dữ liệu sản phẩm (name, price, sku, thumbnail, gallery, url...)
 * @param {Boolean} hideModelView - Ẩn nút chuyển đổi Model/Product View (mặc định: false)
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { handleImageError } from "../config/media";

const ProductCard = ({ item, hideModelView = false }) => {
  const [viewMode, setViewMode] = useState("product");
  const [isHovered, setIsHovered] = useState(false);
  const [activeThumb, setActiveThumb] = useState(null);

  /**
   * Trích xuất đường dẫn ảnh người mẫu đeo kính từ data sản phẩm.
   * === THỨ TỰ ƯU TIÊN ===
   * 1. Ảnh người mẫu thật (POSTER/LOOK_BOOK) → luôn ưu tiên cao nhất cho Model View.
   * 2. Video sản phẩm xoay (.mp4) → chỉ dùng khi không có ảnh mẫu.
   * 3. Ảnh mặc định đầu tiên → fallback cuối cùng.
   */
  const getModelMedia = (item) => {
    const poster = item.gallery?.find(g => g.includes("POSTER") || g.includes("LOOK_BOOK"));
    if (poster) return poster;
    if (item.thumbnail && item.thumbnail.toLowerCase().endsWith(".mp4")) return item.thumbnail;
    return item.image || item.gallery?.[0];
  };

  /**
   * Trích xuất đường dẫn ảnh sản phẩm gốc (không có người đeo).
   * === LOGIC LỌC ===
   * - Ưu tiên ảnh góc chính diện (chứa "FRONT").
   * - Loại bỏ ảnh bao bì/túi đựng kính (chứa mã "S11500904").
   * - Loại bỏ ảnh người mẫu (chứa "POSTER").
   */
  const getProductMedia = (item) => {
    const front = item.gallery?.find(g => g.includes("FRONT") && !g.includes("POSTER") && !g.includes("S11500904"));
    if (front) return front;
    if (item.thumbnail && !item.thumbnail.toLowerCase().endsWith(".mp4") && !item.thumbnail.includes("S11500904")) return item.thumbnail;
    return item.gallery?.find(g => !g.includes("S11500904")) || item.image;
  };

  // === DERIVED STATE (Tính toán dựa trên state hiện tại, không cần useState riêng) ===
  let mediaUrl = "";
  let isVideo = false;

  if (viewMode === "model") {
    mediaUrl = getModelMedia(item);
  } else {
    // Nếu có activeThumb (đang hover lên thumbnail nhỏ) → hiển thị ảnh đó; nếu không → dùng ảnh mặc định.
    mediaUrl = activeThumb || getProductMedia(item);
  }

  if (mediaUrl?.toLowerCase().endsWith(".mp4")) {
    isVideo = true;
  }

  // Lọc danh sách thumbnail để hiển thị bên phải: Chỉ giữ ảnh tĩnh, loại bỏ video/packaging/poster.
  const productThumbs = item.gallery?.filter(g =>
    !g.toLowerCase().endsWith(".mp4") &&
    !g.includes("POSTER") &&
    !g.includes("LOOK_BOOK") &&
    !g.includes("S11500904")
  ) || [];

  return (
    <div
      className="relative group w-full flex flex-col pb-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setActiveThumb(null); }}
    >
      {/* KHUNG ẢNH/VIDEO SẢN PHẨM
          === RESPONSIVE ===
          - aspect-square: Tỉ lệ 1:1 trên Mobile (nhỏ gọn hơn).
          - md:aspect-[4/3]: Tỉ lệ 4:3 trên Desktop (rộng hơn, hiển thị đẹp hơn).
          - group-hover:scale-105: Zoom nhẹ 5% khi hover chuột vào thẻ cha (tạo cảm giác động).
      */}
      <Link to={`/shop/${item.sku}`} className="block w-full aspect-square md:aspect-[4/3] flex justify-center items-center overflow-hidden mb-4 md:mb-8 bg-[#f4f4f4] relative">
        {/* Conditional Rendering: Hiển thị <video> hoặc <img> tùy theo loại media */}
        {isVideo ? (
          <video
            autoPlay loop muted playsInline
            className={`w-full h-full object-cover object-center ${viewMode === "product" ? "object-contain w-[80%]" : ""}`}
          >
            <source src={mediaUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={mediaUrl}
            alt={item.name}
            className={`transition-transform duration-700 group-hover:scale-105 ${viewMode === "product" ? "w-[80%] h-auto object-contain" : "w-full h-full object-cover"}`}
            onError={handleImageError}
          />
        )}
      </Link>

      {/* THÔNG TIN SẢN PHẨM + CÁC CONTROLS (Thumbnail + Toggle View)
          === KỸ THUẬT ABSOLUTE POSITIONING ===
          Dùng position: relative trên thẻ cha + absolute trên 2 thẻ con (trái và phải)
          để đặt chúng cùng hàng mà không ảnh hưởng đến nhau khi nội dung thay đổi chiều cao.
      */}
      <div className="flex justify-between items-start w-full relative h-[60px]">

        {/* BÊN TRÁI: Tên sản phẩm + Giá + Nút Add to Wishlist */}
        <div className="text-[9px] md:text-[10px] tracking-wider uppercase text-left flex flex-col absolute top-0 left-0">
          <p className="font-medium text-black">{item.name}</p>
          <p className="mt-[2px] text-gray-500 font-medium">£ {item.price}</p>

          {/* Nút Wishlist: Ẩn mặc định (opacity-0), hiện khi hover (opacity-100) */}
          <div className={`mt-3 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}>
            <span className="inline-block border-b border-black pb-[1px] hover:opacity-60 transition-opacity font-medium cursor-pointer">
              ADD TO WISHLIST
            </span>
          </div>
        </div>

        {/* BÊN PHẢI: Dãy Thumbnail preview + Nút chuyển đổi View Mode */}
        <div className={`flex flex-row items-center gap-4 transition-opacity duration-300 absolute top-0 right-0 ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}>

          {/* THUMBNAIL PREVIEW: Chỉ hiện ở chế độ Product View và trên Desktop (hidden lg:flex).
              Hover lên từng thumbnail nhỏ sẽ set activeThumb để preview ảnh góc chụp đó ngay lập tức.
              Kỹ thuật: onMouseEnter → setActiveThumb(thumb) → re-render → ảnh chính thay đổi.
          */}
          {viewMode === "product" && productThumbs.length > 0 && (
            <div className="hidden lg:flex flex-row gap-1">
              {productThumbs.slice(0, 8).map((thumb, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveThumb(thumb)}
                  className="w-[20px] h-[25px] md:w-[25px] md:h-[35px] cursor-pointer opacity-40 hover:opacity-100 transition-opacity bg-white/50"
                >
                  <img src={thumb} alt="angle" className="w-full h-full object-contain" onError={handleImageError} />
                </div>
              ))}
            </div>
          )}

          {/* NÚT TOGGLE VIEW MODE: Chuyển đổi giữa "MODEL VIEW" và "PRODUCT VIEW".
              Kỹ thuật: Functional setState — setViewMode(prev => ...) đảm bảo lấy đúng giá trị trước đó,
              an toàn hơn so với setViewMode(viewMode === ...) khi có nhiều setState liên tiếp.
          */}
          {!hideModelView && (
            <button
              onClick={() => {
                setViewMode(prev => prev === "model" ? "product" : "model");
                setActiveThumb(null); // Reset preview thumbnail khi đổi chế độ xem
              }}
              className="text-[9px] md:text-[10px] tracking-widest uppercase font-medium text-black hover:opacity-60 transition-opacity ml-2"
            >
              {viewMode === "model" ? "PRODUCT VIEW" : "MODEL VIEW"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
