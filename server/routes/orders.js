import express from "express";
import jwt from "jsonwebtoken";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { protect } from "./auth.js";

const router = express.Router();

/**
 * @route   POST /api/orders
 * @desc    Tạo đơn hàng mới (Thanh toán Web2 hoặc Web3 MetaMask) và lưu vào Database
 */
router.post("/", async (req, res) => {
  try {
    const { orderId, items, total, ethTotal, txHash, sender, receiver, status, type, userEmail } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng rỗng, không thể tạo đơn hàng." });
    }

    let userId = null;
    let email = userEmail || req.body.email || "customer@gentlemonster.com";

    // Giải mã User từ token (Hỗ trợ cả JWT token lẫn Token Email)
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      const token = req.headers.authorization.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "gentle_monster_secret_key_2026");
        const foundUser = await User.findById(decoded.id);
        if (foundUser) {
          userId = foundUser._id;
          email = foundUser.email;
        }
      } catch (e) {
        const foundUser = await User.findOne({ email: token });
        if (foundUser) {
          userId = foundUser._id;
          email = foundUser.email;
        } else if (token.includes("@")) {
          email = token;
        }
      }
    }

    // Chuẩn hóa định dạng mảng sản phẩm trong giỏ hàng
    const formattedItems = (items || []).map((item) => ({
      sku: item.sku || item.id || "N/A",
      name: item.name || item.title || "Gentle Monster Eyewear",
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      thumbnail: item.thumbnail || item.url || (Array.isArray(item.images) ? item.images[0] : "") || "",
    }));

    const order = await Order.create({
      orderId: orderId || `INV_${Math.floor(100000 + Math.random() * 900000)}`,
      user: userId,
      userEmail: email,
      items: formattedItems,
      total: Number(total) || 0,
      ethTotal: ethTotal || "0",
      txHash: txHash || "",
      sender: sender || "",
      receiver: receiver || "",
      status: status || "Completed",
      type: type || "Web3",
    });

    console.log(`[MongoDB Success] Đã lưu thành công đơn hàng ${order.orderId} vào MongoDB Atlas!`);
    res.status(201).json(order);
  } catch (error) {
    console.error("[MongoDB Error] Lỗi lưu đơn hàng:", error.message);
    res.status(500).json({ message: `Lỗi tạo đơn hàng: ${error.message}` });
  }
});

/**
 * @route   GET /api/orders/my-orders
 * @desc    Lấy toàn bộ lịch sử đơn hàng của người dùng hiện tại
 */
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: `Lỗi truy vấn đơn hàng: ${error.message}` });
  }
});

// Middleware xác thực chỉ cho phép Admin truy cập
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Yêu cầu quyền Admin để thực hiện thao tác này." });
  }
};

/**
 * @route   GET /api/orders
 * @desc    Lấy toàn bộ lịch sử đơn hàng của toàn hệ thống cho Admin Dashboard
 */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: `Lỗi truy vấn danh sách đơn hàng: ${error.message}` });
  }
});

export default router;
