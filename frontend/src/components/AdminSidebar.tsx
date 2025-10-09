import { motion } from 'framer-motion'
import {
  Activity,
  BookOpen,
  LayoutDashboard,
  ShoppingBag,
  Utensils,
  X,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useOrder } from '../contexts/OrderContext'
import styles from './AdminSidebar.module.scss'

interface SidebarItem {
  id: string
  title: string
  icon: React.ReactNode
  path: string
}

interface AdminSidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, setIsOpen }) => {
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(false)
  const location = useLocation()
  const { isOrderEnabled } = useOrder()

  // Check if we're on tablet or mobile (1280px threshold as per requirements)
  useEffect(() => {
    const checkScreenSize = () => {
      setIsTabletOrMobile(window.innerWidth < 1280) // xl breakpoint (1280px)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => {
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      title: 'Boshqaruv paneli',
      icon: <LayoutDashboard size={24} />,
      path: '/admin',
    },
    {
      id: 'orders',
      title: 'Buyurtmalar',
      icon: <ShoppingBag size={24} />,
      path: '/admin/orders',
    },
    {
      id: 'menu',
      title: 'Menyu',
      icon: <Utensils size={24} />,
      path: '/admin/menu',
    },
    // Always show Recipes Management in admin panel
    {
      id: 'recipes',
      title: 'Retseptlar',
      icon: <BookOpen size={24} />,
      path: '/admin/recipes',
    },
    {
      id: 'activity',
      title: 'Faoliyat jurnali',
      icon: <Activity size={24} />,
      path: '/admin/activity',
    },
  ]

  // Close sidebar when overlay is clicked
  const handleOverlayClick = () => {
    setIsOpen(false)
  }

  // Close sidebar when a link is clicked on mobile/tablet
  const handleLinkClick = () => {
    if (isTabletOrMobile) {
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Overlay for mobile/tablet */}
      {isTabletOrMobile && isOpen && (
        <motion.div
          className={styles.overlay}
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      <motion.aside
        className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}
        initial={false}
        animate={isTabletOrMobile ? (isOpen ? { x: 0 } : { x: -256 }) : { x: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <Utensils size={28} />
            <span className={styles.logoText}>Mahalla Cafe</span>
          </div>
          {isTabletOrMobile && (
            <button
              className={styles.toggleButton}
              onClick={() => setIsOpen(false)}
              aria-label='Sidebar-ni yopish'
            >
              <X size={24} />
            </button>
          )}
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {sidebarItems.map((item, index) => (
              <li key={item.id} className={styles.navItem}>
                <Link
                  to={item.path}
                  className={`${styles.navLink} ${
                    location.pathname === item.path ? styles.active : ''
                  }`}
                  // Add staggered animation delay for wow effect
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={handleLinkClick}
                >
                  <span className={styles.icon}>{item.icon}</span>
                  <span className={styles.title}>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </motion.aside>
    </>
  )
}

export default AdminSidebar
