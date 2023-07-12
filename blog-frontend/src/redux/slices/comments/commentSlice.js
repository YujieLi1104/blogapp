/** @format */

import { createAsyncThunk, createSlice, createAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../utils/baseURL';

// Action to redirect
const resetCommentEdit = createAction('comment/reset');

// Create comment
export const createComment = createAsyncThunk(
  'comment/created',
  async (comment, { rejectWithValue, getState, dispatch }) => {
    // get user token
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: 'Bearer ' + userAuth?.token,
      },
    };
    try {
      const { data } = await axios.post(
        `${baseUrl}/api/comments`,
        { description: comment?.description, postId: comment?.postId },
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

// Delete comment
export const deleteComment = createAsyncThunk(
  'comment/deleted',
  async (commentId, { rejectWithValue, getState, dispatch }) => {
    // get user token
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: 'Bearer ' + userAuth?.token,
      },
    };
    try {
      const { data } = await axios.delete(
        `${baseUrl}/api/comments/${commentId}`,
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

// Update comment
export const updateComment = createAsyncThunk(
    'comment/updated',
    async (comment, { rejectWithValue, getState, dispatch }) => {
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
          `${baseUrl}/api/comments/${comment?.id}`,
          {description: comment?.description},
          config
        );
        // dispatch
        dispatch(resetCommentEdit());
        return data;
      } catch (error) {
        if (!error?.response) {
          throw error;
        }
        return rejectWithValue(error?.response?.data);
      }
    }
  );

  // Fetch comment details
export const fetchCommentDetails = createAsyncThunk(
    'comment/details',
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
          `${baseUrl}/api/comments/${id}`,
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

const commentSlice = createSlice({
  name: 'comment',
  initialState: {},
  extraReducers(builder) {
    // create
    builder.addCase(createComment.pending, (state, action) => {
      state.status = 'loading';
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(createComment.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.commentCreated = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(createComment.rejected, (state, action) => {
      state.status = 'failed';
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // delete
    builder.addCase(deleteComment.pending, (state, action) => {
      state.status = 'loading';
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.commentDeleted = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(deleteComment.rejected, (state, action) => {
      state.status = 'failed';
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // update
    builder.addCase(updateComment.pending, (state, action) => {
        state.status = 'loading';
        state.appErr = undefined;
        state.serverErr = undefined;
      });
      builder.addCase(resetCommentEdit, (state, action) => {
        state.isUpdated = true;
      });
      builder.addCase(updateComment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.commentUpdated = action?.payload;
        state.isUpdated = false;
        state.appErr = undefined;
        state.serverErr = undefined;
      });
      builder.addCase(updateComment.rejected, (state, action) => {
        state.status = 'failed';
        state.appErr = action?.payload?.message;
        state.serverErr = action?.error?.message;
      });
    // fetch details
    builder.addCase(fetchCommentDetails.pending, (state, action) => {
        state.status = 'loading';
        state.appErr = undefined;
        state.serverErr = undefined;
      });
      builder.addCase(fetchCommentDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.commentDetails = action?.payload;
        state.appErr = undefined;
        state.serverErr = undefined;
      });
      builder.addCase(fetchCommentDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.appErr = action?.payload?.message;
        state.serverErr = action?.error?.message;
      });
  },
});

export default commentSlice.reducer;
