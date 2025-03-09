import { GENRE_URL } from '../constants.js';
import apiSlice from './apiSlice.js';

export const genreApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createGenre: builder.mutation({
      query: (body) => ({
        url: `${GENRE_URL}/`,
        method: 'POST',
        body,
      }),
    }),
    getAllGenres: builder.query({
      query: () => `${GENRE_URL}/genres`,
    }),
    updateGenre: builder.mutation({
      query: ({ id, body }) => ({
        url: `${GENRE_URL}/${id}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteGenre: builder.mutation({
      query: (id) => ({
        url: `${GENRE_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
    getGenre: builder.query({
      query: (id) => `${GENRE_URL}/${id}`,
    }),
  }),
});

export const {
  useCreateGenreMutation,
  useUpdateGenreMutation,
  useDeleteGenreMutation,
  useGetAllGenresQuery,
  useGetGenreQuery,
} = genreApiSlice;
