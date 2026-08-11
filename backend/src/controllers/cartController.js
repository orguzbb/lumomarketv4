import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const getQuery = (req) => {
  if (req.user?._id) return { user: req.user._id };
  const sessionId = req.headers['x-guest-session-id'];
  if (sessionId) return { sessionId };
  return null;
};

export const getCart = async (req, res, next) => {
  try {
    const query = getQuery(req);
    if (!query) return res.json({ items: [], subtotal: 0 });
    let cart = await Cart.findOne(query).populate("items.product");
    if (!cart) cart = { items: [], subtotal: 0 };
    res.json(cart);
  } catch (e) {
    next(e);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    
    const query = getQuery(req);
    if (!query) return res.status(400).json({ message: "Missing user or session ID" });

    let cart = await Cart.findOne(query);
    if (!cart) cart = new Cart({ ...query, items: [] });
    
    const existing = cart.items.find((i) => i.product.toString() === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        name: product.name,
        image: product.images?.[0]?.url || product.image || '',
      });
    }
    
    cart.subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    await cart.save();
    const populated = await Cart.findById(cart._id).populate("items.product");
    res.json(populated);
  } catch (e) {
    next(e);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const query = getQuery(req);
    if (!query) return res.status(400).json({ message: "Missing user or session ID" });

    const cart = await Cart.findOne(query);
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    
    const item = cart.items.find(
      (i) => i.product.toString() === req.params.productId,
    );
    if (!item) return res.status(404).json({ message: "Item not found" });
    
    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    } else {
      item.quantity = quantity;
    }
    
    cart.subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    await cart.save();
    const populated = await Cart.findById(cart._id).populate("items.product");
    res.json(populated);
  } catch (e) {
    next(e);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const query = getQuery(req);
    if (!query) return res.status(400).json({ message: "Missing user or session ID" });

    const cart = await Cart.findOne(query);
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    
    cart.items = cart.items.filter(
      (i) => i.product.toString() !== req.params.productId,
    );
    cart.subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    await cart.save();
    const populated = await Cart.findById(cart._id).populate("items.product");
    res.json(populated);
  } catch (e) {
    next(e);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const query = getQuery(req);
    if (query) await Cart.findOneAndDelete(query);
    res.json({ message: "Cart cleared" });
  } catch (e) {
    next(e);
  }
};

export const syncCart = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const guestSessionId = req.headers['x-guest-session-id'];
    if (!guestSessionId) return res.json({ message: "No guest cart to sync" });

    const guestCart = await Cart.findOne({ sessionId: guestSessionId });
    if (!guestCart || guestCart.items.length === 0) {
      return res.json({ message: "Guest cart empty" });
    }

    let userCart = await Cart.findOne({ user: req.user._id });
    if (!userCart) {
      userCart = new Cart({ user: req.user._id, items: [] });
    }

    for (const item of guestCart.items) {
      const existing = userCart.items.find(i => i.product.toString() === item.product.toString());
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        userCart.items.push(item);
      }
    }

    userCart.subtotal = userCart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    await userCart.save();
    await Cart.findOneAndDelete({ sessionId: guestSessionId });

    const populated = await Cart.findById(userCart._id).populate("items.product");
    res.json(populated);
  } catch (e) {
    next(e);
  }
};
