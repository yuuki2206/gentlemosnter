import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    items: [
      {
        sku: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        thumbnail: { type: String, required: true },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    ethTotal: {
      type: Number,
      default: 0,
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
      enum: ["Web2", "Web3"],
      default: "Web3",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
