import React, { useState } from 'react';
import { Search, Filter, SortAsc, SortDesc, Download, RefreshCw, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface DataColumn {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'percentage' | 'currency';
  format?: string;
}

interface DataValidationResult {
  isValid: boolean;
  warnings: string[];
  suggestions: string[];
  metrics: {
    totalRows: number;
    validRows: number;
    missingValues: number;
    duplicates: number;
  };
}

interface DataFile {
  id: string;
  name: string;
  data: any[][];
  headers: string[];
}

interface DataPreviewProps {
  files: DataFile[];
  onColumnMapping: (fileId: string, mapping: Record<string, DataColumn>) => void;
  onDataValidated: (fileId: string, validation: DataValidationResult) => void;
}

const DataPreview: React.FC<DataPreviewProps> = ({
  files,
  onColumnMapping,
  onDataValidated
}) => {
  const [activeFile, setActiveFile] = useState<string>(files[0]?.id || '');
  const [columnMappings, setColumnMappings] = useState<Record<string, Record<string, DataColumn>>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [validationResults, setValidationResults] = useState<Record<string, DataValidationResult>>({});

  const predefinedColumns: DataColumn[] = [
    { key: 'company', label: 'Company Name', type: 'text' },
    { key: 'date', label: 'Date', type: 'date', format: 'YYYY-MM-DD' },
    { key: 'revenue', label: 'Revenue', type: 'currency', format: 'USD' },
    { key: 'growth', label: 'Growth Rate', type: 'percentage' },
    { key: 'customers', label: 'Customer Count', type: 'number' },
    { key: 'satisfaction', label: 'Satisfaction Score', type: 'number' },
    { key: 'units', label: 'Units Sold', type: 'number' },
    { key: 'product', label: 'Product Name', type: 'text' },
    { key: 'region', label: 'Region', type: 'text' },
    { key: 'category', label: 'Category', type: 'text' }
  ];

  const activeFileData = files.find(f => f.id === activeFile);

  const detectColumnType = (values: string[]): DataColumn['type'] => {
    const sampleValues = values.slice(0, 10).filter(v => v && v.trim());
    
    if (sampleValues.every(v => /^\d{4}-\d{2}-\d{2}/.test(v))) return 'date';
    if (sampleValues.every(v => /^\$?\d+\.?\d*$/.test(v.replace(/,/g, '')))) return 'currency';
    if (sampleValues.every(v => /^\d+\.?\d*%$/.test(v))) return 'percentage';
    if (sampleValues.every(v => /^\d+\.?\d*$/.test(v))) return 'number';
    
    return 'text';
  };

  const autoMapColumns = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    const mapping: Record<string, DataColumn> = {};
    
    file.headers.forEach((header, index) => {
      const headerLower = header.toLowerCase();
      const columnValues = file.data.map(row => row[index] || '');
      const detectedType = detectColumnType(columnValues);
      
      // Try to match with predefined columns
      const matchedColumn = predefinedColumns.find(col => 
        headerLower.includes(col.key) || col.label.toLowerCase().includes(headerLower)
      );
      
      if (matchedColumn) {
        mapping[header] = { ...matchedColumn, type: detectedType };
      } else {
        mapping[header] = {
          key: headerLower.replace(/\s+/g, '_'),
          label: header,
          type: detectedType
        };
      }
    });

    setColumnMappings(prev => ({ ...prev, [fileId]: mapping }));
    onColumnMapping(fileId, mapping);
  };

  const validateData = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    const mapping = columnMappings[fileId];
    
    if (!file || !mapping) return;

    const warnings: string[] = [];
    const suggestions: string[] = [];
    let validRows = 0;
    let missingValues = 0;
    const duplicateRows = new Set();

    file.data.forEach((row, rowIndex) => {
      let isRowValid = true;
      let rowMissingValues = 0;
      
      row.forEach((cell, cellIndex) => {
        const header = file.headers[cellIndex];
        const column = mapping[header];
        
        if (!cell || cell.trim() === '') {
          missingValues++;
          rowMissingValues++;
          return;
        }
        
        // Type validation
        if (column?.type === 'number' && isNaN(Number(cell.replace(/,/g, '')))) {
          warnings.push(`Row ${rowIndex + 1}, ${header}: "${cell}" is not a valid number`);
          isRowValid = false;
        }
        
        if (column?.type === 'date' && isNaN(Date.parse(cell))) {
          warnings.push(`Row ${rowIndex + 1}, ${header}: "${cell}" is not a valid date`);
          isRowValid = false;
        }
        
        if (column?.type === 'percentage' && !/^\d+\.?\d*%?$/.test(cell)) {
          warnings.push(`Row ${rowIndex + 1}, ${header}: "${cell}" is not a valid percentage`);
          isRowValid = false;
        }
      });
      
      if (rowMissingValues > row.length / 2) {
        warnings.push(`Row ${rowIndex + 1}: More than 50% of values are missing`);
        isRowValid = false;
      }
      
      // Check for duplicates
      const rowString = row.join('|');
      if (duplicateRows.has(rowString)) {
        warnings.push(`Row ${rowIndex + 1}: Duplicate row detected`);
      } else {
        duplicateRows.add(rowString);
      }
      
      if (isRowValid) validRows++;
    });

    // Generate suggestions
    if (missingValues > 0) {
      suggestions.push(`Consider filling ${missingValues} missing values or removing incomplete rows`);
    }
    
    if (validRows < file.data.length * 0.8) {
      suggestions.push('Consider reviewing data quality - less than 80% of rows are valid');
    }
    
    const result: DataValidationResult = {
      isValid: warnings.length === 0,
      warnings: warnings.slice(0, 10), // Limit to first 10 warnings
      suggestions,
      metrics: {
        totalRows: file.data.length,
        validRows,
        missingValues,
        duplicates: file.data.length - duplicateRows.size
      }
    };

    setValidationResults(prev => ({ ...prev, [fileId]: result }));
    onDataValidated(fileId, result);
  };

  const updateColumnMapping = (fileId: string, header: string, column: DataColumn) => {
    setColumnMappings(prev => ({
      ...prev,
      [fileId]: {
        ...prev[fileId],
        [header]: column
      }
    }));
    
    onColumnMapping(fileId, { ...columnMappings[fileId], [header]: column });
  };

  const exportCleanedData = () => {
    if (!activeFileData) return;
    
    const mapping = columnMappings[activeFile];
    const validation = validationResults[activeFile];
    
    if (!mapping || !validation) return;
    
    // Create cleaned data with only valid rows
    const cleanedData = [
      activeFileData.headers,
      ...activeFileData.data.filter((row, index) => {
        // Simple validation - row is valid if it has more than 50% non-empty values
        const nonEmptyValues = row.filter(cell => cell && cell.trim()).length;
        return nonEmptyValues > row.length / 2;
      })
    ];
    
    const csvContent = cleanedData.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cleaned_${activeFileData.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!activeFileData) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data files available for preview
      </div>
    );
  }

  const currentMapping = columnMappings[activeFile] || {};
  const currentValidation = validationResults[activeFile];

  return (
    <div className="space-y-6">
      {/* File Selector */}
      {files.length > 1 && (
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Select File:</label>
          <select
            value={activeFile}
            onChange={(e) => setActiveFile(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {files.map(file => (
              <option key={file.id} value={file.id}>{file.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => autoMapColumns(activeFile)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Auto-Map Columns</span>
          </button>
          
          <button
            onClick={() => validateData(activeFile)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Validate Data</span>
          </button>
          
          {currentValidation && (
            <button
              onClick={exportCleanedData}
              className="flex items-center space-x-2 px-4 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Cleaned</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Validation Results */}
      {currentValidation && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Data Quality Metrics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Rows:</span>
                <span className="font-medium">{currentValidation.metrics.totalRows}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Valid Rows:</span>
                <span className="font-medium text-green-600">{currentValidation.metrics.validRows}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Missing Values:</span>
                <span className="font-medium text-orange-600">{currentValidation.metrics.missingValues}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duplicates:</span>
                <span className="font-medium text-red-600">{currentValidation.metrics.duplicates}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">
              {currentValidation.warnings.length > 0 ? 'Warnings' : 'Data Quality'}
            </h4>
            {currentValidation.warnings.length > 0 ? (
              <div className="space-y-1 text-sm text-orange-600 max-h-32 overflow-y-auto">
                {currentValidation.warnings.map((warning, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Data quality looks good!</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Column Mapping */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-4">Column Mapping</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeFileData.headers.map((header, index) => (
            <div key={header} className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{header}</label>
              <select
                value={currentMapping[header]?.key || ''}
                onChange={(e) => {
                  const selectedColumn = predefinedColumns.find(col => col.key === e.target.value);
                  if (selectedColumn) {
                    updateColumnMapping(activeFile, header, selectedColumn);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Select mapping...</option>
                {predefinedColumns.map(column => (
                  <option key={column.key} value={column.key}>
                    {column.label} ({column.type})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                {activeFileData.headers.map((header, index) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      if (sortColumn === header) {
                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortColumn(header);
                        setSortDirection('asc');
                      }
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{header}</span>
                      {currentMapping[header] && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {currentMapping[header].type}
                        </span>
                      )}
                      {sortColumn === header && (
                        sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activeFileData.data
                .filter(row => 
                  !searchTerm || row.some(cell => 
                    cell && cell.toString().toLowerCase().includes(searchTerm.toLowerCase())
                  )
                )
                .slice(0, 20) // Show first 20 rows
                .map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-3 text-sm text-gray-600">
                        {cell || <span className="text-gray-400 italic">empty</span>}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        
        {activeFileData.data.length > 20 && (
          <div className="px-4 py-3 bg-gray-50 text-sm text-gray-500 text-center">
            Showing 20 of {activeFileData.data.length} rows
          </div>
        )}
      </div>
    </div>
  );
};

export default DataPreview;

