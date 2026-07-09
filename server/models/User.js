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
  // Đối với tài khoản Google Privy không mật khẩu, bỏ qua check
  if (this.password === "google_login_no_password" && enteredPassword === "google_login_no_password") {
    return true;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
