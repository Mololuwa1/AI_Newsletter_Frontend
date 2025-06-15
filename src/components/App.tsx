import React, { useState } from 'react';
import { FileText, Zap, Database, Mail, Github, ExternalLink, Settings, Crown } from 'lucide-react';
import QuickDemo from './QuickDemo';
import DataUpload from './DataUpload';
import SampleDataViewer from './SampleDataViewer';
import NewsletterPreview from './NewsletterPreview';
import PricingModal from './PricingModal';
import GenerationLimitBanner from './GenerationLimitBanner';
import SubscriptionBadge from "./SubscriptionBadge";
import AdvancedChartShowcase from './components/charts/AdvancedChartShowcase';
import { useSubscription } from './hooks/useSubscription';
import { SubscriptionTier } from './types/subscription';

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

function App() {
  const [activeTab, setActiveTab] = useState<'demo' | 'upload' | 'data' | 'charts'>('demo');
  const [generatedNewsletter, setGeneratedNewsletter] = useState<NewsletterData | null>(null);
  const [showPricing, setShowPricing] = useState(false);
  const { subscription, canGenerate, incrementGeneration, upgradeSubscription, loading } = useSubscription();

  const handleGenerateNewsletter = (data: NewsletterData) => {
    if (!canGenerate()) {
      setShowPricing(true);
      return;
    }
    
    // Add watermark for free tier
    if (subscription.tier === 'free') {
      data.company = `${data.company} (Generated with AI Newsletter Generator - Free Plan)`;
    }
    
    incrementGeneration();
    setGeneratedNewsletter(data);
  };

  const handleCloseNewsletter = () => {
    setGeneratedNewsletter(null);
  };

  const handleUpgrade = (tier: SubscriptionTier) => {
    upgradeSubscription(tier);
    setShowPricing(false);
  };

  const tabs = [
    {
      id: 'demo' as const,
      label: 'Quick Demo',
      icon: Zap,
      description: 'Generate a sample newsletter instantly'
    },
    {
      id: 'upload' as const,
      label: 'Upload Data',
      icon: FileText,
      description: 'Upload your CSV files for custom newsletters'
    },
    {
      id: 'data' as const,
      label: 'Sample Data',
      icon: Database,
      description: 'View the sample business data structure'
    },
    {
      id: 'charts' as const,
      label: 'Advanced Charts',
      icon: Crown,
      description: 'Explore premium chart types and visualizations'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Newsletter Generator Pro</h1>
                <p className="text-sm text-gray-500">Transform data into business insights</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <SubscriptionBadge tier={subscription.tier} />
              <button
                onClick={() => setShowPricing(true)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span className="hidden sm:inline">Manage Plan</span>
              </button>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!generatedNewsletter ? (
          <>
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Transform Your Data Into 
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Professional Newsletters</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Leverage AI to automatically generate comprehensive business newsletters from your data. 
                Get executive summaries, performance metrics, and market insights with advanced visualizations.
              </p>
            </div>

            {/* Generation Limit Banner */}
            <GenerationLimitBanner 
              subscription={subscription}
              onUpgrade={() => setShowPricing(true)}
            />

            {/* Navigation Tabs */}
            <div className="flex flex-col sm:flex-row justify-center mb-8 space-y-2 sm:space-y-0 sm:space-x-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isAdvanced = tab.id === 'charts';
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 relative ${
                      activeTab === tab.id
                        ? 'bg-white text-blue-600 shadow-lg border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                    {isAdvanced && (
                      <Crown className="w-4 h-4 text-purple-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Description */}
            <div className="text-center mb-8">
              <p className="text-gray-600">
                {tabs.find(tab => tab.id === activeTab)?.description}
              </p>
            </div>

            {/* Tab Content */}
            <div className="max-w-4xl mx-auto">
              {activeTab === 'demo' && (
                <QuickDemo 
                  onGenerateNewsletter={handleGenerateNewsletter}
                  canGenerate={canGenerate()}
                  subscription={subscription}
                />
              )}
              {activeTab === 'upload' && (
                <DataUpload 
                  onGenerateNewsletter={handleGenerateNewsletter}
                  canGenerate={canGenerate()}
                  subscription={subscription}
                />
              )}
              {activeTab === 'data' && (
                <SampleDataViewer />
              )}
              {activeTab === 'charts' && (
                <AdvancedChartShowcase
                  currentTier={subscription.tier}
                  onUpgrade={() => setShowPricing(true)}
                />
              )}
            </div>

            {/* Features Section */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Generation</h3>
                <p className="text-gray-600">Generate professional newsletters in seconds with advanced AI analysis and insights.</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Visualizations</h3>
                <p className="text-gray-600">Interactive charts, gauges, and advanced data visualizations that bring your data to life.</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Features</h3>
                <p className="text-gray-600">Custom branding, advanced exports, and premium templates for enterprise-grade newsletters.</p>
              </div>
            </div>
          </>
        ) : (
          /* Newsletter Preview */
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <button
                onClick={handleCloseNewsletter}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span>←</span>
                <span>Back to Dashboard</span>
              </button>
            </div>
            <NewsletterPreview 
              data={generatedNewsletter} 
              onClose={handleCloseNewsletter}
              subscription={subscription}
            />
          </div>
        )}
      </div>

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
        onSelectPlan={handleUpgrade}
        currentTier={subscription.tier}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              Built with AI-powered data analysis • Designed for modern businesses
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Transform your data into actionable insights with beautiful, professional newsletters
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;