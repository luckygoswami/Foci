import React, { useEffect, useRef, useState } from 'react';

interface TimerProps {
  initialTime?: number; // in seconds
  autoStart?: boolean;
  size: 'big' | 'small';
}

const formatTime = (totalSeconds: number) => {
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
    2,
    '0'
  );
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const Timer: React.FC<TimerProps> = ({ initialTime = 0, autoStart, size }) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className={`${size == 'big' && 'text-6xl'} font-extrabold jetBrains`}>
        {formatTime(time)}
      </div>
      {size == 'big' && (
        <div className="btn-container flex w-full space-x-2">
          <button
            className="px-4 py-2 grow bg-blue-500 text-white rounded"
            onClick={isRunning ? handlePause : handleStart}>
            {!isRunning ? 'Start' : 'Pause'}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 grow bg-gray-500 text-2x text-white rounded">
            End
          </button>
        </div>
      )}
    </div>
  );
};

export default Timer;
