import React from "react";
import { useParams } from "react-router-dom";
import { stories } from "../data/stories";
import { products } from "../data/products";
import VeggieCollection from "./stories/VeggieCollection";
import CircuitCollection from "./stories/CircuitCollection";
import FallbackStory from "./stories/FallbackStory";
import "../veggie.css";
import "../circuit.css";

/**
 * StoryDetail Component
 * 
 * KIẾN THỨC NỀN TẢNG & KIẾN TRÚC:
 * 1. Cơ chế Dispatcher (Bộ điều phối trung gian):
 *    - Thay vì viết gộp hàng ngàn dòng code giao diện của nhiều chiến dịch khác nhau vào chung một file gây rối,
 *      StoryDetail đóng vai trò là "Router con" hoặc "Dispatcher". Nó xác định chiến dịch hiện tại thông qua URL param `id` (slug),
 *      sau đó phân phối luồng render đến các component con chuyên dụng (`VeggieCollection`, `CircuitCollection`, `FallbackStory`).
 *    - Thiết kế này tuân thủ nguyên tắc Single Responsibility Principle (SRP) trong SOLID - mỗi file chỉ giải quyết đúng 1 chiến dịch.
 * 
 * 2. So khớp Chiến dịch linh hoạt (Fuzzy Matching):
 *    - Phân tích các từ khóa đặc trưng trong `title` (như "veggie", "f1", "circuit") hoặc so khớp trực tiếp ID chiến dịch từ CMS để quyết định giao diện chính xác.
 * 
 * 3. Tái sử dụng dữ liệu sản phẩm:
 *    - Lọc động danh sách sản phẩm thuộc bộ sưu tập tương ứng với tiêu đề chiến dịch để chuyển tiếp.
 */
const StoryDetail = () => {
  const { id } = useParams();

  // 1. Tìm thông tin chi tiết của chiến dịch dựa trên ID hoặc mặc định lấy chiến dịch đầu tiên
  const story = stories.find((s) => s.id === id) || stories[0];

  // 2. Lọc danh sách sản phẩm thuộc bộ sưu tập tương ứng với tiêu đề chiến dịch
  const collectionProducts = products.filter(
    (p) => p.collection?.toLowerCase() === story.title?.toLowerCase() ||
           p.collections?.some(c => c.toLowerCase() === story.title?.toLowerCase())
  );

  // 3. Khai báo danh sách sản phẩm đặc trưng của Veggie Collection (hình ảnh, đường dẫn và tên)
  const veggieDisplayItems = [
    { name: "Vert 02(CM)", url: "/int/en/item/0Q04AJXM47349/vert02-cm", img: "https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/image/veggie_product_1_pc.png", mobImg: "https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/image/veggie_product_1_mo.png" },
    { name: "Mori 02(BR)", url: "/int/en/item/0Q04AJXJ87341/mori02-br", img: "https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/image/veggie_product_2_pc.png", mobImg: "https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/image/veggie_product_2_mo.png" },
    { name: "Radi 02", url: "/int/en/item/0Q04AJXK47333/radi02", img: "https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/image/veggie_product_3_pc.png", mobImg: "https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/image/veggie_product_3_mo.png" },
    { name: "Tofi 02(R)", url: "/int/en/item/0Q04AJXKW734D/tofi02-r", img: "https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/image/veggie_product_4_pc.png", mobImg: "https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/image/veggie_product_4_mo.png" },
    { name: "Zest BR2", url: "/int/en/item/0Q04AJXMG737D/zestbr2", img: "https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/image/veggie_product_5_pc.png", mobImg: "https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/image/veggie_product_5_mo.png" },
    { name: "Jasmin 01(V)", url: "/int/en/item/0Q04AJXHM7330/jasmin01-v", img: "https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/image/veggie_product_6_pc.png", mobImg: "https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/image/veggie_product_6_mo.png" },
    { name: "Ivy 01(C)", url: "/int/en/item/0Q04AJXG87386/ivy01-c", img: "https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/image/veggie_product_7_pc.png", mobImg: "https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/image/veggie_product_7_mo.png" },
    { name: "Harv T1", url: "/int/en/item/0Q04AJXFG736K/harvt1", img: "https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/image/veggie_product_8_pc.png", mobImg: "https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/image/veggie_product_8_mo.png" },
    { name: "Oatt 02", url: "/int/en/item/0Q04AJXJM7349/oatt02", img: "https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/image/veggie_product_9_pc.png", mobImg: "https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/image/veggie_product_9_mo.png" },
    { name: "Aden 02(GRM)", url: "/int/en/item/0Q04AJXE8736R/aden02-grm", img: "https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/image/veggie_product_10_pc.png", mobImg: "https://gm-prd-resource.gentlemonster.com/assets/stories/veggie-collection/image/veggie_product_10_mo.png" }
  ];

  // 4. Định nghĩa các điều kiện khớp trang chi tiết đặc biệt
  const isVeggie = story.title?.toLowerCase().includes("veggie") || id === "850266286345551416";
  const isCircuit = story.title?.toLowerCase().includes("circuit") ||
                    story.title?.toLowerCase().includes("f1") ||
                    id === "circuit-collection" ||
                    id === "817695100293913422";

  // 5. Phân phối hiển thị đến các component con
  if (isCircuit) {
    return <CircuitCollection story={story} />;
  }

  if (isVeggie) {
    return <VeggieCollection story={story} veggieDisplayItems={veggieDisplayItems} />;
  }

  return <FallbackStory story={story} collectionProducts={collectionProducts} />;
};

export default StoryDetail;
