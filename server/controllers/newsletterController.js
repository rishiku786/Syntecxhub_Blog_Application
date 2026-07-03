import Newsletter from '../models/Newsletter.js';
import AppError from '../utils/AppError.js';

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter
export const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next(new AppError('Email is required', 400));

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.json({ success: true, message: 'Already subscribed!' });
    }

    await Newsletter.create({ email });
    res.status(201).json({ success: true, message: 'Subscribed successfully!' });
  } catch (error) {
    next(error);
  }
};
