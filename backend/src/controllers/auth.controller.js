<<<<<<< HEAD
const Admin = require('../models/Admin')
=======
const User = require('../models/User')
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
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
<<<<<<< HEAD
    const existingAdmin = await Admin.findOne({ role: 'admin' })
=======
    const existingAdmin = await User.findOne({ role: 'admin' })
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
    if (existingAdmin) {
      return sendError(res, 'Admin already exists. Registration is disabled.', 403)
    }

<<<<<<< HEAD
    // Check if admin already exists with the same username
    const existingAdminByUsername = await Admin.findOne({ username })
    if (existingAdminByUsername) {
=======
    // Check if user already exists
    const existingUser = await User.findOne({ username })
    if (existingUser) {
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
      return sendError(res, 'Username already exists', 400)
    }

    // Create admin user
<<<<<<< HEAD
    const admin = new Admin({
=======
    const user = new User({
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
      username,
      password,
      role: 'admin',
    })

<<<<<<< HEAD
    await admin.save()

    // Generate JWT token
    const token = jwt.sign(
      { userId: admin._id, role: admin.role },
=======
    await user.save()

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    sendSuccess(
      res,
      {
<<<<<<< HEAD
        admin: {
          id: admin._id,
          username: admin.username,
          role: admin.role,
=======
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
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

<<<<<<< HEAD
    // Check if admin exists
    const admin = await Admin.findOne({ username })
    if (!admin) {
      return sendError(res, 'Invalid credentials', 401)
    }

    // Validate password
    const isPasswordValid = await admin.comparePassword(password)
=======
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
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
    if (!isPasswordValid) {
      return sendError(res, 'Invalid credentials', 401)
    }

    // Generate JWT token
    const token = jwt.sign(
<<<<<<< HEAD
      { userId: admin._id, role: admin.role },
=======
      { userId: user._id, role: user.role },
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    sendSuccess(
      res,
      {
<<<<<<< HEAD
        admin: {
          id: admin._id,
          username: admin.username,
          role: admin.role,
=======
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
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
<<<<<<< HEAD
    const adminUser = await Admin.findOne({ role: 'admin' })
=======
    const adminUser = await User.findOne({ role: 'admin' })
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b

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
