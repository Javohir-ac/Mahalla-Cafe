const express = require('express')
const {
  registerAdmin,
  loginAdmin,
  checkAdminExists,
} = require('../controllers/auth.controller')

const router = express.Router()

// Admin registration
router.post('/admin/register', registerAdmin)

// Admin login
router.post('/admin/login', loginAdmin)

// Check if admin exists
router.get('/admin/check', checkAdminExists)

module.exports = router
