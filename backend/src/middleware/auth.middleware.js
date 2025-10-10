const jwt = require('jsonwebtoken')
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
}
