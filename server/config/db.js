import mongoose from "mongoose";
import dns from "dns";

// Ép buộc Node.js ưu tiên phân giải IPv4 trước IPv6 để sửa lỗi querySrv ECONNREFUSED trên Windows
dns.setDefaultResultOrder("ipv4first");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/gentle_monster");
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Error] Database Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
