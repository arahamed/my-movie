import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from '../../component/Loader.jsx';
import { setCredentials } from '../../redux/features/auth/authSlice';
import { toast } from 'react-toastify';
import {
  useResendTokenMutation,
  useVerifyMutation,
} from '../../redux/api/user.js';
import Timeout from '../../component/Timeout.jsx';

const Verify = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [keyReload, setKeyReload] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [UserVerify, { isLoading }] = useVerifyMutation();
  const [UserToken, { isLoading: TokenLoding }] = useResendTokenMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const ap = new URLSearchParams(search);
  const redirect = ap.get('redirect') || '/';

  useEffect(() => {
    if (userInfo?.isVerified) {
      navigate(redirect);
    }
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, redirect, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email || !token) {
      toast.error('Please fill all the fields');
      return;
    } else {
      try {
        const res = await UserVerify({ email, token }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success('User Verified successfully');
      } catch (err) {
        console.error(err);
        toast.error(err.data.message);
      }
    }
  };

  const ResendToken = async (e) => {
    e.preventDefault();
    try {
      const res = await UserToken({ email: userInfo?.email }).unwrap();
      toast.success(res.message);

      setKeyReload(keyReload == 0 ? 1 : 0);
    } catch (err) {
      console.error(err);
      toast.error(err.data.message);
    }
  };

  return (
    <div className='pl-[10rem] flex flex-wrap'>
      <div className='mr-[4rem] mt-[5rem]'>
        <h1 className='text-3xl font-bold mb-4'>Verify Your Account</h1>
        <form onSubmit={handleVerify}>
          <div className='mb-4'>
            <label className='block text-sm font-bold mb-2' htmlFor='email'>
              Email
            </label>
            <input
              type='email'
              id='email'
              value={email}
              placeholder='Enter your email'
              required
              onChange={(e) => setEmail(e.target.value)}
              className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-bold mb-2' htmlFor='token'>
              Verification Token
            </label>
            <input
              type='text'
              id='token'
              value={token}
              placeholder='Enter your token'
              onChange={(e) => setToken(e.target.value)}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
          </div>
          <div className='flex items-center justify-between mb-2'>
            <button
              type='submit'
              disabled={isLoading}
              className='bg-blue-500 hover:bg-blue-700 transition duration-200 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            >
              Verify
            </button>
          </div>

          <div className='flex justify-between  items-center'>
            <Timeout key={keyReload} />
            <button
              type='button'
              disabled={TokenLoding}
              className='bg-blue-500 hover:bg-blue-700 transition duration-200  text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              onClick={ResendToken}
            >
              {TokenLoding ? 'Resending...' : 'Resend Token'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Verify;
