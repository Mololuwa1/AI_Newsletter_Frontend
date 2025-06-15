import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, List, Type, AlignLeft, AlignCenter, AlignRight, Undo, Redo } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxLength?: number;
  showWordCount?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start typing your content...",
  minHeight = "200px",
  maxLength = 10000,
  showWordCount = true
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
      updateCounts(value);
    }
  }, [value]);

  const updateCounts = (text: string) => {
    const plainText = text.replace(/<[^>]*>/g, '');
    setCharCount(plainText.length);
    setWordCount(plainText.trim() ? plainText.trim().split(/\s+/).length : 0);
  };

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      updateCounts(content);
      onChange(content);
    }
  };

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const formatButtons = [
    { command: 'bold', icon: Bold, label: 'Bold' },
    { command: 'italic', icon: Italic, label: 'Italic' },
    { command: 'insertUnorderedList', icon: List, label: 'Bullet List' },
    { command: 'justifyLeft', icon: AlignLeft, label: 'Align Left' },
    { command: 'justifyCenter', icon: AlignCenter, label: 'Align Center' },
    { command: 'justifyRight', icon: AlignRight, label: 'Align Right' },
    { command: 'undo', icon: Undo, label: 'Undo' },
    { command: 'redo', icon: Redo, label: 'Redo' },
  ];

  const headingOptions = [
    { value: 'div', label: 'Normal' },
    { value: 'h1', label: 'Heading 1' },
    { value: 'h2', label: 'Heading 2' },
    { value: 'h3', label: 'Heading 3' },
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-3 bg-gray-50">
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          {/* Heading Selector */}
          <select
            onChange={(e) => executeCommand('formatBlock', e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {headingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="w-px h-6 bg-gray-300" />

          {/* Format Buttons */}
          {formatButtons.map((button) => {
            const Icon = button.icon;
            return (
              <button
                key={button.command}
                onClick={() => executeCommand(button.command)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
                title={button.label}
                type="button"
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`p-4 outline-none ${minHeight ? `min-h-[${minHeight}]` : 'min-h-[200px]'} prose prose-sm max-w-none`}
          style={{ minHeight }}
          data-placeholder={placeholder}
        />
        
        {!value && !isFocused && (
          <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>

      {/* Footer with counts */}
      {showWordCount && (
        <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 text-sm text-gray-600 flex justify-between">
          <div>
            {wordCount} words, {charCount} characters
          </div>
          {maxLength && (
            <div className={charCount > maxLength ? 'text-red-500' : ''}>
              {charCount}/{maxLength}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;

