import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Select a subject</DialogTitle>
          <DialogDescription>
            Choose the subject you want to start session for.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 pt-2">
          {subjects?.map((subject) => (
            <Button
              key={subject}
              variant="outline"
              onClick={() => {
                onSelect(subject);
                setOpen(false);
              }}>
              {subject}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
