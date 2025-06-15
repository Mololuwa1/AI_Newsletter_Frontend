import React from 'react';
import { TrendingUp, TrendingDown, Target, Users, DollarSign, Star } from 'lucide-react';

interface KPIMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
  target?: string;
  progress?: number;
}

interface KPIDashboardProps {
  metrics: KPIMetric[];
  narrative?: string;
}

const KPIDashboard: React.FC<KPIDashboardProps> = ({ metrics, narrative }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50';
      case 'down':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-6">Key Performance Indicators</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${metric.color}`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(metric.trend)}`}>
                  {getTrendIcon(metric.trend)}
                  <span>{metric.change}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <h5 className="text-sm font-medium text-gray-600">{metric.title}</h5>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                {metric.target && (
                  <p className="text-xs text-gray-500">Target: {metric.target}</p>
                )}
              </div>
              
              {metric.progress !== undefined && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{metric.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        metric.progress >= 80 ? 'bg-green-500' : 
                        metric.progress >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(metric.progress, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {narrative && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-400">
          <p className="text-sm text-indigo-800 leading-relaxed">{narrative}</p>
        </div>
      )}
    </div>
  );
};

export default KPIDashboard;