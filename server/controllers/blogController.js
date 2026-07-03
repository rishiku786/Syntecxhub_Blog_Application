import Blog from '../models/Blog.js';
import AppError from '../utils/AppError.js';
import { calculateReadingTime } from '../utils/calculateReadingTime.js';

// @desc    Create blog
// @route   POST /api/blogs
export const createBlog = async (req, res, next) => {
  try {
    const { title, subtitle, content, coverImage, tags, category, status, scheduledAt } = req.body;

    const blog = await Blog.create({
      title,
      subtitle,
      content,
      coverImage,
      tags: tags || [],
      category,
      author: req.user._id,
      status: status || 'draft',
      scheduledAt,
      readingTime: calculateReadingTime(content),
    });

    await blog.populate('author', 'name avatar');
    await blog.populate('category', 'name slug');

    res.status(201).json({ success: true, blog });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all blogs (with filters, search, pagination)
// @route   GET /api/blogs
export const getBlogs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      author,
      tag,
      search,
      sort = '-createdAt',
      status,
    } = req.query;

    const query = { status: 'published' };

    // Admin can see all statuses
    if (status && req.user?.role === 'admin') {
      query.status = status;
    }

    if (category) query.category = category;
    if (author) query.author = author;
    if (tag) query.tags = { $in: [tag] };
    if (search) {
      query.$text = { $search: search };
    }

    let sortOption = {};
    switch (sort) {
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'mostLiked':
        sortOption = { likes: -1 };
        break;
      case 'mostViewed':
        sortOption = { views: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const blogs = await Blog.find(query)
      .populate('author', 'name avatar')
      .populate('category', 'name slug color icon')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      blogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
export const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate('author', 'name avatar bio followers socialLinks')
      .populate('category', 'name slug color icon');

    if (!blog) {
      return next(new AppError('Blog not found', 404));
    }

    // Increment views
    blog.views += 1;
    await blog.save({ validateBeforeSave: false });

    // Get related blogs (same category, excluding current)
    const relatedBlogs = await Blog.find({
      category: blog.category?._id,
      _id: { $ne: blog._id },
      status: 'published',
    })
      .populate('author', 'name avatar')
      .limit(3)
      .sort('-createdAt');

    res.json({ success: true, blog, relatedBlogs });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
export const updateBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return next(new AppError('Blog not found', 404));
    }

    // Check ownership (unless admin)
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to update this blog', 403));
    }

    const { title, subtitle, content, coverImage, tags, category, status, scheduledAt } = req.body;

    blog.title = title ?? blog.title;
    blog.subtitle = subtitle ?? blog.subtitle;
    blog.content = content ?? blog.content;
    blog.coverImage = coverImage ?? blog.coverImage;
    blog.tags = tags ?? blog.tags;
    blog.category = category ?? blog.category;
    blog.status = status ?? blog.status;
    blog.scheduledAt = scheduledAt ?? blog.scheduledAt;
    blog.readingTime = calculateReadingTime(blog.content);

    await blog.save();

    await blog.populate('author', 'name avatar');
    await blog.populate('category', 'name slug');

    res.json({ success: true, blog });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return next(new AppError('Blog not found', 404));
    }

    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to delete this blog', 403));
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Blog deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle like on blog
// @route   POST /api/blogs/:id/like
export const toggleLike = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return next(new AppError('Blog not found', 404));
    }

    const index = blog.likes.findIndex(id => id.toString() === req.user._id.toString());
    if (index === -1) {
      blog.likes.push(req.user._id);
    } else {
      blog.likes.splice(index, 1);
    }

    await blog.save({ validateBeforeSave: false });

    res.json({
      success: true,
      liked: index === -1,
      likesCount: blog.likes.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trending blogs
// @route   GET /api/blogs/trending
export const getTrendingBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.aggregate([
      { $match: { status: 'published' } },
      {
        $addFields: {
          score: {
            $add: [
              { $multiply: [{ $size: '$likes' }, 3] },
              '$views',
            ],
          },
        },
      },
      { $sort: { score: -1 } },
      { $limit: 6 },
    ]);

    await Blog.populate(blogs, [
      { path: 'author', select: 'name avatar' },
      { path: 'category', select: 'name slug color icon' },
    ]);

    res.json({ success: true, blogs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured blogs
// @route   GET /api/blogs/featured
export const getFeaturedBlogs = async (req, res, next) => {
  try {
    let blogs = await Blog.find({ featured: true, status: 'published' })
      .populate('author', 'name avatar')
      .populate('category', 'name slug color icon')
      .sort('-createdAt')
      .limit(5);

    // Fallback to most liked if no featured set
    if (blogs.length === 0) {
      blogs = await Blog.find({ status: 'published' })
        .populate('author', 'name avatar')
        .populate('category', 'name slug color icon')
        .sort({ likes: -1 })
        .limit(5);
    }

    res.json({ success: true, blogs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's own blogs (for dashboard)
// @route   GET /api/blogs/my-blogs
export const getMyBlogs = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { author: req.user._id };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const blogs = await Blog.find(query)
      .populate('category', 'name slug')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      blogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/blogs/stats
export const getBlogStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [totalBlogs, publishedBlogs, draftBlogs] = await Promise.all([
      Blog.countDocuments({ author: userId }),
      Blog.countDocuments({ author: userId, status: 'published' }),
      Blog.countDocuments({ author: userId, status: 'draft' }),
    ]);

    const likesAgg = await Blog.aggregate([
      { $match: { author: userId } },
      { $project: { likesCount: { $size: '$likes' } } },
      { $group: { _id: null, total: { $sum: '$likesCount' } } },
    ]);

    const viewsAgg = await Blog.aggregate([
      { $match: { author: userId } },
      { $group: { _id: null, total: { $sum: '$views' } } },
    ]);

    // Monthly stats for charts (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyPosts = await Blog.aggregate([
      {
        $match: {
          author: userId,
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      stats: {
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        totalLikes: likesAgg[0]?.total || 0,
        totalViews: viewsAgg[0]?.total || 0,
        followers: req.user.followers?.length || 0,
        monthlyPosts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin analytics
// @route   GET /api/blogs/admin-stats
export const getAdminStats = async (req, res, next) => {
  try {
    const [totalUsers, totalBlogs, totalPublished] = await Promise.all([
      (await import('../models/User.js')).default.countDocuments(),
      Blog.countDocuments(),
      Blog.countDocuments({ status: 'published' }),
    ]);

    const popularBlogs = await Blog.find({ status: 'published' })
      .sort({ views: -1 })
      .limit(5)
      .populate('author', 'name avatar');

    const recentUsers = await (await import('../models/User.js')).default
      .find()
      .sort('-createdAt')
      .limit(5)
      .select('name email avatar role createdAt');

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalBlogs,
        totalPublished,
        popularBlogs,
        recentUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};
