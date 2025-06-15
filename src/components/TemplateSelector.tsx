import React, { useState } from 'react';
import { FileText, Briefcase, TrendingUp, Users, Building, Newspaper, Crown, Check } from 'lucide-react';

interface NewsletterTemplate {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'financial' | 'executive' | 'marketing' | 'technical';
  preview: string;
  features: string[];
  tier: 'free' | 'basic' | 'pro';
  sections: {
    id: string;
    name: string;
    required: boolean;
    type: 'text' | 'chart' | 'metrics' | 'image';
  }[];
}

interface TemplateSelectorProps {
  selectedTemplate: string | null;
  onTemplateSelect: (template: NewsletterTemplate) => void;
  userTier: 'free' | 'basic' | 'pro' | 'enterprise';
  onUpgrade: () => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateSelect,
  userTier,
  onUpgrade
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const templates: NewsletterTemplate[] = [
    {
      id: 'executive-summary',
      name: 'Executive Summary',
      description: 'Professional executive briefing with key metrics and insights',
      category: 'executive',
      preview: 'Clean, professional layout with executive summary, key metrics, and strategic insights',
      features: ['Executive Summary', 'Key Metrics Dashboard', 'Strategic Insights', 'Action Items'],
      tier: 'free',
      sections: [
        { id: 'summary', name: 'Executive Summary', required: true, type: 'text' },
        { id: 'metrics', name: 'Key Metrics', required: true, type: 'metrics' },
        { id: 'insights', name: 'Strategic Insights', required: false, type: 'text' }
      ]
    },
    {
      id: 'financial-report',
      name: 'Financial Performance Report',
      description: 'Comprehensive financial analysis with charts and trends',
      category: 'financial',
      preview: 'Financial-focused layout with revenue charts, growth metrics, and financial analysis',
      features: ['Revenue Analysis', 'Growth Charts', 'Financial Metrics', 'Trend Analysis', 'Forecasting'],
      tier: 'basic',
      sections: [
        { id: 'summary', name: 'Financial Summary', required: true, type: 'text' },
        { id: 'revenue-chart', name: 'Revenue Chart', required: true, type: 'chart' },
        { id: 'metrics', name: 'Financial Metrics', required: true, type: 'metrics' },
        { id: 'analysis', name: 'Financial Analysis', required: false, type: 'text' }
      ]
    },
    {
      id: 'business-intelligence',
      name: 'Business Intelligence Dashboard',
      description: 'Advanced analytics with multiple visualizations and insights',
      category: 'business',
      preview: 'Data-rich layout with multiple charts, KPIs, and business intelligence insights',
      features: ['Multiple Chart Types', 'KPI Dashboard', 'Predictive Analytics', 'Custom Branding', 'Interactive Elements'],
      tier: 'pro',
      sections: [
        { id: 'summary', name: 'Business Overview', required: true, type: 'text' },
        { id: 'kpi-dashboard', name: 'KPI Dashboard', required: true, type: 'metrics' },
        { id: 'charts', name: 'Analytics Charts', required: true, type: 'chart' },
        { id: 'insights', name: 'AI Insights', required: false, type: 'text' },
        { id: 'recommendations', name: 'Recommendations', required: false, type: 'text' }
      ]
    },
    {
      id: 'marketing-performance',
      name: 'Marketing Performance',
      description: 'Marketing-focused newsletter with campaign metrics and ROI analysis',
      category: 'marketing',
      preview: 'Marketing-centric design with campaign performance, customer metrics, and ROI analysis',
      features: ['Campaign Metrics', 'Customer Analytics', 'ROI Analysis', 'Conversion Tracking'],
      tier: 'basic',
      sections: [
        { id: 'summary', name: 'Marketing Summary', required: true, type: 'text' },
        { id: 'campaigns', name: 'Campaign Performance', required: true, type: 'metrics' },
        { id: 'customer-chart', name: 'Customer Analytics', required: true, type: 'chart' },
        { id: 'roi', name: 'ROI Analysis', required: false, type: 'text' }
      ]
    },
    {
      id: 'team-update',
      name: 'Team Update',
      description: 'Internal team communication with project updates and achievements',
      category: 'business',
      preview: 'Team-focused layout with project updates, achievements, and team metrics',
      features: ['Project Updates', 'Team Achievements', 'Progress Tracking', 'Team Photos'],
      tier: 'free',
      sections: [
        { id: 'summary', name: 'Team Summary', required: true, type: 'text' },
        { id: 'projects', name: 'Project Updates', required: true, type: 'text' },
        { id: 'achievements', name: 'Achievements', required: false, type: 'text' },
        { id: 'metrics', name: 'Team Metrics', required: false, type: 'metrics' }
      ]
    },
    {
      id: 'technical-report',
      name: 'Technical Performance Report',
      description: 'Technical metrics and system performance analysis',
      category: 'technical',
      preview: 'Technical layout with system metrics, performance charts, and technical insights',
      features: ['System Metrics', 'Performance Charts', 'Technical Analysis', 'Issue Tracking', 'Uptime Reports'],
      tier: 'pro',
      sections: [
        { id: 'summary', name: 'Technical Summary', required: true, type: 'text' },
        { id: 'performance', name: 'Performance Metrics', required: true, type: 'metrics' },
        { id: 'charts', name: 'Performance Charts', required: true, type: 'chart' },
        { id: 'issues', name: 'Issue Analysis', required: false, type: 'text' }
      ]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', icon: FileText },
    { id: 'business', name: 'Business', icon: Briefcase },
    { id: 'financial', name: 'Financial', icon: TrendingUp },
    { id: 'executive', name: 'Executive', icon: Building },
    { id: 'marketing', name: 'Marketing', icon: Users },
    { id: 'technical', name: 'Technical', icon: Newspaper }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'free': return 'text-green-600 bg-green-50 border-green-200';
      case 'basic': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pro': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'pro': return Crown;
      default: return Check;
    }
  };

  const canUseTemplate = (templateTier: string) => {
    const tierHierarchy = { free: 0, basic: 1, pro: 2, enterprise: 3 };
    const userTierLevel = tierHierarchy[userTier] || 0;
    const templateTierLevel = tierHierarchy[templateTier as keyof typeof tierHierarchy] || 0;
    return userTierLevel >= templateTierLevel;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Newsletter Template</h3>
        <p className="text-gray-600">Select a template that best fits your newsletter content and audience</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const TierIcon = getTierIcon(template.tier);
          const isSelected = selectedTemplate === template.id;
          const canUse = canUseTemplate(template.tier);

          return (
            <div
              key={template.id}
              className={`border rounded-lg overflow-hidden transition-all cursor-pointer ${
                isSelected
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : canUse
                  ? 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  : 'border-gray-200 opacity-60'
              }`}
              onClick={() => canUse && onTemplateSelect(template)}
            >
              {/* Template Preview */}
              <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Preview</p>
                  </div>
                </div>
                
                {/* Tier Badge */}
                <div className={`absolute top-2 right-2 flex items-center space-x-1 px-2 py-1 rounded-full border text-xs font-medium ${getTierColor(template.tier)}`}>
                  <TierIcon className="w-3 h-3" />
                  <span className="capitalize">{template.tier}</span>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{template.name}</h4>
                  {isSelected && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>

                {/* Features */}
                <div className="space-y-2 mb-4">
                  <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Features</h5>
                  <div className="flex flex-wrap gap-1">
                    {template.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                    {template.features.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{template.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Sections */}
                <div className="space-y-2 mb-4">
                  <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Sections</h5>
                  <div className="text-xs text-gray-600">
                    {template.sections.length} sections • {template.sections.filter(s => s.required).length} required
                  </div>
                </div>

                {/* Action */}
                {!canUse ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpgrade();
                    }}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    Upgrade to Use
                  </button>
                ) : (
                  <div className={`w-full px-4 py-2 rounded-lg text-center text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                    {isSelected ? 'Selected' : 'Select Template'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Template Details */}
      {selectedTemplate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-3">Selected Template Details</h4>
          {(() => {
            const template = templates.find(t => t.id === selectedTemplate);
            if (!template) return null;
            
            return (
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-blue-800">{template.name}</h5>
                  <p className="text-sm text-blue-700">{template.preview}</p>
                </div>
                
                <div>
                  <h6 className="text-sm font-medium text-blue-800 mb-2">Template Sections:</h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {template.sections.map((section) => (
                      <div key={section.id} className="flex items-center space-x-2 text-sm text-blue-700">
                        <span className={`w-2 h-2 rounded-full ${section.required ? 'bg-blue-600' : 'bg-blue-400'}`} />
                        <span>{section.name}</span>
                        {section.required && <span className="text-xs text-blue-600">(Required)</span>}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h6 className="text-sm font-medium text-blue-800 mb-2">Included Features:</h6>
                  <div className="flex flex-wrap gap-2">
                    {template.features.map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;

