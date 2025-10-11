const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

// Remove trailing slash if present to prevent double slashes in URLs
const normalizedBaseUrl = API_BASE_URL.endsWith('/')
  ? API_BASE_URL.slice(0, -1)
  : API_BASE_URL

interface AuthResponse {
  success: boolean
  message: string
  data?: {
    admin: {
      id: string
      username: string
      role: string
    }
    token: string
  }
}

export const authService = {
  // Admin login
  loginAdmin: async (username: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${normalizedBaseUrl}/api/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      })

      return await response.json()
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        message: 'Network error during login',
      }
    }
  },

  // Admin registration
  registerAdmin: async (
    username: string,
    password: string,
    secretCode: string
  ): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${normalizedBaseUrl}/api/auth/admin/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, secretCode }),
        credentials: 'include',
      })

      return await response.json()
    } catch (error) {
      console.error('Registration error:', error)
      return {
        success: false,
        message: 'Network error during registration',
      }
    }
  },
}

// Function to verify if the user is an admin
export const isAdmin = (): boolean => {
  try {
    const adminData = localStorage.getItem('admin')

    if (!adminData) {
      return false
    }

    const parsed = JSON.parse(adminData)
    const token = parsed.token

    if (!token) {
      return false
    }

    // Decode the JWT token to check if it's valid and has admin role
    const payload = JSON.parse(atob(token.split('.')[1]))

    // Check if the token has expired
    if (payload.exp * 1000 < Date.now()) {
      // Token expired, remove it
      localStorage.removeItem('admin')
      return false
    }

    // Check if the user has admin role
    return payload.role === 'admin'
  } catch (error) {
    // If there's an error decoding the token, remove it
    localStorage.removeItem('admin')
    return false
  }
}

// Function to logout admin
export const logoutAdmin = (): void => {
  localStorage.removeItem('admin')
  window.dispatchEvent(new Event('adminStatusChanged'))
}
