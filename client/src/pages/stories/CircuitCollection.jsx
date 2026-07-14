import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getMediaUrl } from "../../config/media";

/**
 * CircuitCollection Component
 * 
 * KIẾN THỨC NỀN TẢNG:
 * 1. HTML5 Video Autoplay & Custom Controllers (useRef):
 *    - Trình duyệt hiện đại chặn tự động phát video có tiếng để tránh làm phiền người dùng.
 *    - Giải pháp: Gán mặc định `muted` và `autoPlay` trực tiếp trên thẻ video. 
 *    - Kỹ thuật điều khiển: Sử dụng React `useRef` trỏ trực tiếp đến phần tử DOM của video để kích hoạt `.play()` / `.pause()`
 *      và bật/tắt tiếng `.muted` thủ công bằng nút điều khiển riêng, tăng độ tin cậy và không phụ thuộc thư viện ngoài.
 * 
 * 2. Custom Swiper Carousel (Không phụ thuộc thư viện):
 *    - Sử dụng một container cha có `overflow-hidden` làm khung nhìn (viewport) và một track chứa slide chạy ngang (`display: flex`).
 *    - Sử dụng `transform: translateX(-SlideIndex * 100%)` kết hợp với `transition` trong CSS để trượt mượt mà.
 *    - Thích ứng Resize: Loại bỏ `aspect-ratio` cứng trên từng slide con, cho phép chúng thừa hưởng chiều cao 100% từ container cha.
 *      Khi kích thước màn hình thay đổi, các slide tự động co giãn ôm sát theo container cha mà không bị lệch lề hay vỡ dòng.
 * 
 * 3. CSS Clip-Path Hover Wipe Effect (Hiệu ứng quét màu):
 *    - Tạo ra hai lớp thông tin chồng khít lên nhau: lớp nền xám dưới và lớp phủ trắng trên.
 *    - Lớp phủ trắng được ẩn bằng `clip-path: inset(0 100% 0 0)` (bị cắt hết từ phải qua trái).
 *    - Khi hover vào thẻ sản phẩm, lớp phủ này chuyển đổi `clip-path` về `inset(0 0 0 0)` giúp chữ và viền trắng được tiết lộ
 *      theo kiểu quét ngang cực kỳ tinh tế và mượt mà.
 * 
 * 4. Resizing Protection (Chống sập và lệch layout):
 *    - Toàn bộ video nền (`hero` và `3d`) được đưa về trạng thái `absolute inset-0 w-full h-full object-cover`
 *      nằm trong các khung chứa cha có định vị `relative` và khai báo `aspect-ratio` rõ ràng trong CSS.
 *    - Giúp video luôn giữ đúng tỉ lệ gốc khi người dùng kéo thả thay đổi kích thước trình duyệt liên tục.
 */
const CircuitCollection = ({ story }) => {
  const [isHeroPlaying, setIsHeroPlaying] = useState(true);
  const [isHeroMuted, setIsHeroMuted] = useState(true);
  const [is3DPlaying, setIs3DPlaying] = useState(true);
  const [is3DMuted, setIs3DMuted] = useState(true);
  const [popupSlide, setPopupSlide] = useState(0);

  const heroVideoRef = useRef(null);
  const video3DRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [story]);

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

  // Điều khiển Play/Pause cho Hero Video
  const toggleHeroPlay = () => {
    if (heroVideoRef.current) {
      if (isHeroPlaying) {
        heroVideoRef.current.pause();
      } else {
        heroVideoRef.current.play().catch(() => {});
      }
      setIsHeroPlaying(!isHeroPlaying);
    }
  };

  // Điều khiển Mute/Unmute cho Hero Video
  const toggleHeroMute = () => {
    if (heroVideoRef.current) {
      heroVideoRef.current.muted = !isHeroMuted;
      setIsHeroMuted(!isHeroMuted);
    }
  };

  // Điều khiển Play/Pause cho 3D Rotating Video
  const toggle3DPlay = () => {
    if (video3DRef.current) {
      if (is3DPlaying) {
        video3DRef.current.pause();
      } else {
        video3DRef.current.play().catch(() => {});
      }
      setIs3DPlaying(!is3DPlaying);
    }
  };

  // Điều khiển Mute/Unmute cho 3D Rotating Video
  const toggle3DMute = () => {
    if (video3DRef.current) {
      video3DRef.current.muted = !is3DMuted;
      setIs3DMuted(!is3DMuted);
    }
  };

  const totalSlides = 7;
  const handlePrev = () => {
    if (popupSlide > 0) setPopupSlide(popupSlide - 1);
  };
  const handleNext = () => {
    if (popupSlide < totalSlides - 1) setPopupSlide(popupSlide + 1);
  };

  return (
    <div className="min-h-screen bg-[#111] text-[#C9CFDA] font-sans antialiased overflow-x-hidden lang-en">
      <Header forceTransparent={true} />

      <div className="story-detail" id="circuit-collection">
        <h1 className="hidden">circuit-collection</h1>

        {/* SECTION 0: Circuit Main Section (Hero Video) */}
        <section className="flex flex-col mobile:pb-[10px]" data-sentry-component="CircuitMainSection">
          <div className="circuit-hero-container">
            <video
              ref={heroVideoRef}
              src={getMediaUrl("/Circuit%20collection/main_pc.mp4")}
              className="w-full absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full object-cover"
              loop
              muted={isHeroMuted}
              playsInline
              autoPlay
            />
            
            <div className="absolute bottom-[-1px] left-0 w-full h-[120px] bg-gradient-to-t from-[#111] to-transparent pointer-events-none z-10"></div>
            
            <div className="absolute bottom-0 right-0 flex p-[24px] desktop:p-[36px] z-30 gap-3">
              {/* PlayButton */}
              <button
                aria-label={isHeroPlaying ? "Pause video" : "Play video"}
                className="flex h-[44px] w-[44px] desktop:h-[48px] desktop:w-[48px] items-center justify-center cursor-pointer z-30"
                type="button"
                onClick={toggleHeroPlay}
              >
                {isHeroPlaying ? (
                  <svg className="w-[15px] h-[15px] desktop:w-[20px] desktop:h-[20px]" fill="none" viewBox="0 0 15 15">
                    <path d="M4 2h2v11H4V2zm5 0h2v11H9V2z" fill="white"></path>
                  </svg>
                ) : (
                  <svg className="w-[15px] h-[15px] desktop:w-[20px] desktop:h-[20px]" fill="none" viewBox="0 0 15 15">
                    <path d="M11.875 7.1875L2.96875 12.3295L2.96875 2.04547L11.875 7.1875Z" fill="white"></path>
                  </svg>
                )}
              </button>

              {/* MuteButton */}
              <button
                aria-label={isHeroMuted ? "Unmute" : "Mute"}
                className="flex h-[44px] w-[44px] desktop:h-[48px] desktop:w-[48px] items-center justify-center cursor-pointer z-30"
                type="button"
                onClick={toggleHeroMute}
              >
                {isHeroMuted ? (
                  <svg className="w-[15px] h-[15px] desktop:w-[20px] desktop:h-[20px]" fill="none" viewBox="0 0 15 15">
                    <g clipPath="url(#clip0_1120_120)">
                      <path d="M12.2976 13.9562L10.4133 12.0719C10.1959 12.2111 9.96716 12.3317 9.72951 12.4325C9.48785 12.5351 9.23933 12.6207 8.98576 12.6887V11.72C9.11951 11.6721 9.24972 11.6229 9.37639 11.5725C9.50108 11.5233 9.62132 11.4635 9.73576 11.3938L7.49514 9.15312V11.8625L4.81451 9.1825H2.49514V6.0575H4.39889L1.37451 3.03312L2.03326 2.375L12.9564 13.2975L12.2976 13.9562ZM11.9926 10.5775L11.3208 9.90625C11.7835 9.17435 12.0159 8.32042 11.9879 7.45497C11.96 6.58951 11.6729 5.75237 11.1639 5.05188C10.6274 4.30743 9.86232 3.75873 8.98514 3.48937V2.52C10.1173 2.80858 11.1198 3.46885 11.832 4.395C12.3503 5.06503 12.6984 5.85071 12.8465 6.68472C12.9946 7.51873 12.9384 8.37623 12.6826 9.18375C12.5235 9.68036 12.2909 10.1497 11.9926 10.5775ZM10.0789 8.66375L8.98514 7.57V5.305C9.39802 5.5258 9.73751 5.86225 9.96201 6.27312C10.1909 6.68496 10.3097 7.14885 10.307 7.62C10.3074 7.8011 10.2883 7.98172 10.2501 8.15875C10.2123 8.33322 10.1549 8.50222 10.0789 8.66375ZM7.49451 6.07938L6.14639 4.72563L7.49514 3.375L7.49451 6.07938Z" fill="white"></path>
                    </g>
                    <defs><clipPath id="clip0_1120_120"><rect fill="white" height="15" width="15"></rect></clipPath></defs>
                  </svg>
                ) : (
                  <svg className="w-[15px] h-[15px] desktop:w-[20px] desktop:h-[20px]" fill="none" viewBox="0 0 15 15">
                    <path d="M1.5 5h3l3-3v11l-3-3h-3V5zm9.5 2.5c0-1.1-.4-2.1-1-3m1.5 8c.6-1.3 1-2.7 1-4.2 0-1.5-.4-2.9-1-4.2" stroke="white" strokeLinecap="round" strokeWidth="1.2"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Logo vector và đoạn giới thiệu */}
          <div className="desktop:mt-[80px] mt-[20px] desktop:mb-[60px] mb-[48px] flex items-center justify-center mobile:px-[24px] reveal-on-scroll">
            <svg className="w-[327px] h-[32px] desktop:w-[538px] desktop:h-[52px]" fill="none" height="32" viewBox="0 0 327 32" width="327" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_519_6634)">
                <path d="M82.7643 20.9723L75.5926 27.8874H66.4429L77.8262 16.6588C82.0579 12.4924 84.0964 11.8103 91.3152 11.8103H119.814L113.631 17.8292H92.1293C86.7404 17.8292 85.5899 18.2438 82.7643 20.9657M112.703 18.7922H92.2571C86.8278 18.7922 85.9801 19.2068 83.5178 21.6545L77.2476 27.8874H85.7312L87.7495 25.8811C89.0816 24.5569 89.6804 24.4298 92.3647 24.4298H107.031L112.703 18.7922ZM114.916 27.8874L131.13 11.8103H121.058L104.885 27.8874H114.916Z" fill="white"></path>
                <path d="M121.725 27.8873C121.213 27.8873 120.789 27.7201 120.453 27.3791C120.117 27.038 119.948 26.6234 119.948 26.1285C119.948 25.6336 120.117 25.219 120.453 24.8779C120.789 24.5435 121.213 24.3696 121.725 24.3696C122.236 24.3696 122.66 24.5368 122.989 24.8779C123.326 25.219 123.487 25.6336 123.487 26.1285C123.487 26.6234 123.319 27.038 122.989 27.3791C122.66 27.7134 122.236 27.8873 121.725 27.8873ZM121.718 24.6505C121.301 24.6505 120.951 24.7976 120.668 25.0852C120.386 25.3728 120.244 25.7205 120.244 26.1352C120.244 26.5498 120.386 26.8976 120.668 27.1784C120.951 27.466 121.301 27.6131 121.718 27.6131C122.135 27.6131 122.485 27.4727 122.767 27.1851C123.05 26.8976 123.191 26.5498 123.191 26.1352C123.191 25.7205 123.05 25.3728 122.767 25.0852C122.485 24.7976 122.135 24.6505 121.718 24.6505ZM121.368 26.4227V27.1116H120.978V25.1588H121.718C121.973 25.1588 122.162 25.2056 122.29 25.2992C122.418 25.3928 122.478 25.5333 122.478 25.7272C122.478 25.9212 122.451 26.0549 122.404 26.1485C122.35 26.2422 122.263 26.3157 122.142 26.3692L122.512 27.1116H122.101L121.765 26.4227H121.368ZM121.361 25.4597V26.1151H121.758C121.879 26.1151 121.967 26.0883 122.021 26.0348C122.074 25.9813 122.101 25.9011 122.101 25.7807C122.101 25.56 121.96 25.453 121.684 25.453H121.361V25.4597Z" fill="white"></path>
                <path d="M31.6405 30.1611H31.6338L31.0687 28.4758H30.3286V30.9235H30.8265V29.2048H30.8332L31.4185 30.9235H31.8222L32.4075 29.1847H32.4142V30.9235H32.9053V28.4758H32.172L31.6405 30.1611Z" fill="white"></path>
                <path d="M28.0881 28.9306H28.8013V30.9235H29.3328V28.9306H30.0526V28.4758H28.0881V28.9306Z" fill="white"></path>
                <path d="M35.3003 11.5362C33.5242 13.616 30.4765 13.9905 27.6509 12.7065C29.2185 14.6526 30.1671 17.1137 30.1671 19.7887C30.1671 26.1955 24.7983 31.5054 18.3465 31.5054C11.8946 31.5054 6.62008 26.2958 6.62008 19.8823C6.62008 17.2073 7.52832 14.7329 9.06224 12.7667C6.1895 13.9772 2.82565 13.4957 1.18409 11.3957C-0.901501 8.72739 -0.195092 4.26674 3.0073 1.83913C6.25005 -0.621914 10.3001 -0.621914 12.4732 1.9127C14.3166 4.0728 14.3637 7.13573 12.7894 9.62353C14.4309 8.74076 16.3147 8.23919 18.3061 8.23919C20.2975 8.23919 22.3427 8.76751 24.0583 9.70378C22.4638 7.2628 22.4033 4.11961 24.0247 2.05314C26.0833 -0.575101 30.8533 -0.675415 33.9682 1.94613C37.0831 4.56768 37.655 8.78757 35.307 11.5429" fill="white"></path>
                <path d="M56.6003 16.1908L55.3287 14.9202L51.6419 18.585L47.9551 14.9202L46.6769 16.1908L50.3637 19.8489L46.6769 23.5138L47.9551 24.7844L51.6419 21.1196L55.3287 24.7844L56.6003 23.5138L52.9202 19.8489L56.6003 16.1908Z" fill="white"></path>
                <path d="M188.933 20.6915C188.933 16.7525 191.288 14.7195 195.123 14.4119C196.589 14.4787 197.807 14.7529 198.514 15.0806L198.615 16.9799H198.366C197.182 15.8497 196.112 15.5889 195.008 15.5889C192.869 15.5889 191.342 17.1605 191.342 20.1699C191.342 23.1793 192.788 25.1121 195.358 25.1121H196.657V21.0393L194.665 21.1998V20.0562H199.092V20.2702C198.783 20.8721 198.662 21.1062 198.662 21.5275V25.6337C198.265 25.7942 196.838 26.2356 194.733 26.2356C191.456 26.2356 188.94 23.9952 188.94 20.6915H188.933Z" fill="white"></path>
                <path d="M201.481 24.7308V15.9634C201.481 15.6357 201.366 15.4417 200.969 14.8331V14.6191H207.751V15.9299H207.535C206.93 15.6825 206.634 15.5688 206.25 15.5688H203.586V19.7084L206.661 19.5279V20.7517L203.586 20.5912V25.1521L206.055 25.0719C206.964 25.0385 207.421 24.9114 207.946 24.5636L208.175 24.664L207.798 26.0684H200.969V25.8543C201.366 25.2525 201.481 25.0518 201.481 24.7241V24.7308Z" fill="white"></path>
                <path d="M210.085 24.7307V15.8028C210.085 15.5085 209.971 15.3279 209.574 14.8397V14.6257H211.579L217.499 22.7244H217.6V15.9699C217.6 15.6423 217.519 15.4483 217.156 14.8397V14.6257H219.262V14.8397C218.885 15.4483 218.831 15.6423 218.831 15.9699V26.0749H217.284C217.17 25.8275 217.035 25.6001 216.853 25.3527L211.411 17.9762H211.31V24.7307C211.31 25.0584 211.391 25.2524 211.754 25.8609V26.0749H209.635V25.8609C209.998 25.2591 210.079 25.0584 210.079 24.7307H210.085Z" fill="white"></path>
                <path d="M223.877 24.7308V15.5688H221.966C221.59 15.5688 221.26 15.7493 220.829 15.9433H220.614V14.6191H229.205V15.9433H228.99C228.56 15.7493 228.23 15.5688 227.853 15.5688H225.942V24.7308C225.942 25.0585 226.057 25.2525 226.454 25.861V26.075H223.359V25.861C223.756 25.2591 223.87 25.0585 223.87 24.7308H223.877Z" fill="white"></path>
                <path d="M231.163 24.7308V15.9634C231.163 15.6357 231.049 15.4417 230.652 14.8331V14.6191H233.78V14.8331C233.383 15.4417 233.269 15.6357 233.269 15.9634V25.1521L235.637 25.0719C236.626 25.0385 237.05 24.9114 237.548 24.5636L237.777 24.664L237.4 26.0684H230.652V25.8543C231.049 25.2525 231.163 25.0518 231.163 24.7241V24.7308Z" fill="white"></path>
                <path d="M239.62 24.7308V15.9634C239.62 15.6357 239.506 15.4417 239.109 14.8331V14.6191H245.89V15.9299H245.675C245.069 15.6825 245.767 15.5688 244.39 15.5688H241.726V19.7084L244.8 19.5279V20.7517L241.726 20.5912V25.1521L244.195 25.0719C245.096 25.0385 245.561 24.9114 246.085 24.5636L246.314 24.664L245.937 26.0684H239.109V25.8543C239.506 25.2525 239.62 25.0518 239.62 24.7241V24.7308Z" fill="white"></path>
                <path d="M252.369 24.7308V15.9634C252.369 15.6357 252.255 15.4417 251.858 14.8331V14.6191H254.246L257.933 23.3866H258.034L261.882 14.6191H264.284V14.8331C263.887 15.4417 263.772 15.9634 263.772 15.9634V24.7308C263.772 25.0585 263.887 25.2525 264.284 25.861V26.075H261.223V25.861C261.62 25.2591 261.734 25.0585 261.734 24.7308V18.1101H261.633L258.094 26.075H257.173L253.701 18.1101H253.6V24.7308C253.6 25.0585 253.681 25.2525 254.044 25.861V26.075H251.925V25.861C252.288 25.2591 252.369 25.0585 252.369 24.7308Z" fill="white"></path>
                <path d="M269.921 26.269C267.419 25.4665 266.019 23.1927 266.019 20.511C266.019 16.7993 268.408 14.345 272.337 14.345C272.895 14.345 273.454 14.3784 274.012 14.4587C276.219 15.114 277.847 17.3878 277.847 20.0696C277.847 23.8949 275.606 26.3827 271.61 26.3827C271.052 26.3827 270.426 26.3493 269.915 26.269H269.921ZM272.343 25.3194C274.644 25.3194 275.506 23.3599 275.506 21.0527C275.506 18.1435 274.355 15.3949 271.543 15.3949C269.06 15.3949 268.381 17.6487 268.381 20.0896C268.381 22.9051 269.747 25.326 272.343 25.326V25.3194Z" fill="white"></path>
                <path d="M280.06 24.7307V15.8028C280.06 15.5085 279.946 15.3279 279.549 14.8397V14.6257H281.554L287.474 22.7244H287.575V15.9699C287.575 15.6423 287.494 15.4483 287.131 14.8397V14.6257H289.237V14.8397C288.86 15.4483 288.806 15.6423 288.806 15.9699V26.0749H287.259C287.145 25.8275 287.01 25.6001 286.828 25.3527L281.386 17.9762H281.285V24.7307C281.285 25.0584 281.366 25.2524 281.729 25.8609V26.0749H279.61V25.8609C279.973 25.2591 280.054 25.0584 280.054 24.7307H280.06Z" fill="white"></path>
                <path d="M291.215 25.841L290.966 23.7611H291.248C291.921 24.6104 292.897 25.2658 293.946 25.2658C294.996 25.2658 295.769 24.5971 295.769 23.5806C295.769 22.8784 295.258 22.1762 293.549 21.0125C292.002 19.9626 291.046 19.0664 291.046 17.5751C291.046 15.4952 292.675 14.4319 294.915 14.4319C295.574 14.4319 296.772 14.6258 297.236 14.8064L297.35 16.505H297.088C296.725 15.9834 296.097 15.4752 294.767 15.4752C293.684 15.4752 292.957 16.0637 292.957 16.9331C292.957 17.8024 293.65 18.518 295.097 19.5479C297.101 20.9724 297.727 21.7749 297.727 23.1459C297.727 25.3528 295.803 26.2355 293.764 26.2355C293.004 26.2355 291.908 26.055 291.215 25.8276V25.841Z" fill="white"></path>
                <path d="M302.02 24.7308V15.5688H300.109C299.732 15.5688 299.402 15.7493 298.972 15.9433H298.757V14.6191H307.348V15.9433H307.133C306.702 15.7493 306.372 15.5688 305.996 15.5688H304.085V24.7308C304.085 25.0585 304.199 25.2525 304.596 25.861V26.075H301.501V25.861C301.898 25.2591 302.013 25.0585 302.013 24.7308H302.02Z" fill="white"></path>
                <path d="M309.312 24.7308V15.9634C309.312 15.6357 309.198 15.4417 308.801 14.8331V14.6191H315.583V15.9299H315.367C314.762 15.6825 314.459 15.5688 314.082 15.5688H311.418V19.7084L314.493 19.5279V20.7517L311.418 20.5912V25.1521L313.887 25.0719C314.789 25.0385 315.253 24.9114 315.778 24.5636L316.006 24.664L315.63 26.0684H308.801V25.8543C309.198 25.2525 309.312 25.0518 309.312 24.7241V24.7308Z" fill="white"></path>
                <path d="M326.434 25.8543V26.0684H323.851C323.817 25.8744 323.669 25.5267 323.521 25.2525L321.133 20.9858L319.996 20.9523V24.7308C319.996 25.0585 320.11 25.2525 320.507 25.861V26.075H317.446V25.861C317.843 25.2591 317.957 25.0585 317.957 24.7308V15.9634C317.957 15.6357 317.843 15.4417 317.446 14.8331V14.6191H321.987C323.649 14.6191 325.344 15.9099 325.344 17.8894C325.344 19.2604 324.604 20.0829 323.252 20.8854L325.607 25.0251C325.789 25.3528 326.085 25.6604 326.428 25.861L326.434 25.8543ZM321.187 20.0495C322.29 20.0161 323.279 19.3139 323.279 17.856C323.279 16.398 322.438 15.6156 321.16 15.5822L320.009 15.5487V20.0762L321.194 20.0428L321.187 20.0495Z" fill="white"></path>
              </g>
              <defs>
                <clipPath id="clip0_519_6634">
                  <rect fill="white" height="32" width="327"></rect>
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="flex items-center justify-center">
            <p className="bodyText circuit-main-desc text-[#C9CFDA] max-w-[700px] text-center px-6 leading-relaxed">
              Gentle Monster presents the Circuit Collection through a global collaboration with Disney × F1®. The collection reinterprets the structural language of racing cars through Gentle Monster’s unique perspective, proposing a bold aesthetic that transcends the boundaries of sports and fashion.
              <br/><br/>
              In the campaign, the speed of the racing track and the vibrant spirit of ‘Mickey and Friends’ reveal an experimental and bold approach, delivering a powerful and immersive experience.
            </p>
          </div>
        </section>

        {/* SECTION 1: Campaign Editorial Grid */}
        <section className="circuit-campaign-section flex flex-col gap-[80px] desktop:gap-[120px] reveal-on-scroll" data-sentry-component="CircuitCampaignSection">
          <div className="flex flex-row">
            <div className="mobile:hidden desktop:flex-[470]"></div>
            <div className="circuit-campaign-item flex flex-col gap-[12px] desktop:gap-[32px] desktop:flex-[750] flex-[351]">
              <Link to="/sunglasses">
                <picture>
                  <source media="(max-width: 767px)" srcSet="https://gm-prd-resource.gentlemonster.com/assets/stories/circuit-collection/campaign_product_1_mo.jpg" />
                  <img alt="Wing 4 N8" className="w-full h-auto object-cover desktop:aspect-[750/937] mobile:aspect-[351/439]" src="https://gm-prd-resource.gentlemonster.com/assets/stories/circuit-collection/campaign_product_1_pc.jpg" />
                </picture>
              </Link>
              <div className="flex flex-row">
                <div className="mobile:flex-[24]"></div>
                <Link className="circuit-campaign-info relative flex-[327]" to="/sunglasses">
                  <div className="circuit-campaign-info-base flex items-center gap-[12px] flex-row">
                    <div className="flex items-center gap-[6px] flex-row">
                      <p className="px-[5px] rounded-br-[6px] w-[20px] h-[20px] text-[16px] leading-[20px] text-[#111] lining-nums tabular-nums block bg-[#9CA3AF] font-bold">1</p>
                      <h2 className="text-[20px] leading-[20px] text-[#9CA3AF] font-sans">Wing 4 N8</h2>
                    </div>
                    <div className="flex items-center justify-center cursor-pointer px-[6px] py-[4px] rounded-[13px] border border-[#9CA3AF]">
                      <span className="ctaText text-[#9CA3AF]">Shop now</span>
                    </div>
                  </div>
                  <div className="circuit-campaign-info-overlay absolute inset-0 overflow-hidden flex items-center gap-[12px] flex-row">
                    <div className="flex items-center gap-[6px] flex-row">
                      <p className="px-[5px] rounded-br-[6px] w-[20px] h-[20px] text-[16px] leading-[20px] text-[#111] lining-nums tabular-nums block bg-white font-bold">1</p>
                      <h2 className="text-[20px] leading-[20px] text-white font-sans">Wing 4 N8</h2>
                    </div>
                    <div className="flex items-center justify-center cursor-pointer px-[6px] py-[4px] rounded-[13px] border border-white">
                      <span className="ctaText text-white">Shop now</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <div className="desktop:hidden mobile:flex-[24]"></div>
          </div>

          <div className="flex flex-row">
            <div className="desktop:hidden mobile:flex-[24]"></div>
            <div className="circuit-campaign-item flex flex-col gap-[12px] desktop:gap-[32px] desktop:flex-[650] flex-[351]">
              <Link to="/sunglasses">
                <picture>
                  <source media="(max-width: 767px)" srcSet="https://gm-prd-resource.gentlemonster.com/assets/stories/circuit-collection/campaign_product_2_mo.jpg" />
                  <img alt="Slipstream GR13" className="w-full h-auto object-cover desktop:aspect-[650/812] mobile:aspect-[351/439]" src="https://gm-prd-resource.gentlemonster.com/assets/stories/circuit-collection/campaign_product_2_pc.jpg" />
                </picture>
              </Link>
              <div className="flex flex-row">
                <div className="desktop:flex-[1]"></div>
                <Link className="circuit-campaign-info relative flex-[327]" to="/sunglasses">
                  <div className="circuit-campaign-info-base flex items-center gap-[12px] flex-row desktop:justify-end">
                    <div className="flex items-center gap-[6px] flex-row">
                      <p className="px-[5px] rounded-br-[6px] w-[20px] h-[20px] text-[16px] leading-[20px] text-[#111] lining-nums tabular-nums block bg-[#9CA3AF] font-bold">2</p>
                      <h2 className="text-[20px] leading-[20px] text-[#9CA3AF] font-sans">Slipstream GR13</h2>
                    </div>
                    <div className="flex items-center justify-center cursor-pointer px-[6px] py-[4px] rounded-[13px] border border-[#9CA3AF]">
                      <span className="ctaText text-[#9CA3AF]">Shop now</span>
                    </div>
                  </div>
                  <div className="circuit-campaign-info-overlay absolute inset-0 overflow-hidden flex items-center gap-[12px] flex-row desktop:justify-end">
                    <div className="flex items-center gap-[6px] flex-row">
                      <p className="px-[5px] rounded-br-[6px] w-[20px] h-[20px] text-[16px] leading-[20px] text-[#111] lining-nums tabular-nums block bg-white font-bold">2</p>
                      <h2 className="text-[20px] leading-[20px] text-white font-sans">Slipstream GR13</h2>
                    </div>
                    <div className="flex items-center justify-center cursor-pointer px-[6px] py-[4px] rounded-[13px] border border-white">
                      <span className="ctaText text-white">Shop now</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <div className="mobile:hidden desktop:flex-[570]"></div>
          </div>

          <div className="flex flex-row">
            <div className="mobile:hidden desktop:flex-[470]"></div>
            <div className="circuit-campaign-item flex flex-col gap-[12px] desktop:gap-[32px] desktop:flex-[750] flex-[375]">
              <Link to="/sunglasses">
                <picture>
                  <source media="(max-width: 767px)" srcSet="https://gm-prd-resource.gentlemonster.com/assets/stories/circuit-collection/campaign_product_3_mo.jpg" />
                  <img alt="Slipstream G21" className="w-full h-auto object-cover desktop:aspect-[750/937] mobile:aspect-[375/469]" src="https://gm-prd-resource.gentlemonster.com/assets/stories/circuit-collection/campaign_product_3_pc.jpg" />
                </picture>
              </Link>
              <div className="flex flex-row">
                <div className="mobile:flex-[24]"></div>
                <Link className="circuit-campaign-info relative flex-[327]" to="/sunglasses">
                  <div className="circuit-campaign-info-base flex items-center gap-[12px] flex-row">
                    <div className="flex items-center gap-[6px] flex-row">
                      <p className="px-[5px] rounded-br-[6px] w-[20px] h-[20px] text-[16px] leading-[20px] text-[#111] lining-nums tabular-nums block bg-[#9CA3AF] font-bold">3</p>
                      <h2 className="text-[20px] leading-[20px] text-[#9CA3AF] font-sans">Slipstream G21</h2>
                    </div>
                    <div className="flex items-center justify-center cursor-pointer px-[6px] py-[4px] rounded-[13px] border border-[#9CA3AF]">
                      <span className="ctaText text-[#9CA3AF]">Shop now</span>
                    </div>
                  </div>
                  <div className="circuit-campaign-info-overlay absolute inset-0 overflow-hidden flex items-center gap-[12px] flex-row">
                    <div className="flex items-center gap-[6px] flex-row">
                      <p className="px-[5px] rounded-br-[6px] w-[20px] h-[20px] text-[16px] leading-[20px] text-[#111] lining-nums tabular-nums block bg-white font-bold">3</p>
                      <h2 className="text-[20px] leading-[20px] text-white font-sans">Slipstream G21</h2>
                    </div>
                    <div className="flex items-center justify-center cursor-pointer px-[6px] py-[4px] rounded-[13px] border border-white">
                      <span className="ctaText text-white">Shop now</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-row">
            <div className="desktop:flex-[219] flex-[24]"></div>
            <div className="circuit-campaign-item flex flex-col gap-[12px] desktop:gap-[32px] desktop:flex-[750] flex-[351]">
              <Link to="/sunglasses">
                <picture>
                  <source media="(max-width: 767px)" srcSet="https://gm-prd-resource.gentlemonster.com/assets/stories/circuit-collection/campaign_product_4_mo.jpg" />
                  <img alt="Wing 4 R13" className="w-full h-auto object-cover desktop:aspect-[750/937] mobile:aspect-[351/439]" src="https://gm-prd-resource.gentlemonster.com/assets/stories/circuit-collection/campaign_product_4_pc.jpg" />
                </picture>
              </Link>
              <div className="flex flex-row">
                <Link className="circuit-campaign-info relative flex-[327]" to="/sunglasses">
                  <div className="circuit-campaign-info-base flex items-center gap-[12px] flex-row">
                    <div className="flex items-center gap-[6px] flex-row">
                      <p className="px-[5px] rounded-br-[6px] w-[20px] h-[20px] text-[16px] leading-[20px] text-[#111] lining-nums tabular-nums block bg-[#9CA3AF] font-bold">4</p>
                      <h2 className="text-[20px] leading-[20px] text-[#9CA3AF] font-sans">Wing 4 R13</h2>
                    </div>
                    <div className="flex items-center justify-center cursor-pointer px-[6px] py-[4px] rounded-[13px] border border-[#9CA3AF]">
                      <span className="ctaText text-[#9CA3AF]">Shop now</span>
                    </div>
                  </div>
                  <div className="circuit-campaign-info-overlay absolute inset-0 overflow-hidden flex items-center gap-[12px] flex-row">
                    <div className="flex items-center gap-[6px] flex-row">
                      <p className="px-[5px] rounded-br-[6px] w-[20px] h-[20px] text-[16px] leading-[20px] text-[#111] lining-nums tabular-nums block bg-white font-bold">4</p>
                      <h2 className="text-[20px] leading-[20px] text-white font-sans">Wing 4 R13</h2>
                    </div>
                    <div className="flex items-center justify-center cursor-pointer px-[6px] py-[4px] rounded-[13px] border border-white">
                      <span className="ctaText text-white">Shop now</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <div className="mobile:hidden desktop:flex-[251]"></div>
          </div>
        </section>

        {/* SECTION 2: 3D Product Showcase & 8 Products Grid */}
        <div className="circuit-3d-collection-section flex flex-col desktop:mx-auto mt-24">
          <div className="flex flex-col desktop:gap-[80px] items-center justify-center" data-sentry-component="Circuit3DVideoSection">
            <p className="bodyText circuit-3d-video-desc text-[#C9CFDA] text-center max-w-[550px] mx-auto px-6 leading-relaxed">
              Discover eight frames crafted from durable yet lightweight materials, along with statement pieces that visualize the speed of racing cars. The collection presents a new vision of eyewear through sporty yet refined designs.
            </p>
            
            <div className="relative circuit-3d-video mt-8">
              <div className="absolute top-[-1px] left-0 w-full h-[120px] bg-gradient-to-b from-[#111] to-transparent pointer-events-none z-10"></div>
              {/* Sửa đổi class để video 3D thích ứng hoàn hảo khi Resize */}
              <video
                ref={video3DRef}
                src={getMediaUrl("/Circuit%20collection/3d.mp4")}
                className="absolute inset-0 w-full h-full object-cover"
                loop
                muted={is3DMuted}
                playsInline
                autoPlay
              />
              <div className="absolute bottom-[-1px] left-0 w-full h-[120px] bg-gradient-to-t from-[#111] to-transparent pointer-events-none z-10"></div>
              
              <div className="absolute bottom-0 right-0 flex p-[24px] desktop:p-[36px] z-30 gap-3">
                {/* PlayButton */}
                <button
                  aria-label={is3DPlaying ? "Pause video" : "Play video"}
                  className="flex h-[44px] w-[44px] desktop:h-[48px] desktop:w-[48px] items-center justify-center cursor-pointer z-30"
                  type="button"
                  onClick={toggle3DPlay}
                >
                  {is3DPlaying ? (
                    <svg className="w-[15px] h-[15px] desktop:w-[20px] desktop:h-[20px]" fill="none" viewBox="0 0 15 15">
                      <path d="M4 2h2v11H4V2zm5 0h2v11H9V2z" fill="white"></path>
                    </svg>
                  ) : (
                    <svg className="w-[15px] h-[15px] desktop:w-[20px] desktop:h-[20px]" fill="none" viewBox="0 0 15 15">
                      <path d="M11.875 7.1875L2.96875 12.3295L2.96875 2.04547L11.875 7.1875Z" fill="white"></path>
                    </svg>
                  )}
                </button>

                {/* MuteButton */}
                <button
                  aria-label={is3DMuted ? "Unmute" : "Mute"}
                  className="flex h-[44px] w-[44px] desktop:h-[48px] desktop:w-[48px] items-center justify-center cursor-pointer z-30"
                  type="button"
                  onClick={toggle3DMute}
                >
                  {is3DMuted ? (
                    <svg className="w-[15px] h-[15px] desktop:w-[20px] desktop:h-[20px]" fill="none" viewBox="0 0 15 15">
                      <g clipPath="url(#clip0_1120_120)">
                        <path d="M12.2976 13.9562L10.4133 12.0719C10.1959 12.2111 9.96716 12.3317 9.72951 12.4325C9.48785 12.5351 9.23933 12.6207 8.98576 12.6887V11.72C9.11951 11.6721 9.24972 11.6229 9.37639 11.5725C9.50108 11.5233 9.62132 11.4635 9.73576 11.3938L7.49514 9.15312V11.8625L4.81451 9.1825H2.49514V6.0575H4.39889L1.37451 3.03312L2.03326 2.375L12.9564 13.2975L12.2976 13.9562ZM11.9926 10.5775L11.3208 9.90625C11.7835 9.17435 12.0159 8.32042 11.9879 7.45497C11.96 6.58951 11.6729 5.75237 11.1639 5.05188C10.6274 4.30743 9.86232 3.75873 8.98514 3.48937V2.52C10.1173 2.80858 11.1198 3.46885 11.832 4.395C12.3503 5.06503 12.6984 5.85071 12.8465 6.68472C12.9946 7.51873 12.9384 8.37623 12.6826 9.18375C12.5235 9.68036 12.2909 10.1497 11.9926 10.5775ZM10.0789 8.66375L8.98514 7.57V5.305C9.39802 5.5258 9.73751 5.86225 9.96201 6.27312C10.1909 6.68496 10.3097 7.14885 10.307 7.62C10.3074 7.8011 10.2883 7.98172 10.2501 8.15875C10.2123 8.33322 10.1549 8.50222 10.0789 8.66375ZM7.49451 6.07938L6.14639 4.72563L7.49514 3.375L7.49451 6.07938Z" fill="white"></path>
                      </g>
                      <defs><clipPath id="clip0_1120_120"><rect fill="white" height="15" width="15"></rect></clipPath></defs>
                    </svg>
                  ) : (
                    <svg className="w-[15px] h-[15px] desktop:w-[20px] desktop:h-[20px]" fill="none" viewBox="0 0 15 15">
                      <path d="M1.5 5h3l3-3v11l-3-3h-3V5zm9.5 2.5c0-1.1-.4-2.1-1-3m1.5 8c.6-1.3 1-2.7 1-4.2 0-1.5-.4-2.9-1-4.2" stroke="white" strokeLinecap="round" strokeWidth="1.2"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <section className="circuit-collection-section flex flex-col gap-[60px] desktop:gap-[80px] justify-center items-center" data-sentry-component="CircuitCollectionSection">
            <h2 className="bodyText circuit-collection-section-desc text-[#C9CFDA] max-w-[550px] mx-auto text-center px-6 leading-relaxed">
              Discover eight frames crafted from durable yet lightweight materials, along with statement pieces that visualize the speed of racing cars. The collection presents a new vision of eyewear through sporty yet refined designs.
            </h2>
            
            <ul className="circuit-collection-section-list">
              <li>
                <Link className="flex flex-col gap-[12px]" to="/sunglasses">
                  <img alt="Disney F1® - Wing4 R13" className="w-full h-auto object-cover" src="https://gm-prd-resource.gentlemonster.com/assets/stories/circuit-collection/wing4_r13.jpg" />
                  <h3 className="__className_9e3a7a text-[#C9CFDA] text-center text-[12px] leading-[12px]">Disney F1<sup>®</sup> - Wing4 R13</h3>
                </Link>
              </li>
              <li>
                <Link className="flex flex-col gap-[12px]" to="/sunglasses">
                  <img alt="Disney F1® - Slipstream N8" className="w-full h-auto object-cover" src="https://gm-prd-resource.gentlemonster.com/assets/stories/circuit-collection/slipstream_n8.jpg" />
                  <h3 className="__className_9e3a7a text-[#C9CFDA] text-center text-[12px] leading-[12px]">Disney F1<sup>®</sup> - Slipstream N8</h3>
                </Link>
              </li>
              <li>
                <Link className="flex flex-col gap-[12px]" to="/sunglasses">
                  <img alt="Disney F1® - Aero GR13" className="w-full h-auto object-cover" src="https://gm-prd-resource.gentlemonster.com/assets/stories/circuit-collection/aero_gr13.jpg" />
                  <h3 className="__className_9e3a7a text-[#C9CFDA] text-center text-[12px] leading-[12px]">Disney F1<sup>®</sup> - Aero GR13</h3>
                </Link>
              </li>
              <li>
                <Link className="flex flex-col gap-[12px]" to="/sunglasses">
                  <img alt="Disney F1® - Velo MG21" className="w-full h-auto object-cover" src="https://gm-prd-resource.gentlemonster.com/assets/stories/circuit-collection/velo_mg21.jpg" />
                  <h3 className="__className_9e3a7a text-[#C9CFDA] text-center text-[12px] leading-[12px]">Disney F1<sup>®</sup> - Velo MG21</h3>
                </Link>
              </li>
              <li>
                <Link className="flex flex-col gap-[12px]" to="/sunglasses">
                  <img alt="Rim MG22" className="w-full h-auto object-cover" src="https://gm-prd-resource.gentlemonster.com/assets/stories/circuit-collection/rim_mg22.jpg" />
                  <h3 className="__className_9e3a7a text-[#C9CFDA] text-center text-[12px] leading-[12px]">Rim MG22</h3>
                </Link>
              </li>
              <li>
                <Link className="flex flex-col gap-[12px]" to="/sunglasses">
                  <img alt="Turbo MGD3" className="w-full h-auto object-cover" src="https://gm-prd-resource.gentlemonster.com/assets/stories/circuit-collection/turbo_mgd3.jpg" />
                  <h3 className="__className_9e3a7a text-[#C9CFDA] text-center text-[12px] leading-[12px]">Turbo MGD3</h3>
                </Link>
              </li>
              <li>
                <Link className="flex flex-col gap-[12px]" to="/sunglasses">
                  <img alt="Pitot M021" className="w-full h-auto object-cover" src="https://gm-prd-resource.gentlemonster.com/assets/stories/circuit-collection/pitot_m021.jpg" />
                  <h3 className="__className_9e3a7a text-[#C9CFDA] text-center text-[12px] leading-[12px]">Pitot M021</h3>
                </Link>
              </li>
              <li>
                <Link className="flex flex-col gap-[12px]" to="/sunglasses">
                  <img alt="Volt MGD2" className="w-full h-auto object-cover" src="https://gm-prd-resource.gentlemonster.com/assets/stories/circuit-collection/volt_mgd2.jpg" />
                  <h3 className="__className_9e3a7a text-[#C9CFDA] text-center text-[12px] leading-[12px]">Volt MGD2</h3>
                </Link>
              </li>
            </ul>
            
            <Link className="relative mt-8" to="/sunglasses">
              <div className="flex items-center justify-center cursor-pointer desktop:p-[8px] p-[6px] rounded-[25px] border border-[#9CA3AF]">
                <span className="ctaText2 text-[#9CA3AF] px-4 font-semibold text-xs tracking-widest uppercase">View the Collection</span>
              </div>
            </Link>
          </section>
        </div>

        {/* SECTION 3: Pop-Up Stores & Carousel */}
        <section className="circuit-popup-section flex flex-col gap-[60px] desktop:gap-[80px] justify-center mt-24" id="circuit-popup">
          <h2 className="bodyText circuit-popup-desc text-[#C9CFDA] desktop:text-center px-6 leading-relaxed">
            To celebrate the Circuit Collection, a special pop-up inspired by the global collaboration of Disney × F1® will take place in Seoul and Shanghai.
          </h2>
          
          <div className="flex flex-col gap-[24px] desktop:gap-[32px]">
            <div className="swiper w-full h-auto object-cover circuit-popup-image relative overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out h-full"
                style={{
                  transform: `translateX(-${popupSlide * 100}%)`,
                  width: `${totalSlides * 100}%`
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <div
                    key={num}
                    className="relative flex-shrink-0 h-full"
                    style={{
                      width: `${100 / totalSlides}%`
                    }}
                  >
                    <picture>
                      <source media="(max-width: 767px)" srcSet={`https://gm-prd-resource.gentlemonster.com/assets/stories/circuit-collection/popup_${num}_mo.jpg`} />
                      <img
                        alt={`popup ${num}`}
                        src={`https://gm-prd-resource.gentlemonster.com/assets/stories/circuit-collection/popup_${num}_pc.jpg`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </picture>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="flex items-center justify-between w-full max-w-[360px] px-2">
                <button
                  aria-label="Previous slide"
                  className="w-[44px] h-[44px] flex items-center justify-center cursor-pointer disabled:opacity-30 z-30"
                  disabled={popupSlide === 0}
                  type="button"
                  onClick={handlePrev}
                >
                  <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <rect fill="#C9CFDA" height="1.2" transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 15 17.1514)" width="8.91687"></rect>
                    <rect fill="#C9CFDA" height="1.2" transform="matrix(-0.707107 0.707107 0.707107 0.707107 14.1289 5.41211)" width="8.88441"></rect>
                  </svg>
                </button>

                <div className="flex items-center justify-center gap-[4px]">
                  {[0, 1, 2, 3, 4, 5, 6].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => setPopupSlide(idx)}
                      className={`w-[36px] h-[36px] flex items-center justify-center text-[13px] text-center cursor-pointer transition-colors duration-200 ${
                        popupSlide === idx ? 'text-white font-bold scale-110' : 'text-[#C9CFDA] hover:text-white'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <button
                  aria-label="Next slide"
                  className="w-[44px] h-[44px] flex items-center justify-center cursor-pointer disabled:opacity-30 z-30"
                  disabled={popupSlide === totalSlides - 1}
                  type="button"
                  onClick={handleNext}
                >
                  <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <rect fill="#fff" height="1.2" transform="matrix(0.707107 0.707107 0.707107 -0.707107 9 6.84863)" width="8.91687"></rect>
                    <rect fill="#fff" height="1.2" transform="matrix(0.707107 -0.707107 -0.707107 -0.707107 9.87109 18.5879)" width="8.88441"></rect>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <ul className="flex flex-col gap-[36px] mt-8 mb-24">
            <li>
              <a className="circuit-popup-list-item flex flex-col items-center text-center" href="https://www.gentlemonster.com/int/en/stores/detail/779149716700285432" rel="noopener noreferrer" target="_blank">
                <h3 className="storeName text-[#fff] font-semibold text-sm tracking-widest uppercase">HAUS NOWHERE SEOUL</h3>
                <p className="storeDesc text-[#C9CFDA] mt-2 text-xs tracking-wider leading-relaxed">
                  433, Ttukseom-ro, Seongdong-gu, Seoul<br/>
                  2026.03.07 – 05.17<br/>
                  Every Day 11AM - 9PM
                </p>
              </a>
            </li>
            <li>
              <a className="circuit-popup-list-item flex flex-col items-center text-center" href="https://www.gentlemonster.com/int/en/stories/detail/779149670609076624" rel="noopener noreferrer" target="_blank">
                <h3 className="storeName text-[#fff] font-semibold text-sm tracking-widest uppercase">HAUS NOWHERE SHANGHAI</h3>
                <p className="storeDesc text-[#C9CFDA] mt-2 text-xs tracking-wider leading-relaxed">
                  798-812, Mid-HuaiHai Rd., Huangpu District, Shanghai<br/>
                  2026.03.07 – 05.17<br/>
                  Every Day 10AM - 10PM
                </p>
              </a>
            </li>
          </ul>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default CircuitCollection;
