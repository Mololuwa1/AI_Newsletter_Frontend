import React, { useState } from 'react';
import { Database, ChevronDown, ChevronRight, Eye } from 'lucide-react';

interface SampleDataViewerProps {
  onClose?: () => void;
}

const SampleDataViewer: React.FC<SampleDataViewerProps> = ({ onClose }) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['businessMetrics']);

  const sampleData = {
    businessMetrics: {
      revenue: {
        q1: 2450000,
        q2: 2680000,
        q3: 2890000,
        q4: 3120000,
        growth: '+15%'
      },
      customerSatisfaction: {
        score: 94,
        reviews: 1250,
        nps: 68,
        retention: '91%'
      },
      marketPosition: {
        marketShare: '23%',
        competitorAnalysis: 'Leading in AI solutions',
        brandRecognition: '87%'
      },
      financialHealth: {
        operatingMargin: '28%',
        cashFlow: 'Positive',
        debt: 'Low',
        profitability: 'Strong'
      }
    },
    operationalData: {
      employees: {
        total: 450,
        newHires: 25,
        retention: '94%',
        satisfaction: '89%'
      },
      productivity: {
        efficiency: '+12%',
        automation: '67%',
        qualityScore: '96%'
      },
      innovation: {
        rdSpending: '15%',
        patents: 8,
        newProducts: 3
      }
    },
    marketInsights: {
      industryTrends: [
        'AI adoption accelerating',
        'Cloud migration increasing',
        'Automation demand rising'
      ],
      opportunities: [
        'Emerging markets expansion',
        'Strategic partnerships',
        'Product diversification'
      ],
      threats: [
        'Increased competition',
        'Economic uncertainty',
        'Regulatory changes'
      ]
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const renderDataSection = (title: string, data: any, sectionKey: string) => {
    const isExpanded = expandedSections.includes(sectionKey);
    
    return (
      <div key={sectionKey} className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
        >
          <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
            <Database className="w-4 h-4" />
            <span>{title}</span>
          </h3>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {isExpanded && (
          <div className="p-4 bg-white">
            <pre className="text-sm text-gray-700 overflow-x-auto bg-gray-50 p-3 rounded border">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Sample Business Data</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        )}
      </div>
      
      <p className="text-gray-600 mb-6 leading-relaxed">
        This is the sample business data used to generate demo newsletters. The AI analyzes this structured data to create comprehensive business insights and performance summaries.
      </p>
      
      <div className="space-y-4">
        {renderDataSection('Business Metrics', sampleData.businessMetrics, 'businessMetrics')}
        {renderDataSection('Operational Data', sampleData.operationalData, 'operationalData')}
        {renderDataSection('Market Insights', sampleData.marketInsights, 'marketInsights')}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">Data Structure Notes:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Revenue data includes quarterly breakdown and growth metrics</li>
          <li>• Customer satisfaction scores are aggregated from multiple sources</li>
          <li>• Market insights are updated based on industry analysis</li>
          <li>• All financial data is normalized and anonymized for demo purposes</li>
        </ul>
      </div>
    </div>
  );
};

export default SampleDataViewer;