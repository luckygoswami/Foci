import { useState } from 'react';
import { DailyTargetDialog, WeeklyTargetDialog } from './TargetUpdateDialog';
import { useUserData } from '@/features/user';
import { formatDurationHM } from '@/lib/utils';

export function TargetGoals() {
  const { userData, setUserData } = useUserData();
  const { userId, dailyTargetMinutes, weeklyTargetMinutes } = userData!;
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
      <div className="rounded-md bg-card shadow-sm p-4 text-foreground">
        <div className="px-2 mb-4">
          <h1 className="font-semibold text-xl">Goals</h1>
          <p className="text-muted-foreground text-sm">
            Set your daily and weekly targets
          </p>
        </div>
        <div className="divide-y-1 divide-muted">
          {/* Daily Target */}
          <div className="flex justify-between items-center py-2">
            <label className="font-medium">Daily</label>
            <div
              className="flex items-center text-muted-foreground max-w-[65%] truncate"
              onClick={() => setDialogOpen('daily')}>
              <p>{formatDurationHM(dailyTargetMinutes)}</p>
              <span className="text-2xl">&nbsp;&gt;</span>
            </div>
          </div>

          {/* Weekly Target */}
          <div className="flex justify-between items-center py-2">
            <label className="font-medium">Weekly</label>
            <div
              className="flex items-center text-muted-foreground max-w-[65%] truncate"
              onClick={() => setDialogOpen('weekly')}>
              <p>{formatDurationHM(weeklyTargetMinutes)}</p>
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
