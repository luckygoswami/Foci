import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from '@/components/ui/dialog';
import type { Friend } from '@/types';

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
          <DialogTitle>Invite a Friend</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        {!friends ? (
          // TODO: add loading skeleton
          <div>Loading...</div>
        ) : (
          <div className="py-2">
            {!friends.length ? (
              <div className="text-gray-400">
                No friends available to invite.
              </div>
            ) : (
              <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                {friends.map((friend) => (
                  <li
                    key={friend.userId}
                    className="flex items-center gap-3 py-3">
                    <img
                      src={`/assets/avatars/${friend.avatarId}.svg`}
                      alt={friend.name}
                      className="w-10 h-10 rounded-full border bg-gray-100"
                    />
                    <span className="flex-1 font-medium">{friend.name}</span>
                    {friend.invited ? (
                      <button
                        className="px-3 py-1 rounded bg-white text-blue-600 border border-blue-100"
                        disabled>
                        Invited
                      </button>
                    ) : (
                      <button
                        className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                        onClick={() => onInvite(friend)}>
                        Invite
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
