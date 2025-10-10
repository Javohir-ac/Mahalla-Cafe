<<<<<<< HEAD
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'
=======
const API_BASE_URL = 'http://localhost:5000/api'
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b

interface AdminCheckResponse {
  success: boolean
  message: string
  data?: {
    adminExists: boolean
  }
}

export const adminCheckService = {
  // Check if any admin exists in the system
  checkAdminExists: async (): Promise<AdminCheckResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/check`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      return await response.json()
    } catch (error) {
      // If there's a network error, we'll assume no admin exists
      console.error('Admin check error:', error)
      return {
        success: true,
        message: 'Network error during admin check',
        data: {
          adminExists: false,
        },
      }
    }
  },
}
