/** @format */

import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../utils/baseURL';

// Redirect action
const resetEmail = createAction('email/reset');

// Send email
export const sendEmail = createAsyncThunk(
  'email/sent',
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
        `${baseUrl}/api/emails`,
        {
          to: email?.recipientEmail,
          subject: email?.subject,
          message: email?.message,
        },
        config
      );
      dispatch(resetEmail());
      return data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const emailSlice = createSlice({
  name: 'email',
  initialState: {},
  extraReducers(builder) {
    // send email
    builder.addCase(sendEmail.pending, (state, action) => {
      state.status = 'loading';
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    // dispatch redirect action
    builder.addCase(resetEmail, (state, action) => {
      state.isEmailSent = true;
    });
    builder.addCase(sendEmail.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.emailSent = action?.payload;
      state.isEmailSent = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(sendEmail.rejected, (state, action) => {
      state.status = 'failed';
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
  },
});

export default emailSlice.reducer;
