/** @format */

import express from 'express';
import {
  createComment,
  fetchAllComments,
  fetchSingleComment,
  updateComment,
  deleteComment
} from '../controllers/commentController.js';
import authMiddleware from '../middlewares/auth/authMiddleware.js';

const commentRoute = express.Router();

commentRoute.post('/', authMiddleware, createComment);
commentRoute.get('/', authMiddleware, fetchAllComments);
commentRoute.get('/:id', authMiddleware, fetchSingleComment);
commentRoute.put('/:id', authMiddleware, updateComment);
commentRoute.delete('/:id', authMiddleware, deleteComment);

export default commentRoute;
