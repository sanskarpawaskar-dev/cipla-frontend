import axios from "axios";

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: "http://localhost:8080", // NestJS backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Example API functions
export const getBrands = () => api.get("dashboard/brands");

export const addBrand = (brand: { brandName: string }) =>
  api.post("dashboard/brands", brand);

export const updateBrand = (id: number, brand: { name: string }) =>
  api.patch(`dashboard/brands/${id}`, brand);

export const deleteBrand = (id: number) =>
  api.delete(`dashboard/brands/${id}`);

export const addSheets = (
  files: { file1: File; file2: File },
  body: { brandId: string; brandName: string; managerType: string; datadate: string }
) => {
  const formData = new FormData();
  formData.append("file1", files.file1);
  formData.append("file2", files.file2);
  formData.append("BrandId", body.brandId);
  formData.append("BrandName", body.brandName);
  formData.append("managerType", body.managerType);
  formData.append("Datadate", body.datadate); // Send as string directly

  return api.post("sheet/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getSheets = (managerType?: string, brandId?: string) => {
  return api.get("sheet", {
    params: {
      managerType,
      brandId,   // <-- add brandId
    },
  });
};

export const getFilteredSheets = async (
  managerType: string,
  year: string,
  month: string,
  brandId: string,   // <-- add brandId here
  week?: string
) => {
  const params: any = { managerType, year, month, brandId }; // include brandId
  if (week && week !== "All") {
    params.week = week;
  }

  const response = await api.get(`sheet/filter`, { params });
  return response;
};



