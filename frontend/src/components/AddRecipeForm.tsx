import { motion } from 'framer-motion'
import { ChefHat, Clock, Plus, Tag, Trash2, Users, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { menuService } from '../services/menu.service'
import styles from './AddRecipeForm.module.scss'

interface Ingredient {
  id: number
  name: string
  quantity: string
}

interface Step {
  id: number
  description: string
}

// Use the same MenuItem interface as in the service
interface MenuItem {
  id?: string
  _id?: string
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
    description: string
    ingredients: { id: number; name: string; quantity: string }[]
    steps: { id: number; description: string }[]
  } | null
}

const AddRecipeForm: React.FC<AddRecipeFormProps> = ({ onClose, onSubmit, recipe }) => {
  const [recipeName, setRecipeName] = useState('')
  const [dish, setDish] = useState('')
  const [prepTime, setPrepTime] = useState('')
  const [cookTime, setCookTime] = useState('')
  const [servings, setServings] = useState(1)
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: Date.now(), name: '', quantity: '' },
  ])
  const [steps, setSteps] = useState<Step[]>([{ id: Date.now(), description: '' }])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loadingMenuItems, setLoadingMenuItems] = useState(true)

  // Fetch menu items from MongoDB
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoadingMenuItems(true)
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
      } finally {
        setLoadingMenuItems(false)
      }
    }

    fetchMenuItems()
  }, [])

  // Initialize form with recipe data if provided (for editing)
  useEffect(() => {
    if (recipe) {
      setRecipeName(recipe.name)
      setDish(recipe.dish)
      setPrepTime(recipe.prepTime)
      setCookTime(recipe.cookTime)
      setServings(recipe.servings)
      setDescription(recipe.description)
      setIngredients(
        recipe.ingredients.length > 0
          ? recipe.ingredients
          : [{ id: Date.now(), name: '', quantity: '' }]
      )
      setSteps(
        recipe.steps.length > 0 ? recipe.steps : [{ id: Date.now(), description: '' }]
      )
    }
  }, [recipe])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!recipeName.trim()) newErrors.recipeName = 'Retsept nomi majburiy'
    if (!dish) newErrors.dish = 'Taom tanlanmadi'
    if (!prepTime.trim()) newErrors.prepTime = 'Tayyorlash vaqti majburiy'
    if (!cookTime.trim()) newErrors.cookTime = 'Pishirish vaqti majburiy'
    if (!description.trim()) newErrors.description = 'Tavsif majburiy'

    // Validate ingredients
    if (ingredients.length === 0 || ingredients.every(i => !i.name.trim())) {
      newErrors.ingredients = 'Kamida bitta ingredient kiriting'
    }

    // Validate steps
    if (steps.length === 0 || steps.every(s => !s.description.trim())) {
      newErrors.steps = 'Kamida bitta tayyorlash bosqichi kiriting'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { id: Date.now(), name: '', quantity: '' }])
  }

  const handleRemoveIngredient = (id: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(ingredient => ingredient.id !== id))
    }
  }

  const handleIngredientChange = (
    id: number,
    field: 'name' | 'quantity',
    value: string
  ) => {
    setIngredients(
      ingredients.map(ingredient =>
        ingredient.id === id ? { ...ingredient, [field]: value } : ingredient
      )
    )
  }

  const handleAddStep = () => {
    setSteps([...steps, { id: Date.now(), description: '' }])
  }

  const handleRemoveStep = (id: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter(step => step.id !== id))
    }
  }

  const handleStepChange = (id: number, value: string) => {
    setSteps(steps.map(step => (step.id === id ? { ...step, description: value } : step)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      const recipeData = {
        id: recipe?.id,
        name: recipeName,
        dish: dish,
        prepTime,
        cookTime,
        servings,
        description,
        ingredients: ingredients.filter(i => i.name.trim() !== ''),
        steps: steps.filter(s => s.description.trim() !== ''),
      }

      onSubmit(recipeData)
    }
  }

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.formContainer}
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <motion.button
          className={styles.closeButton}
          onClick={onClose}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={24} />
        </motion.button>

        <h2 className={styles.title}>
          {recipe ? 'Retseptni tahrirlash' : "Yangi retsept qo'shish"}
        </h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Recipe Name */}
          <div className={styles.formGroup}>
            <label htmlFor='recipeName'>Retsept nomi</label>
            <div className={styles.inputWrapper}>
              <ChefHat size={20} className={styles.inputIcon} />
              <input
                id='recipeName'
                type='text'
                value={recipeName}
                onChange={e => setRecipeName(e.target.value)}
                placeholder='Retsept nomini kiriting'
                className={`${styles.input} ${errors.recipeName ? styles.error : ''}`}
              />
            </div>
            {errors.recipeName && (
              <span className={styles.errorMessage}>{errors.recipeName}</span>
            )}
          </div>

          {/* Dish Selection */}
          <div className={styles.formGroup}>
            <label htmlFor='dish'>Taomni tanlang</label>
            <div className={styles.inputWrapper}>
              <Tag size={20} className={styles.inputIcon} />
              {loadingMenuItems ? (
                <select
                  id='dish'
                  value={dish}
                  onChange={e => setDish(e.target.value)}
                  className={`${styles.select} ${errors.dish ? styles.error : ''}`}
                  disabled
                >
                  <option>Yuklanmoqda...</option>
                </select>
              ) : (
                <select
                  id='dish'
                  value={dish}
                  onChange={e => setDish(e.target.value)}
                  className={`${styles.select} ${errors.dish ? styles.error : ''}`}
                >
                  <option value=''>Taomni tanlang</option>
                  {menuItems.length > 0 ? (
                    menuItems.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))
                  ) : (
<<<<<<< HEAD
                    <option key='no-items'>Taomlar topilmadi</option>
=======
                    <option>Taomlar topilmadi</option>
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
                  )}
                </select>
              )}
            </div>
            {errors.dish && <span className={styles.errorMessage}>{errors.dish}</span>}
          </div>

          {/* Time and Servings */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor='prepTime'>Tayyorlash vaqti</label>
              <div className={styles.inputWrapper}>
                <Clock size={20} className={styles.inputIcon} />
                <input
                  id='prepTime'
                  type='text'
                  value={prepTime}
                  onChange={e => setPrepTime(e.target.value)}
                  placeholder='20 min'
                  className={`${styles.input} ${errors.prepTime ? styles.error : ''}`}
                />
              </div>
              {errors.prepTime && (
                <span className={styles.errorMessage}>{errors.prepTime}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor='cookTime'>Pishirish vaqti</label>
              <div className={styles.inputWrapper}>
                <Clock size={20} className={styles.inputIcon} />
                <input
                  id='cookTime'
                  type='text'
                  value={cookTime}
                  onChange={e => setCookTime(e.target.value)}
                  placeholder='15 min'
                  className={`${styles.input} ${errors.cookTime ? styles.error : ''}`}
                />
              </div>
              {errors.cookTime && (
                <span className={styles.errorMessage}>{errors.cookTime}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor='servings'>Porsiya soni</label>
              <div className={styles.inputWrapper}>
                <Users size={20} className={styles.inputIcon} />
                <input
                  id='servings'
                  type='number'
                  min='1'
                  value={servings}
                  onChange={e => setServings(parseInt(e.target.value) || 1)}
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label htmlFor='description'>Tavsif</label>
            <textarea
              id='description'
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder='Retsept tavsifini kiriting'
              className={`${styles.textarea} ${errors.description ? styles.error : ''}`}
              rows={3}
            />
            {errors.description && (
              <span className={styles.errorMessage}>{errors.description}</span>
            )}
          </div>

          {/* Ingredients */}
          <div className={styles.formGroup}>
            <div className={styles.sectionHeader}>
              <label>Ingredientlar</label>
              <motion.button
                type='button'
                className={styles.addButton}
                onClick={handleAddIngredient}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={16} />
                Qo'shish
              </motion.button>
            </div>
            <div className={styles.ingredientsList}>
              {ingredients.map((ingredient, index) => (
                <motion.div
                  key={ingredient.id}
                  className={styles.ingredientRow}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <input
                    type='text'
                    value={ingredient.name}
                    onChange={e =>
                      handleIngredientChange(ingredient.id, 'name', e.target.value)
                    }
                    placeholder={`Ingredient ${index + 1}`}
                    className={styles.input}
                  />
                  <input
                    type='text'
                    value={ingredient.quantity}
                    onChange={e =>
                      handleIngredientChange(ingredient.id, 'quantity', e.target.value)
                    }
                    placeholder='Miqdori'
                    className={styles.quantityInput}
                  />
                  {ingredients.length > 1 && (
                    <motion.button
                      type='button'
                      className={styles.removeButton}
                      onClick={() => handleRemoveIngredient(ingredient.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </div>
            {errors.ingredients && (
              <span className={styles.errorMessage}>{errors.ingredients}</span>
            )}
          </div>

          {/* Steps */}
          <div className={styles.formGroup}>
            <div className={styles.sectionHeader}>
              <label>Tayyorlash bosqichlari</label>
              <motion.button
                type='button'
                className={styles.addButton}
                onClick={handleAddStep}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={16} />
                Qo'shish
              </motion.button>
            </div>
            <div className={styles.stepsList}>
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  className={styles.stepRow}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className={styles.stepNumber}>{index + 1}</span>
                  <textarea
                    value={step.description}
                    onChange={e => handleStepChange(step.id, e.target.value)}
                    placeholder={`Bosqich ${index + 1}`}
                    className={styles.textarea}
                    rows={2}
                  />
                  {steps.length > 1 && (
                    <motion.button
                      type='button'
                      className={styles.removeButton}
                      onClick={() => handleRemoveStep(step.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </div>
            {errors.steps && <span className={styles.errorMessage}>{errors.steps}</span>}
          </div>

          {/* Action Buttons */}
          <div className={styles.buttonGroup}>
            <motion.button
              type='button'
              className={styles.cancelButton}
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Bekor qilish
            </motion.button>
            <motion.button
              type='submit'
              className={styles.submitButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {recipe ? 'Yangilash' : 'Saqlash'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default AddRecipeForm
