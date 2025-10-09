// This is a placeholder for API calls
// In a real application, this would connect to the backend API

import axios from 'axios'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    // Add auth token if available
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API service functions
export const apiService = {
  // Menu items
  getMenuItems: async () => {
    try {
      return await apiClient.get('/menu')
    } catch (error) {
      throw new Error('Menyu elementlarini yuklab bo`lmadi')
    }
  },

  // Get single menu item
  getMenuItem: async (id: string | number) => {
    try {
      return await apiClient.get(`/menu/${id}`)
    } catch (error) {
      throw new Error('Menyu elementini yuklab bo`lmadi')
    }
  },

  // Cart operations
  addToCart: async (itemId: number, quantity: number) => {
    try {
      return await apiClient.post('/cart', { itemId, quantity })
    } catch (error) {
      throw new Error('Elementni savatga qo`shib bo`lmadi')
    }
  },

  // Contact form submission
  submitContactForm: async (formData: any) => {
    try {
      return await apiClient.post('/contact', formData)
    } catch (error) {
      throw new Error('Aloqa formasini yuborib bo`lmadi')
    }
  },
}

export default apiClient
