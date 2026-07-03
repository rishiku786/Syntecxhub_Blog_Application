import Bookmark from '../models/Bookmark.js';
import AppError from '../utils/AppError.js';

// @desc    Toggle bookmark
// @route   POST /api/bookmarks/:blogId
export const toggleBookmark = async (req, res, next) => {
  try {
    const existing = await Bookmark.findOne({
      user: req.user._id,
      blog: req.params.blogId,
    });

    if (existing) {
      await Bookmark.findByIdAndDelete(existing._id);
      return res.json({ success: true, bookmarked: false });
    }

    await Bookmark.create({
      user: req.user._id,
      blog: req.params.blogId,
    });

    res.status(201).json({ success: true, bookmarked: true });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's bookmarks
// @route   GET /api/bookmarks
export const getMyBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate({
        path: 'blog',
        populate: [
          { path: 'author', select: 'name avatar' },
          { path: 'category', select: 'name slug color' },
        ],
      })
      .sort('-createdAt');

    res.json({
      success: true,
      bookmarks: bookmarks.filter((b) => b.blog), // Filter out deleted blogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if blog is bookmarked
// @route   GET /api/bookmarks/check/:blogId
export const checkBookmark = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findOne({
      user: req.user._id,
      blog: req.params.blogId,
    });

    res.json({ success: true, bookmarked: !!bookmark });
  } catch (error) {
    next(error);
  }
};
