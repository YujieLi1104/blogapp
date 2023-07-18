/** @format */

import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../utils/baseURL';

// action for redirect
const resetAcc = createAction('account/verify-reset');

// Send email
export const generateAccountVerifyToken = createAsyncThunk(
  'account/token',
  async (email, { rejectWithValue, getState, dispatch }) => {
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
        `${baseUrl}/api/users/generate-verify-email-token`,
        {},
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

// Verify account
export const verifyAccount = createAsyncThunk(
  'account/verified',
  async (token, { rejectWithValue, getState, dispatch }) => {
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
        `${baseUrl}/api/users/verify-user`,
        { token },
        config
      );
      // dispatch
      dispatch(resetAcc());
      return data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const accountVerifySlice = createSlice({
  name: 'account',
  initialState: {},
  extraReducers(builder) {
    // send email
    builder.addCase(generateAccountVerifyToken.pending, (state, action) => {
      state.status = 'loading';
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(generateAccountVerifyToken.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.tokenSent = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(generateAccountVerifyToken.rejected, (state, action) => {
      state.status = 'failed';
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // verify account
    builder.addCase(verifyAccount.pending, (state, action) => {
      state.status = 'loading';
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(resetAcc, (state, action) => {
      state.isVerified = true;
    });
    builder.addCase(verifyAccount.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.verified = action?.payload;
      state.isVerified = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(verifyAccount.rejected, (state, action) => {
      state.status = 'failed';
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
  },
});

export default accountVerifySlice.reducer;
