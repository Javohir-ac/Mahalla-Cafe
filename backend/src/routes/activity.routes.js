const express = require('express')
const {
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

module.exports = router
