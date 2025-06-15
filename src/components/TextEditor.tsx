import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Link, List, Save, X, Type, Palette } from 'lucide-react';
import { UserSubscription } from '../types/subscription';

interface TextEditorProps {
  content: any;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (content: any) => void;
  onCancel: () => void;
  subscription: UserSubscription;
}

const TextEditor: React.FC<TextEditorProps> = ({
  content,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  subscription
}) => {
  const [text, setText] = useState(content.text || '');
  const [formatting, setFormatting] = useState({
    bold: false,
    italic: false,
    underline: false,
    fontSize: 'medium',
    color: '#000000'
  });
  
  const editorRef = useRef<HTMLDivElement>(null);
  const canCustomizeFormatting = subscription.tier !== 'free';

  useEffect(() => {
    if (isEditing && editorRef.current) {
      editorRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    onSave({
      ...content,
      text,
      formatting: canCustomizeFormatting ? formatting : undefined
    });
  };

  const applyFormatting = (command: string, value?: string) => {
    if (!canCustomizeFormatting) return;
    
    document.execCommand(command, false, value);
    
    // Update formatting state
    setFormatting(prev => ({
      ...prev,
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline')
    }));
  };

  const renderContent = () => {
    if (content.type === 'header') {
      return (
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{content.title}</h1>
          <p className="text-gray-600">{content.subtitle}</p>
        </div>
      );
    }

    if (content.type === 'summary') {
      return (
        <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">Executive Summary</h2>
          <p className="text-gray-700 leading-relaxed">{text}</p>
        </div>
      );
    }

    if (content.type === 'insights') {
      return (
        <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-600 mb-6">
          <h2 className="text-xl font-semibold text-purple-900 mb-3">Market Insights</h2>
          <p className="text-gray-700 leading-relaxed">{text}</p>
        </div>
      );
    }

    return (
      <div className="mb-6">
        <p className="text-gray-700 leading-relaxed">{text}</p>
      </div>
    );
  };

  if (!isEditing) {
    return (
      <div onClick={onEdit} className="cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors">
        {renderContent()}
      </div>
    );
  }

  return (
    <div className="border border-blue-300 rounded-lg p-4 bg-white shadow-sm">
      {/* Formatting Toolbar */}
      {canCustomizeFormatting && (
        <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-gray-200">
          <button
            onClick={() => applyFormatting('bold')}
            className={`p-2 rounded hover:bg-gray-100 ${formatting.bold ? 'bg-gray-200' : ''}`}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => applyFormatting('italic')}
            className={`p-2 rounded hover:bg-gray-100 ${formatting.italic ? 'bg-gray-200' : ''}`}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => applyFormatting('underline')}
            className={`p-2 rounded hover:bg-gray-100 ${formatting.underline ? 'bg-gray-200' : ''}`}
          >
            <Underline className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-300"></div>
          
          <select
            value={formatting.fontSize}
            onChange={(e) => {
              setFormatting(prev => ({ ...prev, fontSize: e.target.value }));
              applyFormatting('fontSize', e.target.value);
            }}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
          
          <input
            type="color"
            value={formatting.color}
            onChange={(e) => {
              setFormatting(prev => ({ ...prev, color: e.target.value }));
              applyFormatting('foreColor', e.target.value);
            }}
            className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
          />
        </div>
      )}

      {/* Text Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => setText(e.currentTarget.textContent || '')}
        className="min-h-[100px] p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        style={{
          fontSize: formatting.fontSize === 'small' ? '14px' : formatting.fontSize === 'large' ? '18px' : '16px',
          color: canCustomizeFormatting ? formatting.color : undefined
        }}
      >
        {text}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-2 mt-4">
        <button
          onClick={onCancel}
          className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>
      </div>

      {!canCustomizeFormatting && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
          Upgrade to Basic or Pro for advanced text formatting options
        </div>
      )}
    </div>
  );
};

export default TextEditor;