import { getToken } from "../utils/jwt-helper";

export const API_URLS = {
    GET_PRODUCTS:'/api/products',
    GET_PRODUCT: (id) => `/api/product/${id}`,

    GET_PRODUCT_CATEGORY: (categoryId) => `/api/products?categoryId=${categoryId}`,
    GET_PRODUCT_SLUG: (slug) => `/api/product/slug/${slug}`,
    SEARCH_PRODUCTS: (query) => `/api/products/search?query=${encodeURIComponent(query)}`,
    GET_RELATED_PRODUCTS: (productId) => `/api/products/related/${productId}`,
    
    GET_CATEGORIES:'/api/category',
    GET_CATEGORY: (id) => `/api/category/${id}`,
    GET_CATEGORY_CODE: (code) => `/api/category/code/${code}`,

    GET_BRANDS: `/api/brands`,
    GET_BRAND_ID: (id) => `/api/brands/${id}`,
    GET_BRANDS_CODE: (code) => `/api/brands/code/${code}`,

    GET_CATEGORY_FILTER: (id) => `/api/products/filters?categoryId=${id}`,
}

export const API_BASE_URL = 'http://localhost:8080';

export const getHeaders = () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};
