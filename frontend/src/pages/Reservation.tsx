import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import { useAlert } from '../contexts/AlertContext'
import styles from './Reservation.module.scss'

const Reservation: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    tableType: '',
    comment: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addAlert } = useAlert()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
      const message = `
🪑 Yangi rezervatsiya!
👤 Ism: ${formData.fullName}
📞 Telefon: ${formData.phone}
📅 Sana: ${formData.date}
🕒 Vaqt: ${formData.time}
👥 Odamlar soni: ${formData.guests}
🪑 Joy turi: ${formData.tableType}
📝 Izoh: ${formData.comment || "Yo'q"}
      `

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/send-telegram`, {
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
            message: '✅ Stol buyurtmangiz muvaffaqiyatli yuborildi!',
            duration: 5000,
          })
          // Reset form
          setFormData({
            fullName: '',
            phone: '',
            date: '',
            time: '',
            guests: '',
            tableType: '',
            comment: '',
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
      console.error('[Reservation] Submit error:', error)
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

  return (
    <div className={styles.reservation}>
      <div className={styles.container}>
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className={styles.title}>Stol buyurtma qilish</h1>
          <p className={styles.subtitle}>Mahalla Cafega oldindan joy band qiling</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor='fullName' className={styles.label}>
                To'liq ism
              </label>
              <input
                type='text'
                id='fullName'
                name='fullName'
                value={formData.fullName}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor='phone' className={styles.label}>
                Telefon raqami
              </label>
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
              <label htmlFor='date' className={styles.label}>
                Sana
              </label>
              <input
                type='date'
                id='date'
                name='date'
                value={formData.date}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor='time' className={styles.label}>
                Soat
              </label>
              <input
                type='time'
                id='time'
                name='time'
                value={formData.time}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor='guests' className={styles.label}>
                Odamlar soni
              </label>
              <input
                type='number'
                id='guests'
                name='guests'
                value={formData.guests}
                onChange={handleChange}
                className={styles.input}
                min='1'
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor='tableType' className={styles.label}>
                Joy turi
              </label>
              <select
                id='tableType'
                name='tableType'
                value={formData.tableType}
                onChange={handleChange}
                className={styles.select}
                required
              >
                <option value=''>Tanlang</option>
                <option value='inside'>Ichki xona</option>
                <option value='outside'>Tashqari maydon</option>
                <option value='vip'>VIP xona</option>
              </select>
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor='comment' className={styles.label}>
                Izoh (ixtiyoriy)
              </label>
              <textarea
                id='comment'
                name='comment'
                value={formData.comment}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="Maxsus so'rovlaringizni yozing..."
              />
            </div>

            <div className={`${styles.buttonContainer} ${styles.fullWidth}`}>
              <motion.button
                type='submit'
                className={styles.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Yuborilmoqda...' : 'Buyurtma berish'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Reservation
