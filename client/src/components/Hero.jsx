import { useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

/**
 * Component Hero hiển thị thanh trượt Banner Video chiếm toàn màn hình (full-screen) trên trang chủ.
 * Hỗ trợ tự động chuyển slide khi video phát xong (onEnded) và đồng bộ thanh tiến trình thời gian thực.
 */
const Hero = () => {
  // Chỉ số slide hiện tại đang hoạt động
  const [activeIndex, setActiveIndex] = useState(0);
  // Tiến trình chạy video hiện tại (0% -> 100%)
  const [videoProgress, setVideoProgress] = useState(0);
  // Lưu instance của Swiper để điều khiển trượt slide bằng code
  const [swiperInstance, setSwiperInstance] = useState(null);

  // Danh sách các bộ sưu tập nổi bật với link CDN trực tiếp từ Gentle Monster kèm ảnh poster xem trước
  const collections = [
    { 
      id: 0, 
      title: "VEGGIE COLLECTION", 
      video: "https://gm-prd-resource.gentlemonster.com/main/banner/844160776311460281/9b68ad1a-6e18-41e6-b18c-518ea111cc88/main_global_pc_1920*990.mp4",
      poster: "https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/video/hero_short_thumb_pc.jpg",
      shopUrl: "/sunglasses?category=Veggie%20Collection",
      campaignUrl: "/stories/850266286345551416"
    },
    { 
      id: 1, 
      title: "2026 COLLECTION", 
      video: "https://gm-prd-resource.gentlemonster.com/main/banner/798372671433820827/6fc4e780-c8ce-48bd-a8dd-3abff6ab7f8d/main_pc_1920*990.mp4",
      poster: "https://gm-prd-resource.gentlemonster.com/catalog/product/0Q04AJXM47349/a85726af-246f-430b-953d-fd0a92e47d38/11005102_FRONT.jpg",
      shopUrl: "/sunglasses?category=2026%20Collection",
      campaignUrl: "/stories/799785239610919992"
    },
    { 
      id: 2, 
      title: "BOLD COLLECTION", 
      video: "https://gm-prd-resource.gentlemonster.com/main/banner/745797614844190277/dc673826-17a9-4253-b4e5-d0f681db7017/main_0_pc_1920*990.mp4",
      poster: "https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/image/steel_cut_1.jpg",
      shopUrl: "/sunglasses?category=BOLD%20Collection",
      campaignUrl: "/stories/751335364734384213"
    },
    { 
      id: 3, 
      title: "FALL COLLECTION", 
      video: "https://gm-prd-resource.gentlemonster.com/main/banner/770800970997325499/acc3f823-6a91-4897-b629-3891b5632fe9/main_0_pc_1920*990.mp4",
      poster: "https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/image/steel_cut_4.jpg",
      shopUrl: "/sunglasses?category=2025%20FALL",
      campaignUrl: "/stories/773503337115322557"
    },
  ];

  return (
    <section className="relative w-full h-screen bg-black">
      
      {/* KHUNG TRƯỢT BANNER SWIPER */}
      <Swiper
        className="w-full h-full"
        data-cursor="drag"
        loop={true}
        grabCursor={false} 
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => {
          const realIdx = swiper.realIndex;
          setActiveIndex(realIdx);
          setVideoProgress(0);
          
          // Tối ưu hóa hiệu năng Video: Play video ở slide active, pause video ở các slide ẩn
          const slides = swiper.slides;
          slides.forEach((slide, idx) => {
            const video = slide.querySelector('video');
            if (video) {
              if (idx === swiper.activeIndex) {
                video.currentTime = 0; // Quay về đầu video
                video.play().catch(e => console.log('Auto-play prevented'));
              } else {
                video.pause(); // Dừng chạy ngầm
              }
            }
          });
        }}
      >
        {collections.map((item, index) => (
          <SwiperSlide key={item.id}>
            <div className="relative w-full h-full">
              
              {/* Thẻ Video CDN với Poster Image và Lazy Preloading */}
              <video
                autoPlay
                muted
                playsInline
                poster={item.poster}
                preload={index === activeIndex ? "auto" : "none"}
                onTimeUpdate={(e) => {
                  if (e.target.duration) {
                    setVideoProgress((e.target.currentTime / e.target.duration) * 100);
                  }
                }}
                onEnded={() => swiperInstance && swiperInstance.slideNext()}
                className="w-full h-full object-cover z-0 pointer-events-none"
              >
                <source src={item.video} type="video/mp4" />
              </video>
              
              {/* Lớp phủ tối mờ (overlay) */}
              <div className="absolute inset-0 bg-black/15 z-10 pointer-events-none"></div>

              {/* KHU VỰC THÔNG TIN BANNER */}
              <div className="absolute bottom-[106px] md:bottom-[113px] left-1/2 -translate-x-1/2 w-full px-4 text-center z-20 cursor-auto">
                <h1 className="text-[20px] md:text-[24px] font-serif leading-[24px] md:leading-[28px] text-white uppercase drop-shadow-md pointer-events-none">
                  {item.title}
                </h1>
                
                <div className="flex items-center justify-center gap-3 md:gap-4 mt-3 md:mt-8">
                  <Link to={item.shopUrl} className="border border-white h-[36px] md:h-[auto] md:py-2 px-[23px] rounded-[25px] flex items-center justify-center text-[12px] md:text-[13px] font-medium text-white hover:bg-white hover:text-black transition-colors duration-300">
                    Shop Now
                  </Link>
                  <Link to={item.campaignUrl} className="border border-white h-[36px] md:h-[auto] md:py-2 px-[23px] rounded-[25px] flex items-center justify-center text-[12px] md:text-[13px] font-medium text-white hover:bg-white hover:text-black transition-colors duration-300">
                    View Campaign
                  </Link>
                </div>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* THANH TIẾN TRÌNH DƯỚI ĐÁY BANNER (Real-time Video Progress Sync)
          - 4 thanh progress chạy chính xác theo % thời lượng video đang phát.
          - Đồng bộ chuẩn đét mẫu website Gentle Monster gốc.
      */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex justify-center gap-2 z-30 pointer-events-none w-full px-4">
        {collections.map((_, index) => {
          let barWidth = "0%";
          if (index < activeIndex) {
            barWidth = "100%";
          } else if (index === activeIndex) {
            barWidth = `${videoProgress}%`;
          }

          return (
            <div 
              key={index}
              className="h-[1.5px] w-[102px] max-w-[20%] rounded-full overflow-hidden bg-white/30"
            >
              <div 
                className="h-full bg-white transition-all duration-75 ease-linear"
                style={{ width: barWidth }}
              ></div>
            </div>
          );
        })}
      </div>

    </section>
  );
};

export default Hero;