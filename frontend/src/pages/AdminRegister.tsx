<<<<<<< HEAD
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'
=======
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminService } from '../services/admin.service'
import { adminCheckService } from '../services/adminCheck.service'
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
import styles from './AdminRegister.module.scss'

const AdminRegister: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [secretCode, setSecretCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
<<<<<<< HEAD
  const navigate = useNavigate()

=======
  const [adminExists, setAdminExists] = useState<boolean | null>(null)
  const navigate = useNavigate()

  // Check if admin exists on component mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await adminCheckService.checkAdminExists()
        if (response.success && response.data) {
          setAdminExists(response.data.adminExists)
          // If admin exists, redirect to login page
          if (response.data.adminExists) {
            navigate('/admin/login')
          }
        }
      } catch (err) {
        console.error('Error checking admin status:', err)
      }
    }

    checkAdminStatus()
  }, [navigate])

>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
<<<<<<< HEAD
      const response = await authService.registerAdmin(username, password, secretCode)

      if (response.success && response.data) {
        // Save admin data to localStorage
        localStorage.setItem('admin', JSON.stringify(response.data))

        // Dispatch event to notify other parts of the app
        window.dispatchEvent(new Event('adminStatusChanged'))

        // Redirect to admin dashboard
        navigate('/admin')
      } else {
        setError(response.message || 'Registration failed')
      }
    } catch (err) {
      setError('An error occurred during registration')
      console.error('Registration error:', err)
=======
      const response = await adminService.register({ username, password, secretCode })

      if (response.success) {
        // Save admin data to localStorage
        const adminData = {
          user: response.data!.user,
          token: response.data!.token,
        }
        localStorage.setItem('admin', JSON.stringify(adminData))
        // Dispatch event to notify navbar of admin status change
        window.dispatchEvent(new CustomEvent('adminStatusChanged'))
        // Redirect to admin dashboard
        navigate('/admin')
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError('Kutilmagan xatolik yuz berdi')
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
    } finally {
      setLoading(false)
    }
  }

<<<<<<< HEAD
  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <div className={styles.registerHeader}>
          <h2>Admin Registration</h2>
          <p>Create your admin account to get started</p>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.registerForm}>
          <div className={styles.formGroup}>
            <label htmlFor='username'>Username</label>
=======
  // Show loading state while checking admin status
  if (adminExists === null) {
    return (
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <h2>Checking system status...</h2>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // If admin exists, show message instead of form
  if (adminExists) {
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
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
            <input
              type='text'
              id='username'
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
<<<<<<< HEAD
              className={styles.inputField}
              placeholder='Choose a username'
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor='password'>Password</label>
=======
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor='password'>Parol</label>
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
            <input
              type='password'
              id='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
<<<<<<< HEAD
              minLength={6}
              className={styles.inputField}
              placeholder='Create a strong password'
            />
            <small className={styles.hint}>Password must be at least 6 characters</small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor='secretCode'>Secret Code</label>
=======
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor='secretCode'>Maxfiy kod</label>
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
            <input
              type='password'
              id='secretCode'
              value={secretCode}
              onChange={e => setSecretCode(e.target.value)}
              required
<<<<<<< HEAD
              className={styles.inputField}
              placeholder='Enter the admin secret code'
            />
            <small className={styles.hint}>
              Contact system administrator for the secret code
            </small>
          </div>

          <button type='submit' disabled={loading} className={styles.submitButton}>
            {loading ? <span className={styles.loadingSpinner}></span> : 'Register'}
          </button>
        </form>

        <div className={styles.loginLink}>
          <p>
            Already have an account? <Link to='/admin/login'>Login</Link>
          </p>
=======
            />
          </div>
          <button type='submit' disabled={loading} className={styles.submitButton}>
            {loading ? "Ro'yxatdan o'tish..." : "Ro'yxatdan o'tish"}
          </button>
        </form>
        <div className={styles.loginLink}>
          Hisobingiz bormi? <Link to='/admin/login'>Kirish</Link>
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
        </div>
      </div>
    </div>
  )
}

export default AdminRegister
