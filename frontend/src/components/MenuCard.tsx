import { motion } from 'framer-motion'
import { Eye, ShoppingCart } from 'lucide-react'
import React, { useState } from 'react'
import ImageLoader from './ImageLoader'
import styles from './MenuCard.module.scss'

interface MenuCardProps {
  id: string
  image: string
  title: string
  description: string
  price?: string
  onAddToCart?: (item: {
    id: string
    title: string
    price?: string
    image: string
  }) => void
  onViewRecipe?: (item: { id: string; title: string; price?: string }) => void
  showAddToCart?: boolean
}

const MenuCard: React.FC<MenuCardProps> = ({
  id,
  image,
  title,
  description,
  price,
  onAddToCart,
  onViewRecipe,
  showAddToCart = true,
}) => {
  const [isAdding, setIsAdding] = useState(false)
  const [buttonText, setButtonText] = useState("Savatchaga qo'shish")

  // Construct full image URL if it's a relative path
  const fullImageUrl = image?.startsWith('/uploads/')
    ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${image}`
    : image

  const handleAddToCart = () => {
    if (isAdding || !onAddToCart) return

    setIsAdding(true)
    setButtonText("Qo'shildi!")
    onAddToCart({ id, title, price, image: fullImageUrl })

    setTimeout(() => {
      setIsAdding(false)
      setButtonText("Savatchaga qo'shish")
    }, 2000)
  }

  const handleViewRecipe = () => {
    if (onViewRecipe) {
      onViewRecipe({ id, title, price })
    }
  }

  return (
    <motion.div
      className={styles.card}
      whileHover={{ y: -15, scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.imageContainer}>
        <ImageLoader src={fullImageUrl} alt={title} className={styles.image} />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>

        <div className={styles.footer}>
          {price && <span className={styles.price}>{price}</span>}
          {showAddToCart ? (
            onAddToCart && (
              <motion.button
                className={styles.addButton}
                whileHover={{
                  scale: 1.1,
                  boxShadow: '0 8px 20px rgba(139, 69, 19, 0.4)',
                  backgroundColor: '#d2691e',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                animate={
                  isAdding
                    ? {
                        scale: [1, 1.2, 1],
                        transition: { duration: 0.3 },
                      }
                    : {}
                }
              >
                <ShoppingCart size={16} style={{ marginRight: '8px' }} />
                {buttonText}
              </motion.button>
            )
          ) : (
            <motion.button
              className={styles.viewButton}
              whileHover={{
                scale: 1.1,
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleViewRecipe}
            >
              <Eye size={16} style={{ marginRight: '8px' }} />
              Retseptni ko'rish
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default MenuCard
