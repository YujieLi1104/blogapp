/** @format */

import expressAsyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../../models/userModel.js';

const authMiddleware = expressAsyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        // find user by id
        const user = await User.findById(decoded?.id).select('-password');
        // attach user to request object
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error('Not authorized token expired, login again');
    }
  } else {
    throw new Error('No token attached to the header');
  }
});

export default authMiddleware;
