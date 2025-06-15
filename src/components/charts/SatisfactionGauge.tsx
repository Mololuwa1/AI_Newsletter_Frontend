import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface SatisfactionGaugeProps {
  score: number;
  target: number;
  narrative?: string;
}

const SatisfactionGauge: React.FC<SatisfactionGaugeProps> = ({ score, target, narrative }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10b981'; // Green
    if (score >= 75) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const scoreColor = getScoreColor(score);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Customer Satisfaction Score</h4>
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                startAngle={90}
                endAngle={-270}
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
              >
                <Cell fill={scoreColor} />
                <Cell fill="#f3f4f6" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-gray-800">{score}%</div>
            <div className="text-sm text-gray-500">Satisfaction</div>
            <div className="text-xs text-gray-400">Target: {target}%</div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          score >= target 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {score >= target ? '✓ Target Achieved' : '⚠ Below Target'}
        </div>
      </div>
      {narrative && (
        <div className="mt-4 bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
          <p className="text-sm text-purple-800 leading-relaxed">{narrative}</p>
        </div>
      )}
    </div>
  );
};

export default SatisfactionGauge;