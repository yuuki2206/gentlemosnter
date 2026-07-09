import express from "express";
import Product from "../models/Product.js";
import { protect } from "./auth.js";

const router = express.Router();

// Middleware xác thực chỉ cho phép Admin truy cập
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Yêu cầu quyền Admin để thực hiện thao tác này." });
  }
};

/**
 * @route   GET /api/products
 * @desc    Lấy danh sách sản phẩm (có hỗ trợ lọc theo loại kính type hoặc danh mục/bộ sưu tập category)
 */
router.get("/", async (req, res) => {
  try {
    const { category, type, search } = req.query;
    let query = {};

    // Tìm kiếm theo từ khóa keyword (Chỉ tìm theo Tên sản phẩm để chính xác tuyệt đối)
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // type: 'Sunglasses' hoặc 'Glasses'
    if (type) {
      query.collection = type;
    }

    // category: Bộ sưu tập cụ thể (ví dụ: 'Veggie Collection', 'BOLD Collection'...)
    if (category && category !== "View all") {
      if (query.$or) {
        // Nếu đã có $or từ phần search, kết hợp bằng $and
        query = {
          $and: [
            { $or: query.$or },
            {
              $or: [
                { collection: category },
                { collections: category }
              ]
            }
          ]
        };
      } else {
        query.$or = [
          { collection: category },
          { collections: category }
        ];
      }
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: `Lỗi server: ${error.message}` });
  }
});

/**
 * @route   GET /api/products/:sku
 * @desc    Lấy thông tin chi tiết một sản phẩm theo mã SKU
 */
router.get("/:sku", async (req, res) => {
  try {
    const product = await Product.findOne({ sku: req.params.sku });
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
    }

    // Lấy tên cơ sở để tìm các biến thể màu (ví dụ: "Vert 02(CM)" -> "Vert")
    const baseName = product.name.split(" ")[0];

    // Tìm các sản phẩm cùng dòng (Color swatches)
    const colorways = await Product.find({
      name: { $regex: new RegExp("^" + baseName, "i") }
    }).select("sku name thumbnail collection");

    // Lấy các sản phẩm gợi ý tương tự (Similar frames) trong cùng phân loại, loại trừ chính nó
    const similarFrames = await Product.find({
      collection: product.collection,
      sku: { $ne: product.sku }
    }).limit(6);

    const productObj = product.toObject();
    productObj.colorways = colorways || [];
    productObj.similarFrames = similarFrames || [];

    res.json(productObj);
  } catch (error) {
    res.status(500).json({ message: `Lỗi server: ${error.message}` });
  }
});

/**
 * @route   POST /api/products
 * @desc    Thêm sản phẩm kính mới (Chỉ dành cho Admin)
 */
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { 
      name, price, sku, collection, collections, thumbnail, gallery, slug, url,
      description, features, frameFront, frameSide, lensWidth, lensHeight, bridge,
      colorLabel
    } = req.body;

    const productExists = await Product.findOne({ sku });
    if (productExists) {
      return res.status(400).json({ message: "Mã SKU này đã tồn tại trên hệ thống." });
    }

    const product = await Product.create({
      name,
      price,
      sku,
      collection,
      collections: collections || [collection],
      thumbnail,
      gallery: gallery || [],
      slug: slug || "",
      url: url || "",
      description: description || "",
      features: features || [],
      frameFront: frameFront || "145mm",
      frameSide: frameSide || "150mm",
      lensWidth: lensWidth || "48mm",
      lensHeight: lensHeight || "42mm",
      bridge: bridge || "20mm",
      colorLabel: colorLabel || ""
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: `Lỗi thêm sản phẩm: ${error.message}` });
  }
});

/**
 * @route   PUT /api/products/:sku
 * @desc    Cập nhật thông tin chi tiết hoặc giá kính (Chỉ dành cho Admin)
 */
router.put("/:sku", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findOne({ sku: req.params.sku });
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
    }

    product.name = req.body.name || product.name;
    product.price = req.body.price !== undefined ? req.body.price : product.price;
    product.collection = req.body.collection || product.collection;
    product.collections = req.body.collections || product.collections;
    product.thumbnail = req.body.thumbnail || product.thumbnail;
    product.gallery = req.body.gallery || product.gallery;
    product.slug = req.body.slug || product.slug;
    product.url = req.body.url || product.url;
    product.description = req.body.description !== undefined ? req.body.description : product.description;
    product.features = req.body.features || product.features;
    product.frameFront = req.body.frameFront || product.frameFront;
    product.frameSide = req.body.frameSide || product.frameSide;
    product.lensWidth = req.body.lensWidth || product.lensWidth;
    product.lensHeight = req.body.lensHeight || product.lensHeight;
    product.bridge = req.body.bridge || product.bridge;
    product.colorLabel = req.body.colorLabel !== undefined ? req.body.colorLabel : product.colorLabel;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: `Lỗi cập nhật sản phẩm: ${error.message}` });
  }
});

/**
 * @route   DELETE /api/products/:sku
 * @desc    Xóa sản phẩm khỏi Database (Chỉ dành cho Admin)
 */
router.delete("/:sku", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findOne({ sku: req.params.sku });
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
    }

    await Product.findByIdAndDelete(product._id);
    res.json({ message: "Đã xóa sản phẩm khỏi Database thành công." });
  } catch (error) {
    res.status(500).json({ message: `Lỗi xóa sản phẩm: ${error.message}` });
  }
});

export default router;
