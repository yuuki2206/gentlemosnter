import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Theo dõi scroll để ẩn/hiện nút (hiển thị khi cuộn xuống quá 400px)
  useEffect(() => {
    let visible = false;
    const handleScroll = () => {
      const isOverThreshold = window.scrollY > 400;
      if (isOverThreshold !== visible) {
        visible = isOverThreshold;
        setIsVisible(isOverThreshold);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Hiệu ứng hút nam châm (Magnetic Pull) khi di chuột vào nút
  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Giới hạn khoảng cách hút tối đa 16px để tạo tương tác vật lý tự nhiên
    const pullX = (clientX - centerX) * 0.4;
    const pullY = (clientY - centerY) * 0.4;

    setPosition({ x: pullX, y: pullY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <button
      onClick={handleScrollToTop}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`fixed bottom-6 right-6 z-[9999] w-12 h-12 rounded-full bg-white text-black border border-black/10 flex justify-center items-center shadow-lg transition-all duration-300 ease-out hover:bg-black hover:text-white hover:border-black hover:scale-105 active:scale-95 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
      }`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: position.x === 0 && position.y === 0 ? "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)" : "transform 0.1s ease-out",
      }}
      aria-label="Scroll to top"
    >
      <ArrowUp size={16} strokeWidth={2} />
    </button>
  );
};

export default ScrollToTopButton;
