/** @format */

import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import dbConnect from './config/db/dbConnect.js';
import userRoute from './routes/userRoute.js';
import postsRoute from './routes/postRoute.js';
import commentRoute from './routes/commentRoute.js';
import emailRoute from './routes/emailRoute.js';
import {
  errorHandler,
  notFoundHandler,
} from './middlewares/error/errorHandler.js';

dotenv.config();
dbConnect();

const app = express();

// Middleware
app.use(express.json());

// User Route
app.use('/api/users', userRoute);

// Post Route
app.use('/api/posts', postsRoute);

// Comment Route
app.use('/api/comments', commentRoute);

// Email Route
app.use('/api/emails', emailRoute);

// Error Handler
app.use(notFoundHandler);
app.use(errorHandler);

//server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
