/** @format */

import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { useFormik } from 'formik';
import Dropzone from 'react-dropzone';
import * as Yup from 'yup';
import styled from 'styled-components';
import { uploadProfilePic } from '../../redux/slices/users/usersSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// Form schema
const formSchema = Yup.object().shape({
  image: Yup.string().required('Image is required'),
});

//Css for dropzone
const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
`;

export default function UploadProfilePhoto() {
  // dispatch
  const dispatch = useDispatch();

  // formik
  const formik = useFormik({
    initialValues: { image: '' },
    validationSchema: formSchema,
    onSubmit: (values) => {
      dispatch(uploadProfilePic(values));
    },
  });

  // store data
  const users = useSelector((state) => state?.users);
  const { profilePic, status, appErr, serverErr, userAuth } = users;

  // redirect
  if (profilePic) return <Navigate to={`/profile/${userAuth?._id}`} />

  return (
    <div className='min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-300'>
          Upload profile photo
        </h2>
        {/* Displya err here */}
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          <form className='space-y-6' onSubmit={formik.handleSubmit}>
            {/* Image container here thus Dropzone */}
            {appErr || serverErr ? (
              <h2 className='text-center text-red-500'>
                {serverErr} {appErr}
              </h2>
            ) : null}
            <Container>
              <Dropzone
                onBlur={formik.handleBlur('image')}
                accept={('image/jpeg', 'image/png')}
                onDrop={(acceptedFiles) => {
                  formik.setFieldValue('image', acceptedFiles[0]);
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div className='container'>
                    <div
                      {...getRootProps({
                        className: 'dropzone',
                        onDrop: (event) => event.stopPropagation(),
                      })}
                    >
                      <input {...getInputProps()} />
                      <p className='text-gray-300 text-lg cursor-pointer hover:text-gray-500'>
                        Click here to select image
                      </p>
                    </div>
                  </div>
                )}
              </Dropzone>
            </Container>

            <div className='text-red-500'>
              {formik.touched.image && formik.errors.image}
            </div>
            <p className='text-sm text-gray-500'>
              PNG, JPG, GIF minimum size 400kb uploaded only 1 image
            </p>

            <div>
              {status === 'loading' ? (
                <button
                  disabled
                  className='inline-flex justify-center w-full px-4 py-2 border 
                  border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-100 
                  bg-gray-500 '
                >
                  <ArrowUpTrayIcon
                    className='-ml-1 mr-2 h-5  text-gray-400'
                    aria-hidden='true'
                  />
                  <span>Loading please wait...</span>
                </button>
              ) : (
                <button
                  type='submit'
                  className='inline-flex justify-center w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500'
                >
                  <ArrowUpTrayIcon
                    className='-ml-1 mr-2 h-5  text-gray-400'
                    aria-hidden='true'
                  />
                  <span>Upload Photo</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
