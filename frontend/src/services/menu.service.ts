<<<<<<< HEAD
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
=======
const API_BASE_URL = 'http://localhost:5000/api'
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b

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
<<<<<<< HEAD
  imageUrl?: string
=======
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
  createdAt?: string
  updatedAt?: string
}

export interface MenuResponse {
  success: boolean
  message: string
  data?: MenuItem | MenuItem[]
}

export const menuService = {
<<<<<<< HEAD
  // Get all menu items - Publicly accessible
  getAll: async (): Promise<MenuResponse> => {
    try {
=======
  // Get all menu items
  getAll: async (): Promise<MenuResponse> => {
    try {
      const token = getAuthToken()

>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
      const response = await fetch(`${API_BASE_URL}/menu`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
<<<<<<< HEAD
        },
      })

      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server returned non-JSON response:', errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

=======
          Authorization: `Bearer ${token}`,
        },
      })

>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Get menu items error:', error)
      return {
        success: false,
<<<<<<< HEAD
        message:
          'Tarmoq xatosi yuz berdi: ' +
          (error instanceof Error ? error.message : String(error)),
=======
        message: 'Tarmoq xatosi yuz berdi',
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
      }
    }
  },

<<<<<<< HEAD
  // Get menu items for recipes - Publicly accessible
  getForRecipes: async (): Promise<MenuResponse> => {
    try {
=======
  // Get menu items for recipes
  getForRecipes: async (): Promise<MenuResponse> => {
    try {
      const token = getAuthToken()

>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
      const response = await fetch(`${API_BASE_URL}/menu`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
<<<<<<< HEAD
        },
      })

      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server returned non-JSON response:', errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

=======
          Authorization: `Bearer ${token}`,
        },
      })

>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Get menu items for recipes error:', error)
      return {
        success: false,
<<<<<<< HEAD
        message:
          'Tarmoq xatosi yuz berdi: ' +
          (error instanceof Error ? error.message : String(error)),
=======
        message: 'Tarmoq xatosi yuz berdi',
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
      }
    }
  },

<<<<<<< HEAD
  // Get menu item by ID - Publicly accessible
  getById: async (id: string): Promise<MenuResponse> => {
    try {
=======
  // Get menu item by ID
  getById: async (id: string): Promise<MenuResponse> => {
    try {
      const token = getAuthToken()

>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
      const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
<<<<<<< HEAD
        },
      })

      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server returned non-JSON response:', errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

=======
          Authorization: `Bearer ${token}`,
        },
      })

>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Get menu item error:', error)
      return {
        success: false,
<<<<<<< HEAD
        message:
          'Tarmoq xatosi yuz berdi: ' +
          (error instanceof Error ? error.message : String(error)),
=======
        message: 'Tarmoq xatosi yuz berdi',
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
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

<<<<<<< HEAD
      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server returned non-JSON response:', errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

=======
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Create menu item with image error:', error)
      return {
        success: false,
<<<<<<< HEAD
        message:
          'Tarmoq xatosi yuz berdi: ' +
          (error instanceof Error ? error.message : String(error)),
=======
        message: 'Tarmoq xatosi yuz berdi',
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
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

<<<<<<< HEAD
      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server returned non-JSON response:', errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

=======
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Create menu item error:', error)
      return {
        success: false,
<<<<<<< HEAD
        message:
          'Tarmoq xatosi yuz berdi: ' +
          (error instanceof Error ? error.message : String(error)),
=======
        message: 'Tarmoq xatosi yuz berdi',
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
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

<<<<<<< HEAD
      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server returned non-JSON response:', errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

=======
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Update menu item with image error:', error)
      return {
        success: false,
<<<<<<< HEAD
        message:
          'Tarmoq xatosi yuz berdi: ' +
          (error instanceof Error ? error.message : String(error)),
=======
        message: 'Tarmoq xatosi yuz berdi',
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
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

<<<<<<< HEAD
      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server returned non-JSON response:', errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

=======
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Update menu item error:', error)
      return {
        success: false,
<<<<<<< HEAD
        message:
          'Tarmoq xatosi yuz berdi: ' +
          (error instanceof Error ? error.message : String(error)),
=======
        message: 'Tarmoq xatosi yuz berdi',
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
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

<<<<<<< HEAD
      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server returned non-JSON response:', errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

=======
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Delete menu item error:', error)
      return {
        success: false,
<<<<<<< HEAD
        message:
          'Tarmoq xatosi yuz berdi: ' +
          (error instanceof Error ? error.message : String(error)),
=======
        message: 'Tarmoq xatosi yuz berdi',
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
      }
    }
  },
}

export default menuService
