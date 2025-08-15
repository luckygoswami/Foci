import type { UserData } from '@/types';
import { getStreakDays } from '../services/streaks';
import { Fire } from '@/assets/icons';

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
    <>
      <h1 className="font-bold text-4xl">Streakboard</h1>
      <div className="current-streak">
        <span className="text-6xl flex items-center">
          {userData.streak?.current || 0}
          <Fire className="size-10" />
        </span>
      </div>
      <div className="streak-week flex justify-evenly text-center">
        {weekDays.map((day, i) => (
          <span key={`${day}_${i}`}>
            <Fire
              variant={`${
                day == weekDays[today]
                  ? 'outline'
                  : streakDays.includes(day)
                  ? 'color'
                  : 'bw'
              }`}
              className="size-7"
            />
            {day.slice(0, 3)}
          </span>
        ))}
      </div>
    </>
  );
}
