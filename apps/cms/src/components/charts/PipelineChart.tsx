'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { useTheme } from 'next-themes';

interface PipelineChartProps {
  data: Array<{
    stage: string;
    count: number;
    value: number;
  }>;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

export function PipelineChart({ data }: PipelineChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={isDark ? '#4b5563' : '#d1d5db'}
        />
        <XAxis
          dataKey="stage"
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
          formatter={(value: number, name: string) => {
            if (name === 'value') {
              return new Intl.NumberFormat('en-AE', {
                style: 'currency',
                currency: 'AED',
                minimumFractionDigits: 0
              }).format(value);
            }
            return value;
          }}
        />
        <Legend
          wrapperStyle={{
            color: isDark ? '#f3f4f6' : '#111827'
          }}
        />
        <Bar dataKey="count" name="Deal Count" radius={[8, 8, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
