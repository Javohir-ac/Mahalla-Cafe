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

interface DashboardStats {
  totals: {
    orders: number
    reservations: number
    recipes: number
    menuItems: number
  }
  recentOrders: Array<{
    customerName: string
    totalAmount: number
    status: string
    createdAt: string
  }>
  recentReservations: Array<{
    customerName: string
    date: string
    time: string
    numberOfGuests: number
    status: string
    createdAt: string
  }>
  orderStats: Array<{
    _id: string
    count: number
  }>
  reservationStats: Array<{
    _id: string
    count: number
  }>
}

interface DashboardResponse {
  success: boolean
  message: string
  data?: DashboardStats
}

export const dashboardService = {
  // Get dashboard statistics
  getStats: async (): Promise<DashboardResponse> => {
    try {
      const token = getAuthToken()

      const response = await fetch(`${normalizedBaseUrl}/api/dashboard/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      return await response.json()
    } catch (error) {
      console.error('Get dashboard stats error:', error)
      return {
        success: false,
        message: 'Tarmoq xatosi yuz berdi',
      }
    }
  },
}
