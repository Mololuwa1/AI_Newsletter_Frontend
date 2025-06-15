import React, { useState, useRef } from 'react';
import { Upload, Palette, Type, Image, Download, RefreshCw, Eye, X } from 'lucide-react';

interface BrandingOptions {
  logo?: {
    file: File | null;
    url: string;
    position: 'left' | 'center' | 'right';
    size: 'small' | 'medium' | 'large';
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  fonts: {
    heading: string;
    body: string;
    size: 'small' | 'medium' | 'large';
  };
  layout: {
    headerStyle: 'minimal' | 'standard' | 'bold';
    spacing: 'compact' | 'standard' | 'spacious';
    borderRadius: 'none' | 'small' | 'medium' | 'large';
  };
}

interface BrandingOptionsProps {
  options: BrandingOptions;
  onOptionsChange: (options: BrandingOptions) => void;
  userTier: 'free' | 'basic' | 'pro' | 'enterprise';
  onUpgrade: () => void;
}

const BrandingOptionsComponent: React.FC<BrandingOptionsProps> = ({
  options,
  onOptionsChange,
  userTier,
  onUpgrade
}) => {
  const [activeTab, setActiveTab] = useState<'logo' | 'colors' | 'fonts' | 'layout'>('logo');
  const [showPreview, setShowPreview] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const colorPresets = [
    {
      name: 'Professional Blue',
      colors: {
        primary: '#2563eb',
        secondary: '#1e40af',
        accent: '#3b82f6',
        text: '#1f2937',
        background: '#ffffff'
      }
    },
    {
      name: 'Corporate Gray',
      colors: {
        primary: '#374151',
        secondary: '#4b5563',
        accent: '#6b7280',
        text: '#111827',
        background: '#f9fafb'
      }
    },
    {
      name: 'Modern Purple',
      colors: {
        primary: '#7c3aed',
        secondary: '#8b5cf6',
        accent: '#a78bfa',
        text: '#1f2937',
        background: '#ffffff'
      }
    },
    {
      name: 'Fresh Green',
      colors: {
        primary: '#059669',
        secondary: '#047857',
        accent: '#10b981',
        text: '#1f2937',
        background: '#ffffff'
      }
    },
    {
      name: 'Warm Orange',
      colors: {
        primary: '#ea580c',
        secondary: '#dc2626',
        accent: '#f97316',
        text: '#1f2937',
        background: '#ffffff'
      }
    }
  ];

  const fontOptions = [
    { name: 'Inter', value: 'Inter, sans-serif', category: 'Modern Sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif', category: 'Clean Sans-serif' },
    { name: 'Open Sans', value: 'Open Sans, sans-serif', category: 'Friendly Sans-serif' },
    { name: 'Lato', value: 'Lato, sans-serif', category: 'Humanist Sans-serif' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif', category: 'Geometric Sans-serif' },
    { name: 'Playfair Display', value: 'Playfair Display, serif', category: 'Elegant Serif' },
    { name: 'Merriweather', value: 'Merriweather, serif', category: 'Readable Serif' },
    { name: 'Source Sans Pro', value: 'Source Sans Pro, sans-serif', category: 'Technical Sans-serif' }
  ];

  const isPremiumFeature = (feature: string) => {
    const premiumFeatures = ['custom-fonts', 'advanced-layout', 'logo-positioning'];
    return premiumFeatures.includes(feature) && !['pro', 'enterprise'].includes(userTier);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onOptionsChange({
        ...options,
        logo: {
          ...options.logo,
          file,
          url
        }
      });
    }
  };

  const removeLogo = () => {
    if (options.logo?.url) {
      URL.revokeObjectURL(options.logo.url);
    }
    onOptionsChange({
      ...options,
      logo: {
        file: null,
        url: '',
        position: 'left',
        size: 'medium'
      }
    });
  };

  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    onOptionsChange({
      ...options,
      colors: preset.colors
    });
  };

  const updateColor = (colorKey: keyof BrandingOptions['colors'], value: string) => {
    onOptionsChange({
      ...options,
      colors: {
        ...options.colors,
        [colorKey]: value
      }
    });
  };

  const updateFont = (fontType: 'heading' | 'body', value: string) => {
    onOptionsChange({
      ...options,
      fonts: {
        ...options.fonts,
        [fontType]: value
      }
    });
  };

  const updateLayout = (layoutKey: keyof BrandingOptions['layout'], value: any) => {
    onOptionsChange({
      ...options,
      layout: {
        ...options.layout,
        [layoutKey]: value
      }
    });
  };

  const exportBrandingConfig = () => {
    const config = {
      branding: options,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'branding-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetToDefaults = () => {
    onOptionsChange({
      logo: {
        file: null,
        url: '',
        position: 'left',
        size: 'medium'
      },
      colors: {
        primary: '#2563eb',
        secondary: '#1e40af',
        accent: '#3b82f6',
        text: '#1f2937',
        background: '#ffffff'
      },
      fonts: {
        heading: 'Inter, sans-serif',
        body: 'Inter, sans-serif',
        size: 'medium'
      },
      layout: {
        headerStyle: 'standard',
        spacing: 'standard',
        borderRadius: 'small'
      }
    });
  };

  const tabs = [
    { id: 'logo' as const, name: 'Logo & Images', icon: Image },
    { id: 'colors' as const, name: 'Colors', icon: Palette },
    { id: 'fonts' as const, name: 'Typography', icon: Type },
    { id: 'layout' as const, name: 'Layout', icon: RefreshCw }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Branding Options</h3>
          <p className="text-gray-600">Customize the look and feel of your newsletter</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
          
          <button
            onClick={exportBrandingConfig}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          
          <button
            onClick={resetToDefaults}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Logo Tab */}
        {activeTab === 'logo' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Company Logo</h4>
              
              {/* Logo Upload */}
              <div className="space-y-4">
                {options.logo?.url ? (
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 border border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                      <img
                        src={options.logo.url}
                        alt="Logo preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">Logo uploaded successfully</p>
                      <button
                        onClick={removeLogo}
                        className="flex items-center space-x-2 text-red-600 hover:text-red-700 text-sm"
                      >
                        <X className="w-4 h-4" />
                        <span>Remove Logo</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload your company logo</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                  </div>
                )}
                
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>

              {/* Logo Settings */}
              {options.logo?.url && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                    <select
                      value={options.logo.position}
                      onChange={(e) => onOptionsChange({
                        ...options,
                        logo: { ...options.logo!, position: e.target.value as any }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isPremiumFeature('logo-positioning')}
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                    {isPremiumFeature('logo-positioning') && (
                      <p className="text-xs text-gray-500 mt-1">
                        <button onClick={onUpgrade} className="text-purple-600 hover:text-purple-700">
                          Upgrade to Pro
                        </button> for logo positioning
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                    <select
                      value={options.logo.size}
                      onChange={(e) => onOptionsChange({
                        ...options,
                        logo: { ...options.logo!, size: e.target.value as any }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Colors Tab */}
        {activeTab === 'colors' && (
          <div className="space-y-6">
            {/* Color Presets */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Color Presets</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {colorPresets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => applyColorPreset(preset)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex space-x-1">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: preset.colors.primary }}
                        />
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: preset.colors.secondary }}
                        />
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: preset.colors.accent }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{preset.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Colors */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Custom Colors</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(options.colors).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => updateColor(key as keyof BrandingOptions['colors'], e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => updateColor(key as keyof BrandingOptions['colors'], e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Fonts Tab */}
        {activeTab === 'fonts' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Heading Font */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading Font</label>
                <select
                  value={options.fonts.heading}
                  onChange={(e) => updateFont('heading', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isPremiumFeature('custom-fonts')}
                >
                  {fontOptions.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.name} - {font.category}
                    </option>
                  ))}
                </select>
                {isPremiumFeature('custom-fonts') && (
                  <p className="text-xs text-gray-500 mt-1">
                    <button onClick={onUpgrade} className="text-purple-600 hover:text-purple-700">
                      Upgrade to Pro
                    </button> for custom fonts
                  </p>
                )}
              </div>

              {/* Body Font */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Body Font</label>
                <select
                  value={options.fonts.body}
                  onChange={(e) => updateFont('body', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isPremiumFeature('custom-fonts')}
                >
                  {fontOptions.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.name} - {font.category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
              <div className="flex space-x-4">
                {['small', 'medium', 'large'].map((size) => (
                  <button
                    key={size}
                    onClick={() => onOptionsChange({
                      ...options,
                      fonts: { ...options.fonts, size: size as any }
                    })}
                    className={`px-4 py-2 rounded-lg border transition-colors capitalize ${
                      options.fonts.size === size
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Preview */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h5 className="text-sm font-medium text-gray-700 mb-4">Font Preview</h5>
              <div className="space-y-4">
                <h1
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: options.fonts.heading,
                    color: options.colors.text,
                    fontSize: options.fonts.size === 'small' ? '1.5rem' : options.fonts.size === 'large' ? '2rem' : '1.75rem'
                  }}
                >
                  Newsletter Heading
                </h1>
                <p
                  style={{
                    fontFamily: options.fonts.body,
                    color: options.colors.text,
                    fontSize: options.fonts.size === 'small' ? '0.875rem' : options.fonts.size === 'large' ? '1.125rem' : '1rem'
                  }}
                >
                  This is how your newsletter body text will appear. The font family and size will be applied consistently throughout your newsletter content.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Layout Tab */}
        {activeTab === 'layout' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Header Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Header Style</label>
                <div className="space-y-2">
                  {['minimal', 'standard', 'bold'].map((style) => (
                    <button
                      key={style}
                      onClick={() => updateLayout('headerStyle', style)}
                      className={`w-full p-3 text-left border rounded-lg transition-colors capitalize ${
                        options.layout.headerStyle === style
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      disabled={isPremiumFeature('advanced-layout')}
                    >
                      {style}
                    </button>
                  ))}
                </div>
                {isPremiumFeature('advanced-layout') && (
                  <p className="text-xs text-gray-500 mt-2">
                    <button onClick={onUpgrade} className="text-purple-600 hover:text-purple-700">
                      Upgrade to Pro
                    </button> for advanced layouts
                  </p>
                )}
              </div>

              {/* Spacing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Spacing</label>
                <div className="space-y-2">
                  {['compact', 'standard', 'spacious'].map((spacing) => (
                    <button
                      key={spacing}
                      onClick={() => updateLayout('spacing', spacing)}
                      className={`w-full p-3 text-left border rounded-lg transition-colors capitalize ${
                        options.layout.spacing === spacing
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {spacing}
                    </button>
                  ))}
                </div>
              </div>

              {/* Border Radius */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius</label>
                <div className="space-y-2">
                  {['none', 'small', 'medium', 'large'].map((radius) => (
                    <button
                      key={radius}
                      onClick={() => updateLayout('borderRadius', radius)}
                      className={`w-full p-3 text-left border rounded-lg transition-colors capitalize ${
                        options.layout.borderRadius === radius
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {radius}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Branding Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Preview Content */}
              <div
                className="border rounded-lg overflow-hidden"
                style={{ backgroundColor: options.colors.background }}
              >
                {/* Header */}
                <div
                  className="p-6 border-b"
                  style={{
                    backgroundColor: options.colors.primary,
                    borderBottomColor: options.colors.secondary
                  }}
                >
                  <div className="flex items-center justify-between">
                    {options.logo?.url && (
                      <img
                        src={options.logo.url}
                        alt="Logo"
                        className={`${
                          options.logo.size === 'small' ? 'h-8' : 
                          options.logo.size === 'large' ? 'h-16' : 'h-12'
                        }`}
                      />
                    )}
                    <h1
                      className="text-white font-bold"
                      style={{
                        fontFamily: options.fonts.heading,
                        fontSize: options.fonts.size === 'small' ? '1.5rem' : 
                                 options.fonts.size === 'large' ? '2rem' : '1.75rem'
                      }}
                    >
                      Company Newsletter
                    </h1>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 space-y-4">
                  <h2
                    style={{
                      fontFamily: options.fonts.heading,
                      color: options.colors.text,
                      fontSize: options.fonts.size === 'small' ? '1.25rem' : 
                               options.fonts.size === 'large' ? '1.75rem' : '1.5rem'
                    }}
                    className="font-semibold"
                  >
                    Executive Summary
                  </h2>
                  <p
                    style={{
                      fontFamily: options.fonts.body,
                      color: options.colors.text,
                      fontSize: options.fonts.size === 'small' ? '0.875rem' : 
                               options.fonts.size === 'large' ? '1.125rem' : '1rem'
                    }}
                  >
                    This is a preview of how your newsletter will look with the current branding settings. 
                    The colors, fonts, and layout options you've selected will be applied throughout your newsletter.
                  </p>
                  
                  <div
                    className="p-4 rounded"
                    style={{
                      backgroundColor: options.colors.accent + '20',
                      borderColor: options.colors.accent,
                      borderWidth: '1px'
                    }}
                  >
                    <p
                      style={{
                        fontFamily: options.fonts.body,
                        color: options.colors.text,
                        fontSize: options.fonts.size === 'small' ? '0.875rem' : 
                                 options.fonts.size === 'large' ? '1.125rem' : '1rem'
                      }}
                    >
                      Key metrics and highlights will be displayed in accent-colored sections like this one.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandingOptionsComponent;

