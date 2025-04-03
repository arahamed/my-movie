import { useState } from 'react';
import {
  useCreateGenreMutation,
  useDeleteGenreMutation,
  useGetAllGenresQuery,
  useUpdateGenreMutation,
} from '../../redux/api/genre.js';
import { toast } from 'react-toastify';
import GenreForm from '../../component/GenreForm.jsx';
import Model from '../../component/Model.jsx';
import { setupListeners } from '@reduxjs/toolkit/query';

const GenreList = () => {
  const { data: genres, refetch } = useGetAllGenresQuery();

  const [name, setName] = useState('');
  const [selectedGenre, setSelectedgenre] = useState(null);
  const [updatingName, setUpdatingName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [createGenre] = useCreateGenreMutation();
  const [updateGenre] = useUpdateGenreMutation();
  const [deleteGenre] = useDeleteGenreMutation();
  
  // console.log(error);
  

  const handleCreateGenre = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error('Genre name is required');
      return;
    }
    try {
      const result = await createGenre({ name }).unwrap();

      setName('');
      toast.success(`${result.name} is created`);
    } catch (error) {
      console.error(error);
      toast.error('Creating genre failed , try again');
    }
  };

  const handleUpdateGenre = async (e) => {
    e.preventDefault();

    if (!updatingName) {
      toast.error('Genre name is required');
      return;
    }

    try {
      const result = await updateGenre({
        id: selectedGenre._id,
        updateGenre: {
          name: updatingName,
        },
      }).unwrap();
      toast.success(`${result.name} is updated`);
      setSelectedgenre(null);
      setUpdatingName('');
      setModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteGenre = async () => {
    try {
      const result = await deleteGenre(selectedGenre._id).unwrap();

      toast.success(`${result.name} is deleted`);
      setSelectedgenre(null);
      setUpdatingName('');
      setModalVisible(false);
    } catch (error) {}
  };
  return (
    <div className='ml-[10rem] flex flex-col md:flex-row'>
      <div className='md:w-3/4 p-3'>
        <h1 className='text-3xl mb-4'>Manage Genres</h1>
        <GenreForm
          value={name}
          setValue={setName}
          handleSubmit={handleCreateGenre}
        />

        <br />

        <div className='flex flex-wrap'>
          {genres?.map((genre) => (
            <div key={genre?._id}>
              <button
                className='bg-white border border-teal-500 text-teal-500 py-2 px-4 rounded-lg m-3 hover:bg-teal-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50'
                onClick={() => {
                  setModalVisible(true);
                  setSelectedgenre(genre);
                  setUpdatingName(genre?.name);
                }}
              >
                {genre?.name}
              </button>
            </div>
          ))}
        </div>
        <Model isOpen={modalVisible} onclose={() => setModalVisible(false)}>
          <GenreForm
            value={updatingName}
            setValue={(value) => setUpdatingName(value)}
            handleSubmit={handleUpdateGenre}
            buttonText='update'
            handleDelete={handleDeleteGenre}
          />
        </Model>
      </div>
    </div>
  );
};

export default GenreList;
