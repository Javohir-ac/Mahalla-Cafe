const express = require('express')
const {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} = require('../controllers/admin.controller')

const router = express.Router()

// GET /api/admins
router.get('/', getAllAdmins)

// GET /api/admins/:id
router.get('/:id', getAdminById)

// POST /api/admins
router.post('/', createAdmin)

// PUT /api/admins/:id
router.put('/:id', updateAdmin)

// DELETE /api/admins/:id
router.delete('/:id', deleteAdmin)

module.exports = router
