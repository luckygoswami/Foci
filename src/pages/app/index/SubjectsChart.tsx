import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

const data = [
  { name: 'Physics', value: 150 },
  { name: 'Chemistry', value: 60 },
  { name: 'Mathematics', value: 190 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
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

export default function SubjectsChart() {
  {
    return (
      <ResponsiveContainer
        width="100%"
        height="100%">
        <PieChart
          width={400}
          height={400}>
          <Pie
            className="focus:outline-none"
            data={data}
            cx="50%"
            cy="50%"
            // labelLine={false}
            label={renderCustomizedLabel}
            cornerRadius={5}
            outerRadius={80}
            isAnimationActive={true}
            fill="#8884d8"
            dataKey="value">
            {data.map((entry, index) => (
              <Cell
                onClick={(e) => e.preventDefault}
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
