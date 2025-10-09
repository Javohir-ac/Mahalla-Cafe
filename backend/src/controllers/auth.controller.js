const User = require('../models/User')
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
    const existingAdmin = await User.findOne({ role: 'admin' })
    if (existingAdmin) {
      return sendError(res, 'Admin already exists. Registration is disabled.', 403)
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return sendError(res, 'Username already exists', 400)
    }

    // Create admin user
    const user = new User({
      username,
      password,
      role: 'admin',
    })

    await user.save()

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    sendSuccess(
      res,
      {
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
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

    // Check if user exists
    const user = await User.findOne({ username })
    if (!user) {
      return sendError(res, 'Invalid credentials', 401)
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return sendError(res, 'Access denied. Admin privileges required.', 403)
    }

    // Validate password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return sendError(res, 'Invalid credentials', 401)
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    sendSuccess(
      res,
      {
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
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
    const adminUser = await User.findOne({ role: 'admin' })

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
