import axios from "axios";
import { API_BASE_URL, API_URLS, getHeaders } from "../constant"

export const fetchCategoryFilters = async (categoryId) => {
  const url = API_BASE_URL + API_URLS.GET_CATEGORY_FILTER(categoryId);
  try {
    const res = await axios.get(url, { headers: getHeaders() });
    return res.data;
  } catch (e) {
    console.error("Error fetching filters:", e);
    return {};
  }
};

// export const fetchBrandFilters = async (brandId) => {
//   const url = API_BASE_URL + API_URLS.GET_BRAND_FILTER(brandId);
//   try {
//     const res = await axios.get(url, { headers: getHeaders() });
//     return res.data;
//   } catch (e) {
//     console.error("Error fetching filters:", e);
//     return {};
//   }
// };