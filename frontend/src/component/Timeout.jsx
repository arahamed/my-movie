import React, { useState, useEffect } from 'react';

const Timeout = () => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    if (timeLeft === 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div>
      <h1 className='font-medium'>
        Time Left:{' '}
        <span className={`${timeLeft <= 290 ? 'text-red-500' : ''}`}>
          {formatTime(timeLeft)}
        </span>
      </h1>
    </div>
  );
};

export default Timeout;
