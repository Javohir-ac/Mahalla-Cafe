const Order = require('../models/Order')
const Reservation = require('../models/Reservation')
const Recipe = require('../models/Recipe')
const Menu = require('../models/Menu')
const { sendSuccess, sendError } = require('../utils/response.utils')

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get counts for each entity
    const totalOrders = await Order.countDocuments()
    const totalReservations = await Reservation.countDocuments()
    const totalRecipes = await Recipe.countDocuments()
    const totalMenuItems = await Menu.countDocuments()

    // Get recent orders (last 5)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('customerName totalAmount status createdAt')

    // Get recent reservations (last 5)
    const recentReservations = await Reservation.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('customerName date time numberOfGuests status createdAt')

    // Order statistics by status
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ])

    // Reservation statistics by status
    const reservationStats = await Reservation.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ])

    const stats = {
      totals: {
        orders: totalOrders,
        reservations: totalReservations,
        recipes: totalRecipes,
        menuItems: totalMenuItems,
      },
      recentOrders,
      recentReservations,
      orderStats,
      reservationStats,
    }

    sendSuccess(res, stats, 'Dashboard statistics retrieved successfully')
  } catch (error) {
    console.error('Error getting dashboard stats:', error)
    sendError(res, 'Failed to retrieve dashboard statistics')
  }
}

module.exports = {
  getDashboardStats,
}
