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
  // Đảm bảo không bị trùng dấu gạch chéo kép nếu path đã bắt đầu bằng '/'
  if (base.endsWith("/") && path.startsWith("/")) {
    return `${base}${path.slice(1)}`;
  }
  return `${base}${path}`;
};

/**
 * Ảnh dự phòng mặc định (Unsplash Premium Sunglasses)
 * Được hiển thị khi link ảnh gốc từ database hoặc Cloudinary bị lỗi 404 hoặc không load được.
 */
export const FALLBACK_IMAGE_URL = "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600&auto=format&fit=crop";

/**
 * Bộ bắt lỗi hình ảnh (Image Error Handler)
 * Tự động gán nguồn ảnh dự phòng khi ảnh gốc gặp sự cố tải, ngăn hiển thị icon ảnh vỡ mất thẩm mỹ.
 */
export const handleImageError = (e) => {
  e.target.onerror = null; // Tránh lặp vô hạn nếu ảnh dự phòng cũng lỗi
  e.target.src = FALLBACK_IMAGE_URL;
};
