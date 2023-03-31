/** @format */

import React from 'react';
import { useSelector } from 'react-redux';
import AdminNavbar from './AdminNavbar';
import PrivateNavbar from './PrivateNavbar';
import PublicNavbar from './PublicNavbar';

const Navbar = () => {
  // get user from state
  const state = useSelector((state) => state.users);
  const { userAuth } = state;
  const isAdmin = userAuth?.isAdmin;
  console.log(isAdmin);
  return (
    <div>
      {isAdmin ? (
        <AdminNavbar />
      ) : userAuth ? (
        <PrivateNavbar />
      ) : (
        <PublicNavbar />
      )}
    </div>
  );
};

export default Navbar;
