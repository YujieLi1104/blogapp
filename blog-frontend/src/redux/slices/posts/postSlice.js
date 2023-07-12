/** @format */

import { createAsyncThunk, createSlice, createAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../utils/baseURL';

// Action to redirect
const resetPost = createAction('post/post-reset');
const resetPostEdit = createAction('post/reset');
const resetPostDelete = createAction('post/delete');

// Create post
export const createPost = createAsyncThunk(
  'post/created',
  async (post, { rejectWithValue, getState, dispatch }) => {
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
      formData.append('title', post?.title);
      formData.append('description', post?.description);
      formData.append('category', post?.category);
      formData.append('image', post?.image);

      const { data } = await axios.post(
        `${baseUrl}/api/posts`,
        formData,
        config
      );
      //dispatch action
      dispatch(resetPost());
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Update post
export const updatePost = createAsyncThunk(
  'post/updated',
  async (post, { rejectWithValue, getState, dispatch }) => {
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
      const { data } = await axios.put(
        `${baseUrl}/api/posts/${post?.id}`,
        post,
        config
      );
      //dispatch action
      dispatch(resetPostEdit());
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Delete post
export const deletePost = createAsyncThunk(
  'post/deleted',
  async (postId, { rejectWithValue, getState, dispatch }) => {
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
      const { data } = await axios.delete(
        `${baseUrl}/api/posts/${postId}`,
        config
      );
      //dispatch
      dispatch(resetPostDelete());
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Fetch all posts
export const fetchAllPosts = createAsyncThunk(
  'post/list',
  async (category, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(
        `${baseUrl}/api/posts?category=${category}`
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

// Fetch single post details
export const fetchPostDetails = createAsyncThunk(
  'post/details',
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/posts/${id}`);
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Add likes to post
export const toggleAddLikesToPost = createAsyncThunk(
  'post/like',
  async (postId, { rejectWithValue, getState, dispatch }) => {
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
        `${baseUrl}/api/posts/likes`,
        { postId },
        config
      );
      return data;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Add dislikes to post
export const toggleAddDislikesToPost = createAsyncThunk(
  'post/dislike',
  async (postId, { rejectWithValue, getState, dispatch }) => {
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
        `${baseUrl}/api/posts/dislikes`,
        { postId },
        config
      );
      return data;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// slice
const postSlice = createSlice({
  name: 'post',
  initialState: {},
  extraReducers(builder) {
    // create post
    builder.addCase(createPost.pending, (state, action) => {
      state.status = 'loading';
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(resetPost, (state, action) => {
      state.isCreated = true;
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.postCreated = action?.payload;
      state.isCreated = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(createPost.rejected, (state, action) => {
      state.status = 'failed';
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // update post
    builder.addCase(updatePost.pending, (state, action) => {
      state.status = 'loading';
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(resetPostEdit, (state, action) => {
      state.isUpdated = true;
    });
    builder.addCase(updatePost.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.postUpdated = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isUpdated = false;
    });
    builder.addCase(updatePost.rejected, (state, action) => {
      state.status = 'failed';
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // Delete post
    builder.addCase(deletePost.pending, (state, action) => {
      state.status = 'loading';
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(resetPostDelete, (state, action) => {
      state.isDeleted = true;
    });
    builder.addCase(deletePost.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.postUpdated = action?.payload;
      state.isDeleted = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(deletePost.rejected, (state, action) => {
      state.status = 'failed';
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // fetch all posts
    builder.addCase(fetchAllPosts.pending, (state, action) => {
      state.status = 'loading';
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(fetchAllPosts.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.postLists = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(fetchAllPosts.rejected, (state, action) => {
      state.status = 'failed';
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // fetch post details
    builder.addCase(fetchPostDetails.pending, (state, action) => {
      state.status = 'loading';
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(fetchPostDetails.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.postDetails = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(fetchPostDetails.rejected, (state, action) => {
      state.status = 'failed';
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // Likes
    builder.addCase(toggleAddLikesToPost.pending, (state, action) => {
      state.status = 'loading';
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(toggleAddLikesToPost.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.likes = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(toggleAddLikesToPost.rejected, (state, action) => {
      state.status = 'failed';
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // disLikes
    builder.addCase(toggleAddDislikesToPost.pending, (state, action) => {
      state.status = 'loading';
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(toggleAddDislikesToPost.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.dislikes = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(toggleAddDislikesToPost.rejected, (state, action) => {
      state.status = 'failed';
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
  },
});

export default postSlice.reducer;
