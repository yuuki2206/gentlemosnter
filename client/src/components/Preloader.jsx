import React, { useState, useEffect, useRef } from "react";

const Preloader = ({ ready, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // Sử dụng useRef để lưu trữ trạng thái ready hiện tại, 
  // giúp useEffect đọc được giá trị mới nhất của API mà không cần khởi động lại toàn bộ chu kỳ lặp % (reset về 0)
  const readyRef = useRef(ready);
  useEffect(() => {
    readyRef.current = ready;
  }, [ready]);

  useEffect(() => {
    // Vô hiệu hóa cuộn trang trong lúc loading
    document.body.style.overflow = "hidden";

    let currentProgress = 0;
    const interval = setInterval(() => {
      const isReady = readyRef.current;
      
      // Nếu API backend chưa phản hồi, tiến trình đếm tối đa dừng ở 95% để chờ đợi (Tránh đứt gãy trải nghiệm)
      const limit = isReady ? 100 : 95;

      if (currentProgress < limit) {
        // Tăng ngẫu nhiên từ 2 đến 7 để nhịp đếm chạy thật tự nhiên
        const increment = Math.floor(Math.random() * 6) + 2; 
        currentProgress = Math.min(currentProgress + increment, limit);
        setProgress(currentProgress);
      }

      // Chỉ hoàn tất khi tiến trình đạt 100% và API xác thực/tải trang đã phản hồi xong
      if (currentProgress === 100 && isReady) {
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
    }, 60);

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
