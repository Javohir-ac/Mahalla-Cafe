import { motion } from 'framer-motion'
import React from 'react'
import styles from './RecipeModal.module.scss'

interface RecipeModalProps {
  recipe: {
    id: string
    name: string
    description: string
    price: number
    category: string
    image: string
  }
  onClose: () => void
  ingredients: string[]
  instructions: string[]
}

const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  onClose,
  ingredients,
  instructions,
}) => {
  if (!recipe) return null

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modal}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 25,
          },
        }}
        exit={{
          scale: 0.9,
          opacity: 0,
          transition: {
            duration: 0.2,
          },
        }}
        onClick={e => e.stopPropagation()}
        whileHover={{
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div className={styles.header}>
          <h2>{recipe.name}</h2>
        </div>

        <div className={styles.form}>
          {recipe.image && (
            <div className={styles.imageContainer}>
              <img src={recipe.image} alt={recipe.name} className={styles.recipeImage} />
            </div>
          )}

          <div className={styles.formGroup}>
            <label>Tavsif</label>
            <p>{recipe.description}</p>
          </div>

          <div className={styles.formGroup}>
            <label>Narxi</label>
            <p>${recipe.price.toFixed(2)}</p>
          </div>

          {ingredients.length > 0 && (
            <div className={styles.formGroup}>
              <label>Ingredientlar</label>
              <ul className={styles.ingredientsList}>
                {ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}

          {instructions.length > 0 && (
            <div className={styles.formGroup}>
              <label>Tayyorlash</label>
              <ol className={styles.instructionsList}>
                {instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <motion.button
            className={styles.saveButton}
            onClick={onClose}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 6px 12px rgba(79, 70, 229, 0.4)',
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Yopish
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default RecipeModal
