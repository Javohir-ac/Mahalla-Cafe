const express = require('express')
const {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
} = require('../controllers/reservation.controller')

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
router.delete('/:id', deleteReservation)

module.exports = router
