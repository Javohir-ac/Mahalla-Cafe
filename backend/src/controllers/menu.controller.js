const Menu = require('../models/Menu')
const ActivityLog = require('../models/ActivityLog')
const { sendSuccess, sendError } = require('../utils/response.utils')

// Get all menu items
const getAllMenuItems = async (req, res) => {
  try {
    // Check if category filter is provided
    const filter = {}
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category
    }

    const menuItems = await Menu.find(filter).sort({ createdAt: -1 })
    sendSuccess(res, menuItems, 'Menu items retrieved successfully')
  } catch (error) {
    console.error('Error getting menu items:', error)
    sendError(res, 'Failed to retrieve menu items')
  }
}

// Get menu item by ID
const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id)
    if (!menuItem) {
      return sendError(res, 'Menu item not found', 404)
    }
    sendSuccess(res, menuItem, 'Menu item retrieved successfully')
  } catch (error) {
    console.error('Error getting menu item:', error)
    sendError(res, 'Failed to retrieve menu item')
  }
}

// Create new menu item
const createMenuItem = async (req, res) => {
  try {
    // Handle image upload
    let image = null
    if (req.file) {
      // Create image URL relative to server
      image = `/uploads/${req.file.filename}`
    }

    const menuData = {
      ...req.body,
      image: image,
    }

    const menuItem = new Menu(menuData)
    await menuItem.save()

    // Log activity
    if (req.admin) {
      await ActivityLog.create({
        adminId: req.admin._id,
        adminUsername: req.admin.username,
        action: 'Created menu item',
        entityType: 'Menu',
        entityId: menuItem._id,
        details: `Created menu item: ${menuItem.name}`,
      })
    }

    sendSuccess(res, menuItem, 'Menu item created successfully', 201)
  } catch (error) {
    console.error('Error creating menu item:', error)
    sendError(res, 'Failed to create menu item')
  }
}

// Update menu item
const updateMenuItem = async (req, res) => {
  try {
    // Handle image upload
    let updateData = { ...req.body }

    if (req.file) {
      // Create image URL relative to server
      updateData.image = `/uploads/${req.file.filename}`
    }

    const menuItem = await Menu.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!menuItem) {
      return sendError(res, 'Menu item not found', 404)
    }

    // Log activity
    if (req.admin) {
      await ActivityLog.create({
        adminId: req.admin._id,
        adminUsername: req.admin.username,
        action: 'Updated menu item',
        entityType: 'Menu',
        entityId: menuItem._id,
        details: `Updated menu item: ${menuItem.name}`,
      })
    }

    sendSuccess(res, menuItem, 'Menu item updated successfully')
  } catch (error) {
    console.error('Error updating menu item:', error)
    sendError(res, 'Failed to update menu item')
  }
}

// Delete menu item
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await Menu.findByIdAndDelete(req.params.id)

    if (!menuItem) {
      return sendError(res, 'Menu item not found', 404)
    }

    // Log activity
    if (req.admin) {
      await ActivityLog.create({
        adminId: req.admin._id,
        adminUsername: req.admin.username,
        action: 'Deleted menu item',
        entityType: 'Menu',
        entityId: menuItem._id,
        details: `Deleted menu item: ${menuItem.name}`,
      })
    }

    sendSuccess(res, null, 'Menu item deleted successfully')
  } catch (error) {
    console.error('Error deleting menu item:', error)
    sendError(res, 'Failed to delete menu item')
  }
}

module.exports = {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
}
