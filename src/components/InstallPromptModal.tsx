import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface InstallPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
}

export function InstallPromptModal({
  isOpen,
  onClose,
  onInstall,
}: InstallPromptModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Install Foci for a Better Experience</DialogTitle>
          <DialogDescription>
            Add Foci to your home screen for a faster, more reliable experience
            with offline access. It's quick and free.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-end">
          <Button
            variant="outline"
            className="hover:bg-card-hover"
            onClick={onClose}>
            Maybe Later
          </Button>
          <Button
            className="hover:bg-primary-hover"
            onClick={onInstall}>
            Install Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
