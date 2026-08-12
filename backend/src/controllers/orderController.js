import * as orderService from "../services/orderService.js";
import Order from "../models/Order.js";
export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user?._id || null;
    const guestSessionId = req.headers['x-guest-session-id'] || null;
    const { shippingAddress, paymentMethod, items } = req.body;

    const o = await orderService.createOrder(
      userId,
      shippingAddress,
      paymentMethod,
      items,
      guestSessionId
    );
    res.status(201).json(o);
  } catch (e) {
    next(e);
  }
};
export const getOrders = async (req, res, next) => {
  try {
    res.json(await orderService.getOrders(req.user._id));
  } catch (e) {
    next(e);
  }
};
export const getOrder = async (req, res, next) => {
  try {
    const o = await orderService.getOrder(req.params.id, req.user._id);
    o ? res.json(o) : res.status(404).json({ message: "Not found" });
  } catch (e) {
    next(e);
  }
};
export const updateStatus = async (req, res, next) => {
  try {
    const o = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: req.body.status },
      { new: true },
    );
    o ? res.json(o) : res.status(404).json({ message: "Not found" });
  } catch (e) {
    next(e);
  }
};
