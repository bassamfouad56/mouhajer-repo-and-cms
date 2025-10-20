'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from 'next-themes';

interface LeadsChartProps {
  data: Array<{
    date: string;
    leads: number;
    converted: number;
  }>;
}

export function LeadsChart({ data }: LeadsChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={isDark ? '#4b5563' : '#d1d5db'}
        />
        <XAxis
          dataKey="date"
          stroke={isDark ? '#d1d5db' : '#6b7280'}
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke={isDark ? '#d1d5db' : '#6b7280'}
          style={{ fontSize: '12px' }}
        />
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
        <Line
          type="monotone"
          dataKey="leads"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ fill: '#10b981', r: 4 }}
          activeDot={{ r: 6 }}
          name="Total Leads"
        />
        <Line
          type="monotone"
          dataKey="converted"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6', r: 4 }}
          activeDot={{ r: 6 }}
          name="Converted"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
