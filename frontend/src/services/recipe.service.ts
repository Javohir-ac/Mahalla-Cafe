const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

// Remove trailing slash if present to prevent double slashes in URLs
const normalizedBaseUrl = API_BASE_URL.endsWith('/')
  ? API_BASE_URL.slice(0, -1)
  : API_BASE_URL

// Get auth token from localStorage
const getAuthToken = () => {
  const adminData = localStorage.getItem('admin')
  if (adminData) {
    const parsed = JSON.parse(adminData)
    return parsed.token
  }
  return null
}

export interface RecipeItem {
  _id: string
  id: string
  title: string
  description: string
  ingredients: Array<{ name: string; quantity: string }>
  instructions: string
  prepTime: number
  cookTime: number
  servings: number
  category: string
  dish?: string
  image?: string
  createdAt: string
  updatedAt: string
}

export interface RecipeResponse {
  success: boolean
  message: string
  data?: RecipeItem | RecipeItem[]
}

export const recipeService = {
  // Get all recipes
  getAll: async (): Promise<RecipeResponse> => {
    try {
      const token = getAuthToken()

      const response = await fetch(`${normalizedBaseUrl}/api/recipes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Get recipes error:', error)
      return {
        success: false,
        message: 'Tarmoq xatosi yuz berdi',
      }
    }
  },

  // Get recipe by ID
  getById: async (id: string): Promise<RecipeResponse> => {
    try {
      const token = getAuthToken()

      const response = await fetch(`${normalizedBaseUrl}/api/recipes/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Get recipe error:', error)
      return {
        success: false,
        message: 'Tarmoq xatosi yuz berdi',
      }
    }
  },

  // Create new recipe
  create: async (recipe: Omit<RecipeItem, 'id' | '_id'>): Promise<RecipeResponse> => {
    try {
      const token = getAuthToken()

      const response = await fetch(`${normalizedBaseUrl}/api/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recipe),
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Create recipe error:', error)
      return {
        success: false,
        message: 'Tarmoq xatosi yuz berdi',
      }
    }
  },

  // Update recipe
  update: async (id: string, recipe: Partial<RecipeItem>): Promise<RecipeResponse> => {
    try {
      const token = getAuthToken()

      const response = await fetch(`${normalizedBaseUrl}/api/recipes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recipe),
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Update recipe error:', error)
      return {
        success: false,
        message: 'Tarmoq xatosi yuz berdi',
      }
    }
  },

  // Delete recipe
  delete: async (id: string): Promise<RecipeResponse> => {
    try {
      const token = getAuthToken()

      const response = await fetch(`${normalizedBaseUrl}/api/recipes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Delete recipe error:', error)
      return {
        success: false,
        message: 'Tarmoq xatosi yuz berdi',
      }
    }
  },
}

export default recipeService
