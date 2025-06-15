import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AdvancedMetricsChartProps {
  data: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
    profitMargin: number;
  }>;
  narrative?: string;
}

const AdvancedMetricsChart: React.FC<AdvancedMetricsChartProps> = ({ data, narrative }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value}%`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Advanced Financial Metrics</h4>
      <div className="h-80 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              yAxisId="left"
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={formatPercentage}
            />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === 'Profit Margin') {
                  return [formatPercentage(value), name];
                }
                return [formatCurrency(value), name];
              }}
              contentStyle={{ 
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Bar 
              yAxisId="left"
              dataKey="revenue" 
              fill="#3b82f6" 
              name="Revenue"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              yAxisId="left"
              dataKey="expenses" 
              fill="#ef4444" 
              name="Expenses"
              radius={[2, 2, 0, 0]}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="profitMargin" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              name="Profit Margin %"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {narrative && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border-l-4 border-blue-400">
          <p className="text-sm text-gray-800 leading-relaxed">{narrative}</p>
        </div>
      )}
    </div>
  );
};

export default AdvancedMetricsChart;