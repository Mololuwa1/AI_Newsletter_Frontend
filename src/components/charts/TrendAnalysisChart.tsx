import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface TrendAnalysisChartProps {
  data: Array<{
    period: string;
    actual: number;
    forecast: number;
    target: number;
  }>;
  narrative?: string;
}

const TrendAnalysisChart: React.FC<TrendAnalysisChartProps> = ({ data, narrative }) => {
  const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Trend Analysis & Forecasting</h4>
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="period" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={formatValue}
            />
            <Tooltip 
              formatter={(value: number) => [formatValue(value), '']}
              contentStyle={{ 
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#actualGradient)"
              strokeWidth={2}
              name="Actual Performance"
            />
            <Area
              type="monotone"
              dataKey="forecast"
              stroke="#8b5cf6"
              fillOpacity={1}
              fill="url(#forecastGradient)"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="AI Forecast"
            />
            <ReferenceLine 
              y={data[0]?.target || 0} 
              stroke="#10b981" 
              strokeDasharray="8 8" 
              strokeWidth={2}
              label={{ value: "Target", position: "topRight" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {narrative && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border-l-4 border-purple-400">
          <p className="text-sm text-purple-800 leading-relaxed">{narrative}</p>
        </div>
      )}
    </div>
  );
};

export default TrendAnalysisChart;