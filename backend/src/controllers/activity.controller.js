const ActivityLog = require('../models/ActivityLog')
const { sendSuccess, sendError } = require('../utils/response.utils')

// Get all activity logs
const getAllActivities = async (req, res) => {
  try {
    const activities = await ActivityLog.find().sort({ createdAt: -1 })
    sendSuccess(res, activities, 'Activity logs retrieved successfully')
  } catch (error) {
    console.error('Error getting activity logs:', error)
    sendError(res, 'Failed to retrieve activity logs')
  }
}

// Get activity log by ID
const getActivityById = async (req, res) => {
  try {
    const activity = await ActivityLog.findById(req.params.id)
    if (!activity) {
      return sendError(res, 'Activity log not found', 404)
    }
    sendSuccess(res, activity, 'Activity log retrieved successfully')
  } catch (error) {
    console.error('Error getting activity log:', error)
    sendError(res, 'Failed to retrieve activity log')
  }
}

// Create new activity log
const createActivity = async (req, res) => {
  try {
    const activity = new ActivityLog(req.body)
    await activity.save()
    sendSuccess(res, activity, 'Activity log created successfully', 201)
  } catch (error) {
    console.error('Error creating activity log:', error)
    sendError(res, 'Failed to create activity log')
  }
}

// Update activity log
const updateActivity = async (req, res) => {
  try {
    const activity = await ActivityLog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!activity) {
      return sendError(res, 'Activity log not found', 404)
    }
    sendSuccess(res, activity, 'Activity log updated successfully')
  } catch (error) {
    console.error('Error updating activity log:', error)
    sendError(res, 'Failed to update activity log')
  }
}

// Delete activity log
const deleteActivity = async (req, res) => {
  try {
    const activity = await ActivityLog.findByIdAndDelete(req.params.id)
    if (!activity) {
      return sendError(res, 'Activity log not found', 404)
    }
    sendSuccess(res, null, 'Activity log deleted successfully')
  } catch (error) {
    console.error('Error deleting activity log:', error)
    sendError(res, 'Failed to delete activity log')
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
}
