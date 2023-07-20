/** @format */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UsersListHeader from './UsersListHeader';
import UsersListItem from './UsersListItem';
import { fetchAllUsers } from '../../../redux/slices/users/usersSlice';
import LoadingSpinners from '../../../utils/LoadingSpinners';

const UsersList = () => {
  // dispatch
  const dispatch = useDispatch();

  // data from store
  const users = useSelector((state) => state?.users);
  const { usersList, appErr, serverErr, status, block, unblock } = users;

  // fetch all users
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [block, unblock]);

  return (
    <>
      <section class='py-8 bg-gray-900 min-h-screen'>
        <>
          <UsersListHeader users={users} />
        </>
        {status === 'loading' ? (
          <LoadingSpinners />
        ) : appErr || serverErr ? (
          <h3 className='text-yellow-600 text-center text-lg'>
            {serverErr} {appErr}
          </h3>
        ) : usersList?.length <= 0 ? (
          <h2>No Author Found</h2>
        ) : (
          usersList?.map((user) => (
            <>
              <UsersListItem user={user} />
            </>
          ))
        )}
      </section>
    </>
  );
};

export default UsersList;
