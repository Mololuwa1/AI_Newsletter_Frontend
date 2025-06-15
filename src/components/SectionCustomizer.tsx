import React, { useState } from 'react';
import { GripVertical, Plus, Minus, Eye, Settings, Type, BarChart3, Image, FileText } from 'lucide-react';

interface NewsletterSection {
  id: string;
  type: 'text' | 'chart' | 'metrics' | 'image' | 'spacer';
  title: string;
  content?: string;
  order: number;
  visible: boolean;
  settings: {
    backgroundColor?: string;
    textAlign?: 'left' | 'center' | 'right';
    padding?: 'small' | 'medium' | 'large';
    borderRadius?: 'none' | 'small' | 'medium' | 'large';
    showBorder?: boolean;
  };
}

interface SectionCustomizerProps {
  sections: NewsletterSection[];
  onSectionsChange: (sections: NewsletterSection[]) => void;
  availableSections: {
    type: NewsletterSection['type'];
    name: string;
    icon: React.ComponentType<any>;
    description: string;
  }[];
}

const SectionCustomizer: React.FC<SectionCustomizerProps> = ({
  sections,
  onSectionsChange,
  availableSections
}) => {
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const addSection = (type: NewsletterSection['type']) => {
    const sectionInfo = availableSections.find(s => s.type === type);
    const newSection: NewsletterSection = {
      id: `section_${Date.now()}`,
      type,
      title: sectionInfo?.name || 'New Section',
      order: sections.length,
      visible: true,
      settings: {
        backgroundColor: '#ffffff',
        textAlign: 'left',
        padding: 'medium',
        borderRadius: 'small',
        showBorder: false
      }
    };

    onSectionsChange([...sections, newSection]);
  };

  const removeSection = (sectionId: string) => {
    const updatedSections = sections
      .filter(s => s.id !== sectionId)
      .map((section, index) => ({ ...section, order: index }));
    onSectionsChange(updatedSections);
  };

  const toggleSectionVisibility = (sectionId: string) => {
    const updatedSections = sections.map(section =>
      section.id === sectionId
        ? { ...section, visible: !section.visible }
        : section
    );
    onSectionsChange(updatedSections);
  };

  const updateSectionSettings = (sectionId: string, settings: Partial<NewsletterSection['settings']>) => {
    const updatedSections = sections.map(section =>
      section.id === sectionId
        ? { ...section, settings: { ...section.settings, ...settings } }
        : section
    );
    onSectionsChange(updatedSections);
  };

  const updateSectionTitle = (sectionId: string, title: string) => {
    const updatedSections = sections.map(section =>
      section.id === sectionId ? { ...section, title } : section
    );
    onSectionsChange(updatedSections);
  };

  const moveSection = (fromIndex: number, toIndex: number) => {
    const updatedSections = [...sections];
    const [movedSection] = updatedSections.splice(fromIndex, 1);
    updatedSections.splice(toIndex, 0, movedSection);
    
    // Update order
    const reorderedSections = updatedSections.map((section, index) => ({
      ...section,
      order: index
    }));
    
    onSectionsChange(reorderedSections);
  };

  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    setDraggedSection(sectionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault();
    
    if (!draggedSection || draggedSection === targetSectionId) return;
    
    const fromIndex = sections.findIndex(s => s.id === draggedSection);
    const toIndex = sections.findIndex(s => s.id === targetSectionId);
    
    moveSection(fromIndex, toIndex);
    setDraggedSection(null);
  };

  const getSectionIcon = (type: NewsletterSection['type']) => {
    const sectionInfo = availableSections.find(s => s.type === type);
    return sectionInfo?.icon || FileText;
  };

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Section Customizer</h3>
          <p className="text-gray-600">Customize the layout and order of your newsletter sections</p>
        </div>
      </div>

      {/* Add Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Section</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {availableSections.map((sectionType) => {
            const Icon = sectionType.icon;
            return (
              <button
                key={sectionType.type}
                onClick={() => addSection(sectionType.type)}
                className="flex flex-col items-center p-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Icon className="w-6 h-6 text-gray-600 mb-2" />
                <span className="text-xs text-gray-700 text-center">{sectionType.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Newsletter Sections ({sections.length})</h4>
        
        {sortedSections.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>No sections added yet. Add sections using the buttons above.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedSections.map((section, index) => {
              const Icon = getSectionIcon(section.type);
              const isEditing = editingSection === section.id;
              
              return (
                <div
                  key={section.id}
                  className={`border rounded-lg bg-white transition-all ${
                    section.visible ? 'border-gray-200' : 'border-gray-200 opacity-60'
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, section.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, section.id)}
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-3">
                      <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                      <Icon className="w-5 h-5 text-gray-600" />
                      
                      {isEditing ? (
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                          onBlur={() => setEditingSection(null)}
                          onKeyPress={(e) => e.key === 'Enter' && setEditingSection(null)}
                          className="font-medium text-gray-900 bg-transparent border-b border-blue-500 outline-none"
                          autoFocus
                        />
                      ) : (
                        <span
                          className="font-medium text-gray-900 cursor-pointer"
                          onClick={() => setEditingSection(section.id)}
                        >
                          {section.title}
                        </span>
                      )}
                      
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded capitalize">
                        {section.type}
                      </span>
                      
                      {!section.visible && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                          Hidden
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">#{section.order + 1}</span>
                      
                      <button
                        onClick={() => toggleSectionVisibility(section.id)}
                        className={`p-1 rounded transition-colors ${
                          section.visible
                            ? 'text-gray-600 hover:text-gray-800'
                            : 'text-red-600 hover:text-red-800'
                        }`}
                        title={section.visible ? 'Hide section' : 'Show section'}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => setEditingSection(editingSection === section.id ? null : section.id)}
                        className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                        title="Edit section settings"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => removeSection(section.id)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        title="Remove section"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Section Settings */}
                  {editingSection === section.id && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      <h5 className="text-sm font-medium text-gray-700 mb-3">Section Settings</h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Background Color */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Background</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={section.settings.backgroundColor || '#ffffff'}
                              onChange={(e) => updateSectionSettings(section.id, { backgroundColor: e.target.value })}
                              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={section.settings.backgroundColor || '#ffffff'}
                              onChange={(e) => updateSectionSettings(section.id, { backgroundColor: e.target.value })}
                              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded font-mono"
                            />
                          </div>
                        </div>
                        
                        {/* Text Align */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Text Align</label>
                          <select
                            value={section.settings.textAlign || 'left'}
                            onChange={(e) => updateSectionSettings(section.id, { textAlign: e.target.value as any })}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                          >
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                          </select>
                        </div>
                        
                        {/* Padding */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Padding</label>
                          <select
                            value={section.settings.padding || 'medium'}
                            onChange={(e) => updateSectionSettings(section.id, { padding: e.target.value as any })}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                          >
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                          </select>
                        </div>
                        
                        {/* Border Radius */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Border Radius</label>
                          <select
                            value={section.settings.borderRadius || 'small'}
                            onChange={(e) => updateSectionSettings(section.id, { borderRadius: e.target.value as any })}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                          >
                            <option value="none">None</option>
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                          </select>
                        </div>
                      </div>
                      
                      {/* Show Border Toggle */}
                      <div className="mt-3">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={section.settings.showBorder || false}
                            onChange={(e) => updateSectionSettings(section.id, { showBorder: e.target.checked })}
                            className="rounded border-gray-300"
                          />
                          <span className="text-xs text-gray-600">Show border</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Section Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Total Sections:</span>
            <span className="ml-2 font-medium text-blue-900">{sections.length}</span>
          </div>
          <div>
            <span className="text-blue-700">Visible:</span>
            <span className="ml-2 font-medium text-blue-900">{sections.filter(s => s.visible).length}</span>
          </div>
          <div>
            <span className="text-blue-700">Hidden:</span>
            <span className="ml-2 font-medium text-blue-900">{sections.filter(s => !s.visible).length}</span>
          </div>
          <div>
            <span className="text-blue-700">Types:</span>
            <span className="ml-2 font-medium text-blue-900">
              {[...new Set(sections.map(s => s.type))].length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionCustomizer;

