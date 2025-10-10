const Reservation = require('../models/Reservation')
const { sendSuccess, sendError } = require('../utils/response.utils')

// Get all reservations
const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 })
    sendSuccess(res, reservations, 'Reservations retrieved successfully')
  } catch (error) {
    console.error('Error getting reservations:', error)
    sendError(res, 'Failed to retrieve reservations')
  }
}

// Get reservation by ID
const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
    if (!reservation) {
      return sendError(res, 'Reservation not found', 404)
    }
    sendSuccess(res, reservation, 'Reservation retrieved successfully')
  } catch (error) {
    console.error('Error getting reservation:', error)
    sendError(res, 'Failed to retrieve reservation')
  }
}

// Create new reservation
const createReservation = async (req, res) => {
  try {
    const reservation = new Reservation(req.body)
    await reservation.save()
<<<<<<< HEAD
=======

>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
    sendSuccess(res, reservation, 'Reservation created successfully', 201)
  } catch (error) {
    console.error('Error creating reservation:', error)
    sendError(res, 'Failed to create reservation')
  }
}

// Update reservation
const updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
<<<<<<< HEAD
    if (!reservation) {
      return sendError(res, 'Reservation not found', 404)
    }
=======

    if (!reservation) {
      return sendError(res, 'Reservation not found', 404)
    }

>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
    sendSuccess(res, reservation, 'Reservation updated successfully')
  } catch (error) {
    console.error('Error updating reservation:', error)
    sendError(res, 'Failed to update reservation')
  }
}

// Delete reservation
const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id)
<<<<<<< HEAD
    if (!reservation) {
      return sendError(res, 'Reservation not found', 404)
    }
=======

    if (!reservation) {
      return sendError(res, 'Reservation not found', 404)
    }

>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
    sendSuccess(res, null, 'Reservation deleted successfully')
  } catch (error) {
    console.error('Error deleting reservation:', error)
    sendError(res, 'Failed to delete reservation')
  }
}

module.exports = {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
}
