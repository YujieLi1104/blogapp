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
    const post = await Post.findById(id).populate('user');
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

export { createPost, fetchAllPosts, fetchSinglePost, updatePost, deletePost };
