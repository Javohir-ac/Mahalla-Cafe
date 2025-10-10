const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
<<<<<<< HEAD
  menuId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    required: true,
  },
  name: {
=======
  title: {
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
<<<<<<< HEAD
    min: 1,
=======
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
  },
  price: {
    type: Number,
    required: true,
<<<<<<< HEAD
    min: 0,
=======
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
  },
})

const orderSchema = new mongoose.Schema(
  {
<<<<<<< HEAD
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
=======
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
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
    deliveryAddress: {
      type: String,
=======
    customerAddress: {
      type: String,
      required: true,
      trim: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
      required: true,
    },
    status: {
      type: String,
<<<<<<< HEAD
      enum: [
        'Pending',
        'Confirmed',
        'Preparing',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
      ],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'Online'],
      required: true,
    },
    notes: {
      type: String,
=======
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Order', orderSchema)
