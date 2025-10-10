import {
  DollarSign,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Users,
  Utensils,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { dashboardService } from '../services/dashboard.service'
import styles from './AdminDashboard.module.scss'

const COLORS = ['#8B4513', '#A0522D', '#CD853F', '#D2B48C', '#F5DEB3']

interface DashboardStats {
  totals: {
    orders: number
    reservations: number
    recipes: number
    menuItems: number
  }
  recentOrders: Array<{
    customerName: string
    totalAmount: number
    status: string
    createdAt: string
  }>
  recentReservations: Array<{
    customerName: string
    date: string
    time: string
    numberOfGuests: number
    status: string
    createdAt: string
  }>
  orderStats: Array<{
    _id: string
    count: number
  }>
  reservationStats: Array<{
    _id: string
    count: number
  }>
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load dashboard stats from backend
  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        setLoading(true)
        const response = await dashboardService.getStats()
        if (response.success && response.data) {
          setStats(response.data)
        } else {
          setError('Statistikani yuklab bo`lmadi')
        }
      } catch (err) {
        setError('Statistikani yuklab bo`lmadi')
        console.error('Error loading dashboard stats:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardStats()
  }, [])

  // Format data for charts
  const orderData =
    stats?.recentOrders?.map(order => ({
      day: new Date(order.createdAt).toLocaleDateString('uz-UZ', { weekday: 'short' }),
      orders: order.totalAmount,
    })) || []

  const revenueData =
    stats?.orderStats?.map(stat => ({
      week: stat._id,
      revenue: stat.count,
    })) || []

  const popularItemsData =
    stats?.reservationStats?.map(stat => ({
      name: stat._id,
      value: stat.count,
    })) || []

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Statistika yuklanmoqda...</div>
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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Boshqaruv paneli</h1>
        <p>Xush kelibsiz! Bugun nima bo'layotganini ko'rib chiqing.</p>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.cardIcon}>
            <ShoppingCart size={24} />
          </div>
          <div className={styles.cardContent}>
            <h3>Jami buyurtmalar</h3>
            <p className={styles.cardValue}>{stats?.totals?.orders || 0}</p>
            <span className={styles.cardChange}>Oxirgi 30 kun</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.cardIcon}>
            <DollarSign size={24} />
          </div>
          <div className={styles.cardContent}>
            <h3>Daromad</h3>
            <p className={styles.cardValue}>
              ${stats?.totals?.orders ? stats.totals.orders * 25 : 0}
            </p>
            <span className={styles.cardChange}>Oxirgi 30 kun</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.cardIcon}>
            <Users size={24} />
          </div>
          <div className={styles.cardContent}>
            <h3>Mijozlar</h3>
            <p className={styles.cardValue}>{stats?.totals?.reservations || 0}</p>
            <span className={styles.cardChange}>Oxirgi 30 kun</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.cardIcon}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.cardContent}>
            <h3>Aylanish</h3>
            <p className={styles.cardValue}>{stats?.totals?.menuItems || 0}</p>
            <span className={styles.cardChange}>Jami menyu elementlari</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className={styles.chartsSection}>
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h2>Buyurtmalar ko'rib chiqish</h2>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={orderData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='day' />
                <YAxis />
                <Tooltip />
                <Line
                  type='monotone'
                  dataKey='orders'
                  stroke='#8B4513'
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h2>Daromad ko'rib chiqish</h2>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='week' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='revenue' fill='#8B4513' radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Popular Items and Quick Actions */}
      <div className={styles.bottomSection}>
        <div className={styles.popularItems}>
          <div className={styles.cardHeader}>
            <h2>Ommabop menyu elementlari</h2>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={popularItemsData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                  label={({ name, percent }) =>
                    `${name} ${((percent as number) * 100).toFixed(0)}%`
                  }
                >
                  {popularItemsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={styles.recentActivity}>
        <div className={styles.cardHeader}>
          <h2>So'ngi faoliyat</h2>
        </div>
        <div className={styles.activityList}>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>
              <ShoppingBag size={16} />
            </div>
            <div className={styles.activityContent}>
              <h4>Yangi buyurtma</h4>
              <p>Yangi buyurtma qabul qilindi</p>
              <span className={styles.time}>Hozirgina</span>
            </div>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>
              <Utensils size={16} />
            </div>
            <div className={styles.activityContent}>
              <h4>Menyu elementi yangilandi</h4>
              <p>Menyu yangilandi</p>
              <span className={styles.time}>Hozirgina</span>
            </div>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>
              <Users size={16} />
            </div>
            <div className={styles.activityContent}>
              <h4>Yangi bron qilish</h4>
              <p>Yangi bron qilish amalga oshirildi</p>
              <span className={styles.time}>Hozirgina</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
