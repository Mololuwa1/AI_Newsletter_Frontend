import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, FileSpreadsheet, AlertCircle, CheckCircle, Eye, Download } from 'lucide-react';

interface DataFile {
  id: string;
  name: string;
  size: number;
  type: string;
  data: any[][];
  headers: string[];
  preview: any[][];
  status: 'uploading' | 'processing' | 'ready' | 'error';
  error?: string;
}

interface EnhancedDataUploadProps {
  onFilesReady: (files: DataFile[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  supportedFormats?: string[];
}

const EnhancedDataUpload: React.FC<EnhancedDataUploadProps> = ({
  onFilesReady,
  maxFiles = 5,
  maxFileSize = 10,
  supportedFormats = ['.csv', '.xlsx', '.xls']
}) => {
  const [files, setFiles] = useState<DataFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processCSV = (content: string, fileName: string): DataFile => {
    const lines = content.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = lines.slice(1).map(line => 
      line.split(',').map(cell => cell.trim().replace(/"/g, ''))
    );
    
    return {
      id: Date.now().toString(),
      name: fileName,
      size: content.length,
      type: 'csv',
      data,
      headers,
      preview: data.slice(0, 5), // First 5 rows for preview
      status: 'ready'
    };
  };

  const processExcel = async (file: File): Promise<DataFile> => {
    // Note: In a real implementation, you'd use a library like xlsx or exceljs
    // For this demo, we'll simulate Excel processing
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData = [
          ['Product', 'Revenue', 'Units', 'Growth'],
          ['Product A', '150000', '1200', '15%'],
          ['Product B', '230000', '1800', '22%'],
          ['Product C', '180000', '1500', '18%']
        ];
        
        resolve({
          id: Date.now().toString(),
          name: file.name,
          size: file.size,
          type: 'excel',
          data: mockData.slice(1),
          headers: mockData[0],
          preview: mockData.slice(1, 4),
          status: 'ready'
        });
      }, 2000);
    });
  };

  const validateFile = (file: File): string | null => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!supportedFormats.includes(extension)) {
      return `Unsupported file format. Supported formats: ${supportedFormats.join(', ')}`;
    }
    
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size exceeds ${maxFileSize}MB limit`;
    }
    
    if (files.length >= maxFiles) {
      return `Maximum ${maxFiles} files allowed`;
    }
    
    return null;
  };

  const processFile = async (file: File) => {
    const validation = validateFile(file);
    if (validation) {
      const errorFile: DataFile = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: 'error',
        data: [],
        headers: [],
        preview: [],
        status: 'error',
        error: validation
      };
      setFiles(prev => [...prev, errorFile]);
      return;
    }

    const tempFile: DataFile = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: 'processing',
      data: [],
      headers: [],
      preview: [],
      status: 'processing'
    };

    setFiles(prev => [...prev, tempFile]);

    try {
      let processedFile: DataFile;
      
      if (file.name.endsWith('.csv')) {
        const content = await file.text();
        processedFile = processCSV(content, file.name);
      } else {
        processedFile = await processExcel(file);
      }

      setFiles(prev => prev.map(f => f.id === tempFile.id ? processedFile : f));
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === tempFile.id 
          ? { ...f, status: 'error' as const, error: 'Failed to process file' }
          : f
      ));
    }
  };

  const handleFileSelect = (selectedFiles: FileList) => {
    Array.from(selectedFiles).forEach(processFile);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const downloadSample = () => {
    const sampleCSV = `Company,Date,Revenue,Growth,Customers,Satisfaction
TechCorp,2024-01,150000,15%,1200,4.5
TechCorp,2024-02,165000,22%,1350,4.6
TechCorp,2024-03,180000,18%,1500,4.7`;

    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const readyFiles = files.filter(f => f.status === 'ready');

  React.useEffect(() => {
    if (readyFiles.length > 0) {
      onFilesReady(readyFiles);
    }
  }, [readyFiles, onFilesReady]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Data Upload</h3>
          <p className="text-gray-600">Upload your business data files for newsletter generation</p>
        </div>
        <button
          onClick={downloadSample}
          className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download Sample</span>
        </button>
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full ${isDragOver ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <Upload className={`w-8 h-8 ${isDragOver ? 'text-blue-600' : 'text-gray-400'}`} />
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-gray-900">
              {isDragOver ? 'Drop files here' : 'Upload your data files'}
            </h4>
            <p className="text-gray-500 mt-1">
              Drag and drop files or{' '}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-700 underline"
              >
                browse
              </button>
            </p>
          </div>
          
          <div className="text-sm text-gray-400">
            <p>Supported formats: {supportedFormats.join(', ')}</p>
            <p>Maximum file size: {maxFileSize}MB • Maximum files: {maxFiles}</p>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={supportedFormats.join(',')}
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Uploaded Files ({files.length})</h4>
          {files.map((file) => (
            <div key={file.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileSpreadsheet className="w-5 h-5 text-green-600" />
                  <div>
                    <h5 className="font-medium text-gray-900">{file.name}</h5>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                      {file.status === 'ready' && ` • ${file.data.length} rows, ${file.headers.length} columns`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {file.status === 'processing' && (
                    <div className="flex items-center space-x-2 text-blue-600">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">Processing...</span>
                    </div>
                  )}
                  
                  {file.status === 'ready' && (
                    <>
                      <button
                        onClick={() => setShowPreview(showPreview === file.id ? null : file.id)}
                        className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-300 rounded hover:bg-blue-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Preview</span>
                      </button>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </>
                  )}
                  
                  {file.status === 'error' && (
                    <div className="flex items-center space-x-2 text-red-600">
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-sm">{file.error}</span>
                    </div>
                  )}
                  
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Preview */}
              {showPreview === file.id && file.status === 'ready' && (
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <h6 className="text-sm font-medium text-gray-700 mb-2">Data Preview</h6>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          {file.headers.map((header, index) => (
                            <th key={index} className="px-3 py-2 text-left font-medium text-gray-700 border-b">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {file.preview.map((row, rowIndex) => (
                          <tr key={rowIndex} className="border-b border-gray-100">
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="px-3 py-2 text-gray-600">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {file.data.length > file.preview.length && (
                    <p className="text-xs text-gray-500 mt-2">
                      Showing {file.preview.length} of {file.data.length} rows
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {readyFiles.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">
              {readyFiles.length} file{readyFiles.length !== 1 ? 's' : ''} ready for processing
            </span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Total rows: {readyFiles.reduce((sum, file) => sum + file.data.length, 0)}
          </p>
        </div>
      )}
    </div>
  );
};

export default EnhancedDataUpload;

