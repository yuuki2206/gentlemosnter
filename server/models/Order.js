import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    userEmail: {
      type: String,
      required: true,
      default: "customer@gentlemonster.com",
    },
    items: [
      {
        sku: { type: String, default: "N/A" },
        name: { type: String, default: "Product" },
        price: { type: Number, default: 0 },
        quantity: { type: Number, default: 1 },
        thumbnail: { type: String, default: "" },
      },
    ],
    total: {
      type: Number,
      default: 0,
    },
    ethTotal: {
      type: mongoose.Schema.Types.Mixed,
      default: "0",
    },
    txHash: {
      type: String,
      default: "",
    },
    sender: {
      type: String,
      default: "",
    },
    receiver: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "Completed",
    },
    type: {
      type: String,
      default: "Web3",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
