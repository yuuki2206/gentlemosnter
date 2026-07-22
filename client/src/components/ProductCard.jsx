import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { handleImageError } from "../config/media";
import { CartContext } from "../context/CartContext";

const ProductCard = ({ item, hideModelView = false, loading = false }) => {
  const { addToCart } = useContext(CartContext);
  const [viewMode, setViewMode] = useState("product");
  const [isHovered, setIsHovered] = useState(false);
  const [activeThumb, setActiveThumb] = useState(null);

  // Skeleton Loader State
  if (loading) {
    return (
      <div className="w-full flex flex-col pb-6 animate-pulse select-none">
        <div className="w-full aspect-square md:aspect-[4/3] bg-[#f0f0f0] relative mb-4 rounded-xs overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>
        <div className="h-4 bg-[#f0f0f0] w-2/3 mb-2 rounded-xs" />
        <div className="h-3 bg-[#f0f0f0] w-1/3 rounded-xs" />
      </div>
    );
  }

  const getModelMedia = (item) => {
    const poster = item.gallery?.find(g => g.includes("POSTER") || g.includes("LOOK_BOOK"));
    if (poster) return poster;
    if (item.thumbnail && item.thumbnail.toLowerCase().endsWith(".mp4")) return item.thumbnail;
    return item.image || item.gallery?.[0];
  };

  const getProductMedia = (item) => {
    const front = item.gallery?.find(g => g.includes("FRONT") && !g.includes("POSTER") && !g.includes("S11500904"));
    if (front) return front;
    if (item.thumbnail && !item.thumbnail.toLowerCase().endsWith(".mp4") && !item.thumbnail.includes("S11500904")) return item.thumbnail;
    return item.gallery?.find(g => !g.includes("S11500904")) || item.image;
  };

  // === DERIVED STATE ===
  let mediaUrl = "";
  let isVideo = false;

  if (viewMode === "model") {
    mediaUrl = getModelMedia(item);
  } else {
    mediaUrl = activeThumb || getProductMedia(item);
  }

  if (mediaUrl?.toLowerCase().endsWith(".mp4")) {
    isVideo = true;
  }

  const productThumbs = item.gallery?.filter(g =>
    !g.toLowerCase().endsWith(".mp4") &&
    !g.includes("POSTER") &&
    !g.includes("LOOK_BOOK") &&
    !g.includes("S11500904")
  ) || [];

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(item);
    window.dispatchEvent(new CustomEvent("openCartToast", { detail: item }));
  };

  return (
    <div
      className="relative group w-full flex flex-col pb-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setActiveThumb(null); }}
    >
      {/* Khung ảnh chính */}
      <div className="w-full aspect-square md:aspect-[4/3] flex justify-center items-center overflow-hidden mb-4 bg-[#f4f4f4] relative rounded-xs">
        <Link to={`/shop/${item.sku}`} aria-label={`View ${item.name} details`} data-cursor="view" className="w-full h-full flex justify-center items-center">
          {isVideo ? (
            <video
              autoPlay loop muted playsInline
              className={`w-full h-full object-cover object-center ${viewMode === "product" ? "object-contain w-[94%] h-[94%]" : ""}`}
            >
              <source src={mediaUrl} type="video/mp4" />
            </video>
          ) : (
            <img
              src={mediaUrl}
              alt={item.name}
              className={`transition-transform duration-700 group-hover:scale-105 ${viewMode === "product" ? "w-[94%] h-[94%] object-contain" : "w-full h-full object-cover"}`}
              onError={handleImageError}
            />
          )}
        </Link>

        {/* Nút QUICK ADD trượt nhẹ từ dưới lên */}
        <button
          onClick={handleQuickAdd}
          className={`absolute bottom-0 left-0 w-full bg-black text-white text-[10px] tracking-[0.25em] font-bold py-3 text-center transition-all duration-300 transform cursor-pointer z-10 hover:bg-neutral-800 ${
            isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
          }`}
        >
          QUICK ADD
        </button>
      </div>

      {/* Thông tin */}
      <div className="flex justify-between items-start w-full relative h-[60px]">
        <div className="text-[9px] md:text-[10px] tracking-wider uppercase text-left flex flex-col absolute top-0 left-0">
          <p className="font-semibold text-black">{item.name}</p>
          <p className="mt-[2px] text-gray-500 font-medium">₫ {Number(item.price).toLocaleString("en-US")}</p>

          <div className={`mt-3 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}>
            <span className="inline-block border-b border-black pb-[1px] hover:opacity-60 transition-opacity font-medium cursor-pointer">
              ADD TO WISHLIST
            </span>
          </div>
        </div>

        <div className={`flex flex-row items-center gap-4 transition-opacity duration-300 absolute top-0 right-0 ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          {viewMode === "product" && productThumbs.length > 0 && (
            <div className="hidden lg:flex flex-row gap-1">
              {productThumbs.slice(0, 4).map((thumb, idx) => (
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

          {!hideModelView && (
            <button
              onClick={() => {
                setViewMode(prev => prev === "model" ? "product" : "model");
                setActiveThumb(null);
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
