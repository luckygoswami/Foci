import { Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';

export function SubjectTimeDistributionChartSkeleton() {
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
}
