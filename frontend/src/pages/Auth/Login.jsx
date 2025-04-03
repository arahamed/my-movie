import { useState ,useEffect, use} from 'react'
import { Link, useLocation,useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setCredentials } from '../../redux/features/auth/authSlice.js'
import { useLoginMutation} from '../../redux/api/user.js'
import { toast } from 'react-toastify'

import { BsFillEyeFill ,BsFillEyeSlashFill} from "react-icons/bs";



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const {userInfo} = useSelector((state)=> state.auth )
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {search}= useLocation()
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/"

  useEffect(()=>{
    if (userInfo) {
      navigate(userInfo.isVerified ? redirect : '/verify');
    }
  },[navigate,redirect,userInfo]);


 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login({ email, password }).unwrap();
      dispatch(setCredentials(userData));
      navigate(redirect);
    } catch (err) {
      toast.error(err.data?.message || 'Failed to login');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div>
      <section className='pl-[10rem] flex flex-wrap'>
        <div className="mr-[4rem] mt-[5rem] ">
          <h1 className="text-2xl font-semibold mb-4">Sign In</h1>
          <form onSubmit={handleSubmit} className="container w-[40rem]">
            <div className="my-[2rem]">
              <label htmlFor="email" className="block text-sm font-medium ">
                Email address
              </label>
              
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder='Enter your email'
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div className="my-[2rem]">

              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder='Enter your password'
                  className="mt-1 p-2 pr-10 border rounded w-full"
                />
                {password && (
                  <span
                    onClick={togglePasswordVisibility}
                    className="absolute text-black text-xl top-3.5 right-3 flex items-center cursor-pointer"
                  >
                    {showPassword ? <BsFillEyeSlashFill /> : <BsFillEyeFill />}
                  </span>
                )}
              </div>
            </div>
            <div className="my-[2rem]">
              <button
                type="submit"
                
                className="w-full bg-teal-500 text-white p-2 rounded focus:bg-teal-700 transition duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Resending..." : 'Sign In'}
              </button>
            </div>
            <p className="mt-4">
              Don't have an account? <Link to="/register" className="text-teal-500">Register</Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  )
}

export default Login