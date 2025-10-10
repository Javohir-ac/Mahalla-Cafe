import { AnimatePresence, motion } from 'framer-motion'
import React, { useRef, useState } from 'react'
import styles from './RecipeModal.module.scss'

interface Ingredient {
  id: string
  name: string
  quantity: string
}

interface InstructionStep {
  id: string
  description: string
}

interface RecipeCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (recipeData: any) => void
}

const RecipeCreationModal: React.FC<RecipeCreationModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: Date.now().toString(), name: '', quantity: '' },
  ])
  const [instructions, setInstructions] = useState<InstructionStep[]>([
    { id: Date.now().toString(), description: '' },
  ])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = event => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Ingredient handlers
  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: Date.now().toString(), name: '', quantity: '' },
    ])
  }

  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(ingredient => ingredient.id !== id))
    }
  }

  const updateIngredient = (id: string, field: 'name' | 'quantity', value: string) => {
    setIngredients(
      ingredients.map(ingredient =>
        ingredient.id === id ? { ...ingredient, [field]: value } : ingredient
      )
    )
  }

  // Instruction handlers
  const addInstruction = () => {
    setInstructions([...instructions, { id: Date.now().toString(), description: '' }])
  }

  const removeInstruction = (id: string) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter(instruction => instruction.id !== id))
    }
  }

  const updateInstruction = (id: string, value: string) => {
    setInstructions(
      instructions.map(instruction =>
        instruction.id === id ? { ...instruction, description: value } : instruction
      )
    )
  }

  const handleSave = async () => {
    if (!name || !description || !price || !quantity) {
      alert("❌ Iltimos, barcha maydonlarni to'ldiring")
      return
    }

    // Validate ingredients
    const hasEmptyIngredients = ingredients.some(
      ing => !ing.name.trim() || !ing.quantity.trim()
    )
    if (hasEmptyIngredients) {
      alert("❌ Iltimos, barcha ingredientlar maydonlarini to'ldiring")
      return
    }

    // Validate instructions
    const hasEmptyInstructions = instructions.some(step => !step.description.trim())
    if (hasEmptyInstructions) {
      alert("❌ Iltimos, barcha tayyorlash bosqichlarini to'ldiring")
      return
    }

    setIsSaving(true)

    const recipeData = {
      name,
      description,
      price,
      quantity,
      ingredients,
      instructions,
      image,
    }

    try {
      await onSave(recipeData)
      // Reset form after successful save
      setName('')
      setDescription('')
      setPrice('')
      setQuantity('')
      setIngredients([{ id: Date.now().toString(), name: '', quantity: '' }])
      setInstructions([{ id: Date.now().toString(), description: '' }])
      setImage(null)
      setImagePreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      alert('✅ Taom muvaffaqiyatli qo‘shildi')
    } catch (error) {
      alert(`❌ Xatolik yuz berdi: ${error}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Reset form
    setName('')
    setDescription('')
    setPrice('')
    setQuantity('')
    setIngredients([{ id: Date.now().toString(), name: '', quantity: '' }])
    setInstructions([{ id: Date.now().toString(), description: '' }])
    setImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCancel}
        >
          <motion.div
            className={styles.modal}
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: 'spring',
                stiffness: 400,
                damping: 30,
              },
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.95,
              transition: {
                duration: 0.2,
              },
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.header}>
              <h2>Yangi retsept qo‘shish</h2>
              <button className={styles.closeButton} onClick={handleCancel}>
                ✕
              </button>
            </div>

            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor='name'>Taom nomi</label>
                <motion.input
                  type='text'
                  id='name'
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder='Taom nomini kiriting'
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor='description'>Tavsif</label>
                <motion.textarea
                  id='description'
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder='Taom tavsifini kiriting'
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor='price'>Narxi (so‘mda)</label>
                <motion.input
                  type='number'
                  id='price'
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder='Narxni kiriting'
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor='quantity'>Miqdori (dona yoki porsiya)</label>
                <div className={styles.quantityInput}>
                  <motion.input
                    type='number'
                    id='quantity'
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    placeholder='Miqdorni kiriting'
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  />
                </div>
              </div>

              {/* Ingredients Section */}
              <div className={styles.formGroup}>
                <div className={styles.sectionHeader}>
                  <label>Ingredientlar</label>
                  <motion.button
                    type='button'
                    className={styles.addButton}
                    onClick={addIngredient}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    + Ingredient qo'shish
                  </motion.button>
                </div>

                <div className={styles.ingredientsList}>
                  {ingredients.map((ingredient, index) => (
                    <motion.div
                      key={ingredient.id}
                      className={styles.ingredientItem}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={styles.ingredientInputs}>
                        <input
                          type='text'
                          placeholder='Ingredient nomi'
                          value={ingredient.name}
                          onChange={e =>
                            updateIngredient(ingredient.id, 'name', e.target.value)
                          }
                        />
                        <input
                          type='text'
                          placeholder='Miqdori'
                          value={ingredient.quantity}
                          onChange={e =>
                            updateIngredient(ingredient.id, 'quantity', e.target.value)
                          }
                        />
                      </div>
                      {ingredients.length > 1 && (
                        <motion.button
                          type='button'
                          className={styles.removeButton}
                          onClick={() => removeIngredient(ingredient.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          ✕
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Instructions Section */}
              <div className={styles.formGroup}>
                <div className={styles.sectionHeader}>
                  <label>Tayyorlash bosqichlari</label>
                  <motion.button
                    type='button'
                    className={styles.addButton}
                    onClick={addInstruction}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    + Bosqich qo'shish
                  </motion.button>
                </div>

                <div className={styles.instructionsList}>
                  {instructions.map((step, index) => (
                    <motion.div
                      key={step.id}
                      className={styles.instructionItem}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={styles.stepNumber}>{index + 1}</div>
                      <div className={styles.stepContent}>
                        <textarea
                          placeholder='Bosqich tavsifi'
                          value={step.description}
                          onChange={e => updateInstruction(step.id, e.target.value)}
                        />
                      </div>
                      {instructions.length > 1 && (
                        <motion.button
                          type='button'
                          className={styles.removeButton}
                          onClick={() => removeInstruction(step.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          ✕
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Rasm tanlash</label>
                <motion.div
                  className={styles.fileInputWrapper}
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <input
                    type='file'
                    ref={fileInputRef}
                    className={styles.fileInput}
                    accept='image/*'
                    onChange={handleImageChange}
                  />
                  <div className={styles.iconContainer}>
                    <svg
                      width='30'
                      height='30'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M4 19V5C4 3.89543 4.89543 3 6 3H18C19.1046 3 20 3.89543 20 5V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19Z'
                        stroke='#4F46E5'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <path
                        d='M8 10C8 11.1046 8.89543 12 10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10Z'
                        stroke='#4F46E5'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <path
                        d='M20 15L15 10L5 20'
                        stroke='#4F46E5'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </div>
                  <div className={styles.fileInputLabel}>
                    Rasmni tanlash uchun <span>bosing</span> yoki <span>suring</span>
                  </div>
                </motion.div>

                {imagePreview && (
                  <motion.img
                    src={imagePreview}
                    alt='Preview'
                    className={styles.previewImage}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            </div>

            <div className={styles.actions}>
              <motion.button
                className={styles.saveButton}
                onClick={handleSave}
                disabled={isSaving}
                whileHover={{
                  y: isSaving ? 0 : -3,
                }}
                whileTap={{ scale: 0.98 }}
              >
                {isSaving ? 'Saqlanmoqda...' : 'Saqlash'}
              </motion.button>
              <motion.button
                className={styles.cancelButton}
                onClick={handleCancel}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                Bekor qilish
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default RecipeCreationModal
