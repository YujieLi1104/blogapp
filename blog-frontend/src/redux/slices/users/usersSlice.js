/** @format */

import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../utils/baseURL';

// Redirect action
const resetUserProfile = createAction('user/profile/reset');
const resetPassword = createAction('password/reset');

//----------------------------------------------------------------
// Register
//----------------------------------------------------------------
export const registerUser = createAsyncThunk(
  'user/register',
  async (user, { rejectWithValue, getState, dispatch }) => {
    try {
      // http call
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post(
        `${baseUrl}/api/users/register`,
        user,
        config
      );
      return data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

//----------------------------------------------------------------
// Login
//----------------------------------------------------------------
export const loginUser = createAsyncThunk(
  'user/login',
  async (userData, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const { data } = await axios.post(
        `${baseUrl}/api/users/login`,
        userData,
        config
      );
      // save user into local storage
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// fetch all users
export const fetchAllUsers = createAsyncThunk(
  'user/list',
  async (id, { rejectWithValue, getState, dispatch }) => {
    // get user token
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: 'Bearer ' + userAuth?.token,
      },
    };
    try {
      const { data } = await axios.get(`${baseUrl}/api/users`, config);
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Profile
export const fetchProfile = createAsyncThunk(
  'user/profile',
  async (id, { rejectWithValue, getState, dispatch }) => {
    // get user token
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: 'Bearer ' + userAuth?.token,
      },
    };
    try {
      const { data } = await axios.get(
        `${baseUrl}/api/users/profile/${id}`,
        config
      );
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Update profile
export const updateProfile = createAsyncThunk(
  'user/update',
  async (userData, { rejectWithValue, getState, dispatch }) => {
    // get user token
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: 'Bearer ' + userAuth?.token,
      },
    };
    try {
      const { data } = await axios.put(
        `${baseUrl}/api/users/profile`,
        {
          firstName: userData?.firstName,
          lastName: userData?.lastName,
          bio: userData?.bio,
          email: userData?.email,
        },
        config
      );
      // dispatch
      dispatch(resetUserProfile());
      return data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Follow
export const followUser = createAsyncThunk(
  'user/follow',
  async (userToFollowId, { rejectWithValue, getState, dispatch }) => {
    // get user token
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: 'Bearer ' + userAuth?.token,
      },
    };
    try {
      const { data } = await axios.put(
        `${baseUrl}/api/users/follow`,
        { followedId: userToFollowId },
        config
      );
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Unfollow
export const unfollowUser = createAsyncThunk(
  'user/unfollow',
  async (unfollowId, { rejectWithValue, getState, dispatch }) => {
    // get user token
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: 'Bearer ' + userAuth?.token,
      },
    };
    try {
      const { data } = await axios.put(
        `${baseUrl}/api/users/unfollow`,
        { unfollowId },
        config
      );
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Block User
export const blockUser = createAsyncThunk(
  'user/block',
  async (id, { rejectWithValue, getState, dispatch }) => {
    // get user token
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: 'Bearer ' + userAuth?.token,
      },
    };
    try {
      const { data } = await axios.put(
        `${baseUrl}/api/users/block-user/${id}`,
        {},
        config
      );
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Unblock User
export const unblockUser = createAsyncThunk(
  'user/unblock',
  async (id, { rejectWithValue, getState, dispatch }) => {
    // get user token
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: 'Bearer ' + userAuth?.token,
      },
    };
    try {
      const { data } = await axios.put(
        `${baseUrl}/api/users/unblock-user/${id}`,
        {},
        config
      );
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Update password
export const updatePassword = createAsyncThunk(
  'password/update',
  async (password, { rejectWithValue, getState, dispatch }) => {
    // get user token
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: 'Bearer ' + userAuth?.token,
      },
    };
    try {
      const { data } = await axios.put(
        `${baseUrl}/api/users/password`,
        {
          password,
        },
        config
      );
      // dispatch
      dispatch(resetPassword());
      return data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Password reset token generator
export const passwordResetToken = createAsyncThunk(
  'password/token',
  async (email, { rejectWithValue, getState, dispatch }) => {
    try {
      // http call
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post(
        `${baseUrl}/api/users/forget-password`,
        { email },
        config
      );
      return data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Reset password
export const passwordResetAction = createAsyncThunk(
  'password/reset-password',
  async (user, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    // http call
    try {
      const { data } = await axios.put(
        `${baseUrl}/api/users/reset-password`,
        { password: user?.password, token: user?.token },
        config
      );
      return data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Logout the user (remove the data of local storage)
export const logoutUser = createAsyncThunk(
  'user/logout',
  async (payload, rejectWithValue, getState, dispatch) => {
    try {
      localStorage.removeItem('userInfo');
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// upload profile picture
export const uploadProfilePic = createAsyncThunk(
  'user/profile-picture',
  async (UserImage, { rejectWithValue, getState, dispatch }) => {
    // get user token
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: 'Bearer ' + userAuth?.token,
      },
    };
    try {
      // http call
      const formData = new FormData();
      formData.append('image', UserImage?.image);

      const { data } = await axios.put(
        `${baseUrl}/api/users/profile-pic`,
        formData,
        config
      );
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// get user from local storage and place into store
const userLoginFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    userAuth: userLoginFromStorage,
  },
  extraReducers(builder) {
    // register
    builder.addCase(registerUser.pending, (state, action) => {
      state.status = 'loading';
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.registered = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.status = 'failed';
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // login
    builder.addCase(loginUser.pending, (state, action) => {
      state.status = 'loading';
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.userAuth = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.status = 'failed';
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // fetch all users
    builder.addCase(fetchAllUsers.pending, (state, action) => {
      state.status = 'loading';
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.usersList = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(fetchAllUsers.rejected, (state, action) => {
      state.status = 'failed';
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // profile
    builder.addCase(fetchProfile.pending, (state, action) => {
      state.profileStatus = 'loading';
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.profileStatus = 'succeeded';
      state.profile = action?.payload;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(fetchProfile.rejected, (state, action) => {
      state.profileStatus = 'failed';
      state.profileAppErr = action?.payload?.message;
      state.profileServerErr = action?.error?.message;
    });
    // Update profile
    builder.addCase(updateProfile.pending, (state, action) => {
      state.status = 'loading';
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(resetUserProfile, (state, action) => {
      state.isUpdated = true;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.userUpdated = action?.payload;
      state.isUpdated = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.status = 'failed';
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // follow user
    builder.addCase(followUser.pending, (state, action) => {
      state.status = 'loading';
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(followUser.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.followed = action?.payload;
      state.unfollowed = undefined;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(followUser.rejected, (state, action) => {
      state.status = 'failed';
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
      state.unfollowed = undefined;
    });
    // unfollow user
    builder.addCase(unfollowUser.pending, (state, action) => {
      state.unfollowStatus = 'loading';
      state.unfollowAppErr = undefined;
      state.unfollowServerErr = undefined;
    });
    builder.addCase(unfollowUser.fulfilled, (state, action) => {
      state.unfollowStatus = 'succeeded';
      state.unfollowed = action?.payload;
      state.followed = undefined;
      state.unfollowAppErr = undefined;
      state.unfollowServerErr = undefined;
    });
    builder.addCase(unfollowUser.rejected, (state, action) => {
      state.unfollowStatus = 'failed';
      state.unfollowAppErr = action?.payload?.message;
      state.unfollowServerErr = action?.error?.message;
    });
    // block user
    builder.addCase(blockUser.pending, (state, action) => {
      state.status = 'loading';
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(blockUser.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.block = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(blockUser.rejected, (state, action) => {
      state.status = 'failed';
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // unblock user
    builder.addCase(unblockUser.pending, (state, action) => {
      state.status = 'loading';
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(unblockUser.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.unblock = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(unblockUser.rejected, (state, action) => {
      state.status = 'failed';
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // Update password
    builder.addCase(updatePassword.pending, (state, action) => {
      state.status = 'loading';
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(resetPassword, (state, action) => {
      state.isPasswordUpdated = true;
    });
    builder.addCase(updatePassword.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.passwordUpdated = action?.payload;
      state.isPasswordUpdated = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(updatePassword.rejected, (state, action) => {
      state.status = 'failed';
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // generate password reset token
    builder.addCase(passwordResetToken.pending, (state, action) => {
      state.status = 'loading';
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(passwordResetToken.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.resetPasswordToken = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(passwordResetToken.rejected, (state, action) => {
      state.status = 'failed';
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // password reset
    builder.addCase(passwordResetAction.pending, (state, action) => {
      state.status = 'loading';
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(passwordResetAction.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.newPassword = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(passwordResetAction.rejected, (state, action) => {
      state.status = 'failed';
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // logout
    builder.addCase(logoutUser.pending, (state, action) => {
      state.status = 'loading';
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(logoutUser.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.userAuth = undefined;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.status = 'failed';
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // upload profile picture
    builder.addCase(uploadProfilePic.pending, (state, action) => {
      state.status = 'loading';
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(uploadProfilePic.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.profilePic = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(uploadProfilePic.rejected, (state, action) => {
      state.status = 'failed';
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
  },
});

export default usersSlice.reducer;
