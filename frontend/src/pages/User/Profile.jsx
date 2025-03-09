import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useUpdateProfileMutation } from '../../redux/api/user.js';
import { setCredentials } from '../../redux/features/auth/authSlice.js';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  useEffect(() => {
    if (userInfo.isVerified) {
      setUsername(userInfo.username);
    }
  }, [userInfo.username]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await updateProfile({ username, password }).unwrap();
        dispatch(setCredentials({...res}));
        toast.success('Profile updated successfully');
      } catch (err) {
        toast.error(err?.data?.message || err?.error);
      }
    }
  };

  return (
    <div>
      <div className='container mx-auto p-4 mt-[10rem] '>
        <div className='flex justify-center items-center md:flex md:space-x-4'>
          <div className='md:w-1/3 w-[40ram]'>
            <h2 className="text-3xl font-bold mb-4">
              Update Profile
            </h2>

            <form onSubmit={submitHandler}>
              <div className="mb-4">
                <label htmlFor="profileName" className="block text-sm font-medium">
                  Name
                </label>
                <input
                  type="text"
                  className="mt-1 p-2 border rounded w-full"
                  id='profileName'
                  value={username}
                  onChange={(e)=> setUsername(e.target.value)}
                  placeholder='Enter your name'
                />
              </div>
              <div className="mb-4">
                <label htmlFor="profilePassword" className="block text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  className="mt-1 p-2 border rounded w-full"
                  id='profilePassword'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Enter your password'
                />
              </div>
              <div className="mb-4">
                <label htmlFor="profileConfirmPassword" className="block text-sm font-medium">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="mt-1 p-2 border rounded w-full"
                  id='profileConfirmPassword'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='Confirm your password'
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded mt-4"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
