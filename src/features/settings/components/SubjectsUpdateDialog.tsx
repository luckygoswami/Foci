import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { updateUser } from '@/features/user';
import type { FirebaseUserId } from '@/types';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function SubjectsUpdateDialog({
  isOpen,
  onClose,
  currentSubjects,
  userId,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentSubjects: string[];
  userId: FirebaseUserId;
  onSuccess: (sbjs: string[]) => void;
}) {
  const userSubjects = currentSubjects.filter((s) => s != 'study');
  const [newSubjects, setNewSubjects] = useState(userSubjects);
  const [subjectInput, setSubjectInput] = useState('');

  async function handleUpdate() {
    if (!newSubjects.length) {
      toast.error('Add atleast one subject.');
      return;
    }

    try {
      updateUser(userId, {
        subjects: newSubjects,
      });
      toast.success('New subjects added.');
      onSuccess(newSubjects);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      onClose();
    }
  }

  function addSubject() {
    let isDefault = subjectInput.toLowerCase() == 'study';
    let isDuplicate = newSubjects.find(
      (s) => s.toLowerCase() == subjectInput.toLowerCase()
    );

    if (isDefault || isDuplicate) {
      setSubjectInput('');
      return;
    }
    setNewSubjects((prev) => {
      return [...prev, subjectInput];
    });
    setSubjectInput('');
  }

  function removeSubject(sub: string) {
    const subjArray = newSubjects.filter((s) => s != sub);
    setNewSubjects(subjArray);
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Wanna add new subjects?</DialogTitle>
          <DialogDescription>Update your subjects</DialogDescription>
        </DialogHeader>

        <div>
          <div className="mt-1 flex gap-2">
            <input
              id="subjects-input"
              className="w-full rounded-md border px-3 py-2"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              placeholder="Add a subject and press Add"
            />
            <button
              type="button"
              onClick={addSubject}
              className="px-3 py-2 rounded-md bg-muted text-muted-foreground shadow-sm">
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {newSubjects.map((s, idx) => (
              <span
                key={`${s}_${idx}`}
                className="px-2 py-1 rounded-full bg-slate-100 text-sm">
                {s}
                <button
                  className="ml-2 text-slate-500"
                  onClick={() => removeSubject(s)}>
                  x
                </button>
              </span>
            ))}
            {newSubjects.length === 0 && (
              <span className="text-xs text-slate-500">No subjects yet.</span>
            )}
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
