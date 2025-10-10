import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import heroBg from '../assets/hero-bg.jpg'
import styles from './Hero.module.scss'

const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className={styles.hero}>
      <div
        className={`${styles.backgroundImage} ${styles.pulse}`}
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      />

      <div className={styles.overlay}></div>

      <div className={styles.container}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className={`${styles.title} ${isVisible ? styles.visible : ''}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              type: 'spring',
              stiffness: 100,
            }}
          >
            <span>Mahalla Cafe</span>
          </motion.h1>

          <motion.p
            className={`${styles.subtitle} ${isVisible ? styles.visible : ''}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              type: 'spring',
              stiffness: 100,
            }}
          >
            Mahalliy taomlarning ajoyib ta'mi
          </motion.p>

          <motion.div
            className={styles.buttons}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.6,
              type: 'spring',
              stiffness: 100,
            }}
          >
            <Link to='/menu'>
              <motion.button
                className={styles.primaryButton}
                whileHover={{
                  y: -8,
                  scale: 1.05,
                  boxShadow: '0 20px 35px rgba(139, 69, 19, 0.5)',
                  transition: { duration: 0.3 },
                }}
                whileTap={{
                  scale: 0.95,
                  y: 0,
                }}
                animate={{
                  boxShadow: [
                    '0 4px 15px rgba(139, 69, 19, 0.3)',
                    '0 12px 30px rgba(139, 69, 19, 0.4)',
                    '0 4px 15px rgba(139, 69, 19, 0.3)',
                  ],
                }}
                transition={{
                  boxShadow: {
                    duration: 2.5,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  },
                }}
              >
                Menuni ko'rish
              </motion.button>
            </Link>

            <Link to='/contact'>
              <motion.button
                className={styles.secondaryButton}
                whileHover={{
                  y: -8,
                  scale: 1.05,
                  boxShadow: '0 20px 35px rgba(0, 0, 0, 0.4)',
                  transition: { duration: 0.3 },
                }}
                whileTap={{
                  scale: 0.95,
                  y: 0,
                }}
              >
                Bron qilish
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
