/**
 * Media Configuration & Helper
 * 
 * KIẾN THỨC NỀN TẢNG:
 * 1. Quản lý tài nguyên đa phương tiện đám mây (Cloud Media Management):
 *    - Việc đẩy các file video nặng (đôi khi lên tới hàng chục MB) lên Git/GitHub là phản mẫu (anti-pattern)
 *      vì nó làm tăng dung lượng repo cực nhanh, làm chậm tốc độ clone và vi phạm giới hạn kích thước file của GitHub.
 *    - Giải pháp chuẩn công nghiệp: Lưu trữ code trên GitHub, còn tài nguyên tĩnh (video, ảnh chất lượng cao)
 *      được đưa lên các CDN chuyên dụng như Cloudinary, AWS S3 hoặc Vercel Blob.
 * 
 * 2. Biến môi trường trong Vite (Vite Environment Variables):
 *    - Vite hỗ trợ các biến môi trường thông qua `import.meta.env`. Các biến này phải được bắt đầu bằng tiền tố `VITE_`.
 *    - Hàm `getMediaUrl` dưới đây tự động kiểm tra xem có biến môi trường `VITE_MEDIA_BASE_URL` hay không:
 *      - Nếu CÓ (khi chạy trên production/Vercel liên kết với Cloudinary): Trả về đường dẫn CDN đám mây đầy đủ.
 *      - Nếu KHÔNG (khi chạy dưới local localhost): Trả về đường dẫn local public `/Veggie%20collection/...` mặc định.
 *    - Giúp lập trình viên dễ dàng chuyển đổi hạ tầng lưu trữ chỉ bằng cách thay đổi 1 dòng trong file cấu hình `.env` mà không cần sửa code React.
 */

export const getMediaUrl = (path) => {
  const base = import.meta.env.VITE_MEDIA_BASE_URL || "";
  
  if (base) {
    // Ánh xạ các đường dẫn local sang đường dẫn CDN thực tế trên Production
    let resolvedPath = path;

    // 1. Ánh xạ Veggie Collection
    if (resolvedPath.includes("Veggie%20collection") || resolvedPath.includes("Veggie collection")) {
      resolvedPath = resolvedPath.replace(/Veggie%20collection|Veggie collection/g, "veggie-collection/video");
      if (resolvedPath.endsWith("Veggie.mp4")) {
        resolvedPath = resolvedPath.replace("Veggie.mp4", "hero_short_pc.mp4");
      }
    } else if (resolvedPath === "/Veggie.mp4" || resolvedPath === "Veggie.mp4") {
      resolvedPath = "veggie-collection/video/hero_short_pc.mp4";
    }

    // 2. Ánh xạ Circuit Collection
    if (resolvedPath.includes("Circuit%20collection") || resolvedPath.includes("Circuit collection")) {
      resolvedPath = resolvedPath.replace(/Circuit%20collection|Circuit collection/g, "circuit-collection/video");
    }

    // Đảm bảo không trùng dấu gạch chéo kép
    const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
    const cleanPath = resolvedPath.startsWith("/") ? resolvedPath : `/${resolvedPath}`;
    return `${cleanBase}${cleanPath}`;
  }

  // Chạy dưới Local
  if (base.endsWith("/") && path.startsWith("/")) {
    return `${base}${path.slice(1)}`;
  }
  return `${base}${path}`;
};

/**
 * Ảnh dự phòng mặc định (Unsplash Premium Sunglasses)
 * Được hiển thị khi link ảnh gốc từ database hoặc Cloudinary bị lỗi 404 hoặc không load được.
 */
export const FALLBACK_IMAGE_URL = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%"><rect width="100%" height="100%" fill="%23f3f3f3"/><g fill="none" stroke="%23cccccc" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" transform="translate(2, 8)"><path d="M0 3c0-1.66 1.34-3 3-3h2c1.66 0 3 1.34 3 3v1c0 1.66-1.34 3-3 3H3c-1.66 0-3-1.34-3-3z"/><path d="M12 3c0-1.66 1.34-3 3-3h2c1.66 0 3 1.34 3 3v1c0 1.66-1.34 3-3 3h-2c-1.66 0-3-1.34-3-3z"/><path d="M8 3h4"/><path d="M0 3c0-1 .5-2 1.5-2.5M20 3c0-1-.5-2-1.5-2.5"/></g></svg>`;

/**
 * Bộ bắt lỗi hình ảnh (Image Error Handler)
 * Tự động gán nguồn ảnh dự phòng khi ảnh gốc gặp sự cố tải, ngăn hiển thị icon ảnh vỡ mất thẩm mỹ.
 */
export const handleImageError = (e) => {
  e.target.onerror = null; // Tránh lặp vô hạn nếu ảnh dự phòng cũng lỗi
  e.target.src = FALLBACK_IMAGE_URL;
};
