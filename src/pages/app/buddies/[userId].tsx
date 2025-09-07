import { UserDetailsPageSkeleton } from '@/components';
import {
  acceptFriendRequest,
  rejectFriendRequest,
  sendFriendRequest,
  unfriendUser,
  useFriendshipStatus,
} from '@/features/buddies';
import {
  FriendsAndJoined,
  ProfileHeader,
  StudyStats,
  SubjectsAndStreak,
  fetchUserDataByUserId,
  useUserData,
} from '@/features/user';
import type { FirebaseUserId, UserData } from '@/types';
import { useEffect, useState } from 'react';
import { feedback } from '@/lib/feedback';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function UserDetailsPage() {
  const { userData, setUserData } = useUserData();
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: FirebaseUserId }>();
  const { selectedUser } = location.state || {};
  const [profileData, setProfileData] = useState<UserData | undefined>(
    selectedUser || undefined
  );

  const {
    status: friendshipStatus,
    setStatus: setFriendShipStatus,
    pendingRequest,
    requestSent,
    setRequestSent,
    setPendingRequest,
    loading: loadingFriendship,
  } = useFriendshipStatus(userData, profileData);

  useEffect(() => {
    if (!userId || !userData) return;
    if (userData.userId === userId) {
      navigate('/app/account');
      return;
    }

    if (!profileData) {
      fetchUserDataByUserId(userId)
        .then(setProfileData)
        .catch((err) => feedback.error(err.message));
    }
  }, [userId, userData, profileData]);

  function handleAddFriend() {
    if (!userData || !profileData) return;

    const {
      userId: senderId,
      name: senderName,
      avatarId: senderAvatarId,
    } = userData;

    const friendRequest = {
      senderId,
      senderName,
      senderAvatarId,
      recipientId: profileData.userId,
      recipientName: profileData.name,
      recipientAvatarId: profileData.avatarId,
      createdAt: Date.now(),
      status: 'pending' as const,
    };

    sendFriendRequest(friendRequest).catch((err) => feedback.error(err.message));
    setRequestSent(true);
    // TODO: add confirmation dialog and toast
  }

  function removeFriend() {
    if (!userData || !profileData) return;

    // TODO: add confirmation dialog and toast
    unfriendUser(userData.userId, profileData.userId).catch((err) =>
      feedback.error(err.message)
    );
    setFriendShipStatus('notFriend');

    // remove friend from userData state
    setUserData((prev) =>
      prev
        ? {
            ...prev,
            friends: prev.friends.filter(
              (f) => f.userId !== profileData.userId
            ),
          }
        : prev
    );
  }

  function handleAcceptRequest() {
    if (!pendingRequest) return;

    acceptFriendRequest(pendingRequest).catch((err) =>
      feedback.error(err.message)
    );
    setPendingRequest(null);
    setFriendShipStatus('isFriend');

    // add friend to userData state
    setUserData((prev) =>
      prev
        ? {
            ...prev,
            friends: [
              ...prev.friends,
              {
                userId: pendingRequest.senderId,
                name: pendingRequest.senderName,
                avatarId: pendingRequest.senderAvatarId,
              },
            ],
          }
        : prev
    );
  }

  function handleRejectRequest() {
    if (!pendingRequest) return;

    rejectFriendRequest(pendingRequest).catch((err) =>
      feedback.error(err.message)
    );
    setPendingRequest(null);
    setFriendShipStatus('notFriend');
  }

  function renderActions() {
    switch (friendshipStatus) {
      case 'isFriend':
        return (
          <button
            onClick={removeFriend}
            className="flex-1 py-2 rounded-xl bg-red-100 text-red-400 font-semibold text-lg flex items-center justify-center hover:bg-red-200 transition-colors">
            Remove Buddy
          </button>
        );
      case 'pendingRequest':
        return (
          <>
            <button
              className="flex-1 py-2 rounded-xl bg-green-200 text-green-700 font-semibold text-xl flex items-center justify-center gap-2 hover:bg-green-300 transition-colors"
              onClick={handleAcceptRequest}>
              accept
            </button>
            <button
              className="flex-1 py-2 rounded-xl bg-red-200 text-red-700 font-semibold text-xl flex items-center justify-center gap-2 hover:bg-red-300 transition-colors"
              onClick={handleRejectRequest}>
              reject
            </button>
          </>
        );
      case 'notFriend':
        return (
          <button
            onClick={handleAddFriend}
            disabled={requestSent}
            className={`flex-1 py-2 rounded-xl font-semibold text-xl flex items-center justify-center transition-colors ${
              requestSent
                ? 'bg-blue-100 text-blue-400 cursor-not-allowed opacity-60'
                : 'bg-blue-200 text-blue-700 hover:bg-blue-300'
            }`}>
            Add Buddy
          </button>
        );
      default:
        return null;
    }
  }

  return (
    <div
      role="region"
      aria-label="User Details"
      className="!bg-gray-100 grid  grid-rows-[2fr_1fr_1.2fr_1fr_0.6fr] gap-2 px-4 py-2">
      {!profileData || loadingFriendship ? (
        <UserDetailsPageSkeleton />
      ) : (
        <>
          <ProfileHeader userData={profileData} />
          <SubjectsAndStreak userData={profileData} />
          <StudyStats userData={profileData} />
          <FriendsAndJoined userData={profileData} />

          <div className="actions-menu flex gap-2 mt-2">{renderActions()}</div>
        </>
      )}
    </div>
  );
}
