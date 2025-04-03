const Model = ({ isOpen, onclose, children }) => {
  return (
    <>
      {isOpen && (
        <div className='fixed inset-0 flex items-center justify-center z-40'>
          <div className='fixed inset-0 bg-black opacity-50'></div>
          <div className='absolute top-[40%] left-[20%] bg-white p-4 rounded-lg z-10 text-right '>
            <button
              className='text-black font-semibold hover:text-gray-700 focus:outline-none mr-2'
              onClick={onclose}
            >
              X
            </button>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Model;
