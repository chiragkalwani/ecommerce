import axios from 'axios';

// Base URL for Fake Store API
const API_URL = 'https://fakestoreapi.com';

// Fetch products
export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products', error);
    throw error;
  }
};

// Fetch categories
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/products/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories', error);
    throw error;
  }
};


