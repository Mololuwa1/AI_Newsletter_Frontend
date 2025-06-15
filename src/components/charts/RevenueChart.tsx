import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
  data: Array<{
    month: string;
    revenue: number;
    previousYear: number;
  }>;
  narrative?: string;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data, narrative }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Revenue Performance Trend</h4>
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <Tooltip 
              formatter={(value: number) => [formatCurrency(value), '']}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              name="Current Year"
            />
            <Line 
              type="monotone" 
              dataKey="previousYear" 
              stroke="#94a3b8" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#94a3b8', strokeWidth: 2, r: 3 }}
              name="Previous Year"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {narrative && (
        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
          <p className="text-sm text-blue-800 leading-relaxed">{narrative}</p>
        </div>
      )}
    </div>
  );
};

export default RevenueChart;