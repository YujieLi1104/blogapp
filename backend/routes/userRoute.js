/** @format */

import express from 'express';
import {
  registerUser,
  loginUser,
  fetchAllUsers,
  deleteUser,
  fetchSingleUser,
  fetchUserProfile,
  updateUserProfile,
  updateUserPassword,
  followingUser,
  unfollowUser,
  blockUser,
  unblockUser,
  generateVerificationToken,
  verifyUser,
  generateForgetPasswordToken,
  resetUserPassword,
  uploadProfilePic,
} from '../controllers/userController.js';
import authMiddleware from '../middlewares/auth/authMiddleware.js';
import { profilePhotoUpload, resizeImage } from '../middlewares/upload/profilePhotoUpload.js';

const userRoute = express.Router();

userRoute.post('/register', registerUser);
userRoute.post('/login', loginUser);
userRoute.put(
  '/profile-pic',
  authMiddleware,
  profilePhotoUpload.single('image'),
  resizeImage,
  uploadProfilePic
);
userRoute.get('/', authMiddleware, fetchAllUsers);
userRoute.put('/password', authMiddleware, updateUserPassword);
userRoute.post('/forget-password', generateForgetPasswordToken);
userRoute.post('/reset-password', resetUserPassword);
userRoute.put('/follow', authMiddleware, followingUser);
userRoute.put('/unfollow', authMiddleware, unfollowUser);
userRoute.post(
  '/generate-verify-email-token',
  authMiddleware,
  generateVerificationToken
);
userRoute.post('/verify-user', authMiddleware, verifyUser);
userRoute.put('/block-user/:id', authMiddleware, blockUser);
userRoute.put('/unblock-user/:id', authMiddleware, unblockUser);
userRoute.get('/profile/:id', authMiddleware, fetchUserProfile);
userRoute.put('/profile', authMiddleware, updateUserProfile);
userRoute.delete('/:id', deleteUser);
userRoute.get('/:id', fetchSingleUser);

export default userRoute;
