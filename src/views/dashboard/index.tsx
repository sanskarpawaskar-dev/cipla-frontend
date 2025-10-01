import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit, TrendingUp, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addBrand, getBrands } from "../../axios/api"; // adjust the path

interface Brand {
  brandId: string;
  brandName: string;
}

const Dashboard: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newBrandName, setNewBrandName] = useState<string>("");
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const navigate = useNavigate();

  // ✅ Fetch brands from API
useEffect(() => {
  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await getBrands();
      // Map backend -> frontend model
      const mappedBrands: Brand[] = response.data.map((b: any) => ({
        brandId: b.brandId,
        brandName: b.brandName,
      }));
      setBrands(mappedBrands);
    } catch (err) {
      console.error(err);
      setError("Failed to load brands. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  fetchBrands();
}, []);

  // Handlers (still local for now)
  const handleAddBrand = (): void => {
    if (newBrandName.trim()) {
      setLoading(true)
      try {
        addBrand({brandName: newBrandName})
        setBrands([...brands, { brandId: Date.now().toString(), brandName: newBrandName.trim() }]);
        setNewBrandName("");
        setIsModalOpen(false);
      } catch (error) {
        console.log(error)
      }finally{
        setLoading(false)
      }
    }
  };

  const handleEditBrand = (brand: Brand): void => {
    setEditingBrand(brand);
    setNewBrandName(brand.brandName);
    setIsModalOpen(true);
  };

  const handleUpdateBrand = (): void => {
    if (newBrandName.trim() && editingBrand) {
      setBrands(
        brands.map((b) =>
          b.brandId === editingBrand.brandId ? { ...b, name: newBrandName.trim() } : b
        )
      );
      setNewBrandName("");
      setEditingBrand(null);
      setIsModalOpen(false);
    }
  };

  const handleDeleteBrand = (id: string): void => {
    setBrands(brands.filter((b) => b.brandId !== id));
  };

  const handleModalClose = (): void => {
    setIsModalOpen(false);
    setNewBrandName("");
    setEditingBrand(null);
  };

const handleInsights = (brandName: string, brandId: string): void => {
  console.log()
  navigate(`/insights/${brandName}?id=${brandId}`);
};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Loader */}
        {loading && (
          <div className="flex justify-center items-center py-40">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-500 font-medium py-10">{error}</p>
        )}

        {/* Main UI */}
        {!loading && !error && (
          <>
            {/* Header Section */}
            <div className="mb-10">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <div className="inline-block mb-2 px-4 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                    Pharma Excellence
                  </div>
                  <h1 className="text-5xl font-black text-gray-900 mb-2">
                    Cipla Brands
                  </h1>
                  <p className="text-lg text-gray-600 font-medium">
                    Your complete brand management solution
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-white px-8 py-4 rounded-2xl shadow-lg border-2 border-blue-100">
                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wide mb-1">
                      Portfolio
                    </p>
                    <p className="text-3xl font-black text-gray-900">
                      {brands.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Brands Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-24">
  {brands.map((brand: Brand) => (
    <div
      key={brand.brandId}
      className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-gray-100 hover:border-blue-300 transform hover:-translate-y-2"
    >
      <div className="relative p-7">
        <div className="mb-6">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-2xl font-black text-white">
              {brand.brandName.charAt(0)}
            </span>
          </div>
          <h2
            className="text-2xl font-black text-gray-900 truncate group-hover:text-blue-600 transition-colors"
            title={brand.brandName}
          >
            {brand.brandName}
          </h2>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleInsights(brand.brandName, brand.brandId)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-2xl transform hover:scale-105"
          >
            <TrendingUp size={20} strokeWidth={2.5} />
            Get Insights
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => handleEditBrand(brand)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-3 px-3 rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-105"
              title="Edit"
            >
              <Edit size={18} strokeWidth={2.5} />
            </button>

            <button
              onClick={() => handleDeleteBrand(brand.brandId)}
              className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-bold py-3 px-3 rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-105"
              title="Delete"
            >
              <Trash2 size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  ))}

  {/* Empty State */}
  {brands.length === 0 && (
    <div className="col-span-full flex flex-col items-center justify-center py-20">
      <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-6 shadow-xl">
        <Plus size={50} className="text-blue-600" strokeWidth={3} />
      </div>
      <h3 className="text-2xl font-black text-gray-900 mb-2">No brands yet</h3>
      <p className="text-gray-600 text-lg mb-8">Start building your portfolio today</p>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105"
      >
        Add Your First Brand
      </button>
    </div>
  )}
</div>

            {/* Add Brand Button - Fixed Position */}
            {brands.length > 0 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white font-black py-5 px-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all flex items-center gap-3 transform hover:scale-110"
              >
                <Plus size={28} strokeWidth={3} />
                <span className="text-lg">Add Brand</span>
              </button>
            )}
          </>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-10 border-4 border-blue-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-black text-gray-900">
                  {editingBrand ? "Edit Brand" : "New Brand"}
                </h2>
                <button
                  onClick={handleModalClose}
                  className="text-gray-400 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-xl"
                >
                  <X size={28} strokeWidth={2.5} />
                </button>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wide">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={newBrandName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewBrandName(e.target.value)
                  }
                  placeholder="Enter brand name"
                  className="w-full px-5 py-4 text-lg border-3 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-600 transition-all font-semibold"
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                      editingBrand ? handleUpdateBrand() : handleAddBrand();
                    }
                  }}
                  autoFocus
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleModalClose}
                  className="flex-1 px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-2xl font-bold text-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={editingBrand ? handleUpdateBrand : handleAddBrand}
                  disabled={!newBrandName.trim()}
                  className={`flex-1 px-6 py-4 rounded-2xl font-bold text-lg transition-all ${
                    !newBrandName.trim()
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105"
                  }`}
                >
                  {editingBrand ? "Update" : "Add Brand"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;



// import React, { useState, useEffect } from 'react';
// import { Upload, Filter, Download, Calendar } from 'lucide-react';

// // Type definitions
// interface SalesData {
//   RM: string;
//   NoOfTGTDr: number;
//   NoOfCRMDr: number;
//   OverallSecL: number;
//   CRMDrSecL: number;
//   PD: number;
//   MTDSales: number;
// }

// interface GrandTotal extends SalesData {}

// interface UploadFiles {
//   file1: File | null;
//   file2: File | null;
// }

// type TimePeriod = 'latest' | 'week-to-date' | 'week-data' | 'month-to-date' | 'monthly';

// type SalesDataKey = keyof SalesData;

// interface ApiResponse {
//   data: SalesData[];
//   success: boolean;
//   message?: string;
// }

// interface UploadResponse {
//   success: boolean;
//   message: string;
//   data?: SalesData[];
// }

// const Dashboard: React.FC = () => {
//   const [data, setData] = useState<SalesData[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [selectedBrand, setSelectedBrand] = useState<string>('Indaflo G');
//   const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('latest');
//   const [uploadDate, setUploadDate] = useState<string>('');
//   const [isUploading, setIsUploading] = useState<boolean>(false);
//   const [files, setFiles] = useState<UploadFiles>({ file1: null, file2: null });
//   const [brandName, setBrandName] = useState<string>('');

//   // Sample data for demonstration - replace with actual API call
//   const sampleData: SalesData[] = [
//     {"RM":"Puneet Agarwal","NoOfTGTDr":171,"NoOfCRMDr":8,"OverallSecL":2.4,"CRMDrSecL":0.7,"PD":9091,"MTDSales":0.2},
//     {"RM":"Anil Kumar Bind","NoOfTGTDr":134,"NoOfCRMDr":28,"OverallSecL":4.0,"CRMDrSecL":2.8,"PD":9998,"MTDSales":1.4},
//     {"RM":"Shashank Shukla","NoOfTGTDr":127,"NoOfCRMDr":10,"OverallSecL":1.1,"CRMDrSecL":0.6,"PD":5587,"MTDSales":0.6},
//     {"RM":"Ashwini Kumar Mathur","NoOfTGTDr":128,"NoOfCRMDr":11,"OverallSecL":1.2,"CRMDrSecL":0.8,"PD":7015,"MTDSales":-0.1},
//     {"RM":"Ramrao Giri","NoOfTGTDr":129,"NoOfCRMDr":19,"OverallSecL":1.9,"CRMDrSecL":0.5,"PD":4758,"MTDSales":1.6},
//     {"RM":"Afroz Pasha","NoOfTGTDr":53,"NoOfCRMDr":15,"OverallSecL":1.3,"CRMDrSecL":1.0,"PD":6445,"MTDSales":1.8},
//     {"RM":"Ayan Ghosh","NoOfTGTDr":226,"NoOfCRMDr":19,"OverallSecL":1.3,"CRMDrSecL":0.5,"PD":2751,"MTDSales":0.6},
//     {"RM":"Kshatriya Rakesh Kumar Prahlad","NoOfTGTDr":175,"NoOfCRMDr":22,"OverallSecL":1.3,"CRMDrSecL":0.8,"PD":3827,"MTDSales":1.0},
//     {"RM":"S Rengaraj","NoOfTGTDr":108,"NoOfCRMDr":19,"OverallSecL":1.1,"CRMDrSecL":0.2,"PD":1228,"MTDSales":0.1},
//     {"RM":"Subhrajit Rout","NoOfTGTDr":287,"NoOfCRMDr":29,"OverallSecL":1.6,"CRMDrSecL":0.8,"PD":2709,"MTDSales":0.8},
//     {"RM":"Jithin Kumar E","NoOfTGTDr":54,"NoOfCRMDr":8,"OverallSecL":0.4,"CRMDrSecL":0.2,"PD":2723,"MTDSales":0.4},
//     {"RM":"Suprakash","NoOfTGTDr":90,"NoOfCRMDr":21,"OverallSecL":0.8,"CRMDrSecL":0.6,"PD":2629,"MTDSales":0.5}
//   ];

//   useEffect(() => {
//     // Initialize with sample data
//     setData(sampleData);
//   }, []);

//   const calculateGrandTotal = (): GrandTotal => {
//     if (data.length === 0) {
//       return {
//         RM: "Grand Total",
//         NoOfTGTDr: 0,
//         NoOfCRMDr: 0,
//         OverallSecL: 0,
//         CRMDrSecL: 0,
//         PD: 0,
//         MTDSales: 0
//       };
//     }
    
//     return {
//       RM: "Grand Total",
//       NoOfTGTDr: data.reduce((sum, item) => sum + item.NoOfTGTDr, 0),
//       NoOfCRMDr: data.reduce((sum, item) => sum + item.NoOfCRMDr, 0),
//       OverallSecL: Number((data.reduce((sum, item) => sum + item.OverallSecL, 0)).toFixed(1)),
//       CRMDrSecL: Number((data.reduce((sum, item) => sum + item.CRMDrSecL, 0)).toFixed(1)),
//       PD: data.reduce((sum, item) => sum + item.PD, 0),
//       MTDSales: Number((data.reduce((sum, item) => sum + item.MTDSales, 0)).toFixed(1))
//     };
//   };

//   const handleFileUpload = (fileType: keyof UploadFiles, file: File | null): void => {
//     setFiles(prev => ({ ...prev, [fileType]: file }));
//   };

//   const handleUpload = async (): Promise<void> => {
//     if (!files.file1 || !files.file2 || !brandName || !uploadDate) {
//       alert('Please fill all fields and select both files');
//       return;
//     }

//     setIsUploading(true);
    
//     try {
//       const formData = new FormData();
//       formData.append('file1', files.file1);
//       formData.append('file2', files.file2);
//       formData.append('brandName', brandName);
//       formData.append('dataDate', uploadDate);

//       // Replace with actual API call
//       const response = await fetch('/api/upload', {
//         method: 'POST',
//         body: formData
//       });
      
//       const result: UploadResponse = await response.json();
      
//       if (result.success) {
//         setSelectedBrand(brandName);
//         if (result.data) {
//           setData(result.data);
//         }
//         alert('Files uploaded successfully!');
//       } else {
//         alert(`Upload failed: ${result.message}`);
//       }

//       setIsUploading(false);

//     } catch (error) {
//       console.error('Upload failed:', error);
//       alert('Upload failed. Please try again.');
//       setIsUploading(false);
//     }
//   };

//   const fetchData = async (): Promise<void> => {
//     if (!selectedBrand) return;
    
//     setLoading(true);
//     try {
//       const response = await fetch(`/api/data/${selectedBrand}?period=${selectedPeriod}&date=${uploadDate}`);
//       const result: ApiResponse = await response.json();
      
//       if (result.success) {
//         setData(result.data);
//       } else {
//         alert(`Failed to fetch data: ${result.message}`);
//       }
      
//       setLoading(false);
//     } catch (error) {
//       console.error('Failed to fetch data:', error);
//       alert('Failed to fetch data. Please try again.');
//       setLoading(false);
//     }
//   };

//   const grandTotal: GrandTotal = calculateGrandTotal();

//   const formatValue = (value: number | string, key: SalesDataKey): string => {
//     if (key === 'OverallSecL' || key === 'CRMDrSecL' || key === 'MTDSales') {
//       return typeof value === 'number' ? value.toFixed(1) : value.toString();
//     }
//     return value.toString();
//   };

//   const getCellColor = (value: number, key: SalesDataKey): string => {
//     if (key === 'MTDSales' && value < 0) return 'text-red-600 bg-red-50';
//     if (key === 'MTDSales' && value > 1) return 'text-green-600 bg-green-50';
//     return '';
//   };

//   const handleExport = (): void => {
//     // Implement export functionality
//     console.log('Export functionality to be implemented');
//     alert('Export functionality will be implemented');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Dashboard</h1>
//           <p className="text-gray-600">Upload and analyze your sales data</p>
//         </div>

//         {/* Upload Section */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//           <h2 className="text-xl font-semibold mb-4 flex items-center">
//             <Upload className="mr-2" size={20} />
//             Upload Excel Files
//           </h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
//               <input
//                 type="text"
//                 value={brandName}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBrandName(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter brand name"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Data Date</label>
//               <input
//                 type="date"
//                 value={uploadDate}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUploadDate(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Regional Manager File</label>
//               <input
//                 type="file"
//                 accept=".xlsx,.xls"
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
//                   handleFileUpload('file1', e.target.files?.[0] || null)
//                 }
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Sales Data File</label>
//               <input
//                 type="file"
//                 accept=".xlsx,.xls"
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
//                   handleFileUpload('file2', e.target.files?.[0] || null)
//                 }
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           <button
//             onClick={handleUpload}
//             disabled={isUploading}
//             className={`px-6 py-2 rounded-md text-white font-medium ${
//               isUploading 
//                 ? 'bg-gray-400 cursor-not-allowed' 
//                 : 'bg-blue-600 hover:bg-blue-700'
//             }`}
//           >
//             {isUploading ? 'Uploading...' : 'Upload Files'}
//           </button>
//         </div>

//         {/* Filters Section */}
//         {selectedBrand && (
//           <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//             <h2 className="text-xl font-semibold mb-4 flex items-center">
//               <Filter className="mr-2" size={20} />
//               Filters
//             </h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
//                 <input
//                   type="text"
//                   value={selectedBrand}
//                   readOnly
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
//                 <select
//                   value={selectedPeriod}
//                   onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
//                     setSelectedPeriod(e.target.value as TimePeriod)
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="latest">Latest Upload</option>
//                   <option value="week-to-date">Week to Date</option>
//                   <option value="week-data">Week Data</option>
//                   <option value="month-to-date">Month to Date</option>
//                   <option value="monthly">Monthly</option>
//                 </select>
//               </div>

//               <div className="flex items-end">
//                 <button
//                   onClick={fetchData}
//                   className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
//                 >
//                   Apply Filters
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Dashboard Table */}
//         {selectedBrand && (
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="bg-blue-600 text-white p-4">
//               <h2 className="text-xl font-semibold">{selectedBrand}</h2>
//             </div>
            
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Row Labels
//                     </th>
//                     <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       No of TGT Dr
//                     </th>
//                     <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       No of CRM Dr
//                     </th>
//                     <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Overall Sec(L)
//                     </th>
//                     <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       CRM Dr Sec (L)
//                     </th>
//                     <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       P/D
//                     </th>
//                     <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       MTD Sales
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {/* Grand Total Row */}
//                   <tr className="bg-blue-50 font-semibold">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {grandTotal.RM}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
//                       {grandTotal.NoOfTGTDr}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
//                       {grandTotal.NoOfCRMDr}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
//                       {formatValue(grandTotal.OverallSecL, 'OverallSecL')}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
//                       {formatValue(grandTotal.CRMDrSecL, 'CRMDrSecL')}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
//                       {grandTotal.PD}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
//                       {formatValue(grandTotal.MTDSales, 'MTDSales')}
//                     </td>
//                   </tr>
                  
//                   {/* Data Rows */}
//                   {loading ? (
//                     <tr>
//                       <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
//                         Loading...
//                       </td>
//                     </tr>
//                   ) : (
//                     data.map((row: SalesData, index: number) => (
//                       <tr key={index} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {row.RM}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
//                           {row.NoOfTGTDr}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
//                           {row.NoOfCRMDr}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
//                           {formatValue(row.OverallSecL, 'OverallSecL')}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
//                           {formatValue(row.CRMDrSecL, 'CRMDrSecL')}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
//                           {row.PD}
//                         </td>
//                         <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${getCellColor(row.MTDSales, 'MTDSales')}`}>
//                           {formatValue(row.MTDSales, 'MTDSales')}
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Export Button */}
//             <div className="bg-gray-50 px-6 py-3 flex justify-end">
//               <button 
//                 onClick={handleExport}
//                 className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center"
//               >
//                 <Download className="mr-2" size={16} />
//                 Export to Excel
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;