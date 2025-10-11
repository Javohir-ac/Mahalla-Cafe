import { motion } from 'framer-motion'
import { Clock, Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react'
import React, { useState } from 'react'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import { useAlert } from '../contexts/AlertContext'
import styles from '../pages/Home.module.scss'

interface FormData {
  name: string
  email: string
  phone: string
  message: string
}

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addAlert } = useAlert()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

      // Remove trailing slash if present to prevent double slashes in URLs
      const normalizedBaseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL

      const response = await fetch(`${normalizedBaseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          addAlert({
            type: 'success',
            title: 'Muvaffaqiyat!',
            message: '✅ Xabaringiz muvaffaqiyatli yuborildi!',
            duration: 5000,
          })

          // Reset form
          setFormData({
            name: '',
            email: '',
            phone: '',
            message: '',
          })
        } else {
          addAlert({
            type: 'error',
            title: 'Xatolik!',
            message: result.message || 'Xabarni yuborishda xatolik yuz berdi',
            duration: 5000,
          })
        }
      } else {
        addAlert({
          type: 'error',
          title: 'Xatolik!',
          message: 'Xabarni yuborishda xatolik yuz berdi',
          duration: 5000,
        })
      }
    } catch (error) {
      console.error('Xabar yuborishda xatolik:', error)
      addAlert({
        type: 'error',
        title: 'Xatolik!',
        message:
          "Xabarni yuborishda noma'lum xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring.",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.section
      id='contact'
      className={styles.contactSection}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
    >
      <div className={styles.container}>
        <motion.h2
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Aloqa
        </motion.h2>
        <div className={styles.contactContent}>
          <motion.div
            className={styles.contactInfo}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className={styles.contactItem}>
              <MapPin size={24} className={styles.icon} />
              <div>
                <h3>Manzil</h3>
                <p>123 Cafe ko'chasi, Toshkent, O'zbekiston</p>
              </div>
            </div>

            <div className={styles.contactItem}>
              <Phone size={24} className={styles.icon} />
              <div>
                <h3>Telefon</h3>
                <p>+998 90 123 45 67</p>
              </div>
            </div>

            <div className={styles.contactItem}>
              <Mail size={24} className={styles.icon} />
              <div>
                <h3>Email</h3>
                <p>info@mahallacafe.uz</p>
              </div>
            </div>

            <div className={styles.contactItem}>
              <Clock size={24} className={styles.icon} />
              <div>
                <h3>Ish vaqti</h3>
                <p>Dushanba - Juma: 9:00 - 22:00</p>
                <p>Shanba - Yakshanba: 10:00 - 23:00</p>
              </div>
            </div>

            <div className={styles.socialLinks}>
              <h3>Bizni kuzatib boring</h3>
              <div className={styles.icons}>
                <motion.a href='#' whileHover={{ y: -5 }} whileTap={{ scale: 0.9 }}>
                  <Facebook size={24} />
                </motion.a>
                <motion.a href='#' whileHover={{ y: -5 }} whileTap={{ scale: 0.9 }}>
                  <Instagram size={24} />
                </motion.a>
                <motion.a href='#' whileHover={{ y: -5 }} whileTap={{ scale: 0.9 }}>
                  <Twitter size={24} />
                </motion.a>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={styles.contactForm}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor='name'>Ism</label>
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
                <label htmlFor='email'>Email</label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor='phone'>Telefon</label>
                <PhoneInput
                  name='phone'
                  value={formData.phone}
                  onChange={(phone: string) => setFormData(prev => ({ ...prev, phone }))}
                  defaultCountry='uz'
                  className={styles.input}
                  inputClassName={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor='message'>Xabar</label>
                <textarea
                  id='message'
                  name='message'
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <motion.button
                type='submit'
                className={styles.submitButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Yuborilmoqda...' : 'Xabar yuborish'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default ContactSection
