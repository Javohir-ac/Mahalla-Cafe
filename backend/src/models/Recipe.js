const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema(
  {
<<<<<<< HEAD
    name: {
=======
    title: {
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    ingredients: [
      {
<<<<<<< HEAD
        name: String,
        quantity: String,
=======
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: String,
          required: true,
        },
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
      },
    ],
    instructions: {
      type: String,
      required: true,
    },
<<<<<<< HEAD
    prepTime: {
      type: Number, // in minutes
      required: true,
    },
    cookTime: {
      type: Number, // in minutes
=======
    cookTime: {
      type: Number,
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
      required: true,
    },
    servings: {
      type: Number,
      required: true,
    },
<<<<<<< HEAD
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
=======
    image: {
      type: String, // URL to the image
      required: false,
    },
    category: {
      type: String,
      required: true,
      trim: true,
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Recipe', recipeSchema)
