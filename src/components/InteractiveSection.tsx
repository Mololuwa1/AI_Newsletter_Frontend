import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';

interface InteractiveSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  showDataToggle?: boolean;
  rawData?: any;
  colorScheme?: 'blue' | 'green' | 'purple' | 'orange';
}

const InteractiveSection: React.FC<InteractiveSectionProps> = ({ 
  title, 
  children, 
  defaultExpanded = true,
  showDataToggle = false,
  rawData,
  colorScheme = 'blue'
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showRawData, setShowRawData] = useState(false);

  const colorClasses = {
    blue: {
      dot: 'bg-blue-600',
      button: 'text-blue-600 hover:text-blue-800 hover:bg-blue-50',
      dataButton: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
    },
    green: {
      dot: 'bg-green-600',
      button: 'text-green-600 hover:text-green-800 hover:bg-green-50',
      dataButton: 'bg-green-100 text-green-700 hover:bg-green-200'
    },
    purple: {
      dot: 'bg-purple-600',
      button: 'text-purple-600 hover:text-purple-800 hover:bg-purple-50',
      dataButton: 'bg-purple-100 text-purple-700 hover:bg-purple-200'
    },
    orange: {
      dot: 'bg-orange-600',
      button: 'text-orange-600 hover:text-orange-800 hover:bg-orange-50',
      dataButton: 'bg-orange-100 text-orange-700 hover:bg-orange-200'
    }
  };

  const colors = colorClasses[colorScheme];

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center space-x-2 font-bold text-xl transition-colors ${colors.button}`}
        >
          <div className={`w-4 h-4 rounded-full ${colors.dot}`}></div>
          <span>{title}</span>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
        
        {showDataToggle && isExpanded && (
          <button
            onClick={() => setShowRawData(!showRawData)}
            className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${colors.dataButton}`}
          >
            {showRawData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showRawData ? 'Hide Data' : 'Show Raw Data'}</span>
          </button>
        )}
      </div>
      
      {isExpanded && (
        <div className="space-y-6">
          {children}
          
          {showDataToggle && showRawData && rawData && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h5 className="font-semibold text-gray-700 mb-2">Raw Data:</h5>
              <pre className="text-xs text-gray-600 overflow-x-auto bg-white p-3 rounded border">
                {JSON.stringify(rawData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default InteractiveSection;