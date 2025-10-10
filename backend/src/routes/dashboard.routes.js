const express = require('express')
const { getDashboardStats } = require('../controllers/dashboard.controller')
const { authorizeAdmin } = require('../middleware/auth.middleware')

const router = express.Router()

// Apply admin authorization middleware to all routes
router.use(authorizeAdmin)

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', getDashboardStats)

module.exports = router