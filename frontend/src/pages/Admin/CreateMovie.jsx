import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useCreateMovieMutation,
  useUploadImageMutation,
} from '../../redux/api/movies.js';
import { useGetAllGenresQuery } from '../../redux/api/genre.js';
import { toast } from 'react-toastify';

const CreateMovie = () => {
  const navigate = useNavigate();

  const [movieData, setMovieData] = useState({
    name: '',
    year: 0,
    genre: '',
    details: '',
    cast: [],
  });

  const [selectedImage, setSelectedImage] = useState(null);

  const [createMovie, { isLoading: isCreatingMovie, error: createMovieError }] =
    useCreateMovieMutation();

  

  const [
    uploadImage,
    { isLoading: isUploadingImage, error: uploadImageError },
  ] = useUploadImageMutation();
  const { data: genres, isLoading: isloadingGenres } = useGetAllGenresQuery();

  useEffect(() => {
    if (genres) {
      setMovieData((prevData) => ({
        ...prevData,
        genre: genres[0]?._id || '',
      }));
      console.log(genres[0]?._id);
    }
  }, [genres]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'genre') {
      const selectedGenre = genres.find((genre) => genre.name === value);

      setMovieData((prevData) => ({
        ...prevData,
        genre: selectedGenre ? selectedGenre._id : '',
      }));
    } else {
      setMovieData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleCreateMovie = async (e) => {
    e.preventDefault()
    try {
      if (
        !movieData.name ||
        !movieData.details ||
        !movieData.cast ||
        !selectedImage
      ) {
        toast.error('Please fill all required fields');
        return;
      }
      let uploadedImagePath = null;
     
      

      if (selectedImage) {
        const formData = new FormData();
        formData.append('image', selectedImage);
        const uploadedImageResponse = await uploadImage(formData);

        if (uploadedImageResponse.data) {
          uploadedImagePath = uploadedImageResponse.data.image;
        } else {
          console.error('Failed to upload image: ', uploadImageError);
          toast.error('Failed to upload image');
        }

        await createMovie({
          ...movieData,
          image: uploadedImagePath,
        });
        navigate('/admin/movies/movielist');
        
        setMovieData({
          name: '',
          year: 0,
          genre: '',
          details: '',
          cast: [],
        });
        setSelectedImage(null);
      }
      toast.success('Movie created');
      
    } catch (error) {
      console.error('Failed to create movie: ', createMovieError);
      toast.error(`Failed to create movie : ${createMovieError?.message}`);
    }
  };
  return (
    <div className='flex justify-center items-center mt-4 '>
      <form onSubmit={handleCreateMovie}>
        <p className='text-green-200 w-[50rem] text-2xl mb-4'>Create Movie</p>
        <div className='mb-4'>
          <label className='block'>
            Name:
            <input
              type='text'
              name='name'
              required
              value={movieData.name}
              onChange={handleChange}
              className='border px-2 py-1 w-full rounded-md'
            />
          </label>
        </div>
        <div className='mb-4'>
          <label className='block'>
            Year:
            <input
              type='number'
              name='year'
              required
              value={movieData.year}
              onChange={handleChange}
              className='border px-2 py-1 w-full rounded-md'
            />
          </label>
        </div>
        <div className='mb-4'>
          <label className='block'>
            Genre:
            <select
              name='genre'
              required
              value={
                genres?.find((genre) => genre._id === movieData.genre)?.name ||
                ''
              }
              onChange={handleChange}
              className='border px-2 py-1 w-full text-black rounded-md'
            >
              {genres?.map((genre) => (
                <option key={genre._id} value={genre.name}>
                  {genre.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className='mb-4'>
          <label className='block'>
            Details:
            <textarea
              name='details'
              required
              value={movieData.details}
              onChange={handleChange}
              className='border px-2 py-1 w-full text-black rounded-md'
            />
          </label>
        </div>
        <div className='mb-4'>
          <label className='block'>
            Cast (comma-separated):
            <input
              type='text'
              name='cast'
              required
              value={movieData.cast.join(', ')}
              onChange={(e) =>
                setMovieData((prevData) => ({
                  ...prevData,
                  cast: e.target.value.split(',').map((item) => item.trim()),
                }))
              }
              className='border px-2 py-1 w-full rounded-md'
            />
          </label>
        </div>
        <div className='mb-4'>
          <label className='block'>
            Image:
            <input
              type='file'
              required
              accept='image/*'
              onChange={handleImageChange}
              className='border px-2 py-1 w-full rounded-md'
            />
          </label>
        </div>
        <div className='flex justify-end'>
          <button
            type='submit'
            disabled={isCreatingMovie || isUploadingImage}
            className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50'
          >
            {isCreatingMovie || isUploadingImage
              ? 'Submitting...'
              : 'Create Movie'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMovie;
