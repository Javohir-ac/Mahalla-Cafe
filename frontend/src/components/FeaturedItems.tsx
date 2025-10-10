import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { useOrder } from '../contexts/OrderContext'
import { menuService } from '../services/menu.service'
import styles from './FeaturedItems.module.scss'
import MenuCard from './MenuCard'

interface FeaturedItem {
  id: string
  name: string
  description: string
  price: number
  image: string
}

const FeaturedItems: React.FC = () => {
  const { isOrderEnabled } = useOrder()
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([])
  const [loading, setLoading] = useState(true)

  // Load featured items from backend
  useEffect(() => {
    const loadFeaturedItems = async () => {
      try {
        const response = await menuService.getAll()
        if (response.success && Array.isArray(response.data)) {
          // Get first 3 items as featured
          const items = response.data.slice(0, 3) as FeaturedItem[]
          setFeaturedItems(items)
        }
      } catch (error) {
        console.error('Error loading featured items:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedItems()
  }, [])

  // Handle adding item to cart
  const handleAddToCart = (item: { id: string; title: string; price?: string }) => {
    if (!isOrderEnabled) return

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
      // Find the full item data to get the image
      const fullItem = featuredItems.find(menuItem => menuItem.id === item.id)

      cartItems.push({
        id: item.id,
        title: item.title,
        price: item.price || '0',
        quantity: 1,
        image: fullItem?.image || '',
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

  if (loading) {
    return (
      <section className={styles.featuredItems}>
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Maxsus taomlar
        </motion.h2>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Ma'lumotlar yuklanmoqda...
        </motion.p>
      </section>
    )
  }

  return (
    <section className={styles.featuredItems}>
      <motion.h2
        className={styles.title}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Maxsus taomlar
      </motion.h2>
      <motion.p
        className={styles.subtitle}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Eng ommabop taomlarimiz
      </motion.p>

      {featuredItems.length === 0 ? (
        <motion.div
          className={styles.noItemsContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.noItemsContent}>
            <h3 className={styles.noItemsTitle}>Hozircha taomlar mavjud emas</h3>
            <p className={styles.noItemsMessage}>
              Yangi taomlar tez orada qo'shiladi. Iltimos, keyinroq qayta urinib ko'ring!
            </p>
            <div className={styles.noItemsIcon}>🍽️</div>
          </div>
        </motion.div>
      ) : (
        <div className={styles.grid}>
          {featuredItems.map((item, index) => (
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
                image={item.image}
                title={item.name}
                description={item.description}
                price={`$${item.price.toFixed(2)}`}
                onAddToCart={isOrderEnabled ? handleAddToCart : undefined}
                showAddToCart={isOrderEnabled}
              />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}

export default FeaturedItems
