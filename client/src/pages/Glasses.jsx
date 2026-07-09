import React from "react";
import CategoryLayout from "../components/CategoryLayout";
import { glasses } from "../data/glasses";

/**
 * Trang Glasses (Danh mục kính cận / kính viễn)
 * - Data Layer: Định nghĩa danh mục và mô tả tĩnh của kính cận để nạp vào layout.
 * - DRY Principle: Tái sử dụng CategoryLayout để đồng bộ cấu trúc hiển thị danh mục.
 */
const Glasses = () => {
  // Danh sách các thẻ (tags) phân loại
  const categories = [
    "View all",
    "Veggie Collection",
    "Bestselling",
    "2026 Collection",
    "BOLD Collection",
    "Blue Light Lenses",
    "Tinted Lenses",
    "Gifts",
  ];

  // Nội dung tiêu đề và mô tả tương ứng cho mỗi danh mục
  const categoryInfo = {
    "View all": {
      "title": "ALL GLASSES",
      "desc": "Explore our optical collection that conveys a modern aesthetic feel."
    },
    "Veggie Collection": {
      "title": "2026 VEGGIE COLLECTION GLASSES",
      "desc": "From frames echoing the silhouettes of vegetables to temple details that reinterpret the essence of stems with an aesthetic precision, discover compact optical designs that capture the vitality of nature through an original visual language."
    },
    "Bestselling": {
      "title": "BESTSELLING GLASSES",
      "desc": "Redefine your look with our most popular glasses, from sleek silver metal frames to trendy geek-chic styles."
    },
    "2026 Collection": {
      "title": "2026 COLLECTION GLASSES",
      "desc": "Discover the 2026 eyewear collection, featuring soft aesthetics with expressive flair and distinctive statement frames."
    },
    "BOLD Collection": {
      "title": "BOLD COLLECTION GLASSES",
      "desc": "The bridge detail of the BOLD Collection reinterprets the shape of a shield with a modern twist, redefining futurism through the innovative removal of nose pads. This glasses collection embodies a futuristic sensibility, featuring an exaggerated front volume balanced with a signature symbol that evokes a dynamic sense of speed."
    },
    "Blue Light Lenses": {
      "title": "BLUE LIGHT GLASSES",
      "desc": "Discover our glasses collection, featuring blue light flitering on lenses."
    },
    "Tinted Lenses": {
      "title": "TINTED GLASSES",
      "desc": "Introducing our tinted glasses collection, featuring lenses in colors ranging from refreshing green to subtle brown."
    },
    "Gifts": {
      "title": "GIFT GUIDE FOR GLASSES",
      "desc": "Discover a curated selection of glasses that complete the look."
    }
  };

  return (
    <CategoryLayout 
      data={glasses} 
      categories={categories} 
      categoryInfo={categoryInfo}
      defaultTitle="GLASSES"
    />
  );
};

export default Glasses;