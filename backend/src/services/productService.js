import Product from "../models/Product.js";
export const getProducts = async (query) => {
  const {
    category,
    seller,
    search,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 12,
  } = query;
  const filter = { status: "active" };
  if (category) filter.category = category;
  if (seller) filter.seller = seller;
  if (minPrice || maxPrice) filter.price = {};
  if (minPrice) filter.price.$gte = Number(minPrice);
  if (maxPrice) filter.price.$lte = Number(maxPrice);
  if (search) filter.$text = { $search: search };
  const sortOptions = {
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { rating: -1 },
  };
  const skip = (Number(page) - 1) * Number(limit);
  const products = await Product.find(filter)
    .populate("category seller", "name")
    .sort(sortOptions[sort] || { createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));
  const total = await Product.countDocuments(filter);
  return { products, total, pages: Math.ceil(total / Number(limit)) };
};
export const getProduct = async (id) =>
  Product.findById(id).populate("category seller reviews");
export const createProduct = async (data, sellerId) =>
  Product.create({ ...data, seller: sellerId });
export const updateProduct = async (id, data, sellerId) =>
  Product.findOneAndUpdate({ _id: id, seller: sellerId }, data, { new: true });
export const deleteProduct = async (id, sellerId) =>
  Product.findOneAndDelete({ _id: id, seller: sellerId });
