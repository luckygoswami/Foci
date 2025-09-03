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

export function SubjectTimeDistributionChart({
  userId,
  currentSubjects = [],
}: {
  userId: FirebaseUserId;
  currentSubjects?: string[];
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

  if (!data || !userId)
    return (
      <ResponsiveContainer
        width="100%"
        height="100%">
        <PieChart>
          <Pie
            className="focus:outline-none animate-pulse"
            data={[{ value: 100 }]}
            cx="50%"
            cy="50%"
            fill="#e5e7eb"
            stroke=""
            innerRadius={55}
            outerRadius={80}
            dataKey="value"
            isAnimationActive={false}
          />
          <Legend
            verticalAlign="bottom"
            iconSize={0}
            formatter={() => (
              <>
                <span className="h-4 w-15 mr-2 rounded bg-skeleton-foreground animate-pulse inline-block" />
                <span className="h-4 w-20 mr-2 rounded bg-skeleton-foreground animate-pulse inline-block" />
                <span className="h-4 w-15 rounded bg-skeleton-foreground animate-pulse inline-block" />
              </>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    );

  return (
    <ResponsiveContainer
      width="100%"
      height="100%">
      {!data.length ? (
        <PieChart>
          <Pie
            className="focus:outline-none"
            data={[{ value: 100 }]}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            fill="#edf2f7"
            stroke="none"
            dataKey="value"
          />
          <Legend
            verticalAlign="bottom"
            iconSize={0}
            formatter={() => (
              <span className="text-muted-foreground mr-2 ml-0.5">
                No sessions this week.
              </span>
            )}
          />
        </PieChart>
      ) : (
        <PieChart>
          <Pie
            className="focus:outline-none"
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            fill="#8884d8"
            dataKey="duration"
            nameKey="subject">
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
            iconType="circle"
            formatter={(subject) => (
              <span className="text-muted-foreground mr-2 ml-0.5">
                {currentSubjects.find((s) => s.toLowerCase() == subject) ||
                  subject}
              </span>
            )}
          />
        </PieChart>
      )}
    </ResponsiveContainer>
  );
}
