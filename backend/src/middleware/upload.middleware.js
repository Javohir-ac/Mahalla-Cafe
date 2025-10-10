const multer = require('multer')
const path = require('path')
const { sendError } = require('../utils/response.utils')

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
<<<<<<< HEAD
    // Set upload directory
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    // Generate unique filename
=======
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  },
})

<<<<<<< HEAD
// File filter to accept only images
const fileFilter = (req, file, cb) => {
  // Accept only image files
=======
// File filter to allow only images
const fileFilter = (req, file, cb) => {
  // Accept images only
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
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
<<<<<<< HEAD
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
=======
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
})

// Single file upload middleware for menu images
const uploadMenuImage = upload.single('image')

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return sendError(res, 'File size too large. Maximum 5MB allowed.', 400)
    }
    if (err.code === 'LIMIT_FILE_TYPES') {
      return sendError(res, 'Invalid file type. Only images are allowed.', 400)
    }
  } else if (err) {
    return sendError(res, err.message, 400)
  }
  next()
}

module.exports = {
  uploadMenuImage,
  handleMulterError,
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
}
