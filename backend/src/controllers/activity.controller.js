const ActivityLog = require('../models/ActivityLog')
const { sendSuccess, sendError } = require('../utils/response.utils')

// Get all activity logs
<<<<<<< HEAD
const getAllActivities = async (req, res) => {
  try {
    const activities = await ActivityLog.find().sort({ createdAt: -1 })
    sendSuccess(res, activities, 'Activity logs retrieved successfully')
=======
const getAllActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 })
    sendSuccess(res, logs, 'Activity logs retrieved successfully')
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
  } catch (error) {
    console.error('Error getting activity logs:', error)
    sendError(res, 'Failed to retrieve activity logs')
  }
}

// Get activity log by ID
<<<<<<< HEAD
const getActivityById = async (req, res) => {
  try {
    const activity = await ActivityLog.findById(req.params.id)
    if (!activity) {
      return sendError(res, 'Activity log not found', 404)
    }
    sendSuccess(res, activity, 'Activity log retrieved successfully')
=======
const getActivityLogById = async (req, res) => {
  try {
    const log = await ActivityLog.findById(req.params.id)
    if (!log) {
      return sendError(res, 'Activity log not found', 404)
    }
    sendSuccess(res, log, 'Activity log retrieved successfully')
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
  } catch (error) {
    console.error('Error getting activity log:', error)
    sendError(res, 'Failed to retrieve activity log')
  }
}

// Create new activity log
<<<<<<< HEAD
const createActivity = async (req, res) => {
  try {
    const activity = new ActivityLog(req.body)
    await activity.save()
    sendSuccess(res, activity, 'Activity log created successfully', 201)
=======
const createActivityLog = async (req, res) => {
  try {
    const log = new ActivityLog(req.body)
    await log.save()

    sendSuccess(res, log, 'Activity log created successfully', 201)
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
  } catch (error) {
    console.error('Error creating activity log:', error)
    sendError(res, 'Failed to create activity log')
  }
}

<<<<<<< HEAD
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
=======
// Delete activity log
const deleteActivityLog = async (req, res) => {
  try {
    const log = await ActivityLog.findByIdAndDelete(req.params.id)

    if (!log) {
      return sendError(res, 'Activity log not found', 404)
    }

>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
    sendSuccess(res, null, 'Activity log deleted successfully')
  } catch (error) {
    console.error('Error deleting activity log:', error)
    sendError(res, 'Failed to delete activity log')
  }
}

module.exports = {
<<<<<<< HEAD
  getAllActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
=======
  getAllActivityLogs,
  getActivityLogById,
  createActivityLog,
  deleteActivityLog,
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
}
