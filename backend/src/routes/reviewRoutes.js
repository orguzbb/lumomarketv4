import express from "express";
import * as reviewController from "../controllers/reviewController.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();
router.get("/products/:productId", reviewController.getReviews);
router.post("/products/:productId", protect, reviewController.createReview);
export default router;
