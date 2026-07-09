import React from "react";
import CategoryLayout from "../components/CategoryLayout";
import { sunglasses } from "../data/sunglasses";

/**
 * Trang Sunglasses (Danh mục kính râm)
 * - Data Layer: Chứa mô tả văn bản tĩnh của kính râm để nạp vào layout.
 * - DRY Principle: Tái sử dụng CategoryLayout để vẽ lưới sản phẩm và xử lý bộ lọc.
 */
const Sunglasses = () => {
  // Danh sách các thẻ (tags) phân loại để hiển thị trên menu ngang
  const categories = [
    "View all",
    "Veggie Collection",
    "Bestselling",
    "2026 Collection",
    "Circuit Collection",
    "BOLD Collection",
    "Tinted Lenses",
    "Gifts",
  ];

  // Nội dung tiêu đề và mô tả tương ứng cho mỗi danh mục
  const categoryInfo = {
    "View all": {
      title: "ALL SUNGLASSES",
      desc: "Explore our sunglasses collection, showcasing distinctive and innovative frames in a variety of colors and shapes."
    },
    "Veggie Collection": {
      title: "2026 VEGGIE COLLECTION SUNGLASSES",
      desc: "The 2026 Veggie Collection sunglasses translate the vibrant colors and forms of vegetables into distinctive temple details, culminating in a singular aesthetic. Discover a compact yet structurally refined design."
    },
    "Bestselling": {
      title: "BESTSELLING SUNGLASSES",
      desc: "Discover our most desired sunglasses, ranging from square and wraparound shapes to cat-eye frames."
    },
    "2026 Collection": {
      title: "2026 COLLECTION",
      desc: "Introducing the 2026 sunglasses collection, reimagining organic details into a distinctive and refined line of eyewear."
    }
  };

  return (
    <CategoryLayout 
      data={sunglasses} 
      categories={categories} 
      categoryInfo={categoryInfo}
      defaultTitle="SUNGLASSES"
    />
  );
};

export default Sunglasses;
