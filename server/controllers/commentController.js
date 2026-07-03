import Comment from '../models/Comment.js';
import Blog from '../models/Blog.js';
import AppError from '../utils/AppError.js';

// @desc    Add comment to blog
// @route   POST /api/comments/:blogId
export const addComment = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return next(new AppError('Blog not found', 404));

    const comment = await Comment.create({
      content: req.body.content,
      author: req.user._id,
      blog: req.params.blogId,
      parentComment: req.body.parentComment || null,
    });

    await comment.populate('author', 'name avatar');

    res.status(201).json({ success: true, comment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments for a blog
// @route   GET /api/comments/:blogId
export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({
      blog: req.params.blogId,
      parentComment: null,
    })
      .populate('author', 'name avatar')
      .sort('-createdAt');

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parentComment: comment._id })
          .populate('author', 'name avatar')
          .sort('createdAt');
        return { ...comment.toObject(), replies };
      })
    );

    res.json({ success: true, comments: commentsWithReplies });
  } catch (error) {
    next(error);
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
export const updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return next(new AppError('Comment not found', 404));

    if (comment.author.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized', 403));
    }

    comment.content = req.body.content;
    await comment.save();
    await comment.populate('author', 'name avatar');

    res.json({ success: true, comment });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return next(new AppError('Comment not found', 404));

    if (
      comment.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return next(new AppError('Not authorized', 403));
    }

    // Delete replies too
    await Comment.deleteMany({ parentComment: comment._id });
    await Comment.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle like on comment
// @route   POST /api/comments/:id/like
export const toggleCommentLike = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return next(new AppError('Comment not found', 404));

    const index = comment.likes.findIndex(id => id.toString() === req.user._id.toString());
    if (index === -1) {
      comment.likes.push(req.user._id);
    } else {
      comment.likes.splice(index, 1);
    }
    await comment.save();

    res.json({
      success: true,
      liked: index === -1,
      likesCount: comment.likes.length,
    });
  } catch (error) {
    next(error);
  }
};
