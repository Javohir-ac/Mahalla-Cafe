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
import styles from './AdminLogin.module.scss'

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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
          // If no admin exists, redirect to register page
          if (!response.data.adminExists) {
            navigate('/admin/register')
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
      const response = await authService.loginAdmin(username, password)

      if (response.success && response.data) {
        // Save admin data to localStorage
        localStorage.setItem('admin', JSON.stringify(response.data))

        // Dispatch event to notify other parts of the app
        window.dispatchEvent(new Event('adminStatusChanged'))

        // Redirect to admin dashboard
        navigate('/admin')
      } else {
        setError(response.message || 'Login failed')
      }
    } catch (err) {
      setError('An error occurred during login')
      console.error('Login error:', err)
=======
      const response = await adminService.login({ username, password })

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
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h2>Admin Login</h2>
          <p>Welcome back! Please enter your credentials</p>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.loginForm}>
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

  // If no admin exists, show message instead of form
  if (!adminExists) {
    return (
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <h2>Administrator kirish</h2>
          <div className={styles.infoMessage}>
            <p>Tizimda hozircha administrator mavjud emas.</p>
            <p>Avval administrator ro'yxatdan o'tishi kerak.</p>
            <div className={styles.registerLink}>
              <Link to='/admin/register'>Ro'yxatdan o'tish sahifasiga o'tish</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2>Administrator kirish</h2>
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
              placeholder='Enter your username'
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
              className={styles.inputField}
              placeholder='Enter your password'
            />
          </div>

          <button type='submit' disabled={loading} className={styles.submitButton}>
            {loading ? <span className={styles.loadingSpinner}></span> : 'Login'}
          </button>
        </form>

        <div className={styles.registerLink}>
          <p>
            Don't have an account? <Link to='/admin/register'>Register</Link>
          </p>
=======
            />
          </div>
          <button type='submit' disabled={loading} className={styles.submitButton}>
            {loading ? 'Kirish...' : 'Kirish'}
          </button>
        </form>
        <div className={styles.registerLink}>
          Hisobingiz yo'qmi? <Link to='/admin/register'>Ro'yxatdan o'tish</Link>
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
