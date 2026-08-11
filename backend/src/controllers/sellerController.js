import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Store from '../models/Store.js';
export const getOverview = async (req, res, next) => {
  try {
    const products = await Product.countDocuments({ seller: req.user._id });
    const orders = await Order.countDocuments({ 'items.seller': req.user._id });
    const revenue = await Order.aggregate([{ $match: { 'items.seller': req.user._id } }, { $unwind: '$items' }, { $match: { 'items.seller': req.user._id } }, { $group: { _id: null, total: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } }]);
    res.json({ products, orders, revenue: revenue[0]?.total || 0 });
  } catch (e) { next(e); }
};
export const getProducts = async (req, res, next) => { try { res.json(await Product.find({ seller: req.user._id })); } catch (e) { next(e); } };
export const createProduct = async (req, res, next) => { try { const p = await Product.create({ ...req.body, seller: req.user._id }); res.status(201).json(p); } catch (e) { next(e); } };
export const updateProduct = async (req, res, next) => { try { const p = await Product.findOneAndUpdate({ _id: req.params.id, seller: req.user._id }, req.body, { new: true }); p ? res.json(p) : res.status(404).json({ message: 'Not found' }); } catch (e) { next(e); } };
export const deleteProduct = async (req, res, next) => { try { const p = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user._id }); p ? res.json({ message: 'Deleted' }) : res.status(404).json({ message: 'Not found' }); } catch (e) { next(e); } };
export const getOrders = async (req, res, next) => { try { res.json(await Order.find({ 'items.seller': req.user._id })); } catch (e) { next(e); } };
export const updateOrderStatus = async (req, res, next) => { try { const o = await Order.findOneAndUpdate({ _id: req.params.id, 'items.seller': req.user._id }, { orderStatus: req.body.status }, { new: true }); o ? res.json(o) : res.status(404).json({ message: 'Not found' }); } catch (e) { next(e); } };
export const getAnalytics = async (req, res, next) => {
  try {
    const sales = await Order.aggregate([{ $match: { 'items.seller': req.user._id } }, { $unwind: '$items' }, { $match: { 'items.seller': req.user._id } }, { $group: { _id: { $month: '$createdAt' }, total: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } }]);
    res.json(sales);
  } catch (e) { next(e); }
};
export const getStore = async (req, res, next) => { try { const s = await Store.findOne({ seller: req.user._id }); s ? res.json(s) : res.status(404).json({ message: 'Store not found' }); } catch (e) { next(e); } };
export const createStore = async (req, res, next) => { try { const s = await Store.create({ ...req.body, seller: req.user._id }); res.status(201).json(s); } catch (e) { next(e); } };
export const updateStore = async (req, res, next) => { try { const s = await Store.findOneAndUpdate({ seller: req.user._id }, req.body, { new: true }); s ? res.json(s) : res.status(404).json({ message: 'Not found' }); } catch (e) { next(e); } };