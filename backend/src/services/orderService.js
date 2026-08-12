import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
export const createOrder = async (userId, shippingAddress, paymentMethod, directItems = null, guestSessionId = null) => {
  let cartItems = [];
  let cartIdToDelete = null;

  if (directItems && Array.isArray(directItems) && directItems.length > 0) {
    cartItems = directItems;
  } else {
    let cart = null;
    if (userId) {
      cart = await Cart.findOne({ user: userId }).populate('items.product');
    }
    if (!cart && guestSessionId) {
      cart = await Cart.findOne({ sessionId: guestSessionId }).populate('items.product');
    }
    if (!cart && userId) {
      // Fallback: check guest cart if user logged in recently
      cart = await Cart.findOne({ user: userId });
    }
    if (cart && cart.items && cart.items.length > 0) {
      cartItems = cart.items;
      cartIdToDelete = cart._id;
    }
  }

  if (!cartItems || cartItems.length === 0) {
    throw new Error('Savat bo\'sh, buyurtma yaratib bo\'lmadi');
  }

  let subtotal = 0;
  const items = cartItems.map(item => {
    const prodObj = item.product && typeof item.product === 'object' ? item.product : {};
    const prodId = prodObj._id || item.product;
    const itemPrice = Number(item.price || prodObj.price || 0);
    const quantity = Number(item.quantity || 1);
    const itemName = item.name || prodObj.name || 'Mahsulot';
    const itemImage = item.image || (prodObj.images && prodObj.images[0]?.url) || prodObj.image || '';
    const sellerId = prodObj.seller || item.seller || null;

    subtotal += itemPrice * quantity;

    return {
      product: prodId,
      seller: sellerId,
      name: itemName,
      price: itemPrice,
      quantity,
      image: itemImage,
    };
  });

  const normalizedAddress = {
    fullname: shippingAddress?.fullname || '',
    phone: shippingAddress?.phone || '',
    city: shippingAddress?.city || 'Toshkent',
    address: shippingAddress?.address || shippingAddress?.street || '',
    street: shippingAddress?.street || shippingAddress?.address || '',
    comment: shippingAddress?.comment || ''
  };

  const shippingFee = subtotal >= 100000 || subtotal === 0 ? 0 : 15000;
  const total = subtotal + shippingFee;

  const orderData = {
    items,
    shippingAddress: normalizedAddress,
    paymentMethod: paymentMethod || 'cash',
    subtotal,
    shippingFee,
    total,
  };

  if (userId) {
    orderData.user = userId;
  }

  const order = await Order.create(orderData);

  if (cartIdToDelete) {
    await Cart.findByIdAndDelete(cartIdToDelete);
  }

  return order;
};

export const getOrders = async (userId) => Order.find({ user: userId }).sort({ createdAt: -1 }).populate('items.product');
export const getOrder = async (id, userId) => Order.findOne({ _id: id, user: userId }).populate('items.product');