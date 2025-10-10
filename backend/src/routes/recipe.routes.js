const express = require('express')
const {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipe.controller')

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
router.delete('/:id', deleteRecipe)

module.exports = router
