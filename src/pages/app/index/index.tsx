import {
  DailyGoalChart,
  SubjectDistributionChart,
  WeeklyGoalChart,
} from '@/features/charts';
import Timer from '@/components/Timer';
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
import { toast } from 'react-toastify';
import { useUserData } from '@/features/user';

function Home() {
  const { userData } = useUserData();
  const userId = userData!.userId;
  const {
    session: currentSession,
    setSession: setCurrentSession,
    loading: sessionLoading,
  } = useCurrentSession();
  const [autoStart, setAutoStart] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
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
            toast.error('This session is already ended from another device.');
            return;
          }
        }

        const handler = action === 'pause' ? pauseSession : resumeSession;
        const session = await handler(userId, currentSession);
        setCurrentSession(session);
      } catch (error) {
        toast.error(`Failed to ${action} session`);
        console.error(error);
      }
    },
    [currentSession, isOnline, userId, setCurrentSession]
  );

  const handleStart = useCallback(async () => {
    if (!selectedSubject) {
      toast.error('Please select the Subjetct first.');
      return;
    }
    try {
      const session = await startSession(userId, selectedSubject);
      setCurrentSession(session);
    } catch (error) {
      toast.error('Failed to start session');
      console.error(error);
    }
  }, [userId, selectedSubject, setCurrentSession]);

  const handleEnd = useCallback(async () => {
    if (!currentSession) return;

    try {
      await endSession(userId, currentSession);
      setCurrentSession(null);
      toast.success('Session ended!');
    } catch (error) {
      toast.error('Failed to end session');
      console.error(error);
    }
  }, [currentSession, userId, setCurrentSession]);

  return (
    <main className="flex flex-col px-2 gap-5">
      <div className="flex-[1] flex justify-center items-center p-2 border-x border-b border-black rounded-br-4xl rounded-bl-4xl">
        {sessionLoading ? (
          <span className="animate-pulse text-lg">Loading session...</span>
        ) : (
          <Timer
            initialTime={initialTime}
            autoStart={autoStart}
            size="lg"
            onStart={handleStart}
            onPause={() => handleSessionAction('pause')}
            onResume={() => handleSessionAction('resume')}
            onEnd={handleEnd}
            setSubjectDialog={setSubjectDialog}
            selectedSubject={selectedSubject}
            currentSession={currentSession}
          />
        )}
        <SubjectDialog
          onSelect={setSelectedSubject}
          open={subjectDialog}
          setOpen={setSubjectDialog}
          subjects={userData?.subjects}
        />
      </div>
      <div className="flex-[2.5] flex justify-evenly items-center p-1 flex-col border-x border-t border-black rounded-tr-4xl rounded-tl-4xl">
        <div className="flex-[1.5] min-w-full">
          <SubjectDistributionChart />
        </div>
        <div className="flex-[1] flex min-w-full justify-between">
          <div className="size-40">
            {!userData ? (
              <div>loading...</div>
            ) : (
              <DailyGoalChart userData={userData} />
            )}
          </div>
          <div className="size-40">
            {!userData ? (
              <div>loading...</div>
            ) : (
              <WeeklyGoalChart userData={userData} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
