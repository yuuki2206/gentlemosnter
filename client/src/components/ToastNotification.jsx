import React, { useState, useEffect } from "react";
import { X, ShoppingBag } from "lucide-react";

const ToastNotification = () => {
  const [toast, setToast] = useState(null); // { item, visible }

  useEffect(() => {
    const handleOpenToast = (e) => {
      const item = e.detail;
      setToast({ item, visible: true });
    };

    window.addEventListener("openCartToast", handleOpenToast);
    return () => window.removeEventListener("openCartToast", handleOpenToast);
  }, []);

  useEffect(() => {
    if (toast && toast.visible) {
      const timer = setTimeout(() => {
        setToast((prev) => prev ? { ...prev, visible: false } : null);
      }, 3500); // Tự động ẩn sau 3.5s
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!toast) return null;

  const { item, visible } = toast;

  return (
    <div
      className={`fixed top-4 right-4 md:top-8 md:right-8 z-[1000001] w-[320px] bg-white text-black p-4 shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col gap-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible ? "translate-y-0 opacity-100 scale-100" : "-translate-y-4 opacity-0 scale-95 pointer-events-none"
      }`}
    >
      {/* Tiêu đề & Nút Close */}
      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <ShoppingBag size={14} className="text-black" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-black">Added to Bag</span>
        </div>
        <button
          onClick={() => setToast((prev) => prev ? { ...prev, visible: false } : null)}
          className="text-gray-400 hover:text-black transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>

      {/* Thông tin kính */}
      <div className="flex gap-3 items-center">
        <div className="w-[60px] h-[45px] bg-[#f4f4f4] rounded-xs flex items-center justify-center p-1.5 overflow-hidden flex-shrink-0">
          <img src={item.thumbnail} alt={item.name} className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[11px] font-bold text-black uppercase tracking-wider line-clamp-1">{item.name}</span>
          <span className="text-[10px] text-gray-500 mt-0.5">₫ {Number(item.price).toLocaleString("en-US")}</span>
        </div>
      </div>

      {/* Nút xem chi tiết giỏ hàng */}
      <div className="flex gap-2 mt-1">
        <button
          onClick={() => {
            setToast((prev) => prev ? { ...prev, visible: false } : null);
            // Kích hoạt mở Giỏ hàng thông qua event
            window.dispatchEvent(new CustomEvent("triggerOpenCart"));
          }}
          className="flex-1 bg-black text-white hover:bg-neutral-800 transition-colors text-[9px] font-bold tracking-[0.2em] py-2.5 text-center uppercase cursor-pointer"
        >
          View Bag
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;
