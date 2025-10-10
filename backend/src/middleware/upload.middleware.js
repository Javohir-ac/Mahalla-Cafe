const multer = require('multer')
const path = require('path')
const { sendError } = require('../utils/response.utils')

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set upload directory
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  },
})

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed!'), false)
  }
}

// Create upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
})

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return sendError(res, 'File size too large. Maximum allowed size is 5MB.', 400)
    }

    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return sendError(res, 'Unexpected field in form data.', 400)
    }

    return sendError(res, 'File upload error.', 400)
  }

  if (error.message === 'Only image files are allowed!') {
    return sendError(res, 'Only image files are allowed!', 400)
  }

  // Pass error to next middleware if it's not a multer error
  next(error)
}

module.exports = {
  upload,
  handleUploadError,
}
