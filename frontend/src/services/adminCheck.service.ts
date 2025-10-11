const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

// Remove trailing slash if present to prevent double slashes in URLs
const normalizedBaseUrl = API_BASE_URL.endsWith('/')
  ? API_BASE_URL.slice(0, -1)
  : API_BASE_URL

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
      const response = await fetch(`${normalizedBaseUrl}/api/auth/admin/check`, {
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
