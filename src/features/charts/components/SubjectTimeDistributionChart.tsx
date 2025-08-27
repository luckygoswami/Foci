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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}) => {
  if (percent == 0) return null;

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

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

  // TODO: show skeleton for empty data.
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
          labelLine={false}
          label={renderCustomizedLabel}
          cornerRadius={5}
          outerRadius={100}
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
        <Legend
          align="right"
          verticalAlign="middle"
          layout="vertical"
          wrapperStyle={{ right: 0 }}
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
