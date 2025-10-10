import { motion } from 'framer-motion'
import { Eye, Filter, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { activityService } from '../services/activity.service'
import styles from './AdminActivityLogs.module.scss'

interface ActivityLogItem {
  id: string
  user: string
  action: string
  description: string
  date: string
  time: string
  status: 'success' | 'warning' | 'error'
}

const AdminActivityLogs: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLog, setSelectedLog] = useState<ActivityLogItem | null>(null)
  const [visibleLogs, setVisibleLogs] = useState<ActivityLogItem[]>([])

  // Fetch activity logs from MongoDB
  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        setLoading(true)
        const response = await activityService.getAll()

        if (response.success && response.data) {
          // Transform the data to match the existing interface
          const transformedLogs = (
            Array.isArray(response.data) ? response.data : [response.data]
          ).map(log => ({
            id: log.id || '',
            user: log.adminUsername,
            action: log.action,
            description: log.details || '',
            date: new Date(log.createdAt).toLocaleDateString('uz-UZ'),
            time: new Date(log.createdAt).toLocaleTimeString('uz-UZ'),
            status: 'success' as const, // Default to success, you can add logic to determine status based on action
          }))
          setLogs(transformedLogs)
        } else {
          setError(
            response.message ||
              "Faoliyat jurnali ma'lumotlarini yuklashda xatolik yuz berdi"
          )
        }
      } catch (err) {
        setError("Faoliyat jurnali ma'lumotlarini yuklashda xatolik yuz berdi")
        console.error('Error fetching activity logs:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchActivityLogs()
  }, [])

  // For wow effect - staggered animation
  useEffect(() => {
    setVisibleLogs([])
    const timer = setTimeout(() => {
      setVisibleLogs(currentLogs)
    }, 100)
    return () => clearTimeout(timer)
  }, [logs, searchQuery, actionFilter, statusFilter, currentPage])

  const handleViewDetail = (log: ActivityLogItem) => {
    setSelectedLog(log)
    setIsModalOpen(true)
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'success':
        return styles.success
      case 'warning':
        return styles.warning
      case 'error':
        return styles.error
      default:
        return ''
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Muvaffaqiyat'
      case 'warning':
        return 'Ogohlantirish'
      case 'error':
        return 'Xato'
      default:
        return status
    }
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAction = actionFilter === 'all' || log.action === actionFilter
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter
    return matchesSearch && matchesAction && matchesStatus
  })

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentLogs = filteredLogs.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Get unique actions for filter
  const uniqueActions = Array.from(new Set(logs.map(log => log.action)))

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Ma'lumotlar yuklanmoqda...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1>Faoliyat jurnali</h1>
      </motion.div>

      <motion.div
        className={styles.filters}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className={styles.searchContainer}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type='text'
            placeholder="Foydalanuvchi yoki harakat bo'yicha qidirish..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.filterContainer}>
          <Filter size={20} className={styles.filterIcon} />
          <select
            className={styles.filterSelect}
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
          >
            <option value='all'>Barcha harakatlar</option>
            {uniqueActions.map(action => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterContainer}>
          <Filter size={20} className={styles.filterIcon} />
          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value='all'>Barcha statuslar</option>
            <option value='success'>Muvaffaqiyat</option>
            <option value='warning'>Ogohlantirish</option>
            <option value='error'>Xato</option>
          </select>
        </div>
      </motion.div>

      <motion.div
        className={styles.tableContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <table className={styles.logsTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Foydalanuvchi</th>
              <th>Harakat</th>
              <th>Tavsif</th>
              <th>Sana va vaqt</th>
              <th>Status</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {visibleLogs.map((log, index) => (
              <motion.tr
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <td>{log.id.substring(0, 8)}</td>
                <td>{log.user}</td>
                <td>{log.action}</td>
                <td>{log.description}</td>
                <td>
                  <div className={styles.dateTime}>
                    <span>{log.date}</span>
                    <span>{log.time}</span>
                  </div>
                </td>
                <td>
                  <span className={`${styles.status} ${getStatusClass(log.status)}`}>
                    {getStatusText(log.status)}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <motion.button
                      className={styles.actionButton}
                      onClick={() => handleViewDetail(log)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Eye size={16} />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredLogs.length === 0 && (
          <div className={styles.emptyState}>
            <p>Faoliyat jurnali bo'sh</p>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      <motion.div
        className={styles.pagination}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className={styles.paginationInfo}>
          {indexOfFirstItem + 1} dan {Math.min(indexOfLastItem, filteredLogs.length)}{' '}
          gacha, jami {filteredLogs.length} ta yozuv
        </div>
        <div className={styles.paginationControls}>
          <motion.button
            className={styles.paginationButton}
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Oldingi
          </motion.button>

          {[...Array(totalPages)].map((_, index) => (
            <motion.button
<<<<<<< HEAD
              key={`page-${index + 1}`}
=======
              key={index + 1}
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
              className={`${styles.paginationButton} ${
                currentPage === index + 1 ? styles.active : ''
              }`}
              onClick={() => paginate(index + 1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {index + 1}
            </motion.button>
          ))}

          <motion.button
            className={styles.paginationButton}
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Keyingi
          </motion.button>
        </div>
      </motion.div>

      {/* Recent Activity Widget */}
      <motion.div
        className={styles.recentActivity}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className={styles.widgetHeader}>
          <h2>So'ngi faoliyat</h2>
        </div>
        <div className={styles.activityList}>
          {logs.slice(0, 5).map((log, index) => (
            <motion.div
              key={log.id}
              className={styles.activityItem}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
            >
              <div className={`${styles.activityIcon} ${getStatusClass(log.status)}`}>
                {log.action.charAt(0)}
              </div>
              <div className={styles.activityContent}>
                <h4>
                  {log.user} - {log.action}
                </h4>
                <p>{log.description}</p>
                <span className={styles.time}>
                  {log.date} da {log.time}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Activity Detail Modal */}
      {isModalOpen && selectedLog && (
        <motion.div
          className={styles.modal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={styles.modalContent}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.modalHeader}>
              <h2>Faoliyat tafsilotlari</h2>
              <motion.button
                className={styles.closeButton}
                onClick={() => setIsModalOpen(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </motion.button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>ID:</span>
                <span>{selectedLog.id}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Foydalanuvchi:</span>
                <span>{selectedLog.user}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Harakat:</span>
                <span>{selectedLog.action}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Tavsif:</span>
                <span>{selectedLog.description}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Sana:</span>
                <span>{selectedLog.date}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Vaqt:</span>
                <span>{selectedLog.time}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Status:</span>
                <span
                  className={`${styles.status} ${getStatusClass(selectedLog.status)}`}
                >
                  {getStatusText(selectedLog.status)}
                </span>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <motion.button
                className={styles.closeModalButton}
                onClick={() => setIsModalOpen(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Yopish
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default AdminActivityLogs
