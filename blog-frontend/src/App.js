/** @format */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddNewCategory from './components/Catigories/AddNewCategory';
import CategoryList from './components/Catigories/CategoryList';
import UpdateCategory from './components/Catigories/UpdateCategory';
import HomePage from './components/HomePage';
import Navbar from './components/Navigation/Navbar';
import Login from './components/users/Login';
import Register from './components/users/Register';
import PrivateProtectRoute from './components/Navigation/PrivateProtectRoute';
import AdminRoute from './components/Navigation/AdminRoute';
import CreatePost from './components/Posts/CreatePost';
import PostsList from './components/Posts/PostsList';
import PostDetails from './components/Posts/PostDetails';
import UpdatePost from './components/Posts/UpdatePost';
import UpdateComment from './components/Comments/UpdateComment';
import Profile from './components/users/Profile';
import UploadProfilePhoto from './components/users/UploadProfilePhoto';
import UpdateProfileForm from './components/users/UpdateProfileForm';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/create-post' element={<CreatePost />} exact />
        <Route element={<PrivateProtectRoute />}>
          <Route path='/update-post/:id' element={<UpdatePost />} exact />
          <Route path='/update-comment/:id' element={<UpdateComment />} exact />
          <Route path='/profile/:id' element={<Profile />} exact />
          <Route
            path='/upload-profile-photo'
            element={<UploadProfilePhoto />}
            exact
          />
          <Route path='/update-profile/:id' element={<UpdateProfileForm />} exact />
        </Route>
        <Route element={<AdminRoute />}>
          <Route
            path='/update-category/:id'
            element={<UpdateCategory />}
            exact
          />
          <Route path='/add-category' element={<AddNewCategory />} exact />
          <Route path='/category-list' element={<CategoryList />} exact />
        </Route>
        <Route path='/posts' element={<PostsList />} exact />
        <Route path='/posts/:id' element={<PostDetails />} exact />
        <Route path='/' element={<HomePage />} exact />
        <Route path='/register' element={<Register />} exact />
        <Route path='/login' element={<Login />} exact />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
