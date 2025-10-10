// Success response helper
const sendSuccess = (res, data, message = 'Request successful', statusCode = 200) => {
  // Check if headers have already been sent
  if (res.headersSent) {
    console.warn('Headers already sent, cannot send success response')
    return
  }

  res.status(statusCode).json({
    success: true,
    message,
    data,
  })
}

// Error response helper
const sendError = (
  res,
  message = 'An error occurred',
  statusCode = 500,
  error = null
) => {
  // Check if headers have already been sent
  if (res.headersSent) {
    console.warn('Headers already sent, cannot send error response')
    return
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: error ? error.message : undefined,
  })
}

module.exports = {
  sendSuccess,
  sendError,
}
