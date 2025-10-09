import { Menu, ShoppingCart, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { NavLink, Link as RouterLink, useNavigate } from 'react-router-dom'
import { Link as ScrollLink } from 'react-scroll'
import { adminCheckService } from '../services/adminCheck.service'
import { isAdmin } from '../services/auth.service'
import styles from './Navbar.module.scss'

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [isCartVisible, setIsCartVisible] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [showAdminLink, setShowAdminLink] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    // Check if there are items in localStorage cart
    const updateCartCount = () => {
      const savedCart = localStorage.getItem('mahallaCart')
      if (savedCart) {
        try {
          const cartItems = JSON.parse(savedCart)
          const totalItems = cartItems.reduce(
            (total: number, item: any) => total + (item.quantity || 0),
            0
          )
          setCartCount(totalItems)
          // Show cart icon when items are added
          if (totalItems > 0 && !isCartVisible) {
            setIsCartVisible(true)
          }
        } catch (e) {
          console.error('Error parsing cart data:', e)
          setCartCount(0)
        }
      } else {
        setCartCount(0)
      }
    }

    // Check if user is admin
    const checkAdminStatus = () => {
      setShowAdminLink(isAdmin())
    }

    // Initial cart count
    updateCartCount()
    checkAdminStatus()

    // Listen for cart updates
    window.addEventListener('cartUpdated', updateCartCount as EventListener)
    window.addEventListener('storage', updateCartCount) // For cross-tab updates
    window.addEventListener('scroll', handleScroll)
    // Listen for admin status changes
    window.addEventListener('adminStatusChanged', checkAdminStatus as EventListener)

    // Periodically check admin status (every 5 minutes)
    const adminCheckInterval = setInterval(checkAdminStatus, 5 * 60 * 1000)

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount as EventListener)
      window.removeEventListener('storage', updateCartCount)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('adminStatusChanged', checkAdminStatus as EventListener)
      clearInterval(adminCheckInterval)
    }
  }, [isCartVisible])

  const navItems = [
    { name: 'Bosh sahifa', path: '/', type: 'route' },
    { name: 'Menyu', path: '/menu', type: 'route' },
    { name: 'Biz haqimizda', path: 'about', type: 'scroll' },
    { name: 'Aloqa', path: 'contact', type: 'scroll' },
    { name: 'Bron qilish', path: '/reservation', type: 'route' },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleLogoClick = async () => {
    const now = Date.now()
    const timeDiff = now - lastClickTime

    // If it's a double click (within 300ms)
    if (clickCount === 1 && timeDiff < 300) {
      setClickCount(0)
      setLastClickTime(0)

      try {
        // Check if admin exists
        const response = await adminCheckService.checkAdminExists()

        if (response.success && response.data) {
          if (response.data.adminExists) {
            // Admin exists, redirect to login
            navigate('/admin/login')
          } else {
            // No admin exists, redirect to register
            navigate('/admin/register')
          }
        } else {
          // Default to register if check fails
          navigate('/admin/register')
        }
      } catch (error) {
        // Default to register if check fails
        navigate('/admin/register')
      }
    } else {
      // First click
      setClickCount(1)
      setLastClickTime(now)

      // Reset click count after 300ms if no second click
      setTimeout(() => {
        setClickCount(0)
        setLastClickTime(0)
      }, 300)
    }
  }

  // Custom handler for scroll links that need to navigate to home first
  const handleScrollNavigation = (path: string) => {
    // If we're not on the home page, navigate to home first
    if (window.location.pathname !== '/') {
      // Navigate to home page with hash
      navigate(`/#${path}`)

      // Close mobile menu
      closeMobileMenu()

      // Scroll to the section after a short delay to ensure page loads
      setTimeout(() => {
        const element = document.getElementById(path)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }

  // Function to determine if a scroll link should be active
  const isScrollLinkActive = (path: string) => {
    // On the home page, we could check if the section is in view
    // For simplicity, we'll just check if it's the home page and the hash matches
    return window.location.pathname === '/' && window.location.hash === `#${path}`
  }

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        {/* Logo container with Mahalla Cafe text */}
        <div className={styles.logo}>
          <RouterLink
            to='/'
            onClick={e => {
              e.preventDefault()
              handleLogoClick()
            }}
          >
            Mahalla Cafe
          </RouterLink>
        </div>

        {/* Desktop Navigation */}
        <ul className={styles.navLinks}>
          {navItems.map((item, index) => (
            <li key={item.path}>
              {item.type === 'scroll' ? (
                window.location.pathname === '/' ? (
                  <ScrollLink
                    to={item.path}
                    smooth={true}
                    duration={600}
                    offset={-60}
                    className={styles.navLink}
                    onClick={closeMobileMenu}
                  >
                    {item.name}
                  </ScrollLink>
                ) : (
                  <button
                    className={`${styles.navLink} ${
                      isScrollLinkActive(item.path) ? styles.active : ''
                    }`}
                    onClick={() => handleScrollNavigation(item.path)}
                  >
                    {item.name}
                  </button>
                )
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                  }
                  onClick={closeMobileMenu}
                >
                  {item.name}
                </NavLink>
              )}
            </li>
          ))}
          {/* Admin link - only shown when user is authenticated as admin */}
          {showAdminLink && (
            <li>
              <NavLink
                to='/admin'
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
                onClick={closeMobileMenu}
              >
                Admin
              </NavLink>
            </li>
          )}
        </ul>

        {/* Actions (cart, etc.) - Always stays on the right */}
        <div className={styles.actions}>
          {/* Show cart icon when there are items in cart */}
          {isCartVisible && (
            <div className={styles.cartIcon}>
              <RouterLink to='/order'>
                <ShoppingCart size={28} />
                {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
              </RouterLink>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <ul className={styles.mobileNavLinks}>
          {navItems.map((item, index) => (
            <li key={item.path}>
              {item.type === 'scroll' ? (
                window.location.pathname === '/' ? (
                  <ScrollLink
                    to={item.path}
                    smooth={true}
                    duration={600}
                    offset={-60}
                    className={styles.navLink}
                    onClick={closeMobileMenu}
                  >
                    {item.name}
                  </ScrollLink>
                ) : (
                  <button
                    className={`${styles.navLink} ${
                      isScrollLinkActive(item.path) ? styles.active : ''
                    }`}
                    onClick={() => handleScrollNavigation(item.path)}
                  >
                    {item.name}
                  </button>
                )
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                  }
                  onClick={closeMobileMenu}
                >
                  {item.name}
                </NavLink>
              )}
            </li>
          ))}
          {/* Admin link in mobile menu - only shown when user is authenticated as admin */}
          {showAdminLink && (
            <li>
              <NavLink
                to='/admin'
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
                onClick={closeMobileMenu}
              >
                Admin
              </NavLink>
            </li>
          )}
        </ul>
      )}
    </nav>
  )
}

export default Navbar
