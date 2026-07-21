import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Order from "../models/Order.js";

const router = express.Router();

/**
 * Middleware xác thực token JWT gửi kèm trong Header Authorization (Bearer Token)
 */
export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "gentle_monster_secret_key_2026");
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Không có quyền truy cập, token không hợp lệ." });
    }
  } else {
    res.status(401).json({ message: "Không tìm thấy token ủy quyền." });
  }
};

/**
 * @route   POST /api/auth/check-email
 * @desc    Kiểm tra email đã tồn tại trong database chưa
 */
router.post("/check-email", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    res.json({ exists: !!user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/auth/register
 * @desc    Đăng ký tài khoản người dùng mới và trả về token JWT
 */
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, country, phone, walletAddress, adminKey } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email này đã được đăng ký tài khoản." });
    }

    // Đọc IP thật của thiết bị đăng ký
    const rawIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip;
    const clientIp = typeof rawIp === "string" && rawIp.includes("::ffff:") ? rawIp.split("::ffff:")[1] : rawIp;

    // Kiểm tra mã đăng ký quyền Admin
    const isAdmin = adminKey && adminKey.trim() === (process.env.ADMIN_SECRET_KEY || "123456789");
    const role = isAdmin ? "admin" : "user";

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      country,
      phone,
      walletAddress,
      role,
      registrationIp: clientIp || "127.0.0.1",
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "gentle_monster_secret_key_2026", {
      expiresIn: "30d",
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        country: user.country,
        phone: user.phone,
        walletAddress: user.walletAddress,
        role: user.role,
        registrationIp: user.registrationIp,
        purchases: [],
      },
    });
  } catch (error) {
    res.status(500).json({ message: `Lỗi đăng ký: ${error.message}` });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Đăng nhập tài khoản bằng email/mật khẩu và trả về token JWT
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "gentle_monster_secret_key_2026", {
        expiresIn: "30d",
      });

      res.json({
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          country: user.country,
          phone: user.phone,
          walletAddress: user.walletAddress,
          role: user.role,
          registrationIp: user.registrationIp,
          purchases: await Order.find({
          $or: [{ user: user._id }, { userEmail: user.email }],
        }).sort({ createdAt: -1 }),
        },
      });
    } else {
      res.status(401).json({ message: "Mật khẩu không chính xác hoặc email chưa đăng ký." });
    }
  } catch (error) {
    res.status(500).json({ message: `Lỗi đăng nhập: ${error.message}` });
  }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Cập nhật thông tin tài khoản người dùng hiện tại
 */
router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.country = req.body.country || user.country;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      user.walletAddress = req.body.walletAddress !== undefined ? req.body.walletAddress : user.walletAddress;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      res.json({
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        country: updatedUser.country,
        phone: updatedUser.phone,
        walletAddress: updatedUser.walletAddress,
        role: updatedUser.role,
        registrationIp: updatedUser.registrationIp,
        purchases: await Order.find({ user: updatedUser._id }).sort({ createdAt: -1 }),
      });
    } else {
      res.status(404).json({ message: "Không tìm thấy người dùng." });
    }
  } catch (error) {
    res.status(500).json({ message: `Lỗi cập nhật: ${error.message}` });
  }
});

/**
 * @route   GET /api/auth/profile
 * @desc    Lấy thông tin tài khoản hiện tại (qua token JWT)
 */
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    const orders = await Order.find({
      $or: [{ user: user._id }, { userEmail: user.email }],
    }).sort({ createdAt: -1 });
    const userObj = user.toObject();
    userObj.purchases = orders;
    res.json(userObj);
  } catch (error) {
    res.status(500).json({ message: `Lỗi server: ${error.message}` });
  }
});

/**
 * @route   GET /api/auth/users
 * @desc    Lấy danh sách toàn bộ người dùng đã đăng ký (cho Admin Console)
 */
router.get("/users", protect, async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: `Lỗi server: ${error.message}` });
  }
});

/**
 * @route   DELETE /api/auth/profile
 * @desc    Xóa tài khoản hiện tại của người dùng
 */
router.delete("/profile", protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    await Order.deleteMany({ user: req.user._id });
    res.json({ message: "Xóa tài khoản thành công." });
  } catch (error) {
    res.status(500).json({ message: `Lỗi server: ${error.message}` });
  }
});

/**
 * @route   DELETE /api/auth/users/:email
 * @desc    Xóa tài khoản người dùng theo email (cho Admin Console)
 */
router.delete("/users/:email", protect, async (req, res) => {
  try {
    const userToDelete = await User.findOne({ email: req.params.email });
    if (!userToDelete) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }
    if (userToDelete.role === "admin") {
      return res.status(403).json({ message: "Bảo mật: Không thể xóa tài khoản Admin." });
    }
    await User.findByIdAndDelete(userToDelete._id);
    await Order.deleteMany({ user: userToDelete._id });
    res.json({ message: "Đã xóa tài khoản khỏi hệ thống." });
  } catch (error) {
    res.status(500).json({ message: `Lỗi server: ${error.message}` });
  }
});

export default router;
