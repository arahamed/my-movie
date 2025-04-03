import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import store from './redux/store.js';
import { Provider } from 'react-redux';
import { createRoutesFromElements, Route, RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import Verify from './pages/Auth/Verify.jsx';
import PrivateRoute from './pages/Auth/PrivateRoute.jsx';
import Profile from './pages/User/Profile.jsx';
import AdminRoutes from './pages/Admin/AdminRoutes.jsx';
import GenreList from './pages/Admin/GenreList.jsx';
import CreateMovie from './pages/Admin/CreateMovie.jsx';
import AdminMoviesList from './pages/Admin/AdminMoviesList.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<Home />} />
      <Route path='login' element={<Login />} />
      <Route path='register' element={<Register />} />
      <Route path='verify' element={<Verify />} />

      <Route path='' element={<PrivateRoute />}>
        <Route path='/profile' element={<Profile />} />
        <Route path='/admin/movies' element={<AdminRoutes />}>
          <Route path='genre' element={<GenreList />} />
          <Route path='create' element={<CreateMovie />} />
          <Route path='movielist' element={<AdminMoviesList/>}/>
        </Route>
      </Route>
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
