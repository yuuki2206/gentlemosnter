import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import ProductCard from "./ProductCard";

/**
 * Component hiển thị danh sách sản phẩm dạng trượt (Swiper Slider).
 * Thường dùng để hiển thị các mục như "BEST THIS WEEK" ở trang chủ.
 *
 * @param {String} title - Tiêu đề của mục danh mục (Ví dụ: "BEST: THIS WEEK TOP 20")
 * @param {Array} products - Danh sách sản phẩm cần hiển thị
 */
const ProductSlider = ({ title, products = [] }) => {
  return (
    <section className="w-full pt-16 pb-20 bg-[#fafafa] text-black overflow-hidden">
      
      {/* TIÊU ĐỀ SECTION */}
      <div className="px-4 md:px-12 mb-10 flex flex-col items-start gap-1">
        <h2 className="text-[10px] md:text-[12px] font-medium tracking-widest uppercase">
          {title}
        </h2>
        <a href="#" className="text-[10px] md:text-[12px] tracking-widest uppercase hover:underline underline-offset-4">
          MORE
        </a>
      </div>

      {/* KHUNG TRƯỢT KÍNH MẮT
          - breakpoints: Điều chỉnh số lượng sản phẩm hiển thị dựa trên kích thước màn hình (Responsive).
            + Dưới 768px (Mobile): Hiện 1.5 sản phẩm (để lộ một phần sản phẩm tiếp theo gợi ý vuốt).
            + Từ 768px (Tablet): Hiện 3.5 sản phẩm.
            + Trên 1024px (Desktop): Hiện 5 sản phẩm.
          - cursor-ew-resize: Biến đổi con trỏ chuột thành dạng mũi tên kéo sang ngang.
          - overflow-visible: Cho phép ảnh tràn lề tự nhiên để tạo hiệu ứng thị giác tốt hơn.
      */}
      <Swiper
        modules={[FreeMode]}
        freeMode={true}
        breakpoints={{
          320: { slidesPerView: 1.5, spaceBetween: 20 },
          768: { slidesPerView: 3.5, spaceBetween: 30 },
          1024: { slidesPerView: 5, spaceBetween: 40 },
        }}
        className="w-full pl-4 md:pl-12 !pr-0 cursor-ew-resize !overflow-visible"
      >
        {products?.map((item, idx) => (
          <SwiperSlide key={item.sku || idx}>
            {/* Sử dụng thẻ ProductCard mặc định của trang chủ, ẩn nút đổi Model View vì không cần thiết */}
            <ProductCard item={item} hideModelView={true} />
          </SwiperSlide>
        ))}
      </Swiper>
      
    </section>
  );
};

export default ProductSlider;