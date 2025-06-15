import React, { useState } from 'react';
import { X, Sparkles, Plus, TrendingUp, BarChart3, Users, DollarSign } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface AIInsightGeneratorProps {
  sections: any[];
  onClose: () => void;
  onAddInsight: (insight: string) => void;
}

const AIInsightGenerator: React.FC<AIInsightGeneratorProps> = ({
  sections,
  onClose,
  onAddInsight
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedInsightType, setSelectedInsightType] = useState<string>('');
  const [generatedInsights, setGeneratedInsights] = useState<string[]>([]);

  const insightTypes = [
    {
      id: 'trends',
      name: 'Trend Analysis',
      icon: TrendingUp,
      description: 'Identify patterns and trends in your data'
    },
    {
      id: 'performance',
      name: 'Performance Insights',
      icon: BarChart3,
      description: 'Analyze key performance indicators'
    },
    {
      id: 'customer',
      name: 'Customer Insights',
      icon: Users,
      description: 'Understand customer behavior and satisfaction'
    },
    {
      id: 'financial',
      name: 'Financial Analysis',
      icon: DollarSign,
      description: 'Deep dive into financial metrics and projections'
    }
  ];

  const generateInsights = async (type: string) => {
    setIsGenerating(true);
    setSelectedInsightType(type);

    // Simulate AI insight generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockInsights = {
      trends: [
        "Revenue growth has accelerated by 23% over the past quarter, indicating strong market momentum.",
        "Customer acquisition costs have decreased by 15% while retention rates improved by 8%.",
        "Seasonal patterns suggest Q4 will see a 30% increase in demand based on historical data."
      ],
      performance: [
        "Your conversion rate of 4.2% exceeds industry average by 40%, suggesting effective marketing strategies.",
        "Product performance analysis reveals that premium offerings drive 60% of total revenue.",
        "Operational efficiency has improved by 18% through recent process optimizations."
      ],
      customer: [
        "Customer satisfaction scores correlate strongly with repeat purchase behavior (R² = 0.87).",
        "High-value customers prefer personalized communication, showing 35% higher engagement rates.",
        "Customer lifetime value has increased by 22% following the implementation of loyalty programs."
      ],
      financial: [
        "Cash flow projections indicate sustainable growth with 6 months of runway at current burn rate.",
        "Profit margins have improved by 12% due to strategic cost optimization initiatives.",
        "Investment in R&D shows strong ROI with new products contributing 25% of revenue."
      ]
    };

    setGeneratedInsights(mockInsights[type as keyof typeof mockInsights] || []);
    setIsGenerating(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">AI Insight Generator</h2>
                <p className="text-gray-600 mt-1">Generate intelligent insights from your newsletter data</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!selectedInsightType ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Insight Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insightTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => generateInsights(type.id)}
                      className="p-6 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Icon className="w-5 h-5 text-purple-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900">{type.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : isGenerating ? (
            <div className="text-center py-12">
              <LoadingSpinner size="lg" text="Generating AI insights..." />
              <p className="text-gray-600 mt-4">
                Analyzing your data and generating intelligent insights...
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Generated Insights</h3>
                <button
                  onClick={() => {
                    setSelectedInsightType('');
                    setGeneratedInsights([]);
                  }}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  Generate Different Type
                </button>
              </div>

              <div className="space-y-4">
                {generatedInsights.map((insight, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium text-purple-700">AI Insight</span>
                        </div>
                        <p className="text-gray-800 leading-relaxed">{insight}</p>
                      </div>
                      <button
                        onClick={() => onAddInsight(insight)}
                        className="ml-4 flex items-center space-x-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">💡 Pro Tip</h4>
                <p className="text-sm text-blue-800">
                  These AI-generated insights are based on your newsletter data. 
                  You can add them directly to your newsletter or use them as inspiration for custom content.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInsightGenerator;