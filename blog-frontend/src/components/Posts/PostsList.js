/** @format */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
  EyeIcon,
} from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import {
  fetchAllPosts,
  toggleAddDislikesToPost,
  toggleAddLikesToPost,
} from '../../redux/slices/posts/postSlice.js';
import DateFormatter from '../../utils/DateFormatter.js';
import { fetchAllCategories } from '../../redux/slices/category/categorySlice.js';
import LoadingSpinners from '../../utils/LoadingSpinners.js';

export default function PostsList() {
  // dispatch
  const dispatch = useDispatch();

  // select post from store
  const post = useSelector((state) => state.post);
  const { postLists, status, appErr, serverErr, likes, dislikes } = post;

  // select categories from store
  const category = useSelector((state) => state.category);
  const {
    categoryList,
    status: categoryStatus,
    appErr: categoryAppErr,
    serverErr: categoryServerErr,
  } = category;

  // fetch posts
  useEffect(() => {
    dispatch(fetchAllPosts(''));
  }, [dispatch, likes, dislikes]);

  // fetch categories
  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  return (
    <>
      <section>
        <div class='py-20 bg-gray-900 min-h-screen radius-for-skewed'>
          <div class='container mx-auto px-4'>
            <div class='mb-16 flex flex-wrap items-center'>
              <div class='w-full lg:w-1/2'>
                <span class='text-green-600 font-bold'>
                  Latest Posts from our awesome authors
                </span>
                <h2 class='text-4xl text-gray-300 lg:text-5xl font-bold font-heading'>
                  Latest Post
                </h2>
              </div>
              <div class=' block text-right w-1/2'>
                {/* View All */}
                <button
                  onClick={() => dispatch(fetchAllPosts(''))}
                  class='inline-block py-2 px-6 rounded-l-xl rounded-t-xl 
                bg-green-600 hover:bg-green-700 text-gray-50 font-bold leading-loose 
                transition duration-200'
                >
                  View All Posts
                </button>
              </div>
            </div>
            <div class='flex flex-wrap -mx-3'>
              <div class='mb-8 lg:mb-0 w-full lg:w-1/4 px-3'>
                <div class='py-4 px-6 bg-gray-600 shadow rounded'>
                  <h4 class='mb-4 text-gray-500 font-bold uppercase'>
                    Categories
                  </h4>
                  <ul>
                    {categoryStatus === 'loading' ? (
                      <LoadingSpinners />
                    ) : categoryAppErr || categoryServerErr ? (
                      <h1>
                        {categoryServerErr} {categoryAppErr}
                      </h1>
                    ) : categoryList?.length <= 0 ? (
                      <h1 className='text-yellow-400 text-lg text-center'>
                        No Category Found
                      </h1>
                    ) : (
                      categoryList?.map((category) => (
                        <li>
                          <p
                            onClick={() =>
                              dispatch(fetchAllPosts(category?.title))
                            }
                            className='block cursor-pointer py-2 px-3 mb-4 rounded text-yellow-500 font-bold bg-gray-500'
                          >
                            {category?.title}
                          </p>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
              <div class='w-full lg:w-3/4 px-3'>
                {/* Post goes here*/}
                {appErr || serverErr ? (
                  <h1 className='text-yellow-600 text-center text-lg'>
                    {serverErr}
                    {appErr}{' '}
                  </h1>
                ) : postLists?.length <= 0 ? (
                  <h1 className='text-yellow-400 text-lg text-center'>
                    No Post Found
                  </h1>
                ) : (
                  postLists?.map((post) => (
                    <div
                      key={post.id}
                      class='flex flex-wrap bg-gray-900 -mx-3  lg:mb-6'
                    >
                      <div className='mb-10  w-full lg:w-1/4'>
                        <Link>
                          {/* Post image */}
                          <img
                            className='w-full h-full object-cover rounded'
                            src={post.image}
                            alt=''
                          />
                        </Link>
                        {/* Likes, views dislikes */}
                        <div className='flex flex-row bg-gray-300 justify-center w-full  items-center '>
                          {/* Likes */}
                          <div className='flex flex-row justify-center items-center ml-4 mr-4 pb-2 pt-1'>
                            {/* Togle like  */}
                            <div className=''>
                              <HandThumbUpIcon
                                onClick={() =>
                                  dispatch(toggleAddLikesToPost(post?._id))
                                }
                                className='h-7 w-7 text-indigo-600 cursor-pointer'
                              />
                            </div>
                            <div className='pl-2 text-gray-600'>
                              {post?.likes?.length}
                            </div>
                          </div>
                          {/* Dislike */}
                          <div className='flex flex-row  justify-center items-center ml-4 mr-4 pb-2 pt-1'>
                            <div>
                              <HandThumbDownIcon
                                onClick={() =>
                                  dispatch(toggleAddDislikesToPost(post?._id))
                                }
                                className='h-7 w-7 cursor-pointer text-gray-600'
                              />
                            </div>
                            <div className='pl-2 text-gray-600'>
                              {post?.dislikes?.length}
                            </div>
                          </div>
                          {/* Views */}
                          <div className='flex flex-row justify-center items-center ml-4 mr-4 pb-2 pt-1'>
                            <div>
                              <EyeIcon className='h-7 w-7  text-gray-400' />
                            </div>
                            <div className='pl-2 text-gray-600'>
                              {post?.numViews}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class='w-full lg:w-3/4 px-3'>
                        <Link class='hover:underline'>
                          <h3 class='mb-1 text-2xl text-green-400 font-bold font-heading'>
                            {/* {capitalizeWord(post?.title)} */}
                            {post?.title}
                          </h3>
                        </Link>
                        <p class='text-gray-300'>{post?.description}</p>
                        {/* Read more */}
                        <Link
                          to={`/posts/${post.id}`}
                          className='text-indigo-500 hover:underline'
                        >
                          Read More..
                        </Link>
                        {/* User Avatar */}
                        <div className='mt-6 flex items-center'>
                          <div className='flex-shrink-0'>
                            <Link>
                              <img
                                className='h-10 w-10 rounded-full'
                                src={post?.user?.profilePic}
                                alt=''
                              />
                            </Link>
                          </div>
                          <div className='ml-3'>
                            <p className='text-sm font-medium text-gray-900'>
                              <Link to={`/profile/${post?.user?._id}`} className='text-yellow-400 hover:underline '>
                                {post?.user?.firstName} {post?.user?.lastName}
                              </Link>
                            </p>
                            <div className='flex space-x-1 text-sm text-green-500'>
                              <time>
                                <DateFormatter date={post?.createdAt} />
                              </time>
                              <span aria-hidden='true'>&middot;</span>
                            </div>
                          </div>
                        </div>
                        {/* <p class="text-gray-500">
                          Quisque id sagittis turpis. Nulla sollicitudin rutrum
                          eros eu dictum...
                        </p> */}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='bg-gray-900'>
          <div class='skew bg-green-500 skew-bottom mr-for-radius'>
            <svg
              class='h-8 md:h-12 lg:h-10 w-full text-gray-900'
              viewBox='0 0 10 10'
              preserveAspectRatio='none'
            >
              <polygon fill='currentColor' points='0 0 10 0 0 10'></polygon>
            </svg>
          </div>
          <div class='skew bg-gray-500  skew-bottom ml-for-radius'>
            <svg
              class='h-8 bg-gray-500 md:h-12 lg:h-20 w-full text-gray-900'
              viewBox='0 0 10 10'
              preserveAspectRatio='none'
            >
              <polygon fill='currentColor' points='0 0 10 0 10 10'></polygon>
            </svg>
          </div>
        </div>
      </section>
    </>
  );
}
