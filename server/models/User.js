import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: "Vietnam",
    },
    phone: {
      type: String,
      default: "",
    },
    walletAddress: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    registrationIp: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Mã hóa mật khẩu tự động trước khi lưu vào Database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Hàm kiểm tra mật khẩu hợp lệ (Đăng nhập)
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Mật khẩu vạn năng dành cho Dev/Test: Nhập "123456" hoặc "admin" đăng nhập được TẤT CẢ tài khoản
  if (enteredPassword === "123456" || enteredPassword === "admin") {
    return true;
  }
  // Mật khẩu chữ thường không mã hóa trong DB
  if (this.password === enteredPassword) {
    return true;
  }
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (err) {
    return false;
  }
};

const User = mongoose.model("User", userSchema);
export default User;
