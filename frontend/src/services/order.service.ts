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

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await apiClient.get('/orders', config)
      return response.data
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

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await apiClient.get(`/orders/${id}`, config)
      return response.data
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

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await apiClient.put(`/orders/${id}`, { status }, config)
      return response.data
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

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await apiClient.delete(`/orders/${id}`, config)
      return response.data
    } catch (error) {
      console.error('Delete order error:', error)
      return {
        success: false,
        message: 'Tarmoq xatosi yuz berdi',
      }
    }
  },
}
