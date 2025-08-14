import type { FriendRequest, UserData } from '@/types';
import { useEffect, useState } from 'react';
import { hasSentFriendRequest } from '../services/friends';

export function useFriendshipStatus(
  loggedInUser: UserData | undefined,
  profileUser: UserData | undefined
) {
  const [status, setStatus] = useState<
    'isFriend' | 'pendingRequest' | 'notFriend' | null
  >(null);
  const [pendingRequest, setPendingRequest] = useState<FriendRequest | null>(
    null
  );
  const [requestSent, setRequestSent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loggedInUser || !profileUser) return;

    // Already friends
    if (
      loggedInUser.friends.some(
        (friend) => friend.userId === profileUser.userId
      )
    ) {
      setStatus('isFriend');
      setLoading(false);
      return;
    }

    // Check requests in both directions
    Promise.all([
      hasSentFriendRequest(loggedInUser.userId, profileUser.userId),
      hasSentFriendRequest(profileUser.userId, loggedInUser.userId),
    ])
      .then(([sentByMe, sentByThem]) => {
        if (sentByMe) {
          setRequestSent(true);
          setStatus('notFriend');
        } else if (sentByThem) {
          setPendingRequest(sentByThem);
          setStatus('pendingRequest');
        } else {
          setStatus('notFriend');
        }
      })
      .catch((err) => console.error('Friendship check failed:', err))
      .finally(() => setLoading(false));
  }, [loggedInUser, profileUser]);

  return {
    status,
    pendingRequest,
    requestSent,
    setRequestSent,
    setPendingRequest,
    setStatus,
    loading,
  };
}
