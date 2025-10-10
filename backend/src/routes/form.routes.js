const express = require('express')
const { handleContactForm } = require('../controllers/form.controller')

const router = express.Router()

// POST /api/contact
router.post('/contact', handleContactForm)

module.exports = router
