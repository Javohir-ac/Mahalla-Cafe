import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import React from 'react'
import styles from './MenuFilter.module.scss'

interface Category {
  id: string
  name: string
}

interface MenuFilterProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  categories: Category[]
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

const MenuFilter: React.FC<MenuFilterProps> = ({
  searchTerm,
  setSearchTerm,
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div className={styles.filter}>
      <motion.div
        className={styles.searchContainer}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Search size={20} className={styles.searchIcon} />
        <motion.input
          type='text'
          placeholder='Taomlarni qidirish...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className={styles.searchInput}
          whileFocus={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        />
      </motion.div>

      <motion.div
        className={styles.categories}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            className={`${styles.categoryButton} ${
              selectedCategory === category.id ? styles.active : ''
            }`}
            onClick={() => setSelectedCategory(category.id)}
            whileHover={{
              scale: 1.05,
              y: -5,
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
            }}
          >
            {category.name}
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}

export default MenuFilter
