import { GoalProgress, SubjectTimeDistributionChart } from '@/features/charts';
import { Header, TimerCard } from '@/components';
import { useCallback, useEffect, useState } from 'react';
import {
  endSession,
  pauseSession,
  removeLocalSession,
  resumeSession,
  sessionExistsInFirestore,
  startSession,
  useCurrentSession,
  getEffectiveDuration,
  SubjectDialog,
} from '@/features/sessions';
import { useOnlineStatus } from '@/features/connection';
import toast from 'react-hot-toast';
import { useUserData } from '@/features/user';
import { updateStreakIfNeeded } from '@/features/streaks';
import type { Subject } from '@/types';
import { Link } from 'react-router-dom';

export default function HomeDashboard() {
  const { userData, setUserData } = useUserData();
  const { userId, subjects } = userData!;
  const { session: currentSession, setSession: setCurrentSession } =
    useCurrentSession();
  const [autoStart, setAutoStart] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [subjectDialog, setSubjectDialog] = useState(false);
  const [initialTime, setInitialTime] = useState(0);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (!currentSession) {
      setInitialTime(0);
      setAutoStart(false);
      return;
    }

    const effectiveDuration = getEffectiveDuration(currentSession);
    setInitialTime(effectiveDuration);
    setAutoStart(!currentSession.paused);
  }, [currentSession]);

  const handleSessionAction = useCallback(
    async (action: 'pause' | 'resume') => {
      if (!currentSession) return;

      try {
        if (isOnline) {
          const exists = await sessionExistsInFirestore(
            userId,
            currentSession.startTime
          );
          if (exists) {
            setCurrentSession(null);
            removeLocalSession();
            toast.error('Session ended from another device.');
            return;
          }
        }

        const handler = action === 'pause' ? pauseSession : resumeSession;
        const session = await handler(userId, currentSession);
        setCurrentSession(session);
      } catch (err: any) {
        toast.error(err.message);
      }
    },
    [currentSession, isOnline, userId, setCurrentSession]
  );

  const handleStart = useCallback(async () => {
    if (!selectedSubject) {
      toast.error('Subject not selected.');
      return;
    }

    try {
      const session = await startSession(userId, selectedSubject);
      setCurrentSession(session);
    } catch (err: any) {
      toast.error(err.message);
    }
  }, [userId, selectedSubject, setCurrentSession]);

  const handleEnd = useCallback(async () => {
    if (!currentSession) return;

    try {
      endSession(userId, currentSession);
      setSelectedSubject(null);
      setCurrentSession(null);
      toast.success('Session completed.');
    } catch (err: any) {
      toast.error(err.message);
    }
  }, [currentSession, userId, setCurrentSession]);

  function handle60sUpdate(): void {
    if (!currentSession) return;
    updateStreakIfNeeded(userId, currentSession?.startTime)
      .then((res) => {
        if (res) {
          setUserData((prev) => {
            if (prev)
              return {
                ...prev,
                streak: {
                  ...res,
                },
              };
          });
        }
      })
      .catch((err) => toast.error(err.message));
  }

  return (
    <div
      role="region"
      aria-label="Home Dashboard"
      className="flex flex-col">
      <Header />
      <div className="flex-1 overflow-hidden flex flex-col p-5 gap-3">
        {/* Timer */}
        <div className="flex-[1.5] w-full overflow-y-scroll">
          <TimerCard
            initialTime={initialTime}
            autoStart={autoStart}
            size="lg"
            onStart={handleStart}
            onPause={() => handleSessionAction('pause')}
            onResume={() => handleSessionAction('resume')}
            onEnd={handleEnd}
            on60s={handle60sUpdate}
            setSubjectDialog={setSubjectDialog}
            selectedSubject={selectedSubject}
            currentSession={currentSession}
          />
          <SubjectDialog
            onSelect={setSelectedSubject}
            open={subjectDialog}
            setOpen={setSubjectDialog}
            subjects={subjects}
          />
        </div>
        {/* Progress charts */}
        <div className="flex-[3.25] overflow-y-scroll flex items-left flex-col px-5 rounded-2xl shadow-sm">
          <div className="flex items-baseline justify-between">
            <h1 className="text-2xl font-bold text-foreground mt-2">
              Activity Trends
            </h1>
            <Link
              to="/app/progress/insights"
              className="text-primary font-semibold text-lg cursor-pointer">
              Insights&gt;
            </Link>
          </div>
          <div className="w-full size-56 mb-2">
            <SubjectTimeDistributionChart
              userId={userId}
              subjects={subjects}
            />
          </div>
          <div className="flex w-full justify-between">
            <div className="size-40">
              <GoalProgress
                target="daily"
                userData={userData}
              />
            </div>
            <div className="size-40">
              <GoalProgress
                target="weekly"
                userData={userData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
