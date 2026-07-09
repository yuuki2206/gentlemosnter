import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

/**
 * FallbackStory Component
 * 
 * KIẾN THỨC NỀN TẢNG:
 * 1. Cơ chế hiển thị Dự phòng (Fallback Interface):
 *    - Khi quản trị viên thêm một chiến dịch câu chuyện mới trong CMS mà frontend chưa kịp xây dựng layout tùy chỉnh riêng biệt,
 *      component này đóng vai trò hiển thị giao diện mặc định, đảm bảo hệ thống không bị lỗi crash hoặc hiển thị trang trắng.
 * 
 * 2. Điều khiển phát Video khi Di chuột (Hover Play Event Handling):
 *    - Các trình duyệt hiện đại chặn tự động phát video có âm thanh (`autoplay`).
 *    - Kỹ thuật: Sử dụng sự kiện `onMouseEnter` để gọi phương thức phát `.play()` và `onMouseLeave` để gọi `.pause()` đồng thời
 *      reset thời gian video về đầu (`currentTime = 0`). Điều này giúp trang web sinh động hơn khi người dùng lướt qua sản phẩm
 *      mà không gây quá tải tải băng thông mạng hoặc chiếm dụng GPU khi không tương tác.
 */
const FallbackStory = ({ story, collectionProducts }) => {
  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased">
      <Header forceTransparent={true} />
      
      {/* Banner lớn */}
      <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
        <img
          src={story.pcImageUrl}
          alt={story.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45 flex flex-col justify-end p-8 md:p-16">
          <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-wider mb-4">
            {story.title}
          </h1>
          <p className="text-sm max-w-2xl text-gray-300 font-light leading-relaxed mb-6">
            {story.description}
          </p>
        </div>
      </div>

      {/* Collection items */}
      {collectionProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-lg font-bold tracking-[0.2em] uppercase mb-12 border-b border-gray-800 pb-4">
            THE COLLECTION
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {collectionProducts.map((prod) => (
              <div key={prod.sku} className="group relative">
                <div className="aspect-[3/4] w-full overflow-hidden bg-[#151515] mb-4">
                  {prod.thumbnail.endsWith(".mp4") ? (
                    <video
                      src={prod.thumbnail}
                      muted
                      loop
                      playsInline
                      onMouseEnter={(e) => e.target.play()}
                      onMouseLeave={(e) => {
                        e.target.pause();
                        e.target.currentTime = 0;
                      }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={prod.thumbnail}
                      alt={prod.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <h3 className="text-xs uppercase tracking-widest font-semibold text-white mb-1">
                  {prod.name}
                </h3>
                <p className="text-[11px] text-gray-400">
                  {prod.price.toLocaleString("vi-VN")} VND
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default FallbackStory;
