import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import styles from './Alert.module.scss'

interface AlertProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

const Alert: React.FC<AlertProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  const [isPaused, setIsPaused] = useState(false)
  const [remainingTime, setRemainingTime] = useState(duration)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (!isPaused && remainingTime > 0 && duration > 0) {
      timer = setTimeout(() => {
        setRemainingTime(prev => prev - 100)
      }, 100)
    } else if (remainingTime <= 0) {
      onClose(id)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [id, onClose, remainingTime, isPaused, duration])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={24} />
      case 'error':
        return <XCircle size={24} />
      case 'warning':
        return <AlertTriangle size={24} />
      case 'info':
        return <Info size={24} />
      default:
        return <Info size={24} />
    }
  }

  return (
    <motion.div
      className={styles.alert}
      data-type={type}
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300, height: 0, margin: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={styles.icon}>{getIcon()}</div>
      <div className={styles.content}>
        <h4 className={styles.title}>{title}</h4>
        {message && <p className={styles.message}>{message}</p>}
      </div>
      <motion.button
        className={styles.closeButton}
        onClick={() => onClose(id)}
        whileHover={{ scale: 1.2, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
      >
        <X size={18} />
      </motion.button>
    </motion.div>
  )
}

export default Alert
