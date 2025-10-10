import { motion } from 'framer-motion'
import { Edit, Eye, Filter, Plus, Search, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'
import { useAlert } from '../contexts/AlertContext'
import { menuService, MenuItem as ServiceMenuItem } from '../services/menu.service'
import styles from './AdminMenu.module.scss'

// Extend the service MenuItem interface with additional properties
interface MenuItem extends ServiceMenuItem {
  availability?: boolean
  image?: string
  imageUrl?: string // Add imageUrl property
}

const AdminMenu: React.FC = () => {
  const { addAlert } = useAlert()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card')
  const [visibleItems, setVisibleItems] = useState<MenuItem[]>([])
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  // Fetch menu items from backend
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true)
        const response = await menuService.getAll()

        if (response.success && response.data) {
          const items = Array.isArray(response.data) ? response.data : [response.data]
          // Add availability property to each item and map imageUrl to image
          const itemsWithAvailability = items.map(item => ({
            ...item,
            id: item._id || item.id || '',
            image: item.imageUrl || item.image || '', // Map imageUrl to image
            availability: true, // Default to available
          }))
          setMenuItems(itemsWithAvailability)
        } else {
          setError('Menyu elementlarini yuklashda xatolik yuz berdi')
          addAlert({
            type: 'error',
            title: 'Xatolik yuz berdi',
            message: 'Menyu elementlarini yuklashda xatolik yuz berdi',
          })
        }
      } catch (err) {
        setError('Menyu elementlarini yuklashda xatolik yuz berdi')
        addAlert({
          type: 'error',
          title: 'Xatolik yuz berdi',
          message: 'Menyu elementlarini yuklashda xatolik yuz berdi',
        })
        console.error('Error fetching menu items:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [addAlert])

  // For wow effect - staggered animation
  useEffect(() => {
    setVisibleItems([])
    const timer = setTimeout(() => {
      setVisibleItems(filteredItems)
    }, 100)
    return () => clearTimeout(timer)
  }, [menuItems, searchQuery, categoryFilter])

  const categories = ['Barchasi', 'Salat', 'Asosiy ovqat', 'Shirinlik', 'Ichimlik']

  const handleAddNewItem = () => {
    setCurrentItem(null)
    setIsEditing(false)
    setIsModalOpen(true)
  }

  const handleEditItem = (item: MenuItem) => {
    setCurrentItem(item)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  const handleViewDetail = (item: MenuItem) => {
    setCurrentItem(item)
    setIsEditing(false)
    setIsModalOpen(true)
  }

  const handleDeleteItem = (id: string) => {
    setItemToDelete(id)
    setIsConfirmDialogOpen(true)
  }

  const confirmDeleteItem = async () => {
    if (!itemToDelete) return

    try {
      const response = await menuService.delete(itemToDelete)

      if (response.success) {
        setMenuItems(menuItems.filter(item => item.id !== itemToDelete))
        addAlert({
          type: 'success',
          title: 'Muvaffaqiyat',
          message: "Menyu elementi o'chirildi",
        })
      } else {
        addAlert({
          type: 'error',
          title: 'Xatolik yuz berdi',
          message: "Menyu elementini o'chirishda xatolik yuz berdi",
        })
      }
    } catch (err) {
      console.error('Error deleting menu item:', err)
      addAlert({
        type: 'error',
        title: 'Xatolik yuz berdi',
        message: "Menyu elementini o'chirishda xatolik yuz berdi",
      })
    } finally {
      setItemToDelete(null)
    }
  }

  const handleSaveItem = async (item: MenuItem, imageFile: File | null) => {
    try {
      let response: any

      if (isEditing && currentItem) {
        // Update existing item
        if (imageFile) {
          // If a new image file is provided, upload it
          const formData = new FormData()
          formData.append('image', imageFile)
          formData.append('name', item.name)
          formData.append('description', item.description)
          formData.append('price', item.price.toString())
          formData.append('category', item.category)

          response = await menuService.updateWithImage(item.id || '', formData)
        } else {
          // No image file, use regular JSON update
          response = await menuService.update(item.id || '', {
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
          })
        }

        if (response.success && response.data) {
          setMenuItems(
            menuItems.map(mi =>
              mi.id === item.id
                ? { ...response.data, availability: item.availability }
                : mi
            )
          )
          addAlert({
            type: 'success',
            title: 'Muvaffaqiyat',
            message: 'Menyu elementi yangilandi',
          })
        } else {
          throw new Error(response.message)
        }
      } else {
        // Add new item
        if (imageFile) {
          // If an image file is provided, upload it with the form data
          const formData = new FormData()
          formData.append('image', imageFile)
          formData.append('name', item.name)
          formData.append('description', item.description)
          formData.append('price', item.price.toString())
          formData.append('category', item.category)

          response = await menuService.createWithImage(formData)
        } else {
          // No image file, use regular JSON create
          response = await menuService.create({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
          })
        }

        if (response.success && response.data) {
          const newItem = {
            ...response.data,
            id: response.data._id || response.data.id,
            availability: item.availability,
          }
          setMenuItems([...menuItems, newItem])
          addAlert({
            type: 'success',
            title: 'Muvaffaqiyat',
            message: "Yangi menyu elementi qo'shildi",
          })
        } else {
          throw new Error(response.message)
        }
      }
      setIsModalOpen(false)
    } catch (err) {
      console.error('Error saving menu item:', err)
      addAlert({
        type: 'error',
        title: 'Xatolik yuz berdi',
        message: 'Menyu elementini saqlashda xatolik yuz berdi',
      })
    }
  }

  const toggleAvailability = (id: string) => {
    setMenuItems(
      menuItems.map(item =>
        item.id === id ? { ...item, availability: !item.availability } : item
      )
    )
  }

  const filteredItems = menuItems.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Menyu elementlari yuklanmoqda...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
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
        <h1>Menyu boshqaruvi</h1>
        <motion.button
          className={styles.addButton}
          onClick={handleAddNewItem}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} />
          Yangi element qo'shish
        </motion.button>
      </motion.div>

      <motion.div
        className={styles.filters}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className={styles.searchContainer}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type='text'
            placeholder='Menyu elementlarini qidirish...'
            className={styles.searchInput}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.filterContainer}>
          <Filter size={20} className={styles.filterIcon} />
          <select
            className={styles.filterSelect}
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            {categories.map((category, index) => (
              <option
                key={`category-${index}`}
                value={category === 'Barchasi' ? 'all' : category}
              >
                {category}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      <motion.div
        className={styles.viewToggle}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <button
          className={`${styles.viewButton} ${viewMode === 'card' ? styles.active : ''}`}
          onClick={() => setViewMode('card')}
        >
          Karta ko'rinishi
        </button>
        <button
          className={`${styles.viewButton} ${viewMode === 'table' ? styles.active : ''}`}
          onClick={() => setViewMode('table')}
        >
          Jadval ko'rinishi
        </button>
      </motion.div>

      {/* Card View */}
      {viewMode === 'card' && (
        <motion.div
          className={styles.menuGrid}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {visibleItems.map((item, index) => (
            <motion.div
              key={item.id || `item-${index}`}
              className={styles.menuCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className={styles.cardImage}>
                <img
                  src={
                    item.imageUrl?.startsWith('/uploads/') // Use imageUrl if available
                      ? `${(
                          process.env.REACT_APP_API_URL || 'http://localhost:5000'
                        ).replace('/api', '')}${item.imageUrl}`
                      : item.image || '/assets/placeholder.jpg' // Fallback to image
                  }
                  alt={item.name}
                />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <h3>{item.name}</h3>
                  <span className={styles.price}>${item.price.toFixed(2)}</span>
                </div>
                <p className={styles.description}>{item.description}</p>
                <div className={styles.cardFooter}>
                  <span
                    className={`${styles.category} ${
                      styles[item.category.toLowerCase().replace(' ', '-')]
                    }`}
                  >
                    {item.category}
                  </span>
                  <div className={styles.actions}>
                    <motion.button
                      className={`${styles.actionButton} ${
                        item.availability ? styles.available : styles.unavailable
                      }`}
                      onClick={() => toggleAvailability(item.id || '')}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {item.availability ? 'Mavjud' : 'Mavjud emas'}
                    </motion.button>
                    <motion.button
                      className={styles.actionButton}
                      onClick={() => handleViewDetail(item)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Eye size={16} />
                    </motion.button>
                    <motion.button
                      className={styles.actionButton}
                      onClick={() => handleEditItem(item)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit size={16} />
                    </motion.button>
                    <motion.button
                      className={styles.actionButton}
                      onClick={() => item.id && handleDeleteItem(item.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <motion.div
          className={styles.tableContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <table className={styles.menuTable}>
            <thead>
              <tr>
                <th>Rasm</th>
                <th>Nomi</th>
                <th>Tavsif</th>
                <th>Narxi</th>
                <th>Kategoriya</th>
                <th>Mavjudligi</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.map((item, index) => (
                <motion.tr
                  key={item.id || `item-table-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td>
                    <div className={styles.tableImage}>
                      <img
                        src={
                          item.imageUrl?.startsWith('/uploads/') // Use imageUrl if available
                            ? `${(
                                process.env.REACT_APP_API_URL || 'http://localhost:5000'
                              ).replace('/api', '')}${item.imageUrl}`
                            : item.image || '/assets/placeholder.jpg' // Fallback to image
                        }
                        alt={item.name}
                      />
                    </div>
                  </td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <span
                      className={`${styles.category} ${
                        styles[item.category.toLowerCase().replace(' ', '-')]
                      }`}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td>
                    <motion.button
                      className={`${styles.toggleButton} ${
                        item.availability ? styles.available : styles.unavailable
                      }`}
                      onClick={() => toggleAvailability(item.id || '')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.availability ? 'Mavjud' : 'Mavjud emas'}
                    </motion.button>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <motion.button
                        className={styles.actionButton}
                        onClick={() => handleViewDetail(item)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Eye size={16} />
                      </motion.button>
                      <motion.button
                        className={styles.actionButton}
                        onClick={() => handleEditItem(item)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit size={16} />
                      </motion.button>
                      <motion.button
                        className={styles.actionButton}
                        onClick={() => item.id && handleDeleteItem(item.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {isModalOpen && (
        <MenuItemModal
          item={currentItem}
          isEditing={isEditing}
          onSave={handleSaveItem}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isConfirmDialogOpen && (
        <ConfirmDialog
          isOpen={isConfirmDialogOpen}
          title="Menyu elementini o'chirish"
          message="Haqiqatan ham bu menyu elementini o'chirmoqchimisiz?"
          onConfirm={confirmDeleteItem}
          onCancel={() => setIsConfirmDialogOpen(false)}
          confirmText="Ha, o'chirish"
          cancelText='Bekor qilish'
        />
      )}
    </motion.div>
  )
}

interface MenuItemModalProps {
  item: MenuItem | null
  isEditing: boolean
  onSave: (item: MenuItem, imageFile: File | null) => void
  onClose: () => void
}

const MenuItemModal: React.FC<MenuItemModalProps> = ({
  item,
  isEditing,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<MenuItem>(
    item || {
      id: '',
      name: '',
      description: '',
      price: 0,
      category: 'Asosiy ovqat',
      image: '',
      availability: true,
    }
  )
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(item?.image || null)

  useEffect(() => {
    if (item) {
      setFormData(item)
      setImagePreview(item.image || null)
    } else {
      setFormData({
        id: '',
        name: '',
        description: '',
        price: 0,
        category: 'Asosiy ovqat',
        image: '',
        availability: true,
      })
      setImagePreview(null)
    }
    setImageFile(null)
  }, [item])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]:
        name === 'price'
          ? parseFloat(value) || 0
          : name === 'availability'
          ? e.target.type === 'checkbox'
            ? (e.target as HTMLInputElement).checked
            : value
          : value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = e => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData, imageFile)
  }

  return (
    <motion.div
      className={styles.modal}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={styles.modalContent}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.modalHeader}>
          <h2>
            {isEditing ? 'Menyu elementini tahrirlash' : "Yangi menyu elementi qo'shish"}
          </h2>
          <motion.button
            className={styles.closeButton}
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ×
          </motion.button>
        </div>
        <form className={styles.modalBody} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor='name'>Nomi</label>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor='description'>Tavsif</label>
            <textarea
              id='description'
              name='description'
              value={formData.description}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor='price'>Narxi ($)</label>
              <input
                type='number'
                id='price'
                name='price'
                value={formData.price}
                onChange={handleChange}
                min='0'
                step='0.01'
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor='category'>Kategoriya</label>
              <select
                id='category'
                name='category'
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value='Salat'>Salat</option>
                <option value='Asosiy ovqat'>Asosiy ovqat</option>
                <option value='Shirinlik'>Shirinlik</option>
                <option value='Ichimlik'>Ichimlik</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor='image'>Rasm</label>
            <input
              type='file'
              id='image'
              name='image'
              accept='image/*'
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className={styles.imagePreview}>
                <img src={imagePreview} alt='Preview' />
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type='checkbox'
                name='availability'
                checked={formData.availability || false}
                onChange={handleChange}
              />
              <span>Mavjud</span>
            </label>
          </div>

          <div className={styles.modalFooter}>
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
              className={styles.saveButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isEditing ? 'Elementni yangilash' : "Element qo'shish"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default AdminMenu
