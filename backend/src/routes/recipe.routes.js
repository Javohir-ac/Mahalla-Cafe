const express = require('express')
const {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipe.controller')
<<<<<<< HEAD

const router = express.Router()

// GET /api/recipes
router.get('/', getAllRecipes)

// GET /api/recipes/:id
router.get('/:id', getRecipeById)

// POST /api/recipes
router.post('/', createRecipe)

// PUT /api/recipes/:id
router.put('/:id', updateRecipe)

// DELETE /api/recipes/:id
=======
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
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
router.delete('/:id', deleteRecipe)

module.exports = router
