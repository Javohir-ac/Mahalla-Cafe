const mongoose = require('mongoose')

const reservationSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },
<<<<<<< HEAD
    customerEmail: {
      type: String,
      trim: true,
    },
=======
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
<<<<<<< HEAD
    numberOfPeople: {
      type: Number,
      required: true,
      min: 1,
    },
    tableNumber: {
      type: Number,
    },
    specialRequests: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
      default: 'Pending',
=======
    numberOfGuests: {
      type: Number,
      required: true,
    },
    tableType: {
      type: String,
      required: true,
      trim: true,
    },
    specialRequests: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Reservation', reservationSchema)
