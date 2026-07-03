import express from 'express';
import {
  addComment,
  getComments,
  updateComment,
  deleteComment,
  toggleCommentLike,
} from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/:blogId', getComments);
router.post('/:blogId', protect, addComment);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);
router.post('/:id/like', protect, toggleCommentLike);

export default router;
