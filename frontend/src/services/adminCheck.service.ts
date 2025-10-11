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
