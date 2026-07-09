import Header from "../components/Header";
import Hero from "../components/Hero";
import CampaignSlider from "../components/CampaignSlider";
import ProductSlider from "../components/ProductSlider";
import Footer from "../components/Footer";
import { sunglasses } from "../data/sunglasses";
import { products as latestProducts } from "../data/products";

/**
 * Trang Chủ (Home Page)
 * - Array Filter & Map: Lọc sản phẩm có hình người đeo kính (mp4/poster) đưa lên trang chủ để sinh động.
 * - Deduplication: Loại bỏ trùng lặp sản phẩm giữa slider hàng mới về và slider bán chạy tuần này.
 */
const Home = () => {
  // LỌC DỮ LIỆU SẢN PHẨM CÓ MODEL ĐỂ TRƯNG BÀY
  // Chỉ bốc những sản phẩm có dữ liệu model (video mp4 hoặc có chứa chữ POSTER / LOOK_BOOK trong gallery)
  // Việc này nhằm mục đích hiển thị hình ảnh người đeo kính lên trước cho trang chủ sinh động
  const sunglassesWithModels = sunglasses.filter(item => {
    const hasMp4 = item.thumbnail && item.thumbnail.toLowerCase().endsWith(".mp4");
    const hasPoster = item.gallery?.some(g => g.includes("POSTER") || g.includes("LOOK_BOOK"));
    return hasMp4 || hasPoster;
  });

  // Lấy ra danh sách tên của các sản phẩm New Arrival (Mới về)
  // để loại trừ chúng khỏi phần "BEST THIS WEEK" bên dưới (Tránh trùng lặp sản phẩm trên trang chủ)
  const latestNames = latestProducts.map(p => p.name);

  return (
    <div className="relative w-full">
      {/* HEADER: Mặc định trong suốt trên trang chủ */}
      <Header />
      
      {/* HERO BANNER: Banner video xoay vòng chiếm trọn khung hình đầu tiên */}
      <Hero />
      
      {/* CONTAINER DƯỚI BANNER (Màu nền trắng tương phản) */}
      <div className="min-h-screen bg-white">
        
        {/* LATEST ARRIVAL: Slider chiến dịch mới giới thiệu kính kèm người đeo */}
        <CampaignSlider products={latestProducts} />

        {/* BEST THIS WEEK: Slider kính mắt bán chạy, đã loại bỏ các mẫu trùng với hàng mới về, giới hạn 20 sản phẩm */}
        <ProductSlider 
          title="BEST: THIS WEEK TOP 20" 
          products={sunglassesWithModels.filter(item => !latestNames.includes(item.name)).slice(0, 20)} 
        />

      </div>

      {/* FOOTER: Chân trang mặc định ở chế độ sáng (darkMode = false) */}
      <Footer />
    </div>
  );
};

export default Home;