import Wishlist from '../models/Wishlist.js';
export const getWishlist = async (req, res, next) => { try { let w = await Wishlist.findOne({ user: req.user._id }).populate('products'); if (!w) w = { products: [] }; res.json(w); } catch (e) { next(e); } };
export const addToWishlist = async (req, res, next) => {
  try {
    let w = await Wishlist.findOne({ user: req.user._id });
    if (!w) w = new Wishlist({ user: req.user._id, products: [] });
    if (!w.products.includes(req.params.productId)) w.products.push(req.params.productId);
    await w.save();
    await w.populate('products');
    res.json(w);
  } catch (e) { next(e); }
};
export const removeFromWishlist = async (req, res, next) => {
  try {
    const w = await Wishlist.findOne({ user: req.user._id });
    if (!w) return res.status(404).json({ message: 'Wishlist not found' });
    w.products = w.products.filter(p => p.toString() !== req.params.productId);
    await w.save();
    res.json(w);
  } catch (e) { next(e); }
};