import express from 'express';
import { authenicate, authorizeAdmin } from '../middlewares/authMiddleware.js';
import {
  createMovie,
  deleteComment,
  deleteMovie,
  getAllMovies,
  getNewMovies,
  getRandomMovies,
  getSpecificMovie,
  getTopMovies,
  movieReview,
  updateMovie,
} from '../controllers/movieController.js';

const moviesRoutes = express.Router();

moviesRoutes.get('/all-movies', getAllMovies);
moviesRoutes.get('/specific-movie/:id', getSpecificMovie);
moviesRoutes.get('/new-movies', getNewMovies);
moviesRoutes.get('/top-movies', getTopMovies);
moviesRoutes.get('/random-movies', getRandomMovies);

moviesRoutes.post('/:id/reviews', authenicate, movieReview);

moviesRoutes
  .route('/create-movie')
  .post(authenicate, authorizeAdmin, createMovie);
moviesRoutes.put('/update-movie/:id', authenicate, authorizeAdmin, updateMovie);
moviesRoutes.delete("/delete-movie/:id", authenicate, authorizeAdmin, deleteMovie)
moviesRoutes.delete("/delete-comment",authenicate,authenicate,deleteComment)
export default moviesRoutes;
