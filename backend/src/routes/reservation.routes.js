const express = require('express')
const {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
} = require('../controllers/reservation.controller')
<<<<<<< HEAD

const router = express.Router()

// GET /api/reservations
router.get('/', getAllReservations)

// GET /api/reservations/:id
router.get('/:id', getReservationById)

// POST /api/reservations
router.post('/', createReservation)

// PUT /api/reservations/:id
router.put('/:id', updateReservation)

// DELETE /api/reservations/:id
=======
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
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
router.delete('/:id', deleteReservation)

module.exports = router
