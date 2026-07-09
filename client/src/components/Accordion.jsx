import React, { useState, useRef } from "react";

/**
 * Component khối nội dung thả xuống (Accordion).
 * Thường dùng cho các danh sách câu hỏi thường gặp (FAQs).
 * 
 * @param {String} title - Tiêu đề hiển thị trên thanh tiêu đề của Accordion
 * @param {React.ReactNode} children - Nội dung ẩn bên trong, sẽ trượt ra khi bấm mở
 */
const Accordion = ({ title, children }) => {
  // Quản lý trạng thái đóng/mở
  const [isOpen, setIsOpen] = useState(false);
  
  // Dùng ref để lấy chính xác chiều cao thực tế (scrollHeight) của khối nội dung bên trong.
  // Điều này cần thiết cho hiệu ứng trượt mượt mà (smooth height transition) bằng CSS.
  const contentRef = useRef(null);

  return (
    <div className="w-full bg-[#1e1e1e] rounded-full mb-3 px-6 py-4 overflow-hidden">
      {/* Nút bấm tiêu đề đóng mở */}
      <button 
        className="w-full flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-white text-sm md:text-[15px] font-medium tracking-wide">
          {title}
        </span>
        {/* Biểu tượng mũi tên xoay 180 độ khi trạng thái là isOpen */}
        <span className={`text-white transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>

      {/* KHỐI NỘI DUNG ẨN
          - maxHeight: Nếu mở thì lấy chiều cao động scrollHeight từ ref, nếu đóng thì set 0px.
          - transition-all duration-300: Giúp nội dung trượt lên xuống trơn tru thay vì giật cục.
          - opacity: Tăng/giảm độ mờ đục để tạo hiệu ứng biến mất nhẹ nhàng.
      */}
      <div 
        ref={contentRef}
        className="transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : "0px",
          marginTop: isOpen ? "16px" : "0px",
          opacity: isOpen ? 1 : 0
        }}
      >
        <div className="text-gray-400 text-sm md:text-[14px] leading-relaxed pb-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
