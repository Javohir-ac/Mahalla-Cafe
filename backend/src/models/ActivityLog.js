const mongoose = require('mongoose')

const activityLogSchema = new mongoose.Schema(
  {
<<<<<<< HEAD
    action: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
=======
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    adminUsername: {
      type: String,
      required: true,
      trim: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    entityType: {
      type: String,
      required: true,
      trim: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    details: {
      type: String,
      trim: true,
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('ActivityLog', activityLogSchema)
