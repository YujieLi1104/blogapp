/** @format */

import express from 'express';
import {
  createPost,
  fetchAllPosts,
  fetchSinglePost,
  updatePost,
  deletePost,
  likePost,
  dislikePost
} from '../controllers/postController.js';
import authMiddleware from '../middlewares/auth/authMiddleware.js';
import {
  photoUpload,
  resizePostImage,
} from '../middlewares/upload/photoUpload.js';

const postsRoute = express.Router();

postsRoute.put('/likes',authMiddleware, likePost);
postsRoute.put('/dislikes',authMiddleware, dislikePost);
postsRoute.post(
  '/',
  authMiddleware,
  photoUpload.single('image'),
  resizePostImage,
  createPost
);
postsRoute.get('/', fetchAllPosts);
postsRoute.get('/:id', fetchSinglePost);
postsRoute.put('/:id', authMiddleware, updatePost);
postsRoute.delete('/:id', authMiddleware, deletePost);

export default postsRoute;
