import apiClient from './api'

interface AdminRegisterData {
  username: string
  password: string
  secretCode: string
}

interface AdminLoginData {
  username: string
  password: string
}

interface AdminAuthResponse {
  success: boolean
  message: string
  data?: {
    user: {
      id: string
      username: string
      role: string
    }
    token: string
  }
}

export const adminService = {
  // Admin registration
  register: async (data: AdminRegisterData): Promise<AdminAuthResponse> => {
    try {
      const response = await apiClient.post('/api/auth/admin/register', data)
      return response.data
    } catch (error) {
      console.error('Admin registration error:', error)
      return {
        success: false,
        message: 'Network error during registration',
      }
    }
  },

  // Admin login
  login: async (data: AdminLoginData): Promise<AdminAuthResponse> => {
    try {
      const response = await apiClient.post('/api/auth/admin/login', data)
      return response.data
    } catch (error) {
      console.error('Admin login error:', error)
      return {
        success: false,
        message: 'Network error during login',
      }
    }
  },
}
