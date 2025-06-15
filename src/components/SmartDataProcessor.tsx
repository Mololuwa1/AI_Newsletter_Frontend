import React, { useState } from 'react';
import { Brain, TrendingUp, BarChart3, PieChart, LineChart, Target, Users, DollarSign } from 'lucide-react';

interface DataInsight {
  type: 'trend' | 'correlation' | 'anomaly' | 'summary';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  metric?: string;
  value?: string | number;
  change?: number;
}

interface SmartDataProcessor {
  insights: DataInsight[];
  metrics: {
    totalRevenue?: number;
    growthRate?: number;
    customerCount?: number;
    avgSatisfaction?: number;
  };
  recommendations: string[];
  chartSuggestions: {
    type: 'line' | 'bar' | 'pie' | 'gauge';
    title: string;
    description: string;
    dataColumns: string[];
  }[];
}

interface DataFile {
  id: string;
  name: string;
  data: any[][];
  headers: string[];
}

interface SmartDataProcessorProps {
  files: DataFile[];
  columnMappings: Record<string, Record<string, any>>;
  onInsightsGenerated: (insights: SmartDataProcessor) => void;
}

const SmartDataProcessorComponent: React.FC<SmartDataProcessorProps> = ({
  files,
  columnMappings,
  onInsightsGenerated
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<SmartDataProcessor | null>(null);

  const identifyMetrics = (file: DataFile, mapping: Record<string, any>) => {
    const metrics: any = {};
    
    file.headers.forEach((header, index) => {
      const column = mapping[header];
      if (!column) return;
      
      const values = file.data.map(row => row[index]).filter(v => v && v.trim());
      
      switch (column.key) {
        case 'revenue':
          const revenueValues = values.map(v => parseFloat(v.toString().replace(/[$,]/g, '')));
          metrics.totalRevenue = revenueValues.reduce((sum, val) => sum + (isNaN(val) ? 0 : val), 0);
          break;
          
        case 'growth':
          const growthValues = values.map(v => parseFloat(v.toString().replace('%', '')));
          metrics.growthRate = growthValues.reduce((sum, val) => sum + (isNaN(val) ? 0 : val), 0) / growthValues.length;
          break;
          
        case 'customers':
          const customerValues = values.map(v => parseInt(v.toString().replace(/,/g, '')));
          metrics.customerCount = customerValues.reduce((sum, val) => sum + (isNaN(val) ? 0 : val), 0);
          break;
          
        case 'satisfaction':
          const satisfactionValues = values.map(v => parseFloat(v.toString()));
          metrics.avgSatisfaction = satisfactionValues.reduce((sum, val) => sum + (isNaN(val) ? 0 : val), 0) / satisfactionValues.length;
          break;
      }
    });
    
    return metrics;
  };

  const generateInsights = (file: DataFile, mapping: Record<string, any>, metrics: any): DataInsight[] => {
    const insights: DataInsight[] = [];
    
    // Revenue trend analysis
    if (metrics.totalRevenue) {
      insights.push({
        type: 'summary',
        title: 'Revenue Performance',
        description: `Total revenue of $${metrics.totalRevenue.toLocaleString()} indicates ${metrics.totalRevenue > 1000000 ? 'strong' : 'moderate'} business performance.`,
        confidence: 0.9,
        impact: 'high',
        metric: 'Total Revenue',
        value: `$${metrics.totalRevenue.toLocaleString()}`
      });
    }
    
    // Growth rate analysis
    if (metrics.growthRate) {
      const growthImpact = metrics.growthRate > 15 ? 'high' : metrics.growthRate > 5 ? 'medium' : 'low';
      insights.push({
        type: 'trend',
        title: 'Growth Trajectory',
        description: `Average growth rate of ${metrics.growthRate.toFixed(1)}% suggests ${growthImpact} momentum.`,
        confidence: 0.85,
        impact: growthImpact,
        metric: 'Growth Rate',
        value: `${metrics.growthRate.toFixed(1)}%`,
        change: metrics.growthRate
      });
    }
    
    // Customer satisfaction analysis
    if (metrics.avgSatisfaction) {
      const satisfactionLevel = metrics.avgSatisfaction > 4.5 ? 'excellent' : metrics.avgSatisfaction > 4 ? 'good' : 'needs improvement';
      insights.push({
        type: 'summary',
        title: 'Customer Satisfaction',
        description: `Average satisfaction score of ${metrics.avgSatisfaction.toFixed(1)} indicates ${satisfactionLevel} customer experience.`,
        confidence: 0.8,
        impact: metrics.avgSatisfaction > 4 ? 'medium' : 'high',
        metric: 'Satisfaction Score',
        value: metrics.avgSatisfaction.toFixed(1)
      });
    }
    
    // Data quality insights
    const totalCells = file.data.length * file.headers.length;
    const emptyCells = file.data.flat().filter(cell => !cell || !cell.toString().trim()).length;
    const completeness = ((totalCells - emptyCells) / totalCells) * 100;
    
    if (completeness < 90) {
      insights.push({
        type: 'anomaly',
        title: 'Data Completeness',
        description: `Data is ${completeness.toFixed(1)}% complete. Consider addressing missing values for better analysis.`,
        confidence: 0.95,
        impact: completeness < 70 ? 'high' : 'medium'
      });
    }
    
    return insights;
  };

  const generateChartSuggestions = (file: DataFile, mapping: Record<string, any>) => {
    const suggestions = [];
    const mappedColumns = Object.entries(mapping);
    
    // Revenue over time
    const hasRevenue = mappedColumns.some(([_, col]) => col.key === 'revenue');
    const hasDate = mappedColumns.some(([_, col]) => col.key === 'date');
    
    if (hasRevenue && hasDate) {
      suggestions.push({
        type: 'line' as const,
        title: 'Revenue Trend Over Time',
        description: 'Track revenue performance across time periods',
        dataColumns: ['date', 'revenue']
      });
    }
    
    // Product performance
    const hasProduct = mappedColumns.some(([_, col]) => col.key === 'product');
    if (hasRevenue && hasProduct) {
      suggestions.push({
        type: 'bar' as const,
        title: 'Revenue by Product',
        description: 'Compare revenue performance across different products',
        dataColumns: ['product', 'revenue']
      });
    }
    
    // Customer satisfaction gauge
    const hasSatisfaction = mappedColumns.some(([_, col]) => col.key === 'satisfaction');
    if (hasSatisfaction) {
      suggestions.push({
        type: 'gauge' as const,
        title: 'Customer Satisfaction Score',
        description: 'Display current satisfaction level with target benchmarks',
        dataColumns: ['satisfaction']
      });
    }
    
    // Growth rate visualization
    const hasGrowth = mappedColumns.some(([_, col]) => col.key === 'growth');
    if (hasGrowth && hasDate) {
      suggestions.push({
        type: 'line' as const,
        title: 'Growth Rate Trend',
        description: 'Monitor growth rate changes over time',
        dataColumns: ['date', 'growth']
      });
    }
    
    return suggestions;
  };

  const generateRecommendations = (insights: DataInsight[], metrics: any): string[] => {
    const recommendations = [];
    
    if (metrics.growthRate && metrics.growthRate < 5) {
      recommendations.push('Consider implementing growth strategies to improve performance above 5% threshold');
    }
    
    if (metrics.avgSatisfaction && metrics.avgSatisfaction < 4) {
      recommendations.push('Focus on customer experience improvements to boost satisfaction scores');
    }
    
    if (metrics.totalRevenue && metrics.customerCount) {
      const revenuePerCustomer = metrics.totalRevenue / metrics.customerCount;
      if (revenuePerCustomer < 100) {
        recommendations.push('Explore opportunities to increase average revenue per customer');
      }
    }
    
    const dataQualityInsight = insights.find(i => i.title === 'Data Completeness');
    if (dataQualityInsight) {
      recommendations.push('Improve data collection processes to reduce missing values');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Data shows healthy business metrics - continue monitoring key performance indicators');
    }
    
    return recommendations;
  };

  const processData = async () => {
    setIsProcessing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const allInsights: DataInsight[] = [];
      const allMetrics: any = {};
      const allChartSuggestions: any[] = [];
      
      files.forEach(file => {
        const mapping = columnMappings[file.id];
        if (!mapping) return;
        
        const metrics = identifyMetrics(file, mapping);
        const insights = generateInsights(file, mapping, metrics);
        const chartSuggestions = generateChartSuggestions(file, mapping);
        
        allInsights.push(...insights);
        Object.assign(allMetrics, metrics);
        allChartSuggestions.push(...chartSuggestions);
      });
      
      const recommendations = generateRecommendations(allInsights, allMetrics);
      
      const result: SmartDataProcessor = {
        insights: allInsights,
        metrics: allMetrics,
        recommendations,
        chartSuggestions: allChartSuggestions
      };
      
      setProcessedData(result);
      onInsightsGenerated(result);
    } catch (error) {
      console.error('Error processing data:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return TrendingUp;
      case 'correlation': return BarChart3;
      case 'anomaly': return Target;
      case 'summary': return PieChart;
      default: return Brain;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'line': return LineChart;
      case 'bar': return BarChart3;
      case 'pie': return PieChart;
      case 'gauge': return Target;
      default: return BarChart3;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Smart Data Processing</h3>
          <p className="text-gray-600">AI-powered insights and recommendations from your data</p>
        </div>
        
        <button
          onClick={processData}
          disabled={isProcessing || files.length === 0}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            isProcessing || files.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          <Brain className={`w-5 h-5 ${isProcessing ? 'animate-pulse' : ''}`} />
          <span>{isProcessing ? 'Processing...' : 'Generate Insights'}</span>
        </button>
      </div>

      {isProcessing && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            <div>
              <h4 className="font-medium text-purple-900">Analyzing your data...</h4>
              <p className="text-sm text-purple-700">Identifying patterns, trends, and generating insights</p>
            </div>
          </div>
        </div>
      )}

      {processedData && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {processedData.metrics.totalRevenue && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${processedData.metrics.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {processedData.metrics.growthRate && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Avg Growth Rate</p>
                    <p className="text-xl font-bold text-gray-900">
                      {processedData.metrics.growthRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {processedData.metrics.customerCount && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Users className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Customers</p>
                    <p className="text-xl font-bold text-gray-900">
                      {processedData.metrics.customerCount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {processedData.metrics.avgSatisfaction && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Target className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Satisfaction</p>
                    <p className="text-xl font-bold text-gray-900">
                      {processedData.metrics.avgSatisfaction.toFixed(1)}/5.0
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Insights */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">AI-Generated Insights</h4>
            <div className="space-y-4">
              {processedData.insights.map((insight, index) => {
                const Icon = getInsightIcon(insight.type);
                return (
                  <div key={index} className={`border rounded-lg p-4 ${getImpactColor(insight.impact)}`}>
                    <div className="flex items-start space-x-3">
                      <Icon className="w-5 h-5 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{insight.title}</h5>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs px-2 py-1 bg-white rounded">
                              {Math.round(insight.confidence * 100)}% confidence
                            </span>
                            <span className="text-xs px-2 py-1 bg-white rounded capitalize">
                              {insight.impact} impact
                            </span>
                          </div>
                        </div>
                        <p className="text-sm">{insight.description}</p>
                        {insight.metric && insight.value && (
                          <div className="mt-2 text-sm font-medium">
                            {insight.metric}: {insight.value}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart Suggestions */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Recommended Visualizations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {processedData.chartSuggestions.map((suggestion, index) => {
                const Icon = getChartIcon(suggestion.type);
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <Icon className="w-6 h-6 text-blue-600 mt-1" />
                      <div>
                        <h5 className="font-medium text-gray-900">{suggestion.title}</h5>
                        <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">
                            Data: {suggestion.dataColumns.join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-900 mb-4">Strategic Recommendations</h4>
            <ul className="space-y-2">
              {processedData.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start space-x-2 text-blue-800">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartDataProcessorComponent;

