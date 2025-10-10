const Admin = require('../models/Admin')
const jwt = require('jsonwebtoken')
const { sendSuccess, sendError } = require('../utils/response.utils')

// Admin registration
const registerAdmin = async (req, res) => {
  try {
    const { username, password, secretCode } = req.body

    // Check if secret code is correct
    if (secretCode !== process.env.ADMIN_SECRET_CODE) {
      return sendError(res, 'Invalid secret code', 403)
    }

    // Check if any admin already exists
    const existingAdmin = await Admin.findOne({ role: 'admin' })
    if (existingAdmin) {
      return sendError(res, 'Admin already exists. Registration is disabled.', 403)
    }

    // Check if admin already exists with the same username
    const existingAdminByUsername = await Admin.findOne({ username })
    if (existingAdminByUsername) {
      return sendError(res, 'Username already exists', 400)
    }

    // Create admin user
    const admin = new Admin({
      username,
      password,
      role: 'admin',
    })

    await admin.save()

    // Generate JWT token
    const token = jwt.sign(
      { userId: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    sendSuccess(
      res,
      {
        admin: {
          id: admin._id,
          username: admin.username,
          role: admin.role,
        },
        token,
      },
      'Admin registered successfully',
      201
    )
  } catch (error) {
    console.error('Admin registration error:', error)
    sendError(res, 'Server error during registration')
  }
}

// Admin login
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body

    // Check if admin exists
    const admin = await Admin.findOne({ username })
    if (!admin) {
      return sendError(res, 'Invalid credentials', 401)
    }

    // Validate password
    const isPasswordValid = await admin.comparePassword(password)
    if (!isPasswordValid) {
      return sendError(res, 'Invalid credentials', 401)
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    sendSuccess(
      res,
      {
        admin: {
          id: admin._id,
          username: admin.username,
          role: admin.role,
        },
        token,
      },
      'Login successful'
    )
  } catch (error) {
    console.error('Admin login error:', error)
    sendError(res, 'Server error during login')
  }
}

// Check if any admin exists
const checkAdminExists = async (req, res) => {
  try {
    // Check if any admin user exists in the database
    const adminUser = await Admin.findOne({ role: 'admin' })

    sendSuccess(
      res,
      {
        adminExists: !!adminUser,
      },
      'Admin check completed'
    )
  } catch (error) {
    console.error('Admin check error:', error)
    sendError(res, 'Server error during admin check')
  }
}

module.exports = {
  registerAdmin,
  loginAdmin,
  checkAdminExists,
}
