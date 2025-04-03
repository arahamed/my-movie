import apiSlice from './apiSlice.js';

import { MOVIE_URL, UPLOAD_URL } from '../constants.js';


export const moviesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllMovies: builder.query({
      query: () => `${MOVIE_URL}/all-movies`,
      providesTags: ['movie'],
    }),
    createMovie: builder.mutation({
      query: (newMovie) => ({
        url: `${MOVIE_URL}/create-movie`,
        method: 'POST',
        body: newMovie,
      }),
      invalidatesTags: ['movie'],
    }),
    updateMovie: builder.mutation({
      query: ({ id, updateMovie }) => ({
        url: `${MOVIE_URL}/update-movie/${id}`,
        method: `PUT`,
        body: updateMovie,
      }),
      invalidatesTags: ['movie'],
    }),
    addMovieReview: builder.mutation({
      query: ({ id, rating, comment }) => ({
        url: `${MOVIE_URL}/${id}/reviews`,
        method: 'POST',
        body: { id, rating, comment },
      }),
      invalidatesTags: ['movie'],
    }),
    deleteComment: builder.mutation({
      query: ({ movieId, reviewId }) => ({
        url: `${MOVIE_URL}/delete-comment`,
        method: 'DELETE',
        body: { movieId, reviewId },
      }),
      invalidatesTags: ['movie'],
    }),
    deleteMovie: builder.mutation({
      query: (id) => ({
        url: `${MOVIE_URL}/delete-movie/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['movie'],
    }),
    getSpecificMovie: builder.query({
      query: (id) => `${MOVIE_URL}/specific-movie/${id}`,
      providesTags: ['movie'],
    }),
    uploadImage: builder.mutation({
      query: (formData) => ({
        url: `${UPLOAD_URL}`,
        method: 'POST',
        body: formData,
      }),
    }),
    getNewMovies: builder.query({
      query: () => `${MOVIE_URL}/new-movies`,
      providesTags: ['movie'],
    }),
    getTopMovies: builder.query({
      query: () => `${MOVIE_URL}/top-movies`,
    }),
    getRandomMovies: builder.query({
      query: () => `${MOVIE_URL}/random-movies`,
    }),
  }),
});

export const {
  useGetAllMoviesQuery,
  useCreateMovieMutation,
  useUpdateMovieMutation,
  useAddMovieReviewMutation,
  useDeleteCommentMutation,
  useGetSpecificMovieQuery,
  useUploadImageMutation,
  useDeleteMovieMutation,

  useGetNewMoviesQuery,
  useGetTopMoviesQuery,
  useGetRandomMoviesQuery
} = moviesApiSlice;