const express = require('express')
const {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipe.controller')
const { authorizeAdmin } = require('../middleware/auth.middleware')
const { uploadMenuImage, handleMulterError } = require('../middleware/upload.middleware')

const router = express.Router()

// Apply admin authorization middleware to all routes
router.use(authorizeAdmin)

// GET /api/recipes - Get all recipes
router.get('/', getAllRecipes)

// GET /api/recipes/:id - Get recipe by ID
router.get('/:id', getRecipeById)

// POST /api/recipes - Create new recipe with image upload
router.post('/', uploadMenuImage, handleMulterError, createRecipe)

// PUT /api/recipes/:id - Update recipe with image upload
router.put('/:id', uploadMenuImage, handleMulterError, updateRecipe)

// DELETE /api/recipes/:id - Delete recipe
router.delete('/:id', deleteRecipe)

module.exports = router
