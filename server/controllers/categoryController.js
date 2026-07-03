import Category from '../models/Category.js';
import AppError from '../utils/AppError.js';

// @desc    Get all categories
// @route   GET /api/categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort('name');
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category (Admin)
// @route   POST /api/categories
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, icon, color } = req.body;
    const category = await Category.create({ name, description, icon, color });
    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category (Admin)
// @route   PUT /api/categories/:id
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) return next(new AppError('Category not found', 404));

    res.json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category (Admin)
// @route   DELETE /api/categories/:id
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return next(new AppError('Category not found', 404));

    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};
