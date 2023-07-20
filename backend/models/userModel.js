/** @format */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

//create schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      required: [true, 'First name is required'],
      type: String,
    },
    lastName: {
      required: [true, 'Last name is required'],
      type: String,
    },
    profilePic: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    bio: {
      type: String,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    postCount: {
      type: Number,
      default: 0,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['Admin', 'Guest', 'Blogger'],
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    accountVerificationToken: String,
    accountVerificationTokenExpires: Date,
    viewedBy: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    followers: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    following: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: false,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

// Virtual method to populate created posts
userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
});

// Account Type
userSchema.virtual('accountTypes').get(function () {
  const totalFollowers = this.followers?.length;
  return totalFollowers >= 1 ? 'Pro Account' : 'Starter Account';
});

// Hash user password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  // hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// match user entered password to hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate verifying account token
userSchema.methods.generateVerificationToken = async function () {
  // Generate token
  const token = crypto.randomBytes(32).toString('hex');
  // Hash token
  this.accountVerificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Set expiration date
  this.accountVerificationTokenExpires = Date.now() + 30 * 60 * 1000; // 10 minutes from now

  return token;
};

// Password reset token
userSchema.methods.generatePasswordResetToken = async function () {
  // Generate token
  const token = crypto.randomBytes(32).toString('hex');
  // Hash token
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Set expiration date
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 minutes from now

  return token;
};

// Compile model from schema
const User = mongoose.model('User', userSchema);

export default User;
