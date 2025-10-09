import { motion } from 'framer-motion'
import { ArrowLeft, Minus, Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import { Link } from 'react-router-dom'
import ImageLoader from '../components/ImageLoader'
import { useAlert } from '../contexts/AlertContext'
import styles from './Order.module.scss'

interface CartItem {
  id: number
  image: string
  title: string
  description: string
  price?: string
  quantity: number
}

interface OrderFormData {
  fullName: string
  phone: string
  address: string
  orderTime: string
  note: string
}

const Order: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [orderData, setOrderData] = useState<OrderFormData>({
    fullName: '',
    phone: '',
    address: '',
    orderTime: '',
    note: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addAlert } = useAlert()

  useEffect(() => {
    // Load cart items from localStorage
    const loadCartItems = () => {
      try {
        const savedCart = localStorage.getItem('mahallaCart')
        if (savedCart) {
          setCartItems(JSON.parse(savedCart))
        }
      } catch (error) {
        console.error('Error loading cart items:', error)
        // Clear invalid cart data
        localStorage.removeItem('mahallaCart')
      } finally {
        setIsLoading(false)
      }
    }

    loadCartItems()

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCartItems()
    }

    window.addEventListener('cartUpdated', handleCartUpdate as EventListener)

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate as EventListener)
    }
  }, [])

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id)
      return
    }

    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    )

    setCartItems(updatedItems)
    localStorage.setItem('mahallaCart', JSON.stringify(updatedItems))

    // Update navbar cart count
    const totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0)
    const event = new CustomEvent('cartUpdated', { detail: { count: totalItems } })
    window.dispatchEvent(event)
  }

  const removeItem = (id: number) => {
    const updatedItems = cartItems.filter(item => item.id !== id)
    setCartItems(updatedItems)
    localStorage.setItem('mahallaCart', JSON.stringify(updatedItems))

    // Update navbar cart count
    const totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0)
    const event = new CustomEvent('cartUpdated', { detail: { count: totalItems } })
    window.dispatchEvent(event)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setOrderData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    // Validate form
    if (
      !orderData.fullName ||
      !orderData.phone ||
      !orderData.address ||
      !orderData.orderTime
    ) {
      addAlert({
        type: 'error',
        title: "To'ldirishda xatolik!",
        message: "Iltimos, barcha majburiy maydonlarni to'ldiring",
        duration: 5000,
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Format order time for display
      const orderTimeFormatted = new Date(orderData.orderTime).toLocaleString('uz-UZ', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })

      // Format message for Telegram
      // Convert cart items to the format expected by the formatter
      const formattedCartItems = cartItems.map(item => ({
        title: item.title,
        quantity: item.quantity,
        price: parseFloat(item.price?.replace('$', '') || '0'),
      }))

      // Determine if it's for now or later
      const isNow = new Date(orderData.orderTime) <= new Date()
      const orderTimeDisplay = isNow ? 'Hozir' : 'Keyinroq'

      // Create cart details
      let cartDetails = ''
      if (formattedCartItems && formattedCartItems.length > 0) {
        cartDetails = '\n\n🛍️ Buyurtmalar:'
        formattedCartItems.forEach((item, index) => {
          cartDetails += `\n  ${index + 1}. ${item.title} - ${
            item.quantity
          } dona - $${item.price.toFixed(2)}`
        })
      }

      const message = `
📦 Yangi buyurtma!
👤 Ism: ${orderData.fullName}
📞 Telefon: ${orderData.phone}
📍 Manzil: ${orderData.address}
🕒 Buyurtma vaqti: ${orderTimeDisplay} (${orderTimeFormatted})
📝 Maxsus so‘rov: ${orderData.note || "Yo'q"}${cartDetails}
      `

      const BASE_URL =
        process.env.REACT_APP_API_URL ||
        'https://mahalla-cafe-buxorodagi-eng-yaxshi-kafe.onrender.com'

      const response = await fetch(`${BASE_URL}/api/send-telegram`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          addAlert({
            type: 'success',
            title: 'Muvaffaqiyat!',
            message: '✅ Buyurtma muvaffaqiyatli yuborildi!',
            duration: 5000,
          })

          // Clear cart after confirmation
          setCartItems([])
          localStorage.removeItem('mahallaCart')

          // Update navbar cart count
          const event = new CustomEvent('cartUpdated', { detail: { count: 0 } })
          window.dispatchEvent(event)

          // Reset form
          setOrderData({
            fullName: '',
            phone: '',
            address: '',
            orderTime: '',
            note: '',
          })
        } else {
          addAlert({
            type: 'error',
            title: 'Xatolik!',
            message: result.message || 'Buyurtmani yuborishda xatolik yuz berdi',
            duration: 5000,
          })
        }
      } else {
        addAlert({
          type: 'error',
          title: 'Xatolik!',
          message: 'Buyurtmani yuborishda xatolik yuz berdi',
          duration: 5000,
        })
      }
    } catch (error) {
      console.error('[Order] Submit error:', error)
      addAlert({
        type: 'error',
        title: 'Xatolik!',
        message:
          "Buyurtmani yuborishda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring.",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price?.replace('$', '') || '0')
    return sum + price * item.quantity
  }, 0)

  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  if (isLoading) {
    return (
      <div className={styles.order}>
        <div className={styles.container}>
          <div className={styles.loading}>Savatingiz yuklanmoqda...</div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className={styles.order}>
        <div className={styles.container}>
          <motion.div
            className={styles.emptyCart}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Savatingiz bo'sh</h2>
            <p>Siz hali hech qanday mahsulot qo'shmagansiz.</p>
            <Link to='/menu' className={styles.continueShopping}>
              <ArrowLeft size={20} />
              Menyuga qaytish
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.order}>
      <div className={styles.container}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Buyurtmangiz
        </motion.h1>

        {/* Two-column layout */}
        <div className={styles.twoColumnLayout}>
          {/* Left column - Food item details with scrollable container */}
          <div className={styles.foodDetailsContainer}>
            <div className={styles.foodDetailsHeader}>
              <h2>Tanlangan taomlar</h2>
            </div>
            <div className={styles.foodDetailsScroll}>
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className={styles.foodItem}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{
                    y: -5,
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <div className={styles.foodImage}>
                    <ImageLoader src={item.image} alt={item.title} />
                  </div>
                  <div className={styles.foodInfo}>
                    <h3 className={styles.foodTitle}>{item.title}</h3>
                    <p className={styles.foodDescription}>{item.description}</p>
                    <span className={styles.foodPrice}>{item.price}</span>
                  </div>
                  <div className={styles.quantityControl}>
                    <button
                      className={styles.quantityButton}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus size={16} />
                    </button>
                    <span className={styles.quantity}>{item.quantity}</span>
                    <button
                      className={styles.quantityButton}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right column - Order form */}
          <div className={styles.orderForm}>
            <div className={styles.card}>
              <h2>Buyurtma berish</h2>
              <form onSubmit={handleCheckout} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor='fullName' className={styles.label}>
                    Ism *
                  </label>
                  <input
                    type='text'
                    id='fullName'
                    name='fullName'
                    value={orderData.fullName}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor='phone' className={styles.label}>
                    Telefon raqam *
                  </label>
                  <PhoneInput
                    name='phone'
                    value={orderData.phone}
                    onChange={(phone: string) =>
                      setOrderData(prev => ({ ...prev, phone }))
                    }
                    defaultCountry='uz'
                    className={styles.input}
                    inputClassName={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor='address' className={styles.label}>
                    Manzil *
                  </label>
                  <input
                    type='text'
                    id='address'
                    name='address'
                    value={orderData.address}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor='orderTime' className={styles.label}>
                    Buyurtma vaqti *
                  </label>
                  <input
                    type='datetime-local'
                    id='orderTime'
                    name='orderTime'
                    value={orderData.orderTime}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor='note' className={styles.label}>
                    Maxsus so‘rov (ixtiyoriy)
                  </label>
                  <textarea
                    id='note'
                    name='note'
                    value={orderData.note}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    placeholder="Maxsus so'rovlaringizni yozing..."
                    rows={3}
                  />
                </div>

                <div className={styles.summary}>
                  <div className={styles.summaryRow}>
                    <span>Jami:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Soliq (10%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className={`${styles.summaryRow} ${styles.total}`}>
                    <span>Umumiy:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <motion.button
                  type='submit'
                  className={styles.submitButton}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Yuborilmoqda...' : 'Buyurtma berish'}
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Order
