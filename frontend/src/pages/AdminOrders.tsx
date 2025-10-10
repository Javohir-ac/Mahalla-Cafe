import { motion } from 'framer-motion'
import { Edit, Eye, Filter, Search, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'
import { useAlert } from '../contexts/AlertContext'
import { orderService, Order as OrderType } from '../services/order.service'
import styles from './AdminOrders.module.scss'

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null)
  const [visibleOrders, setVisibleOrders] = useState<OrderType[]>([])
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null)
  const { addAlert } = useAlert()

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const response = await orderService.getAll()

        if (response.success && Array.isArray(response.data)) {
          setOrders(response.data)
        } else {
          setError("Buyurtmalar ma'lumotlarini yuklashda xatolik yuz berdi")
          addAlert({
            type: 'error',
            title: 'Xatolik yuz berdi',
            message: "Buyurtmalar ma'lumotlarini yuklashda xatolik yuz berdi",
          })
        }
      } catch (err) {
        setError("Buyurtmalar ma'lumotlarini yuklashda xatolik yuz berdi")
        addAlert({
          type: 'error',
          title: 'Xatolik yuz berdi',
          message: "Buyurtmalar ma'lumotlarini yuklashda xatolik yuz berdi",
        })
        console.error('Error fetching orders:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [addAlert])

  // For wow effect - staggered animation
  useEffect(() => {
    setVisibleOrders([])
    const timer = setTimeout(() => {
      setVisibleOrders(filteredOrders)
    }, 100)
    return () => clearTimeout(timer)
  }, [orders, searchQuery, statusFilter])

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return styles.pending
      case 'confirmed':
        return styles.processing
      case 'preparing':
        return styles.processing
      case 'ready':
        return styles.processing
      case 'delivered':
        return styles.completed
      case 'cancelled':
        return styles.cancelled
      default:
        return ''
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Kutilmoqda'
      case 'confirmed':
        return 'Tasdiqlangan'
      case 'preparing':
        return 'Tayyorlanmoqda'
      case 'ready':
        return 'Tayyor'
      case 'delivered':
        return 'Yetkazilgan'
      case 'cancelled':
        return 'Bekor qilindi'
      default:
        return status
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: OrderType['status']) => {
    try {
      const response = await orderService.updateStatus(orderId, newStatus)

      if (response.success && response.data) {
        setOrders(
          orders.map(order =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        )
        addAlert({
          type: 'success',
          title: 'Muvaffaqiyat',
          message: 'Buyurtma statusi yangilandi',
        })
      } else {
        addAlert({
          type: 'error',
          title: 'Xatolik yuz berdi',
          message: 'Buyurtma statusini yangilashda xatolik yuz berdi',
        })
      }
    } catch (err) {
      console.error('Error updating order status:', err)
      addAlert({
        type: 'error',
        title: 'Xatolik yuz berdi',
        message: 'Buyurtma statusini yangilashda xatolik yuz berdi',
      })
    }
  }

  const handleViewOrder = (order: OrderType) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const handleEditOrder = (order: OrderType) => {
    // Implement edit functionality
    console.log('Buyurtmani tahrirlash:', order)
  }

  const handleDeleteOrder = (orderId: string) => {
    setOrderToDelete(orderId)
    setIsConfirmDialogOpen(true)
  }

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return

    try {
      const response = await orderService.delete(orderToDelete)

      if (response.success) {
        setOrders(orders.filter(order => order._id !== orderToDelete))
        addAlert({
          type: 'success',
          title: 'Muvaffaqiyat',
          message: "Buyurtma o'chirildi",
        })
      } else {
        addAlert({
          type: 'error',
          title: 'Xatolik yuz berdi',
          message: "Buyurtmani o'chirishda xatolik yuz berdi",
        })
      }
    } catch (err) {
      console.error('Error deleting order:', err)
      addAlert({
        type: 'error',
        title: 'Xatolik yuz berdi',
        message: "Buyurtmani o'chirishda xatolik yuz berdi",
      })
    } finally {
      setOrderToDelete(null)
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Buyurtmalar yuklanmoqda...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
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
        <h1>Buyurtmalar boshqaruvi</h1>
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
            placeholder="Mijoz bo'yicha qidirish..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.filterContainer}>
          <Filter size={20} className={styles.filterIcon} />
          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value='all'>Barcha statuslar</option>
            <option value='pending'>Kutilmoqda</option>
            <option value='confirmed'>Tasdiqlangan</option>
            <option value='preparing'>Tayyorlanmoqda</option>
            <option value='ready'>Tayyor</option>
            <option value='delivered'>Yetkazilgan</option>
            <option value='cancelled'>Bekor qilindi</option>
          </select>
        </div>
      </motion.div>

      {/* Desktop Table View */}
      <motion.div
        className={`${styles.tableContainer} ${styles.desktopTable}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th>Buyurtma ID</th>
              <th>Mijoz</th>
              <th>Telefon</th>
              <th>Sana</th>
              <th>Holat</th>
              <th>Umumiy summa</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {visibleOrders.map((order, index) => (
              <motion.tr
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={styles.tableRow}
              >
                <td>{order._id}</td>
                <td>{order.customerName}</td>
                <td>{order.customerPhone}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <select
                    className={`${styles.statusSelect} ${getStatusClass(order.status)}`}
                    value={order.status}
                    onChange={e =>
                      handleStatusChange(order._id, e.target.value as OrderType['status'])
                    }
                  >
                    <option value='pending'>Kutilmoqda</option>
                    <option value='confirmed'>Tasdiqlangan</option>
                    <option value='preparing'>Tayyorlanmoqda</option>
                    <option value='ready'>Tayyor</option>
                    <option value='delivered'>Yetkazilgan</option>
                    <option value='cancelled'>Bekor qilindi</option>
                  </select>
                </td>
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>
                  <div className={styles.actions}>
                    <motion.button
                      className={styles.actionButton}
                      onClick={() => handleViewOrder(order)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Eye size={16} />
                    </motion.button>
                    <motion.button
                      className={styles.actionButton}
                      onClick={() => handleEditOrder(order)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit size={16} />
                    </motion.button>
                    <motion.button
                      className={styles.actionButton}
                      onClick={() => handleDeleteOrder(order._id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Mobile Card View */}
      <div className={styles.mobileCards}>
        {visibleOrders.map((order, index) => (
          <motion.div
            key={order._id}
            className={styles.orderCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className={styles.cardHeader}>
              <span className={styles.orderId}>{order._id}</span>
              <span className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardRow}>
                <span className={styles.label}>Mijoz:</span>
                <span className={styles.value}>{order.customerName}</span>
              </div>
              <div className={styles.cardRow}>
                <span className={styles.label}>Telefon:</span>
                <span className={styles.value}>{order.customerPhone}</span>
              </div>
              <div className={styles.cardRow}>
                <span className={styles.label}>Sana:</span>
                <span className={styles.value}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className={styles.cardRow}>
                <span className={styles.label}>Holat:</span>
                <span className={styles.value}>{getStatusText(order.status)}</span>
              </div>
              <div className={styles.cardRow}>
                <span className={styles.label}>Umumiy summa:</span>
                <span className={styles.value}>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
            <div className={styles.cardActions}>
              <motion.button
                className={styles.cardActionButton}
                onClick={() => handleViewOrder(order)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye size={16} />
              </motion.button>
              <motion.button
                className={styles.cardActionButton}
                onClick={() => handleEditOrder(order)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Edit size={16} />
              </motion.button>
              <motion.button
                className={styles.cardActionButton}
                onClick={() => handleDeleteOrder(order._id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 size={16} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {isModalOpen && selectedOrder && (
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
              <h2>Buyurtma tafsilotlari - {selectedOrder._id}</h2>
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
              <div className={styles.orderInfo}>
                <div className={styles.infoRow}>
                  <span>Mijoz:</span>
                  <span>{selectedOrder.customerName}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Telefon:</span>
                  <span>{selectedOrder.customerPhone}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Manzil:</span>
                  <span>{selectedOrder.customerAddress}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Sana:</span>
                  <span>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Elementlar soni:</span>
                  <span>{selectedOrder.items.length}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Umumiy summa:</span>
                  <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Status:</span>
                  <span className={getStatusClass(selectedOrder.status)}>
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>
              </div>
              <div className={styles.orderItems}>
                <h3>Buyurtma elementlari</h3>
                <ul>
                  {selectedOrder.items.map((item, index) => (
                    <li key={index}>
                      {item.title} - {item.quantity} dona - ${item.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
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

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        title="Buyurtmani o'chirish"
        message="Haqiqatan ham bu buyurtmani o'chirmoqchimisiz?"
        onConfirm={confirmDeleteOrder}
        onCancel={() => setIsConfirmDialogOpen(false)}
        confirmText="Ha, o'chirish"
        cancelText='Bekor qilish'
      />
    </motion.div>
  )
}

export default AdminOrders
