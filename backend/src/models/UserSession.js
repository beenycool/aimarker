const mongoose = require('mongoose');

const ScreenCaptureSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  imageData: {
    type: String
  },
  pageUrl: {
    type: String
  },
  eventTriggered: {
    type: String
  },
  elementInfo: {
    type: Object,
    default: {}
  }
});

const UserEventSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  eventType: {
    type: String,
    required: true
  },
  details: {
    type: Object,
    default: {}
  }
});

const UserSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  browser: {
    type: String
  },
  operatingSystem: {
    type: String
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalClicks: {
    type: Number,
    default: 0
  },
  totalKeyPresses: {
    type: Number,
    default: 0
  },
  screenCaptures: [ScreenCaptureSchema],
  events: [UserEventSchema]
});

// Method to add screen capture to session
UserSessionSchema.methods.addScreenCapture = function(captureData) {
  this.screenCaptures.push(captureData);
  return this.save();
};

// Method to add event to session
UserSessionSchema.methods.addEvent = function(eventType, details = {}) {
  this.events.push({
    timestamp: new Date(),
    eventType,
    details
  });
  return this.save();
};

// Static method to find an active session for a user
UserSessionSchema.statics.findActiveSessionByUser = function(userId) {
  return this.findOne({ user: userId, isActive: true });
};

const UserSession = mongoose.model('UserSession', UserSessionSchema);

module.exports = UserSession;
