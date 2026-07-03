import express from 'express';
import {
  getUserProfile,
  updateProfile,
  followUser,
  unfollowUser,
  getAllUsers,
  deleteUser,
  updateUserRole,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

const router = express.Router();

router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', getUserProfile);
router.put('/profile', protect, updateProfile);
router.post('/follow/:id', protect, followUser);
router.delete('/unfollow/:id', protect, unfollowUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.put('/:id/role', protect, authorize('admin'), updateUserRole);

export default router;
