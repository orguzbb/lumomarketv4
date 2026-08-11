import Review from "../models/Review.js";
import Product from "../models/Product.js";
export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      isApproved: true,
    }).populate("user", "fullname avatar");
    res.json(reviews);
  } catch (e) {
    next(e);
  }
};
export const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    const review = await Review.create({
      user: req.user._id,
      product: req.params.productId,
      seller: product.seller,
      rating,
      comment,
    });
    const reviews = await Review.find({ product: req.params.productId });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(req.params.productId, {
      rating: avgRating,
      reviewsCount: reviews.length,
    });
    res.status(201).json(review);
  } catch (e) {
    next(e);
  }
};
