import React, { useState, useEffect } from "react";

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    // Vô hiệu hóa cuộn trang trong lúc loading
    document.body.style.overflow = "hidden";

    let currentProgress = 0;
    const interval = setInterval(() => {
      // Tăng ngẫu nhiên từ 3 đến 10 để tạo nhịp tải chân thực
      const increment = Math.floor(Math.random() * 8) + 3; 
      currentProgress = Math.min(currentProgress + increment, 100);
      setProgress(currentProgress);

      if (currentProgress === 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFadingOut(true); // Kích hoạt hiệu ứng trượt lên & mờ dần
          setTimeout(() => {
            setIsHidden(true); // Gỡ bỏ khỏi DOM
            document.body.style.overflow = ""; // Khôi phục cuộn trang
            if (onComplete) onComplete();
          }, 800); // Khớp với duration-800
        }, 600); // Giữ ở mức 100% một khoảng nhỏ để tạo điểm dừng sang trọng
      }
    }, 70);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  if (isHidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[1000000] bg-[#0d0d0d] flex flex-col justify-center items-center select-none pointer-events-auto transition-all duration-800 ease-[cubic-bezier(0.85,0,0.15,1)] ${
        isFadingOut ? "opacity-0 -translate-y-full" : "opacity-100 translate-y-0"
      }`}
    >
      {/* Khối nội dung chính */}
      <div className="flex flex-col items-center">
        {/* Tên thương hiệu serif chữ rộng sang trọng */}
        <h1 
          className="text-white text-[16px] sm:text-lg md:text-xl font-bold tracking-[0.4em] uppercase"
          style={{ fontFamily: "'Playfair Display', Didot, Georgia, serif" }}
        >
          GENTLE MONSTER
        </h1>

        {/* Thanh tiến trình siêu mảnh */}
        <div className="h-[1px] bg-white/10 w-44 sm:w-52 relative overflow-hidden mt-6 rounded-full">
          <div
            className="h-full bg-white transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Số % đếm định dạng monospace sang xịn */}
        <span className="text-[10px] tracking-[0.25em] text-gray-500 font-mono mt-3">
          {progress.toString().padStart(3, "0")}%
        </span>
      </div>

      {/* Dòng chữ nhỏ thương hiệu ở chân trang */}
      <div className="absolute bottom-10 text-[8px] tracking-[0.35em] text-gray-600 uppercase">
        © Gentle Monster 2026
      </div>
    </div>
  );
};

export default Preloader;
