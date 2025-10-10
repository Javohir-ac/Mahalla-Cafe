const ActivityLog = require('../models/ActivityLog')
const { sendSuccess, sendError } = require('../utils/response.utils')

// Get all activity logs
const getAllActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 })
    sendSuccess(res, logs, 'Activity logs retrieved successfully')
  } catch (error) {
    console.error('Error getting activity logs:', error)
    sendError(res, 'Failed to retrieve activity logs')
  }
}

// Get activity log by ID
const getActivityLogById = async (req, res) => {
  try {
    const log = await ActivityLog.findById(req.params.id)
    if (!log) {
      return sendError(res, 'Activity log not found', 404)
    }
    sendSuccess(res, log, 'Activity log retrieved successfully')
  } catch (error) {
    console.error('Error getting activity log:', error)
    sendError(res, 'Failed to retrieve activity log')
  }
}

// Create new activity log
const createActivityLog = async (req, res) => {
  try {
    const log = new ActivityLog(req.body)
    await log.save()

    sendSuccess(res, log, 'Activity log created successfully', 201)
  } catch (error) {
    console.error('Error creating activity log:', error)
    sendError(res, 'Failed to create activity log')
  }
}

// Delete activity log
const deleteActivityLog = async (req, res) => {
  try {
    const log = await ActivityLog.findByIdAndDelete(req.params.id)

    if (!log) {
      return sendError(res, 'Activity log not found', 404)
    }

    sendSuccess(res, null, 'Activity log deleted successfully')
  } catch (error) {
    console.error('Error deleting activity log:', error)
    sendError(res, 'Failed to delete activity log')
  }
}

module.exports = {
  getAllActivityLogs,
  getActivityLogById,
  createActivityLog,
  deleteActivityLog,
}
