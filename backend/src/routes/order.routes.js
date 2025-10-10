const express = require('express')
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} = require('../controllers/order.controller')

const router = express.Router()

// GET /api/orders
router.get('/', getAllOrders)

// GET /api/orders/:id
router.get('/:id', getOrderById)

// POST /api/orders
router.post('/', createOrder)

// PUT /api/orders/:id
router.put('/:id', updateOrder)

// DELETE /api/orders/:id
router.delete('/:id', deleteOrder)

module.exports = router
