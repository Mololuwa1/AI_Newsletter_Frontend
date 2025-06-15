import React, { useState } from 'react';
import { Mail, TrendingUp, TrendingDown, Minus, Download, Share2, Crown, Edit3 } from 'lucide-react';
import InteractiveSection from './InteractiveSection';
import RevenueChart from './charts/RevenueChart';
import CustomerGrowthChart from './charts/CustomerGrowthChart';
import SatisfactionGauge from './charts/SatisfactionGauge';
import ProductPerformanceChart from './charts/ProductPerformanceChart';
import SubscriptionBadge from './SubscriptionBadge';
import InteractiveNewsletterEditor from './InteractiveNewsletterEditor';
import { UserSubscription } from '../types/subscription';

interface NewsletterData {
  company: string;
  date: string;
  executiveSummary: string;
  performanceMetrics: Array<{
    metric: string;
    value: string;
    trend: 'up' | 'down' | 'neutral';
  }>;
  marketInsights: string;
  keyHighlights: string[];
  charts?: {
    revenue?: {
      data: Array<{
        month: string;
        revenue: number;
        previousYear: number;
      }>;
      narrative: string;
    };
    customerGrowth?: {
      data: Array<{
        month: string;
        newCustomers: number;
        totalCustomers: number;
      }>;
      narrative: string;
    };
    satisfaction?: {
      score: number;
      target: number;
      narrative: string;
    };
    productPerformance?: {
      data: Array<{
        product: string;
        revenue: number;
        units: number;
      }>;
      narrative: string;
    };
  };
}

interface NewsletterPreviewProps {
  data: NewsletterData;
  onClose?: () => void;
  subscription: UserSubscription;
}

const NewsletterPreview: React.FC<NewsletterPreviewProps> = ({ data, onClose, subscription }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(data);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'down':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const canExportPDF = subscription.tier !== 'free';
  const hasWatermark = subscription.tier === 'free';
  const canEdit = subscription.tier !== 'free';

  const handleSaveEdits = (newData: any) => {
    setEditedData(newData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <InteractiveNewsletterEditor
        data={editedData}
        subscription={subscription}
        onSave={handleSaveEdits}
        onClose={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Interactive Business Newsletter</h1>
              <div className="flex items-center space-x-2 text-blue-100">
                <span>{editedData.company} • {editedData.date}</span>
                <SubscriptionBadge tier={subscription.tier} size="sm" />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {canEdit && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                title="Edit Newsletter"
              >
                <Edit3 className="w-4 h-4" />
                <span className="text-sm">Edit</span>
              </button>
            )}
            <button 
              className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
              title="Download Email"
            >
              <Download className="w-5 h-5" />
            </button>
            {canExportPDF && (
              <button 
                className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                title="Export PDF (Basic+)"
              >
                <Crown className="w-5 h-5" />
              </button>
            )}
            <button className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Watermark for Free Tier */}
      {hasWatermark && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-yellow-800">
              <strong>Free Plan:</strong> This newsletter includes a watermark. Upgrade to remove it and unlock advanced features.
            </p>
            <SubscriptionBadge tier="free" size="sm" />
          </div>
        </div>
      )}

      {/* Interactive Editor Notice */}
      {!canEdit && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-800">
              <strong>Upgrade to Basic or Pro</strong> to unlock the interactive editor with drag-and-drop, text editing, and custom insights.
            </p>
            <Crown className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      )}

      <div className="p-8">
        {/* Executive Summary */}
        <InteractiveSection 
          title="Executive Summary" 
          colorScheme="blue"
          showDataToggle={true}
          rawData={{ summary: editedData.executiveSummary, generatedAt: new Date().toISOString() }}
        >
          <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-blue-600">
            <p className="text-gray-700 leading-relaxed">{editedData.executiveSummary}</p>
          </div>
        </InteractiveSection>

        {/* Performance Update with Charts */}
        <InteractiveSection 
          title="Performance Update" 
          colorScheme="green"
          showDataToggle={true}
          rawData={editedData.performanceMetrics}
        >
          {/* Performance Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {editedData.performanceMetrics.map((metric, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${getTrendColor(metric.trend)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">{metric.metric}</span>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="text-2xl font-bold">{metric.value}</div>
              </div>
            ))}
          </div>

          {/* Revenue Chart */}
          {editedData.charts?.revenue && (
            <RevenueChart 
              data={editedData.charts.revenue.data}
              narrative={editedData.charts.revenue.narrative}
            />
          )}

          {/* Customer Growth Chart */}
          {editedData.charts?.customerGrowth && (
            <div className="mt-6">
              <CustomerGrowthChart 
                data={editedData.charts.customerGrowth.data}
                narrative={editedData.charts.customerGrowth.narrative}
              />
            </div>
          )}
        </InteractiveSection>

        {/* Customer Satisfaction - Only for Basic+ */}
        {editedData.charts?.satisfaction && subscription.tier !== 'free' && (
          <InteractiveSection 
            title="Customer Satisfaction Analysis" 
            colorScheme="purple"
            showDataToggle={true}
            rawData={editedData.charts.satisfaction}
          >
            <SatisfactionGauge 
              score={editedData.charts.satisfaction.score}
              target={editedData.charts.satisfaction.target}
              narrative={editedData.charts.satisfaction.narrative}
            />
          </InteractiveSection>
        )}

        {/* Market Insights */}
        <InteractiveSection 
          title="Market Insights" 
          colorScheme="purple"
          showDataToggle={true}
          rawData={{ insights: editedData.marketInsights, analysisDate: new Date().toISOString() }}
        >
          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200 mb-6">
            <p className="text-gray-700 leading-relaxed">{editedData.marketInsights}</p>
          </div>

          {/* Product Performance Chart */}
          {editedData.charts?.productPerformance && (
            <ProductPerformanceChart 
              data={editedData.charts.productPerformance.data}
              narrative={editedData.charts.productPerformance.narrative}
            />
          )}
        </InteractiveSection>

        {/* Key Highlights */}
        <InteractiveSection 
          title="Key Highlights" 
          colorScheme="orange"
          showDataToggle={true}
          rawData={editedData.keyHighlights}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editedData.keyHighlights.map((highlight, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg border border-orange-200 transition-all duration-200 hover:shadow-md hover:bg-orange-100"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-gray-700">{highlight}</p>
              </div>
            ))}
          </div>
        </InteractiveSection>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Generated by AI Newsletter Generator Pro • {new Date().toLocaleDateString()}
            {hasWatermark && ' • Free Plan'}
          </p>
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <span>📊 Interactive Charts</span>
            <span>🔍 Expandable Sections</span>
            <span>📈 Real-time Insights</span>
            {subscription.tier !== 'free' && <span>✏️ Interactive Editor</span>}
            {subscription.tier !== 'free' && <span>👑 Premium Features</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPreview;