import * as productService from '../services/productService.js';
import Product from '../models/Product.js';
export const getProducts = async (req, res, next) => { try { const data = await productService.getProducts(req.query); res.json(data); } catch (e) { next(e); } };
export const getProduct = async (req, res, next) => { try { const p = await productService.getProduct(req.params.id); p ? res.json(p) : res.status(404).json({ message: 'Not found' }); } catch (e) { next(e); } };
export const createProduct = async (req, res, next) => { try { const p = await productService.createProduct(req.body, req.user._id); res.status(201).json(p); } catch (e) { next(e); } };
export const updateProduct = async (req, res, next) => { try { const p = await productService.updateProduct(req.params.id, req.body, req.user._id); p ? res.json(p) : res.status(404).json({ message: 'Not found' }); } catch (e) { next(e); } };
export const deleteProduct = async (req, res, next) => { try { const p = await productService.deleteProduct(req.params.id, req.user._id); p ? res.json({ message: 'Deleted' }) : res.status(404).json({ message: 'Not found' }); } catch (e) { next(e); } };
export const uploadImages = async (req, res, next) => {
  try {
    if (!req.files) return res.status(400).json({ message: 'No files' });
    const images = req.files.map(f => ({ url: `/uploads/${f.filename}`, alt: f.originalname }));
    await Product.findByIdAndUpdate(req.params.id, { $push: { images: { $each: images } } });
    res.json({ images });
  } catch (e) { next(e); }
};