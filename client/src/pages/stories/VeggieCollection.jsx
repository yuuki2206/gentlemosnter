import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getMediaUrl } from "../../config/media";

/**
 * VeggieCollection Component
 * 
 * KIẾN THỨC NỀN TẢNG:
 * 1. IntersectionObserver API (Lazy Loading & Trigger Playback):
 *    - Theo dõi bất đồng bộ sự kiện phần tử di chuyển vào khung hình.
 *    - Kỹ thuật: Tránh tải tài nguyên video nặng (`folding_*.mp4`) ngay từ đầu để tăng tốc độ tải trang ban đầu.
 *      Chỉ khi phần tử cuộn vào tầm nhìn (threshold: 35%), video mới được gán thuộc tính `src` động và phát.
 *    - Tối ưu GPU: Gọi `observer.unobserve(video)` ngay sau khi phát để dừng quan sát, giúp video tự động dừng ở frame cuối cùng,
 *      tránh tốn bộ nhớ CPU/GPU khi người dùng cuộn đi nơi khác.
 * 
 * 2. Responsive Picture Tag & Thích ứng Resize:
 *    - Sử dụng cặp thẻ `<picture>` kết hợp `<source>` để trình duyệt tự động tráo đổi nguồn ảnh (Desktop `_pc` vs Mobile `_mo`) 
 *      ở mức độ nhân trình duyệt (native) mà không cần lắng nghe sự kiện Resize trong React, tăng hiệu năng đáng kể.
 * 
 * 3. Video Containment & Chống méo khung hình (Object-Fit):
 *    - Đặt class `w-full h-full object-cover absolute inset-0` cho video nằm bên trong khung chứa cha `relative` có `aspect-ratio` ổn định.
 *    - Giúp video luôn tự động co giãn ôm khít khung chứa khi người dùng thay đổi kích thước trình duyệt liên tục mà không bị méo tỉ lệ gốc.
 */
const VeggieCollection = ({ story, veggieDisplayItems }) => {
  const [isPlayingHeroVideo, setIsPlayingHeroVideo] = useState(false);
  const [isCampaignPlaying, setIsCampaignPlaying] = useState(false);

  // Kích hoạt hiệu ứng lộ diện khi cuộn trang (IntersectionObserver)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
    );

    const elements = document.querySelectorAll(".reveal-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Cuộn lên đầu trang và kích hoạt IntersectionObserver phát video xếp gọn 1 lần khi cuộn tới
  useEffect(() => {
    window.scrollTo(0, 0);

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1, // Giảm xuống 10% để dễ dàng kích hoạt trên màn hình điện thoại di động
    };

    const handleIntersection = (entries, observer) => {
      entries.forEach((entry) => {
        // Chỉ xử lý khi phần tử thực sự hiển thị và chiều cao hợp lệ
        if (entry.isIntersecting && entry.boundingClientRect.height > 100) {
          const video = entry.target;
          const index = video.getAttribute("data-index");
          if (video && index) {
            // Lazy-load gán nguồn video nếu chưa được gán
            if (!video.src || video.src === "") {
              video.src = `https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/video/folding_${index}_pc.mp4`;
              video.load(); // Khởi chạy tải video khi thay đổi thuộc tính src trên di động
            }
            video.loop = false;
            video.play().catch((err) => {
              console.warn("[Autoplay Blocked] Lỗi phát video gập kính:", err);
            });
            
            // Dừng quan sát để video tự động đóng băng ở khung hình cuối cùng khi hoàn tất phát
            observer.unobserve(video);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    const videos = document.querySelectorAll(".folding-video");
    videos.forEach((vid) => observer.observe(vid));

    return () => {
      observer.disconnect();
    };
  }, [story]);

  return (
    <div className="min-h-screen bg-[#DEE6F0] text-black font-sans antialiased overflow-x-hidden">
      {/* Khóa Header trong suốt để tương thích video nền xanh */}
      <Header forceTransparent={true} />

      {/* SECTION 1: HERO & INTRO */}
      <section className="story-detail" id="veggie-collection">
        <h1 className="hidden">veggie-collection</h1>
        
        {/* Nền xanh nhạt DEE6F0 phủ toàn bộ intro */}
        <div className="goudy-old-style-veggie bg-[#DEE6F0] flex flex-col pb-[120px] lg:pb-[200px]">
          
          <div className="veggie-hero-section relative flex flex-col gap-[14px] pb-[40px] lg:pb-[80px]">
            {/* Banner Video / Poster */}
            <div className="veggie-hero-container">
              
              {/* Trình phát video inline */}
              <video
                id="hero-campaign-video"
                src={getMediaUrl("/Veggie%20collection/Veggie.mp4")}
                poster={isCampaignPlaying ? "" : "https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/video/hero_short_thumb_pc.jpg"}
                className="w-full h-full object-cover"
                muted={!isCampaignPlaying}
                loop={!isCampaignPlaying}
                autoPlay={true}
                playsInline={true}
                controls={isCampaignPlaying}
                onEnded={() => setIsCampaignPlaying(false)}
              />

              {/* Lớp phủ Text và Nút Play (Ẩn đi khi đang phát video đầy đủ) */}
              {!isCampaignPlaying && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[99] flex flex-col items-center justify-center gap-[16px] text-center w-full">
                  <p className="veggie-hero-caption text-white uppercase tracking-widest text-[12px] md:text-[14px] font-medium drop-shadow-md">
                    Click to watch<br />the full campaign
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCampaignPlaying(true);
                      const video = document.getElementById("hero-campaign-video");
                      if (video) {
                        video.muted = false;
                        video.currentTime = 0;
                        video.play().catch(() => {});
                      }
                    }}
                    className="veggie-cta bg-white text-black hover:bg-black hover:text-white transition-colors duration-300 font-medium px-8 py-2 rounded-full uppercase tracking-wider text-[11px] min-h-[36px]"
                  >
                    <span>Play</span>
                  </button>
                </div>
              )}

              {/* Tên bộ sưu tập đè ở góc dưới mobile */}
              {!isCampaignPlaying && (
                <h2 className="lg:hidden absolute bottom-[10vw] left-0 right-0 text-[36px] font-[400] uppercase text-[#111] text-center z-[1]">
                  VEGGIE COLLECTION
                </h2>
              )}
            </div>
          </div>

          {/* Mô tả chữ dài ở dưới Hero */}
          <div className="flex flex-col items-center justify-center gap-[30px] px-6 text-center max-w-[800px] mx-auto mt-8 reveal-on-scroll">
            <h2 className="hidden lg:block text-[52px] leading-[60px] font-[400] uppercase text-[#111] tracking-wide">
              VEGGIE COLLECTION
            </h2>
            <p className="veggie-hero-desc text-[#111] uppercase tracking-wide leading-relaxed text-[11px] md:text-[14px] font-medium max-w-[700px]">
              Gentle Monster presents the 2026 Veggie Collection. it offers a series of compact folding eyewear that reinterpret the forms and colors of vegetables with a refined yet playful edge, expanding the ever-evolving universe of Gentle Monster.
            </p>
          </div>
        </div>

        {/* Mảnh ghép tranh ảnh tĩnh (Steel cuts) */}
        <section className="veggie-editorial-1-section flex flex-col lg:mb-[80px] reveal-on-scroll">
          <img
            alt="steel cut image 1"
            className="w-full h-auto object-cover image-1"
            src="https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/image/steel_cut_1.jpg"
          />
          <div className="image-group">
            <img
              alt="steel cut image 2"
              className="w-full h-auto object-cover image-2"
              src="https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/image/steel_cut_2.jpg"
            />
            <img
              alt="steel cut image 3"
              className="w-full h-auto object-cover image-3"
              src="https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/image/steel_cut_3.jpg"
            />
          </div>
          <img
            alt="steel cut image 4"
            className="w-full h-auto object-cover image-4"
            src="https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/image/steel_cut_4.jpg"
          />
        </section>

        {/* SECTION 2: INTERACTIVE FOLDING Eyewear Showcase */}
        <section className="veggie-folding-video-section flex flex-col mb-[160px] lg:mb-[80px]">
          {/* Kính 1: Vert 02(Y) */}
          <div className="veggie-folding-video-wrapper relative overflow-hidden bg-[#DEE6F0]">
            <video
              data-index="1"
              className="w-full h-full object-cover folding-video absolute inset-0 z-0"
              muted
              playsInline
            />
            <div className="veggie-folding-desc-wrapper z-[2]">
              <h3 className="goudy-old-style-veggie veggie-folding-desc capitalize">
                Vert 02(Y)
              </h3>
              <Link
                to="/sunglasses"
                className="no-underline inline-flex items-center justify-center veggie-cta bg-white capitalize rounded-[50px] text-[#111] text-center"
              >
                <span>Shop Now</span>
              </Link>
            </div>
          </div>

          {/* Kính 2: zest 01 */}
          <div className="veggie-folding-video-wrapper relative overflow-hidden bg-[#DEE6F0]">
            <video
              data-index="2"
              className="w-full h-full object-cover folding-video absolute inset-0 z-0"
              muted
              playsInline
            />
            <div className="veggie-folding-desc-wrapper z-[2]">
              <h3 className="goudy-old-style-veggie veggie-folding-desc capitalize">
                zest 01
              </h3>
              <Link
                to="/sunglasses"
                className="no-underline inline-flex items-center justify-center veggie-cta bg-white capitalize rounded-[50px] text-[#111] text-center"
              >
                <span>Shop Now</span>
              </Link>
            </div>
          </div>

          {/* Kính 3: Aden 02 */}
          <div className="veggie-folding-video-wrapper relative overflow-hidden bg-[#DEE6F0]">
            <video
              data-index="3"
              className="w-full h-full object-cover folding-video absolute inset-0 z-0"
              muted
              playsInline
            />
            <div className="veggie-folding-desc-wrapper z-[2]">
              <h3 className="goudy-old-style-veggie veggie-folding-desc capitalize">
                Aden 02
              </h3>
              <Link
                to="/sunglasses"
                className="no-underline inline-flex items-center justify-center veggie-cta bg-white capitalize rounded-[50px] text-[#111] text-center"
              >
                <span>Shop Now</span>
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 3: THE 10 PRODUCTS SHOWCASE */}
        <section className="veggie-collection-section bg-[#DEE6F0] py-24 text-center">
          <p className="veggie-collection-desc text-center max-w-[327px] desktop:max-w-[720px] mx-auto mb-[48px] desktop:mb-[80px] uppercase text-xs tracking-[0.2em] font-light leading-relaxed text-gray-800">
            Comprised of ten folding eyewear designs, the series balances portability with structural integrity.
          </p>

          {/* Video giới thiệu collection gọng gập kính đặt nằm trên vải */}
          <div className="veggie-collection-video-wrapper mb-16">
            <div className="veggie-collection-video relative w-full overflow-hidden rounded-[80px] mx-auto max-w-[1112px]">
              <video
                src="https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/video/random_1_pc.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="none"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Grid sản phẩm */}
          <div className="veggie-collection-list">
            {veggieDisplayItems.map((item, index) => (
              <Link
                key={index}
                to="/sunglasses"
              >
                <picture>
                  {/* Tráo đổi ảnh di động chất lượng nhẹ khi chiều rộng màn hình nhỏ hơn 767px */}
                  <source media="(max-width: 767px)" srcSet={item.mobImg || item.img} />
                  <img
                    src={item.img}
                    alt={item.name}
                    className="veggie-collection-item-image w-full h-auto object-cover"
                    loading="lazy"
                  />
                </picture>
                <p className="goudy-old-style-veggie veggie-collection-item-name capitalize text-center">
                  {item.name}
                </p>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-16">
            <Link
              to="/sunglasses"
              className="no-underline inline-flex items-center justify-center mx-auto veggie-cta bg-white text-black hover:bg-black hover:text-white px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300"
            >
              <span>View the Collection</span>
            </Link>
          </div>
        </section>

        {/* SECTION 4: EDITORIAL EDITORIAL CUTS (Karina of aespa) */}
        <section className="veggie-editorial-2-section">
          <div className="image-group-wrapper">
            <div className="editorial-image-picture">
              <img
                alt="veggie campaign 1"
                loading="lazy"
                className="w-full h-auto object-cover editorial-image-1"
                src="https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/image/campaign_1.jpg"
              />
            </div>
            <div className="editorial-wrapper-1">
              <p className="editorial-desc desc-box text-center uppercase goudy-old-style-veggie">
                “starring Karina of aespa”
              </p>
              <div className="editorial-image-2-wrapper">
                <div className="empty-box-hidden"></div>
                <div className="editorial-image-picture w-full">
                  <img
                    alt="veggie campaign 2"
                    loading="lazy"
                    className="w-full h-auto object-cover editorial-image-2"
                    src="https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/image/campaign_2.jpg"
                  />
                </div>
                <div className="empty-box-hidden"></div>
              </div>
            </div>
          </div>
          <div className="editorial-wrapper-2">
            <p className="editorial-desc desc-box text-left uppercase goudy-old-style-veggie">
              “translates obsession unfolding across a desolate field”
            </p>
            <div className="editorial-image-3-wrapper">
              <div className="empty-box-hidden"></div>
              <div className="editorial-image-picture editorial-image-3-picture">
                <img
                  alt="veggie campaign 3"
                  loading="lazy"
                  className="w-full h-auto object-cover editorial-image-3"
                  src="https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/image/campaign_3.jpg"
                />
              </div>
              <div></div>
            </div>
          </div>
        </section>

        {/* SECTION 5: POP-UP STORES & KEYRING INFORMATION */}
        <section id="veggie-collection-popup" className="veggie-popup-section flex flex-col mobile:pt-[80px] mobile:mt-[80px] desktop:pt-[120px] desktop:mt-[200px]">
          <p className="veggie-popup-desc text-center uppercase">To celebrate the 2026 Veggie Collection, immersive pop-up installations arrive in six global cities.</p>

          {/* Video Pop-up Store */}
          <div className="veggie-popup-video-wrapper">
            <div className="veggie-popup-video relative">
              <video
                className="w-full absolute inset-0 w-full h-full object-cover"
                muted
                playsInline
                autoPlay
                loop
              >
                <source src="https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/video/popup_pc.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          <div className="veggie-popup-list-wrapper text-center">
            <div className="flex flex-col gap-[12px]">
              <p className="veggie-popup-list-desc capitalize">Visit a nearby pop-up store.</p>
              <p className="veggie-popup-keyring-desc capitalize">A random doll keyring will be included with Veggie Collection orders placed at popup stores and online, while supplies last.</p>
            </div>
            
            <ul className="veggie-popup-list">
              <li className="goudy-old-style-veggie flex flex-col">
                <a target="_blank" rel="noopener noreferrer" href="https://www.gentlemonster.com/int/en/stores/detail/841610974860155502">
                  <p className="veggie-popup-list-city uppercase">LA</p>
                  <p className="veggie-popup-list-location capitalize">Los Angeles Pop-Up</p>
                  <p className="veggie-popup-list-address capitalize">8626 Melrose Ave, West Hollywood, CA 90069</p>
                </a>
              </li>
              <li className="goudy-old-style-veggie flex flex-col">
                <a target="_blank" rel="noopener noreferrer" href="https://www.gentlemonster.com/int/en/stores/detail/779149716700285432">
                  <p className="veggie-popup-list-city uppercase">SEOUL</p>
                  <p className="veggie-popup-list-location capitalize">Haus Nowhere Seoul</p>
                  <p className="veggie-popup-list-address capitalize">433, Ttukseom-ro, Seongdong-gu, Seoul</p>
                </a>
              </li>
              <li className="goudy-old-style-veggie flex flex-col">
                <a target="_blank" rel="noopener noreferrer" href="https://www.gentlemonster.com/int/en/stores/detail/779149629756556663">
                  <p className="veggie-popup-list-city uppercase">SEOUL</p>
                  <p className="veggie-popup-list-location capitalize">Haus Nowhere Dosan</p>
                  <p className="veggie-popup-list-address capitalize">50, Apgujeong-ro 46-gil, Gangnam-gu, Seoul</p>
                </a>
              </li>
              <li className="goudy-old-style-veggie flex flex-col">
                <a target="_blank" rel="noopener noreferrer" href="https://www.gentlemonster.com/int/en/stores/detail/842045264177998840">
                  <p className="veggie-popup-list-city uppercase">TOKYO</p>
                  <p className="veggie-popup-list-location capitalize">Tokyo Pop-Up</p>
                  <p className="veggie-popup-list-address capitalize">6 Chome 35-6, Jingumae, Shibuya-Ku, Tokyo</p>
                </a>
              </li>
              <li className="goudy-old-style-veggie flex flex-col">
                <a target="_blank" rel="noopener noreferrer" href="https://www.gentlemonster.com/int/en/stores/detail/779149629508474845">
                  <p className="veggie-popup-list-city uppercase">BEIJING<span> OUTSIDE</span></p>
                  <p className="veggie-popup-list-location capitalize">Gentle Monster Beijing Taikoo Li</p>
                  <p className="veggie-popup-list-address capitalize">L1 Unit S10-15, Building 10, No. 19 Sanlitun Road, Chaoyang District, Beijing</p>
                </a>
              </li>
              <li className="goudy-old-style-veggie flex flex-col">
                <a target="_blank" rel="noopener noreferrer" href="https://www.gentlemonster.com/int/en/stores/detail/779149629508474845">
                  <p className="veggie-popup-list-city uppercase">BEIJING<span> inside</span></p>
                  <p className="veggie-popup-list-location capitalize">Gentle Monster Beijing Taikoo Li</p>
                  <p className="veggie-popup-list-address capitalize">S10 Piazza, No. 19 Sanlitun Road, Chaoyang District, Beijing</p>
                </a>
              </li>
              <li className="goudy-old-style-veggie flex flex-col">
                <a target="_blank" rel="noopener noreferrer" href="https://www.gentlemonster.com/int/en/stores/detail/779149670609076624">
                  <p className="veggie-popup-list-city uppercase">SHANGHAI</p>
                  <p className="veggie-popup-list-location capitalize">haus nowhere Shanghai</p>
                  <p className="veggie-popup-list-address capitalize">1F, No. 798-812 Middle Huaihai Road, Huangpu District, Shanghai</p>
                </a>
              </li>
              <li className="goudy-old-style-veggie flex flex-col">
                <a target="_blank" rel="noopener noreferrer" href="https://www.gentlemonster.com/int/en/stores/detail/779149714453558267">
                  <p className="veggie-popup-list-city uppercase">BANGKOK</p>
                  <p className="veggie-popup-list-location capitalize">Bangkok Pop-Up</p>
                  <p className="veggie-popup-list-address capitalize">ICONSIAM, M21 &amp; Unit 123, 299 Charoen Nakorn Rd, Bangkok 10600</p>
                </a>
              </li>
            </ul>
          </div>
        </section>
      </section>

      {/* FULLSCREEN VIDEO MODAL OVERLAY */}
      {isPlayingHeroVideo && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl aspect-video bg-black">
            <video
              src={getMediaUrl("/Veggie%20collection/Veggie.mp4")}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setIsPlayingHeroVideo(false)}
              className="absolute -top-10 right-0 text-white font-bold uppercase tracking-widest text-xs hover:opacity-75"
            >
              Close [X]
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default VeggieCollection;
