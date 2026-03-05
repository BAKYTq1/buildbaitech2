import { $api } from "../../../../API/api";
const apiClient = $api;

export const productApi = {
  getAll: async (params = {}) => {
    const { data } = await apiClient.get('products/products/', { 
        params: params // Axios автоматически превратит {category: 'apple'} в ?category=apple
    });
    return data;
},
     getSimilar: async (productId) => {
    const response = await apiClient.get('/products/products/', {
      params: {
        similar_features: productId
      }
    });
    return response.data;
  },

  // Фильтрация по бренду
  getByBrand: async (brandId, page = 1) => {
    const response = await apiClient.get('/products/products/', {
      params: {
        brand: brandId,
        page
      }
    });
    return response.data;
  },

  // Фильтрация по категории
  getByCategory: async (category, page = 1) => {
    const response = await apiClient.get('/products/products/', {
      params: {
        category,
        page
      }
    });
    return response.data;
  },

  // Поиск по артикулу
  getByArticle: async (article) => {
    const response = await apiClient.get('/products/products/', {
      params: {
        article
      }
    });
    return response.data;
  },

  // Фильтрация по цене
  getByPrice: async (price, page = 1) => {
    const response = await apiClient.get('/products/products/', {
      params: {
        price,
        page
      }
    });
    return response.data;
  },
  getById: async (id) => {
    const { data } = await apiClient.get(`products/products/${id}/`);
    return data;
  },

  // Удаление товара
  delete: async (id) => {
    const { data } = await apiClient.delete(`products/products/${id}/`);
    return data;
  },

  // Частичное обновление (например, статус)
  patch: async (id, payload) => {
    const { data } = await apiClient.patch(`products/products/${id}/`, payload);
    return data;
  },
  put: async (id, payload) => {
    const { data } = await apiClient.put(`products/products/${id}/`, payload);
    return data;
  },
  changeAvailability: async (id, is_available) => {
    const { data } = await apiClient.patch(`products/products/${id}/`, { is_available });
    return data;
  },
  getCategories: async () => {
    const { data } = await apiClient.get('products/categories/');
    return data;
  },
  getBrands: async () => {
    const { data } = await apiClient.get('products/brands/');
    return data;
  },

  create: async (payload) => {
    const { data } = await apiClient.post('products/products/', payload);
    return data;
  },
  createCategory: async (payload) => {
    const { data } = await apiClient.post('products/categories/', payload);
    return data;
  },
  createBrand: async (payload) => {
    const { data } = await apiClient.post('products/brands/', payload);
    return data;
  },
  deleteCategory: async (id) => {
    const { data } = await apiClient.delete(`products/categories/${id}/`);
    return data;
  },
  deleteBrand: async (id) => {
    const { data } = await apiClient.delete(`products/brands/${id}/`);
    return data;
  },
};