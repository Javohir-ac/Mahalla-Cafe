const express = require('express')
const {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
} = require('../controllers/reservation.controller')
const { authorizeAdmin } = require('../middleware/auth.middleware')

const router = express.Router()

// Apply admin authorization middleware to all routes
router.use(authorizeAdmin)

// GET /api/reservations - Get all reservations
router.get('/', getAllReservations)

// GET /api/reservations/:id - Get reservation by ID
router.get('/:id', getReservationById)

// POST /api/reservations - Create new reservation
router.post('/', createReservation)

// PUT /api/reservations/:id - Update reservation
router.put('/:id', updateReservation)

// DELETE /api/reservations/:id - Delete reservation
router.delete('/:id', deleteReservation)

module.exports = router
