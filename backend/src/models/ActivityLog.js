const mongoose = require('mongoose')

const activityLogSchema = new mongoose.Schema(
  {
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
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('ActivityLog', activityLogSchema)