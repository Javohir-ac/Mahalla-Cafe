import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'
import styles from './AdminRegister.module.scss'

const AdminRegister: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [secretCode, setSecretCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
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
    } finally {
      setLoading(false)
    }
  }

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
            <input
              type='text'
              id='username'
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className={styles.inputField}
              placeholder='Choose a username'
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
              minLength={6}
              className={styles.inputField}
              placeholder='Create a strong password'
            />
            <small className={styles.hint}>Password must be at least 6 characters</small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor='secretCode'>Secret Code</label>
            <input
              type='password'
              id='secretCode'
              value={secretCode}
              onChange={e => setSecretCode(e.target.value)}
              required
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
        </div>
      </div>
    </div>
  )
}

export default AdminRegister
