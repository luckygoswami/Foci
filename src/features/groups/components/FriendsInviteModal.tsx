import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from '@/components/ui/dialog';
import type { Friend } from '@/types';
import { FriendsInviteModalSkeleton } from '@/components';

interface FriendsInviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  friends: (Friend & { invited: boolean })[] | null;
  onInvite: (friend: Friend & { invited: boolean }) => void;
}

export const FriendsInviteModal: React.FC<FriendsInviteModalProps> = ({
  open,
  onOpenChange,
  friends,
  onInvite,
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invite a Buddy</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        {!friends ? (
          <FriendsInviteModalSkeleton />
        ) : !friends.length ? (
          <div className="h-55 flex justify-center items-center gap-5">
            <p className="text-muted-foreground/80 font-medium text-center">
              No-buddy here to invite.
            </p>
          </div>
        ) : (
          <ol className="h-55 flex flex-col overflow-y-auto w-full divide-y divide-muted">
            {friends.map((friend) => (
              <li
                key={friend.userId}
                className="flex items-center gap-3 p-2">
                <img
                  src={`/assets/avatars/${friend.avatarId}.svg`}
                  alt={friend.name}
                  className="size-12 rounded-full border bg-gray-100 p-0.25 pb-0"
                />
                <span className="flex-1 font-medium">{friend.name}</span>
                {friend.invited ? (
                  <button
                    className="px-3 py-1 rounded-sm bg-muted text-muted-foreground shadow-xs"
                    disabled>
                    Invited
                  </button>
                ) : (
                  <button
                    className="px-4.5 py-1  rounded-sm bg-primary text-primary-foreground shadow-xs hover:bg-blue-700 transition"
                    onClick={() => onInvite(friend)}>
                    Invite
                  </button>
                )}
              </li>
            ))}
          </ol>
        )}
      </DialogContent>
    </Dialog>
  );
};
