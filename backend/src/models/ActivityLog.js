const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  actionType: {
    type: String,
    required: true,
    enum: ['login', 'logout', 'register', 'password_change', 'settings_update', 'profile_update']
  },
  actionDetails: {
    type: Object,
    default: {}
  },
  pageUrl: {
    type: String
  },
  performedAt: {
    type: Date,
    default: Date.now
  }
});

const ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);

module.exports = ActivityLog;
