import { Bell, Home, LogOut, Menu, User } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './AdminTopNavbar.module.scss'

interface Notification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
}

interface AdminTopNavbarProps {
  setIsSidebarOpen: (isOpen: boolean) => void
}

const AdminTopNavbar: React.FC<AdminTopNavbarProps> = ({ setIsSidebarOpen }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const navigate = useNavigate()

  // Mock notifications data
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Yangi buyurtma',
      description: 'Buyurtma #1005 qabul qilindi',
      time: '5 daqiqa oldin',
      read: false,
    },
    {
      id: '2',
      title: 'Menyu yangilandi',
      description: 'Oshpaz kundalik maxsus takliflarni yangiladi',
      time: '1 soat oldin',
      read: true,
    },
    {
      id: '3',
      title: 'Zaxira kam',
      description: 'Zaytun moyi zaxirasi tugamoqda',
      time: '3 soat oldin',
      read: false,
    },
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  const handleLogout = () => {
    localStorage.removeItem('admin')
    navigate('/admin/login')
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(true)
  }

  return (
    <header className={styles.topNavbar}>
      <div className={styles.navbarLeft}>
        {/* Menu button for toggling sidebar on mobile and tablet */}
        <button className={styles.menuButton} onClick={toggleSidebar}>
          <Menu size={24} />
        </button>

        {/* Main site link */}
        <Link to='/' className={styles.homeLink}>
          <Home size={20} />
          <span>Bosh sahifa</span>
        </Link>
      </div>

      <div className={styles.navbarRight}>
        <div className={styles.notifications}>
          <button
            className={styles.notificationButton}
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
          </button>

          {isNotificationsOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <h3>Bildirishnomalar</h3>
                <button className={styles.markAllRead}>
                  Hammasini o'qilgan deb belgilash
                </button>
              </div>
              <div className={styles.dropdownBody}>
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`${styles.notificationItem} ${
                      !notification.read ? styles.unread : ''
                    }`}
                  >
                    <div className={styles.notificationContent}>
                      <h4>{notification.title}</h4>
                      <p>{notification.description}</p>
                      <span className={styles.time}>{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.dropdownFooter}>
                <button>Barcha bildirishnomalarni ko'rish</button>
              </div>
            </div>
          )}
        </div>

        <div className={styles.profile}>
          <button
            className={styles.profileButton}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <User size={20} />
            <span className={styles.profileName}>Admin</span>
          </button>

          {isProfileOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <h3>Admin profili</h3>
              </div>
              <div className={styles.dropdownBody}>
                <button className={styles.dropdownItem}>
                  <User size={16} />
                  Mening profilim
                </button>
                <button
                  className={`${styles.dropdownItem} ${styles.danger}`}
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Chiqish
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default AdminTopNavbar
