/** @format */

import expressAsyncHandler from 'express-async-handler';
import Filter from 'bad-words';
import fs from 'fs';
import Post from '../models/postModel.js';
import User from '../models/userModel.js';
import validateMongoId from '../utils/validateMongodbID.js';
import cloudinaryUploadImage from '../utils/cloudinary.js';

//-------------------------------------
// Create a new post
//-------------------------------------
const createPost = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  // validateMongoId(req.body.user);
  // Check for bad words
  const filter = new Filter();
  const isProfane = filter.isProfane(req.body.title, req.body.description);
  // Block user
  if (isProfane) {
    const user = await User.findByIdAndUpdate(_id, {
      isBlocked: true,
    });
    throw new Error(
      'Creating failed because it contains profane words and you have been blocked'
    );
  }

  // Get the oath to image
  const localPath = `public/images/posts/${req.file.filename}`;
  // Upload the image to cloudinary
  const imgUploaded = await cloudinaryUploadImage(localPath);

  try {
    // const post = await Post.create({
    //   ...req.body,
    //   image: imgUploaded?.url,
    //   user: _id,
    // });

    // Remove uploaded image
    fs.unlinkSync(localPath);
    res.json(localPath);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
// Fetch all posts
//-------------------------------------
const fetchAllPosts = expressAsyncHandler(async (req, res) => {
  try {
    const posts = await Post.find({}).populate('user');
    res.json(posts);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
// Fetch a single post
//-------------------------------------
const fetchSinglePost = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const post = await Post.findById(id).populate('user').populate('dislikes').populate('likes');
    // Update number of views
    await Post.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
// Update a post
//-------------------------------------
const updatePost = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const post = await Post.findByIdAndUpdate(
      id,
      {
        ...req.body,
        user: req?.user?._id,
      },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
// Delete a post
//-------------------------------------
const deletePost = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const post = await Post.findByIdAndDelete(id);
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
// Like a post
//-------------------------------------
const likePost = expressAsyncHandler(async (req, res) => {
  // Step 1: Find the post to be liked
  const { postId } = req.body;
  validateMongoId(postId);
  const post = await Post.findById(postId);
  // Step 2: Find the user who liked the post
  const loginUserId = req?.user?._id;
  validateMongoId(loginUserId);
  // Step 3: Check is this user already disliked the post
  const isDisliked = post?.dislikes.includes(loginUserId);
  // Step 4: Remove the user from dislikes array if exists
  if (isDisliked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { dislikes: loginUserId },
      },
      { new: true }
    );
  }
  //  Toggle
  // Remove the user from likes array if exists
  const isLiked = post?.likes.includes(loginUserId);
  if (isLiked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: loginUserId } },
      { new: true }
    );
    return res.json(post);
  } else {
    // Add the user to likes array
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { likes: loginUserId },
      },
      { new: true }
    );
    return res.json(post);
  }
});

//-------------------------------------
// Dislike a post
//-------------------------------------
const dislikePost = expressAsyncHandler(async (req, res) => {
  // Step 1: Find the post to be disliked
  const { postId } = req.body;
  validateMongoId(postId);
  const post = await Post.findById(postId);
  // Step 2: Find the user who disliked the post
  const loginUserId = req?.user?._id;
  validateMongoId(loginUserId);
  // Step 3: Check is this user already liked the post
  const isLiked = post?.likes.includes(loginUserId);
  // Step 4: Remove the user from likes array if exists
  if (isLiked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
      },
      { new: true }
    );
  }
  //  Toggle
  // Remove the user from dislikes array if exists
  const isDisliked = post?.dislikes.includes(loginUserId);
  if (isDisliked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { dislikes: loginUserId },
      },
      { new: true }
    );
    return res.json(post);
  } else {
    // Add the user to dislikes array
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { dislikes: loginUserId },
      },
      { new: true }
    );
    return res.json(post);
  }
});

export {
  createPost,
  fetchAllPosts,
  fetchSinglePost,
  updatePost,
  deletePost,
  likePost,
  dislikePost,
};
