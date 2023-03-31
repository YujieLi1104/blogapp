/** @format */

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/users/usersSlice';

const store = configureStore({
  reducer: {
    users: userReducer,
  },
});

export default store;
