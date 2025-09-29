import React, { useState, useEffect } from 'react';
import { Upload, Filter, Download } from 'lucide-react';

// Type definitions
interface SalesData {
  RM: string;
  NoOfTGTDr: number;
  NoOfCRMDr: number;
  OverallSecL: number;
  CRMDrSecL: number;
  PD: number;
  MTDSales: number;
}

interface UploadFiles {
  file1: File | null;
  file2: File | null;
}

type TimePeriod = 'latest' | 'week-to-date' | 'week-data' | 'month-to-date' | 'monthly';

type SalesDataKey = keyof SalesData;

interface ApiResponse {
  data: SalesData[];
  success: boolean;
  message?: string;
}

interface UploadResponse {
  success: boolean;
  message: string;
  data?: SalesData[];
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedBrand, setSelectedBrand] = useState<string>('Indaflo G');
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('latest');
  const [uploadDate, setUploadDate] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [files, setFiles] = useState<UploadFiles>({ file1: null, file2: null });
  const [brandName, setBrandName] = useState<string>('');

  // Sample data for demonstration - replace with actual API call
  const sampleData: SalesData[] = [
    {"RM":"Puneet Agarwal","NoOfTGTDr":171,"NoOfCRMDr":8,"OverallSecL":2.4,"CRMDrSecL":0.7,"PD":9091,"MTDSales":0.2},
    {"RM":"Anil Kumar Bind","NoOfTGTDr":134,"NoOfCRMDr":28,"OverallSecL":4.0,"CRMDrSecL":2.8,"PD":9998,"MTDSales":1.4},
    {"RM":"Shashank Shukla","NoOfTGTDr":127,"NoOfCRMDr":10,"OverallSecL":1.1,"CRMDrSecL":0.6,"PD":5587,"MTDSales":0.6},
    {"RM":"Ashwini Kumar Mathur","NoOfTGTDr":128,"NoOfCRMDr":11,"OverallSecL":1.2,"CRMDrSecL":0.8,"PD":7015,"MTDSales":-0.1},
    {"RM":"Ramrao Giri","NoOfTGTDr":129,"NoOfCRMDr":19,"OverallSecL":1.9,"CRMDrSecL":0.5,"PD":4758,"MTDSales":1.6},
    {"RM":"Afroz Pasha","NoOfTGTDr":53,"NoOfCRMDr":15,"OverallSecL":1.3,"CRMDrSecL":1.0,"PD":6445,"MTDSales":1.8},
    {"RM":"Ayan Ghosh","NoOfTGTDr":226,"NoOfCRMDr":19,"OverallSecL":1.3,"CRMDrSecL":0.5,"PD":2751,"MTDSales":0.6},
    {"RM":"Kshatriya Rakesh Kumar Prahlad","NoOfTGTDr":175,"NoOfCRMDr":22,"OverallSecL":1.3,"CRMDrSecL":0.8,"PD":3827,"MTDSales":1.0},
    {"RM":"S Rengaraj","NoOfTGTDr":108,"NoOfCRMDr":19,"OverallSecL":1.1,"CRMDrSecL":0.2,"PD":1228,"MTDSales":0.1},
    {"RM":"Subhrajit Rout","NoOfTGTDr":287,"NoOfCRMDr":29,"OverallSecL":1.6,"CRMDrSecL":0.8,"PD":2709,"MTDSales":0.8},
    {"RM":"Jithin Kumar E","NoOfTGTDr":54,"NoOfCRMDr":8,"OverallSecL":0.4,"CRMDrSecL":0.2,"PD":2723,"MTDSales":0.4},
    {"RM":"Suprakash","NoOfTGTDr":90,"NoOfCRMDr":21,"OverallSecL":0.8,"CRMDrSecL":0.6,"PD":2629,"MTDSales":0.5}
  ];

  useEffect(() => {
    // Initialize with sample data
    setData(sampleData);
  }, [sampleData]);

  const calculateGrandTotal = (): SalesData => {
    if (data.length === 0) {
      return {
        RM: "Grand Total",
        NoOfTGTDr: 0,
        NoOfCRMDr: 0,
        OverallSecL: 0,
        CRMDrSecL: 0,
        PD: 0,
        MTDSales: 0
      };
    }
    
    return {
      RM: "Grand Total",
      NoOfTGTDr: data.reduce((sum, item) => sum + item.NoOfTGTDr, 0),
      NoOfCRMDr: data.reduce((sum, item) => sum + item.NoOfCRMDr, 0),
      OverallSecL: Number((data.reduce((sum, item) => sum + item.OverallSecL, 0)).toFixed(1)),
      CRMDrSecL: Number((data.reduce((sum, item) => sum + item.CRMDrSecL, 0)).toFixed(1)),
      PD: data.reduce((sum, item) => sum + item.PD, 0),
      MTDSales: Number((data.reduce((sum, item) => sum + item.MTDSales, 0)).toFixed(1))
    };
  };

  const handleFileUpload = (fileType: keyof UploadFiles, file: File | null): void => {
    setFiles(prev => ({ ...prev, [fileType]: file }));
  };

  const handleUpload = async (): Promise<void> => {
    if (!files.file1 || !files.file2 || !brandName || !uploadDate) {
      alert('Please fill all fields and select both files');
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file1', files.file1);
      formData.append('file2', files.file2);
      formData.append('brandName', brandName);
      formData.append('dataDate', uploadDate);

      // Replace with actual API call
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const result: UploadResponse = await response.json();
      
      if (result.success) {
        setSelectedBrand(brandName);
        if (result.data) {
          setData(result.data);
        }
        alert('Files uploaded successfully!');
      } else {
        alert(`Upload failed: ${result.message}`);
      }

      setIsUploading(false);

    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
      setIsUploading(false);
    }
  };

  const fetchData = async (): Promise<void> => {
    if (!selectedBrand) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/data/${selectedBrand}?period=${selectedPeriod}&date=${uploadDate}`);
      const result: ApiResponse = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        alert(`Failed to fetch data: ${result.message}`);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      alert('Failed to fetch data. Please try again.');
      setLoading(false);
    }
  };

  const grandTotal: SalesData = calculateGrandTotal();

  const formatValue = (value: number | string, key: SalesDataKey): string => {
    if (key === 'OverallSecL' || key === 'CRMDrSecL' || key === 'MTDSales') {
      return typeof value === 'number' ? value.toFixed(1) : value.toString();
    }
    return value.toString();
  };

  const getCellColor = (value: number, key: SalesDataKey): string => {
    if (key === 'MTDSales' && value < 0) return 'text-red-600 bg-red-50';
    if (key === 'MTDSales' && value > 1) return 'text-green-600 bg-green-50';
    return '';
  };

  const handleExport = (): void => {
    // Implement export functionality
    console.log('Export functionality to be implemented');
    alert('Export functionality will be implemented');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">Sales Dashboard</h1>
          <p className="text-gray-500">Upload and analyze your sales data</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center text-gray-700">
            <Upload className="mr-2" size={20} />
            Upload Excel Files
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Brand Name</label>
              <input
                type="text"
                value={brandName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBrandName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter brand name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Data Date</label>
              <input
                type="date"
                value={uploadDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUploadDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Regional Manager File</label>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleFileUpload('file1', e.target.files?.[0] || null)
                }
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Sales Data File</label>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleFileUpload('file2', e.target.files?.[0] || null)
                }
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          </div>

          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
              isUploading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isUploading ? 'Uploading...' : 'Upload Files'}
          </button>
        </div>

        {/* Filters Section */}
        {selectedBrand && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center text-gray-700">
              <Filter className="mr-2" size={20} />
              Filters
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Brand</label>
                <input
                  type="text"
                  value={selectedBrand}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Time Period</label>
                <select
                  value={selectedPeriod}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                    setSelectedPeriod(e.target.value as TimePeriod)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="latest">Latest Upload</option>
                  <option value="week-to-date">Week to Date</option>
                  <option value="week-data">Week Data</option>
                  <option value="month-to-date">Month to Date</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={fetchData}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Table */}
        {selectedBrand && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold">{selectedBrand}</h2>
              <button 
                onClick={handleExport}
                className="px-4 py-2 bg-white text-indigo-600 rounded-md font-medium flex items-center hover:bg-indigo-50 transition-colors"
              >
                <Download className="mr-2" size={16} />
                Export
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Row Labels
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No of TGT Dr
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No of CRM Dr
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Overall Sec(L)
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CRM Dr Sec (L)
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      P/D
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      MTD Sales
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Grand Total Row */}
                  <tr className="bg-indigo-50 font-semibold">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {grandTotal.RM}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800">
                      {grandTotal.NoOfTGTDr}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800">
                      {grandTotal.NoOfCRMDr}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800">
                      {formatValue(grandTotal.OverallSecL, 'OverallSecL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800">
                      {formatValue(grandTotal.CRMDrSecL, 'CRMDrSecL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800">
                      {grandTotal.PD}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800">
                      {formatValue(grandTotal.MTDSales, 'MTDSales')}
                    </td>
                  </tr>
                  
                  {/* Data Rows */}
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    data.map((row: SalesData, index: number) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {row.RM}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">
                          {row.NoOfTGTDr}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">
                          {row.NoOfCRMDr}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">
                          {formatValue(row.OverallSecL, 'OverallSecL')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">
                          {formatValue(row.CRMDrSecL, 'CRMDrSecL')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">
                          {row.PD}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-center font-medium ${getCellColor(row.MTDSales, 'MTDSales')}`}>
                          {formatValue(row.MTDSales, 'MTDSales')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;