import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProductPerformanceChartProps {
  data: Array<{
    product: string;
    revenue: number;
    units: number;
  }>;
  narrative?: string;
}

const ProductPerformanceChart: React.FC<ProductPerformanceChartProps> = ({ data, narrative }) => {
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
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Top Product Performance</h4>
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              type="number"
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <YAxis 
              type="category"
              dataKey="product" 
              stroke="#6b7280"
              fontSize={12}
              width={80}
            />
            <Tooltip 
              formatter={(value: number) => [formatCurrency(value), 'Revenue']}
              contentStyle={{ 
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar 
              dataKey="revenue" 
              fill="#8b5cf6" 
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {narrative && (
        <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
          <p className="text-sm text-purple-800 leading-relaxed">{narrative}</p>
        </div>
      )}
    </div>
  );
};

export default ProductPerformanceChart;