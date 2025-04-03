import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  useDeleteMovieMutation,
  useGetSpecificMovieQuery,
  useUpdateMovieMutation,
  useUploadImageMutation,
} from '../../redux/api/movies.js';

const UpdateMovie = () => {
  return <div>UpdateMovie</div>;
};

export default UpdateMovie;
