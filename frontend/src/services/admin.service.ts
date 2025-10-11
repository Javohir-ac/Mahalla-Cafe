const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

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
      const response = await fetch(`${API_BASE_URL}/auth/admin/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      return await response.json()
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
      const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      return await response.json()
    } catch (error) {
      console.error('Admin login error:', error)
      return {
        success: false,
        message: 'Network error during login',
      }
    }
  },
}
