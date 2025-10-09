const multer = require('multer')
const path = require('path')
const { sendError } = require('../utils/response.utils')

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  },
})

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  // Accept images only
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
}
