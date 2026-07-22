import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

/**
 * Component hiển thị một thanh trượt Swiper lớn cho các chiến dịch bộ sưu tập mới (New Arrivals).
 * Có tính năng chuyển đổi chế độ xem (View Mode): xem người mẫu (Model View) hoặc xem chi tiết sản phẩm (Product View).
 * Hỗ trợ đồng bộ hóa Thumbs (thanh trượt hình nhỏ) ở phía dưới.
 * 
 * @param {Array} products - Danh sách sản phẩm trong chiến dịch mới
 */
const CampaignSlider = ({ products = [] }) => {
  // Trạng thái chế độ xem: "model" (người mẫu) hoặc "product" (chi tiết sản phẩm)
  const [viewMode, setViewMode] = useState("model");
  // Lưu trữ instance của Swiper Thumbs dùng để kết nối 2 thanh trượt lớn và nhỏ
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  
  /**
   * Trích xuất đường dẫn ảnh người mẫu đeo kính từ data sản phẩm
   * Ưu tiên 1: Ảnh người mẫu thật (POSTER / LOOK_BOOK)
   * Ưu tiên 2: Video sản phẩm xoay
   * Ưu tiên 3: Ảnh mặc định đầu tiên
   */
  const getModelMedia = (item) => {
    const poster = item.gallery?.find(g => g.includes("POSTER") || g.includes("LOOK_BOOK"));
    if (poster) return poster;
    if (item.thumbnail && item.thumbnail.toLowerCase().endsWith(".mp4")) return item.thumbnail;
    return item.image || item.gallery?.[0];
  };

  /**
   * Trích xuất đường dẫn ảnh sản phẩm gốc (không có người đeo)
   * Lọc bỏ hoàn toàn các ảnh bao bì túi đựng hoặc ảnh người mẫu đeo kính
   */
  const getProductMedia = (item) => {
    const front = item.gallery?.find(g => g.includes("FRONT") && !g.includes("POSTER") && !g.includes("S11500904"));
    if (front) return front;
    if (item.thumbnail && !item.thumbnail.toLowerCase().endsWith(".mp4") && !item.thumbnail.includes("S11500904")) return item.thumbnail;
    return item.gallery?.find(g => !g.includes("S11500904")) || item.image;
  };

  /**
   * Lấy ảnh thu nhỏ cho thanh trượt thumbnail
   */
  const getModelThumb = (item) => {
    const poster = item.gallery?.find(g => g.includes("POSTER") || g.includes("LOOK_BOOK"));
    if (poster) return poster;
    return item.image || item.gallery?.[0];
  };

  return (
    <section className="w-full pt-16 pb-16 bg-[#fafafa] text-black overflow-hidden relative">
      
      {/* TIÊU ĐỀ */}
      <div className="px-4 md:px-12 mb-10 flex flex-col items-start gap-1">
        <h2 className="text-[10px] md:text-[12px] font-medium tracking-widest uppercase">
          LATEST: GENTLE MONSTER'S NEW ARRIVAL
        </h2>
        <a href="#" className="text-[10px] md:text-[12px] tracking-widest uppercase hover:underline underline-offset-4">
          MORE
        </a>
      </div>

      {/* SWIPER CHÍNH (ẢNH LỚN) */}
      <Swiper
        modules={[Thumbs, FreeMode]}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        freeMode={true}
        breakpoints={{
          320: { slidesPerView: 1.2, spaceBetween: 20 },
          768: { slidesPerView: 2.2, spaceBetween: 30 },
          1024: { slidesPerView: 3, spaceBetween: 40 },
        }}
        className="w-full pl-4 md:pl-12 !pr-0 cursor-ew-resize mb-10"
      >
        {products?.map((item, idx) => {
          // Resolve media URLs based on viewMode
          let mediaUrl = "";
          let isVideo = false;

          if (viewMode === "model") {
            mediaUrl = getModelMedia(item);
          } else {
            mediaUrl = getProductMedia(item);
          }

          if (mediaUrl?.toLowerCase().endsWith(".mp4")) {
            isVideo = true;
          }

          return (
            <SwiperSlide key={item.sku || idx}>
              <a href={item.url || '#'} aria-label={`View ${item.name} details`} className={`relative group w-full aspect-[3/4] flex flex-col justify-end block ${viewMode === "product" ? "bg-[#f4f4f4]" : "bg-transparent"}`}>
                
                {/* Media Renderer */}
                <div className="absolute inset-0 w-full h-full">
                  {isVideo ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="none"
                      className={`w-full h-full object-cover object-center ${viewMode === "product" ? "p-12 object-contain" : ""}`}
                    >
                      <source src={mediaUrl} type="video/mp4" />
                    </video>
                  ) : (
                    <img 
                      src={mediaUrl} 
                      alt={item.name} 
                      loading="lazy"
                      className={`w-full h-full transition-transform duration-700 group-hover:scale-105 ${viewMode === "product" ? "object-contain p-12" : "object-cover"}`}
                    />
                  )}
                </div>

                {/* THÔNG TIN SẢN PHẨM (Nằm ở góc dưới cùng bên trái) */}
                <div className="relative z-10 p-6 text-[9px] md:text-[10px] tracking-wider uppercase text-left">
                  <p className="font-medium text-black">{item.name}</p>
                  <p className="mt-[2px] text-gray-800">£ {item.price}</p>
                  <span className="mt-3 inline-block border-b border-black pb-[1px] hover:opacity-60 transition-opacity font-medium">
                    ADD TO WISHLIST
                  </span>
                </div>

              </a>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* THUMBS VÀ TOGGLE Ở GIỮA ĐÁY */}
      <div className="w-full flex items-center justify-center gap-6 px-4">
        
        {/* Thumbs Swiper */}
        <div className="w-auto max-w-[50%] md:max-w-[400px]">
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView="auto"
            watchSlidesProgress={true}
            modules={[Thumbs]}
            className="thumb-slider"
          >
            {products?.map((item, idx) => {
              const thumbUrl = viewMode === "model" ? getModelThumb(item) : getProductMedia(item);
              return (
                <SwiperSlide key={`thumb-${item.sku || idx}`} className="!w-[30px] !h-[40px] md:!w-[40px] md:!h-[53px] cursor-pointer opacity-50 hover:opacity-100 transition-opacity [&.swiper-slide-thumb-active]:opacity-100 bg-white">
                  <img 
                    src={thumbUrl} 
                    alt={item.name} 
                    className={`w-full h-full rounded-sm ${viewMode === "product" ? "object-contain p-1" : "object-cover"}`}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* View Mode Toggle */}
        <button 
          onClick={() => setViewMode(viewMode === "model" ? "product" : "model")}
          className="text-[9px] md:text-[10px] tracking-widest uppercase font-medium text-black hover:opacity-60 transition-opacity"
        >
          {viewMode === "model" ? "PRODUCT VIEW" : "MODEL VIEW"}
        </button>

      </div>

    </section>
  );
};

export default CampaignSlider;