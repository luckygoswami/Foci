import {
  fetchDailyGoalProgress,
  fetchWeeklyGoalProgress,
} from '@/features/charts/services/charts';
import { fetchUserDataByUserId, useUserData } from '@/features/user';
import { getMonthYear } from '@/lib/utils';
import type { FirebaseUserId, UserData } from '@/types';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

function UserProfile() {
  const { userData: currentUserData } = useUserData();
  const [isFriend, setIsFriend] = useState(false);
  const location = useLocation();
  const { userId } = useParams<{ userId: FirebaseUserId }>();
  const { userData } = location.state || {};
  const [user, setUser] = useState<UserData | null>(userData || null);
  const [todayProgress, setTodayProgress] = useState(0);
  const [weekProgress, setWeekProgress] = useState(0);

  useEffect(() => {
    if (!userId || !currentUserData) return;

    if (!user) {
      fetchUserDataByUserId(userId)
        .then((res) => {
          setUser(res);
          fetchDailyGoalProgress(res).then(setTodayProgress);
          fetchWeeklyGoalProgress(res).then(setWeekProgress);
        })
        .catch((err) => console.error(err));
    } else {
      setIsFriend(
        currentUserData.friends.some((friend) => friend.userId == user.userId)
      );
    }
  }, [userId, currentUserData, user]);

  // TODO: add loading skeleton
  if (!user || !currentUserData) return <div>Loading...</div>;
  const {
    username,
    name,
    bio,
    subjects,
    totalStudyTime,
    friends,
    streak,
    createdAt,
  } = user;

  return (
    <main className="bg-gray-100 grid  grid-rows-[2fr_1fr_1.2fr_1fr_0.6fr] gap-2 px-4 py-2 borde border-red-500">
      {/* Profile Header */}
      <div className="rounded-2xl bg-white shadow p-6 text-center">
        <img
          src="/assets/avatars/boy_2423819.svg"
          alt="User Avatar"
          width={100}
          className="mx-auto rounded-full border mb-4 bg-gray-50"
        />
        <h2 className="text-xl font-bold">{username}</h2>
        <p className="text-gray-700">{name}</p>
        <p className="text-gray-500 mt-2">{bio}</p>
      </div>

      {/* Subjects & Streak */}
      <div className="subjects-streak grid grid-cols-[2fr_1fr] gap-2 borde border-blue-500 ">
        <div className="subjects bg-white shadow rounded-2xl p-4 overflow-hidden">
          <h3 className="font-semibold mb-2">Subjects</h3>
          <div className="flex gap-2 overflow-scroll no-scrollbar">
            {subjects.map((subject) => (
              <span
                key={subject}
                className="bg-gray-100 text-sm px-3 py-1 rounded-full text-gray-700">
                {subject}
              </span>
            ))}
          </div>
        </div>
        <div className="streak bg-white shadow rounded-2xl p-4">
          <h3 className="font-semibold mb-2">Streak</h3>
          <p className="text-2xl font-bold text-gray-800">
            {streak.current} 🔥
          </p>
        </div>
      </div>

      {/* Study stats */}
      <div className="study-stats bg-white shadow rounded-2xl p-4 borde border-blue-500">
        <h3 className="font-semibold mb-2">Study Stats</h3>
        <div className="grid grid-cols-3 gap-2 text-center text-sm text-gray-600">
          <div className="border-r border-gray-300">
            <p className="font-medium text-gray-800 text-lg">
              {todayProgress[0]?.value}
            </p>
            <p>Today</p>
          </div>
          <div>
            <p className="font-medium text-gray-800 text-lg">
              {weekProgress[0]?.value}
            </p>
            <p>This Week</p>
          </div>
          <div className="border-l border-gray-300">
            <p className="font-medium text-gray-800 text-lg">
              {totalStudyTime / 60} h
            </p>
            <p>Total</p>
          </div>
        </div>
      </div>

      {/* Friends & Joined */}
      <div className="friends-joined grid grid-cols-2 gap-2 borde border-blue-500">
        <div className="shadow bg-white rounded-2xl p-4">
          <h3 className="font-semibold mb-2">Friends</h3>
          <div className="flex -space-x-2">
            {!friends.length ? (
              <div>no friends...</div>
            ) : (
              friends.map((friend, i) => (
                <img
                  key={i}
                  src={`/assets/avatars/${friend.avatarId}.svg`}
                  alt="Friend Avatar"
                  className="w-8 h-8 rounded-full border-2 border-white bg-gray-300"
                />
              ))
            )}
          </div>
        </div>
        <div className="shadow bg-white rounded-2xl p-4">
          <h3 className="font-semibold mb-2">Joined</h3>
          <p className="text-gray-700">{getMonthYear(createdAt)}</p>
        </div>
      </div>

      {/* Add-Remove button */}
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
    </main>
  );
}

export default UserProfile;
