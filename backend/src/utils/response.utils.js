<<<<<<< HEAD
// Success response helper
const sendSuccess = (res, data, message = 'Request successful', statusCode = 200) => {
  // Check if headers have already been sent
  if (res.headersSent) {
    console.warn('Headers already sent, cannot send success response')
    return
  }

=======
const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
  res.status(statusCode).json({
    success: true,
    message,
    data,
  })
}

<<<<<<< HEAD
// Error response helper
=======
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
const sendError = (
  res,
  message = 'An error occurred',
  statusCode = 500,
<<<<<<< HEAD
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
=======
  details = null
) => {
  const response = {
    success: false,
    message,
  }

  if (details) {
    response.details = details
  }

  res.status(statusCode).json(response)
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
}

module.exports = {
  sendSuccess,
  sendError,
}
