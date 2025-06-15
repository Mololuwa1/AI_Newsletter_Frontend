import React, { useState } from 'react';
import { Zap, TrendingUp, Lock } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { UserSubscription } from '../types/subscription';

interface QuickDemoProps {
  onGenerateNewsletter: (data: any) => void;
  canGenerate: boolean;
  subscription: UserSubscription;
}

const QuickDemo: React.FC<QuickDemoProps> = ({ onGenerateNewsletter, canGenerate, subscription }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleQuickDemo = async () => {
    if (!canGenerate) return;
    
    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Enhanced sample newsletter data with charts based on subscription tier
    const sampleNewsletter = {
      company: "TechCorp Inc.",
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      executiveSummary: "Q4 2024 has been a transformative quarter for TechCorp Inc. Our revenue grew by 15% compared to Q3, driven by strong performance in our cloud services division. Customer satisfaction scores reached an all-time high of 94%, while our new product launches exceeded expectations. The integration of AI-powered analytics has significantly improved our operational efficiency and customer insights.",
      performanceMetrics: [
        { metric: "Revenue Growth", value: "+15%", trend: "up" },
        { metric: "Customer Satisfaction", value: "94%", trend: "up" },
        { metric: "Market Share", value: "23%", trend: "up" },
        { metric: "Operating Margin", value: "28%", trend: "up" }
      ],
      marketInsights: "The tech industry continues to show resilience with AI and cloud computing leading growth. Our strategic investments in machine learning capabilities position us well for 2025. Market analysts predict a 20% growth in our sector over the next 12 months, with particular strength in enterprise AI solutions and cloud infrastructure services.",
      keyHighlights: [
        "Launched new AI-powered analytics platform with 40% faster processing",
        "Expanded operations to 3 new international markets",
        "Completed strategic acquisition of DataFlow Solutions for $50M",
        "Achieved ISO 27001 security certification across all divisions"
      ],
      charts: {
        revenue: {
          data: [
            { month: 'Jan', revenue: 2450000, previousYear: 2100000 },
            { month: 'Feb', revenue: 2680000, previousYear: 2250000 },
            { month: 'Mar', revenue: 2890000, previousYear: 2400000 },
            { month: 'Apr', revenue: 3120000, previousYear: 2550000 },
            { month: 'May', revenue: 3350000, previousYear: 2700000 },
            { month: 'Jun', revenue: 3580000, previousYear: 2850000 }
          ],
          narrative: "Revenue demonstrates consistent upward trajectory with 15% quarter-over-quarter growth. The significant acceleration in May and June reflects successful product launches and market expansion initiatives."
        },
        customerGrowth: {
          data: [
            { month: 'Jan', newCustomers: 145, totalCustomers: 2340 },
            { month: 'Feb', newCustomers: 167, totalCustomers: 2507 },
            { month: 'Mar', newCustomers: 189, totalCustomers: 2696 },
            { month: 'Apr', newCustomers: 203, totalCustomers: 2899 },
            { month: 'May', newCustomers: 234, totalCustomers: 3133 },
            { month: 'Jun', newCustomers: 267, totalCustomers: 3400 }
          ],
          narrative: "Customer acquisition accelerated significantly in Q2, with new customer growth increasing by 84% compared to Q1. This reflects the success of our enhanced marketing campaigns and improved product offerings."
        },
        // Only include satisfaction gauge for Basic+ tiers
        ...(subscription.tier !== 'free' && {
          satisfaction: {
            score: 94,
            target: 90,
            narrative: "Customer satisfaction exceeded our target of 90%, reaching an impressive 94%. This represents a 6-point improvement from last quarter, driven by enhanced customer support and product reliability improvements."
          }
        }),
        productPerformance: {
          data: [
            { product: 'AI Analytics', revenue: 1250000, units: 450 },
            { product: 'Cloud Platform', revenue: 980000, units: 320 },
            { product: 'Data Solutions', revenue: 750000, units: 280 },
            { product: 'Security Suite', revenue: 650000, units: 190 },
            { product: 'Mobile App', revenue: 420000, units: 850 }
          ],
          narrative: "AI Analytics leads revenue generation, contributing 35% of total product revenue. The strong performance across all product lines demonstrates our diversified portfolio strength and market demand for our solutions."
        }
      }
    };
    
    setIsGenerating(false);
    onGenerateNewsletter(sampleNewsletter);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Interactive Demo</h2>
      </div>
      
      <p className="text-gray-600 mb-6 leading-relaxed">
        Experience the power of AI-generated business newsletters with interactive charts and dynamic insights. 
        Click below to generate a comprehensive sample newsletter featuring advanced data visualizations, 
        expandable sections, and actionable business intelligence.
      </p>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6 border border-blue-200">
        <h3 className="font-semibold text-gray-800 mb-3">✨ Features in Your Plan:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Interactive revenue & growth charts</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Product performance analytics</span>
          </div>
          {subscription.tier !== 'free' ? (
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>Customer satisfaction gauge</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Lock className="w-3 h-3 text-gray-400" />
              <span className="text-gray-500">Customer satisfaction gauge (Basic+)</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            <span>Expandable sections with raw data</span>
          </div>
        </div>
        
        {subscription.tier === 'free' && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Free Plan:</strong> Generated newsletters will include a watermark. 
              Upgrade to remove watermarks and unlock advanced chart types.
            </p>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={handleQuickDemo}
          disabled={isGenerating || !canGenerate}
          className={`flex items-center space-x-2 font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 ${
            !canGenerate 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          {isGenerating ? (
            <LoadingSpinner size="sm" text="" />
          ) : !canGenerate ? (
            <Lock className="w-5 h-5" />
          ) : (
            <TrendingUp className="w-5 h-5" />
          )}
          <span>
            {isGenerating 
              ? 'Generating Interactive Newsletter...' 
              : !canGenerate 
              ? 'Upgrade to Generate More'
              : 'Generate Interactive Newsletter'
            }
          </span>
        </button>
        
        {isGenerating && (
          <div className="text-sm text-gray-500">
            AI is creating charts, analyzing trends, and crafting insights...
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickDemo;