const mongoose = require('mongoose')

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
<<<<<<< HEAD
      min: 0,
=======
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
<<<<<<< HEAD
    imageUrl: {
      type: String,
=======
    image: {
      type: String, // URL to the image
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
      required: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Menu', menuSchema)
