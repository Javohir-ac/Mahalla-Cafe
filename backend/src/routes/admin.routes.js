const express = require('express')
const {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} = require('../controllers/admin.controller')
const { authorizeAdmin } = require('../middleware/auth.middleware')

const router = express.Router()

// Apply admin authorization middleware to all routes
router.use(authorizeAdmin)

// GET /api/admins - Get all admins
router.get('/', getAllAdmins)

// GET /api/admins/:id - Get admin by ID
router.get('/:id', getAdminById)

// POST /api/admins - Create new admin
router.post('/', createAdmin)

// PUT /api/admins/:id - Update admin
router.put('/:id', updateAdmin)

// DELETE /api/admins/:id - Delete admin
router.delete('/:id', deleteAdmin)

module.exports = router