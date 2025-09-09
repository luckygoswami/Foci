import { useAuth } from '@/features/auth';
import type { FirebaseUserId, UserData } from '@/types';
import { useState } from 'react';
import { DailyTargetDialog, WeeklyTargetDialog } from './TargetUpdateDialog';
import { useUserData } from '@/features/user';

export function TargetGoals({
  dailyTargetMinutes,
  weeklyTargetMinutes,
}: Pick<UserData, 'dailyTargetMinutes' | 'weeklyTargetMinutes'>) {
  const { setUserData } = useUserData();
  const userId = useAuth().user?.uid as FirebaseUserId;
  const [dialogOpen, setDialogOpen] = useState<'daily' | 'weekly' | false>(
    false
  );

  function updateDailyTarget(target: number) {
    setUserData((prev) => {
      return {
        ...prev!,
        dailyTargetMinutes: target,
      };
    });
  }

  function updateWeeklyTarget(target: number) {
    setUserData((prev) => {
      return {
        ...prev!,
        weeklyTargetMinutes: target,
      };
    });
  }

  return (
    <>
      <div className="rounded-md bg-card shadow-sm p-5 text-foreground">
        <div className="px-2 mb-4">
          <h1 className="font-semibold text-2xl">Goals</h1>
          <p className="text-muted-foreground">
            Set your daily and weekly study targets
          </p>
        </div>
        <div className="divide-y-1 divide-muted">
          {/* Daily Target */}
          <div className="flex justify-between py-3 text-lg">
            <label className="font-medium">Daily</label>
            <div
              className="flex items-center text-muted-foreground max-w-[65%] truncate"
              onClick={() => setDialogOpen('daily')}>
              <p>{dailyTargetMinutes} minutes</p>
              <span className="text-2xl">&nbsp;&gt;</span>
            </div>
          </div>

          {/* Weekly Target */}
          <div className="flex justify-between py-3 text-lg">
            <label className="font-medium">Weekly</label>
            <div
              className="flex items-center text-muted-foreground max-w-[65%] truncate"
              onClick={() => setDialogOpen('weekly')}>
              <p>{weeklyTargetMinutes} minutes</p>
              <span className="text-2xl">&nbsp;&gt;</span>
            </div>
          </div>
        </div>
      </div>

      <DailyTargetDialog
        isOpen={dialogOpen == 'daily'}
        onClose={() => setDialogOpen(false)}
        currentTarget={dailyTargetMinutes}
        userId={userId}
        onSuccess={updateDailyTarget}
      />
      <WeeklyTargetDialog
        isOpen={dialogOpen == 'weekly'}
        onClose={() => setDialogOpen(false)}
        currentTarget={weeklyTargetMinutes}
        userId={userId}
        onSuccess={updateWeeklyTarget}
      />
    </>
  );
}
