import express from 'express';
import {
  createBlog,
  getBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  toggleLike,
  getTrendingBlogs,
  getFeaturedBlogs,
  getMyBlogs,
  getBlogStats,
  getAdminStats,
} from '../controllers/blogController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

const router = express.Router();

// Public/optional auth routes (must come before /:slug)
router.get('/trending', getTrendingBlogs);
router.get('/featured', getFeaturedBlogs);

// Protected routes
router.get('/my-blogs', protect, authorize('author', 'admin'), getMyBlogs);
router.get('/stats', protect, authorize('author', 'admin'), getBlogStats);
router.get('/admin-stats', protect, authorize('admin'), getAdminStats);

router.post('/', protect, authorize('author', 'admin'), createBlog);
router.get('/', optionalAuth, getBlogs);
router.get('/:slug', optionalAuth, getBlogBySlug);
router.put('/:id', protect, authorize('author', 'admin'), updateBlog);
router.delete('/:id', protect, authorize('author', 'admin'), deleteBlog);
router.post('/:id/like', protect, toggleLike);

export default router;
