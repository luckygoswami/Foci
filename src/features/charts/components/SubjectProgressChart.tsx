import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { WeeklyProgress } from '../types';
import type { FirebaseUserId } from '@/types';
import { getSessionsByDate } from '@/features/sessions';
import { getWeeklyProgressForSubject } from '../services/charts';
import toast from 'react-hot-toast';
import { getLastMonthToCurrentMonthRange } from '@/lib/utils';
import { MONTH_NAMES } from '@/constants/dateTime';

export function SubjectProgressChart({
  userId,
  subject,
}: {
  userId: FirebaseUserId;
  subject: string;
}) {
  const { lastMonth, currentMonth } = getLastMonthToCurrentMonthRange();
  const [data, setData] = useState<WeeklyProgress[] | null>(null);
  useEffect(() => {
    if (data || !userId) return;

    const fetch = async () => {
      try {
        const userSessions = await getSessionsByDate(
          userId,
          lastMonth.startDate,
          currentMonth.endDate
        );

        // TODO: later get the user sessions from context or cache
        const progress = getWeeklyProgressForSubject(subject, userSessions);
        setData(progress);
      } catch (err: any) {
        toast.error(err.message);
      }
    };

    fetch();
  }, [data, userId]);

  if (!data || !userId) return null;

  {
    return (
      <ResponsiveContainer
        width="100%"
        height="100%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            bottom: 10,
            left: -10,
          }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            opacity={0.5}
          />
          <XAxis
            tick={{ fill: '#4a5568', fontSize: 14 }}
            tickMargin={10}
            dataKey="week"
            axisLine={false}
            tickLine={false}
            label={{ value: 'Weeks', position: 'bottom' }}
          />
          <YAxis
            tick={{ fill: '#4a5568', fontSize: 14 }}
            tickMargin={10}
            axisLine={false}
            tickLine={false}
          />
          <Legend
            verticalAlign="bottom"
            iconSize={8}
            iconType="square"
            wrapperStyle={{
              paddingTop: 35,
            }}
            formatter={(value) => <span className="mr-3">{value}</span>}
          />
          <Line
            type="monotone"
            dataKey={MONTH_NAMES[lastMonth.monthIndex]}
            stroke="#2d3748"
            strokeWidth={2.5}
            dot={{ strokeWidth: 3, r: 5 }}
          />
          <Line
            type="monotone"
            dataKey={MONTH_NAMES[currentMonth.monthIndex]}
            stroke="#3182ce"
            strokeWidth={2.5}
            dot={{ strokeWidth: 3, r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
