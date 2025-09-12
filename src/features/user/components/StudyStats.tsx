import {
  fetchDailyGoalProgress,
  fetchWeeklyGoalProgress,
} from '@/features/charts';
import { formatDurationHM } from '@/lib/utils';
import type { UserData } from '@/types';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function StudyStats({ userData }: { userData: UserData }) {
  const [dayProgress, setDayProgress] = useState(0);
  const [weekProgress, setWeekProgress] = useState(0);

  useEffect(() => {
    fetchDailyGoalProgress(userData)
      .then((res) => setDayProgress(res[0].value))
      .catch((err) => toast.error(err.message));
    fetchWeeklyGoalProgress(userData)
      .then((res) => setWeekProgress(res[0].value))
      .catch((err) => toast.error(err.message));
  }, []);

  return (
    <div className="study-stats bg-white shadow rounded-2xl p-4">
      <h3 className="font-semibold mb-2">Study Stats</h3>
      <div className="grid grid-cols-3 gap-2 text-center text-sm text-gray-600">
        <div className="border-r border-gray-300">
          <p className="font-medium text-gray-800 text-lg">
            {formatDurationHM(dayProgress)}
          </p>
          <p>Today</p>
        </div>
        <div>
          <p className="font-medium text-gray-800 text-lg">
            {formatDurationHM(weekProgress)}
          </p>
          <p>This Week</p>
        </div>
        <div className="border-l border-gray-300">
          <p className="font-medium text-gray-800 text-lg">
            {formatDurationHM(userData.totalStudyTime)}
          </p>
          <p>Total</p>
        </div>
      </div>
    </div>
  );
}
