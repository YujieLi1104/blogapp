/** @format */

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/users/usersSlice';
import categoryReducer from './slices/category/categorySlice';
import post from './slices/posts/postSlice';
import comment from './slices/comments/commentSlice';
import email from './slices/email/emailSlice';
import accVerifyReducer from './slices/accountVerification/accVerifySlice';

const store = configureStore({
  reducer: {
    users: userReducer,
    category: categoryReducer,
    post,
    comment,
    email,
    accountVerification: accVerifyReducer
  },
});

export default store;
