import React, { useEffect, useState } from 'react';
import { Plus, X, Calendar } from 'lucide-react';
import { addSheets, getFilteredSheets, getSheets } from '../../axios/api';
import { useParams, useSearchParams } from "react-router-dom";

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

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

interface DataEntry {
  id: string; // use sheetId from mongo
  date: string;
  sheetData: SalesData[];
  brandId: string;
  brandName: string;
  managerType: ManagerType;
  month: string;
  week: string;
  year: string;
}


const Insights: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // const [sheetName, setSheetName] = useState<string>('');
  const [managerType, setManagerType] = useState<ManagerType>('RBM');
  const [timeframe, setTimeframe] = useState<TimeframeType>('Latest Data');
  const [selectedMonth, setSelectedMonth] = useState<string>('September');
  const [selectedWeek, setSelectedWeek] = useState<string>('All');
  const [selectedDataId, setSelectedDataId] = useState<string | null>(null);


  const [availableSheets, setAvailableSheets] = useState<DataEntry[]>([]);
const [loadingSheets, setLoadingSheets] = useState(false);

  interface UploadFiles {
  file1: File | null;
  file2: File | null;
}

// interface UploadResponse {
//   success: boolean;
//   message: string;
//   data?: SalesData[];
// }

  //Form Data
  // const [data, setData] = useState<SalesData[]>([]);
//   const [loading, setLoading] = useState(false);
  // const [selectedBrand, setSelectedBrand] = useState("Indaflo G");
//   const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("latest");
  const [uploadDate, setUploadDate] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<UploadFiles>({ file1: null, file2: null });
  // const [brandName, setBrandName] = useState("Indaflo G");

  const { brandName = "" } = useParams<{ brandName?: string }>();
  const [searchParams] = useSearchParams();
  const brandId = searchParams.get("id") ?? "";
  const [tableData, setTableData] = useState<SalesData[]>([]);

  const handleSelectSheet = (sheetId: string) => {
  const sheet = availableSheets.find((s) => s.id === sheetId);
  if (sheet) {
    setTableData(sheet.sheetData);
  }
};


    const handleFileUpload = (fileType: keyof UploadFiles, file: File | null) => {
    setFiles((prev) => ({ ...prev, [fileType]: file }));
  };

const handleUpload = async () => {
  if (!files.file1 || !files.file2 || !managerType || !uploadDate) {
    alert("Please fill all fields and select both files");
    return;
  }
  setIsUploading(true);

  try {
    console.log("brandId",brandId)
    console.log("date",uploadDate)
    
    // Format date as YYYY-MM-DD string
    const formattedDate = uploadDate; // Already in YYYY-MM-DD format from input[type="date"]
    
    const response = await addSheets(
      { file1: files.file1, file2: files.file2 },
      {
        brandId: brandId,
        brandName: brandName,
        managerType,
        datadate: formattedDate, // Send as string
      }
    );

    if (response.data) {
      alert("Files uploaded successfully!");
      setIsModalOpen(false);
      // Reset form
      setFiles({ file1: null, file2: null });
      setUploadDate("");
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
  // const availableData: DataEntry[] = [
  //   { date: '30th Sept 2025', id: 1 },
  //   { date: '23rd Sept 2025', id: 2 },
  //   { date: '16th Sept 2025', id: 3 },
  //   { date: '9th Sept 2025', id: 4 },
  //   { date: '2nd Sept 2025', id: 5 },
  //   { date: '26th Aug 2025', id: 6 },
  //   { date: '19th Aug 2025', id: 7 },
  //   { date: '12th Aug 2025', id: 8 },
  //   { date: '5th Aug 2025', id: 9 },
  //   { date: '29th July 2025', id: 10 },
  // ];

  // Sample data for table
  // const sampleData: SalesData[] = [
  //   {"RM":"Puneet Agarwal","NoOfTGTDr":171,"NoOfCRMDr":8,"OverallSecL":2.4,"CRMDrSecL":0.7,"PD":9091,"MTDSales":0.2},
  //   {"RM":"Anil Kumar Bind","NoOfTGTDr":134,"NoOfCRMDr":28,"OverallSecL":4.0,"CRMDrSecL":2.8,"PD":9998,"MTDSales":1.4},
  //   {"RM":"Shashank Shukla","NoOfTGTDr":127,"NoOfCRMDr":10,"OverallSecL":1.1,"CRMDrSecL":0.6,"PD":5587,"MTDSales":0.6},
  //   {"RM":"Ashwini Kumar Mathur","NoOfTGTDr":128,"NoOfCRMDr":11,"OverallSecL":1.2,"CRMDrSecL":0.8,"PD":7015,"MTDSales":-0.1},
  //   {"RM":"Ramrao Giri","NoOfTGTDr":129,"NoOfCRMDr":19,"OverallSecL":1.9,"CRMDrSecL":0.5,"PD":4758,"MTDSales":1.6},
  // ];

const calculateGrandTotal = (data: SalesData[]): SalesData => {
  return {
    RM: "Grand Total",
    NoOfTGTDr: data.reduce((sum, item) => sum + item.NoOfTGTDr, 0),
    NoOfCRMDr: data.reduce((sum, item) => sum + item.NoOfCRMDr, 0),
    OverallSecL: Number(data.reduce((sum, item) => sum + item.OverallSecL, 0).toFixed(1)),
    CRMDrSecL: Number(data.reduce((sum, item) => sum + item.CRMDrSecL, 0).toFixed(1)),
    PD: data.reduce((sum, item) => sum + item.PD, 0),
    MTDSales: Number(data.reduce((sum, item) => sum + item.MTDSales, 0).toFixed(1)),
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
  setIsModalOpen(true);
};


const grandTotal = tableData.length > 0 ? calculateGrandTotal(tableData) : null;

useEffect(() => {
  const fetchSheets = async () => {
    setLoadingSheets(true);
    try {
      const response = await getSheets(managerType);
      const sheetsData: DataEntry[] = response.data.map((sheet: any) => ({
        id: sheet.sheetId,
        date: new Date(sheet.Datadate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        sheetData: sheet.sheetData,
        brandId: sheet.brandId,
        brandName: sheet.brandName,
        managerType: sheet.managerType,
        month: sheet.month,
        week: sheet.week,
        year: sheet.year,
      }));
      setAvailableSheets(sheetsData);
    } catch (err) {
      console.error("Failed to fetch sheets:", err);
    } finally {
      setLoadingSheets(false);
    }
  };

  fetchSheets();
}, [managerType]);

useEffect(() => {
  const fetchSheets = async () => {
    setLoadingSheets(true);
    try {
      let response;
      if (timeframe === "Monthly") {
        response = await getFilteredSheets(
          managerType,
          "2025",             
          selectedMonth,
          brandId,            
          selectedWeek !== "All" ? selectedWeek : undefined
        );
      } else {
        response = await getSheets(managerType, brandId);
      }

      const sheetsData: DataEntry[] = response.data.map((sheet: any) => ({
        id: sheet.sheetId,
        date: new Date(sheet.Datadate).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        sheetData: sheet.sheetData,
        brandId: sheet.brandId,
        brandName: sheet.brandName,
        managerType: sheet.managerType,
        month: sheet.month,
        week: sheet.week,
        year: sheet.year,
      }));

      setAvailableSheets(sheetsData);

      if (sheetsData.length > 0) {
        // ✅ Pick the first one (latest)
        setSelectedDataId(sheetsData[0].id);
        setTableData(sheetsData[0].sheetData);
      } else {
        // If no sheets
        setSelectedDataId(null);
        setTableData([]);
      }

    } catch (err) {
      console.error("Failed to fetch sheets:", err);
    } finally {
      setLoadingSheets(false);
    }
  };

  fetchSheets();
}, [managerType, timeframe, selectedMonth, selectedWeek, brandId]);
// <-- include brandId as dep


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
          onClick={handleAddSheet}
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
  {MONTHS.map((month) => (
    <option key={month} value={month}>
      {month}
    </option>
  ))}
</select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Week</label>
              <select
                value={selectedWeek}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedWeek(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All</option>
                <option value="Week 1">Week 1</option>
                <option value="Week 2">Week 2</option>
                <option value="Week 3">Week 3</option>
                <option value="Week 4">Week 4</option>
                <option value="Week 5">Week 5</option>
              </select>
            </div>
          </div>
        )}

        {/* Available Data */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Available Data</h3>
          <div className="space-y-2">
  {loadingSheets ? (
    <p>Loading...</p>
  ) : (
    availableSheets.map((entry) => (
      <button
        key={entry.id}
        onClick={() => {
  setSelectedDataId(entry.id);
  handleSelectSheet(entry.id); // <-- add this
}}
        className={`w-full px-3 py-2 text-left text-sm rounded-md border transition-colors flex items-center gap-2 ${
          selectedDataId === entry.id
            ? 'bg-blue-50 border-blue-500 text-blue-700'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Calendar size={14} />
        {entry.date}
      </button>
    ))
  )}
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
                {selectedDataId && (
      <div className="mb-4 px-4 py-2 bg-blue-50 border-l-4 border-blue-500 text-blue-700 font-medium rounded-md shadow-sm">
        Data up to{" "}
        {
          availableSheets.find((s) => s.id === selectedDataId)?.date
        }
      </div>
    )}
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
                    {grandTotal && (
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
        {formatValue(grandTotal.OverallSecL, "OverallSecL")}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
        {formatValue(grandTotal.CRMDrSecL, "CRMDrSecL")}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
        {grandTotal.PD}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
        {formatValue(grandTotal.MTDSales, "MTDSales")}
      </td>
    </tr>
  )}
                  {/* Data Rows */}
                  {tableData.map((row: SalesData, index: number) => (
  <tr key={index} className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.RM}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">{row.NoOfTGTDr}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">{row.NoOfCRMDr}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">{formatValue(row.OverallSecL, 'OverallSecL')}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">{formatValue(row.CRMDrSecL, 'CRMDrSecL')}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">{row.PD}</td>
    <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${getCellColor(row.MTDSales, 'MTDSales')}`}>{formatValue(row.MTDSales, 'MTDSales')}</td>
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
        <button
          onClick={() => setIsModalOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Manager Type Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Manager Type
          </label>
       <select
  value={managerType}
  onChange={(e) => setManagerType(e.target.value as ManagerType)}
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
>
  <option value="RBM">RBM</option>
  <option value="ABM">ABM</option>
  <option value="ZBM">ZBM</option>
</select>
        </div>

        {/* Data Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Date
          </label>
          <input
            type="date"
            value={uploadDate}
            onChange={(e) => setUploadDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Regional Manager File */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Regional Manager File
          </label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) =>
              handleFileUpload("file1", e.target.files?.[0] || null)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Sales Data File */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sales Data File
          </label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) =>
              handleFileUpload("file2", e.target.files?.[0] || null)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={`px-6 py-2 rounded-md text-white font-medium ${
            isUploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
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