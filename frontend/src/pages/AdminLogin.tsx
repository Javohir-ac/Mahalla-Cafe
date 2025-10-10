import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'
import styles from './AdminLogin.module.scss'

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
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
    } finally {
      setLoading(false)
    }
  }

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
            <input
              type='text'
              id='username'
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className={styles.inputField}
              placeholder='Enter your username'
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
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
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
