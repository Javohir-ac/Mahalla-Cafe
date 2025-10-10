const express = require('express')
const {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menu.controller')
<<<<<<< HEAD
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
=======
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
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b

module.exports = router
