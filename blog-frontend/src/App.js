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

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route element={<PrivateProtectRoute />}></Route>
        <Route element={<AdminRoute />}>
          <Route
            path='/update-category/:id'
            element={<UpdateCategory />}
            exact
          />
          <Route path='/add-category' element={<AddNewCategory />} exact />
          <Route path='/category-list' element={<CategoryList />} exact />
        </Route>
        <Route path='/' element={<HomePage />} exact />
        <Route path='/register' element={<Register />} exact />
        <Route path='/login' element={<Login />} exact />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
