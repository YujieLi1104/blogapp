/** @format */

import express from 'express';

import {
  createCategory,
  fetchAllCategories,
  fetchSingleCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import authMiddleware from '../middlewares/auth/authMiddleware.js';

const categoryRoute = express.Router();

categoryRoute.post('/', authMiddleware, createCategory);
categoryRoute.get('/', fetchAllCategories);
categoryRoute.get('/:id', fetchSingleCategory);
categoryRoute.put('/:id', authMiddleware, updateCategory);
categoryRoute.delete('/:id', authMiddleware, deleteCategory);

export default categoryRoute;
