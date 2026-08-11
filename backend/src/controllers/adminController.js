import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Store from '../models/Store.js';
import Category from '../models/Category.js';

export const getOverview = async (req, res, next) => {
  try {
    const users = await User.countDocuments();
    const sellers = await User.countDocuments({ role: 'seller' });
    const products = await Product.countDocuments();
    const orders = await Order.countDocuments();
    res.json({ users, sellers, products, orders });
  } catch (e) { next(e); }
};

export const getUsers = async (req, res, next) => { try { res.json(await User.find().select('-password')); } catch (e) { next(e); } };
export const updateUserRole = async (req, res, next) => { try { const u = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password'); u ? res.json(u) : res.status(404).json({ message: 'Not found' }); } catch (e) { next(e); } };
export const getSellers = async (req, res, next) => { try { res.json(await Store.find().populate('seller', 'fullname email')); } catch (e) { next(e); } };
export const approveSeller = async (req, res, next) => { try { const s = await Store.findOneAndUpdate({ seller: req.params.id }, { isApproved: req.body.approved }, { new: true }); if (req.body.approved) await User.findByIdAndUpdate(req.params.id, { role: 'seller' }); s ? res.json(s) : res.status(404).json({ message: 'Not found' }); } catch (e) { next(e); } };

export const getProducts = async (req, res, next) => { try { res.json(await Product.find().populate('seller category')); } catch (e) { next(e); } };
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, oldPrice, category, stock, images, image } = req.body;
    let categoryId = category;
    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      const cat = await Category.findOne({ slug: category });
      categoryId = cat ? cat._id : null;
    }
    const p = new Product({
      name,
      description,
      price,
      oldPrice,
      category: categoryId,
      stock: stock || 10,
      images: images || (image ? [{ url: image }] : []),
      seller: req.user._id,
      status: 'active'
    });
    await p.save();
    res.status(201).json(p);
  } catch (e) { next(e); }
};
export const updateProduct = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (updateData.category && !mongoose.Types.ObjectId.isValid(updateData.category)) {
      const cat = await Category.findOne({ slug: updateData.category });
      updateData.category = cat ? cat._id : null;
    }
    const p = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    p ? res.json(p) : res.status(404).json({ message: 'Not found' });
  } catch (e) { next(e); }
};
export const deleteProduct = async (req, res, next) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    p ? res.json({ message: 'Product deleted' }) : res.status(404).json({ message: 'Not found' });
  } catch (e) { next(e); }
};
export const updateProductStatus = async (req, res, next) => { try { const p = await Product.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }); p ? res.json(p) : res.status(404).json({ message: 'Not found' }); } catch (e) { next(e); } };
export const getOrders = async (req, res, next) => { try { res.json(await Order.find().populate('user items.product')); } catch (e) { next(e); } };
export const getReports = async (req, res, next) => {
  try {
    const revenue = await Order.aggregate([{ $group: { _id: { $month: '$createdAt' }, total: { $sum: '$total' } } }]);
    res.json(revenue);
  } catch (e) { next(e); }
};