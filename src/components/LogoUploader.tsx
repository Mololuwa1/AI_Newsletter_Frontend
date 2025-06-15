import React, { useRef } from 'react';
import { Upload, X, Image } from 'lucide-react';

interface LogoUploaderProps {
  currentLogo: string | null;
  onLogoChange: (logo: string | null) => void;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({
  currentLogo,
  onLogoChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onLogoChange(result);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    onLogoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {currentLogo ? (
        <div className="relative">
          <img
            src={currentLogo}
            alt="Logo"
            className="w-full h-20 object-contain bg-gray-50 rounded-lg border border-gray-200"
          />
          <button
            onClick={removeLogo}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors"
        >
          <Upload className="w-6 h-6 text-gray-400 mb-1" />
          <span className="text-sm text-gray-600">Upload Logo</span>
        </button>
      )}

      <p className="text-xs text-gray-500">
        Recommended: PNG or SVG, max 2MB
      </p>
    </div>
  );
};

export default LogoUploader;