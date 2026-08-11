import Category from "../models/Category.js";
export const getCategories = async (req, res, next) => {
  try {
    const cats = await Category.find().populate("parent");
    res.json(cats);
  } catch (e) {
    next(e);
  }
};
export const createCategory = async (req, res, next) => {
  try {
    const c = await Category.create(req.body);
    res.status(201).json(c);
  } catch (e) {
    next(e);
  }
};
export const updateCategory = async (req, res, next) => {
  try {
    const c = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    c ? res.json(c) : res.status(404).json({ message: "Not found" });
  } catch (e) {
    next(e);
  }
};
export const deleteCategory = async (req, res, next) => {
  try {
    const c = await Category.findByIdAndDelete(req.params.id);
    c
      ? res.json({ message: "Deleted" })
      : res.status(404).json({ message: "Not found" });
  } catch (e) {
    next(e);
  }
};
