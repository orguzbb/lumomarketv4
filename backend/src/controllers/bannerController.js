import Banner from "../models/Banner.js";

// Public: Get active banners
export const getActiveBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(banners);
  } catch (e) {
    next(e);
  }
};

// Admin: Get all banners
export const getAllBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    res.json(banners);
  } catch (e) {
    next(e);
  }
};

// Admin: Create banner
export const createBanner = async (req, res, next) => {
  try {
    const banner = new Banner(req.body);
    await banner.save();
    res.status(201).json(banner);
  } catch (e) {
    next(e);
  }
};

// Admin: Update banner
export const updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.json(banner);
  } catch (e) {
    next(e);
  }
};

// Admin: Delete banner
export const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.json({ message: "Banner deleted" });
  } catch (e) {
    next(e);
  }
};
