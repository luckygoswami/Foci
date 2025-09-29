import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { updateUser } from '@/features/user';
import toast from 'react-hot-toast';
import { useState } from 'react';
import type { FirebaseUserId } from '@/types';
import { formatDurationHM } from '@/lib/utils';
import { RangeSlider } from '@/components';

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

  function handleChange(_: Event, value: number | number[]) {
    setNewTarget(Number(value));
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
              className="font-medium">
              Daily Target
            </label>
            <span className="text-slate-600 tabular-nums">
              {formatDurationHM(newTarget)}
            </span>
          </div>
          <RangeSlider
            id="dailyTarget-input"
            valueLabelDisplay="auto"
            value={newTarget}
            onChange={handleChange}
            min={DAILY_MIN}
            max={DAILY_MAX}
            step={5}
            aria-valuemin={DAILY_MIN}
            aria-valuemax={DAILY_MAX}
            aria-valuenow={newTarget}
            aria-label="Daily study target in minutes"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>{formatDurationHM(DAILY_MIN)}</span>
            <span>{formatDurationHM(DAILY_MAX)}</span>
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-between">
          <button
            onClick={onClose}
            className="border border-muted-foreground/70 text-muted-foreground/70 px-5 py-2 rounded-full font-medium">
            Maybe Later
          </button>
          <button
            onClick={handleUpdate}
            className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-medium disabled:bg-muted-foreground/30">
            Update
          </button>
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

  function handleChange(_: Event, value: number | number[]) {
    setNewTarget(Number(value));
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
              htmlFor="weeklyTarget-input"
              className="font-medium">
              Weekly Target
            </label>
            <span className="text-slate-600 tabular-nums">
              {formatDurationHM(newTarget)}
            </span>
          </div>
          <RangeSlider
            id="weeklyTarget-input"
            valueLabelDisplay="auto"
            value={newTarget}
            onChange={handleChange}
            min={WEEKLY_MIN}
            max={WEEKLY_MAX}
            step={30}
            aria-valuemin={WEEKLY_MIN}
            aria-valuemax={WEEKLY_MAX}
            aria-valuenow={newTarget}
            aria-label="Weekly study target in minutes"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>{formatDurationHM(WEEKLY_MIN)}</span>
            <span>{formatDurationHM(WEEKLY_MAX)}</span>
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-between">
          <button
            onClick={onClose}
            className="border border-muted-foreground/70 text-muted-foreground/70 px-5 py-2 rounded-full font-medium">
            Maybe Later
          </button>
          <button
            onClick={handleUpdate}
            className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-medium disabled:bg-muted-foreground/30">
            Update
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
