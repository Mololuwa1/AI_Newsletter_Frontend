import React, { useState } from 'react';
import { X, BarChart3, TrendingUp, PieChart, Target, ScatterChart as Scatter, Crown, Lock } from 'lucide-react';
import { UserSubscription } from '../types/subscription';

interface ChartSelectorProps {
  onClose: () => void;
  onSelectChart: (chartType: string, chartData: any) => void;
  subscription: UserSubscription;
}

interface ChartType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'trends' | 'comparisons' | 'composition' | 'distribution';
  tier: 'free' | 'basic' | 'pro';
  preview: string;
}

const ChartSelector: React.FC<ChartSelectorProps> = ({
  onClose,
  onSelectChart,
  subscription
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('trends');

  const chartTypes: ChartType[] = [
    // Free Tier Charts
    {
      id: 'line',
      name: 'Line Chart',
      description: 'Perfect for showing trends over time',
      icon: TrendingUp,
      category: 'trends',
      tier: 'free',
      preview: 'Revenue trends, growth patterns'
    },
    {
      id: 'bar',
      name: 'Bar Chart',
      description: 'Great for comparing different categories',
      icon: BarChart3,
      category: 'comparisons',
      tier: 'free',
      preview: 'Product performance, regional sales'
    },
    
    // Basic Tier Charts
    {
      id: 'gauge',
      name: 'Gauge Chart',
      description: 'Show progress towards goals',
      icon: Target,
      category: 'trends',
      tier: 'basic',
      preview: 'Customer satisfaction, KPI tracking'
    },
    {
      id: 'area',
      name: 'Area Chart',
      description: 'Filled line charts for cumulative data',
      icon: TrendingUp,
      category: 'trends',
      tier: 'basic',
      preview: 'Cumulative revenue, stacked metrics'
    },
    
    // Pro Tier Charts
    {
      id: 'pie',
      name: 'Pie Chart',
      description: 'Show composition and proportions',
      icon: PieChart,
      category: 'composition',
      tier: 'pro',
      preview: 'Market share, budget allocation'
    },
    {
      id: 'donut',
      name: 'Donut Chart',
      description: 'Modern pie chart with center space',
      icon: PieChart,
      category: 'composition',
      tier: 'pro',
      preview: 'Category breakdown, portfolio mix'
    },
    {
      id: 'scatter',
      name: 'Scatter Plot',
      description: 'Show relationships between variables',
      icon: Scatter,
      category: 'distribution',
      tier: 'pro',
      preview: 'Customer satisfaction vs revenue'
    },
    {
      id: 'bubble',
      name: 'Bubble Chart',
      description: 'Three-dimensional scatter plot',
      icon: Scatter,
      category: 'distribution',
      tier: 'pro',
      preview: 'Market position analysis'
    },
    {
      id: 'radar',
      name: 'Radar Chart',
      description: 'Compare multiple quantitative variables',
      icon: Target,
      category: 'comparisons',
      tier: 'pro',
      preview: 'Performance metrics, skill assessment'
    },
    {
      id: 'heatmap',
      name: 'Heatmap',
      description: 'Visualize data density and patterns',
      icon: BarChart3,
      category: 'distribution',
      tier: 'pro',
      preview: 'Time-based patterns, correlation matrix'
    },
    {
      id: 'funnel',
      name: 'Funnel Chart',
      description: 'Show stages in a process',
      icon: TrendingUp,
      category: 'trends',
      tier: 'pro',
      preview: 'Sales funnel, conversion rates'
    },
    {
      id: 'treemap',
      name: 'TreeMap',
      description: 'Hierarchical data visualization',
      icon: BarChart3,
      category: 'composition',
      tier: 'pro',
      preview: 'Budget allocation, portfolio breakdown'
    }
  ];

  const categories = [
    { id: 'trends', name: 'Trends', description: 'Show changes over time' },
    { id: 'comparisons', name: 'Comparisons', description: 'Compare different categories' },
    { id: 'composition', name: 'Composition', description: 'Show parts of a whole' },
    { id: 'distribution', name: 'Distribution', description: 'Show data patterns and relationships' }
  ];

  const getTierOrder = (tier: string) => {
    const order = { free: 0, basic: 1, pro: 2 };
    return order[tier as keyof typeof order] || 0;
  };

  const getUserTierOrder = () => {
    return getTierOrder(subscription.tier);
  };

  const canUseChart = (chartTier: string) => {
    return getUserTierOrder() >= getTierOrder(chartTier);
  };

  const filteredCharts = chartTypes.filter(chart => chart.category === selectedCategory);

  const generateSampleData = (chartType: string) => {
    // Generate appropriate sample data based on chart type
    switch (chartType) {
      case 'line':
      case 'area':
        return [
          { month: 'Jan', value: 2400, previousYear: 2100 },
          { month: 'Feb', value: 2680, previousYear: 2250 },
          { month: 'Mar', value: 2890, previousYear: 2400 },
          { month: 'Apr', value: 3120, previousYear: 2550 },
          { month: 'May', value: 3350, previousYear: 2700 },
          { month: 'Jun', value: 3580, previousYear: 2850 }
        ];
      case 'bar':
        return [
          { category: 'Product A', value: 4500 },
          { category: 'Product B', value: 3200 },
          { category: 'Product C', value: 2800 },
          { category: 'Product D', value: 1900 }
        ];
      case 'pie':
      case 'donut':
        return [
          { name: 'Product A', value: 400 },
          { name: 'Product B', value: 300 },
          { name: 'Product C', value: 200 },
          { name: 'Product D', value: 100 }
        ];
      case 'gauge':
        return { current: 87, target: 90, max: 100 };
      case 'scatter':
      case 'bubble':
        return [
          { x: 100, y: 200, z: 200 },
          { x: 120, y: 100, z: 260 },
          { x: 170, y: 300, z: 400 },
          { x: 140, y: 250, z: 280 }
        ];
      default:
        return [];
    }
  };

  const handleChartSelect = (chartType: string) => {
    if (!canUseChart(chartTypes.find(c => c.id === chartType)?.tier || 'free')) {
      return;
    }

    const sampleData = generateSampleData(chartType);
    onSelectChart(chartType, sampleData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Choose Chart Type</h2>
              <p className="text-gray-600 mt-1">Select the perfect visualization for your data</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Category Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">{category.name}</div>
                  <div className="text-sm text-gray-500 mt-1">{category.description}</div>
                </button>
              ))}
            </div>

            {/* Subscription Info */}
            <div className="mt-6 p-3 bg-white rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-2">Your Plan</h4>
              <div className="text-sm text-gray-600">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Free: Line, Bar charts</span>
                </div>
                {subscription.tier !== 'free' && (
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Basic: + Gauge, Area charts</span>
                  </div>
                )}
                {subscription.tier === 'pro' && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Pro: All advanced charts</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chart Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCharts.map((chart) => {
                const Icon = chart.icon;
                const canUse = canUseChart(chart.tier);
                
                return (
                  <div
                    key={chart.id}
                    className={`relative border-2 rounded-lg p-4 transition-all duration-200 ${
                      canUse
                        ? 'border-gray-200 hover:border-blue-300 hover:shadow-md cursor-pointer'
                        : 'border-gray-200 opacity-60 cursor-not-allowed'
                    }`}
                    onClick={() => handleChartSelect(chart.id)}
                  >
                    {!canUse && (
                      <div className="absolute top-2 right-2">
                        <div className="flex items-center space-x-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                          <Crown className="w-3 h-3" />
                          <span>{chart.tier}</span>
                        </div>
                      </div>
                    )}

                    <div className="text-center">
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${
                        canUse ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${canUse ? 'text-blue-600' : 'text-gray-400'}`} />
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">{chart.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{chart.description}</p>
                      
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-500">{chart.preview}</p>
                      </div>
                    </div>

                    {!canUse && (
                      <div className="absolute inset-0 bg-white bg-opacity-50 rounded-lg flex items-center justify-center">
                        <Lock className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredCharts.length === 0 && (
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No charts available in this category</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartSelector;