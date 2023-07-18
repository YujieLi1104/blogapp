/** @format */

import React from 'react';
import { useSelector } from 'react-redux';
import AdminNavbar from './AdminNavbar';
import PrivateNavbar from './PrivateNavbar';
import PublicNavbar from './PublicNavbar';
import AccountVerificationAlertWarning from './Alert/AccountVerificationAlertWarning';
import AccountVerificationSuccessAlert from './Alert/AccountVerificationSuccessAlert';

const Navbar = () => {
  // get user from state
  const state = useSelector((state) => state.users);
  const { userAuth, profile } = state;
  const isAdmin = userAuth?.isAdmin;

  // get account verification from state
  const accVeri = useSelector((state) => state.accountVerification);
  const { tokenSent, status, appErr, serverErr } = accVeri;

  return (
    <div>
      {isAdmin ? (
        <AdminNavbar isLogin={userAuth} />
      ) : userAuth ? (
        <PrivateNavbar isLogin={userAuth} />
      ) : (
        <PublicNavbar />
      )}
      {/* display alert */}
      {userAuth && !userAuth?.isVerified && <AccountVerificationAlertWarning />}
      {/* display success message */}
      {status === 'loading' && (
        <h2 className='text-center'>Loading please wait...</h2>
      )}
      {tokenSent && <AccountVerificationSuccessAlert />}
      {appErr || serverErr ? (
        <h2 className='text-center text-red-500'>
          {serverErr} {appErr}
        </h2>
      ) : null}
    </div>
  );
};

export default Navbar;
