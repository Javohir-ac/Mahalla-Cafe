const express = require('express')
const { getDashboardStats } = require('../controllers/dashboard.controller')
<<<<<<< HEAD

const router = express.Router()

// GET /api/dashboard/stats
=======
const { authorizeAdmin } = require('../middleware/auth.middleware')

const router = express.Router()

// Apply admin authorization middleware to all routes
router.use(authorizeAdmin)

// GET /api/dashboard/stats - Get dashboard statistics
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
router.get('/stats', getDashboardStats)

module.exports = router
