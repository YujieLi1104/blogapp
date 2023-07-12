/** @format */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { fetchAllCategories } from '../../redux/slices/category/categorySlice';

const CategoryDropDown = (props) => {
  //dispatch action
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);
  // select categories
  const categories = useSelector((state) => state?.category);
  const { categoryList, status, appErr, serverErr } = categories;

  const allCategories = categoryList?.map((category) => {
    return {
      label: category?.title,
      value: category?._id,
    };
  });
  // handle change
  const handleChange = (value) => {
    props.onChange('category', value);
  };
  // handle blur
  const handleBlur = () => {
    props.onBlur('category', true);
  };

  return (
    <div style={{ margin: '1rem 0' }}>
      {status === 'loading' ? (
        <h3 className='test-base text-green-600'>
          Category list are loading please wait...
        </h3>
      ) : (
        <Select
          onChange={handleChange}
          onBlur={handleBlur}
          id='category'
          options={allCategories}
          value={props?.value?.label}
        />
      )}
      {/* Display */}
      {props?.error && (
        <div style={{ color: 'red', marginTop: '.5rem' }}>{props?.error}</div>
      )}
    </div>
  );
};

export default CategoryDropDown;
