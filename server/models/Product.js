import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    collections: {
      type: [String],
      default: [],
    },
    collection: {
      type: String,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    gallery: {
      type: [String],
      default: [],
    },
    slug: {
      type: String,
    },
    url: {
      type: String,
    },
    description: {
      type: String,
      default: "",
    },
    features: {
      type: [String],
      default: [],
    },
    frameFront: {
      type: String,
      default: "145mm",
    },
    frameSide: {
      type: String,
      default: "150mm",
    },
    lensWidth: {
      type: String,
      default: "48mm",
    },
    lensHeight: {
      type: String,
      default: "42mm",
    },
    bridge: {
      type: String,
      default: "20mm",
    },
    colorLabel: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
