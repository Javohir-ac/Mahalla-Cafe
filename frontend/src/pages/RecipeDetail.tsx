import { motion } from 'framer-motion'
import { ArrowLeft, Clock, DollarSign, Utensils } from 'lucide-react'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './RecipeDetail.module.scss'

// Mock data - in a real app this would come from an API
const recipes = [
  {
    id: 1,
    name: 'Mol go`shtidan steyk',
    description: 'Tayyorlovda sabzavotlar bilan mol go`shtidan mazali steyk',
    price: 18.99,
    category: 'Asosiy taomlar',
    image: 'steak.jpg',
    prepTime: '20 min',
    cookTime: '15 min',
    servings: 1,
    ingredients: [
      '500g mol go`shti',
      '2 ta pomidor',
      '1 ta bodring',
      'Yarim piyoz',
      '2 ta sarimsoq',
      'Tuz, qalampir',
      'Ziravorlar',
    ],
    instructions: [
      'Go`shtni tozalab tayyorlang',
      'Ziravorlar bilan marinada qiling',
      'Grilda 10 daqiqa pishiring',
      'Sabzavotlarni yoniga qo`shib beriladi',
    ],
  },
  {
    id: 2,
    name: 'Sezar salati',
    description: 'Sezar sousi bilan yangi romen salati',
    price: 12.99,
    category: 'Salatlar',
    image: 'salad.jpg',
    prepTime: '15 min',
    cookTime: '0 min',
    servings: 1,
    ingredients: [
      'Romen salati',
      'Tovuq gursagi',
      'Parmezan pishloqi',
      'Croutonlar',
      'Sezar sousi',
    ],
    instructions: [
      'Barcha ingredientlarni aralashtiring',
      'Sezar sousini qo`shing',
      'Parmezan bilan sezing',
      'Darhol xizmat qiling',
    ],
  },
  {
    id: 3,
    name: 'Shokoladli tort',
    description: 'Vanil shirin yo`g`i bilan boy shokoladli tort',
    price: 8.99,
    category: 'Shirinliklar',
    image: 'cake.jpg',
    prepTime: '30 min',
    cookTime: '45 min',
    servings: 8,
    ingredients: [
      '200g shokolad',
      '150g sariyog`',
      '4 ta tuxum',
      '100g shakar',
      '100g un',
      'Vanil',
    ],
    instructions: [
      'Barcha quruq ingredientlarni aralashtiring',
      'Sariyog`ni eriting va qo`shing',
      '180°C da 45 daqiqa pishiring',
      'Soviganidan keyin bezating',
    ],
  },
]

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Find the recipe by ID
  const recipe = recipes.find(r => r.id === parseInt(id || '0'))

  if (!recipe) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h2>Retsept topilmadi</h2>
          <p>Ushbu ID bilan retsept topilmadi.</p>
          <button className={styles.backButton} onClick={() => navigate('/menu')}>
            <ArrowLeft size={20} />
            Menyuga qaytish
          </button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        className={styles.backButton}
        onClick={() => navigate('/menu')}
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={20} />
        Orqaga
      </motion.button>

      <motion.div
        className={styles.recipeHeader}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className={styles.imageContainer}>
          <img src={recipe.image} alt={recipe.name} className={styles.recipeImage} />
        </div>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>{recipe.name}</h1>
          <p className={styles.description}>{recipe.description}</p>

          <div className={styles.metaInfo}>
            <div className={styles.metaItem}>
              <Clock size={20} />
              <span>{recipe.prepTime} tayyorlash</span>
            </div>
            <div className={styles.metaItem}>
              <Clock size={20} />
              <span>{recipe.cookTime} pishirish</span>
            </div>
            <div className={styles.metaItem}>
              <Utensils size={20} />
              <span>{recipe.servings} por</span>
            </div>
            <div className={styles.metaItem}>
              <DollarSign size={20} />
              <span>${recipe.price.toFixed(2)}</span>
            </div>
          </div>

          <div className={styles.category}>
            <span>{recipe.category}</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        className={styles.recipeContent}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className={styles.ingredientsSection}>
          <h2>Ingredientlar</h2>
          <ul className={styles.ingredientsList}>
            {recipe.ingredients.map((ingredient, index) => (
              <motion.li
                key={index}
                className={styles.ingredientItem}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              >
                {ingredient}
              </motion.li>
            ))}
          </ul>
        </div>

        <div className={styles.instructionsSection}>
          <h2>Tayyorlash</h2>
          <ol className={styles.instructionsList}>
            {recipe.instructions.map((instruction, index) => (
              <motion.li
                key={index}
                className={styles.instructionStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              >
                {instruction}
              </motion.li>
            ))}
          </ol>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default RecipeDetail
