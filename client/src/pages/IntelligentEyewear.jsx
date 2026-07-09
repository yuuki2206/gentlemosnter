import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Accordion from '../components/Accordion';

/**
 * Trang "Intelligent Eyewear" - Trang giới thiệu sản phẩm kính thông minh (hợp tác Google & Samsung).
 * Sử dụng phong cách thiết kế Dark Mode (nền đen tuyền, chữ trắng) sang trọng.
 */
const IntelligentEyewear = () => {
  return (
    <div className="bg-black min-h-screen font-sans text-white">
      {/* HEADER: Kích hoạt forceTransparent={true} để giữ nguyên nền trong suốt, tránh bị hóa trắng khi kéo trang xuống */}
      <Header forceTransparent={true} />
      
      {/* 1. SECTION HERO: Ảnh phong cách (lifestyle) làm hình nền chiếm trọn 100vh màn hình */}
      <section className="relative w-full h-[100vh] flex flex-col justify-end">
        <img 
          src="/intelligent-eyewear/Mo_GG_lifestyle_img.jpg" 
          alt="Gentle Monster Intelligent Eyewear" 
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />
        {/* Lớp phủ chuyển màu (gradient overlay) từ đen bóng (ở dưới đáy) lên trong suốt (ở trên) để làm nổi bật form đăng ký */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 to-transparent z-0 pointer-events-none"></div>
        
        {/* Khung nội dung và Form Đăng Ký Bản Tin */}
        <div className="relative z-10 w-full max-w-[600px] mx-auto px-4 pb-16 flex flex-col items-center text-center">
          <h1 className="text-white text-[28px] md:text-[36px] font-serif leading-tight mb-4 uppercase drop-shadow-lg">
            GENTLE MONSTER<br/>INTELLIGENT EYEWEAR
          </h1>
          
          <p className="text-white text-[11px] md:text-[13px] leading-relaxed max-w-[480px] mb-8 font-medium">
            Explore Gentle Monster's intelligent eyewear, created in collaboration with Google and Samsung. New intelligent eyewear experience shaped by Gentle Monster's design vision.<br/>
            Be the first to know. Sign up below.
          </p>

          <form className="relative w-full max-w-[400px] mb-6">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full bg-white text-black text-sm md:text-base rounded-full py-[14px] pl-6 pr-24 focus:outline-none placeholder:text-gray-500"
              required
            />
            <button 
              type="submit" 
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#d8e4ff] text-[#3358c2] text-xs md:text-sm font-semibold rounded-full py-2 px-6 hover:bg-[#b0c8ff] transition-colors"
            >
              Sign up
            </button>
          </form>

          {/* Danh sách 3 dấu kiểm cam kết (Checklist) */}
          <ul className="text-[10px] md:text-[12px] text-white/90 space-y-2 text-left w-full max-w-[400px] pl-4 md:pl-12">
            <li className="flex items-center gap-2">
              <span className="flex-shrink-0 w-3 h-3 rounded-full border border-white flex items-center justify-center">
                <svg width="6" height="6" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 5L4 7.5L8.5 2" stroke="white" strokeWidth="2"/></svg>
              </span>
              Be the first to know about new releases
            </li>
            <li className="flex items-center gap-2">
              <span className="flex-shrink-0 w-3 h-3 rounded-full border border-white flex items-center justify-center">
                <svg width="6" height="6" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 5L4 7.5L8.5 2" stroke="white" strokeWidth="2"/></svg>
              </span>
              Updates on upcoming campaigns
            </li>
            <li className="flex items-center gap-2">
              <span className="flex-shrink-0 w-3 h-3 rounded-full border border-white flex items-center justify-center">
                <svg width="6" height="6" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 5L4 7.5L8.5 2" stroke="white" strokeWidth="2"/></svg>
              </span>
              Discover special event updates
            </li>
          </ul>
        </div>
      </section>

      {/* 2. SECTION GIỚI THIỆU CHUNG (Introduction Section) */}
      <section className="bg-black w-full py-24 md:py-32 px-4 flex flex-col items-center">
        <h2 className="text-xl md:text-2xl font-medium text-center mb-10 leading-snug">
          Intelligent Eyewear,<br/>Introduced at Google I/O 2026
        </h2>
        
        <div className="text-[11px] md:text-[13px] text-center max-w-[500px] space-y-6 text-gray-300">
          <p>Gentle Monster Intelligent Eyewear opens a new chapter in everyday wearable interaction.</p>
          <p>
            Intelligent eyewear should feel as emotionally expressive as it is technologically advanced.
            Our vision was to merge fashion and technology in a way that feels bold, beautiful and human,
            bringing Gentle Monster's disruptive design identity into a new era of intelligent eyewear with Samsung and Google.
          </p>
        </div>

        {/* Ảnh giới thiệu sản phẩm kính (Có xử lý onError fallback nếu không tải được ảnh PC độ phân giải cao) */}
        <div className="mt-20 w-full max-w-[800px] mx-auto">
          <img 
            src="/intelligent-eyewear/Pc_IMG_01.jpg" 
            alt="Intelligent Eyewear Product" 
            className="w-full h-auto object-cover"
            onError={(e) => { e.target.src = '/intelligent-eyewear/Mo_IMG_01.jpg' }}
          />
        </div>
      </section>

      {/* 3. SECTION ALBUM THỜI TRANG (Editorial Gallery) */}
      <section className="bg-black w-full px-4 pb-24 md:pb-32 flex flex-col items-center gap-16 md:gap-24">
        
        {/* Model 1: Người mẫu nam mặc áo khoác da đen */}
        <div className="relative w-full max-w-[800px] mx-auto">
          <img 
            src="/intelligent-eyewear/Pc_IMG_02.jpg" 
            alt="Model in leather jacket" 
            className="w-full h-auto object-cover"
            onError={(e) => { e.target.src = '/intelligent-eyewear/Mo_IMG_02.jpg' }}
          />
          {/* Tag thông tin đồng hợp tác (co-branding) ở góc dưới bức ảnh */}
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <span className="text-white font-serif text-sm md:text-xl font-bold tracking-widest drop-shadow-md">
              GENTLE MONSTER
            </span>
            <span className="text-white text-xs md:text-sm font-semibold drop-shadow-md flex items-center gap-2">
              Google <span className="opacity-50 font-light">|</span> SAMSUNG
            </span>
          </div>
        </div>

        {/* Model 2: Người mẫu nữ đầm tím */}
        <div className="relative w-full max-w-[800px] mx-auto">
          <img 
            src="/intelligent-eyewear/Pc_IMG_03.jpg" 
            alt="Model in purple dress" 
            className="w-full h-auto object-cover"
            onError={(e) => { e.target.src = '/intelligent-eyewear/Mo_IMG_03.jpg' }}
          />
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <span className="text-white font-serif text-sm md:text-xl font-bold tracking-widest drop-shadow-md">
              GENTLE MONSTER
            </span>
            <span className="text-white text-xs md:text-sm font-semibold drop-shadow-md flex items-center gap-2">
              Google <span className="opacity-50 font-light">|</span> SAMSUNG
            </span>
          </div>
        </div>

      </section>

      {/* 4. SECTION HỎI ĐÁP (FAQ Accordion Section)
          - Sử dụng các khối thả xuống (Accordion) giúp che giấu bớt chữ, tối ưu hóa không gian hiển thị và giảm tải rối mắt.
      */}
      <section className="bg-black w-full px-4 pb-32">
        <div className="max-w-[700px] mx-auto flex flex-col gap-1">
          <Accordion title="What is Gentle Monster?">
            Gentle Monster is a global fashion eyewear brand known for its disruptive design identity and experimental retail spaces.
          </Accordion>
          <Accordion title="What is Gentle Monster Intelligent Eyewear?">
            It is a new collaboration combining Gentle Monster's avant-garde fashion aesthetics with Google and Samsung's cutting-edge AI and wearable technology.
          </Accordion>
          <Accordion title="What features will Gentle Monster Intelligent Eyewear have?">
            While specific technical details are still under wraps, the eyewear is expected to feature seamless AI integration, voice commands, and advanced auditory interactions.
          </Accordion>
          <Accordion title="When will Gentle Monster Intelligent Eyewear be released?">
            The collection was introduced at Google I/O 2026. Stay tuned and sign up for our newsletter to get official release dates.
          </Accordion>
          <Accordion title="Where can I buy Gentle Monster Intelligent Eyewear?">
            Once released, it will be available exclusively through Gentle Monster official flagships and online store.
          </Accordion>
        </div>
      </section>

      {/* FOOTER: Kích hoạt darkMode={true} để Footer có nền đen và chữ trắng đồng bộ hoàn toàn với trang này */}
      <Footer darkMode={true} />
    </div>
  );
};

export default IntelligentEyewear;
