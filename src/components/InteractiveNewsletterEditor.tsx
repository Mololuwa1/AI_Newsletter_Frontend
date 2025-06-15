import React, { useState, useRef, useCallback } from 'react';
import { 
  Mail, Download, Share2, Crown, Edit3, Plus, Move, 
  Save, Undo, Redo, Image, Type, BarChart3, Settings,
  Eye, Code, Palette, Upload, Sparkles, Grid, Layout,
  PieChart, TrendingUp, Target, Layers
} from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SubscriptionBadge from './SubscriptionBadge';
import ChartDetailModal from './ChartDetailModal';
import TextEditor from './TextEditor';
import LogoUploader from './LogoUploader';
import AIInsightGenerator from './AIInsightGenerator';
import ChartSelector from './ChartSelector';
import ChartCustomizationPanel from './ChartCustomizationPanel';
import { UserSubscription } from '../types/subscription';

interface NewsletterSection {
  id: string;
  type: 'text' | 'chart' | 'image' | 'divider';
  content: any;
  editable: boolean;
  order: number;
}

interface InteractiveNewsletterEditorProps {
  data: any;
  subscription: UserSubscription;
  onSave: (data: any) => void;
  onClose: () => void;
}

const InteractiveNewsletterEditor: React.FC<InteractiveNewsletterEditorProps> = ({
  data,
  subscription,
  onSave,
  onClose
}) => {
  const [sections, setSections] = useState<NewsletterSection[]>(() => {
    return [
      {
        id: 'header',
        type: 'text',
        content: { title: data.company, subtitle: data.date, type: 'header' },
        editable: true,
        order: 0
      },
      {
        id: 'summary',
        type: 'text',
        content: { text: data.executiveSummary, type: 'summary' },
        editable: true,
        order: 1
      },
      {
        id: 'revenue-chart',
        type: 'chart',
        content: data.charts?.revenue,
        editable: false,
        order: 2
      },
      {
        id: 'customer-chart',
        type: 'chart',
        content: data.charts?.customerGrowth,
        editable: false,
        order: 3
      },
      {
        id: 'insights',
        type: 'text',
        content: { text: data.marketInsights, type: 'insights' },
        editable: true,
        order: 4
      }
    ].filter(section => section.content);
  });

  const [selectedChart, setSelectedChart] = useState<any>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [history, setHistory] = useState<NewsletterSection[][]>([sections]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [showChartSelector, setShowChartSelector] = useState(false);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(true);

  const canEditAdvanced = subscription.tier !== 'free';
  const canCustomizeBranding = subscription.tier === 'pro';
  const canUseAdvancedCharts = subscription.tier === 'pro';

  // Drag and Drop functionality
  const moveSection = useCallback((dragIndex: number, hoverIndex: number) => {
    const newSections = [...sections];
    const draggedSection = newSections[dragIndex];
    newSections.splice(dragIndex, 1);
    newSections.splice(hoverIndex, 0, draggedSection);
    
    newSections.forEach((section, index) => {
      section.order = index;
    });
    
    setSections(newSections);
    saveToHistory(newSections);
  }, [sections]);

  const saveToHistory = (newSections: NewsletterSection[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newSections]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSections([...history[historyIndex - 1]]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSections([...history[historyIndex + 1]]);
    }
  };

  const addNewSection = (type: 'text' | 'chart' | 'image' | 'divider') => {
    if (type === 'chart') {
      setShowChartSelector(true);
      return;
    }

    const newSection: NewsletterSection = {
      id: `section-${Date.now()}`,
      type,
      content: type === 'text' ? { text: 'Click to edit this text...', type: 'custom' } : {},
      editable: type === 'text',
      order: sections.length
    };
    
    const newSections = [...sections, newSection];
    setSections(newSections);
    saveToHistory(newSections);
  };

  const addChartSection = (chartType: string, chartData: any) => {
    const newSection: NewsletterSection = {
      id: `chart-${Date.now()}`,
      type: 'chart',
      content: {
        type: chartType,
        data: chartData,
        narrative: `AI-generated insights for ${chartType} chart will appear here.`
      },
      editable: false,
      order: sections.length
    };
    
    const newSections = [...sections, newSection];
    setSections(newSections);
    saveToHistory(newSections);
    setShowChartSelector(false);
  };

  const updateSection = (id: string, content: any) => {
    const newSections = sections.map(section =>
      section.id === id ? { ...section, content } : section
    );
    setSections(newSections);
    saveToHistory(newSections);
  };

  const deleteSection = (id: string) => {
    const newSections = sections.filter(section => section.id !== id);
    setSections(newSections);
    saveToHistory(newSections);
    if (selectedSection === id) {
      setSelectedSection(null);
    }
  };

  const selectSection = (id: string) => {
    setSelectedSection(id);
    const section = sections.find(s => s.id === id);
    if (section?.type === 'chart') {
      setRightSidebarCollapsed(false);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ← Back
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <h1 className="text-lg font-semibold text-gray-900">Newsletter Editor</h1>
                <SubscriptionBadge tier={subscription.tier} size="sm" />
              </div>

              <div className="flex items-center space-x-2">
                {/* Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setEditorMode('edit')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      editorMode === 'edit' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Edit3 className="w-4 h-4 inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => setEditorMode('preview')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      editorMode === 'preview' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Eye className="w-4 h-4 inline mr-1" />
                    Preview
                  </button>
                </div>

                <div className="h-6 w-px bg-gray-300"></div>

                {/* History Controls */}
                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100"
                  title="Undo"
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100"
                  title="Redo"
                >
                  <Redo className="w-4 h-4" />
                </button>

                <div className="h-6 w-px bg-gray-300"></div>

                {/* AI Insights */}
                {canEditAdvanced && (
                  <button
                    onClick={() => setShowAIInsights(true)}
                    className="flex items-center space-x-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">AI Insights</span>
                  </button>
                )}

                {/* Save & Export */}
                <button
                  onClick={() => onSave(sections)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>

                {canEditAdvanced && (
                  <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Content Tools */}
          {editorMode === 'edit' && (
            <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
              leftSidebarCollapsed ? 'w-16' : 'w-80'
            }`}>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  {!leftSidebarCollapsed && (
                    <h3 className="font-semibold text-gray-900">Content Tools</h3>
                  )}
                  <button
                    onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
                    className="p-1 text-gray-500 hover:text-gray-700 rounded"
                  >
                    <Layout className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-4 overflow-y-auto">
                {/* Add Elements Section */}
                <div>
                  {!leftSidebarCollapsed && (
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Add Elements</h4>
                  )}
                  <div className="space-y-2">
                    <button
                      onClick={() => addNewSection('text')}
                      className={`w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors ${
                        leftSidebarCollapsed ? 'justify-center' : ''
                      }`}
                      title="Add Text Block"
                    >
                      <Type className="w-5 h-5 text-gray-500" />
                      {!leftSidebarCollapsed && <span className="text-sm">Text Block</span>}
                    </button>

                    <button
                      onClick={() => setShowChartSelector(true)}
                      className={`w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors ${
                        leftSidebarCollapsed ? 'justify-center' : ''
                      }`}
                      title="Add Chart"
                    >
                      <BarChart3 className="w-5 h-5 text-gray-500" />
                      {!leftSidebarCollapsed && (
                        <>
                          <span className="text-sm">Chart</span>
                          {!canUseAdvancedCharts && <Crown className="w-4 h-4 text-purple-500 ml-auto" />}
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => addNewSection('image')}
                      disabled={!canCustomizeBranding}
                      className={`w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        leftSidebarCollapsed ? 'justify-center' : ''
                      }`}
                      title="Add Image"
                    >
                      <Image className="w-5 h-5 text-gray-500" />
                      {!leftSidebarCollapsed && (
                        <>
                          <span className="text-sm">Image</span>
                          {!canCustomizeBranding && <Crown className="w-4 h-4 text-purple-500 ml-auto" />}
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => addNewSection('divider')}
                      className={`w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors ${
                        leftSidebarCollapsed ? 'justify-center' : ''
                      }`}
                      title="Add Divider"
                    >
                      <div className="w-5 h-px bg-gray-400"></div>
                      {!leftSidebarCollapsed && <span className="text-sm">Divider</span>}
                    </button>
                  </div>
                </div>

                {/* Branding Section */}
                {canCustomizeBranding && !leftSidebarCollapsed && (
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Branding</h4>
                    <LogoUploader
                      currentLogo={customLogo}
                      onLogoChange={setCustomLogo}
                    />
                  </div>
                )}

                {/* Style Controls */}
                {!leftSidebarCollapsed && (
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Styling</h4>
                    <button
                      disabled={!canEditAdvanced}
                      className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Palette className="w-5 h-5 text-gray-500" />
                      <span className="text-sm">Color Theme</span>
                      {!canEditAdvanced && <Crown className="w-4 h-4 text-purple-500 ml-auto" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main Canvas Area */}
          <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                {/* Newsletter Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {customLogo && (
                        <img src={customLogo} alt="Logo" className="w-10 h-10 rounded" />
                      )}
                      <div>
                        <h1 className="text-2xl font-bold">Interactive Business Newsletter</h1>
                        <div className="flex items-center space-x-2 text-blue-100">
                          <span>{data.company} • {data.date}</span>
                          <SubscriptionBadge tier={subscription.tier} size="sm" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Editable Content */}
                <div className="p-8">
                  {sections
                    .sort((a, b) => a.order - b.order)
                    .map((section, index) => (
                      <DraggableSection
                        key={section.id}
                        section={section}
                        index={index}
                        moveSection={moveSection}
                        onEdit={setEditingSection}
                        onUpdate={updateSection}
                        onDelete={deleteSection}
                        onSelect={selectSection}
                        onChartClick={setSelectedChart}
                        editingSection={editingSection}
                        selectedSection={selectedSection}
                        editorMode={editorMode}
                        subscription={subscription}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Chart Customization */}
          {editorMode === 'edit' && selectedSection && (
            <div className={`bg-white border-l border-gray-200 transition-all duration-300 ${
              rightSidebarCollapsed ? 'w-16' : 'w-80'
            }`}>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  {!rightSidebarCollapsed && (
                    <h3 className="font-semibold text-gray-900">Customization</h3>
                  )}
                  <button
                    onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
                    className="p-1 text-gray-500 hover:text-gray-700 rounded"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!rightSidebarCollapsed && (
                <div className="p-4 overflow-y-auto">
                  <ChartCustomizationPanel
                    selectedSection={sections.find(s => s.id === selectedSection)}
                    onUpdate={updateSection}
                    subscription={subscription}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chart Detail Modal */}
        {selectedChart && (
          <ChartDetailModal
            chart={selectedChart}
            onClose={() => setSelectedChart(null)}
            subscription={subscription}
          />
        )}

        {/* Chart Selector Modal */}
        {showChartSelector && (
          <ChartSelector
            onClose={() => setShowChartSelector(false)}
            onSelectChart={addChartSection}
            subscription={subscription}
          />
        )}

        {/* AI Insights Modal */}
        {showAIInsights && (
          <AIInsightGenerator
            sections={sections}
            onClose={() => setShowAIInsights(false)}
            onAddInsight={(insight) => {
              addNewSection('text');
            }}
          />
        )}
      </div>
    </DndProvider>
  );
};

// Enhanced Draggable Section Component
interface DraggableSectionProps {
  section: NewsletterSection;
  index: number;
  moveSection: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (id: string) => void;
  onUpdate: (id: string, content: any) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  onChartClick: (chart: any) => void;
  editingSection: string | null;
  selectedSection: string | null;
  editorMode: 'edit' | 'preview';
  subscription: UserSubscription;
}

const DraggableSection: React.FC<DraggableSectionProps> = ({
  section,
  index,
  moveSection,
  onEdit,
  onUpdate,
  onDelete,
  onSelect,
  onChartClick,
  editingSection,
  selectedSection,
  editorMode,
  subscription
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: 'section',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: any, monitor) {
      if (!ref.current) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;
      
      if (dragIndex === hoverIndex) return;
      
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;
      
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      
      moveSection(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'section',
    item: () => ({ id: section.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const isSelected = selectedSection === section.id;

  const renderSectionContent = () => {
    switch (section.type) {
      case 'text':
        return (
          <TextEditor
            content={section.content}
            isEditing={editingSection === section.id}
            onEdit={() => onEdit(section.id)}
            onSave={(content) => {
              onUpdate(section.id, content);
              onEdit('');
            }}
            onCancel={() => onEdit('')}
            subscription={subscription}
          />
        );
      
      case 'chart':
        return (
          <div 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 rounded-lg"
            onClick={() => {
              onSelect(section.id);
              onChartClick(section.content);
            }}
          >
            <div className="bg-gray-100 rounded-lg p-6 text-center border-2 border-dashed border-gray-300 hover:border-blue-400">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 font-medium">
                {section.content?.type || 'Chart'} Visualization
              </p>
              <p className="text-sm text-gray-500 mt-1">Click to view and customize</p>
            </div>
          </div>
        );
      
      case 'image':
        return (
          <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
            <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 font-medium">Image Placeholder</p>
            <p className="text-sm text-gray-500 mt-1">Click to upload image</p>
          </div>
        );
      
      case 'divider':
        return <hr className="border-gray-300 my-6" />;
      
      default:
        return null;
    }
  };

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      className={`relative group mb-6 transition-all duration-200 ${
        isDragging ? 'opacity-50' : ''
      } ${
        editorMode === 'edit' ? 'hover:ring-2 hover:ring-blue-300 rounded-lg' : ''
      } ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}
      onClick={() => editorMode === 'edit' && onSelect(section.id)}
    >
      {/* Edit Controls */}
      {editorMode === 'edit' && (
        <div className="absolute -left-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <div className="flex flex-col space-y-1">
            <button
              className="p-1 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50"
              title="Drag to reorder"
            >
              <Move className="w-4 h-4 text-gray-500" />
            </button>
            {section.editable && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(section.id);
                }}
                className="p-1 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50"
                title="Edit"
              >
                <Edit3 className="w-4 h-4 text-gray-500" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(section.id);
              }}
              className="p-1 bg-white border border-gray-300 rounded shadow-sm hover:bg-red-50 text-red-500"
              title="Delete"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {renderSectionContent()}
    </div>
  );
};

export default InteractiveNewsletterEditor;