import { useState, useEffect, use } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../component/Loader.jsx';
import { setCredentials } from '../../redux/features/auth/authSlice.js';
import { useCreateUserMutation } from '../../redux/api/user.js';
import { toast } from 'react-toastify';

import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [createUser, { isLoading }] = useCreateUserMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';
  useEffect(() => {
    if (userInfo) {
      navigate(userInfo?.isVerified ? redirect : '/verify');
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    } else {
      try {
        console.log('in');

        const res = await createUser({ username, email, password }).unwrap();
        console.log('out');
        dispatch(setCredentials({ ...res }));
        navigate('/verify');
        toast.success('User registered successfully');
      } catch (err) {
        console.error(err);
        toast.error(err?.data?.message);
      }
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordtoggler = () => {
    setShowPassword(!showPassword);
  };
  const confirmPasswordtoggler = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className='pl-[10rem] flex flex-wrap flex-row'>
      <div className='mr-[4rem] mt-[5rem]'>
        <h1 className='text-2xl font-semibold mb-4'>Register</h1>
        <form onSubmit={submitHandler} className='container w-[40rem]'>
          <div className='my-[2rem]'>
            <label htmlFor='name' className='block text-sm font-medium '>
              Name
            </label>
            <input
              type='text'
              id='name'
              placeholder='Enter your name'
              className='mt-1 p-2 border rounded-md w-full'
              required
              title='Enter your name'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className='my-[2rem]'>
            <label htmlFor='email' className='block text-sm font-medium '>
              Email
            </label>
            <input
              type='email'
              id='email'
              placeholder='Enter your email'
              className='mt-1 p-2 border rounded-md w-full'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='my-[2rem]'>
            <label htmlFor='password' className='block text-sm font-medium '>
              Password
            </label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                placeholder='Enter your password'
                className='mt-1 p-2 pr-10 border rounded-md w-full relative'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {password && (
                <div
                  onClick={passwordtoggler}
                  className='absolute text-xl text-black right-3 top-4 cursor-pointer'
                >
                  {showPassword ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
                </div>
              )}
            </div>
          </div>
          <div className='my-[2rem]'>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium '
            >
              Confirm Password
            </label>
            <div className='relative'>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id='confirmPassword'
                placeholder='Confirm your password'
                className='mt-1 p-2 border rounded-md w-full'
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPassword && (
                <div
                  onClick={confirmPasswordtoggler}
                  className='absolute text-xl text-black right-3 top-4 cursor-pointer'
                >
                  {showConfirmPassword ? (
                    <BsFillEyeFill />
                  ) : (
                    <BsFillEyeSlashFill />
                  )}
                </div>
              )}
            </div>
          </div>
          <button
            type='submit'
            className='bg-teal-500 focus:bg-teal-700 transition duration-200 text-white p-2 rounded-md w-full'
          >
            {isLoading ? 'Resending...' : 'Register'}
          </button>
          <div className='mt-4'>
            <p>
              Already have an account?{' '}
              <Link to='/login' className='text-teal-500 '>
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
      <div className='className="h-full w-[55%] xl:block md:hidden sm:hidden rounded-lg"'>
        {isLoading && <Loader />}
      </div>
    </div>
  );
};

export default Register;
