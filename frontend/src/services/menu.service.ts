import apiClient from './api'

// Get auth token from localStorage
const getAuthToken = () => {
  const adminData = localStorage.getItem('admin')
  if (adminData) {
    const parsed = JSON.parse(adminData)
    return parsed.token
  }
  return null
}

export interface MenuItem {
  id?: string
  _id?: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  imageUrl?: string
  createdAt?: string
  updatedAt?: string
}

export interface MenuResponse {
  success: boolean
  message: string
  data?: MenuItem | MenuItem[]
}

export const menuService = {
  // Get all menu items - Publicly accessible
  getAll: async (category?: string): Promise<MenuResponse> => {
    try {
      // Construct URL with optional category parameter
      let url = '/menu'
      if (category && category !== 'all') {
        url += `?category=${encodeURIComponent(category)}`
      }

      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      console.error('Get menu items error:', error)
      return {
        success: false,
        message:
          'Tarmoq xatosi yuz berdi: ' +
          (error instanceof Error ? error.message : String(error)),
      }
    }
  },

  // Get menu items for recipes - Publicly accessible
  getForRecipes: async (): Promise<MenuResponse> => {
    try {
      const response = await apiClient.get('/menu')
      return response.data
    } catch (error) {
      console.error('Get menu items for recipes error:', error)
      return {
        success: false,
        message:
          'Tarmoq xatosi yuz berdi: ' +
          (error instanceof Error ? error.message : String(error)),
      }
    }
  },

  // Get menu item by ID - Publicly accessible
  getById: async (id: string): Promise<MenuResponse> => {
    try {
      const response = await apiClient.get(`/menu/${id}`)
      return response.data
    } catch (error) {
      console.error('Get menu item error:', error)
      return {
        success: false,
        message:
          'Tarmoq xatosi yuz berdi: ' +
          (error instanceof Error ? error.message : String(error)),
      }
    }
  },

  // Create new menu item with image upload
  createWithImage: async (formData: FormData): Promise<MenuResponse> => {
    try {
      const token = getAuthToken()

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await apiClient.post('/menu', formData, config)
      return response.data
    } catch (error) {
      console.error('Create menu item with image error:', error)
      return {
        success: false,
        message:
          'Tarmoq xatosi yuz berdi: ' +
          (error instanceof Error ? error.message : String(error)),
      }
    }
  },

  // Create new menu item without image
  create: async (menuItem: Omit<MenuItem, 'id' | '_id'>): Promise<MenuResponse> => {
    try {
      const token = getAuthToken()

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await apiClient.post('/menu', menuItem, config)
      return response.data
    } catch (error) {
      console.error('Create menu item error:', error)
      return {
        success: false,
        message:
          'Tarmoq xatosi yuz berdi: ' +
          (error instanceof Error ? error.message : String(error)),
      }
    }
  },

  // Update menu item with image upload
  updateWithImage: async (id: string, formData: FormData): Promise<MenuResponse> => {
    try {
      const token = getAuthToken()

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await apiClient.put(`/menu/${id}`, formData, config)
      return response.data
    } catch (error) {
      console.error('Update menu item with image error:', error)
      return {
        success: false,
        message:
          'Tarmoq xatosi yuz berdi: ' +
          (error instanceof Error ? error.message : String(error)),
      }
    }
  },

  // Update menu item without image
  update: async (id: string, menuItem: Partial<MenuItem>): Promise<MenuResponse> => {
    try {
      const token = getAuthToken()

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await apiClient.put(`/menu/${id}`, menuItem, config)
      return response.data
    } catch (error) {
      console.error('Update menu item error:', error)
      return {
        success: false,
        message:
          'Tarmoq xatosi yuz berdi: ' +
          (error instanceof Error ? error.message : String(error)),
      }
    }
  },

  // Delete menu item
  delete: async (id: string): Promise<MenuResponse> => {
    try {
      const token = getAuthToken()

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await apiClient.delete(`/menu/${id}`, config)
      return response.data
    } catch (error) {
      console.error('Delete menu item error:', error)
      return {
        success: false,
        message:
          'Tarmoq xatosi yuz berdi: ' +
          (error instanceof Error ? error.message : String(error)),
      }
    }
  },
}

export default menuService
