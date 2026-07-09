import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import SwiperProductCard from "./SwiperProductCard";
import { API_BASE_URL } from "../config/api";

/**
 * CategoryLayout Component - Layout dùng chung cho trang danh mục Sunglasses & Glasses (nguyên lý DRY).
 * - useSearchParams: Đồng bộ trạng thái bộ lọc danh mục trực tiếp lên thanh địa chỉ URL (?category=...).
 * - useEffect: Tự động cuộn trang lên đầu và reset bộ đếm hiển thị khi đổi danh mục.
 * - Array.slice: Phân trang tĩnh (Load More) hiển thị thêm 32 sản phẩm mỗi lần nhấn nút.
 */
const CategoryLayout = ({ data = [], categories = [], categoryInfo = {}, defaultTitle = "PRODUCTS" }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "View all";
  const [visibleCount, setVisibleCount] = useState(32);

  // Mảng chứa sản phẩm tải từ server (hoặc fallback tĩnh)
  const [products, setProducts] = useState(data);
  const [loading, setLoading] = useState(true);

  // Tải danh sách kính bất đồng bộ từ Database qua NodeJS API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const typeParam = defaultTitle === "SUNGLASSES" ? "Sunglasses" : "Glasses";
        const res = await fetch(`${API_BASE_URL}/products?type=${typeParam}`);
        if (res.ok) {
          const dbProducts = await res.json();
          if (dbProducts && dbProducts.length > 0) {
            setProducts(dbProducts);
          }
        }
      } catch (err) {
        console.warn("[API] Không kết nối được Server, tự động dùng dữ liệu tĩnh:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [defaultTitle, data]);

  useEffect(() => {
    setVisibleCount(32);
    window.scrollTo(0, 0);
  }, [activeCategory]);

  // Lấy thông tin tiêu đề (title) và mô tả (desc) dựa trên danh mục đang chọn.
  // Nếu không có trong `categoryInfo`, sẽ dùng cấu trúc chuỗi mặc định.
  const currentInfo = categoryInfo[activeCategory] || {
    title: `${activeCategory.toUpperCase()} ${defaultTitle}`,
    desc: `Explore our exclusive ${activeCategory} collection.`
  };

  // Logic Lọc (Filter) Dữ Liệu
  // Nếu là "View all" thì lấy toàn bộ `data`.
  // Nếu không, tìm những item có `.collection` bằng danh mục, hoặc có chứa danh mục trong mảng `.collections`.
  const filteredData = activeCategory === "View all" 
    ? products 
    : products.filter(item =>
        item.collection === activeCategory || (item.collections && item.collections.includes(activeCategory))
      );

  // Sắp xếp các sản phẩm có chứa video (.mp4) lên đầu trang danh mục (Sunglasses và Glasses)
  // để mang lại trải nghiệm xem video giới thiệu trước tương tự như trang Sunglasses gốc.
  const sortedData = [...filteredData].sort((a, b) => {
    const hasVideoA = (a.thumbnail && a.thumbnail.toLowerCase().endsWith(".mp4")) || a.gallery?.some(g => g.toLowerCase().endsWith(".mp4"));
    const hasVideoB = (b.thumbnail && b.thumbnail.toLowerCase().endsWith(".mp4")) || b.gallery?.some(g => g.toLowerCase().endsWith(".mp4"));
    if (hasVideoA && !hasVideoB) return -1;
    if (!hasVideoA && hasVideoB) return 1;
    return 0;
  });

  // Hàm xử lý tăng số lượng sản phẩm hiển thị thêm 32 item khi bấm "Load More"
  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 32);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#f8f8f8] text-black">
      
      {/* HEADER: Dùng forceSolid=true để Header luôn hiện viền/màu nền rắn trên trang danh mục */}
      <Header forceSolid={true} />

      <main className="pt-24 md:pt-32 pb-20 px-4 md:px-8">
        
        {/* THANH ĐIỀU HƯỚNG DANH MỤC & NÚT FILTER */}
        <div className="flex justify-between items-center mb-16 md:mb-24">
          
          {/* Vùng danh sách danh mục (cuộn ngang trên Mobile, ẩn thanh scroll) */}
          <div className="flex items-center gap-2 md:gap-3 overflow-x-auto scrollbar-hide pr-4">
            {categories.map((cat, index) => (
              <button
                key={index}
                onClick={() => {
                  setSearchParams({ category: cat });
                  setVisibleCount(32); // Reset count khi chuyển tab
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-full border text-[10px] md:text-[11px] transition-colors ${
                  activeCategory === cat
                    ? "bg-[#e5e5e5] border-[#e5e5e5] text-black font-medium"
                    : "bg-transparent border-gray-200 text-gray-500 hover:border-gray-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Nút Filter bên phải (Ẩn trên mobile, chỉ hiện trên tablet/PC - md:flex) */}
          <button className="hidden md:flex flex-none items-center gap-2 text-[11px] font-medium hover:opacity-60 transition-opacity ml-4">
            Filter <SlidersHorizontal size={14} strokeWidth={1.5} />
          </button>
        </div>

        {/* TIÊU ĐỀ & MÔ TẢ DANH MỤC */}
        <div className="text-center mb-16 md:mb-24 px-4 md:px-0">
          <h1 className="text-sm md:text-base font-bold tracking-[0.1em] uppercase mb-4">
            {currentInfo.title}
          </h1>
          <p className="text-[10px] md:text-[11px] text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {currentInfo.desc}
          </p>
        </div>

        {/* LƯỚI SẢN PHẨM (GRID) */}
        {sortedData.length === 0 ? (
          // Trạng thái Empty: Không tìm thấy sản phẩm
          <div className="flex justify-center items-center py-20 text-gray-400 text-sm">
            No products found in this collection.
          </div>
        ) : (
          <>
            {/* Lưới Responsive: 2 cột trên Mobile, 3 cột trên Tablet, 4 cột trên PC */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-10 md:gap-x-4 md:gap-y-16">
              
              {/* Cắt mảng (slice) từ 0 đến visibleCount để render thẻ sản phẩm */}
              {sortedData.slice(0, visibleCount).map((item) => (
                <SwiperProductCard key={item.sku} item={item} />
              ))}

            </div>

            {/* NÚT LOAD MORE: Chỉ hiện khi số lượng render < tổng số lượng mảng */}
            {visibleCount < sortedData.length && (
              <div className="flex justify-center mt-12 md:mt-16">
                <button
                  onClick={handleLoadMore}
                  className="px-16 py-3 border border-[#d5d5d5] rounded-[10px] text-[13px] text-black font-normal hover:bg-[#f0f0f0] transition-colors tracking-wide"
                >
                  More {Math.min(visibleCount, sortedData.length)} / {sortedData.length}
                </button>
              </div>
            )}
          </>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default CategoryLayout;
