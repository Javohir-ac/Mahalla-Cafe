const express = require('express')
const {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menu.controller')
const { upload, handleUploadError } = require('../middleware/upload.middleware')
const { adminAuth } = require('../middleware/auth.middleware')

const router = express.Router()

// GET /api/menu - Publicly accessible
router.get('/', getAllMenuItems)

// GET /api/menu/:id - Publicly accessible
router.get('/:id', getMenuItemById)

// POST /api/menu - Requires admin authentication
// Handle both JSON and form-data requests
router.post('/', adminAuth, upload.single('image'), handleUploadError, createMenuItem)

// PUT /api/menu/:id - Requires admin authentication
// Handle both JSON and form-data requests
router.put('/:id', adminAuth, upload.single('image'), handleUploadError, updateMenuItem)

// DELETE /api/menu/:id - Requires admin authentication
router.delete('/:id', adminAuth, deleteMenuItem)

module.exports = router
