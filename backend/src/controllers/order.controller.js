const Order = require('../models/Order')
const ActivityLog = require('../models/ActivityLog')
const { sendSuccess, sendError } = require('../utils/response.utils')

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    sendSuccess(res, orders, 'Orders retrieved successfully')
  } catch (error) {
    console.error('Error getting orders:', error)
    sendError(res, 'Failed to retrieve orders')
  }
}

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      return sendError(res, 'Order not found', 404)
    }
    sendSuccess(res, order, 'Order retrieved successfully')
  } catch (error) {
    console.error('Error getting order:', error)
    sendError(res, 'Failed to retrieve order')
  }
}

// Create new order
const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body)
    await order.save()

    sendSuccess(res, order, 'Order created successfully', 201)
  } catch (error) {
    console.error('Error creating order:', error)
    sendError(res, 'Failed to create order')
  }
}

// Update order (status)
const updateOrder = async (req, res) => {
  try {
    const { status } = req.body

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )

    if (!order) {
      return sendError(res, 'Order not found', 404)
    }

    // Log activity
    if (req.admin) {
      await ActivityLog.create({
        adminId: req.admin._id,
        adminUsername: req.admin.username,
        action: 'Updated order status',
        entityType: 'Order',
        entityId: order._id,
        details: `Updated order status to: ${status}`,
      })
    }

    sendSuccess(res, order, 'Order status updated successfully')
  } catch (error) {
    console.error('Error updating order:', error)
    sendError(res, 'Failed to update order')
  }
}

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id)

    if (!order) {
      return sendError(res, 'Order not found', 404)
    }

    sendSuccess(res, null, 'Order deleted successfully')
  } catch (error) {
    console.error('Error deleting order:', error)
    sendError(res, 'Failed to delete order')
  }
}

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
}
