import asyncHandler from '../middlewares/asyncHandler.js';
import genreModel from '../models/Genre.js';
import mongoose from 'mongoose';

const createGenre = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(401);
      throw new Error('Name is required');
    }
    const genreExist = await genreModel.findOne({ name });

    if (genreExist) {
      res.status(401);
      throw new Error('Already exists');
    }
    const genre = await new genreModel({ name }).save();
    res.status(201).json(genre);
  } catch (error) {
    console.log(error);
    res
      .status(res.statusCode || 500)
      .json({ message: error.message || 'Server error' });
  }
});

const updateGenre = asyncHandler(async (req, res) => {
  try {
    let { name } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid genre ID');
    }
    name = name?.trim();

    const genre = await genreModel.findById(id);

    if (!genre) {
      res.status(404);
      throw new Error('Genre not found');
    }

    if (name && name !== genre.name) {
      const genreExist = await genreModel.findOne({ name });
      if (genreExist) {
        res.status(400);
        throw new Error('Genre with this name already exists');
      }
    }

    if (name) genre.name = name;

    const updatedGenre = await genre.save();

    res.status(200).json(updatedGenre);
  } catch (error) {
    console.error(error);
    res
      .status(res.statusCode || 500)
      .json({ message: error.message || 'Server error' });
  }
});
const removeGenre = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400);
      throw new Error('Invalid ID format');
    }

    const removed = await genreModel.findByIdAndDelete(id);

    if (!removed) {
      res.status(404);
      throw new Error('Genre not found');
    }
    res.status(201).json(removed);
  } catch (error) {
    console.log(error);
    res
      .status(res.statusCode || 500)
      .json({ message: error.message || 'Server error' });
  }
});

const listOfGenres = asyncHandler(async (req, res) => {
  try {
    const all = await genreModel.find({});
    res.json(all);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});
const readGenre = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400);
      throw new Error('Invalid ID format');
    }

    const genre = await genreModel.findOne({ _id: id });
    if (!genre) {
      res.status(404);
      throw new Error('Genre not found');
    }
    res.json(genre);
  } catch (error) {
    console.log(error);
    res.status(res.statusCode || 500).json({ message: error.message || 'Server error' });
  }
});

export { createGenre, updateGenre, removeGenre, listOfGenres, readGenre };
