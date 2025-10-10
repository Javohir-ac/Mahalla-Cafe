const API_BASE_URL = 'http://localhost:5000/api'

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
  createdAt?: string
  updatedAt?: string
}

export interface MenuResponse {
  success: boolean
  message: string
  data?: MenuItem | MenuItem[]
}

export const menuService = {
  // Get all menu items
  getAll: async (): Promise<MenuResponse> => {
    try {
      const token = getAuthToken()

      const response = await fetch(`${API_BASE_URL}/menu`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Get menu items error:', error)
      return {
        success: false,
        message: 'Tarmoq xatosi yuz berdi',
      }
    }
  },

  // Get menu items for recipes
  getForRecipes: async (): Promise<MenuResponse> => {
    try {
      const token = getAuthToken()

      const response = await fetch(`${API_BASE_URL}/menu`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Get menu items for recipes error:', error)
      return {
        success: false,
        message: 'Tarmoq xatosi yuz berdi',
      }
    }
  },

  // Get menu item by ID
  getById: async (id: string): Promise<MenuResponse> => {
    try {
      const token = getAuthToken()

      const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Get menu item error:', error)
      return {
        success: false,
        message: 'Tarmoq xatosi yuz berdi',
      }
    }
  },

  // Create new menu item with image upload
  createWithImage: async (formData: FormData): Promise<MenuResponse> => {
    try {
      const token = getAuthToken()

      const response = await fetch(`${API_BASE_URL}/menu`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Create menu item with image error:', error)
      return {
        success: false,
        message: 'Tarmoq xatosi yuz berdi',
      }
    }
  },

  // Create new menu item without image
  create: async (menuItem: Omit<MenuItem, 'id' | '_id'>): Promise<MenuResponse> => {
    try {
      const token = getAuthToken()

      const response = await fetch(`${API_BASE_URL}/menu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(menuItem),
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Create menu item error:', error)
      return {
        success: false,
        message: 'Tarmoq xatosi yuz berdi',
      }
    }
  },

  // Update menu item with image upload
  updateWithImage: async (id: string, formData: FormData): Promise<MenuResponse> => {
    try {
      const token = getAuthToken()

      const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Update menu item with image error:', error)
      return {
        success: false,
        message: 'Tarmoq xatosi yuz berdi',
      }
    }
  },

  // Update menu item without image
  update: async (id: string, menuItem: Partial<MenuItem>): Promise<MenuResponse> => {
    try {
      const token = getAuthToken()

      const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(menuItem),
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Update menu item error:', error)
      return {
        success: false,
        message: 'Tarmoq xatosi yuz berdi',
      }
    }
  },

  // Delete menu item
  delete: async (id: string): Promise<MenuResponse> => {
    try {
      const token = getAuthToken()

      const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Delete menu item error:', error)
      return {
        success: false,
        message: 'Tarmoq xatosi yuz berdi',
      }
    }
  },
}

export default menuService
