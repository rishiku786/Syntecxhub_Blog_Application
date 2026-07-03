import express from 'express';
import {
  toggleBookmark,
  getMyBookmarks,
  checkBookmark,
} from '../controllers/bookmarkController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getMyBookmarks);
router.post('/:blogId', protect, toggleBookmark);
router.get('/check/:blogId', protect, checkBookmark);

export default router;
