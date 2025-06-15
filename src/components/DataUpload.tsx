import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { UserSubscription } from '../types/subscription';

interface DataUploadProps {
  onGenerateNewsletter: (data: any) => void;
  canGenerate: boolean;
  subscription: UserSubscription;
}

interface UploadStatus {
  status: 'idle' | 'uploading' | 'success' | 'error';
  message: string;
  data?: any;
}

const DataUpload: React.FC<DataUploadProps> = ({ onGenerateNewsletter, canGenerate, subscription }) => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ status: 'idle', message: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setUploadStatus({
        status: 'error',
        message: 'Please upload a CSV file only.'
      });
      return;
    }

    setUploadStatus({ status: 'uploading', message: 'Processing your file...' });

    // Simulate file processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock processed data summary
    const mockDataSummary = {
      rows: Math.floor(Math.random() * 1000) + 100,
      columns: Math.floor(Math.random() * 20) + 5,
      fileName: file.name,
      fileSize: (file.size / 1024).toFixed(2) + ' KB',
      dataTypes: ['Revenue', 'Expenses', 'Growth Rate', 'Customer Count', 'Market Share']
    };

    setUploadStatus({
      status: 'success',
      message: 'File processed successfully!',
      data: mockDataSummary
    });
  };

  const handleGenerateFromUpload = async () => {
    if (!uploadStatus.data || !canGenerate) return;

    setIsGenerating(true);
    
    // Simulate newsletter generation from uploaded data
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const generatedNewsletter = {
      company: "Your Company",
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      executiveSummary: "Based on your uploaded data, this quarter shows promising trends across key business metrics. Revenue indicators suggest strong market positioning, while operational efficiency metrics demonstrate improved cost management. The AI analysis reveals significant opportunities for growth and optimization.",
      performanceMetrics: [
        { metric: "Data Points Analyzed", value: uploadStatus.data.rows.toString(), trend: "up" },
        { metric: "Metrics Covered", value: uploadStatus.data.columns.toString(), trend: "up" },
        { metric: "Growth Indicators", value: "87%", trend: "up" },
        { metric: "Trend Accuracy", value: "94%", trend: "up" }
      ],
      marketInsights: "Your data reveals strong performance indicators that align with current market trends. The analytics suggest opportunities for expansion in high-performing segments while maintaining operational efficiency. Key growth drivers have been identified through advanced pattern recognition.",
      keyHighlights: [
        "Strong performance across multiple metrics identified",
        "Positive trend indicators detected in key areas",
        "Data-driven insights generated with 94% accuracy",
        "Comprehensive analysis completed across all data points"
      ],
      charts: {
        revenue: {
          data: [
            { month: 'Jan', revenue: Math.floor(Math.random() * 500000) + 200000, previousYear: Math.floor(Math.random() * 400000) + 150000 },
            { month: 'Feb', revenue: Math.floor(Math.random() * 600000) + 250000, previousYear: Math.floor(Math.random() * 450000) + 180000 },
            { month: 'Mar', revenue: Math.floor(Math.random() * 700000) + 300000, previousYear: Math.floor(Math.random() * 500000) + 200000 },
            { month: 'Apr', revenue: Math.floor(Math.random() * 800000) + 350000, previousYear: Math.floor(Math.random() * 550000) + 220000 },
            { month: 'May', revenue: Math.floor(Math.random() * 900000) + 400000, previousYear: Math.floor(Math.random() * 600000) + 250000 },
            { month: 'Jun', revenue: Math.floor(Math.random() * 1000000) + 450000, previousYear: Math.floor(Math.random() * 650000) + 280000 }
          ],
          narrative: "Your revenue data shows consistent growth patterns with strong year-over-year improvements. The upward trajectory indicates successful business strategies and market positioning."
        },
        customerGrowth: {
          data: [
            { month: 'Jan', newCustomers: Math.floor(Math.random() * 100) + 50, totalCustomers: Math.floor(Math.random() * 1000) + 500 },
            { month: 'Feb', newCustomers: Math.floor(Math.random() * 120) + 60, totalCustomers: Math.floor(Math.random() * 1200) + 600 },
            { month: 'Mar', newCustomers: Math.floor(Math.random() * 140) + 70, totalCustomers: Math.floor(Math.random() * 1400) + 700 },
            { month: 'Apr', newCustomers: Math.floor(Math.random() * 160) + 80, totalCustomers: Math.floor(Math.random() * 1600) + 800 },
            { month: 'May', newCustomers: Math.floor(Math.random() * 180) + 90, totalCustomers: Math.floor(Math.random() * 1800) + 900 },
            { month: 'Jun', newCustomers: Math.floor(Math.random() * 200) + 100, totalCustomers: Math.floor(Math.random() * 2000) + 1000 }
          ],
          narrative: "Customer acquisition trends from your data indicate accelerating growth, suggesting effective marketing strategies and strong product-market fit."
        },
        // Only include satisfaction for Basic+ tiers
        ...(subscription.tier !== 'free' && {
          satisfaction: {
            score: Math.floor(Math.random() * 20) + 80,
            target: 85,
            narrative: "Customer satisfaction metrics derived from your data show strong performance, indicating successful customer experience initiatives and product quality."
          }
        }),
        productPerformance: {
          data: [
            { product: 'Product A', revenue: Math.floor(Math.random() * 500000) + 200000, units: Math.floor(Math.random() * 200) + 100 },
            { product: 'Product B', revenue: Math.floor(Math.random() * 400000) + 150000, units: Math.floor(Math.random() * 180) + 80 },
            { product: 'Product C', revenue: Math.floor(Math.random() * 300000) + 100000, units: Math.floor(Math.random() * 160) + 60 },
            { product: 'Product D', revenue: Math.floor(Math.random() * 250000) + 80000, units: Math.floor(Math.random() * 140) + 40 }
          ],
          narrative: "Product performance analysis reveals clear leaders in your portfolio, with opportunities for optimization and strategic focus on high-performing segments."
        }
      }
    };
    
    setIsGenerating(false);
    onGenerateNewsletter(generatedNewsletter);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg">
          <Upload className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Upload Your Data</h2>
      </div>
      
      <p className="text-gray-600 mb-6 leading-relaxed">
        Upload your business data in CSV format to generate a personalized interactive newsletter. Our AI will analyze your data and create comprehensive insights with dynamic charts and visualizations tailored to your business.
      </p>

      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-6 mb-6 border border-green-200">
        <h3 className="font-semibold text-gray-800 mb-3">🚀 What You'll Get:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Custom charts from your data</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
            <span>AI-generated insights</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Interactive visualizations</span>
          </div>
          {subscription.tier !== 'free' ? (
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>Advanced chart types</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Lock className="w-3 h-3 text-gray-400" />
              <span className="text-gray-500">Advanced charts (Basic+)</span>
            </div>
          )}
        </div>
        
        {subscription.tier === 'free' && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Free Plan:</strong> Basic chart types only. Upgrade for gauge charts and advanced visualizations.
            </p>
          </div>
        )}
      </div>
      
      <div className="space-y-6">
        {/* File Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Choose CSV File
          </button>
          
          <p className="text-sm text-gray-500 mt-2">
            Supported format: CSV files only
          </p>
        </div>
        
        {/* Upload Status */}
        {uploadStatus.status !== 'idle' && (
          <div className={`p-4 rounded-lg border ${
            uploadStatus.status === 'success' 
              ? 'bg-green-50 border-green-200' 
              : uploadStatus.status === 'error'
              ? 'bg-red-50 border-red-200'
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center space-x-2">
              {uploadStatus.status === 'uploading' && <LoadingSpinner size="sm" text="" />}
              {uploadStatus.status === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
              {uploadStatus.status === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
              <p className={`font-medium ${
                uploadStatus.status === 'success' 
                  ? 'text-green-800' 
                  : uploadStatus.status === 'error'
                  ? 'text-red-800'
                  : 'text-blue-800'
              }`}>
                {uploadStatus.message}
              </p>
            </div>
            
            {uploadStatus.data && (
              <div className="mt-4 p-3 bg-white rounded border">
                <h4 className="font-semibold text-gray-800 mb-2">Data Summary:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="font-medium">File:</span> {uploadStatus.data.fileName}</div>
                  <div><span className="font-medium">Size:</span> {uploadStatus.data.fileSize}</div>
                  <div><span className="font-medium">Rows:</span> {uploadStatus.data.rows}</div>
                  <div><span className="font-medium">Columns:</span> {uploadStatus.data.columns}</div>
                </div>
                <div className="mt-2">
                  <span className="font-medium">Data Types:</span> {uploadStatus.data.dataTypes.join(', ')}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Generate Button */}
        {uploadStatus.status === 'success' && (
          <button
            onClick={handleGenerateFromUpload}
            disabled={isGenerating || !canGenerate}
            className={`w-full flex items-center justify-center space-x-2 font-semibold py-3 px-6 rounded-lg transition-all duration-200 ${
              !canGenerate 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <LoadingSpinner size="sm" text="" />
            ) : !canGenerate ? (
              <Lock className="w-5 h-5" />
            ) : (
              <FileText className="w-5 h-5" />
            )}
            <span>
              {isGenerating 
                ? 'Generating Interactive Newsletter...' 
                : !canGenerate 
                ? 'Upgrade to Generate More'
                : 'Generate Interactive Newsletter from Data'
              }
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default DataUpload;