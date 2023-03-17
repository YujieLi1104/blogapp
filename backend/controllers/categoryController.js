/** @format */

import expressAsyncHandler from 'express-async-handler';
import validateMongoId from '../utils/validateMongodbID.js';
import Category from '../models/categoryModel.js';

//-------------------------------------
// Create category
//-------------------------------------
const createCategory = expressAsyncHandler(async (req, res) => {
  try {
    const category = await Category.create({
      user: req.user._id,
      title: req.body.title,
    });
    res.json(category);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
// Fetch all categories
//-------------------------------------
const fetchAllCategories = expressAsyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({})
      .populate('user')
      .sort('-createdAt');
    res.json(categories);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
// Fetch single category
//-------------------------------------
const fetchSingleCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id)
      .populate('user')
      .sort('-createdAt');
    res.json(category);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
// Update category
//-------------------------------------
const updateCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const updateCategory = await Category.findByIdAndUpdate(
      id,
      {
        title: req?.body?.title,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(updateCategory);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
// Delete category
//-------------------------------------
const deleteCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const deleteCategory = await Category.findByIdAndDelete(id);
    res.json(deleteCategory);
  } catch (error) {
    res.json(error);
  }
});

export { createCategory, fetchAllCategories, fetchSingleCategory, updateCategory, deleteCategory };
