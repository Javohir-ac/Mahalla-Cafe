const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

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
  getAll: async (): Promise<MenuResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server returned non-JSON response:', errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result
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
      const response = await fetch(`${API_BASE_URL}/menu`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server returned non-JSON response:', errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result
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
      const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server returned non-JSON response:', errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result
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

      const response = await fetch(`${API_BASE_URL}/menu`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server returned non-JSON response:', errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result
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

      const response = await fetch(`${API_BASE_URL}/menu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(menuItem),
      })

      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server returned non-JSON response:', errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result
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

      const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server returned non-JSON response:', errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result
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

      const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(menuItem),
      })

      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server returned non-JSON response:', errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result
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

      const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server returned non-JSON response:', errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result
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
