import { Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';

export function GoalProgressChartSkeleton() {
  function renderSkeletonLegend() {
    return (
      <div className="flex flex-col items-center gap-2">
        <p className="h-6 w-18 rounded bg-skeleton-foreground animate-pulse" />
        <p className="h-4 w-24 rounded bg-skeleton-foreground animate-pulse" />
      </div>
    );
  }
  return (
    <ResponsiveContainer
      width="100%"
      height="100%">
      <PieChart
        width={800}
        height={400}>
        <Pie
          className="focus:outline-none animate-pulse"
          data={[{ value: 100 }]}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={70}
          fill="#e5e7eb"
          stroke=""
          dataKey="value"
          isAnimationActive={false}
        />
        <Legend
          align="center"
          verticalAlign="middle"
          layout="vertical"
          content={renderSkeletonLegend}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
