import { getEffectiveDuration } from '@/features/sessions';
import { formatDuration } from '@/lib/utils';
import type { CurrentSession } from '@/types';
import { useEffect, useRef, useState } from 'react';

interface TimerProps {
  initialTime: number; // in seconds
  autoStart: boolean;
  size: 'lg' | 'sm';
  onStart?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onEnd?: () => void;
  on60s?: () => void;
  setSubjectDialog?: (s: boolean) => void;
  selectedSubject?: string | null;
  currentSession?: CurrentSession | null;
}

export function Timer({
  initialTime,
  autoStart,
  size,
  onStart,
  onPause,
  onResume,
  onEnd,
  on60s,
  setSubjectDialog,
  selectedSubject,
  currentSession,
}: TimerProps) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(!!initialTime);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [streakUpdated, setStreakUpdated] = useState(false);

  useEffect(() => {
    if (initialTime) {
      setTime(initialTime);
      setIsRunning(autoStart);
      setSessionStarted(true);
      return;
    }

    if (!sessionStarted) return;

    setTime(0);
    setIsRunning(autoStart);
    setSessionStarted(autoStart);
  }, [initialTime, autoStart]);

  useEffect(() => {
    if (!isRunning || !currentSession) return;

    intervalRef.current = setInterval(() => {
      setTime(getEffectiveDuration(currentSession));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, currentSession]);

  useEffect(() => {
    if (selectedSubject && !sessionStarted) {
      setIsRunning(true);
      setSessionStarted(true);
      onStart?.();
    }
  }, [selectedSubject]);

  useEffect(() => {
    if (!streakUpdated && time >= 60) {
      on60s?.();
      setStreakUpdated(true);
    }
  }, [time]);

  const handleStart = () => {
    setStreakUpdated(false);
    setSubjectDialog?.(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    onPause?.();
  };

  const handleResume = () => {
    setIsRunning(true);
    onResume?.();
  };

  const handleEnd = () => {
    setTime(0);
    setIsRunning(false);
    setSessionStarted(false);
    setStreakUpdated(false);
    onEnd?.();
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className={`${size == 'lg' && 'text-6xl'} font-extrabold jetBrains`}>
        {formatDuration(time)}
      </div>
      {size == 'lg' && (
        <div className="btn-container flex w-full space-x-2">
          {/*  */}
          {isRunning ? (
            <button
              className="px-4 py-2 grow bg-blue-500 text-white rounded"
              onClick={handlePause}>
              Pause
            </button>
          ) : (
            <button
              className="px-4 py-2 grow bg-blue-500 text-white rounded"
              onClick={sessionStarted ? handleResume : handleStart}>
              {!sessionStarted ? 'Start' : 'Resume'}
            </button>
          )}
          {sessionStarted && (
            <button
              onClick={handleEnd}
              className="px-4 py-2 grow bg-gray-500 text-2x text-white rounded">
              End
            </button>
          )}
        </div>
      )}
    </div>
  );
}
