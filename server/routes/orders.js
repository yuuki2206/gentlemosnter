import express from "express";
import Order from "../models/Order.js";
import { protect } from "./auth.js";

const router = express.Router();

/**
 * @route   POST /api/orders
 * @desc    Tạo đơn hàng mới (Thanh toán Web2 hoặc Web3 MetaMask) và lưu vào Database
 */
router.post("/", protect, async (req, res) => {
  try {
    const { orderId, items, total, ethTotal, txHash, sender, receiver, status, type } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng rỗng, không thể tạo đơn hàng." });
    }

    const order = await Order.create({
      orderId,
      user: req.user._id,
      userEmail: req.user.email,
      items,
      total,
      ethTotal,
      txHash,
      sender,
      receiver,
      status,
      type,
    });

    res.status(201).json(order);
  } catch (error) {
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
 * @desc    Lấy toàn bộ lịch sử đơn hàng của toàn hệ thống (Chỉ dành cho Admin)
 */
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: `Lỗi truy vấn danh sách đơn hàng: ${error.message}` });
  }
});

export default router;
