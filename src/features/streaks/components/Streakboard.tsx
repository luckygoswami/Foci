import type { UserData } from '@/types';
import { Flame } from 'lucide-react';
import { getStreakDays } from '../services/streaks';

interface StreakboardProps {
  userData: UserData;
}

const weekDays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export function Streakboard({ userData }: StreakboardProps) {
  const streakDays = getStreakDays(userData.streak);
  const today = new Date().getDay();

  return (
    <>
      <h1 className="font-bold text-4xl">Streakboard</h1>
      <div className="current-streak">
        <span className="text-6xl flex items-center">
          {userData.streak?.current || 0}
          <Flame
            size={45}
            fill="yellow"
          />
        </span>
      </div>
      <div className="streak-week flex justify-evenly text-center">
        {weekDays.map((day, i) => (
          <span key={`${day}_${i}`}>
            <Flame
              fill={streakDays.includes(day) ? 'yellow' : 'white'}
              stroke={day == weekDays[today] ? 'orange' : 'black'}
            />
            {day.slice(0, 3)}
          </span>
        ))}
      </div>
    </>
  );
}
