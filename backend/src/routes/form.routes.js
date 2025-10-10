const express = require('express')
<<<<<<< HEAD
const { handleContactForm } = require('../controllers/form.controller')

const router = express.Router()

// POST /api/contact
router.post('/contact', handleContactForm)
=======
const {
  handleContactSubmission,
  handleOrderSubmission,
  handleReservationSubmission,
  sendTelegramMessageHandler,
} = require('../controllers/form.controller')

const router = express.Router()

// Contact form submission route
router.post('/contact', handleContactSubmission)

// Order form submission route
router.post('/order', handleOrderSubmission)

// Reservation form submission route
router.post('/reservation', handleReservationSubmission)

// Send Telegram message route
router.post('/send-telegram', sendTelegramMessageHandler)
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b

module.exports = router
