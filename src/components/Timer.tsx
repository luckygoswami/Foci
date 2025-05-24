import React, { useEffect, useRef, useState } from 'react';

interface TimerProps {
  initialTime?: number; // in seconds
  autoStart?: boolean;
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

const Timer: React.FC<TimerProps> = ({
  initialTime = 0,
  autoStart = false,
}) => {
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
      <div className="text-6xl font-extrabold jetBrains">
        {formatTime(time)}
      </div>
      {!autoStart && (
        <div className="flex space-x-2">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-4 py-1 bg-blue-500 text-white rounded">
              Start
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-4 py-1 bg-yellow-500 text-white rounded">
              Pause
            </button>
          )}
          <button
            onClick={handleReset}
            className="px-4 py-1 bg-gray-500 text-white rounded">
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default Timer;
