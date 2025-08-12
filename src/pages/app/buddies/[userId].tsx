import {
  FriendsAndJoined,
  ProfileHeader,
  StudyStats,
  SubjectsAndStreak,
} from '@/features/user';
import { fetchUserDataByUserId, useUserData } from '@/features/user';
import type { FirebaseUserId, UserData } from '@/types';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

function UserProfile() {
  const { userData } = useUserData();
  const [isFriend, setIsFriend] = useState(false);
  const location = useLocation();
  const { userId } = useParams<{ userId: FirebaseUserId }>();
  const { selectedUser } = location.state || {};
  const [profileData, setProfileData] = useState<UserData | null>(
    selectedUser || null
  );

  useEffect(() => {
    if (!userId || !userData) return;

    if (!profileData) {
      fetchUserDataByUserId(userId)
        .then(setProfileData)
        .catch((err) => console.error(err));
    } else {
      setIsFriend(
        userData.friends.some((friend) => friend.userId == profileData.userId)
      );
    }
  }, [userId, userData, profileData]);

  return (
    <main className="bg-gray-100 grid  grid-rows-[2fr_1fr_1.2fr_1fr_0.6fr] gap-2 px-4 py-2">
      {!profileData ? (
        // TODO: add loading skeleton
        <div>Loading...</div>
      ) : (
        <>
          <ProfileHeader userData={profileData} />
          <SubjectsAndStreak userData={profileData} />
          <StudyStats userData={profileData} />
          <FriendsAndJoined userData={profileData} />

          {isFriend ? (
            <button
              onClick={() => setIsFriend((prev) => !prev)}
              className="flex-1 py-2 rounded-xl bg-red-100 text-red-400 font-semibold text-lg flex items-center justify-center hover:bg-red-200 transition-colors">
              Remove Buddy
            </button>
          ) : (
            <button
              onClick={() => setIsFriend((prev) => !prev)}
              className="flex-1 py-2 rounded-xl bg-blue-200 text-blue-700 font-semibold text-xl flex items-center justify-center hover:bg-blue-300 transition-colors">
              Add Buddy
            </button>
          )}
        </>
      )}
    </main>
  );
}

export default UserProfile;
