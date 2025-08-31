import { type Ref } from 'react';
import { acceptFriendRequest, rejectFriendRequest } from '../services/friends';
import { useUserData } from '@/features/user';
import type { Friend, FriendRequest } from '@/types';
import RequestCard from './RequestCard';
import toast from 'react-hot-toast';

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

  async function handleAcceptRequest(request: FriendRequest) {
    try {
      await acceptFriendRequest(request);

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
      toast.success('New friend added.');
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function handleRejectRequest(request: FriendRequest) {
    try {
      await rejectFriendRequest(request);

      // remove request from list
      const newRequests = requests.filter(
        (req) => req.senderId != request.senderId
      );
      setRequests(newRequests);
      toast.success('Friend request rejected.');
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <div
      ref={requestListRef}
      className="space-y-2 pb-20">
      {!requests ? (
        // TODO: add loading skeleton
        <div>loading...</div>
      ) : !requests.length ? (
        <div>No requests yet...</div>
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
