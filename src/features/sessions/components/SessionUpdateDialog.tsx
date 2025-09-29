import { RangeSlider } from '@/components';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDurationHM, getShortTime } from '@/lib/utils';
import type { Session } from '@/types';
import React, { useState } from 'react';
import { deleteSession, updateDuration } from '../services/firestoreSession';
import toast from 'react-hot-toast';
import { useConfirm } from '@/providers/ConfirmationContext';

interface ISessionUpdateDialog {
  session: Session | null;
  setSessions: React.Dispatch<React.SetStateAction<Session[] | null>>;
  onClose: () => void;
}

export function SessionUpdateDialog({
  session,
  setSessions,
  onClose,
}: ISessionUpdateDialog) {
  if (!session) return;

  function formatTime(timestamp: number): string {
    const time = getShortTime(timestamp);
    const [, month, day, year] = new Date(timestamp).toDateString().split(' ');
    const date = `${day} ${month} ${year}`;

    return `${time}, ${date}`;
  }

  const { subject, duration, updatedDuration, startTime, updatedAt } = session;
  const [newDuration, setNewDuration] = useState(
    session.updatedDuration || session.duration
  );
  const confirm = useConfirm();

  function handleChange(_: Event, value: number | number[]): void {
    setNewDuration(Number(value));
  }

  async function handleUpdate() {
    if (!session) return;
    try {
      await updateDuration(session, newDuration);

      setSessions((prev) => {
        if (!prev) return prev;
        const newSessions = prev.map((s) =>
          s.startTime == session.startTime
            ? { ...s, updatedDuration: newDuration, updatedAt: Date.now() }
            : s
        );
        return newSessions;
      });

      toast.success('Duration updated successfully.');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      onClose();
    }
  }

  function handleDelete() {
    const handler = async () => {
      if (!session) return;
      try {
        await deleteSession(session);

        setSessions((prev) => {
          if (!prev) return prev;
          const newSessions = prev.filter(
            (s) => s.startTime != session.startTime
          );
          return newSessions;
        });

        toast.success('Session deleted successfully.');
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        onClose();
      }
    };

    confirm(handler, {
      message: 'This session will not be recovered after this action.',
      variant: 'destructive',
    });
  }

  return (
    <Dialog
      open={Boolean(session)}
      onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Leaved session unintentionally?</DialogTitle>
          <DialogDescription>
            Adjust duration of saved session.
          </DialogDescription>
        </DialogHeader>

        <div>
          <div className="grid grid-cols-2">
            <span className="font-medium">Subject:</span>
            <span className="text-muted-foreground">{subject}</span>
            <span className="font-medium">Start time:</span>
            <span className="text-muted-foreground">{`${formatTime(
              startTime
            )}`}</span>
            {updatedAt && (
              <>
                <span className="font-medium">Last updated at:</span>
                <span className="text-muted-foreground">{`${formatTime(
                  updatedAt
                )}`}</span>
              </>
            )}
            <label
              htmlFor="duration-input"
              className="font-medium">
              Duration:
            </label>
            <span className="text-muted-foreground tabular-nums">
              {formatDurationHM(newDuration)}
            </span>
          </div>
          <RangeSlider
            id="duration-input"
            valueLabelDisplay="auto"
            defaultValue={updatedDuration || duration}
            onChange={handleChange}
            min={1}
            max={duration}
            aria-valuemin={1}
            aria-valuemax={duration}
            aria-valuenow={newDuration}
            aria-label="Session duration in minutes"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>{formatDurationHM(1)}</span>
            <span>{formatDurationHM(duration)}</span>
          </div>
        </div>

        {/* Action buttons */}
        <DialogFooter className="flex flex-row justify-between">
          <button
            onClick={handleDelete}
            className="border bg-destructive text-card px-5 py-2 rounded-full font-medium">
            Delete Session
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
