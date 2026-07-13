import { useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

/**
 * Component Hero hiển thị thanh trượt Banner Video chiếm toàn màn hình (full-screen) trên trang chủ.
 * Hỗ trợ tự động chuyển slide khi video phát xong (onEnded) và đồng bộ thanh tiến trình (progress indicator).
 */
const Hero = () => {
  // Chỉ số slide hiện tại đang hoạt động
  const [activeIndex, setActiveIndex] = useState(0);
  // Lưu instance của Swiper để điều khiển trượt slide bằng code
  const [swiperInstance, setSwiperInstance] = useState(null);

  // Danh sách các bộ sưu tập nổi bật hiển thị ở banner trang chủ kèm link chuyển tiếp
  const collections = [
    { 
      id: 0, 
      title: "VEGGIE COLLECTION", 
      video: "/Veggie.mp4",
      shopUrl: "/sunglasses?category=Veggie%20Collection",
      campaignUrl: "/stories/850266286345551416"
    },
    { 
      id: 1, 
      title: "2026 COLLECTION", 
      video: "/2026Collection.mp4",
      shopUrl: "/sunglasses?category=2026%20Collection",
      campaignUrl: "/stories/799785239610919992"
    },
    { 
      id: 2, 
      title: "BOLD COLLECTION", 
      video: "/Boldcollection.mp4",
      shopUrl: "/sunglasses?category=BOLD%20Collection",
      campaignUrl: "/stories/751335364734384213"
    },
    { 
      id: 3, 
      title: "FALL COLLECTION", 
      video: "/Fallcollection.mp4",
      shopUrl: "/sunglasses?category=2025%20FALL",
      campaignUrl: "/stories/773503337115322557"
    },
  ];

  return (
    <section className="relative w-full h-screen bg-black">
      
      {/* KHUNG TRƯỢT BANNER
          - loop={true}: Quay vòng tròn slide vô tận.
          - grabCursor={false}: Tắt con trỏ dạng bàn tay nắm để tránh cản trở UX của video.
          - onSlideChange: Sự kiện kích hoạt mỗi khi slide thay đổi:
            + Cập nhật activeIndex để thanh tiến trình chạy đúng vị trí.
            + Tìm tất cả các thẻ video trong các slide và thực hiện cơ chế: slide nào hiển thị thì play(), các slide khác thì pause() để tiết kiệm CPU/Ram cho trình duyệt.
      */}
      <Swiper
        className="w-full h-full"
        data-cursor="drag"
        loop={true}
        grabCursor={false} 
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
          
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
        {collections.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="relative w-full h-full">
              
              {/* Thẻ Video: pointer-events-none để tránh click nhầm làm dừng/phát video */}
              <video
                autoPlay
                muted
                playsInline
                onEnded={() => swiperInstance && swiperInstance.slideNext()}
                className="w-full h-full object-cover z-0 pointer-events-none"
              >
                <source src={item.video} type="video/mp4" />
              </video>
              
              {/* Lớp phủ tối mờ (overlay) để đảm bảo chữ trắng luôn đọc được tốt */}
              <div className="absolute inset-0 bg-black/15 z-10 pointer-events-none"></div>

              {/* KHU VỰC THÔNG TIN BANNER (Căn giữa ngang, đẩy sát đáy theo tỉ lệ Gentle Monster) */}
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

      {/* THANH TIẾN TRÌNH DƯỚI ĐÁY BANNER (Pagination lines)
          - Mô phỏng đúng dạng 4 thanh progress chạy tuyến tính của Gentle Monster.
          - duration-[5000ms] ease-linear: Đồng bộ hiệu ứng chạy đầy thanh ngang khớp với thời gian chuyển slide.
      */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex justify-center gap-2 z-30 pointer-events-none w-full px-4">
        {collections.map((_, index) => (
          <div 
            key={index}
            className="h-[1px] w-[102px] max-w-[20%] rounded-full overflow-hidden bg-white/40"
          >
            <div 
              className={`h-full bg-white transition-all duration-[5000ms] ease-linear ${
                activeIndex === index ? "w-full" : (index < activeIndex ? "w-full" : "w-0")
              }`}
            ></div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default Hero;