import * as orderService from "../services/orderService.js";
import Order from "../models/Order.js";
export const createOrder = async (req, res, next) => {
  try {
    const o = await orderService.createOrder(
      req.user._id,
      req.body.shippingAddress,
      req.body.paymentMethod,
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
