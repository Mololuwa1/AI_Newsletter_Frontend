import React, { useState } from 'react';
import { X, Download, Share2, Settings, ZoomIn, BarChart3, TrendingUp, Crown } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { UserSubscription } from '../types/subscription';

interface ChartDetailModalProps {
  chart: any;
  onClose: () => void;
  subscription: UserSubscription;
}

const ChartDetailModal: React.FC<ChartDetailModalProps> = ({
  chart,
  onClose,
  subscription
}) => {
  const [viewMode, setViewMode] = useState<'chart' | 'data' | 'insights'>('chart');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  
  const canCustomizeCharts = subscription.tier !== 'free';
  const canExportCharts = subscription.tier !== 'free';

  const generateAdditionalInsights = () => {
    // Simulate AI-generated insights
    return [
      "Revenue shows consistent upward trajectory with 15% quarter-over-quarter growth",
      "Peak performance in June suggests successful Q2 marketing campaigns",
      "Year-over-year comparison indicates 23% improvement in overall performance",
      "Trend analysis predicts continued growth through Q3 with projected 18% increase"
    ];
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Chart Analysis</h2>
              <p className="text-gray-600 mt-1">Detailed view and insights</p>
            </div>
            <div className="flex items-center space-x-2">
              {canExportCharts && (
                <>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <div className="space-y-2">
              <button
                onClick={() => setViewMode('chart')}
                className={`w-full flex items-center space-x-2 p-3 rounded-lg text-left transition-colors ${
                  viewMode === 'chart' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span>Chart View</span>
              </button>
              
              <button
                onClick={() => setViewMode('data')}
                className={`w-full flex items-center space-x-2 p-3 rounded-lg text-left transition-colors ${
                  viewMode === 'data' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Raw Data</span>
              </button>
              
              <button
                onClick={() => setViewMode('insights')}
                className={`w-full flex items-center space-x-2 p-3 rounded-lg text-left transition-colors ${
                  viewMode === 'insights' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                <span>AI Insights</span>
              </button>
            </div>

            {/* Chart Type Controls */}
            {viewMode === 'chart' && canCustomizeCharts && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Chart Type</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setChartType('line')}
                    className={`w-full p-2 text-left rounded ${
                      chartType === 'line' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    Line Chart
                  </button>
                  <button
                    onClick={() => setChartType('bar')}
                    className={`w-full p-2 text-left rounded ${
                      chartType === 'bar' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    Bar Chart
                  </button>
                </div>
              </div>
            )}

            {!canCustomizeCharts && (
              <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2 text-yellow-800">
                  <Crown className="w-4 h-4" />
                  <span className="text-sm font-medium">Pro Feature</span>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  Upgrade to customize chart types and export options
                </p>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {viewMode === 'chart' && (
              <div>
                <div className="h-96 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'line' ? (
                      <LineChart data={chart?.data || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={formatCurrency} />
                        <Tooltip 
                          formatter={(value: number) => [formatCurrency(value), '']}
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
                        />
                        <Line 
                          type="monotone" 
                          dataKey="previousYear" 
                          stroke="#94a3b8" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ fill: '#94a3b8', strokeWidth: 2, r: 3 }}
                        />
                      </LineChart>
                    ) : (
                      <BarChart data={chart?.data || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={formatCurrency} />
                        <Tooltip 
                          formatter={(value: number) => [formatCurrency(value), '']}
                          contentStyle={{ 
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>

                {chart?.narrative && (
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                    <h4 className="font-semibold text-blue-900 mb-2">Chart Analysis</h4>
                    <p className="text-blue-800 text-sm leading-relaxed">{chart.narrative}</p>
                  </div>
                )}
              </div>
            )}

            {viewMode === 'data' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Raw Data</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        {chart?.data?.[0] && Object.keys(chart.data[0]).map((key) => (
                          <th key={key} className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {chart?.data?.map((row: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {Object.values(row).map((value: any, cellIndex) => (
                            <td key={cellIndex} className="px-4 py-3 text-sm text-gray-900 border-b">
                              {typeof value === 'number' && cellIndex > 0 ? formatCurrency(value) : value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {viewMode === 'insights' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Generated Insights</h3>
                <div className="space-y-4">
                  {generateAdditionalInsights().map((insight, index) => (
                    <div key={index} className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <p className="text-purple-800 text-sm leading-relaxed">{insight}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {subscription.tier === 'free' && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-yellow-800 mb-2">
                      <Crown className="w-5 h-5" />
                      <span className="font-medium">Upgrade for More Insights</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Get deeper AI analysis, custom insights, and advanced chart interactions with our paid plans.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartDetailModal;