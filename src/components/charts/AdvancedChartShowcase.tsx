import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import SubscriptionGate from '../SubscriptionGate';
import { SubscriptionTier } from '../../types/subscription';

interface AdvancedChartShowcaseProps {
  currentTier: SubscriptionTier;
  onUpgrade: () => void;
}

const AdvancedChartShowcase: React.FC<AdvancedChartShowcaseProps> = ({
  currentTier,
  onUpgrade
}) => {
  const pieData = [
    { name: 'Product A', value: 400, fill: '#3b82f6' },
    { name: 'Product B', value: 300, fill: '#10b981' },
    { name: 'Product C', value: 200, fill: '#f59e0b' },
    { name: 'Product D', value: 100, fill: '#ef4444' }
  ];

  const scatterData = [
    { x: 100, y: 200, z: 200 },
    { x: 120, y: 100, z: 260 },
    { x: 170, y: 300, z: 400 },
    { x: 140, y: 250, z: 280 },
    { x: 150, y: 400, z: 500 },
    { x: 110, y: 280, z: 200 }
  ];

  // Mock TreeMap data structure for display purposes
  const treeMapData = [
    { name: 'Marketing', size: 2400, color: '#3b82f6' },
    { name: 'Sales', size: 4567, color: '#10b981' },
    { name: 'Development', size: 1398, color: '#f59e0b' },
    { name: 'Support', size: 9800, color: '#ef4444' },
    { name: 'Operations', size: 3908, color: '#8b5cf6' },
    { name: 'HR', size: 4800, color: '#06b6d4' }
  ];

  // Calculate percentages for TreeMap visualization
  const total = treeMapData.reduce((sum, item) => sum + item.size, 0);
  const treeMapWithPercentages = treeMapData.map(item => ({
    ...item,
    percentage: ((item.size / total) * 100).toFixed(1)
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced Chart Types</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Unlock powerful visualization capabilities with our Pro subscription. 
          Create compelling data stories with advanced chart types.
        </p>
      </div>

      {/* Pie Chart - Pro Feature */}
      <SubscriptionGate
        requiredTier="pro"
        currentTier={currentTier}
        featureName="Pie Charts"
        onUpgrade={onUpgrade}
      >
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Market Share Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400 mt-4">
            <p className="text-sm text-purple-800 leading-relaxed">
              Product A leads market share with 40% dominance, followed by Product B at 30%. 
              This distribution indicates a healthy product portfolio with clear market leaders.
            </p>
          </div>
        </div>
      </SubscriptionGate>

      {/* Scatter Chart - Pro Feature */}
      <SubscriptionGate
        requiredTier="pro"
        currentTier={currentTier}
        featureName="Scatter Charts"
        onUpgrade={onUpgrade}
      >
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Customer Satisfaction vs Revenue Correlation</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={scatterData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="x" name="Satisfaction" unit="%" />
                <YAxis dataKey="y" name="Revenue" unit="k" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter dataKey="z" fill="#8b5cf6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400 mt-4">
            <p className="text-sm text-purple-800 leading-relaxed">
              Strong positive correlation between customer satisfaction and revenue generation. 
              Higher satisfaction scores consistently correlate with increased revenue performance.
            </p>
          </div>
        </div>
      </SubscriptionGate>

      {/* TreeMap Visualization - Pro Feature */}
      <SubscriptionGate
        requiredTier="pro"
        currentTier={currentTier}
        featureName="TreeMap Charts"
        onUpgrade={onUpgrade}
      >
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Department Budget Allocation</h4>
          <div className="h-64 bg-gray-50 rounded-lg p-4">
            {/* Custom TreeMap-style visualization */}
            <div className="grid grid-cols-3 gap-2 h-full">
              {treeMapWithPercentages.map((item, index) => {
                const heightClass = item.size > 5000 ? 'row-span-2' : 'row-span-1';
                const widthClass = item.size > 3000 ? 'col-span-2' : 'col-span-1';
                
                return (
                  <div
                    key={index}
                    className={`${heightClass} ${widthClass} rounded-lg flex flex-col justify-center items-center text-white font-medium text-sm transition-all duration-200 hover:scale-105`}
                    style={{ backgroundColor: item.color }}
                  >
                    <div className="text-center">
                      <div className="font-bold">{item.name}</div>
                      <div className="text-xs opacity-90">{item.percentage}%</div>
                      <div className="text-xs opacity-75">${(item.size / 1000).toFixed(1)}k</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400 mt-4">
            <p className="text-sm text-purple-800 leading-relaxed">
              Support receives the largest budget allocation at 35%, reflecting our customer-first approach. 
              Sales and Marketing combined account for 25% of total budget allocation.
            </p>
          </div>
        </div>
      </SubscriptionGate>

      {/* Feature Comparison */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Chart Types by Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border">
            <h4 className="font-medium text-gray-900 mb-2">Free Plan</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Line Charts</li>
              <li>• Bar Charts</li>
              <li className="text-gray-400">• Limited customization</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Basic Plan</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• All Free features</li>
              <li>• Gauge Charts</li>
              <li>• Area Charts</li>
              <li>• Color customization</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">Pro Plan</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• All Basic features</li>
              <li>• Pie Charts</li>
              <li>• Scatter Charts</li>
              <li>• TreeMap Charts</li>
              <li>• Full customization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedChartShowcase;