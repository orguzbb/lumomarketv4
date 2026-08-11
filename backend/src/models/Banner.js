import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    highlight: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    tag: { type: String, default: "" },
    image: { type: String, required: true },
    bgGradient: { type: String, default: "from-[#FBF3E8] via-[#F9EBD8] to-[#F5DEC0]" },
    textColor: { type: String, default: "text-[#1E293B]" },
    tagBg: { type: String, default: "bg-white text-slate-800" },
    buttonBg: { type: String, default: "bg-[#7000FF] hover:bg-[#5B00D6] text-white" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Banner", bannerSchema);