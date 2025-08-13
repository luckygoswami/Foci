import { type Ref } from 'react';
import { acceptFriendRequest, rejectFriendRequest } from '../services/friends';
import { useUserData } from '@/features/user';
import type { Friend, FriendRequest } from '@/types';
import RequestCard from './RequestCard';

export function RequestsList({
  requests,
  setRequests,
  requestListRef,
}: {
  requests: FriendRequest[];
  setRequests: (requests: FriendRequest[]) => void;
  requestListRef: Ref<HTMLDivElement>;
}) {
  const { setUserData } = useUserData();

  function handleAcceptRequest(request: FriendRequest) {
    acceptFriendRequest(request);

    // remove request from list
    const newRequests = requests.filter(
      (req) => req.senderId != request.senderId
    );
    setRequests(newRequests);

    // add friend to userData state
    setUserData((prev) => {
      if (!prev) return;

      const newFriend: Friend = {
        userId: request.senderId,
        name: request.senderName,
        avatarId: request.senderAvatarId,
      };

      const friends = [...prev.friends, newFriend];

      return {
        ...prev,
        friends,
      };
    });
  }

  function handleRejectRequest(request: FriendRequest) {
    rejectFriendRequest(request);

    // remove request from list
    const newRequests = requests.filter(
      (req) => req.senderId != request.senderId
    );
    setRequests(newRequests);
  }

  return (
    <div
      ref={requestListRef}
      className="flex flex-col gap-2 p-3">
      {!requests ? (
        // TODO: add loading skeleton
        <div>loading...</div>
      ) : !requests.length ? (
        <div>no requests yet...</div>
      ) : (
        requests.map((req, i) => (
          <RequestCard
            key={req.senderId + i}
            friendRequest={req}
            onAccept={handleAcceptRequest}
            onReject={handleRejectRequest}
          />
        ))
      )}
    </div>
  );
}
