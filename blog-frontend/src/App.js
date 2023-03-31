/** @format */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Navbar from './components/Navigation/Navbar';
import Login from './components/users/Login';
import Register from './components/users/Register';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} exact />
        <Route path='/register' element={<Register />} exact />
        <Route path='/login' element={<Login />} exact />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
