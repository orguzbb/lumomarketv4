import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
export const createOrder = async (userId, shippingAddress, paymentMethod) => {
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart || cart.items.length === 0) throw new Error('Cart empty');
  let subtotal = 0;
  const items = cart.items.map(item => {
    subtotal += item.price * item.quantity;
    return { product: item.product._id, seller: item.product.seller, name: item.product.name, price: item.price, quantity: item.quantity, image: item.product.images[0]?.url || '' };
  });
  const order = await Order.create({ user: userId, items, shippingAddress, paymentMethod, subtotal, total: subtotal + 20000 });
  await Cart.findOneAndDelete({ user: userId });
  return order;
};
export const getOrders = async (userId) => Order.find({ user: userId }).sort({ createdAt: -1 });
export const getOrder = async (id, userId) => Order.findOne({ _id: id, user: userId });