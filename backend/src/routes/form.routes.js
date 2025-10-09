const express = require('express')
const {
  handleOrderSubmission,
  handleReservationSubmission,
} = require('../controllers/form.controller')

const router = express.Router()

// Order form submission route
router.post('/order', handleOrderSubmission)

// Reservation form submission route
router.post('/reservation', handleReservationSubmission)

module.exports = router
