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

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await apiClient.get('/recipes', config)
      return response.data
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

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await apiClient.get(`/recipes/${id}`, config)
      return response.data
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

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await apiClient.post('/recipes', recipe, config)
      return response.data
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

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await apiClient.put(`/recipes/${id}`, recipe, config)
      return response.data
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

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await apiClient.delete(`/recipes/${id}`, config)
      return response.data
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
