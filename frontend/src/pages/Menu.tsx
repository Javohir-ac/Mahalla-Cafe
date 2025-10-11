import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import MenuCard from '../components/MenuCard'
import MenuFilter from '../components/MenuFilter'
import RecipeModal from '../components/RecipeModal'
import { useOrder } from '../contexts/OrderContext'
import { menuService } from '../services/menu.service'
import styles from './Menu.module.scss'

interface MenuPageItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  imageUrl?: string // Add imageUrl property
}

// Category mapping from client-side IDs to backend category names
const CATEGORY_MAPPING: Record<string, string> = {
  all: '',
  main: 'Asosiy ovqat',
  salad: 'Salat',
  dessert: 'Shirinlik',
  drink: 'Ichimlik',
}

// Recipe details data
const recipeDetails: Record<string, { ingredients: string[]; instructions: string[] }> = {
  // This will be replaced with data from the backend
}

const Menu: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedRecipe, setSelectedRecipe] = useState<MenuPageItem | null>(null)
  const { isOrderEnabled } = useOrder()
  const [menuItems, setMenuItems] = useState<MenuPageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load menu items from backend
  const loadMenuItems = async (category?: string) => {
    try {
      setLoading(true)
      // Map client-side category ID to backend category name
      const backendCategory =
        category && CATEGORY_MAPPING[category] ? CATEGORY_MAPPING[category] : category
      const response = await menuService.getAll(backendCategory)
      if (response.success && Array.isArray(response.data)) {
        // Map imageUrl to image for compatibility
        const itemsWithImage = response.data.map(item => ({
          ...item,
          image: item.imageUrl || item.image || '', // Use imageUrl or fallback to image
        }))
        setMenuItems(itemsWithImage as MenuPageItem[])
      } else {
        setError('Menyu elementlarini yuklab bo`lmadi')
      }
    } catch (err) {
      setError('Menyu elementlarini yuklab bo`lmadi')
      console.error('Error loading menu items:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load menu items when component mounts or category changes
  useEffect(() => {
    loadMenuItems(selectedCategory)
  }, [selectedCategory])

  // Handle search term changes
  useEffect(() => {
    // Only apply client-side search filtering if we have items
    // Server-side category filtering is already applied
  }, [searchTerm])

  const categories = [
    { id: 'all', name: 'Barcha taomlar' },
    { id: 'main', name: 'Asosiy taomlar' },
    { id: 'salad', name: 'Salatlar' },
    { id: 'dessert', name: 'Shirinliklar' },
    { id: 'drink', name: 'Ichimliklar' },
  ]

  // Filter items based on search term only (category filtering is done server-side)
  const filteredItems = menuItems.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  // Handle adding item to cart
  const handleAddToCart = (item: {
    id: string
    title: string
    price?: string
    image: string
  }) => {
    // Get current cart from localStorage
    const currentCart = localStorage.getItem('mahallaCart')
    const cartItems = currentCart ? JSON.parse(currentCart) : []

    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(
      (cartItem: any) => cartItem.id === item.id
    )

    if (existingItemIndex >= 0) {
      // If item exists, increment quantity
      cartItems[existingItemIndex].quantity += 1
    } else {
      // If item doesn't exist, add new item
      cartItems.push({
        ...item,
        quantity: 1,
      })
    }

    // Save updated cart to localStorage
    localStorage.setItem('mahallaCart', JSON.stringify(cartItems))

    // Dispatch cart update event
    const totalItems = cartItems.reduce(
      (total: number, item: any) => total + item.quantity,
      0
    )
    const event = new CustomEvent('cartUpdated', { detail: { count: totalItems } })
    window.dispatchEvent(event)
  }

  // Handle viewing recipe details
  const handleViewRecipe = (item: MenuPageItem) => {
    setSelectedRecipe(item)
  }

  // Handle closing the modal
  const handleCloseModal = () => {
    setSelectedRecipe(null)
  }

  if (loading) {
    return (
      <div className={styles.menu}>
        <div className={styles.loading}>Menyu elementlari yuklanmoqda...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.menu}>
        <div className={styles.error}>{error}</div>
      </div>
    )
  }

  return (
    <div className={styles.menu}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          type: 'spring',
          stiffness: 100,
        }}
      >
        <motion.h1
          className={styles.title}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.3,
          }}
        >
          Bizning menyumiz
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.5,
          }}
        >
          Mazali taomlarimiz bilan tanishing
        </motion.p>
      </motion.div>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <MenuFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <motion.div
          className={styles.menuGrid}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          {filteredItems.length === 0 ? (
            <motion.div
              className={styles.noResults}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.noItemsContainer}>
                <h3 className={styles.noItemsTitle}>Hozircha taomlar mavjud emas</h3>
                <p className={styles.noItemsMessage}>
                  Yangi taomlar tez orada qo'shiladi. Iltimos, keyinroq qayta urinib
                  ko'ring!
                </p>
                <div className={styles.noItemsIcon}>🍽️</div>
              </div>
            </motion.div>
          ) : (
            filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 100,
                }}
              >
                <MenuCard
                  id={item.id}
                  image={
                    item.imageUrl?.startsWith('/uploads/') // Use imageUrl if available
                      ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${
                          item.imageUrl
                        }`
                      : item.image?.startsWith('/uploads/')
                      ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${
                          item.image
                        }`
                      : item.image || '' // Fallback to image
                  }
                  title={item.name}
                  description={item.description}
                  price={`$${item.price.toFixed(2)}`}
                  onAddToCart={isOrderEnabled ? handleAddToCart : undefined}
                  onViewRecipe={isOrderEnabled ? undefined : () => handleViewRecipe(item)}
                  showAddToCart={isOrderEnabled}
                />
              </motion.div>
            ))
          )}
        </motion.div>
      </motion.div>
      {/* Recipe Detail Modal */}{' '}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={handleCloseModal}
          ingredients={recipeDetails[selectedRecipe.id]?.ingredients || []}
          instructions={recipeDetails[selectedRecipe.id]?.instructions || []}
        />
      )}
    </div>
  )
}

export default Menu
