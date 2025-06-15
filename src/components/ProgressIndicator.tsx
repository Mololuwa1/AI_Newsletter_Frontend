import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';

interface ProgressStep {
  id: string;
  title: string;
  status: 'completed' | 'current' | 'upcoming' | 'error';
  description?: string;
  estimatedTime?: string;
  isOptional?: boolean;
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
  currentStepIndex: number;
  showEstimatedTime?: boolean;
  showDescriptions?: boolean;
  orientation?: 'horizontal' | 'vertical';
  size?: 'small' | 'medium' | 'large';
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStepIndex,
  showEstimatedTime = true,
  showDescriptions = true,
  orientation = 'horizontal',
  size = 'medium'
}) => {
  const getStepIcon = (step: ProgressStep, index: number) => {
    switch (step.status) {
      case 'completed':
        return <Check className="w-full h-full" />;
      case 'error':
        return <AlertCircle className="w-full h-full" />;
      case 'current':
        return <span className="text-sm font-bold">{index + 1}</span>;
      default:
        return <span className="text-sm">{index + 1}</span>;
    }
  };

  const getStepColors = (step: ProgressStep) => {
    switch (step.status) {
      case 'completed':
        return {
          circle: 'bg-green-600 border-green-600 text-white',
          text: 'text-green-600',
          line: 'bg-green-600'
        };
      case 'current':
        return {
          circle: 'bg-blue-600 border-blue-600 text-white',
          text: 'text-blue-600',
          line: 'bg-gray-300'
        };
      case 'error':
        return {
          circle: 'bg-red-600 border-red-600 text-white',
          text: 'text-red-600',
          line: 'bg-gray-300'
        };
      default:
        return {
          circle: 'bg-white border-gray-300 text-gray-500',
          text: 'text-gray-500',
          line: 'bg-gray-300'
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          circle: 'w-6 h-6',
          text: 'text-xs',
          spacing: orientation === 'horizontal' ? 'space-x-2' : 'space-y-2'
        };
      case 'large':
        return {
          circle: 'w-12 h-12',
          text: 'text-base',
          spacing: orientation === 'horizontal' ? 'space-x-6' : 'space-y-6'
        };
      default:
        return {
          circle: 'w-8 h-8',
          text: 'text-sm',
          spacing: orientation === 'horizontal' ? 'space-x-4' : 'space-y-4'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  const getCompletionPercentage = () => {
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    return (completedSteps / steps.length) * 100;
  };

  const getTotalEstimatedTime = () => {
    return steps.reduce((total, step) => {
      if (step.estimatedTime) {
        const timeMatch = step.estimatedTime.match(/(\d+)/);
        if (timeMatch) {
          return total + parseInt(timeMatch[1]);
        }
      }
      return total;
    }, 0);
  };

  const getRemainingTime = () => {
    const remainingSteps = steps.slice(currentStepIndex);
    return remainingSteps.reduce((total, step) => {
      if (step.estimatedTime) {
        const timeMatch = step.estimatedTime.match(/(\d+)/);
        if (timeMatch) {
          return total + parseInt(timeMatch[1]);
        }
      }
      return total;
    }, 0);
  };

  if (orientation === 'vertical') {
    return (
      <div className="space-y-4">
        {/* Progress Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">
              {steps.filter(s => s.status === 'completed').length} of {steps.length} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getCompletionPercentage()}%` }}
            />
          </div>
          {showEstimatedTime && (
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>Total: {getTotalEstimatedTime()} min</span>
              <span>Remaining: {getRemainingTime()} min</span>
            </div>
          )}
        </div>

        {/* Vertical Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const colors = getStepColors(step);
            const isLast = index === steps.length - 1;

            return (
              <div key={step.id} className="relative">
                <div className="flex items-start space-x-3">
                  {/* Step Circle */}
                  <div className="relative flex-shrink-0">
                    <div className={`${sizeClasses.circle} rounded-full border-2 flex items-center justify-center ${colors.circle}`}>
                      {getStepIcon(step, index)}
                    </div>
                    
                    {/* Connecting Line */}
                    {!isLast && (
                      <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-8 ${colors.line}`} />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-medium ${colors.text} ${sizeClasses.text}`}>
                        {step.title}
                      </h3>
                      {step.isOptional && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          Optional
                        </span>
                      )}
                      {step.estimatedTime && showEstimatedTime && (
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {step.estimatedTime}
                        </span>
                      )}
                    </div>
                    
                    {showDescriptions && step.description && (
                      <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Horizontal Layout
  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${getCompletionPercentage()}%` }}
        />
      </div>

      {/* Horizontal Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const colors = getStepColors(step);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step */}
              <div className="flex flex-col items-center space-y-2">
                {/* Step Circle */}
                <div className={`${sizeClasses.circle} rounded-full border-2 flex items-center justify-center ${colors.circle}`}>
                  {getStepIcon(step, index)}
                </div>

                {/* Step Info */}
                <div className="text-center">
                  <div className="flex items-center space-x-1">
                    <h3 className={`font-medium ${colors.text} ${sizeClasses.text}`}>
                      {step.title}
                    </h3>
                    {step.isOptional && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-1 py-0.5 rounded">
                        Opt
                      </span>
                    )}
                  </div>
                  
                  {showDescriptions && step.description && (
                    <p className="text-xs text-gray-600 mt-1 max-w-24 truncate">
                      {step.description}
                    </p>
                  )}
                  
                  {step.estimatedTime && showEstimatedTime && (
                    <div className="text-xs text-gray-500 flex items-center justify-center mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {step.estimatedTime}
                    </div>
                  )}
                </div>
              </div>

              {/* Connecting Line */}
              {!isLast && (
                <div className={`flex-1 h-0.5 mx-2 ${
                  index < currentStepIndex ? 'bg-green-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {showEstimatedTime && (
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {steps.filter(s => s.status === 'completed').length} of {steps.length} steps completed
          </span>
          <span>
            {getRemainingTime()} minutes remaining
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;

