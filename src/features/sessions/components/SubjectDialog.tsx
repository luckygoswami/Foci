import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

type SubjectDropdownProps = {
  subjects: string[] | undefined;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelect: (subject: string) => void;
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
              {subjects?.map((subject) => (
                <button
                  key={subject}
                  className="border border-muted py-2 text-muted-foreground rounded-full shadow-sm"
                  onClick={() => {
                    onSelect(subject);
                    setOpen(false);
                  }}>
                  {subject}
                </button>
              ))}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
