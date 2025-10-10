const express = require('express')
const {
<<<<<<< HEAD
  getAllActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
} = require('../controllers/activity.controller')

const router = express.Router()

// GET /api/activity
router.get('/', getAllActivities)

// GET /api/activity/:id
router.get('/:id', getActivityById)

// POST /api/activity
router.post('/', createActivity)

// PUT /api/activity/:id
router.put('/:id', updateActivity)

// DELETE /api/activity/:id
router.delete('/:id', deleteActivity)
=======
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
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b

module.exports = router
