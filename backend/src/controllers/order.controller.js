const Order = require('../models/Order')
<<<<<<< HEAD
=======
const ActivityLog = require('../models/ActivityLog')
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
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
<<<<<<< HEAD
=======

>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
    sendSuccess(res, order, 'Order created successfully', 201)
  } catch (error) {
    console.error('Error creating order:', error)
    sendError(res, 'Failed to create order')
  }
}

<<<<<<< HEAD
// Update order
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!order) {
      return sendError(res, 'Order not found', 404)
    }
    sendSuccess(res, order, 'Order updated successfully')
=======
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
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
  } catch (error) {
    console.error('Error updating order:', error)
    sendError(res, 'Failed to update order')
  }
}

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id)
<<<<<<< HEAD
    if (!order) {
      return sendError(res, 'Order not found', 404)
    }
=======

    if (!order) {
      return sendError(res, 'Order not found', 404)
    }

>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
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
