import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useEffect, useState } from 'react';
import type { UserData } from '@/types';
import type { GoalProgress } from '../types';
import { fetchWeeklyGoalProgress } from '../services/charts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const renderCustomLegend = (data: GoalProgress) => {
  return (
    <div className="flex flex-col text-center">
      <div className="flex justify-center">
        <span className="opacity-60">{`${data[0].value}`}</span>
        <span>{`/${data[1].value + data[0].value}`}</span>
      </div>
      <b>Weekly Goal</b>
    </div>
  );
};

export function WeeklyGoalChart({ userData }: { userData: UserData }) {
  const [data, setData] = useState<GoalProgress | null>(null);

  useEffect(() => {
    if (data || !userData) return;
    const fetch = async () => {
      try {
        const progress = await fetchWeeklyGoalProgress(userData);
        setData(progress);
      } catch (err) {
        console.error('Failed to load weekly goal progress:', err);
      }
    };

    fetch();
  }, [data, userData]);

  if (!userData || !data) return null;

  {
    return (
      <ResponsiveContainer
        width="100%"
        height="100%">
        <PieChart
          width={800}
          height={400}>
          <Pie
            className="focus:outline-none"
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
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
}
