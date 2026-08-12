import express from 'express';
import * as orderController from '../controllers/orderController.js';
import { protect, optionalProtect, authorize } from '../middleware/auth.js';
const router = express.Router();

router.post('/', optionalProtect, orderController.createOrder);
router.get('/', protect, orderController.getOrders);
router.get('/:id', protect, orderController.getOrder);
router.patch('/:id/status', protect, authorize('seller', 'admin'), orderController.updateStatus);

export default router;