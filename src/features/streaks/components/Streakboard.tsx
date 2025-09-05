import type { UserData } from '@/types';
import { getStreakDays } from '../services/streaks';
import { WEEKDAY_NAMES } from '@/constants/dateTime';
import { StreakFire } from '@/assets/icons';

export function Streakboard({
  userData,
  className = '',
}: {
  userData: UserData | undefined;
  className?: string;
}) {
  if (!userData) return null; // No chance of happening as page loads after the userData load

  const streakDays = getStreakDays(userData.streak);
  const today = new Date().getDay();

  return (
    <div
      className={`${className} bg-card rounded-lg p-5 shadow-sm flex flex-col justify-between`}>
      <h1 className="font-semibold text-foreground text-3xl">Streakboard</h1>

      {/* Current streak */}
      <div className="flex items-center font-bold">
        {/* TODO: change text color to orange if todays streak is done */}
        <span className="mr-1 text-foreground text-7xl">
          {userData.streak?.current || 0}
        </span>
        <StreakFire
          variant="color"
          className="size-15"
        />
      </div>

      {/* Streak week */}
      <div className="flex justify-between text-center">
        {WEEKDAY_NAMES.map((day, i) => (
          <div
            key={`${day}_${i}`}
            className="flex flex-col">
            <StreakFire
              variant="color"
              className={`${!streakDays.includes(day) && 'opacity-50'} size-10`}
            />
            <span
              className={`${
                day !== WEEKDAY_NAMES[today]
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
