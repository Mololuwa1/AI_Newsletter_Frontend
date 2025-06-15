import React, { useState } from 'react';
import { Download, Share2, Mail, Copy, ExternalLink, FileText, Image, Printer } from 'lucide-react';

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  fileExtension: string;
  isPremium: boolean;
}

interface ExportOptionsProps {
  newsletterData: any;
  onExport: (format: string, options: any) => void;
  userTier: 'free' | 'basic' | 'pro' | 'enterprise';
  onUpgrade: () => void;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({
  newsletterData,
  onExport,
  userTier,
  onUpgrade
}) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('html');
  const [exportOptions, setExportOptions] = useState({
    includeImages: true,
    includeCharts: true,
    optimizeForEmail: false,
    customFileName: '',
    emailSubject: '',
    emailRecipients: '',
    sharePublicly: false,
    passwordProtect: false,
    password: ''
  });
  const [isExporting, setIsExporting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const exportFormats: ExportFormat[] = [
    {
      id: 'html',
      name: 'HTML',
      description: 'Web-ready HTML file for email or web publishing',
      icon: ExternalLink,
      fileExtension: '.html',
      isPremium: false
    },
    {
      id: 'pdf',
      name: 'PDF',
      description: 'Professional PDF document for printing or sharing',
      icon: FileText,
      fileExtension: '.pdf',
      isPremium: false
    },
    {
      id: 'image',
      name: 'Image (PNG)',
      description: 'High-quality image for social media or presentations',
      icon: Image,
      fileExtension: '.png',
      isPremium: true
    },
    {
      id: 'email',
      name: 'Email Template',
      description: 'Email-optimized HTML for newsletter platforms',
      icon: Mail,
      fileExtension: '.html',
      isPremium: true
    },
    {
      id: 'print',
      name: 'Print Ready',
      description: 'High-resolution PDF optimized for printing',
      icon: Printer,
      fileExtension: '.pdf',
      isPremium: true
    }
  ];

  const canUseFormat = (format: ExportFormat) => {
    if (!format.isPremium) return true;
    return ['pro', 'enterprise'].includes(userTier);
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const options = {
        ...exportOptions,
        format: selectedFormat,
        fileName: exportOptions.customFileName || `newsletter-${Date.now()}`
      };
      
      await onExport(selectedFormat, options);
      
      // If sharing publicly, generate share URL
      if (exportOptions.sharePublicly) {
        const mockShareUrl = `https://newsletter.app/share/${Date.now()}`;
        setShareUrl(mockShareUrl);
        setShowShareModal(true);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async (platform: string) => {
    const url = shareUrl || window.location.href;
    const title = 'Check out my newsletter';
    
    switch (platform) {
      case 'copy':
        await navigator.clipboard.writeText(url);
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        break;
    }
  };

  const selectedFormatData = exportFormats.find(f => f.id === selectedFormat);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Options</h3>
        <p className="text-gray-600">Choose how you want to export and share your newsletter</p>
      </div>

      {/* Format Selection */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Export Format</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exportFormats.map((format) => {
            const Icon = format.icon;
            const canUse = canUseFormat(format);
            const isSelected = selectedFormat === format.id;

            return (
              <button
                key={format.id}
                onClick={() => canUse && setSelectedFormat(format.id)}
                disabled={!canUse}
                className={`p-4 border rounded-lg text-left transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : canUse
                    ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    : 'border-gray-200 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Icon className={`w-6 h-6 mt-1 ${
                    isSelected ? 'text-blue-600' : canUse ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h5 className={`font-medium ${
                        isSelected ? 'text-blue-900' : canUse ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {format.name}
                      </h5>
                      {format.isPremium && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          Pro
                        </span>
                      )}
                    </div>
                    <p className={`text-sm mt-1 ${
                      isSelected ? 'text-blue-700' : canUse ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {format.description}
                    </p>
                    {!canUse && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpgrade();
                        }}
                        className="text-xs text-purple-600 hover:text-purple-700 mt-2"
                      >
                        Upgrade to use
                      </button>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Options */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Export Settings</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File Name (optional)
            </label>
            <input
              type="text"
              value={exportOptions.customFileName}
              onChange={(e) => setExportOptions(prev => ({ ...prev, customFileName: e.target.value }))}
              placeholder={`newsletter-${new Date().toISOString().split('T')[0]}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={exportOptions.includeImages}
                onChange={(e) => setExportOptions(prev => ({ ...prev, includeImages: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Include images</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={exportOptions.includeCharts}
                onChange={(e) => setExportOptions(prev => ({ ...prev, includeCharts: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Include charts and visualizations</span>
            </label>

            {selectedFormat === 'email' && (
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={exportOptions.optimizeForEmail}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, optimizeForEmail: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Optimize for email clients</span>
              </label>
            )}
          </div>
        </div>

        {/* Sharing Options */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Sharing Options</h4>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={exportOptions.sharePublicly}
                onChange={(e) => setExportOptions(prev => ({ ...prev, sharePublicly: e.target.checked }))}
                className="rounded border-gray-300"
                disabled={!['pro', 'enterprise'].includes(userTier)}
              />
              <span className="text-sm text-gray-700">
                Create public share link
                {!['pro', 'enterprise'].includes(userTier) && (
                  <span className="text-purple-600 ml-1">(Pro feature)</span>
                )}
              </span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={exportOptions.passwordProtect}
                onChange={(e) => setExportOptions(prev => ({ ...prev, passwordProtect: e.target.checked }))}
                className="rounded border-gray-300"
                disabled={!['pro', 'enterprise'].includes(userTier)}
              />
              <span className="text-sm text-gray-700">
                Password protect
                {!['pro', 'enterprise'].includes(userTier) && (
                  <span className="text-purple-600 ml-1">(Pro feature)</span>
                )}
              </span>
            </label>

            {exportOptions.passwordProtect && ['pro', 'enterprise'].includes(userTier) && (
              <input
                type="password"
                value={exportOptions.password}
                onChange={(e) => setExportOptions(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          {selectedFormat === 'email' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Subject
                </label>
                <input
                  type="text"
                  value={exportOptions.emailSubject}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, emailSubject: e.target.value }))}
                  placeholder="Your Newsletter Subject"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipients (comma-separated)
                </label>
                <textarea
                  value={exportOptions.emailRecipients}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, emailRecipients: e.target.value }))}
                  placeholder="email1@example.com, email2@example.com"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export Summary */}
      {selectedFormatData && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Export Summary</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Format: {selectedFormatData.name} ({selectedFormatData.fileExtension})</p>
            <p>File name: {exportOptions.customFileName || `newsletter-${new Date().toISOString().split('T')[0]}`}{selectedFormatData.fileExtension}</p>
            {exportOptions.includeImages && <p>✓ Images included</p>}
            {exportOptions.includeCharts && <p>✓ Charts included</p>}
            {exportOptions.sharePublicly && <p>✓ Public share link will be created</p>}
            {exportOptions.passwordProtect && <p>✓ Password protection enabled</p>}
          </div>
        </div>
      )}

      {/* Export Button */}
      <div className="flex justify-center">
        <button
          onClick={handleExport}
          disabled={isExporting || !selectedFormatData || !canUseFormat(selectedFormatData)}
          className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-colors ${
            isExporting || !selectedFormatData || !canUseFormat(selectedFormatData!)
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isExporting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Export Newsletter</span>
            </>
          )}
        </button>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Your Newsletter</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Share URL</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <button
                    onClick={() => handleShare('copy')}
                    className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Share on</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleShare('email')}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Twitter</span>
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportOptions;

