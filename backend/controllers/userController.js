/** @format */

import User from '../models/userModel.js';
import expressAsyncHandler from 'express-async-handler';
import fs from 'fs';
import generateToken from '../config/token/generateToken.js';
import validateMongoId from '../utils/validateMongodbID.js';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import crypto from 'crypto';
import cloudinaryUploadImage from '../utils/cloudinary.js';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//-------------------------------------
// Register user
//-------------------------------------
const registerUser = expressAsyncHandler(async (req, res) => {
  // Check if user already exists
  const userExists = await User.findOne({ email: req?.body?.email });
  if (userExists) throw new Error('User already exists');

  try {
    // Register new user
    const user = await User.create({
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      password: req?.body?.password,
    });
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
// Login user
//-------------------------------------
const loginUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Check if user exists
  const userFound = await User.findOne({ email });

  // check if password is matched
  if (userFound && (await userFound.matchPassword(password))) {
    res.json({
      _id: userFound._id,
      firstName: userFound?.firstName,
      lastName: userFound?.lastName,
      email: userFound?.email,
      profilePic: userFound?.profilePic,
      isAdmin: userFound?.isAdmin,
      token: generateToken(userFound?._id),
      isVerified: userFound?.isAccountVerified,
    });
  } else {
    res.status(401);
    throw new Error('Invalid login credentials');
  }
});

//-------------------------------------
// Fetch all users
//-------------------------------------
const fetchAllUsers = expressAsyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
// Delete user
//-------------------------------------
const deleteUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if user id is valid
  validateMongoId(id);

  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json(deleteUser);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
// Fetch single user
//-------------------------------------
const fetchSingleUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if user id is valid
  validateMongoId(id);

  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
// Fetch User profile
//-------------------------------------
const fetchUserProfile = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const profile = await User.findById(id).populate('posts');
    res.json(profile);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
// Update User profile
//-------------------------------------
const updateUserProfile = expressAsyncHandler(async (req, res) => {
  const { _id } = req?.user;

  validateMongoId(_id);

  const profile = await User.findByIdAndUpdate(
    _id,
    {
      $set: {
        firstName: req.body?.firstName,
        lastName: req.body?.lastName,
        email: req.body?.email,
        bio: req.body?.bio,
      },
    },
    { runValidators: true, new: true }
  );
  res.json(profile);
});

//-------------------------------------
// Update user password
//-------------------------------------
const updateUserPassword = expressAsyncHandler(async (req, res) => {
  const { _id } = req?.user;
  const { password } = req.body;

  validateMongoId(_id);
  // Find user by id
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedUser = await user.save();
    res.json(updatedUser);
  }
  return;
});

//-------------------------------------
// Following
//-------------------------------------
const followingUser = expressAsyncHandler(async (req, res) => {
  const { followedId } = req.body;
  const loginUserId = req.user.id;

  // Find the target user and check if they are followed by the current user
  const targetUser = await User.findById(followedId);
  const isFollowing = targetUser.followers.includes(loginUserId);

  if (isFollowing) {
    throw new Error('You are already following this user');
  }

  if (loginUserId === targetUser.id) {
    throw new Error('You cannot follow yourself');
  }

  // Step 1: Find the user you want to follow and update it's followers array
  await User.findByIdAndUpdate(
    followedId,
    {
      $push: {
        followers: loginUserId,
      },
    },
    { new: true }
  );

  // Step 2: Update the login user following array
  await User.findByIdAndUpdate(
    loginUserId,
    {
      $push: {
        following: followedId,
      },
    },
    { new: true }
  );

  res.json('You have successfully followed this user');
});

//-------------------------------------
// Unfollow
//-------------------------------------
const unfollowUser = expressAsyncHandler(async (req, res) => {
  const { unfollowId } = req.body;
  const loginUserId = req.user.id;

  // Find the target user and check if they are followed by the current user
  const targetUser = await User.findById(unfollowId);
  const isFollowing = targetUser.followers.includes(loginUserId);

  if (!isFollowing) {
    throw new Error('You are not following this user');
  }

  if (loginUserId === targetUser.id) {
    throw new Error('You cannot unfollow yourself');
  }

  // Step 1: Find the user you want to unfollow and update it's followers array
  await User.findByIdAndUpdate(
    unfollowId,
    {
      $pull: {
        followers: loginUserId,
      },
    },
    { new: true }
  );

  // Step 2: Update the login user following array
  await User.findByIdAndUpdate(
    loginUserId,
    {
      $pull: {
        following: unfollowId,
      },
    },
    { new: true }
  );

  res.json('You have successfully unfollowed this user');
});

//-------------------------------------
// Block user
//-------------------------------------
const blockUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);

  const user = await User.findByIdAndUpdate(
    id,
    { isBlocked: true },
    { new: true }
  );
  res.json(user);
});

//-------------------------------------
// Unblock user
//-------------------------------------
const unblockUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);

  const user = await User.findByIdAndUpdate(
    id,
    { isBlocked: false },
    { new: true }
  );
  res.json(user);
});

//-------------------------------------
// Generate email verification token
//-------------------------------------
const generateVerificationToken = expressAsyncHandler(async (req, res) => {
  const loginUserId = req.user.id;

  const user = await User.findById(loginUserId);

  try {
    // Generate a token
    const verificationToken = await user.generateVerificationToken();
    // save the user
    await user.save();
    // Build message
    const verifyURL = `If you were requested to verify your account, verify now within 10 minutes, 
    otherwise ignore this message <a href="http://localhost:3000/verify-account/${verificationToken}">link</a>`;
    const msg = {
      to: user?.email,
      from: 'yujie.li1994@gmail.com',
      subject: 'Verify your account',
      html: verifyURL,
    };
    await sgMail.send(msg);
    res.json(verifyURL);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
// Verify user account
//-------------------------------------
const verifyUser = expressAsyncHandler(async (req, res) => {
  const { token } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find user by token
  const userFound = await User.findOne({
    accountVerificationToken: hashedToken,
    accountVerificationTokenExpires: { $gt: new Date() },
  });

  if (!userFound) {
    throw new Error('Token is invalid or has expired');
  }

  // Update the property to true
  userFound.isAccountVerified = true;
  userFound.accountVerificationToken = undefined;
  userFound.accountVerificationTokenExpires = undefined;
  await userFound.save();

  res.json(userFound);
});

//-------------------------------------
// Generate forget password token
//-------------------------------------
const generateForgetPasswordToken = expressAsyncHandler(async (req, res) => {
  // Find the user by email
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  try {
    // Generate a token
    const token = await user.generatePasswordResetToken();
    console.log(token);
    // save the user
    await user.save();
    // Build message
    const resetURL = `If you were requested to reset your password, reset now within 10 minutes, 
    otherwise ignore this message <a href="http://localhost:3000/reset-password/${token}">link</a>`;
    const msg = {
      to: email,
      from: 'yujie.li1994@gmail.com',
      subject: 'Reset your password',
      html: resetURL,
    };
    await sgMail.send(msg);
    res.json({
      msg: `A reset link has been sent to ${user?.email}. Reset now within 10 minutes, ${resetURL}`,
    });
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
// Reset password
//-------------------------------------
const resetUserPassword = expressAsyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find user by token
  const userFound = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!userFound) {
    throw new Error('Token is invalid or has expired');
  }

  // Update the property to true
  userFound.password = password;
  userFound.passwordResetToken = undefined;
  userFound.passwordResetExpires = undefined;
  await userFound.save();

  res.json(userFound);
});

//-------------------------------------
// Profile picture upload
//-------------------------------------
const uploadProfilePic = expressAsyncHandler(async (req, res) => {
  // Find the login user
  const { _id } = req?.user;

  // Get the oath to image
  const localPath = `public/images/profile/${req.file.filename}`;
  // Upload the image to cloudinary
  const imgUploaded = await cloudinaryUploadImage(localPath);

  const foundUser = await User.findByIdAndUpdate(
    _id,
    {
      profilePic: imgUploaded.url,
    },
    { new: true }
  );
  // Remove uploaded image
  fs.unlinkSync(localPath);

  res.json(imgUploaded);
});

export {
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
};
