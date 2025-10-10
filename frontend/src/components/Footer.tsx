import { motion } from 'framer-motion'
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react'
import React from 'react'
import styles from './Footer.module.scss'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <motion.div
          className={styles.brand}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3>Mahalla Cafe</h3>
          <p className={styles.description}>
            Ilhomlantiruvchi ta'mlar va iliq muhit. Jamoamiz ta'mini his qiling.
          </p>
          <div className={styles.socialLinks}>
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
        </motion.div>

        <motion.div
          className={styles.links}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h4>Tezkor havolalar</h4>
          <ul>
            <li>
              <a href='/'>Bosh sahifa</a>
            </li>
            <li>
              <a href='/menu'>Menyu</a>
            </li>
            <li>
              <a href='/about'>Biz haqimizda</a>
            </li>
            <li>
              <a href='/contact'>Aloqa</a>
            </li>
          </ul>
        </motion.div>

        <motion.div
          className={styles.contact}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h4>Biz bilan aloqa</h4>
          <ul>
            <li>
              <MapPin size={20} />
              <span>123 Cafe ko'chasi, Toshkent, O'zbekiston</span>
            </li>
            <li>
              <Phone size={20} />
              <span>+998 90 123 45 67</span>
            </li>
            <li>
              <Mail size={20} />
              <span>info@mahallacafe.uz</span>
            </li>
          </ul>
        </motion.div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.container}>
          <p>&copy; {currentYear} Mahalla Cafe. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
