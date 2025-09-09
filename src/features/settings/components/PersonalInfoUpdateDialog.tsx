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

export function BioUpdateDialog({
  isOpen,
  onClose,
  currentBio = '',
  userId,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentBio?: string;
  userId: FirebaseUserId;
  onSuccess: (bio: string) => void;
}) {
  const [newBio, setNewBio] = useState(currentBio);

  async function handleUpdate() {
    try {
      updateUser(userId, {
        bio: newBio,
      });
      toast.success('Weekly Target Updated.');
      onSuccess(newBio);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      onClose();
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setNewBio(e.target.value);
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ready for a New Bio?</DialogTitle>
          <DialogDescription>Update your bio</DialogDescription>
        </DialogHeader>

        <div>
          <textarea
            id="bio-input"
            className="mt-1 w-full rounded-md border px-3 py-2"
            defaultValue={currentBio}
            onChange={handleChange}
            placeholder="Tell others about yourself"
            rows={3}
            maxLength={80}
          />
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
