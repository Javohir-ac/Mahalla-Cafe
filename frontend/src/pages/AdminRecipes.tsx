import { motion } from 'framer-motion'
import { Edit, Plus, Search, Trash2, Utensils } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import AddRecipeForm from '../components/AddRecipeForm'
import { useAlert } from '../contexts/AlertContext'
import { menuService } from '../services/menu.service'
import {
  recipeService,
  RecipeItem as ServiceRecipeItem,
} from '../services/recipe.service'
import styles from './AdminRecipes.module.scss'

// Extend the service RecipeItem interface with additional properties
interface RecipeItem extends ServiceRecipeItem {
  dishName: string
}

// Use the same MenuItem interface as in the service
interface MenuItem {
  id?: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  isAvailable?: boolean
}

interface AddRecipeFormProps {
  onClose: () => void
  onSubmit: (recipe: any) => void
  recipe?: {
    id?: number
    name: string
    dish: string
    prepTime: string
    cookTime: string
    servings: number
    price: number
    description: string
    ingredients: { id: number; name: string; quantity: string }[]
    steps: { id: number; description: string }[]
  } | null
}

const AdminRecipes: React.FC = () => {
  const { addAlert } = useAlert()
  const [searchTerm, setSearchTerm] = useState('')
  const [recipes, setRecipes] = useState<RecipeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])

  // Add the missing state declarations
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null)
  const [recipeData, setRecipeData] = useState<any>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Fetch menu items from MongoDB
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await menuService.getForRecipes()

        if (response.success && response.data) {
          const items = Array.isArray(response.data) ? response.data : [response.data]
          // Ensure all items have an id (use _id if id is missing)
          const validItems = items
            .map(item => ({
              ...item,
              id: item.id || item._id,
            }))
            .filter(item => item.id) // Only filter out items without any ID
          setMenuItems(validItems)
        }
      } catch (err) {
        console.error('Error fetching menu items:', err)
      }
    }

    fetchMenuItems()
  }, [])

  // Fetch recipes from MongoDB
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true)
        const response = await recipeService.getAll()

        if (response.success && response.data) {
          // Transform the data to match the existing interface
          const transformedRecipes = (
            Array.isArray(response.data) ? response.data : [response.data]
          )
            .map(recipe => {
              // Find the dish name for display
              const dishItem = menuItems.find(d => d.id === recipe.dish) || {
                name: 'Unknown Dish',
              }

              // Ensure we have a valid id
              const id = recipe._id || recipe.id || ''

              return {
                ...recipe,
                id: id,
                _id: id,
                dishName: dishItem.name,
              }
            })
            .filter(recipe => recipe.id) // Filter out recipes without id

          setRecipes(transformedRecipes as RecipeItem[])
        } else {
          setError(
            response.message || "Retseptlar ma'lumotlarini yuklashda xatolik yuz berdi"
          )
        }
      } catch (err) {
        setError("Retseptlar ma'lumotlarini yuklashda xatolik yuz berdi")
        console.error('Error fetching recipes:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [menuItems])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentRecipe, setCurrentRecipe] = useState<any>(null)

  const handleEditRecipe = (recipe: RecipeItem) => {
    // Set the current recipe for editing
    setCurrentRecipe({
      id: recipe._id,
      name: recipe.title,
      dish: recipe.dish || '',
      prepTime: recipe.prepTime.toString(),
      cookTime: recipe.cookTime.toString(),
      servings: recipe.servings,
      description: recipe.description,
      ingredients: recipe.ingredients,
      steps: Array.isArray(recipe.instructions)
        ? recipe.instructions.map((desc: string, index: number) => ({
            id: Date.now() + index,
            description: desc,
          }))
        : typeof recipe.instructions === 'string'
        ? recipe.instructions
            .split('\n')
            .filter((line: string) => line.trim() !== '')
            .map((instruction: string, index: number) => ({
              id: Date.now() + index,
              description: instruction,
            }))
        : [],
    })
    setIsModalOpen(true)
  }

  const handleAddRecipe = () => {
    setCurrentRecipe(null)
    setIsModalOpen(true)
  }

  const handleSaveRecipe = async (recipeData: any) => {
    try {
      // Transform the recipe data from AddRecipeForm to match backend requirements
      const transformedRecipe = {
        title: recipeData.name || '',
        description: recipeData.description || '',
        ingredients: recipeData.ingredients
          ? recipeData.ingredients
              .map((ing: { name: string; quantity: string }) => ({
                name: ing.name || '',
                quantity: ing.quantity || '',
              }))
              .filter((ing: { name: string; quantity: string }) => ing.name.trim() !== '')
          : [],
        // Convert array of step descriptions to a single string with line breaks
        instructions: recipeData.steps
          ? recipeData.steps
              .map((step: { description: string }) => step.description || '')
              .filter((desc: string) => desc.trim() !== '')
              .join('\n')
          : '',
        prepTime: parseInt(recipeData.prepTime) || 0,
        cookTime: parseInt(recipeData.cookTime) || 0,
        servings: parseInt(recipeData.servings) || 1,
        category: recipeData.category || 'Boshqa',
        dish: recipeData.dish || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Validate required fields
      if (!transformedRecipe.title.trim()) {
        throw new Error('Recipe title is required')
      }

      if (!transformedRecipe.dish) {
        throw new Error('Please select a dish')
      }

      if (!transformedRecipe.description.trim()) {
        throw new Error('Recipe description is required')
      }

      let response: any
      if (currentRecipe?.id) {
        // Update existing recipe
        response = await recipeService.update(currentRecipe.id, transformedRecipe)

        if (response.success) {
          // Update local state
          setRecipes(
            recipes.map((r: RecipeItem) =>
              r.id === currentRecipe.id
                ? {
                    ...r,
                    title: transformedRecipe.title,
                    description: transformedRecipe.description,
                    ingredients: transformedRecipe.ingredients,
                    instructions: transformedRecipe.instructions,
                    prepTime: transformedRecipe.prepTime,
                    cookTime: transformedRecipe.cookTime,
                    servings: transformedRecipe.servings,
                    category: transformedRecipe.category,
                    dish: transformedRecipe.dish,
                    dishName:
                      menuItems.find(d => d.id === transformedRecipe.dish)?.name ||
                      'Unknown Dish',
                    updatedAt: new Date().toISOString(),
                  }
                : r
            )
          )

          addAlert({
            type: 'success',
            title: 'Retsept yangilandi',
            message: `${recipeData.name} retsepti muvaffaqiyatli yangilandi!`,
            duration: 3000,
          })
        } else {
          throw new Error(response.message)
        }
      } else {
        // Add new recipe
        response = await recipeService.create(transformedRecipe)

        if (response.success && response.data) {
          // Create new recipe object with all required fields
          const newRecipe: RecipeItem = {
            ...(response.data as ServiceRecipeItem),
            id: response.data._id,
            _id: response.data._id,
            dishName:
              menuItems.find(d => d.id === response.data.dish)?.name || 'Unknown Dish',
          }

          // Add to local state
          setRecipes([...recipes, newRecipe])

          addAlert({
            type: 'success',
            title: "Retsept qo'shildi",
            message: `${recipeData.name} retsepti muvaffaqiyatli qo\'shildi!`,
            duration: 3000,
          })
        } else {
          throw new Error(response.message || 'Failed to create recipe')
        }
      }

      setIsModalOpen(false)
    } catch (error: any) {
      console.error('Error saving recipe:', error)
      addAlert({
        type: 'error',
        title: 'Xatolik',
        message: `Retseptni saqlashda xatolik yuz berdi: ${
          error.message || "Noma'lum xatolik"
        }`,
        duration: 5000,
      })
    }
  }

  const handleDeleteRecipe = async (id: string) => {
    try {
      const recipeToDelete = recipes.find(recipe => recipe.id === id)
      if (!recipeToDelete) return

      const response = await recipeService.delete(id)

      if (response.success) {
        setRecipes(recipes.filter(recipe => recipe.id !== id))
        addAlert({
          type: 'success',
          title: "Retsept o'chirildi",
          message: `${recipeToDelete.title} retsepti muvaffaqiyatli o\'chirildi!`,
          duration: 3000,
        })
      } else {
        throw new Error(response.message)
      }
    } catch (error: any) {
      console.error('Error deleting recipe:', error)
      addAlert({
        type: 'error',
        title: 'Xatolik',
        message: `Retseptni o'chirishda xatolik yuz berdi: ${
          error.message || "Noma'lum xatolik"
        }`,
        duration: 5000,
      })
    }
  }

  const filteredRecipes = recipes.filter(
    recipe =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.dishName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Ma'lumotlar yuklanmoqda...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1>Retseptlar boshqaruvi</h1>
        <p>Barcha retseptlarni boshqaring</p>
      </motion.div>

      <motion.div
        className={styles.controls}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className={styles.searchContainer}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type='text'
            placeholder='Retseptlarni qidirish...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <motion.button
          className={styles.addButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddRecipe}
        >
          <Plus size={20} />
          Yangi retsept
        </motion.button>
      </motion.div>

      {/* Desktop Table View */}
      <motion.div
        className={`${styles.tableContainer} ${styles.desktopTable}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <table className={styles.recipesTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nomi</th>
              <th>Taom</th>
              <th>Pishirish vaqti</th>
              <th>Porciyalar</th>
              <th>Yaratilgan sana</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecipes.map((recipe, index) => (
              <motion.tr
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <td>{recipe.id ? recipe.id.substring(0, 8) : ''}...</td>
                <td>{recipe.title}</td>
                <td>{recipe.dishName}</td>
                <td>{recipe.cookTime} min</td>
                <td>{recipe.servings}</td>
                <td>
                  {recipe.createdAt
                    ? new Date(recipe.createdAt).toLocaleDateString()
                    : '-'}
                </td>
                <td>
                  <div className={styles.actions}>
                    <motion.button
                      className={styles.actionButton}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEditRecipe(recipe)}
                    >
                      <Edit size={16} />
                    </motion.button>
                    <motion.button
                      className={styles.actionButton}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => recipe.id && handleDeleteRecipe(recipe.id)}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredRecipes.length === 0 && (
          <div className={styles.emptyState}>
            <p>Retseptlar topilmadi</p>
          </div>
        )}
      </motion.div>

      {/* Mobile Card View */}
      <motion.div
        className={`${styles.recipesGrid} ${styles.mobileCards}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {filteredRecipes.length === 0 ? (
          <motion.div
            className={styles.emptyState}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Utensils size={48} />
            <h3>Retseptlar topilmadi</h3>
            <p>Qidiruv so'rovingizga mos keladigan retseptlar topilmadi.</p>
          </motion.div>
        ) : (
          filteredRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              className={styles.recipeCard}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className={styles.recipeInfo}>
                <h3 className={styles.recipeName}>{recipe.title}</h3>
                <p className={styles.recipeCategory}>{recipe.dishName}</p>
                <div className={styles.recipeMeta}>
                  <span>{recipe.cookTime} min pishirish</span>
                  <span>{recipe.servings} por</span>
                  <span>
                    Yaratilgan:{' '}
                    {recipe.createdAt
                      ? new Date(recipe.createdAt).toLocaleDateString()
                      : '-'}
                  </span>
                </div>
              </div>
              <div className={styles.actions}>
                <motion.button
                  className={styles.editButton}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleEditRecipe(recipe)}
                >
                  <Edit size={16} />
                </motion.button>
                <motion.button
                  className={styles.deleteButton}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => recipe.id && handleDeleteRecipe(recipe.id)}
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {isModalOpen && (
        <AddRecipeForm
          recipe={currentRecipe}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSaveRecipe}
        />
      )}
    </motion.div>
  )
}

export default AdminRecipes
