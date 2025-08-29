import { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import type { SubjectDuration } from '../types';
import { fetchSubjectTimeDistribution } from '../services/charts';
import type { FirebaseUserId } from '@/types';
import toast from 'react-hot-toast';
import { toTitleCase } from '@/lib/utils';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function SubjectTimeDistributionChart({
  userId,
}: {
  userId: FirebaseUserId;
}) {
  const [data, setData] = useState<SubjectDuration[] | null>(null);

  useEffect(() => {
    if (data || !userId) return;
    const fetch = async () => {
      try {
        const progress = await fetchSubjectTimeDistribution(userId);
        setData(progress);
      } catch (err: any) {
        toast.error(err.message);
      }
    };

    fetch();
  }, [data, userId]);

  if (!data || !userId) return null;

  // TODO: add loading skeleton
  if (data.length === 0) {
    return (
      <div className="text-center opacity-50">No sessions found to show.</div>
    );
  }

  return (
    <ResponsiveContainer
      width="100%"
      height="100%">
      <PieChart>
        <Pie
          className="focus:outline-none"
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          isAnimationActive={true}
          fill="#8884d8"
          dataKey="value">
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          verticalAlign="bottom"
          iconSize={8}
          formatter={(value) => (
            <span className="text-muted-foreground mr-2 ml-0.5">
              {toTitleCase(value)}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
