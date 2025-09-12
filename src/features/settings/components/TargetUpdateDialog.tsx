import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { updateUser } from '@/features/user';
import toast from 'react-hot-toast';
import { useState } from 'react';
import type { FirebaseUserId } from '@/types';
import { formatDurationHM } from '@/lib/utils';

const DAILY_MIN = 15;
const DAILY_MAX = 1200;

const WEEKLY_MIN = 90;
const WEEKLY_MAX = 8400;

export function DailyTargetDialog({
  isOpen,
  onClose,
  currentTarget,
  userId,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentTarget: number;
  userId: FirebaseUserId;
  onSuccess: (target: number) => void;
}) {
  const [newTarget, setNewTarget] = useState(currentTarget);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewTarget(Number(e.target.value));
  }

  async function handleUpdate() {
    try {
      await updateUser(userId, {
        dailyTargetMinutes: newTarget,
      });
      toast.success('Daily Target Updated.');
      onSuccess(newTarget);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      onClose();
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ready for a New Goal?</DialogTitle>
          <DialogDescription>Update your Daily Target</DialogDescription>
        </DialogHeader>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="dailyTarget-input"
              className="text-sm font-medium">
              Daily Target
            </label>
            <span className="text-sm text-slate-600 tabular-nums">
              {formatDurationHM(newTarget)}
            </span>
          </div>
          <input
            id="dailyTarget-input"
            type="range"
            min={DAILY_MIN}
            max={DAILY_MAX}
            step={5}
            defaultValue={currentTarget}
            onChange={handleChange}
            className="mt-2 w-full accent"
            aria-valuemin={DAILY_MIN}
            aria-valuemax={DAILY_MAX}
            aria-valuenow={currentTarget}
            aria-label="Daily study target in minutes"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-500">
            <span>{formatDurationHM(DAILY_MIN)}</span>
            <span>{formatDurationHM(DAILY_MAX)}</span>
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-end">
          <Button
            variant="outline"
            className="hover:bg-card-hover"
            onClick={onClose}>
            Maybe Later
          </Button>
          <Button
            className="hover:bg-primary-hover"
            onClick={handleUpdate}>
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function WeeklyTargetDialog({
  isOpen,
  onClose,
  currentTarget,
  userId,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentTarget: number;
  userId: FirebaseUserId;
  onSuccess: (target: number) => void;
}) {
  const [newTarget, setNewTarget] = useState(currentTarget);

  async function handleUpdate() {
    try {
      updateUser(userId, {
        weeklyTargetMinutes: newTarget,
      });
      toast.success('Weekly Target Updated.');

      onSuccess(newTarget);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      onClose();
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewTarget(Number(e.target.value));
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ready for a New Goal?</DialogTitle>
          <DialogDescription>Update your Weekly Target</DialogDescription>
        </DialogHeader>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="dailyTarget-input"
              className="text-sm font-medium">
              Weekly Target
            </label>
            <span className="text-sm text-slate-600 tabular-nums">
              {formatDurationHM(newTarget)}
            </span>
          </div>
          <input
            id="dailyTarget-input"
            type="range"
            min={WEEKLY_MIN}
            max={WEEKLY_MAX}
            step={30}
            defaultValue={currentTarget}
            onChange={handleChange}
            className="mt-2 w-full accent"
            aria-valuemin={WEEKLY_MIN}
            aria-valuemax={WEEKLY_MAX}
            aria-valuenow={currentTarget}
            aria-label="Daily study target in minutes"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-500">
            <span>{formatDurationHM(WEEKLY_MIN)}</span>
            <span>{formatDurationHM(WEEKLY_MAX)}</span>
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-end">
          <Button
            variant="outline"
            className="hover:bg-card-hover"
            onClick={onClose}>
            Maybe Later
          </Button>
          <Button
            className="hover:bg-primary-hover"
            onClick={handleUpdate}>
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
