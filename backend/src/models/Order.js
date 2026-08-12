import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    shippingAddress: {
      fullname: String,
      phone: String,
      city: String,
      address: String,
      street: String,
      comment: String,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "card", "cash", "uzcard", "click", "payme"],
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipping",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    subtotal: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    trackingNumber: { type: String, default: "" },
    invoiceNumber: { type: String, unique: true },
  },
  { timestamps: true },
);
orderSchema.pre("save", function (next) {
  if (!this.invoiceNumber)
    this.invoiceNumber =
      "INV-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
  next();
});
export default mongoose.model("Order", orderSchema);
