/** @format */
import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import {
  fetchProfile,
  updateProfile,
} from '../../redux/slices/users/usersSlice';

// Form schema
const formSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().required('Email is required'),
  bio: Yup.string().required('Bio is required'),
});

const UpdateProfileForm = () => {
  const { id } = useParams();

  // dispatch
  const dispatch = useDispatch();

  // fetch user details
  useEffect(() => {
    fetchProfile(id);
  }, [dispatch, id]);

  // get user form store
  const users = useSelector((state) => state.users);
  const { profile, status, appErr, serverErr, isUpdated } = users;

  // formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      email: profile?.email,
      bio: profile?.bio,
    },
    onSubmit: (values) => {
      dispatch(updateProfile(values));
    },
    validationSchema: formSchema,
  });

  // redirect
  if (isUpdated) return <Navigate to={`/profile/${id}`} />

  return (
    <div className='min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h3 className='mt-6 text-center text-3xl font-extrabold text-gray-300'>
          <p>
            Hey <span className='text-green-600'>{profile?.firstName}</span>
          </p>
          Wanna update your profile?
        </h3>
        {/* Err */}
        {serverErr || appErr ? (
          <h2 className='text-red-300 text-center'>
            {serverErr} {appErr}
          </h2>
        ) : null}
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          <form onSubmit={formik.handleSubmit} className='space-y-6'>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                First Name
              </label>
              <div className='mt-1'>
                {/* First name */}
                <input
                  value={formik.values.firstName}
                  onChange={formik.handleChange('firstName')}
                  onBlur={formik.handleBlur('firstName')}
                  id='firstName'
                  name='firstName'
                  type='text'
                  autoComplete='firstName'
                  className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                />
              </div>
              <div className='text-red-500'>
                {formik.touched.firstName && formik.errors.firstName}
              </div>
            </div>
            <div>
              <label
                htmlFor='text'
                className='block text-sm font-medium text-gray-700'
              >
                Last Name
              </label>
              <div className='mt-1'>
                {/* Last Name */}
                <input
                  value={formik.values.lastName}
                  onChange={formik.handleChange('lastName')}
                  onBlur={formik.handleBlur('lastName')}
                  id='lastName'
                  name='lastName'
                  type='text'
                  autoComplete='lastName'
                  className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                />
              </div>
              {/* Err msg */}
              <div className='text-red-500'>
                {formik.touched.lastName && formik.errors.lastName}
              </div>
            </div>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Email
              </label>
              <div className='mt-1'>
                {/* Email */}
                <input
                  value={formik.values.email}
                  onChange={formik.handleChange('email')}
                  onBlur={formik.handleBlur('email')}
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                />
              </div>
              {/* err msg */}
              <div className='text-red-500'>
                {formik.touched.email && formik.errors.email}
              </div>
            </div>
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700'
              >
                Bio
              </label>
              <textarea
                value={formik.values.bio}
                onChange={formik.handleChange('bio')}
                onBlur={formik.handleBlur('bio')}
                rows='5'
                cols='10'
                className='rounded-lg appearance-none block w-full py-3 px-3 text-base text-center leading-tight text-gray-600 bg-transparent focus:bg-transparent  border border-gray-200 focus:border-gray-500  focus:outline-none'
                type='text'
              ></textarea>
              {/* Err msg */}
              <div className='text-red-500'>
                {formik.touched.bio && formik.errors.bio}
              </div>
            </div>
            <div>
              {/* submit btn */}
              {status === 'loading' ? (
                <button
                  disabled
                  className='w-full flex justify-center py-2 px-4 border border-transparent 
                  rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 '
                >
                  Loading please wait...
                </button>
              ) : (
                <button
                  type='submit'
                  className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                >
                  Update
                </button>
              )}
            </div>
          </form>

          <div className='mt-4 mb-3'>
            <div className='relative'>
              <div className='flex flex-col justify-center items-center'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-300' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfileForm;
