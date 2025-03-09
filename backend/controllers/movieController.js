import asyncHandler from '../middlewares/asyncHandler.js';
import moviesModel from '../models/Movie.js';

const createMovie = asyncHandler(async (req, res) => {
  try {
    const { name, image, year, genre, details, cast } = req.body;

    // Input validation
    if (!name || !image || !year || !genre || !details) {
      res.status(400);
      throw new Error(
        'All fields are required: name, image, year, genre, details'
      );
    }

    // Create a new movie entry
    const newMovie = await moviesModel.create({
      name,
      image,
      year,
      genre,
      details,
      cast: cast || [],
    });

    res.status(201).json(newMovie);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .json({ message: error.message || 'Server error' });
  }
});

const getAllMovies = asyncHandler(async (req, res) => {
  try {
    const movies = await moviesModel.find().lean();

    res.status(200).json(movies);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .json({ message: error.message || 'Server error' });
  }
});

const getSpecificMovie = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400);
      throw new Error('Invalid ID format');
    }
    const specificMovie = await moviesModel.findById(id).lean();
    if (!specificMovie) {
      res.status(404);
      throw new Error('Movie not found');
    }
    res.json(specificMovie);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .json({ message: error.message || 'Server error' });
  }
});
const updateMovie = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400);
      throw new Error('Invalid ID format');
    }

    const allowedFields = [
      'name',
      'image',
      'year',
      'genre',
      'details',
      'cast',
      'numReviews',
    ];
    const updateData = Object.keys(req.body)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});
    const updatedMovie = await moviesModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedMovie) {
      res.status(404);
      throw new Error('Movie not found');
    }
    res.json(updatedMovie);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .json({ message: error.message || 'Server error' });
  }
});

const movieReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400);
      throw new Error('Invalid ID format');
    }

    const movie = await moviesModel.findById(id);

    if (movie) {
      const alreadyReviewed = movie.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error('Movie already reviewed');
      }

      const review = {
        user: req.user._id,
        rating: Number(rating),
        comment,
      };
      movie.reviews.push(review);
      movie.numReviews = movie.reviews.length;
      movie.rating =
        movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
        movie.reviews.length;

      await movie.save();
      res.status(201).json({ message: 'Review Added' });
    } else {
      res.status(404);
      throw new Error('Movie not found');
    }
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .json({ message: error.message || 'Server error' });
  }
});

const deleteMovie = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400);
      throw new Error('Invalid ID format');
    }
    const deleteMovie = await moviesModel.findByIdAndDelete(id);

    if (!deleteMovie) {
      res.status(404);
      throw new Error('Movie not found');
    }

    res.status(201).json({ message: 'Movie Deleted Successfully' });
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .json({ message: error.message || 'Server error' });
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  try {
    const { movieId, reviewId } = req.body;
    const movie = await moviesModel.findById(movieId);

    if (!movie) {
      res.status(404);
      throw new Error('Movie not found');
    }

    const reviewIndex = movie.reviews.findIndex(
      (r) => r._id.toString() === reviewId
    );

    console.log(reviewIndex);

    if (reviewIndex === -1) {
      res.status(404);
      throw new Error('Comment not found');
    }

    movie.reviews.splice(reviewIndex, 1);
    movie.numReviews = movie.reviews.length;
    movie.rating =movie.reviews.length > 0? movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
movie.reviews.length: 0;

    await movie.save();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .json({ message: error.message || 'Server error' });
  }
});

const getNewMovies = asyncHandler(async (req, res) => {
  try {
    const newMovies = await moviesModel
      .find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    res.json(newMovies || []);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .json({ message: error.message || 'Server error' });
  }
});

const getTopMovies = asyncHandler(async (req, res) => {
  try {
    const topRatedMovies = await moviesModel
      .find()
      .sort({ numReviews: -1 })
      .limit(10)
      .lean();

    res.json(topRatedMovies);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .json({ message: error.message || 'Server error' });
  }
});
const getRandomMovies = async (req, res) => {
  try {
    const randomMovies = await moviesModel.aggregate([
      { $sample: { size: 10 } },
    ]);
    res.json(randomMovies);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .json({ message: error.message || 'Server error' });
  }
};
export {
  createMovie,
  getAllMovies,
  getSpecificMovie,
  updateMovie,
  movieReview,
  deleteMovie,
  deleteComment,
  getNewMovies,
  getTopMovies,
  getRandomMovies,
};
