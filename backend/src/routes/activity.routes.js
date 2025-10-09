const express = require('express')
const {
  getAllActivityLogs,
  getActivityLogById,
  createActivityLog,
  deleteActivityLog,
} = require('../controllers/activity.controller')
const { authorizeAdmin } = require('../middleware/auth.middleware')

const router = express.Router()

// Apply admin authorization middleware to all routes
router.use(authorizeAdmin)

// GET /api/activity - Get all activity logs
router.get('/', getAllActivityLogs)

// GET /api/activity/:id - Get activity log by ID
router.get('/:id', getActivityLogById)

// POST /api/activity - Create new activity log
router.post('/', createActivityLog)

// DELETE /api/activity/:id - Delete activity log
router.delete('/:id', deleteActivityLog)

module.exports = router
