import { Link } from 'react-router-dom';
import { useGetAllMoviesQuery } from '../../redux/api/movies.js';

const AdminMoviesList = () => {
  const { data: movies } = useGetAllMoviesQuery();
  return (
    <div className='  w-full min-h-screen flex  justify-center'>
      <div className=' mx-[1rem]'>
        <div className='flex flex-col justify-center items-center md:flex-row'>
          <div className='p-3'>
            <div className='ml-[2rem] text-xl font-bold h-12'>
              All Movies ({movies?.length})
            </div>
            <div className='flex flex-wrap gap-20 justify-center items-center p-[2rem] '>
              {movies?.map((movie) => (
                <div className='flex' key={movie._id}>
                  <div className='max-w-sm m[2rem] rounded overflow-hidden shadow-lg dark:shadow-gray-500/50'>
                    <img
                      src={movie.image}
                      alt={movie.name}
                      className='w-full h-48 object-cover'
                    />
                    <div className='px-4 py-3'>
                      <div className='font-bold text-xl mb-2'>{movie.name}</div>
                    </div>
                    <p className='text-gray-500 text-base px-1'>
                      {movie.details}
                    </p>
                    <div className='mt-[2rem]  mb-[1rem]'>
                      <Link
                        to={`/admin/movies/update/${movie._id}`}
                        className='bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded'
                      >
                        Update Movie
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMoviesList;
