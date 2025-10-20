'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTheme } from 'next-themes';

interface ConversionChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const COLORS = ['#10b981', '#ef4444'];

export function ConversionChart({ data }: ConversionChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const renderLabel = (entry: any) => {
    const percent = ((entry.value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1);
    return `${percent}%`;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
            borderRadius: '8px',
            color: isDark ? '#f3f4f6' : '#111827'
          }}
        />
        <Legend
          wrapperStyle={{
            color: isDark ? '#f3f4f6' : '#111827'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
