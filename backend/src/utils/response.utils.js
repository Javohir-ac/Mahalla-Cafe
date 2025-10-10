const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  })
}

const sendError = (
  res,
  message = 'An error occurred',
  statusCode = 500,
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
}

module.exports = {
  sendSuccess,
  sendError,
}