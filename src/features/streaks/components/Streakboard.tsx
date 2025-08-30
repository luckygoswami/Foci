import type { UserData } from '@/types';
import { getStreakDays } from '../services/streaks';

const weekDays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export function Streakboard({ userData }: { userData: UserData }) {
  const streakDays = getStreakDays(userData.streak);
  const today = new Date().getDay();

  return (
    <div className="bg-card rounded-lg p-5 shadow-sm flex flex-col gap-7">
      <h1 className="font-semibold text-foreground text-3xl">Streakboard</h1>

      {/* Current streak */}
      <div className="flex items-center font-bold">
        {/* TODO: change text color to orange if todays streak is done */}
        <span className="mr-1 text-foreground text-7xl">
          {userData.streak?.current || 0}
        </span>
        <span className="text-6xl">🔥</span>
      </div>

      {/* Streak week */}
      <div className="flex justify-between text-center">
        {weekDays.map((day, i) => (
          <div
            key={`${day}_${i}`}
            className="flex flex-col">
            <span
              className={`${
                !streakDays.includes(day) && 'opacity-50'
              } text-3xl`}>
              🔥
            </span>
            <span
              className={`${
                day !== weekDays[today]
                  ? 'text-muted-foreground'
                  : 'text-[#fd8001]'
              } font-medium`}>
              {day.slice(0, 3)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
