import mongoose from "mongoose";
import dns from "dns";
import dotenv from "dotenv";

// Ép buộc Node.js ưu tiên phân giải IPv4 trước IPv6 để sửa lỗi querySrv ECONNREFUSED trên Windows
dns.setDefaultResultOrder("ipv4first");
import { glasses } from "../../client/src/data/glasses.js";
import { sunglasses } from "../../client/src/data/sunglasses.js";
import Product from "../models/Product.js";

// Đọc cấu hình môi trường từ config.env
dotenv.config({ path: "./config.env" });

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/gentle_monster";
    await mongoose.connect(mongoUri);
    console.log("[Seeder] Connected to MongoDB database...");

    // Xóa toàn bộ sản phẩm cũ trong Database
    await Product.deleteMany();
    console.log("[Seeder] Cleared all existing products in Database.");

    // Dùng đối tượng Map để lọc trùng và gộp danh mục sản phẩm trùng lặp theo mã SKU
    const uniqueProductsMap = {};

    // 1. Chuẩn hóa và nạp dữ liệu kính thường (Glasses)
    glasses.forEach((item) => {
      if (item && item.sku) {
        const randFront = `${138 + (item.name.length % 12)}mm`;
        const randSide = `${145 + (item.name.length % 10)}mm`;
        const randWidth = `${46 + (item.name.length % 8)}mm`;
        const randHeight = `${36 + (item.name.length % 10)}mm`;
        const randBridge = `${18 + (item.name.length % 5)}mm`;

        uniqueProductsMap[item.sku] = {
          name: item.name,
          price: item.price,
          sku: item.sku,
          collections: Array.from(new Set([...(item.collections || []), "Glasses"])),
          collection: item.collection || "Glasses",
          thumbnail: item.thumbnail,
          gallery: item.gallery || [],
          slug: item.slug || "",
          url: `/shop/${item.sku}`, // Chuyển hướng sang route shop local
          description: `The ${item.name} glasses present a structural, minimalist silhouette that highlights the creative craftsmanship of Gentle Monster. Handcrafted from premium polished acetate, this frame boasts lightweight comfort for everyday wear.`,
          features: ["Blue Light Blocking Lenses", "100% UV Protection", "Premium Acetate Frame", "Comes in official case and box packaging"],
          frameFront: randFront,
          frameSide: randSide,
          lensWidth: randWidth,
          lensHeight: randHeight,
          bridge: randBridge,
        };
      }
    });

    // 2. Chuẩn hóa và nạp dữ liệu kính râm (Sunglasses), tự động gộp danh mục nếu trùng SKU
    sunglasses.forEach((item) => {
      if (item && item.sku) {
        const randFront = `${140 + (item.name.length % 12)}mm`;
        const randSide = `${146 + (item.name.length % 10)}mm`;
        const randWidth = `${48 + (item.name.length % 8)}mm`;
        const randHeight = `${38 + (item.name.length % 10)}mm`;
        const randBridge = `${18 + (item.name.length % 5)}mm`;

        if (uniqueProductsMap[item.sku]) {
          // Gộp các bộ sưu tập nếu SKU đã tồn tại
          uniqueProductsMap[item.sku].collections = Array.from(
            new Set([
              ...uniqueProductsMap[item.sku].collections,
              ...(item.collections || []),
              "Sunglasses",
            ])
          );
          // Gộp luôn mô tả sang dạng kính râm và chuyển đổi url
          uniqueProductsMap[item.sku].collection = "Sunglasses";
          uniqueProductsMap[item.sku].description = `The ${item.name} sunglasses showcase a bold, contemporary design that accentuates modern silhouettes. Handcrafted using premium glossy materials and fitted with dark protective lenses.`;
          uniqueProductsMap[item.sku].features = ["100% UV Protection", "Zeiss Lenses", "Premium Handcrafted Acetate", "Comes in official case and box packaging"];
        } else {
          uniqueProductsMap[item.sku] = {
            name: item.name,
            price: item.price,
            sku: item.sku,
            collections: Array.from(new Set([...(item.collections || []), "Sunglasses"])),
            collection: item.collection || "Sunglasses",
            thumbnail: item.thumbnail,
            gallery: item.gallery || [],
            slug: item.slug || "",
            url: `/shop/${item.sku}`, // Chuyển hướng sang route shop local
            description: `The ${item.name} sunglasses showcase a bold, contemporary design that accentuates modern silhouettes. Handcrafted using premium glossy materials and fitted with dark protective lenses.`,
            features: ["100% UV Protection", "Zeiss Lenses", "Premium Handcrafted Acetate", "Comes in official case and box packaging"],
            frameFront: randFront,
            frameSide: randSide,
            lensWidth: randWidth,
            lensHeight: randHeight,
            bridge: randBridge,
          };
        }
      }
    });

    const allProducts = Object.values(uniqueProductsMap);
    
    // Lưu hàng loạt vào MongoDB
    await Product.insertMany(allProducts);

    console.log(`[Seeder] Successfully imported ${allProducts.length} products to MongoDB!`);
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`[Error] Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
