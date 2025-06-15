import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, FileText, Upload, Palette, Eye, Send, Save } from 'lucide-react';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
  isComplete: boolean;
  isOptional: boolean;
  estimatedTime: string;
}

interface NewsletterWizardProps {
  onComplete: (data: any) => void;
  onSave: (data: any) => void;
  initialData?: any;
  userTier: 'free' | 'basic' | 'pro' | 'enterprise';
}

const NewsletterWizard: React.FC<NewsletterWizardProps> = ({
  onComplete,
  onSave,
  initialData,
  userTier
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState(initialData || {});
  const [isLoading, setIsLoading] = useState(false);

  const steps: WizardStep[] = [
    {
      id: 'content',
      title: 'Content Creation',
      description: 'Add your newsletter content and text sections',
      icon: FileText,
      component: () => <div>Content Manager Component</div>, // Placeholder
      isComplete: false,
      isOptional: false,
      estimatedTime: '5-10 min'
    },
    {
      id: 'data',
      title: 'Data Upload',
      description: 'Upload and process your business data',
      icon: Upload,
      component: () => <div>Data Upload Component</div>, // Placeholder
      isComplete: false,
      isOptional: true,
      estimatedTime: '3-5 min'
    },
    {
      id: 'template',
      title: 'Template Selection',
      description: 'Choose a template that fits your needs',
      icon: Palette,
      component: () => <div>Template Selector Component</div>, // Placeholder
      isComplete: false,
      isOptional: false,
      estimatedTime: '2-3 min'
    },
    {
      id: 'branding',
      title: 'Branding & Design',
      description: 'Customize colors, fonts, and layout',
      icon: Palette,
      component: () => <div>Branding Options Component</div>, // Placeholder
      isComplete: false,
      isOptional: true,
      estimatedTime: '5-8 min'
    },
    {
      id: 'preview',
      title: 'Preview & Review',
      description: 'Review your newsletter before generating',
      icon: Eye,
      component: () => <div>Preview Component</div>, // Placeholder
      isComplete: false,
      isOptional: false,
      estimatedTime: '2-3 min'
    }
  ];

  const [stepStates, setStepStates] = useState(steps);

  useEffect(() => {
    // Auto-save wizard data every 30 seconds
    const autoSaveInterval = setInterval(() => {
      if (Object.keys(wizardData).length > 0) {
        onSave(wizardData);
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [wizardData, onSave]);

  const updateStepCompletion = (stepId: string, isComplete: boolean) => {
    setStepStates(prev => prev.map(step => 
      step.id === stepId ? { ...step, isComplete } : step
    ));
  };

  const updateWizardData = (stepId: string, data: any) => {
    setWizardData(prev => ({
      ...prev,
      [stepId]: data
    }));
  };

  const canProceedToNext = () => {
    const currentStepData = stepStates[currentStep];
    return currentStepData.isComplete || currentStepData.isOptional;
  };

  const canGoBack = () => {
    return currentStep > 0;
  };

  const handleNext = () => {
    if (currentStep < stepStates.length - 1 && canProceedToNext()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (canGoBack()) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // Allow clicking on previous steps or current step
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await onComplete(wizardData);
    } catch (error) {
      console.error('Error completing wizard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    onSave(wizardData);
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  const getCompletedStepsCount = () => {
    return stepStates.filter(step => step.isComplete).length;
  };

  const getTotalRequiredSteps = () => {
    return stepStates.filter(step => !step.isOptional).length;
  };

  const getEstimatedTimeRemaining = () => {
    const remainingSteps = stepStates.slice(currentStep);
    const totalMinutes = remainingSteps.reduce((total, step) => {
      const timeRange = step.estimatedTime.match(/(\d+)-?(\d+)?/);
      if (timeRange) {
        const min = parseInt(timeRange[1]);
        const max = timeRange[2] ? parseInt(timeRange[2]) : min;
        return total + Math.ceil((min + max) / 2);
      }
      return total;
    }, 0);
    
    return totalMinutes;
  };

  const currentStepData = stepStates[currentStep];
  const isLastStep = currentStep === stepStates.length - 1;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Newsletter</h1>
            <p className="text-gray-600">Follow the steps to create your professional newsletter</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Estimated time: {getEstimatedTimeRemaining()} min remaining
            </div>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Draft</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / stepStates.length) * 100}%`
            }}
          />
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between">
          {stepStates.map((step, index) => {
            const Icon = step.icon;
            const status = getStepStatus(index);
            
            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(index)}
                className={`flex flex-col items-center space-y-2 p-2 rounded-lg transition-colors ${
                  index <= currentStep ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed'
                }`}
                disabled={index > currentStep}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  status === 'completed'
                    ? 'bg-green-600 border-green-600 text-white'
                    : status === 'current'
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {status === 'completed' ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                
                <div className="text-center">
                  <div className={`text-sm font-medium ${
                    status === 'current' ? 'text-blue-600' : 
                    status === 'completed' ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  {step.isOptional && (
                    <div className="text-xs text-gray-400">Optional</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="px-6">
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-gray-600">{currentStepData.description}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span>Step {currentStep + 1} of {stepStates.length}</span>
              <span>•</span>
              <span>Estimated time: {currentStepData.estimatedTime}</span>
              {currentStepData.isOptional && (
                <>
                  <span>•</span>
                  <span className="text-blue-600">Optional</span>
                </>
              )}
            </div>
          </div>

          {/* Step Component */}
          <div className="min-h-[400px]">
            <currentStepData.component />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={!canGoBack()}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              canGoBack()
                ? 'text-gray-700 border border-gray-300 hover:bg-gray-50'
                : 'text-gray-400 border border-gray-200 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-4">
            {/* Step Status */}
            <div className="text-sm text-gray-500">
              {getCompletedStepsCount()} of {getTotalRequiredSteps()} required steps completed
            </div>

            {/* Skip Button (for optional steps) */}
            {currentStepData.isOptional && !currentStepData.isComplete && (
              <button
                onClick={handleNext}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Skip this step
              </button>
            )}

            {/* Next/Complete Button */}
            {isLastStep ? (
              <button
                onClick={handleComplete}
                disabled={!canProceedToNext() || isLoading}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  canProceedToNext() && !isLoading
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Generate Newsletter</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!canProceedToNext()}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  canProceedToNext()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="px-6 py-4 text-center">
        <p className="text-sm text-gray-500">
          Need help? Check out our{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700 underline">
            step-by-step guide
          </a>{' '}
          or{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700 underline">
            contact support
          </a>
        </p>
      </div>
    </div>
  );
};

export default NewsletterWizard;

