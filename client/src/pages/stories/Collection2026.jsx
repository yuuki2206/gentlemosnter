import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { handleImageError } from "../../config/media";

/**
 * Collection2026 Component (2026 Bouquet, Origami & Featured Frames Collection featuring FKA Twigs)
 * 
 * PHẦN 1: HERO CAMPAIGN VIDEO
 * PHẦN 2: BOUQUET 02 SHOWCASE (Cột Trái Text, Cột Phải Khung Kính `col-span-8`)
 * PHẦN 3: ORIGAMI 02 SHOWCASE (Khung Kính Đặt Góc Trái `col-span-8`, Kính nhô sang phải -right-[30%])
 * PHẦN 4: VERTICAL HIGHLIGHT SHOWCASE (CREPE 01, GAMOT 01 (GR), MUSUBI 02 (BRG))
 * PHẦN 5: SHOP THE COLLECTION (Bảng Khung Đen 8 Ô Sản Phẩm Chuẩn 100% Theo Ảnh 2)
 * PHẦN 6: CAMPAIGN WITH FKA TWIGS (5 Ảnh Campaign Chuẩn 100% Pixel-Perfect Theo Screenshots 1, 2, 3)
 * PHẦN 7: POP-UP EVENT (Slider 3 Ảnh `img_popup_01-pc`, `_02-pc`, `_03-pc` + Nút Mũi Tên Đổi Slide `(→)`) & STORE LOCATIONS
 * PHẦN 8: CAMPAIGN STATEMENT & FOOTER
 */
const Collection2026 = ({ story }) => {
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  
  // State cho Bouquet 02
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // State cho Origami 02
  const [activeOrigamiSlide, setActiveOrigamiSlide] = useState(0);
  const [isOrigamiAnimating, setIsOrigamiAnimating] = useState(false);

  // State cho Pop-Up Event Slider (3 Slide Ảnh)
  const [activePopupSlide, setActivePopupSlide] = useState(0);

  const videoRef = useRef(null);

  // 3 Ảnh sản phẩm Bouquet-02 chính thức từ CDN Gentle Monster
  const bouquetSlides = [
    {
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/2026-collection/img_pd_bouquet-02_01.png?width=3000",
      label: "(A) Wraparound glasses in glossy silver mixed materials",
    },
    {
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/2026-collection/img_pd_bouquet-02_02.png?width=3000",
      label: "(B) Bead details combined with temple",
    },
    {
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/2026-collection/img_pd_bouquet-02_03.png?width=3000",
      label: "(C) Bouquet-inspired statement piece",
    },
  ];

  // 3 Ảnh sản phẩm Origami-02 chính thức từ CDN Gentle Monster
  const origamiSlides = [
    {
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/2026-collection/img_pd-pc_origami-02_01.png?width=3000",
      label: "(A) Metal knot details inspired by plant stems",
    },
    {
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/2026-collection/img_pd-pc_origami-02_02.png?width=3000",
      label: "(B) Temple that balance elevated aesthetics",
    },
    {
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/2026-collection/img_pd-pc_origami-02_03.png?width=3000",
      label: "(C) Oval glasses in glossy silver metal",
    },
  ];

  // 3 Mẫu kính điểm nhấn xếp dọc (Ảnh phóng bự tràn viền)
  const verticalHighlights = [
    {
      sku: "0P0M4JB81F0KW",
      name: "CREPE 01",
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/2026-collection/img_pd_crepe-01_01.jpg?width=3000",
      link: "/shop/0P0M4JB81F0KW",
    },
    {
      sku: "0P0M4JBBNF0QH",
      name: "GAMOT 01 (GR)",
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/2026-collection/img_pd_gamot-01-gr_01.jpg?width=3000",
      link: "/shop/0P0M4JBBNF0QH",
    },
    {
      sku: "0P0M4JBAXF0JB",
      name: "MUSUBI 02 (BRG)",
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/2026-collection/img_pd_musubi-02-brg_01.jpg?width=3000",
      link: "/shop/0P0M4JBAXF0JB",
    },
  ];

  // 8 Mẫu kính duy nhất trong Lưới Bảng SHOP THE COLLECTION
  const shopTheCollection = [
    {
      name: "Bouquet 02",
      price: "$375",
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/2026-collection/img_pd_bouquet-02_01.png?width=3000",
      link: "/shop/NEW_w90b6e",
    },
    {
      name: "Origami 02",
      price: "$295",
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/2026-collection/img_pd-pc_origami-02_02.png?width=3000",
      link: "/shop/0P0M4JBA0F0J4",
    },
    {
      name: "Crepe 01",
      price: "$305",
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/2026-collection/img_pd_crepe-01_01.jpg?width=3000",
      link: "/shop/0P0M4JB81F0KW",
    },
    {
      name: "Gamot 02(GR)",
      price: "$295",
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/2026-collection/img_pd_gamot-01-gr_01.jpg?width=3000",
      link: "/shop/0P0M4JBBNF0QH",
    },
    {
      name: "Musubi 02(BRG)",
      price: "$295",
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/2026-collection/img_pd_musubi-02-brg_01.jpg?width=3000",
      link: "/shop/0P0M4JBAXF0JB",
    },
    {
      name: "Tweed 01",
      price: "$305",
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/2026-collection/img_pd_tweed-01_01.jpg?width=3000",
      link: "/shop/0P0M4JB9NF0HR",
    },
    {
      name: "Ora T9",
      price: "$305",
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/2026-collection/img_pd_ora-t9_01.jpg?width=3000",
      link: "/shop/0P0M4JB71F0KN",
    },
    {
      name: "Futura 02",
      price: "$335",
      img: "https://gm-prd-resource.gentlemonster.com/assets/stories/2026-collection/img_pd_futura-02_01.jpg?width=3000",
      link: "/shop/0P0M4JB8XF0JV",
    },
  ];

  // 3 Slide Ảnh Không Gian Pop-Up Event từ CDN Gentle Monster
  const popupSlides = [
    "https://gm-prd-resource.gentlemonster.com/assets/stories/2026-collection/img_popup_01-pc.jpg",
    "https://gm-prd-resource.gentlemonster.com/assets/stories/2026-collection/img_popup_02-pc.jpg",
    "https://gm-prd-resource.gentlemonster.com/assets/stories/2026-collection/img_popup_03-pc.jpg",
  ];

  // Store locations data for Pop-Up section
  const storeLocations = [
    {
      name: "Gentle Monster New York",
      address: "70 Wooster St, New York, NY 10012",
      hours: "Mon–Sat 11:00AM – 7:00PM, Sun 12:00PM – 6:00PM",
    },
    {
      name: "Haus Dosan (Seoul)",
      address: "50, Apgujeong-ro 46-gil, Gangnam-gu, Seoul",
      hours: "Every Day 11:00AM – 9:00PM",
    },
    {
      name: "Haus Nowhere Shanghai",
      address: "798–812, Middle Huaihai Rd., Huangpu District, Shanghai",
      hours: "Every Day 10:00AM – 10:00PM",
    },
    {
      name: "Gentle Monster Beijing Taikoo Li",
      address: "L1-10, 1F, Bldg 1, No. 19 Sanlitun Rd, Chaoyang District, Beijing",
      hours: "Every Day 10:00AM – 10:00PM",
    },
    {
      name: "Gentle Monster Tokyo Aoyama",
      address: "5-7-22 Minamiaoyama, Minato City, Tokyo",
      hours: "Every Day 11:00AM – 8:00PM",
    },
    {
      name: "Gentle Monster Bangkok EmQuartier",
      address: "Level M, 693 Sukhumvit Rd, Khlong Tan Nuea, Watthana, Bangkok 10110",
      hours: "Every Day 10:00AM – 10:00PM",
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [story]);

  // Hàm chuyển đổi slide thủ công cho Bouquet 02
  const changeSlide = (nextIndex) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveSlide(nextIndex);
    setTimeout(() => {
      setIsAnimating(false);
    }, 850);
  };

  // Hàm chuyển đổi slide thủ công cho Origami 02
  const changeOrigamiSlide = (nextIndex) => {
    if (isOrigamiAnimating) return;
    setIsOrigamiAnimating(true);
    setActiveOrigamiSlide(nextIndex);
    setTimeout(() => {
      setIsOrigamiAnimating(false);
    }, 850);
  };

  // Cuộn xuất hiện tự động (Reveal on scroll)
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

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isPlayingVideo) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlayingVideo(!isPlayingVideo);
    }
  };

  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Bouquet 02 Index thumbnails (Top-Right / Bottom-Right)
  const topRightIdx = (activeSlide + 1) % bouquetSlides.length;
  const bottomRightIdx = (activeSlide + 2) % bouquetSlides.length;

  // Origami 02 Index thumbnails (Top-Left / Bottom-Left)
  const topLeftOrigamiIdx = (activeOrigamiSlide + 1) % origamiSlides.length;
  const bottomLeftOrigamiIdx = (activeOrigamiSlide + 2) % origamiSlides.length;

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased overflow-x-hidden">
      {/* Dynamic Keyframes cho hiệu ứng Breathing Nhịp Thở Bàn Phím & Animation Hướng Chéo */}
      <style>{`
        @keyframes breathePulse {
          0%, 100% {
            opacity: 0.25;
            letter-spacing: 0.02em;
          }
          50% {
            opacity: 1;
            letter-spacing: 0.06em;
          }
        }
        .animate-breathe {
          animation: breathePulse 2.8s ease-in-out infinite;
        }

        /* Animation đổi kính trượt từ TRÊN-PHẢI XUỐNG HƯỚNG CHÉO (Cho Bouquet 02) */
        @keyframes diagonalInFromTopRight {
          0% {
            opacity: 0;
            transform: translate3d(80px, -80px, 0) scale(0.93);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        /* Animation đổi kính trượt từ TRÊN-TRÁI XUỐNG HƯỚNG CHÉO (Cho Origami 02) */
        @keyframes diagonalInFromTopLeft {
          0% {
            opacity: 0;
            transform: translate3d(-80px, -80px, 0) scale(0.93);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        .glasses-diagonal-anim {
          animation: diagonalInFromTopRight 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .glasses-diagonal-left-anim {
          animation: diagonalInFromTopLeft 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <Header forceSolid={true} />

      {/* SECTION 1: HERO CAMPAIGN VIDEO SECTION */}
      <section className="relative w-full h-[85vh] md:h-[95vh] flex flex-col justify-between overflow-hidden bg-black">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            src="https://gm-prd-resource.gentlemonster.com/assets/stories/2026-collection/video_main-pc.mp4"
            className="w-full h-full object-cover object-center"
            loop
            muted={isMuted}
            playsInline
            autoPlay
          />
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        </div>

        <div className="h-20" />

        {/* Play/Pause & Mute/Unmute Controls */}
        <div className="absolute bottom-6 right-6 z-30 flex gap-3 items-center">
          <button
            type="button"
            onClick={toggleVideoPlay}
            aria-label={isPlayingVideo ? "Pause video" : "Play video"}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            {isPlayingVideo ? (
              <svg className="w-3.5 h-3.5" fill="white" viewBox="0 0 15 15">
                <path d="M4 2h2v11H4V2zm5 0h2v11H9V2z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="white" viewBox="0 0 15 15">
                <path d="M11.875 7.1875L2.96875 12.3295L2.96875 2.04547L11.875 7.1875Z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={toggleVideoMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            {isMuted ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 15 15">
                <path d="M12.2976 13.9562L10.4133 12.0719C10.1959 12.2111 9.96716 12.3317 9.72951 12.4325C9.48785 12.5351 9.23933 12.6207 8.98576 12.6887V11.72C9.11951 11.6721 9.24972 11.6229 9.37639 11.5725C9.50108 11.5233 9.62132 11.4635 9.73576 11.3938L7.49514 9.15312V11.8625L4.81451 9.1825H2.49514V6.0575H4.39889L1.37451 3.03312L2.03326 2.375L12.9564 13.2975L12.2976 13.9562ZM11.9926 10.5775L11.3208 9.90625C11.7835 9.17435 12.0159 8.32042 11.9879 7.45497C11.96 6.58951 11.6729 5.75237 11.1639 5.05188C10.6274 4.30743 9.86232 3.75873 8.98514 3.48937V2.52C10.1173 2.80858 11.1198 3.46885 11.832 4.395C12.3503 5.06503 12.6984 5.85071 12.8465 6.68472C12.9946 7.51873 12.9384 8.37623 12.6826 9.18375C12.5235 9.68036 12.2909 10.1497 11.9926 10.5775ZM10.0789 8.66375L8.98514 7.57V5.305C9.39802 5.5258 9.73751 5.86225 9.96201 6.27312C10.1909 6.68496 10.3097 7.14885 10.307 7.62C10.3074 7.8011 10.2883 7.98172 10.2501 8.15875C10.2123 8.33322 10.1549 8.50222 10.0789 8.66375ZM7.49451 6.07938L6.14639 4.72563L7.49514 3.375L7.49451 6.07938Z" fill="white" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 15 15">
                <path d="M1.5 5h3l3-3v11l-3-3h-3V5zm9.5 2.5c0-1.1-.4-2.1-1-3m1.5 8c.6-1.3 1-2.7 1-4.2 0-1.5-.4-2.9-1-4.2" stroke="white" strokeLinecap="round" strokeWidth="1.2" />
              </svg>
            )}
          </button>
        </div>
      </section>

      {/* SECTION 2: BOUQUET COLLECTION SHOWCASE (Cột Trái Text, Cột Phải Khung Kính Nhô Trái -left-[30%]) */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-28 overflow-visible">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start overflow-visible">
          
          {/* CỘT TRÁI: Editorial Typography */}
          <div className="lg:col-span-4 text-left space-y-6 max-w-[290px] lg:max-w-[320px] pt-0 z-30 relative">
            <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal tracking-tight uppercase text-black leading-[0.96] mb-8">
              BOUQUET<br />COLLECTION
            </h2>
            <div className="space-y-4 text-[12px] md:text-[13px] text-gray-800 leading-[1.65] font-light">
              <p>
                Gentle Monster unveils the 2026 Bouquet Collection with a campaign film by FKA Twigs.
              </p>
              <p>
                The Bouquet Collection introduces a range of frames characterized by unique loops, tangles, and knots—design elements drawn from natural botanical structures. The line is exemplified by a statement frame adorned with beadwork.
              </p>
            </div>
          </div>

          {/* CỘT PHẢI: Khung Trình Diễn Bouquet 02 */}
          <div className="lg:col-span-8 overflow-visible pl-4 lg:pl-12 mt-24 lg:mt-32">
            <div className="relative border border-black p-8 md:p-12 bg-white flex flex-col justify-between aspect-[1.18/1] w-full overflow-visible">
              
              {/* VÙNG 1: Kính Xem Trước Góc Trên Bên Phải */}
              <div
                onClick={() => changeSlide(topRightIdx)}
                className="absolute -top-6 -right-6 w-[48%] h-[42%] cursor-pointer z-30 transition-transform duration-500 hover:scale-105"
              >
                <img
                  src={bouquetSlides[topRightIdx].img}
                  alt="Top right preview"
                  onError={handleImageError}
                  className="w-full h-full object-contain object-top-right opacity-95 hover:opacity-100 transition-opacity"
                />
              </div>

              {/* VÙNG 2: Kính Xem Trước Góc Dưới Bên Phải */}
              <div
                onClick={() => changeSlide(bottomRightIdx)}
                className="absolute bottom-12 -right-6 w-[48%] h-[42%] cursor-pointer z-30 transition-transform duration-500 hover:scale-105"
              >
                <img
                  src={bouquetSlides[bottomRightIdx].img}
                  alt="Bottom right preview"
                  onError={handleImageError}
                  className="w-full h-full object-contain object-bottom-right opacity-95 hover:opacity-100 transition-opacity"
                />
              </div>

              {/* VÙNG 3: Kính Chính Trung Tâm (Nhô sang lề trái -left-[30%]) */}
              <div className="relative w-full h-[72%] flex items-center justify-center z-20 overflow-visible">
                {bouquetSlides.map((slide, idx) => {
                  if (idx !== activeSlide) return null;
                  return (
                    <img
                      key={`${idx}-${activeSlide}`}
                      src={slide.img}
                      alt={`Bouquet 02 Active View ${idx + 1}`}
                      onError={handleImageError}
                      className="w-[120%] max-w-none -left-[30%] relative h-full object-contain glasses-diagonal-anim"
                    />
                  );
                })}
              </div>

              {/* Chú thích loại gọng kính theo từng slide */}
              <div className="text-left mt-2 z-30">
                <p className="text-[11px] text-gray-800 font-sans tracking-wide">
                  {bouquetSlides[activeSlide].label}
                </p>
              </div>

              {/* Thanh Shop Now với Hiệu ứng Breathing nhịp thở bàn phím & Nút Mũi tên */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-100 z-30">
                <Link
                  to="/shop/NEW_w90b6e"
                  className="flex items-center text-xs font-serif tracking-widest text-black uppercase"
                >
                  <span className="font-bold">BOUQUET 02</span>
                  <span className="animate-breathe font-sans ml-2 text-gray-500 font-normal">
                    [Shop Now]
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => changeSlide((activeSlide + 1) % bouquetSlides.length)}
                  aria-label="Next slide"
                  className="w-8 h-8 rounded-full border border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: ORIGAMI COLLECTION SHOWCASE (Khung Nằm Góc TRÁI: col-span-8) */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-28 overflow-visible border-t border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start overflow-visible">
          
          {/* Khung Trình Diễn Origami 02 Nằm Ở Vị Trí Cột TRÁI col-span-8 */}
          <div className="lg:col-span-8 overflow-visible pr-4 lg:pr-12">
            <div className="relative border border-black p-8 md:p-12 bg-white flex flex-col justify-between aspect-[1.18/1] w-full overflow-visible">
              
              {/* VÙNG 1: Kính Xem Trước Góc Trên Bên TRÁI */}
              <div
                onClick={() => changeOrigamiSlide(topLeftOrigamiIdx)}
                className="absolute -top-6 -left-6 w-[48%] h-[42%] cursor-pointer z-30 transition-transform duration-500 hover:scale-105"
              >
                <img
                  src={origamiSlides[topLeftOrigamiIdx].img}
                  alt="Top left preview"
                  onError={handleImageError}
                  className="w-full h-full object-contain object-top-left opacity-95 hover:opacity-100 transition-opacity"
                />
              </div>

              {/* VÙNG 2: Kính Xem Trước Góc Dưới Bên TRÁI */}
              <div
                onClick={() => changeOrigamiSlide(bottomLeftOrigamiIdx)}
                className="absolute bottom-12 -left-6 w-[48%] h-[42%] cursor-pointer z-30 transition-transform duration-500 hover:scale-105"
              >
                <img
                  src={origamiSlides[bottomLeftOrigamiIdx].img}
                  alt="Bottom left preview"
                  onError={handleImageError}
                  className="w-full h-full object-contain object-bottom-left opacity-95 hover:opacity-100 transition-opacity"
                />
              </div>

              {/* VÙNG 3: Kính Chính Trung Tâm (Nhô sang lề PHẢI -right-[30%]) */}
              <div className="relative w-full h-[72%] flex items-center justify-center z-20 overflow-visible">
                {origamiSlides.map((slide, idx) => {
                  if (idx !== activeOrigamiSlide) return null;
                  return (
                    <img
                      key={`origami-${idx}-${activeOrigamiSlide}`}
                      src={slide.img}
                      alt={`Origami 02 Active View ${idx + 1}`}
                      onError={handleImageError}
                      className="w-[120%] max-w-none -right-[30%] relative h-full object-contain glasses-diagonal-left-anim"
                    />
                  );
                })}
              </div>

              {/* Chú thích loại gọng kính Origami 02 */}
              <div className="text-right mt-2 z-30">
                <p className="text-[11px] text-gray-800 font-sans tracking-wide">
                  {origamiSlides[activeOrigamiSlide].label}
                </p>
              </div>

              {/* Thanh Shop Now Origami 02 */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-100 z-30">
                <Link
                  to="/shop/0P0M4JBA0F0J4"
                  className="flex items-center text-xs font-serif tracking-widest text-black uppercase"
                >
                  <span className="font-bold">ORIGAMI 02</span>
                  <span className="animate-breathe font-sans ml-2 text-gray-500 font-normal">
                    [Shop Now]
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => changeOrigamiSlide((activeOrigamiSlide + 1) % origamiSlides.length)}
                  aria-label="Next slide"
                  className="w-8 h-8 rounded-full border border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4: VERTICAL HIGHLIGHT SHOWCASE (Ảnh kính PHÓNG BỰ TRÀN VIỀN `w-[150%]`, Đặt Góc Phải lg:col-start-5 col-span-8) */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-28 overflow-visible border-t border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start overflow-visible">
          
          {/* 3 Sản phẩm xếp dọc đặt ở góc bên phải (lg:col-start-5 col-span-8) với KÍNH PHÓNG BỰ */}
          <div className="lg:col-span-8 lg:col-start-5 overflow-visible pl-4 lg:pl-12 space-y-32 md:space-y-48">
            {verticalHighlights.map((item) => (
              <div key={item.sku} className="flex flex-col items-center text-center space-y-8 group overflow-visible">
                {/* Product Image Phóng Bự Tràn Viền Tỷ Lệ Cao */}
                <div className="w-full h-[380px] sm:h-[500px] md:h-[620px] flex items-center justify-center overflow-visible">
                  <img
                    src={item.img}
                    alt={item.name}
                    onError={handleImageError}
                    className="w-[135%] md:w-[150%] max-w-none object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Bottom Label & Action Bar */}
                <div className="flex items-center justify-between w-full max-w-md px-4 border-t border-gray-100 pt-6 z-30 relative">
                  <Link
                    to={item.link}
                    className="flex items-center text-xs font-serif tracking-widest text-black uppercase"
                  >
                    <span className="font-bold">{item.name}</span>
                    <span className="animate-breathe font-sans ml-2 text-gray-500 font-normal">
                      [Shop Now]
                    </span>
                  </Link>

                  <Link
                    to={item.link}
                    aria-label={`Shop ${item.name}`}
                    className="w-8 h-8 rounded-full border border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 5: SHOP THE COLLECTION GRID TABLE */}
      <section className="max-w-4xl mx-auto px-6 py-24 border-t border-gray-100 text-center">
        {/* Title */}
        <h2 className="font-serif text-base sm:text-lg md:text-xl font-normal tracking-[0.25em] uppercase text-black mb-12">
          SHOP THE COLLECTION
        </h2>

        {/* 8 Product Grid Table Container with Black Border */}
        <div className="border border-black grid grid-cols-2 md:grid-cols-4 w-full bg-white overflow-hidden">
          {shopTheCollection.map((item, idx) => {
            const isRightEdgeMobile = (idx + 1) % 2 === 0;
            const isRightEdgeDesktop = (idx + 1) % 4 === 0;
            const isBottomRowMobile = idx >= 6;
            const isBottomRowDesktop = idx >= 4;

            return (
              <Link
                key={item.name}
                to={item.link}
                className={`group p-4 sm:p-6 md:p-8 flex flex-col items-center justify-between aspect-[1.1/1] bg-white transition-colors duration-300 hover:bg-gray-50/80 border-b border-r border-black ${
                  isRightEdgeMobile ? "border-r-0 md:border-r" : ""
                } ${
                  isRightEdgeDesktop ? "md:border-r-0" : ""
                } ${
                  isBottomRowMobile ? "border-b-0" : ""
                } ${
                  isBottomRowDesktop ? "md:border-b-0" : ""
                }`}
              >
                {/* Product Image */}
                <div className="w-full h-[72%] flex items-center justify-center overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.name}
                    onError={handleImageError}
                    className="max-w-full max-h-full object-contain transition-transform duration-500 ease-out group-hover:scale-108"
                  />
                </div>

                {/* Product Name & Price Tag */}
                <div className="text-center mt-3">
                  <p className="font-serif text-[11px] sm:text-[12px] text-black tracking-wide font-normal">
                    {item.name} <span className="font-mono text-gray-700">({item.price})</span>
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View Entire Collection Action Link */}
        <div className="mt-12">
          <Link
            to="/shop"
            className="inline-block font-serif text-xs sm:text-sm tracking-[0.22em] uppercase text-black hover:opacity-60 transition-opacity"
          >
            &#123;VIEW ENTIRE COLLECTION&#125;
          </Link>
        </div>
      </section>

      {/* SECTION 6: CAMPAIGN WITH. FKA TWIGS (Bố cục chuẩn 100% theo Screenshots 1, 2, 3) */}
      <section className="max-w-5xl mx-auto px-6 py-24 border-t border-gray-100">
        
        {/* ROW 1 (Screenshot 1): Header Text Bên Trái + Campaign Portrait 01 Bên Phải */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-24 md:mb-32">
          {/* Cột Trái: Text Block */}
          <div className="lg:col-span-5 text-left space-y-6 pt-2">
            <h2 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight uppercase text-black leading-[0.98]">
              CAMPAIGN<br />WITH. FKA TWIGS
            </h2>
            <p className="text-[11px] md:text-[12px] text-gray-700 leading-relaxed font-light max-w-sm">
              Co-directed by FKA Twigs and Jordan Hemingway, the Bouquet Collection campaign reimagines a flower's bloom through dynamic performance, expressing nature's transcendent power within an ethereal, electric dreamscape.
            </p>
          </div>

          {/* Cột Phải: Ảnh Chân Dung FKA Twigs Looking Direct (img_campaign_01-pc.jpg) */}
          <div className="lg:col-span-7">
            <div className="w-full aspect-[4/5] bg-gray-50 overflow-hidden">
              <img
                src="https://gm-prd-resource.gentlemonster.com/assets/stories/2026-collection/img_campaign_01-pc.jpg"
                alt="FKA Twigs Campaign 01"
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* ROW 2 (Screenshot 2): 2 Ảnh Liền Khối Không Khoảng Cách (gap-0) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 w-full mb-24 md:mb-32 overflow-hidden">
          <div className="w-full aspect-[4/5] bg-gray-50 overflow-hidden">
            <img
              src="https://gm-prd-resource.gentlemonster.com/assets/stories/2026-collection/img_campaign_02-pc.jpg"
              alt="FKA Twigs Pink Rose Pose"
              onError={handleImageError}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full aspect-[4/5] bg-gray-50 overflow-hidden">
            <img
              src="https://gm-prd-resource.gentlemonster.com/assets/stories/2026-collection/img_campaign_03-pc.jpg"
              alt="FKA Twigs Calla Lily Pose"
              onError={handleImageError}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* ROW 3 (Screenshot 3): Bố cục Lệch Nhịp Staggered Offset (Ảnh Trái Lớn Vuông/Portrait + Ảnh Phải Nhỏ Đặt So Le Xuống Dưới) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start w-full">
          {/* Ảnh Trái: Close-up Găng Tay Kính Vàng (img_campaign_04-pc.jpg) */}
          <div className="md:col-span-7">
            <div className="w-full aspect-[1/1] sm:aspect-[4/5] bg-gray-50 overflow-hidden">
              <img
                src="https://gm-prd-resource.gentlemonster.com/assets/stories/2026-collection/img_campaign_04-pc.jpg"
                alt="FKA Twigs Close-up Gloves Pose"
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Ảnh Phải: Toàn Thân Thon Nhỏ Đặt So Le Xuống Dưới (img_campaign_05-pc.jpg) */}
          <div className="md:col-span-5 pt-12 md:pt-36">
            <div className="w-[85%] md:w-full aspect-[3/5] bg-gray-50 overflow-hidden">
              <img
                src="https://gm-prd-resource.gentlemonster.com/assets/stories/2026-collection/img_campaign_05-pc.jpg"
                alt="FKA Twigs Full Body Pose"
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

      </section>

      {/* SECTION 7: POP-UP EVENT (Slider 3 Ảnh `img_popup_01-pc`, `_02-pc`, `_03-pc` + Nút Mũi Tên Đổi Slide `(→)`) & STORE LOCATIONS */}
      <section className="max-w-5xl mx-auto px-6 py-24 border-t border-gray-100 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight uppercase text-black mb-4">
          POP-UP EVENT
        </h2>
        <p className="text-xs md:text-sm text-gray-700 font-light max-w-xl mx-auto leading-relaxed mb-12">
          To commemorate the Bouquet Collection, Gentle Monster unveils immersive pop-up spaces across six cities worldwide.
        </p>

        {/* Interactive 3-Slide Pop-up Showcase (Matching User Screenshot) */}
        <div className="relative max-w-4xl mx-auto mb-20">
          <div className="w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] bg-gray-50 overflow-hidden border border-gray-100 cursor-pointer"
               onClick={() => setActivePopupSlide((prev) => (prev + 1) % popupSlides.length)}>
            <img
              src={popupSlides[activePopupSlide]}
              alt={`Gentle Monster Bouquet Pop-Up Space ${activePopupSlide + 1}`}
              onError={handleImageError}
              className="w-full h-full object-cover transition-all duration-700 ease-out"
            />
          </div>

          {/* Next Slide Arrow Button (Bottom Right) */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={() => setActivePopupSlide((prev) => (prev + 1) % popupSlides.length)}
              aria-label="Next pop-up slide"
              className="w-9 h-9 rounded-full border border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300 shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Store Location Table / Grid (Matching Screenshot 4) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left border-t border-gray-200 pt-12">
          <div className="md:col-span-3">
            <h3 className="font-serif text-sm font-bold tracking-widest uppercase text-black">
              Store Location
            </h3>
          </div>

          <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 text-[11px] md:text-[12px] font-sans">
            {storeLocations.map((loc) => (
              <div key={loc.name} className="space-y-1">
                <p className="font-bold text-black">{loc.name}</p>
                <p className="text-gray-600 font-light leading-relaxed">{loc.address}</p>
                <p className="text-gray-500 font-mono text-[10px] pt-0.5">{loc.hours}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: CAMPAIGN STATEMENT */}
      <section className="w-full bg-[#fcfcfc] py-24 border-t border-gray-100 reveal-on-scroll">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-gray-400 block">
            2026 COLLECTION
          </span>
          <h3 className="text-2xl md:text-3xl font-serif font-light text-black leading-relaxed italic max-w-2xl mx-auto">
            "Botanical structures meets avant-garde eyewear artistry."
          </h3>
          <div className="w-12 h-[1px] bg-black/20 mx-auto" />
          <p className="text-xs text-gray-600 max-w-xl mx-auto leading-relaxed font-light">
            Crafted from glossy silver mixed materials, bead details, and intricate temple loops embodying organic flowers in bloom.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Collection2026;
