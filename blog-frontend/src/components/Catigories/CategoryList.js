/** @format */

import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import DateFormatter from '../../utils/DateFormatter';
import { fetchAllCategories } from '../../redux/slices/category/categorySlice';
import LoadingSpinners from '../../utils/LoadingSpinners';

const CategoryList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const category = useSelector((state) => state?.category);
  const { categoryList, status, appErr, serverErr } = category;

  return (
    <>
      {status === 'loading' ? (
        <>
          <LoadingSpinners />
        </>
      ) : appErr || serverErr ? (
        <h2 className='text-center text-3xl text-red-600'>
          {serverErr} {appErr}
        </h2>
      ) : categoryList?.length <= 0 ? (
        <h2>No category found</h2>
      ) : (
        <div className='flex flex-col'>
          <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
            <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
              <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        Author
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        Title
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        Created At
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        Edit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Loop through categoriesList */}
                    {categoryList.map((category) => (
                      <tr className='bg-gray-50' key={category._id}>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center'>
                            <div className='flex-shrink-0 h-10 w-10'>
                              {/* User image */}
                              <img
                                className='h-10 w-10 rounded-full'
                                //src='https://cdn.pixabay.com/photo/2021/02/24/23/43/boy-6047786_960_720.jpg'
                                src={category?.user?.profilePic}
                                alt='category profile'
                              />
                            </div>
                            <div className='ml-4'>
                              <div className='text-sm font-medium text-gray-900'>
                                {category?.user?.firstName}{' '}
                                {category?.user?.lastName}
                              </div>
                              <div className='text-sm text-gray-500'>
                                {category?.user?.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {category.title}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          <DateFormatter date={category?.createdAt} />
                        </td>
                        <Link to={`/update-category/${category._id}`}>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            <PencilSquareIcon className='h-5 text-indigo-500' />
                          </td>
                        </Link>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryList;
