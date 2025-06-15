import React, { useState } from 'react';
import { Plus, Minus, FileText, Target, TrendingUp, Users } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

interface TextSection {
  id: string;
  title: string;
  content: string;
  type: 'summary' | 'metrics' | 'insights' | 'highlights' | 'custom';
  required: boolean;
}

interface TextInputSectionProps {
  sections: TextSection[];
  onSectionsChange: (sections: TextSection[]) => void;
  maxSections?: number;
}

const TextInputSection: React.FC<TextInputSectionProps> = ({
  sections,
  onSectionsChange,
  maxSections = 10
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['summary']));

  const sectionTypes = [
    { value: 'summary', label: 'Executive Summary', icon: FileText, placeholder: 'Provide a high-level overview of key business developments...' },
    { value: 'metrics', label: 'Performance Metrics', icon: Target, placeholder: 'Include key performance indicators and metrics...' },
    { value: 'insights', label: 'Market Insights', icon: TrendingUp, placeholder: 'Share market analysis and business insights...' },
    { value: 'highlights', label: 'Key Highlights', icon: Users, placeholder: 'List important achievements and milestones...' },
    { value: 'custom', label: 'Custom Section', icon: Plus, placeholder: 'Add any additional content...' }
  ];

  const addSection = (type: string) => {
    if (sections.length >= maxSections) return;

    const newSection: TextSection = {
      id: `section_${Date.now()}`,
      title: sectionTypes.find(t => t.value === type)?.label || 'Custom Section',
      content: '',
      type: type as TextSection['type'],
      required: false
    };

    const updatedSections = [...sections, newSection];
    onSectionsChange(updatedSections);
    setExpandedSections(prev => new Set([...prev, newSection.id]));
  };

  const removeSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section?.required) return;

    const updatedSections = sections.filter(s => s.id !== sectionId);
    onSectionsChange(updatedSections);
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      newSet.delete(sectionId);
      return newSet;
    });
  };

  const updateSection = (sectionId: string, field: keyof TextSection, value: string) => {
    const updatedSections = sections.map(section =>
      section.id === sectionId ? { ...section, [field]: value } : section
    );
    onSectionsChange(updatedSections);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const getSectionIcon = (type: string) => {
    const sectionType = sectionTypes.find(t => t.value === type);
    return sectionType?.icon || FileText;
  };

  const getSectionPlaceholder = (type: string) => {
    const sectionType = sectionTypes.find(t => t.value === type);
    return sectionType?.placeholder || 'Enter your content here...';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Newsletter Content Sections</h3>
        <span className="text-sm text-gray-500">{sections.length}/{maxSections} sections</span>
      </div>

      {/* Existing Sections */}
      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = getSectionIcon(section.type);
          const isExpanded = expandedSections.has(section.id);

          return (
            <div key={section.id} className="border border-gray-200 rounded-lg bg-white">
              {/* Section Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-blue-600" />
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                    className="font-medium text-gray-900 bg-transparent border-none outline-none focus:bg-gray-50 px-2 py-1 rounded"
                  />
                  {section.required && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Required</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {isExpanded ? 'Collapse' : 'Expand'}
                  </button>
                  {!section.required && (
                    <button
                      onClick={() => removeSection(section.id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Section Content */}
              {isExpanded && (
                <div className="p-4">
                  <RichTextEditor
                    value={section.content}
                    onChange={(content) => updateSection(section.id, 'content', content)}
                    placeholder={getSectionPlaceholder(section.type)}
                    minHeight="150px"
                    maxLength={5000}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Section Buttons */}
      {sections.length < maxSections && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Add New Section</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {sectionTypes.map((type) => {
              const Icon = type.icon;
              const hasSection = sections.some(s => s.type === type.value && type.value !== 'custom');
              
              return (
                <button
                  key={type.value}
                  onClick={() => addSection(type.value)}
                  disabled={hasSection && type.value !== 'custom'}
                  className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                    hasSection && type.value !== 'custom'
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Content Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Content Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Total Sections:</span>
            <span className="ml-2 font-medium">{sections.length}</span>
          </div>
          <div>
            <span className="text-gray-500">Completed:</span>
            <span className="ml-2 font-medium">{sections.filter(s => s.content.trim()).length}</span>
          </div>
          <div>
            <span className="text-gray-500">Total Words:</span>
            <span className="ml-2 font-medium">
              {sections.reduce((total, section) => {
                const plainText = section.content.replace(/<[^>]*>/g, '');
                return total + (plainText.trim() ? plainText.trim().split(/\s+/).length : 0);
              }, 0)}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Required Missing:</span>
            <span className="ml-2 font-medium text-red-600">
              {sections.filter(s => s.required && !s.content.trim()).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextInputSection;

