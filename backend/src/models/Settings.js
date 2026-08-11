import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    phone: { type: String, default: "+998 88 900 80 81" },
    telegram: { type: String, default: "https://t.me/lumomarket" },
    instagram: { type: String, default: "https://instagram.com/lumomarket" },
    facebook: { type: String, default: "https://facebook.com/lumomarket" },
    youtube: { type: String, default: "https://youtube.com/lumomarket" },
    email: { type: String, default: "support@lumomarket.uz" },
    address: { type: String, default: "Toshkent sh., Yunusobod t., Amir Temur shoh ko'chasi 10" }
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);