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

const subjectColors = [
  '#ed8e4a',
  '#3e8bd3',
  '#855aad',
  '#79bd6b',
  '#47aeab',
  '#ae47a4',
  '#475dae',
  '#ae476b',
];

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
        <div className="flex flex-wrap gap-2 p-3 max-h-60 overflow-y-auto">
          {subjects?.length == 0 ? (
            <span className="text-muted-foreground/50 text-center italic">
              No subjects found!
            </span>
          ) : (
            <>
              {subjects
                .filter((s) => s.isActive)
                .map((sub, idx) => (
                  <button
                    key={`${sub.subjectId}-${idx}`}
                    style={{
                      backgroundColor:
                        subjectColors[idx % subjectColors.length],
                    }}
                    className="border border-muted py-2 px-3 flex-1 text-nowrap text-card rounded-full shadow-sm"
                    onClick={() => {
                      onSelect(sub);
                      setOpen(false);
                    }}>
                    {sub.name}
                  </button>
                ))}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
