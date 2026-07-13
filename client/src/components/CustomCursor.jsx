import { useEffect, useState } from "react";

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cursorType, setCursorType] = useState("default"); // 'default', 'hover', 'view', 'drag'
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Chỉ kích hoạt trên màn hình Desktop (lg >= 1024px)
    const checkDesktop = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) {
        document.body.classList.add("lg-custom-cursor-active");
      } else {
        document.body.classList.remove("lg-custom-cursor-active");
      }
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      // Kiểm tra xem phần tử có attribute data-cursor đặc biệt hay không
      const dataCursor = target.closest("[data-cursor]");
      if (dataCursor) {
        setCursorType(dataCursor.getAttribute("data-cursor"));
        return;
      }

      // Kiểm tra xem có hover vào thẻ link, button, hoặc các phần tử bấm được không
      const isClickable = target.closest("a, button, [role='button'], input, textarea, select");
      if (isClickable) {
        setCursorType("hover");
      } else {
        setCursorType("default");
      }
    };

    if (window.innerWidth >= 1024) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseover", handleMouseOver);
    }

    return () => {
      window.removeEventListener("resize", checkDesktop);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.body.classList.remove("lg-custom-cursor-active");
    };
  }, []);

  if (!isDesktop) return null;

  // Cấu hình class và style tương ứng với từng kiểu cursor
  let outerSize = "w-6 h-6";
  let outerClass = "border border-black bg-transparent";
  let innerClass = "w-1.5 h-1.5 bg-black";
  let content = "";

  if (cursorType === "hover") {
    outerSize = "w-12 h-12";
    outerClass = "bg-white border-none mix-blend-difference scale-110";
    innerClass = "w-0 h-0 opacity-0"; // Mất dot bên trong khi hover link
  } else if (cursorType === "view") {
    outerSize = "w-16 h-16";
    outerClass = "bg-black border-none text-white flex justify-center items-center scale-110";
    innerClass = "w-0 h-0 opacity-0";
    content = "VIEW";
  } else if (cursorType === "drag") {
    outerSize = "w-16 h-16";
    outerClass = "bg-black border-none text-white flex justify-center items-center scale-110";
    innerClass = "w-0 h-0 opacity-0";
    content = "DRAG";
  }

  return (
    <div className="fixed top-0 left-0 pointer-events-none z-[99999] hidden lg:block">
      {/* Vòng tròn bên ngoài - Có độ trễ chuyển động tạo quán tính */}
      <div
        className={`rounded-full flex justify-center items-center transition-all duration-300 ease-out ${outerSize} ${outerClass}`}
        style={{
          transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0) translate(-50%, -50%)`,
          transitionProperty: "width, height, background-color, transform, border",
          transitionDuration: "0.15s, 0.15s, 0.15s, 0.1s, 0.15s",
          transitionTimingFunction: "ease-out",
        }}
      >
        {content && (
          <span className="text-[9px] font-bold tracking-[0.2em] select-none text-white">
            {content}
          </span>
        )}
      </div>

      {/* Dấu chấm trung tâm - Di chuyển lập tức theo tọa độ chuột */}
      <div
        className={`rounded-full fixed top-0 left-0 transition-all duration-75 pointer-events-none -translate-x-1/2 -translate-y-1/2 ${innerClass}`}
        style={{
          transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
        }}
      />
    </div>
  );
};

export default CustomCursor;
