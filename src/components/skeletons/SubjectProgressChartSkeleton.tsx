import { MONTH_NAMES } from '@/constants/dateTime';
import {
  CartesianGrid,
  Legend,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

export function SubjectProgressChartSkeleton() {
  function CustomTick(x: number, y: number, adjX: number, adjY: number) {
    return (
      <g>
        <rect
          className="custom-tick animate-pulse"
          x={x + adjX}
          y={y + adjY}
          width={15}
          height={15}
          fill="#e5e7eb"
        />
      </g>
    );
  }

  const now = new Date();
  const thisMonth = now.getMonth();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;

  return (
    <ResponsiveContainer
      width="100%"
      height="100%">
      <LineChart>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          opacity={0.5}
        />
        <XAxis
          tick={({ x, y }) => CustomTick(x, y, -7, 6)}
          domain={[1, 2, 3, 4]}
          axisLine={false}
          tickLine={false}
          label={{ value: 'Weeks', position: 'bottom' }}
        />
        <YAxis
          tick={({ x, y }) => CustomTick(x, y, -20, -8)}
          domain={[1, 5]}
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
          payload={[
            { value: MONTH_NAMES[lastMonth], type: 'square', color: '#2d3748' },
            { value: MONTH_NAMES[thisMonth], type: 'square', color: '#3182ce' },
          ]}
          formatter={(value) => (
            <span className="mr-3 text-transparent bg-skeleton-foreground animate-pulse">
              {value}
            </span>
          )}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
