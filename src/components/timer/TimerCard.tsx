import { getEffectiveDuration } from '@/features/sessions';
import { formatDuration } from '@/lib/utils';
import type { CurrentSession } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { TimerButton } from './TimerButton';

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

export function TimerCard({
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
    <div className="flex flex-col items-center justify-around w-full h-[15rem] rounded-2xl p-5 gradient-background">
      <div className="font-extrabold text-6xl text-accent-foreground tracking-wide mb-3.5">
        {formatDuration(time)}
      </div>
      <p className="text-card/90 font-semibold mb-1 truncate max-w-[90%]">
        {!isRunning
          ? 'Ready to focus'
          : `Need a break from ${currentSession?.subject}`}
        ?
      </p>
      {size == 'lg' && (
        // Action buttons
        <div className="flex flex-col gap-3">
          {/*  */}
          {isRunning ? (
            <TimerButton
              text="Pause"
              clickHandler={handlePause}
            />
          ) : sessionStarted ? (
            <TimerButton
              text="Resume"
              clickHandler={handleResume}
            />
          ) : (
            <TimerButton
              text="Start"
              clickHandler={handleStart}
            />
          )}
          {sessionStarted && (
            <TimerButton
              text="End"
              clickHandler={handleEnd}
            />
          )}
        </div>
      )}
    </div>
  );
}
