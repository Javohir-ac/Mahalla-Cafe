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

export interface ActivityLog {
  id?: string
  adminId: string
  adminUsername: string
  action: string
  entityType: string
  entityId?: string
  details?: string
  createdAt: string
  updatedAt: string
}

interface ActivityResponse {
  success: boolean
  message: string
  data?: ActivityLog | ActivityLog[]
}

// Helper function to normalize activity log data
const normalizeActivityLog = (item: any): ActivityLog => {
  return {
    id: item.id || item._id,
    adminId: item.adminId,
    adminUsername: item.adminUsername,
    action: item.action,
    entityType: item.entityType,
    entityId: item.entityId,
    details: item.details,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }
}

export const activityService = {
  // Get all activity logs
  getAll: async (): Promise<ActivityResponse> => {
    try {
      const token = getAuthToken()

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await apiClient.get('/api/activity', config)
      const result = response.data

      // Normalize the data to ensure consistent structure
      if (result.success && result.data) {
        if (Array.isArray(result.data)) {
          result.data = result.data.map(normalizeActivityLog)
        } else {
          result.data = normalizeActivityLog(result.data)
        }
      }

      return result
    } catch (error) {
      console.error('Get activity logs error:', error)
      return {
        success: false,
        message: 'Tarmoq xatosi yuz berdi',
      }
    }
  },

  // Get activity log by ID
  getById: async (id: string): Promise<ActivityResponse> => {
    try {
      const token = getAuthToken()

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await apiClient.get(`/api/activity/${id}`, config)
      const result = response.data

      // Normalize the data to ensure consistent structure
      if (result.success && result.data) {
        result.data = normalizeActivityLog(result.data)
      }

      return result
    } catch (error) {
      console.error('Get activity log error:', error)
      return {
        success: false,
        message: 'Tarmoq xatosi yuz berdi',
      }
    }
  },

  // Delete activity log
  delete: async (id: string): Promise<ActivityResponse> => {
    try {
      const token = getAuthToken()

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await apiClient.delete(`/api/activity/${id}`, config)
      return response.data
    } catch (error) {
      console.error('Delete activity log error:', error)
      return {
        success: false,
        message: 'Tarmoq xatosi yuz berdi',
      }
    }
  },
}
