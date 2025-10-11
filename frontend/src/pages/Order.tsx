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
  id: string
  image: string
  title: string
  description: string
  price?: string
  quantity: number
}

interface OrderFormData {
  name: string
  phone: string
  address: string
  product: string
  note: string
  cartItems: any[]
}

const Order: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [orderData, setOrderData] = useState<Omit<OrderFormData, 'cartItems'>>({
    name: '',
    phone: '',
    address: '',
    product: '',
    note: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addAlert } = useAlert()

  useEffect(() => {
    const loadCartItems = () => {
      try {
        const savedCart = localStorage.getItem('mahallaCart')
        if (savedCart) {
          setCartItems(JSON.parse(savedCart))
        }
      } catch (error) {
        console.error('Error loading cart items:', error)
        localStorage.removeItem('mahallaCart')
      } finally {
        setIsLoading(false)
      }
    }

    loadCartItems()
    const handleCartUpdate = () => loadCartItems()
    window.addEventListener('cartUpdated', handleCartUpdate as EventListener)

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate as EventListener)
    }
  }, [])

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id)
      return
    }
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    )
    setCartItems(updatedItems)
    localStorage.setItem('mahallaCart', JSON.stringify(updatedItems))
    const totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0)
    window.dispatchEvent(
      new CustomEvent('cartUpdated', { detail: { count: totalItems } })
    )
  }

  const removeItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id)
    setCartItems(updatedItems)
    localStorage.setItem('mahallaCart', JSON.stringify(updatedItems))
    const totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0)
    window.dispatchEvent(
      new CustomEvent('cartUpdated', { detail: { count: totalItems } })
    )
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setOrderData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderData.name || !orderData.phone || !orderData.address) {
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
      const formattedCartItems = cartItems.map(item => ({
        title: item.title,
        quantity: item.quantity,
        price: parseFloat(item.price?.replace('$', '') || '0'),
      }))

      const orderPayload = {
        name: orderData.name,
        phone: orderData.phone,
        address: orderData.address,
        product: cartItems.map(item => item.title).join(', '),
        note: orderData.note,
        cartItems: formattedCartItems,
      }

      const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

      // Remove trailing slash if present to prevent double slashes in URLs
      const normalizedBaseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL

      const response = await fetch(`${normalizedBaseUrl}/api/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
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

          setCartItems([])
          localStorage.removeItem('mahallaCart')
          window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { count: 0 } }))
          setOrderData({ name: '', phone: '', address: '', product: '', note: '' })
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

  const tax = subtotal * 0.1
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

        <div className={styles.twoColumnLayout}>
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
                    <ImageLoader
                      src={
                        item.image?.startsWith('/uploads/')
                          ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${
                              item.image
                            }`
                          : item.image || ''
                      }
                      alt={item.title}
                    />
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

          <div className={styles.orderForm}>
            <div className={styles.card}>
              <h2>Buyurtma berish</h2>
              <form onSubmit={handleCheckout} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor='name' className={styles.label}>
                    Ism *
                  </label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={orderData.name}
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
