import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CustomerGrowthChartProps {
  data: Array<{
    month: string;
    newCustomers: number;
    totalCustomers: number;
  }>;
  narrative?: string;
}

const CustomerGrowthChart: React.FC<CustomerGrowthChartProps> = ({ data, narrative }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Customer Growth Analysis</h4>
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar 
              dataKey="newCustomers" 
              fill="#10b981" 
              radius={[4, 4, 0, 0]}
              name="New Customers"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {narrative && (
        <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
          <p className="text-sm text-green-800 leading-relaxed">{narrative}</p>
        </div>
      )}
    </div>
  );
};

export default CustomerGrowthChart;