import axios from "axios";
import { API_BASE_URL, getHeaders, API_URLS } from "../constant";

export const getProductCategoryId = async (categoryId) => {
  const url = API_BASE_URL + API_URLS.GET_PRODUCT_CATEGORY(categoryId);
  try {
    const response = await axios.get(url, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (err) {
    console.error("getProductCategoryId error:", err.response || err);
    throw err;
  }
};
