import { GENRE_URL } from '../constants.js';
import apiSlice from './apiSlice.js';

export const genreApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createGenre: builder.mutation({
      query: (body) => ({
        url: `${GENRE_URL}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Genre'],
    }),
    getAllGenres: builder.query({
      query: () => `${GENRE_URL}`,
      providesTags: ['Genre'],
    }),
    updateGenre: builder.mutation({
      query: ({ id, updateGenre }) => ({
        url: `${GENRE_URL}/${id}`,
        method: 'PUT',
        body: updateGenre,
      }),
      invalidatesTags: ['Genre'],
    }),
    deleteGenre: builder.mutation({
      query: (id) => ({
        url: `${GENRE_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Genre'],
    }),
    getGenre: builder.query({
      query: (id) => `${GENRE_URL}/${id}`,
      providesTags: ['Genre'],
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
