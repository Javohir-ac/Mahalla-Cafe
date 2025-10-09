const express = require('express')
const {
  handleOrderSubmission,
  handleReservationSubmission,
  sendTelegramMessageHandler,
} = require('../controllers/form.controller')

const router = express.Router()

// Order form submission route
router.post('/order', handleOrderSubmission)

// Reservation form submission route
router.post('/reservation', handleReservationSubmission)

// Send Telegram message route
router.post('/send-telegram', sendTelegramMessageHandler)

module.exports = router
