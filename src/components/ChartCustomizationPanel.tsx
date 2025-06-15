import React, { useState } from 'react';
import { Palette, Type, Settings, Crown, Lock } from 'lucide-react';
import { UserSubscription } from '../types/subscription';

interface ChartCustomizationPanelProps {
  selectedSection: any;
  onUpdate: (id: string, content: any) => void;
  subscription: UserSubscription;
}

const ChartCustomizationPanel: React.FC<ChartCustomizationPanelProps> = ({
  selectedSection,
  onUpdate,
  subscription
}) => {
  const [activeTab, setActiveTab] = useState<'style' | 'data' | 'layout'>('style');

  if (!selectedSection || selectedSection.type !== 'chart') {
    return (
      <div className="text-center py-8">
        <Settings className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">Select a chart to customize</p>
      </div>
    );
  }

  const canCustomizeBasic = subscription.tier !== 'free';
  const canCustomizeAdvanced = subscription.tier === 'pro';

  const colorPalettes = [
    { name: 'Blue', colors: ['#3b82f6', '#1d4ed8', '#1e40af'] },
    { name: 'Green', colors: ['#10b981', '#059669', '#047857'] },
    { name: 'Purple', colors: ['#8b5cf6', '#7c3aed', '#6d28d9'] },
    { name: 'Orange', colors: ['#f59e0b', '#d97706', '#b45309'] },
    { name: 'Red', colors: ['#ef4444', '#dc2626', '#b91c1c'] }
  ];

  const handleStyleUpdate = (property: string, value: any) => {
    if (!canCustomizeBasic && property !== 'title') return;

    const updatedContent = {
      ...selectedSection.content,
      style: {
        ...selectedSection.content.style,
        [property]: value
      }
    };
    onUpdate(selectedSection.id, updatedContent);
  };

  const tabs = [
    { id: 'style', name: 'Style', icon: Palette },
    { id: 'data', name: 'Data', icon: Settings },
    { id: 'layout', name: 'Layout', icon: Type }
  ];

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'style' && (
        <div className="space-y-4">
          {/* Chart Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chart Title
            </label>
            <input
              type="text"
              value={selectedSection.content.title || ''}
              onChange={(e) => handleStyleUpdate('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter chart title"
            />
          </div>

          {/* Color Palettes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Color Palette
              </label>
              {!canCustomizeBasic && <Crown className="w-4 h-4 text-purple-500" />}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {colorPalettes.map((palette) => (
                <button
                  key={palette.name}
                  disabled={!canCustomizeBasic}
                  onClick={() => handleStyleUpdate('colorPalette', palette.colors)}
                  className={`p-2 border rounded-lg transition-colors ${
                    canCustomizeBasic
                      ? 'hover:border-gray-400'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex space-x-1 mb-1">
                    {palette.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">{palette.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Style Options */}
          {canCustomizeAdvanced ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <input
                  type="color"
                  value={selectedSection.content.style?.backgroundColor || '#ffffff'}
                  onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Border Style
                </label>
                <select
                  value={selectedSection.content.style?.borderStyle || 'solid'}
                  onChange={(e) => handleStyleUpdate('borderStyle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">None</option>
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2 text-yellow-800">
                <Crown className="w-4 h-4" />
                <span className="text-sm font-medium">Pro Features</span>
              </div>
              <p className="text-xs text-yellow-700 mt-1">
                Upgrade to Pro for advanced styling options including custom colors, fonts, and borders.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'data' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Source
            </label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">
                Chart data is automatically generated from your business metrics.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Labels
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedSection.content.showDataLabels || false}
                onChange={(e) => handleStyleUpdate('showDataLabels', e.target.checked)}
                disabled={!canCustomizeBasic}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Show data labels on chart</span>
              {!canCustomizeBasic && <Lock className="w-4 h-4 text-gray-400" />}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Legend Position
            </label>
            <select
              value={selectedSection.content.legendPosition || 'bottom'}
              onChange={(e) => handleStyleUpdate('legendPosition', e.target.value)}
              disabled={!canCustomizeBasic}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="none">Hidden</option>
            </select>
          </div>
        </div>
      )}

      {activeTab === 'layout' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chart Height
            </label>
            <select
              value={selectedSection.content.height || 'medium'}
              onChange={(e) => handleStyleUpdate('height', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="small">Small (200px)</option>
              <option value="medium">Medium (300px)</option>
              <option value="large">Large (400px)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Margin
            </label>
            <select
              value={selectedSection.content.margin || 'normal'}
              onChange={(e) => handleStyleUpdate('margin', e.target.value)}
              disabled={!canCustomizeBasic}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="tight">Tight</option>
              <option value="normal">Normal</option>
              <option value="loose">Loose</option>
            </select>
          </div>

          {canCustomizeAdvanced && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Animation
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedSection.content.animated !== false}
                  onChange={(e) => handleStyleUpdate('animated', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Enable chart animations</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={() => {
            // Reset to default styles
            const updatedContent = {
              ...selectedSection.content,
              style: {}
            };
            onUpdate(selectedSection.id, updatedContent);
          }}
          className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
};

export default ChartCustomizationPanel;