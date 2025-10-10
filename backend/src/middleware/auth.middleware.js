const jwt = require('jsonwebtoken')
<<<<<<< HEAD
const { sendError } = require('../utils/response.utils')

// Authentication middleware
const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.header('Authorization')

    // Check if Authorization header exists
    if (!authHeader) {
      return sendError(res, 'Access denied. No token provided.', 401)
    }

    // Check if header has Bearer token format
    if (!authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Invalid token format. Use Bearer token.', 401)
    }

    // Extract token
    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach user info to request object
    req.user = decoded
    next()
  } catch (error) {
    // Handle token verification errors
    if (error.name === 'JsonWebTokenError') {
      return sendError(res, 'Invalid token.', 401)
    }

    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Token has expired.', 401)
    }

    return sendError(res, 'Authentication error.', 401)
  }
}

// Admin authorization middleware
const adminAuth = (req, res, next) => {
  // First check if user is authenticated
  authMiddleware(req, res, () => {
    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return sendError(res, 'Access denied. Admin privileges required.', 403)
    }

    // User is admin, proceed to next middleware/route handler
    next()
  })
}

module.exports = {
  authMiddleware,
  adminAuth,
=======
const User = require('../models/User')
const { sendError } = require('../utils/response.utils')

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return sendError(res, 'Access denied. No token provided.', 401)
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)

    if (!user) {
      return sendError(res, 'Invalid token.', 401)
    }

    req.user = user
    next()
  } catch (error) {
    console.error('Authentication error:', error)
    sendError(res, 'Invalid token.', 401)
  }
}

const authorizeAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return sendError(res, 'Access denied. No token provided.', 401)
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)

    if (!user) {
      return sendError(res, 'Invalid token.', 401)
    }

    if (user.role !== 'admin') {
      return sendError(res, 'Access denied. Admin privileges required.', 403)
    }

    req.admin = user
    next()
  } catch (error) {
    console.error('Authorization error:', error)
    sendError(res, 'Invalid token.', 401)
  }
}

module.exports = {
  authenticate,
  authorizeAdmin,
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
}
