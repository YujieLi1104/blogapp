/** @format */

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/users/usersSlice';
import categoryReducer from './slices/category/categorySlice';
import post from './slices/posts/postSlice';
import comment from './slices/comments/commentSlice';

const store = configureStore({
  reducer: {
    users: userReducer,
    category: categoryReducer,
    post,
    comment,
  },
});

export default store;
