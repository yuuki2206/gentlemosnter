import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";

// Load các cấu hình môi trường từ config.env (chống ghi đè lỗi Windows dot-files)
dotenv.config({ path: "./config.env" });

// Khởi chạy kết nối Database MongoDB
connectDB();

const app = express();

// === CÀI ĐẶT MIDDLEWARES ===
app.use(cors()); // Cấp phép kết nối chéo cổng (Cross-Origin Resource Sharing)
app.use(express.json()); // Đọc body dữ liệu dạng JSON gửi lên từ Client

// === ĐỊNH TUYẾN API ROUTES ===
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Route mặc định kiểm tra tình trạng sống của Server
app.get("/", (req, res) => {
  res.send("Gentle Monster Clone Backend NodeJS Server is running smoothly...");
});

// Lắng nghe và khởi chạy Server trên cổng chỉ định (mặc định 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] App running in Node ES Module on port ${PORT}`);
});
