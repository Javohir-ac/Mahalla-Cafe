const Menu = require('../models/Menu')
<<<<<<< HEAD
=======
const ActivityLog = require('../models/ActivityLog')
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
const { sendSuccess, sendError } = require('../utils/response.utils')

// Get all menu items
const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find().sort({ createdAt: -1 })
<<<<<<< HEAD
    console.log('Menu items retrieved:', menuItems.length)
    sendSuccess(res, menuItems, 'Menu items retrieved successfully')
  } catch (error) {
    console.error('Error getting menu items:', error)
    // Ensure we always return JSON
    sendError(res, 'Failed to retrieve menu items: ' + error.message)
=======
    sendSuccess(res, menuItems, 'Menu items retrieved successfully')
  } catch (error) {
    console.error('Error getting menu items:', error)
    sendError(res, 'Failed to retrieve menu items')
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
  }
}

// Get menu item by ID
const getMenuItemById = async (req, res) => {
  try {
<<<<<<< HEAD
    console.log('Getting menu item by ID:', req.params.id)
    const menuItem = await Menu.findById(req.params.id)
    if (!menuItem) {
      console.log('Menu item not found for ID:', req.params.id)
      return sendError(res, 'Menu item not found', 404)
    }
    console.log('Menu item found:', menuItem.name)
    sendSuccess(res, menuItem, 'Menu item retrieved successfully')
  } catch (error) {
    console.error('Error getting menu item:', error)
    // Ensure we always return JSON
    sendError(res, 'Failed to retrieve menu item: ' + error.message)
=======
    const menuItem = await Menu.findById(req.params.id)
    if (!menuItem) {
      return sendError(res, 'Menu item not found', 404)
    }
    sendSuccess(res, menuItem, 'Menu item retrieved successfully')
  } catch (error) {
    console.error('Error getting menu item:', error)
    sendError(res, 'Failed to retrieve menu item')
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
  }
}

// Create new menu item
const createMenuItem = async (req, res) => {
  try {
<<<<<<< HEAD
    console.log('Creating menu item with data:', req.body)
    console.log('File data:', req.file)
    // Handle image upload
    let imageUrl = '/assets/placeholder.jpg' // Default placeholder image
    if (req.file) {
      // If file is uploaded, use the uploaded file path
      imageUrl = `/uploads/${req.file.filename}`
      console.log('Image uploaded:', imageUrl)
    }

    // Create menu item with image URL
    const menuItemData = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      category: req.body.category,
      imageUrl: imageUrl,
      isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable : true,
    }

    console.log('Menu item data to save:', menuItemData)
    const menuItem = new Menu(menuItemData)
    await menuItem.save()
    console.log('Menu item created successfully:', menuItem.name)
    sendSuccess(res, menuItem, 'Menu item created successfully', 201)
  } catch (error) {
    console.error('Error creating menu item:', error)
    // Ensure we always return JSON
    sendError(res, 'Failed to create menu item: ' + error.message)
=======
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
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
  }
}

// Update menu item
const updateMenuItem = async (req, res) => {
  try {
<<<<<<< HEAD
    console.log('Updating menu item ID:', req.params.id)
    console.log('Update data:', req.body)

    // Prepare update data
    let updateData = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      category: req.body.category,
      isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable : undefined,
    }

    // Handle image upload
    if (req.file) {
      // If file is uploaded, use the uploaded file path
      updateData.imageUrl = `/uploads/${req.file.filename}`
      console.log('Image updated:', updateData.imageUrl)
    }

    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })

    console.log('Update data to apply:', updateData)
=======
    // Handle image upload
    let updateData = { ...req.body }

    if (req.file) {
      // Create image URL relative to server
      updateData.image = `/uploads/${req.file.filename}`
    }

>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
    const menuItem = await Menu.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
<<<<<<< HEAD
    if (!menuItem) {
      console.log('Menu item not found for update:', req.params.id)
      return sendError(res, 'Menu item not found', 404)
    }
    console.log('Menu item updated successfully:', menuItem.name)
    sendSuccess(res, menuItem, 'Menu item updated successfully')
  } catch (error) {
    console.error('Error updating menu item:', error)
    // Ensure we always return JSON
    sendError(res, 'Failed to update menu item: ' + error.message)
=======

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
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
  }
}

// Delete menu item
const deleteMenuItem = async (req, res) => {
  try {
<<<<<<< HEAD
    console.log('Deleting menu item ID:', req.params.id)
    const menuItem = await Menu.findByIdAndDelete(req.params.id)
    if (!menuItem) {
      console.log('Menu item not found for deletion:', req.params.id)
      return sendError(res, 'Menu item not found', 404)
    }
    console.log('Menu item deleted successfully:', menuItem.name)
    sendSuccess(res, null, 'Menu item deleted successfully')
  } catch (error) {
    console.error('Error deleting menu item:', error)
    // Ensure we always return JSON
    sendError(res, 'Failed to delete menu item: ' + error.message)
=======
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
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
  }
}

module.exports = {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
}
