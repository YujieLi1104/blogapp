/** @format */

import expressAsyncHandler from 'express-async-handler';
import validateMongoId from '../utils/validateMongodbID.js';
import Comment from '../models/commentModel.js';

//-------------------------------------
// Create comment
//-------------------------------------
const createComment = expressAsyncHandler(async (req, res) => {
  // Step 1: Get user
  const user = req.user;
  // Step 2: Get the post id
  const { postId, description } = req.body;
  try {
    const comment = await Comment.create({
      post: postId,
      user: user,
      description: description,
    });
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
// Fetch all comments
//-------------------------------------
const fetchAllComments = expressAsyncHandler(async (req, res) => {
  try {
    const comments = await Comment.find({}).sort('-created');
    res.json(comments);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
// Fetch a single comment
//-------------------------------------
const fetchSingleComment = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const comment = await Comment.findById(id);
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
// Update a comment
//-------------------------------------
const updateComment = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const updateComment = await Comment.findByIdAndUpdate(
      id,
      {
        user: req?.user,
        description: req?.body?.description,
      },
      { new: true, runValidators: true }
    );
    res.json(updateComment);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
// Delete a comment
//-------------------------------------
const deleteComment = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const deletedComment = await Comment.findByIdAndDelete(id);
    res.json(deletedComment);
  } catch (error) {
    res.json(error);
  }
});

export {
  createComment,
  fetchAllComments,
  fetchSingleComment,
  updateComment,
  deleteComment,
};
