import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminService } from '../services/admin.service'
import { adminCheckService } from '../services/adminCheck.service'
import styles from './AdminRegister.module.scss'

const AdminRegister: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [secretCode, setSecretCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [adminExists, setAdminExists] = useState<boolean | null>(null)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const navigate = useNavigate()

  // Check if admin exists on component mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setCheckingStatus(true)
        const response = await adminCheckService.checkAdminExists()

        if (response.success && response.data) {
          setAdminExists(response.data.adminExists)
          // If admin exists, redirect to login page
          if (response.data.adminExists) {
            navigate('/admin/login')
          }
        } else {
          // Handle error response
          setError(response.message || 'Failed to check admin status')
          setAdminExists(true) // Assume admin exists to prevent registration
        }
      } catch (err) {
        console.error('Error checking admin status:', err)
        setError('Failed to check admin status')
        setAdminExists(true) // Assume admin exists to prevent registration
      } finally {
        setCheckingStatus(false)
      }
    }

    checkAdminStatus()
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await adminService.register({ username, password, secretCode })

      if (response.success && response.data) {
        // Save admin data to localStorage
        const adminData = {
          user: response.data.user,
          token: response.data.token,
        }
        localStorage.setItem('admin', JSON.stringify(adminData))
        // Dispatch event to notify navbar of admin status change
        window.dispatchEvent(new CustomEvent('adminStatusChanged'))
        // Redirect to admin dashboard
        navigate('/admin')
      } else {
        setError(response.message || 'Registration failed')
      }
    } catch (err) {
      setError('Kutilmagan xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  // Show loading state while checking admin status
  if (checkingStatus) {
    return (
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <h2>Tizim holati tekshirilmoqda...</h2>
          <p>Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  // Show error message if there was an error checking admin status
  if (error && adminExists === null) {
    return (
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <h2>Administrator ro'yxatdan o'tish</h2>
          <div className={styles.error}>
            <p>Xatolik yuz berdi: {error}</p>
            <p>Iltimos, sahifani qayta yuklang yoki keyinroq urinib ko'ring.</p>
          </div>
          <div className={styles.loginLink}>
            <Link to='/admin/login'>Kirish sahifasiga o'tish</Link>
          </div>
        </div>
      </div>
    )
  }

  // If admin exists, show message instead of form
  if (adminExists === true) {
    return (
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <h2>Administrator ro'yxatdan o'tish</h2>
          <div className={styles.infoMessage}>
            <p>Tizimda allaqachon administrator mavjud.</p>
            <p>Ro'yxatdan o'tish faqat birinchi administrator uchun mavjud.</p>
            <div className={styles.loginLink}>
              <Link to='/admin/login'>Kirish sahifasiga o'tish</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2>Administrator ro'yxatdan o'tish</h2>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor='username'>Foydalanuvchi nomi</label>
            <input
              type='text'
              id='username'
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor='password'>Parol</label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor='secretCode'>Maxfiy kod</label>
            <input
              type='password'
              id='secretCode'
              value={secretCode}
              onChange={e => setSecretCode(e.target.value)}
              required
            />
          </div>
          <button type='submit' disabled={loading} className={styles.submitButton}>
            {loading ? "Ro'yxatdan o'tish..." : "Ro'yxatdan o'tish"}
          </button>
        </form>
        <div className={styles.loginLink}>
          Hisobingiz bormi? <Link to='/admin/login'>Kirish</Link>
        </div>
      </div>
    </div>
  )
}

export default AdminRegister
