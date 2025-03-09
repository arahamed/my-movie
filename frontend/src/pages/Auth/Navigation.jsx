import { useState } from 'react';
import {
  AiOutlineHome,
  AiOutlineLogin,
  AiOutlineUserAdd,
} from 'react-icons/ai';

import { MdOutlineLocalMovies } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../../redux/api/user.js';
import { logout } from '../../redux/features/auth/authSlice.js';

import { toast } from 'react-toastify';

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      const res = await logoutApiCall().unwrap();
      dispatch(logout());
      toast.success(res?.message);
      navigate('/login');
    } catch (err) {
      console.error('Failed to logout: ', err);
    }
  };
  return (
    <div className='fixed bottom-10 left-[30rem] transform translate-x-1/2 translate-y-1/2 z-50 text-white bg-[#0f0f0f] border w-[30%] px-[4rem] mb-[2rem] rounded'>
      <section className='flex justify-between items-center '>
        {/* section1 */}
        <div className='flex justify-center items-center  gap-3 mb-[2rem]'>
          <Link
            to='/'
            className='flex items-center transition-transform transform hover:translate-x-2'
          >
            <AiOutlineHome className='mr-2 mt-[3rem] ' size={26} />{' '}
            <span className='hidden nav-item-name mt-[3rem]'>Home</span>
          </Link>
          <Link
            to='/movies'
            className='flex items-center transition-transform transform hover:translate-x-2 '
          >
            <MdOutlineLocalMovies className='mr-2 mt-[3rem]' size={26} />
            <span className='hidden nav-item-name mt-[3rem]'>SHOP</span>
          </Link>
        </div>

        {/* section2 */}

        <div className='relative'>
          <button
            onClick={toggleDropdown}
            className='text-gray-800 focus:outline-none'
          >
            {userInfo?.isVerified ? (
              <span className='text-white'>{userInfo?.username}</span>
            ) : (
              <></>
            )}
            {userInfo?.isVerified && (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className={`h-4 w-4 ml-1 ${
                  dropdownOpen ? 'transform rotate-180' : ''
                }`}
                fill='none'
                viewBox='0 0 25 24'
                stroke='white'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='4'
                  d='M19 9l-7 7-7-7'
                  // d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7" }
                />
              </svg>
            )}
          </button>

          {dropdownOpen && userInfo && (
            <ul
              className={` absolute right-0 mt-2 mr-14 w-[10rem] space-y-2 bg-white text-gray-600 ${
                !userInfo.isAdmin ? '-top-20' : '-top-24'
              }`}
            >
              {userInfo.isAdmin && (
                <li>
                  <Link
                    to='/admin/movies/dashboar'
                    className='block px-4 py-2 hover:bg-gray-200'
                  >
                    Dashboard
                  </Link>
                </li>
              )}
              <li>
                <Link
                  to='/profile'
                  className='block px-4 py-2 hover:bg-gray-200'
                >
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={logoutHandler}
                  className='block px-4 py-2 hover:bg-gray-200 w-full text-left'
                >
                  Logout
                </button>
              </li>
            </ul>
          )}

          {!userInfo?.isVerified && (
            <ul className='flex gap-3'>
              <li>
                <Link
                  to='/login'
                  className='flex items-center mt-5 transition-transform transform hover:translate-x-2 mb-[2rem]'
                >
                  <AiOutlineLogin className='mr-2 mt-[4px]' size={26} />
                  <span className='hidden nav-item-name'>Login</span>
                </Link>
              </li>
              <li>
                <Link
                  to='/register'
                  className='flex items-center mt-5 transition-transform transform hover:translate-x-2 md-[2rem]'
                >
                  <AiOutlineUserAdd className='mr-2 mt-[4px]' size={26} />
                  <span className='hidden nav-item-name mt-[3rem]'>
                    Register
                  </span>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default Navigation;
