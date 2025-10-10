const Menu = require('../models/Menu')
const Order = require('../models/Order')
const Reservation = require('../models/Reservation')
const ActivityLog = require('../models/ActivityLog')
const { sendSuccess, sendError } = require('../utils/response.utils')

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get counts for different entities
    const menuCount = await Menu.countDocuments()
    const orderCount = await Order.countDocuments()
    const reservationCount = await Reservation.countDocuments()
    const activityCount = await ActivityLog.countDocuments()

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('customerName totalAmount status createdAt')

    // Get recent reservations
    const recentReservations = await Reservation.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('customerName date time numberOfPeople status')

    sendSuccess(
      res,
      {
        stats: {
          menuItems: menuCount,
          orders: orderCount,
          reservations: reservationCount,
          activities: activityCount,
        },
        recentOrders,
        recentReservations,
      },
      'Dashboard statistics retrieved successfully'
    )
  } catch (error) {
    console.error('Error getting dashboard stats:', error)
    sendError(res, 'Failed to retrieve dashboard statistics')
  }
}

module.exports = {
  getDashboardStats,
}
