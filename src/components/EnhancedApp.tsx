import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Enhanced Components
import NewsletterWizard from './NewsletterWizard';
import ContentManager from './ContentManager';
import EnhancedDataUpload from './EnhancedDataUpload';
import DataPreview from './DataPreview';
import SmartDataProcessorComponent from './SmartDataProcessor';
import TemplateSelector from './TemplateSelector';
import BrandingOptionsComponent from './BrandingOptions';
import SectionCustomizer from './SectionCustomizer';
import ExportOptions from './ExportOptions';
import ProgressIndicator from './ProgressIndicator';

// Existing Components (imported from original structure)
import PricingModal from './PricingModal';
import SubscriptionBadge from './SubscriptionBadge';
import GenerationLimitBanner from './GenerationLimitBanner';
import { useSubscription } from './useSubscription';

interface NewsletterData {
  company: string;
  date: string;
  executiveSummary: string;
  performanceMetrics: {
    revenue: number;
    growth: number;
    customers: number;
    satisfaction: number;
  };
  marketInsights: string;
  keyHighlights: string[];
  charts?: {
    revenue: any[];
    customerGrowth: any[];
    satisfaction: number;
    productPerformance: any[];
  };
}

interface AppState {
  currentView: 'home' | 'wizard' | 'legacy';
  newsletterData: NewsletterData | null;
  isGenerating: boolean;
  error: string | null;
}

const EnhancedApp: React.FC = () => {
  const { subscription, updateSubscription, canGenerate, generationsUsed, generationLimit } = useSubscription();
  
  const [appState, setAppState] = useState<AppState>({
    currentView: 'home',
    newsletterData: null,
    isGenerating: false,
    error: null
  });

  const [showPricingModal, setShowPricingModal] = useState(false);
  const [wizardData, setWizardData] = useState<any>({});

  // Enhanced newsletter generation with all new features
  const generateNewsletter = async (data: any) => {
    if (!canGenerate()) {
      setShowPricingModal(true);
      return;
    }

    setAppState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      // Simulate API call to backend with enhanced data
      const response = await fetch('/api/generate-enhanced-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: data.content,
          dataFiles: data.data,
          template: data.template,
          branding: data.branding,
          sections: data.sections,
          insights: data.insights,
          userTier: subscription.tier
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate newsletter');
      }

      const newsletterData = await response.json();
      
      setAppState(prev => ({
        ...prev,
        newsletterData,
        isGenerating: false
      }));

      // Update generation count
      updateSubscription({
        generationsUsed: generationsUsed + 1
      });

    } catch (error) {
      setAppState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An error occurred',
        isGenerating: false
      }));
    }
  };

  const handleExport = async (format: string, options: any) => {
    try {
      const response = await fetch('/api/export-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newsletterData: appState.newsletterData,
          format,
          options,
          userTier: subscription.tier
        }),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = options.fileName || `newsletter.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const saveDraft = (data: any) => {
    setWizardData(data);
    localStorage.setItem('newsletter_wizard_draft', JSON.stringify(data));
  };

  const loadDraft = () => {
    const saved = localStorage.getItem('newsletter_wizard_draft');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setWizardData(data);
        return data;
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
    return null;
  };

  useEffect(() => {
    // Load draft on app start
    loadDraft();
  }, []);

  const HomeView = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Newsletter Generator
              </h1>
              <SubscriptionBadge tier={subscription.tier} />
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setAppState(prev => ({ ...prev, currentView: 'legacy' }))}
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                Legacy Mode
              </button>
              <button
                onClick={() => setShowPricingModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Upgrade
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Generation Limit Banner */}
      <GenerationLimitBanner
        generationsUsed={generationsUsed}
        generationLimit={generationLimit}
        tier={subscription.tier}
        onUpgrade={() => setShowPricingModal(true)}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Create Professional Newsletters with AI
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your business data and content into beautiful, professional newsletters 
            with our enhanced AI-powered platform. Now with advanced customization, 
            smart data processing, and multiple export options.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setAppState(prev => ({ ...prev, currentView: 'wizard' }))}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors shadow-lg"
            >
              Start Creating Newsletter
            </button>
            
            <button
              onClick={() => {
                const draft = loadDraft();
                if (draft) {
                  setAppState(prev => ({ ...prev, currentView: 'wizard' }));
                }
              }}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-medium border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Continue Draft
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Rich Text Editor</h3>
            <p className="text-gray-600">Advanced text editing with formatting, sections, and content management.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Data Processing</h3>
            <p className="text-gray-600">Upload CSV/Excel files with AI-powered insights and automatic chart suggestions.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h4a2 2 0 002-2V9a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Templates</h3>
            <p className="text-gray-600">Choose from multiple templates with full branding and customization options.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Step-by-Step Wizard</h3>
            <p className="text-gray-600">Guided workflow with progress tracking and draft saving capabilities.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Multiple Export Options</h3>
            <p className="text-gray-600">Export as HTML, PDF, images, or email templates with sharing capabilities.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Insights</h3>
            <p className="text-gray-600">Automatic data analysis with business insights and recommendations.</p>
          </div>
        </div>
      </main>
    </div>
  );

  const WizardView = () => (
    <div className="min-h-screen bg-gray-50">
      <NewsletterWizard
        onComplete={generateNewsletter}
        onSave={saveDraft}
        initialData={wizardData}
        userTier={subscription.tier}
      />
    </div>
  );

  const LegacyView = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Legacy components would go here */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Legacy Newsletter Generator</h2>
          <p className="text-gray-600 mb-6">Simple newsletter generation with basic features</p>
          <button
            onClick={() => setAppState(prev => ({ ...prev, currentView: 'home' }))}
            className="text-blue-600 hover:text-blue-700"
          >
            ← Back to Enhanced Version
          </button>
        </div>
        {/* Legacy components would be rendered here */}
      </div>
    </div>
  );

  return (
    <div className="App">
      {/* Render current view */}
      {appState.currentView === 'home' && <HomeView />}
      {appState.currentView === 'wizard' && <WizardView />}
      {appState.currentView === 'legacy' && <LegacyView />}

      {/* Modals */}
      {showPricingModal && (
        <PricingModal
          isOpen={showPricingModal}
          onClose={() => setShowPricingModal(false)}
          currentTier={subscription.tier}
          onUpgrade={(tier) => {
            updateSubscription({ tier });
            setShowPricingModal(false);
          }}
        />
      )}

      {/* Loading Overlay */}
      {appState.isGenerating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating Newsletter</h3>
              <p className="text-gray-600">Processing your content and data...</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {appState.error && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg z-50">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{appState.error}</span>
            <button
              onClick={() => setAppState(prev => ({ ...prev, error: null }))}
              className="ml-4 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedApp;

