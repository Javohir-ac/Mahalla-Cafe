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

export interface OrderItem {
  _id?: string
  title: string
  quantity: number
  price: number
}

export interface Order {
  _id: string
  customerName: string
  customerPhone: string
  customerAddress: string
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface OrderResponse {
  success: boolean
  message: string
  data?: Order | Order[]
}

export const orderService = {
  // Get all orders
  getAll: async (): Promise<OrderResponse> => {
    try {
      const token = getAuthToken()

      const response = await fetch(`${normalizedBaseUrl}/api/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Get orders error:', error)
      return {
        success: false,
        message: 'Tarmoq xatosi yuz berdi',
      }
    }
  },

  // Get order by ID
  getById: async (id: string): Promise<OrderResponse> => {
    try {
      const token = getAuthToken()

      const response = await fetch(`${normalizedBaseUrl}/api/orders/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Get order error:', error)
      return {
        success: false,
        message: 'Tarmoq xatosi yuz berdi',
      }
    }
  },

  // Update order status
  updateStatus: async (id: string, status: Order['status']): Promise<OrderResponse> => {
    try {
      const token = getAuthToken()

      const response = await fetch(`${normalizedBaseUrl}/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Update order error:', error)
      return {
        success: false,
        message: 'Tarmoq xatosi yuz berdi',
      }
    }
  },

  // Delete order
  delete: async (id: string): Promise<OrderResponse> => {
    try {
      const token = getAuthToken()

      const response = await fetch(`${normalizedBaseUrl}/api/orders/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Delete order error:', error)
      return {
        success: false,
        message: 'Tarmoq xatosi yuz berdi',
      }
    }
  },
}
