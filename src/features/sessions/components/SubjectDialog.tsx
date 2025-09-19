import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { Subject } from '@/types';

type SubjectDropdownProps = {
  subjects: Subject[];
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelect: (sub: Subject) => void;
};

export function SubjectDialog({
  subjects,
  open,
  setOpen,
  onSelect,
}: SubjectDropdownProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>
      <DialogContent className="max-w-sm rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Select a subject
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Select subject to start session for.
          </DialogDescription>
        </DialogHeader>
        {/* Subjects container */}
        <div className="flex flex-col gap-2 p-3 max-h-60 overflow-y-auto">
          {subjects?.length == 0 ? (
            <span className="text-muted-foreground/50 text-center italic">
              No subjects found!
            </span>
          ) : (
            <>
              {subjects
                .filter((s) => s.isActive)
                .map((subject) => (
                  <button
                    key={subject.subjectId}
                    className="border border-muted py-2 text-muted-foreground rounded-full shadow-sm"
                    onClick={() => {
                      onSelect(subject);
                      setOpen(false);
                    }}>
                    {subject.name}
                  </button>
                ))}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
