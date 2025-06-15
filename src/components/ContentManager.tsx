import React, { useState, useEffect } from 'react';
import { Save, Download, Upload, FileText, Clock, Trash2 } from 'lucide-react';
import TextInputSection from './TextInputSection';

interface TextSection {
  id: string;
  title: string;
  content: string;
  type: 'summary' | 'metrics' | 'insights' | 'highlights' | 'custom';
  required: boolean;
}

interface ContentDraft {
  id: string;
  name: string;
  sections: TextSection[];
  lastModified: Date;
  company?: string;
}

interface ContentManagerProps {
  onContentReady: (sections: TextSection[]) => void;
  initialSections?: TextSection[];
}

const ContentManager: React.FC<ContentManagerProps> = ({
  onContentReady,
  initialSections = []
}) => {
  const [sections, setSections] = useState<TextSection[]>(
    initialSections.length > 0 ? initialSections : [
      {
        id: 'summary',
        title: 'Executive Summary',
        content: '',
        type: 'summary',
        required: true
      }
    ]
  );
  
  const [drafts, setDrafts] = useState<ContentDraft[]>([]);
  const [showDrafts, setShowDrafts] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // Load drafts from localStorage on component mount
  useEffect(() => {
    const savedDrafts = localStorage.getItem('newsletter_drafts');
    if (savedDrafts) {
      try {
        const parsedDrafts = JSON.parse(savedDrafts).map((draft: any) => ({
          ...draft,
          lastModified: new Date(draft.lastModified)
        }));
        setDrafts(parsedDrafts);
      } catch (error) {
        console.error('Error loading drafts:', error);
      }
    }
  }, []);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (sections.some(s => s.content.trim())) {
        autoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(autoSaveTimer);
  }, [sections]);

  const autoSave = () => {
    setIsAutoSaving(true);
    const autoSaveDraft: ContentDraft = {
      id: 'autosave',
      name: 'Auto-saved Draft',
      sections,
      lastModified: new Date()
    };

    const updatedDrafts = drafts.filter(d => d.id !== 'autosave');
    updatedDrafts.unshift(autoSaveDraft);
    
    setDrafts(updatedDrafts);
    localStorage.setItem('newsletter_drafts', JSON.stringify(updatedDrafts));
    
    setTimeout(() => setIsAutoSaving(false), 1000);
  };

  const saveDraft = () => {
    if (!draftName.trim()) return;

    const newDraft: ContentDraft = {
      id: Date.now().toString(),
      name: draftName,
      sections,
      lastModified: new Date()
    };

    const updatedDrafts = [newDraft, ...drafts.filter(d => d.id !== 'autosave')];
    setDrafts(updatedDrafts);
    localStorage.setItem('newsletter_drafts', JSON.stringify(updatedDrafts));
    
    setDraftName('');
    setShowSaveDialog(false);
  };

  const loadDraft = (draft: ContentDraft) => {
    setSections(draft.sections);
    setShowDrafts(false);
  };

  const deleteDraft = (draftId: string) => {
    const updatedDrafts = drafts.filter(d => d.id !== draftId);
    setDrafts(updatedDrafts);
    localStorage.setItem('newsletter_drafts', JSON.stringify(updatedDrafts));
  };

  const exportContent = () => {
    const exportData = {
      sections,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-content-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        if (importData.sections && Array.isArray(importData.sections)) {
          setSections(importData.sections);
        }
      } catch (error) {
        alert('Error importing file. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const isContentReady = () => {
    const requiredSections = sections.filter(s => s.required);
    return requiredSections.every(s => s.content.trim()) && sections.some(s => s.content.trim());
  };

  const handleGenerateNewsletter = () => {
    if (isContentReady()) {
      onContentReady(sections);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Manager</h2>
          <p className="text-gray-600">Create and manage your newsletter content</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {isAutoSaving && (
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              <Clock className="w-4 h-4 animate-spin" />
              <span>Auto-saving...</span>
            </div>
          )}
          
          <button
            onClick={() => setShowDrafts(!showDrafts)}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Drafts ({drafts.length})</span>
          </button>
          
          <button
            onClick={() => setShowSaveDialog(true)}
            className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={exportContent}
              className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Export Content"
            >
              <Download className="w-4 h-4" />
            </button>
            
            <label className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" title="Import Content">
              <Upload className="w-4 h-4" />
              <input
                type="file"
                accept=".json"
                onChange={importContent}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Drafts Panel */}
      {showDrafts && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Drafts</h3>
          {drafts.length === 0 ? (
            <p className="text-gray-500">No saved drafts yet.</p>
          ) : (
            <div className="space-y-3">
              {drafts.map((draft) => (
                <div key={draft.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{draft.name}</h4>
                    <p className="text-sm text-gray-500">
                      {draft.sections.length} sections • Last modified: {draft.lastModified.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => loadDraft(draft)}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-300 rounded hover:bg-blue-50 transition-colors"
                    >
                      Load
                    </button>
                    {draft.id !== 'autosave' && (
                      <button
                        onClick={() => deleteDraft(draft.id)}
                        className="p-1 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Save Draft</h3>
            <input
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="Enter draft name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveDraft}
                disabled={!draftName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Text Input Section */}
      <TextInputSection
        sections={sections}
        onSectionsChange={setSections}
      />

      {/* Generate Button */}
      <div className="flex justify-center pt-6">
        <button
          onClick={handleGenerateNewsletter}
          disabled={!isContentReady()}
          className={`px-8 py-3 rounded-lg font-medium transition-colors ${
            isContentReady()
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Generate Newsletter from Content
        </button>
      </div>

      {!isContentReady() && (
        <div className="text-center text-sm text-gray-500">
          Please complete all required sections to generate your newsletter
        </div>
      )}
    </div>
  );
};

export default ContentManager;

