/** @format */

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
  const user = useSelector((state) => state?.users);
  const { userAuth } = user;

  if (userAuth.isAdmin === false) {
    return <Navigate to={'/login'} />;
  }
  return children ? children : <Outlet />;
};

export default AdminRoute;
