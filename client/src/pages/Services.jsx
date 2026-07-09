/**
 * Services Page - Trang dịch vụ sửa chữa và bảo hành kính Gentle Monster.
 * - Video Background: autoPlay, loop, muted, playsInline giúp chạy video nền mượt mà trên Safari di động.
 * - Overlay Contrast: Lớp phủ tối 20% giúp tăng độ tương phản để chữ trắng hiển thị nổi bật dễ đọc.
 */
import React from "react";
import { ArrowUpRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Services = () => {
  return (
    <div className="relative w-full min-h-screen bg-black text-white">
      {/* HEADER: Tự động nhận diện pathname "/services" và chuyển sang nền trong suốt
          (logic xử lý nằm bên trong Header.jsx, không cần truyền props ở đây). */}
      <Header />

      <main className="relative w-full h-screen overflow-hidden">

        {/* VIDEO BACKGROUND: absolute inset-0 chiếm toàn bộ diện tích thẻ main */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            {/* Video gốc từ CDN chính thức của Gentle Monster — chất lượng PC 1920x1080 */}
            <source src="https://web-video-resource.gentlemonster.com/assets/video/ps/PS_main_landing_PC_1920x1080.mp4" type="video/mp4" />
          </video>
          {/* Overlay tối 20%: Giúp tăng độ tương phản giữa chữ trắng và video nền sáng */}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* NỘI DUNG CHÍNH: Căn trái + căn giữa theo chiều dọc (justify-center) */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center px-4 md:px-16 pt-20">
          <div className="max-w-xl">
            <h1 className="text-[20px] md:text-[24px] font-medium leading-tight mb-8">
              Experience Gentle Monster's exclusive services anytime, anywhere.
            </h1>

            <div className="flex flex-col items-start gap-4">
              {/* NÚT CTA (Call-to-Action) CHÍNH: Viền trắng, hover hiện nền trắng mờ */}
              <a
                href="#"
                className="w-[280px] md:w-[320px] py-[14px] text-center text-[12px] font-medium border border-white rounded-[10px] bg-transparent hover:bg-white/10 transition-colors tracking-widest"
              >
                REQUEST A REPAIR
              </a>
              {/* LINK PHỤ: Dạng text link + icon mũi tên (không có viền, nhẹ nhàng hơn) */}
              <a
                href="#"
                className="flex items-center gap-1 mt-2 text-[11px] font-bold tracking-widest hover:opacity-70 transition-opacity"
              >
                VISIT NEAREST STORE <ArrowUpRight size={14} strokeWidth={2.5} />
              </a>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default Services;
