import apiClient from './api'

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
      const response = await apiClient.get('/auth/admin/check')
      return response.data
    } catch (error: any) {
      // If there's a network error, we'll assume no admin exists
      console.error('Admin check error:', error)

      // Check if it's a CORS or network error
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        return {
          success: true,
          message: 'Network error during admin check',
          data: {
            adminExists: false,
          },
        }
      }

      // For other errors, return the actual error
      return {
        success: false,
        message: error.response?.data?.message || 'Server error during admin check',
      }
    }
  },
}
