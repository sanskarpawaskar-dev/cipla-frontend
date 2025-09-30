import React, { useState } from 'react';
import { Plus, X, Calendar } from 'lucide-react';

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

type ManagerType = 'RBM' | 'ZBM' | 'ABM';
type TimeframeType = 'Latest Data' | 'Monthly';
type SalesDataKey = keyof SalesData;

interface DataEntry {
  date: string;
  id: number;
}

const Insights: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [sheetName, setSheetName] = useState<string>('');
  const [managerType, setManagerType] = useState<ManagerType>('RBM');
  const [timeframe, setTimeframe] = useState<TimeframeType>('Latest Data');
  const [selectedMonth, setSelectedMonth] = useState<string>('September');
  const [selectedWeek, setSelectedWeek] = useState<string>('Week 1');
  const [selectedDataId, setSelectedDataId] = useState<number | null>(null);

  interface UploadFiles {
  file1: File | null;
  file2: File | null;
}

interface UploadResponse {
  success: boolean;
  message: string;
  data?: SalesData[];
}

  //Form Data
  const [data, setData] = useState<SalesData[]>([]);
//   const [loading, setLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("Indaflo G");
//   const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("latest");
  const [uploadDate, setUploadDate] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<UploadFiles>({ file1: null, file2: null });
  const [brandName, setBrandName] = useState("Indaflo G");

    const handleFileUpload = (fileType: keyof UploadFiles, file: File | null) => {
    setFiles((prev) => ({ ...prev, [fileType]: file }));
  };

  const handleUpload = async () => {
    if (!files.file1 || !files.file2 || !brandName || !uploadDate) {
      alert("Please fill all fields and select both files");
      return;
    }
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file1", files.file1);
      formData.append("file2", files.file2);
      formData.append("brandName", brandName);
      formData.append("dataDate", uploadDate);

      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const result: UploadResponse = await response.json();

      if (result.success) {
        setSelectedBrand(brandName);
        if (result.data) setData(result.data);
        alert("Files uploaded successfully!");
        setIsModalOpen(false); // close modal after upload
      } else {
        alert(`Upload failed: ${result.message}`);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Placeholder brand name - will receive as props
//   const brandName = 'Indaflo G';



  // Sample available data entries
  const availableData: DataEntry[] = [
    { date: '30th Sept 2025', id: 1 },
    { date: '23rd Sept 2025', id: 2 },
    { date: '16th Sept 2025', id: 3 },
    { date: '9th Sept 2025', id: 4 },
    { date: '2nd Sept 2025', id: 5 },
    { date: '26th Aug 2025', id: 6 },
    { date: '19th Aug 2025', id: 7 },
    { date: '12th Aug 2025', id: 8 },
    { date: '5th Aug 2025', id: 9 },
    { date: '29th July 2025', id: 10 },
  ];

  // Sample data for table
  const sampleData: SalesData[] = [
    {"RM":"Puneet Agarwal","NoOfTGTDr":171,"NoOfCRMDr":8,"OverallSecL":2.4,"CRMDrSecL":0.7,"PD":9091,"MTDSales":0.2},
    {"RM":"Anil Kumar Bind","NoOfTGTDr":134,"NoOfCRMDr":28,"OverallSecL":4.0,"CRMDrSecL":2.8,"PD":9998,"MTDSales":1.4},
    {"RM":"Shashank Shukla","NoOfTGTDr":127,"NoOfCRMDr":10,"OverallSecL":1.1,"CRMDrSecL":0.6,"PD":5587,"MTDSales":0.6},
    {"RM":"Ashwini Kumar Mathur","NoOfTGTDr":128,"NoOfCRMDr":11,"OverallSecL":1.2,"CRMDrSecL":0.8,"PD":7015,"MTDSales":-0.1},
    {"RM":"Ramrao Giri","NoOfTGTDr":129,"NoOfCRMDr":19,"OverallSecL":1.9,"CRMDrSecL":0.5,"PD":4758,"MTDSales":1.6},
  ];

  const calculateGrandTotal = (): SalesData => {
    return {
      RM: "Grand Total",
      NoOfTGTDr: sampleData.reduce((sum, item) => sum + item.NoOfTGTDr, 0),
      NoOfCRMDr: sampleData.reduce((sum, item) => sum + item.NoOfCRMDr, 0),
      OverallSecL: Number((sampleData.reduce((sum, item) => sum + item.OverallSecL, 0)).toFixed(1)),
      CRMDrSecL: Number((sampleData.reduce((sum, item) => sum + item.CRMDrSecL, 0)).toFixed(1)),
      PD: sampleData.reduce((sum, item) => sum + item.PD, 0),
      MTDSales: Number((sampleData.reduce((sum, item) => sum + item.MTDSales, 0)).toFixed(1))
    };
  };

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

  const handleAddSheet = (): void => {
    if (sheetName.trim()) {
      console.log('Adding sheet:', sheetName);
      setSheetName('');
      setIsModalOpen(false);
    }
  };

  const grandTotal = calculateGrandTotal();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            <span className="text-blue-600">Cipla</span>
            <br />
            <span className="text-gray-900">Dashboard</span>
          </h1>
        </div>

        {/* Add Sheet Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Add Sheet
        </button>

        {/* Manager Type Dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Manager Type</label>
          <select
            value={managerType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setManagerType(e.target.value as ManagerType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="RBM">RBM</option>
            <option value="ZBM">ZBM</option>
            <option value="ABM">ABM</option>
          </select>
        </div>

        {/* Timeframe Dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Timeframe</label>
          <select
            value={timeframe}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTimeframe(e.target.value as TimeframeType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Latest Data">Latest Data</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>

        {/* Month and Week Dropdowns (only show if Monthly is selected) */}
        {timeframe === 'Monthly' && (
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <select
                value={selectedMonth}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="September">September</option>
                <option value="August">August</option>
                <option value="July">July</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Week</label>
              <select
                value={selectedWeek}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedWeek(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Week 1">Week 1</option>
                <option value="Week 2">Week 2</option>
                <option value="Week 3">Week 3</option>
                <option value="Week 4">Week 4</option>
              </select>
            </div>
          </div>
        )}

        {/* Available Data */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Available Data</h3>
          <div className="space-y-2">
            {availableData.map((entry) => (
              <button
                key={entry.id}
                onClick={() => setSelectedDataId(entry.id)}
                className={`w-full px-3 py-2 text-left text-sm rounded-md border transition-colors flex items-center gap-2 ${
                  selectedDataId === entry.id
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Calendar size={14} />
                {entry.date}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Brand Name and Manager Type Chip */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{brandName}</h2>
            <span className="inline-block px-4 py-1 border-2 border-blue-600 text-blue-600 rounded-full text-sm font-medium bg-white">
              {managerType}
            </span>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                  <tr className="bg-blue-50 font-semibold">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {grandTotal.RM}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                      {grandTotal.NoOfTGTDr}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                      {grandTotal.NoOfCRMDr}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                      {formatValue(grandTotal.OverallSecL, 'OverallSecL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                      {formatValue(grandTotal.CRMDrSecL, 'CRMDrSecL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                      {grandTotal.PD}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                      {formatValue(grandTotal.MTDSales, 'MTDSales')}
                    </td>
                  </tr>
                  
                  {/* Data Rows */}
                  {sampleData.map((row: SalesData, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.RM}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        {row.NoOfTGTDr}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        {row.NoOfCRMDr}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        {formatValue(row.OverallSecL, 'OverallSecL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        {formatValue(row.CRMDrSecL, 'CRMDrSecL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        {row.PD}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${getCellColor(row.MTDSales, 'MTDSales')}`}>
                        {formatValue(row.MTDSales, 'MTDSales')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Sheet Modal */}
      {/* --- Modal with Upload Form --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Upload Excel Files</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter brand name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Date</label>
                  <input
                    type="date"
                    value={uploadDate}
                    onChange={(e) => setUploadDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Regional Manager File</label>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => handleFileUpload("file1", e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sales Data File</label>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => handleFileUpload("file2", e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md">
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className={`px-6 py-2 rounded-md text-white font-medium ${
                    isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isUploading ? "Uploading..." : "Upload Files"}
                </button>
              </div>
            </div>
          </div>
        )}
      {/* {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Add New Sheet</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sheet Name
              </label>
              <input
                type="text"
                value={sheetName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSheetName(e.target.value)}
                placeholder="Enter sheet name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    handleAddSheet();
                  }
                }}
                autoFocus
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSheet}
                disabled={!sheetName.trim()}
                className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                  !sheetName.trim()
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Insights;