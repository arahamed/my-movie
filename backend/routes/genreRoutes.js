import express from 'express';
import { authenicate, authorizeAdmin } from '../middlewares/authMiddleware.js';
import { createGenre, listOfGenres, readGenre, removeGenre, updateGenre } from '../controllers/genreControler.js';

const genreRoutes = express.Router();

genreRoutes.route('/').post(authenicate, authorizeAdmin, createGenre);
genreRoutes.route('/:id').put(authenicate, authorizeAdmin, updateGenre).delete(authenicate,authorizeAdmin,removeGenre).get(readGenre)
genreRoutes.get("/genres",listOfGenres)

export default genreRoutes;
