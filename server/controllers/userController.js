import User from '../models/User.js';
import Blog from '../models/Blog.js';
import AppError from '../utils/AppError.js';

// @desc    Get user profile by ID
// @route   GET /api/users/:id
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'name avatar')
      .populate('following', 'name avatar');

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const blogCount = await Blog.countDocuments({ author: user._id, status: 'published' });
    const blogs = await Blog.find({ author: user._id, status: 'published' })
      .sort('-createdAt')
      .limit(10)
      .populate('author', 'name avatar')
      .populate('category', 'name slug');

    const totalLikes = await Blog.aggregate([
      { $match: { author: user._id } },
      { $project: { likesCount: { $size: '$likes' } } },
      { $group: { _id: null, total: { $sum: '$likesCount' } } },
    ]);

    const likedBlogsCount = await Blog.countDocuments({ likes: user._id });

    res.json({
      success: true,
      user,
      blogCount,
      blogs,
      totalLikes: totalLikes[0]?.total || 0,
      likedBlogsCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar, socialLinks } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, avatar, socialLinks },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Follow a user
// @route   POST /api/users/follow/:id
export const followUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return next(new AppError('You cannot follow yourself', 400));
    }

    const userToFollow = await User.findById(req.params.id);
    if (!userToFollow) {
      return next(new AppError('User not found', 404));
    }

    if (userToFollow.followers.includes(req.user._id)) {
      return next(new AppError('Already following this user', 400));
    }

    await User.findByIdAndUpdate(req.params.id, {
      $addToSet: { followers: req.user._id },
    });
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { following: req.params.id },
    });

    res.json({ success: true, message: 'Followed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Unfollow a user
// @route   DELETE /api/users/unfollow/:id
export const unfollowUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      $pull: { followers: req.user._id },
    });
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { following: req.params.id },
    });

    res.json({ success: true, message: 'Unfollowed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/users
export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      success: true,
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    await User.findByIdAndDelete(req.params.id);
    // Also clean up their blogs
    await Blog.deleteMany({ author: req.params.id });

    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (Admin)
// @route   PUT /api/users/:id/role
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['reader', 'author', 'admin'].includes(role)) {
      return next(new AppError('Invalid role', 400));
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) return next(new AppError('User not found', 404));

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
