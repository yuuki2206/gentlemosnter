import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { handleImageError } from "../config/media";

const SwiperProductCard = ({ item, loading = false }) => {
  const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useContext(CartContext);
  const [isHovered, setIsHovered] = useState(false);

  // Skeleton Loader State
  if (loading) {
    return (
      <div className="w-full flex flex-col pb-8 animate-pulse select-none">
        <div className="w-full aspect-[4/3] bg-[#f0f0f0] relative mb-4 rounded-xs overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>
        <div className="h-4 bg-[#f0f0f0] w-2/3 mb-2 rounded-xs" />
        <div className="h-3 bg-[#f0f0f0] w-1/3 rounded-xs" />
      </div>
    );
  }

  const isWishlisted = wishlist.some((w) => w.sku === item?.sku);

  // Lọc và sắp xếp media: Giữ nguyên chuẩn Video MP4 ngắn làm ảnh đại diện chính theo mẫu website Gentle Monster gốc
  const rawMediaList = Array.from(new Set([item.thumbnail, ...(item.gallery || [])].filter(Boolean)));
  const sortedMediaList = rawMediaList.sort((a, b) => {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    const isVideoA = aLower.endsWith(".mp4");
    const isVideoB = bLower.endsWith(".mp4");
    const isPackagingA = a.includes("S11500904") || aLower.includes("package");
    const isPackagingB = b.includes("S11500904") || bLower.includes("package");

    if (isPackagingA && !isPackagingB) return 1;
    if (!isPackagingA && isPackagingB) return -1;
    // Ưu tiên Video MP4 làm media đại diện chính
    if (isVideoA && !isVideoB) return -1;
    if (!isVideoA && isVideoB) return 1;
    return 0;
  });

  const mediaList = sortedMediaList;
  const image1 = mediaList[0];
  // Dùng ảnh thứ 2 làm ảnh góc nghiêng/mẫu hover. Nếu không có thì dùng chính ảnh 1.
  const image2 = mediaList[1] || mediaList[0];

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(item);
    // Phát event mở giỏ hàng/thông báo toast
    window.dispatchEvent(new CustomEvent("openCartToast", { detail: item }));
  };

  return (
    <Link
      to={`/shop/${item.sku}`}
      aria-label={`View ${item.name} details`}
      className="group flex flex-col cursor-pointer pb-8 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Khung ảnh chính với hiệu ứng Hover Image Swap */}
      <div className="w-full aspect-[4/3] flex justify-center items-center relative mb-3 bg-[#f4f4f4] overflow-hidden rounded-xs">
        {/* Media 1 (Video MP4 / Ảnh tĩnh trực diện) */}
        <div className={`w-full h-full flex justify-center items-center p-2 md:p-3 transition-[opacity,transform] duration-700 ${isHovered ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
          {image1 && image1.toLowerCase().endsWith(".mp4") ? (
            <video src={image1} autoPlay loop muted playsInline preload="auto" className="w-[92%] h-[92%] object-contain pointer-events-none" />
          ) : (
            <img src={image1} alt={item.name} loading="lazy" width="400" height="300" className="w-[92%] h-[92%] object-contain" onError={handleImageError} />
          )}
        </div>

        {/* Media 2 (Ảnh góc nghiêng / mẫu hover) */}
        <div className={`w-full h-full flex justify-center items-center p-2 md:p-3 absolute inset-0 transition-[opacity,transform] duration-700 ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"}`}>
          {image2 && image2.toLowerCase().endsWith(".mp4") ? (
            <video src={image2} autoPlay loop muted playsInline preload="metadata" className="w-[92%] h-[92%] object-contain pointer-events-none" />
          ) : (
            <img src={image2} alt={`${item.name} hover`} loading="lazy" width="400" height="300" className="w-full h-full object-contain" onError={handleImageError} />
          )}
        </div>

        {/* Nút QUICK ADD trượt nhẹ từ dưới lên ở mép dưới ảnh */}
        <button
          onClick={handleQuickAdd}
          className={`absolute bottom-0 left-0 w-full bg-black text-white text-[10px] tracking-[0.25em] font-bold py-3 text-center transition-all duration-300 transform cursor-pointer z-10 hover:bg-neutral-800 ${
            isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
          }`}
        >
          QUICK ADD
        </button>
      </div>

      {/* Thông tin sản phẩm & Wishlist */}
      <div className="flex justify-between items-start px-1 mt-1">
        <div className="flex flex-col text-[12px] tracking-wide text-left">
          <span className="font-semibold text-black uppercase">{item.name}</span>
          <span className="text-gray-500 mt-[2px] font-medium">
            ₫ {Number(item.price).toLocaleString("en-US")}
          </span>
        </div>

        <div
          className={`transition-opacity duration-300 cursor-pointer pt-1 ${isWishlisted ? "text-black" : "text-gray-400 hover:text-black"}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isWishlisted) {
              removeFromWishlist(item.sku);
            } else {
              addToWishlist(item);
            }
          }}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Bookmark size={18} strokeWidth={1.2} fill={isWishlisted ? "black" : "none"} />
        </div>
      </div>
    </Link>
  );
};

export default SwiperProductCard;
