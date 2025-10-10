const Recipe = require('../models/Recipe')
const ActivityLog = require('../models/ActivityLog')
const { sendSuccess, sendError } = require('../utils/response.utils')

// Get all recipes
const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 })
    sendSuccess(res, recipes, 'Recipes retrieved successfully')
  } catch (error) {
    console.error('Error getting recipes:', error)
    sendError(res, 'Failed to retrieve recipes')
  }
}

// Get recipe by ID
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
    if (!recipe) {
      return sendError(res, 'Recipe not found', 404)
    }
    sendSuccess(res, recipe, 'Recipe retrieved successfully')
  } catch (error) {
    console.error('Error getting recipe:', error)
    sendError(res, 'Failed to retrieve recipe')
  }
}

// Create new recipe
const createRecipe = async (req, res) => {
  try {
    // Handle image upload
    let image = null
    if (req.file) {
      // Create image URL relative to server
      image = `/uploads/${req.file.filename}`
    }

    const recipeData = {
      ...req.body,
      image: image,
    }

    const recipe = new Recipe(recipeData)
    await recipe.save()

    // Log activity
    if (req.admin) {
      await ActivityLog.create({
        adminId: req.admin._id,
        adminUsername: req.admin.username,
        action: 'Created recipe',
        entityType: 'Recipe',
        entityId: recipe._id,
        details: `Created recipe: ${recipe.title}`,
      })
    }

    sendSuccess(res, recipe, 'Recipe created successfully', 201)
  } catch (error) {
    console.error('Error creating recipe:', error)
    sendError(res, 'Failed to create recipe')
  }
}

// Update recipe
const updateRecipe = async (req, res) => {
  try {
    // Handle image upload
    let updateData = { ...req.body }

    if (req.file) {
      // Create image URL relative to server
      updateData.image = `/uploads/${req.file.filename}`
    }

    const recipe = await Recipe.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!recipe) {
      return sendError(res, 'Recipe not found', 404)
    }

    // Log activity
    if (req.admin) {
      await ActivityLog.create({
        adminId: req.admin._id,
        adminUsername: req.admin.username,
        action: 'Updated recipe',
        entityType: 'Recipe',
        entityId: recipe._id,
        details: `Updated recipe: ${recipe.title}`,
      })
    }

    sendSuccess(res, recipe, 'Recipe updated successfully')
  } catch (error) {
    console.error('Error updating recipe:', error)
    sendError(res, 'Failed to update recipe')
  }
}

// Delete recipe
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id)

    if (!recipe) {
      return sendError(res, 'Recipe not found', 404)
    }

    // Log activity
    if (req.admin) {
      await ActivityLog.create({
        adminId: req.admin._id,
        adminUsername: req.admin.username,
        action: 'Deleted recipe',
        entityType: 'Recipe',
        entityId: recipe._id,
        details: `Deleted recipe: ${recipe.title}`,
      })
    }

    sendSuccess(res, null, 'Recipe deleted successfully')
  } catch (error) {
    console.error('Error deleting recipe:', error)
    sendError(res, 'Failed to delete recipe')
  }
}

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
}