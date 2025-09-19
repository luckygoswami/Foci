import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { updateUser } from '@/features/user';
import { newId } from '@/lib/utils';
import type { FirebaseUserId, Subject } from '@/types';
import { Check, Pencil, X } from 'lucide-react';
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
  currentSubjects: Subject[];
  userId: FirebaseUserId;
  onSuccess: (sbjs: Subject[]) => void;
}) {
  const [newSubjects, setNewSubjects] = useState<Subject[]>(currentSubjects);
  const activeSubjects = newSubjects.filter((s) => s.isActive);
  const disabledSubjects = newSubjects.filter((s) => !s.isActive);
  const [inputSubject, setInputSubject] = useState('');

  function hasDuplicateSubjects(subjects: Subject[]) {
    const seen = new Set();
    for (const sub of subjects) {
      const nameLower = sub.name.toLowerCase();
      if (seen.has(nameLower)) {
        return true;
      }
      seen.add(nameLower);
    }
    return false;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, sub: Subject) {
    setNewSubjects((prev) => {
      const updatedSubjects = prev.map((s) =>
        s.subjectId != sub.subjectId
          ? s
          : { ...s, name: e.target.value.trimStart() }
      );
      return updatedSubjects;
    });
  }

  function handleAdd() {
    const subject = inputSubject.trim();

    if (!subject) return;
    if (
      !newSubjects.find((s) => s.name.toLowerCase() == subject.toLowerCase())
    ) {
      const now = Date.now();

      const newSubject: Subject = {
        name: subject,
        subjectId: newId(),
        isActive: true,
        createdAt: now,
        updatedAt: now,
      };

      setNewSubjects((prev) => [...prev, newSubject]);
      toast.success(`${subject} added to Active subjects.`);
    }

    setInputSubject('');
  }

  function handleActive(sub: Subject) {
    setNewSubjects((prev) => {
      const updatedSubjects = prev.map((s) =>
        s.subjectId != sub.subjectId ? s : { ...s, isActive: true }
      );
      return updatedSubjects;
    });

    toast.success(`${sub.name} added to Active subjects.`);
  }

  function handleDisable(sub: Subject) {
    if (newSubjects.filter((s) => s.isActive).length == 1) {
      toast.error('Cannot empty active sujects list.');
      return;
    }

    setNewSubjects((prev) => {
      const updatedSubjects = prev.map((s) =>
        s.subjectId != sub.subjectId ? s : { ...s, isActive: false }
      );
      return updatedSubjects;
    });

    toast.success(`${sub.name} added to Disabled subjects.`);
  }

  async function handleUpdate() {
    if (!newSubjects.length) {
      toast.error('Add atleast one subject.');
      return;
    }
    if (hasDuplicateSubjects(newSubjects)) {
      toast.error('Duplicate subjects are not allowed.');
      return;
    }

    try {
      await updateUser(userId, {
        subjects: newSubjects,
      });
      toast.success('Subjects updated.');
      onSuccess(newSubjects);
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
          <DialogTitle>Wanna add new subjects?</DialogTitle>
          <DialogDescription>Update your subjects</DialogDescription>
        </DialogHeader>

        {/* New Subject input */}
        <div className="rounded-full border border-muted-foreground/50 flex shadow-md">
          <input
            type="text"
            className="flex-1 px-4 outline-none w-full"
            placeholder="Enter subject name"
            value={inputSubject}
            onChange={(e) => setInputSubject(e.target.value)}
          />
          <button
            onClick={handleAdd}
            className="text-primary-foreground rounded-full bg-primary px-4 py-2">
            Add
          </button>
        </div>

        {/* Active subjects */}
        <div className="px-3">
          <h3 className="text-muted-foreground mb-2">Active subjects</h3>
          {!activeSubjects.length ? (
            <span className="text-muted-foreground/70">No Active subjects</span>
          ) : (
            <ol className="space-y-1 max-h-35 overflow-auto">
              {activeSubjects.map((sub, idx) => (
                <li
                  key={`${sub.subjectId}-${idx}`}
                  className="subject-box rounded-full px-3 py-1 bg-muted text-muted-foreground flex items-center gap-2">
                  <label htmlFor={`${idx}-${sub.subjectId}`}>
                    <Pencil className="size-4.5" />
                  </label>
                  <input
                    id={`${idx}-${sub.subjectId}`}
                    className="flex-1 px-1 py-1 font-medium focus:bg-card w-full"
                    type="text"
                    onChange={(e) => handleChange(e, sub)}
                    value={
                      newSubjects.find((s) => s.subjectId == sub.subjectId)
                        ?.name
                    }
                  />
                  <button onClick={() => handleDisable(sub)}>
                    <X className="text-red-500" />
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Disabled subjects */}
        <div className="px-3">
          <h3 className="text-muted-foreground mb-2">Disabled subjects</h3>
          {!disabledSubjects.length ? (
            <span className="text-muted-foreground/70 text-sm">
              No Disabled subjects
            </span>
          ) : (
            <ol className="space-y-1 max-h-35 overflow-auto">
              {disabledSubjects.map((sub, idx) => (
                <li
                  key={`${sub.subjectId}-${idx}`}
                  className="subject-box rounded-full px-3 py-1 bg-muted text-muted-foreground flex items-center gap-2">
                  <label htmlFor={`${idx}-${sub.subjectId}`}>
                    <Pencil className="size-4.5" />
                  </label>
                  <input
                    id={`${idx}-${sub.subjectId}`}
                    className="flex-1 px-1 py-1 font-medium focus:bg-card w-full"
                    type="text"
                    onChange={(e) => handleChange(e, sub)}
                    value={
                      newSubjects.find((s) => s.subjectId == sub.subjectId)
                        ?.name
                    }
                  />
                  <button onClick={() => handleActive(sub)}>
                    <Check className="text-green-500" />
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Action buttons */}
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
