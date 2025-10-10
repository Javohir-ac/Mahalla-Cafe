const Admin = require('../models/Admin')
const { sendSuccess, sendError } = require('../utils/response.utils')

// Get all admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password')
    sendSuccess(res, admins, 'Admins retrieved successfully')
  } catch (error) {
    console.error('Error getting admins:', error)
    sendError(res, 'Failed to retrieve admins')
  }
}

// Get admin by ID
const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password')
    if (!admin) {
      return sendError(res, 'Admin not found', 404)
    }
    sendSuccess(res, admin, 'Admin retrieved successfully')
  } catch (error) {
    console.error('Error getting admin:', error)
    sendError(res, 'Failed to retrieve admin')
  }
}

// Create new admin
const createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username })
    if (existingAdmin) {
      return sendError(res, 'Admin already exists', 400)
    }

    const admin = new Admin({ username, password })
    await admin.save()

    sendSuccess(res, admin, 'Admin created successfully', 201)
  } catch (error) {
    console.error('Error creating admin:', error)
    sendError(res, 'Failed to create admin')
  }
}

// Update admin
const updateAdmin = async (req, res) => {
  try {
    const { username, password } = req.body

    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { username, password },
      { new: true, runValidators: true }
    ).select('-password')

    if (!admin) {
      return sendError(res, 'Admin not found', 404)
    }

    sendSuccess(res, admin, 'Admin updated successfully')
  } catch (error) {
    console.error('Error updating admin:', error)
    sendError(res, 'Failed to update admin')
  }
}

// Delete admin
const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id)

    if (!admin) {
      return sendError(res, 'Admin not found', 404)
    }

    sendSuccess(res, null, 'Admin deleted successfully')
  } catch (error) {
    console.error('Error deleting admin:', error)
    sendError(res, 'Failed to delete admin')
  }
}

module.exports = {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
}
