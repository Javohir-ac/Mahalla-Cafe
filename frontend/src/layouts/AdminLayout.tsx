import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'
import AdminTopNavbar from '../components/AdminTopNavbar'
import styles from './AdminLayout.module.scss'

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className={styles.layout}>
      <AdminTopNavbar setIsSidebarOpen={setIsSidebarOpen} />
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className={styles.main}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
