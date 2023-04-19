/** @format */

import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../utils/baseURL';

// Action to redirect
const resetEditAction = createAction('category/reset');
const resetDeleteAction = createAction('category/delete-reset');
const resetCategoryAction = createAction('category/category-reset');

// Create a new category
export const createCategory = createAsyncThunk(
  'category/create',
  async (category, { rejectWithValue, getState, dispatch }) => {
    // get user token
    const user = getState()?.users;
    const { userAuth } = user;
    try {
      const config = {
        headers: {
          Authorization: 'Bearer ' + userAuth?.token,
        },
      };
      const { data } = await axios.post(
        `${baseUrl}/api/category`,
        {
          title: category?.title,
        },
        config
      );
      // dispatch action
      dispatch(resetCategoryAction())
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Fetching all categories
export const fetchAllCategories = createAsyncThunk(
  'category/fetch',
  async (category, { rejectWithValue, getState, dispatch }) => {
    // get user token
    const user = getState()?.users;
    const { userAuth } = user;
    try {
      const config = {
        headers: {
          Authorization: 'Bearer ' + userAuth?.token,
        },
      };
      const { data } = await axios.get(`${baseUrl}/api/category`, config);
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Update a category
export const updateCategory = createAsyncThunk(
  'category/update',
  async (category, { rejectWithValue, getState, dispatch }) => {
    // get user token
    const user = getState()?.users;
    const { userAuth } = user;
    try {
      const config = {
        headers: {
          Authorization: 'Bearer ' + userAuth?.token,
        },
      };
      const { data } = await axios.put(
        `${baseUrl}/api/category/${category?.id}`,
        { title: category?.title },
        config
      );
      // dispatch action to reset the updated data
      dispatch(resetEditAction());
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Delete a category
export const deleteCategory = createAsyncThunk(
  'category/delete',
  async (id, { rejectWithValue, getState, dispatch }) => {
    // get user token
    const user = getState()?.users;
    const { userAuth } = user;
    try {
      const config = {
        headers: {
          Authorization: 'Bearer ' + userAuth?.token,
        },
      };
      const { data } = await axios.delete(
        `${baseUrl}/api/category/${id}`,
        config
      );
      // dispatch action
      dispatch(resetDeleteAction());
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Fetch a single category details
export const fetchCategory = createAsyncThunk(
  'category/details',
  async (id, { rejectWithValue, getState, dispatch }) => {
    // get user token
    const user = getState()?.users;
    const { userAuth } = user;
    try {
      const config = {
        headers: {
          Authorization: 'Bearer ' + userAuth?.token,
        },
      };
      const { data } = await axios.get(`${baseUrl}/api/category/${id}`, config);
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState: { categoryList: [] },
  extraReducers(builder) {
    // create
    builder.addCase(createCategory.pending, (state, action) => {
      state.status = 'loading';
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    // dispatch action to redirect
    builder.addCase(resetCategoryAction, (state, action) => {
      state.isCreated = true;
    })
    builder.addCase(createCategory.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.category = action?.payload;
      state.isCreated = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(createCategory.rejected, (state, action) => {
      state.status = 'failed';
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // fetch all categories
    builder.addCase(fetchAllCategories.pending, (state, action) => {
      state.status = 'loading';
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(fetchAllCategories.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.categoryList = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(fetchAllCategories.rejected, (state, action) => {
      state.status = 'failed';
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // Update category
    builder.addCase(updateCategory.pending, (state, action) => {
      state.status = 'loading';
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    // Dispatch action
    builder.addCase(resetEditAction, (state, action) => {
      state.isEdited = true;
    });
    builder.addCase(updateCategory.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.updatedCategory = action?.payload;
      state.isEdited = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(updateCategory.rejected, (state, action) => {
      state.status = 'failed';
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // Delete category
    builder.addCase(deleteCategory.pending, (state, action) => {
      state.status = 'loading';
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    // Dispatch action for redirect
    builder.addCase(resetDeleteAction, (state, action) => {
      state.isDeleted = true;
    })
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.deletedCategory = action?.payload;
      state.isDeleted = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(deleteCategory.rejected, (state, action) => {
      state.status = 'failed';
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // Fetch category details
    builder.addCase(fetchCategory.pending, (state, action) => {
      state.status = 'loading';
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(fetchCategory.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.category = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(fetchCategory.rejected, (state, action) => {
      state.status = 'failed';
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
  },
});

export default categorySlice.reducer;
