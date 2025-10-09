const express = require('express')
const {
  getAllMenuItems,
  getMenuItemById,
  getMenuItemsForRecipes,
} = require('../controllers/menu.controller')
const { getAllRecipes, getRecipeById } = require('../controllers/recipe.controller')

const router = express.Router()

// GET /api/public/menu - Get all menu items (public access)
router.get('/menu', getAllMenuItems)

// GET /api/public/menu/for-recipes - Get menu items for recipe form (public access)
router.get('/menu/for-recipes', getMenuItemsForRecipes)

// GET /api/public/menu/:id - Get menu item by ID (public access)
router.get('/menu/:id', getMenuItemById)

// GET /api/public/recipes - Get all recipes (public access)
router.get('/recipes', getAllRecipes)

// GET /api/public/recipes/:id - Get recipe by ID (public access)
router.get('/recipes/:id', getRecipeById)

module.exports = router
