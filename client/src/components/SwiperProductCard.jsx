import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Bookmark, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { CartContext } from "../context/CartContext";
import { handleImageError } from "../config/media";

// Import CSS của Swiper (bắt buộc để slider hoạt động đúng)
import "swiper/css";
import "swiper/css/navigation";

/**
 * SwiperProductCard Component - Thẻ sản phẩm kèm slider ảnh đổi góc chụp khi rà chuột.
 * - SwiperJS: Thư viện bên thứ ba giúp trượt chuyển đổi hình ảnh mượt mà.
 * - Array Sorting: Tự động sắp xếp đưa Video lên đầu và ảnh bao bì (hộp trắng) xuống cuối.
 * - Event preventDefault: Ngăn bấm nút điều hướng slider bị nhảy link mở trang sản phẩm.
 */
const SwiperProductCard = ({ item }) => {
  const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useContext(CartContext);
  const isWishlisted = wishlist.some((w) => w.sku === item.sku);
  // Gom tất cả ảnh và lọc bỏ những ảnh rỗng
  const rawMediaList = Array.from(new Set([item.thumbnail, ...(item.gallery || [])].filter(Boolean)));

  // Sắp xếp mảng ảnh theo mức độ ưu tiên
  const sortedMediaList = rawMediaList.sort((a, b) => {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    
    const isVideoA = aLower.endsWith(".mp4");
    const isVideoB = bLower.endsWith(".mp4");
    
    const isPackagingA = a.includes("S11500904") || aLower.includes("package");
    const isPackagingB = b.includes("S11500904") || bLower.includes("package");
    
    const isFrontA = a.includes("FRONT");
    const isFrontB = b.includes("FRONT");

    // 1. Packaging luôn bị đẩy xuống cuối cùng
    if (isPackagingA && !isPackagingB) return 1;
    if (!isPackagingA && isPackagingB) return -1;

    // 2. Video luôn được ưu tiên lên đầu tiên
    if (isVideoA && !isVideoB) return -1;
    if (!isVideoA && isVideoB) return 1;

    // 3. Ảnh góc nhìn chính diện (FRONT) được ưu tiên thứ 2 (sau video)
    if (isFrontA && !isFrontB) return -1;
    if (!isFrontA && isFrontB) return 1;

    // Nếu cùng mức độ ưu tiên thì giữ nguyên thứ tự
    return 0;
  });

  const mediaList = sortedMediaList;

  return (
    <Link
      to={`/shop/${item.sku}`}
      data-cursor="view"
      className="group flex flex-col cursor-pointer pb-8"
    >
      {/* 
        KHUNG SWIPER: Chứa slider hình ảnh sản phẩm.
        - aspect-[4/3]: Đảm bảo tỷ lệ khung hình 4:3 đồng nhất.
        - bg-[#f4f4f4]: Màu nền xám nhạt làm nổi bật sản phẩm.
      */}
      <div className="w-full aspect-[4/3] flex justify-center items-center relative mb-2 bg-[#f4f4f4]">
        
        {/* 
          NÚT ĐIỀU HƯỚNG TRÁI/PHẢI
          - Nút được ẩn theo mặc định (opacity-0) và chỉ hiện khi di chuột vào (group-hover:opacity-100).
          - className động theo `item.sku` giúp Swiper xác định đúng nút cho từng thẻ sản phẩm cụ thể
            (Tránh lỗi bấm nút ở thẻ này nhưng ảnh ở thẻ khác lại trượt).
        */}
        <div
          className={`swiper-button-prev-${item.sku} absolute left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 p-2 cursor-pointer`}
          onClick={(e) => e.preventDefault()} // Ngăn chặn sự kiện click link thẻ cha khi bấm nút
        >
          <ChevronLeft size={24} strokeWidth={1} className="text-black" />
        </div>

        <div
          className={`swiper-button-next-${item.sku} absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 p-2 cursor-pointer`}
          onClick={(e) => e.preventDefault()} // Ngăn chặn sự kiện click link thẻ cha
        >
          <ChevronRight size={24} strokeWidth={1} className="text-black" />
        </div>

        {/* 
          SWIPER COMPONENT
          - modules={[Navigation]}: Kích hoạt tính năng bấm nút để trượt ảnh.
          - loop={true}: Trượt vòng tròn (hết ảnh cuối sẽ quay lại ảnh đầu).
        */}
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: `.swiper-button-prev-${item.sku}`,
            nextEl: `.swiper-button-next-${item.sku}`,
          }}
          loop={true}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          {mediaList.map((media, index) => (
            <SwiperSlide
              key={index}
              className="w-full h-full flex justify-center items-center bg-[#f4f4f4]"
            >
              {/* Kiểm tra nếu URL kết thúc bằng .mp4 thì render thẻ <video> thay vì <img> */}
              {media && media.toLowerCase().includes(".mp4") ? (
                <video
                  src={media}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-[100%] h-[100%] object-contain transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <img
                  src={media}
                  alt={`${item.name} góc chụp ${index + 1}`}
                  className="w-[100%] h-[100%] object-contain transition-transform duration-700 group-hover:scale-105"
                  onError={handleImageError}
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 
        VẠCH PHÂN TRANG (PAGINATION BARS)
        Tạo các vạch ngang nhỏ dưới ảnh mô phỏng số lượng ảnh của sản phẩm.
        Vạch đầu tiên màu đen (ảnh mặc định), các vạch sau màu xám.
      */}
      <div className="flex gap-[2px] mb-3 px-1">
        {mediaList.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-[1px] ${i === 0 ? "bg-black" : "bg-[#d5d5d5]"}`}
          ></div>
        ))}
      </div>

      {/* 
        THÔNG TIN SẢN PHẨM & NÚT YÊU THÍCH
        Hiển thị Tên, Giá (định dạng tiền tệ chuẩn) và icon Bookmark.
      */}
      <div className="flex justify-between items-start px-1">
        <div className="flex flex-col text-[13px] tracking-wide">
          <span className="font-medium text-black">{item.name}</span>
          <span className="text-gray-700 mt-[2px]">
            ₫ {Number(item.price).toLocaleString("en-US")}
          </span>
        </div>

        <div className="flex items-center gap-3 pt-1">
          {/* Nút thêm nhanh vào giỏ hàng (Shopping Bag) */}
          <div
            className="text-black hover:opacity-50 transition-opacity cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              addToCart(item);
              window.dispatchEvent(new CustomEvent("openCart"));
            }}
            title="Add to bag"
          >
            <ShoppingBag size={20} strokeWidth={1.2} />
          </div>

          {/* Nút lưu vào yêu thích (Bookmark) */}
          <div
            className={`transition-opacity cursor-pointer ${isWishlisted ? "text-black" : "text-gray-400 hover:text-black"}`}
            onClick={(e) => {
              e.preventDefault();
              if (isWishlisted) {
                removeFromWishlist(item.sku);
              } else {
                addToWishlist(item);
              }
            }}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Bookmark size={20} strokeWidth={1.2} fill={isWishlisted ? "black" : "none"} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SwiperProductCard;
