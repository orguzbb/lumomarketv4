import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 80,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, select: false },
    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
      index: true,
    },
    provider: { type: String, enum: ["local", "google"], default: "local" },
    firebaseUid: { type: String, unique: true, sparse: true },
    avatar: { type: String, default: "" },
    refreshTokenHash: { type: String, select: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
userSchema.index({ email: 1, role: 1 });
export default mongoose.model("User", userSchema);
