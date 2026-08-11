import express from 'express';
import * as adminController from '../controllers/adminController.js';
import * as bannerController from '../controllers/bannerController.js';
import * as settingsController from '../controllers/settingsController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();
router.use(protect, authorize('admin'));

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

router.get('/overview', adminController.getOverview);

// User & Seller management
router.get('/users', adminController.getUsers);
router.patch('/users/:id/role', adminController.updateUserRole);
router.get('/sellers', adminController.getSellers);
router.patch('/sellers/:id/approve', adminController.approveSeller);

// Product CRUD
router.get('/products', adminController.getProducts);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);
router.patch('/products/:id/status', adminController.updateProductStatus);

// Banner CRUD
router.get('/banners', bannerController.getAllBanners);
router.post('/banners', bannerController.createBanner);
router.put('/banners/:id', bannerController.updateBanner);
router.delete('/banners/:id', bannerController.deleteBanner);

// Settings
router.put('/settings', settingsController.updateSettings);

router.get('/orders', adminController.getOrders);
router.get('/reports', adminController.getReports);

export default router;