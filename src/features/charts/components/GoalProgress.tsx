import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useEffect, useState } from 'react';
import type { UserData } from '@/types';
import type { GoalProgress } from '../types';
import {
  fetchDailyGoalProgress,
  fetchWeeklyGoalProgress,
  getSafeProgress,
} from '../services/charts';
import toast from 'react-hot-toast';
import { GoalProgressChartSkeleton } from '@/components';

export function GoalProgress({
  userData,
  target,
}: {
  userData: UserData | undefined;
  target: 'daily' | 'weekly';
}) {
  const variants = {
    daily: {
      title: 'Day Goal',
      fetchFn: fetchDailyGoalProgress,
      targetMinutes: userData!.dailyTargetMinutes,
      color: '#274754',
    },
    weekly: {
      title: 'Week Goal',
      fetchFn: fetchWeeklyGoalProgress,
      targetMinutes: userData!.weeklyTargetMinutes,
      color: '#e7c468',
    },
  };

  const { title, fetchFn, color, targetMinutes } = variants[target];
  const [data, setData] = useState<GoalProgress | null>(null);

  useEffect(() => {
    if (data || !userData) return;
    const fetch = async () => {
      try {
        const progress = await fetchFn(userData);
        setData(progress);
      } catch (err: any) {
        toast.error(err.message);
      }
    };

    fetch();
  }, [data, userData]);

  function renderCustomLegend(data: GoalProgress) {
    return (
      <div className="flex flex-col text-center">
        <div className="flex justify-center font-bold text-lg text-foreground">
          <span className="opacity-65">{`${Math.min(
            data[0].value,
            targetMinutes
          )}`}</span>
          <span>{`/${targetMinutes}`}</span>
        </div>
        <p className="text-muted-foreground font-semibold">{title}</p>
      </div>
    );
  }

  if (!userData || !data) return <GoalProgressChartSkeleton />;

  return (
    <ResponsiveContainer
      width="100%"
      height="100%">
      <PieChart>
        {/* Dummy full circle background ring */}
        <Pie
          data={[{ value: 100 }]}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={70}
          fill="#edf2f7"
          stroke="none"
          dataKey="value"
          isAnimationActive={false}
        />
        <Pie
          className="focus:outline-none"
          data={getSafeProgress(data)}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={70}
          startAngle={0}
          endAngle={-360}
          stroke=""
          cornerRadius={40}
          dataKey="value">
          <Cell fill={color} />
          <Cell fill="#00000000" />
        </Pie>
        <Legend
          align="center"
          verticalAlign="middle"
          layout="vertical"
          content={() => renderCustomLegend(data)}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
