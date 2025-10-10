const express = require('express')
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} = require('../controllers/order.controller')
const { authorizeAdmin } = require('../middleware/auth.middleware')

const router = express.Router()

// Apply admin authorization middleware to all routes
router.use(authorizeAdmin)

// GET /api/orders - Get all orders
router.get('/', getAllOrders)

// GET /api/orders/:id - Get order by ID
router.get('/:id', getOrderById)

// POST /api/orders - Create new order
router.post('/', createOrder)

// PUT /api/orders/:id - Update order (status)
router.put('/:id', updateOrder)

// DELETE /api/orders/:id - Delete order
router.delete('/:id', deleteOrder)

module.exports = router