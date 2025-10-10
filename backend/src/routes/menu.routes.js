const express = require('express')
const {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menu.controller')
const { authorizeAdmin } = require('../middleware/auth.middleware')
const { uploadMenuImage, handleMulterError } = require('../middleware/upload.middleware')

const router = express.Router()

// Apply admin authorization middleware to all routes
router.use(authorizeAdmin)

// GET /api/menu - Get all menu items
router.get('/', getAllMenuItems)

// GET /api/menu/:id - Get menu item by ID
router.get('/:id', getMenuItemById)

// POST /api/menu - Create new menu item with image upload
router.post('/', uploadMenuImage, handleMulterError, createMenuItem)

// PUT /api/menu/:id - Update menu item with image upload
router.put('/:id', uploadMenuImage, handleMulterError, updateMenuItem)

// DELETE /api/menu/:id - Delete menu item
router.delete('/:id', deleteMenuItem)

module.exports = router
