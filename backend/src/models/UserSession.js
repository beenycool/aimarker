// In-memory user session storage
const sessions = [];
let sessionIdCounter = 1;

class UserSession {
  constructor(data) {
    this._id = data._id || sessionIdCounter++;
    this.user = data.user;
    this.username = data.username;
    this.sessionId = data.sessionId;
    this.ipAddress = data.ipAddress;
    this.userAgent = data.userAgent;
    this.browser = data.browser;
    this.operatingSystem = data.operatingSystem;
    this.startTime = data.startTime || new Date();
    this.endTime = data.endTime;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.totalClicks = data.totalClicks || 0;
    this.totalKeyPresses = data.totalKeyPresses || 0;
    this.screenCaptures = data.screenCaptures || [];
    this.events = data.events || [];
  }

  // Save the session
  async save() {
    const existingIndex = sessions.findIndex(session => session._id === this._id);
    if (existingIndex >= 0) {
      sessions[existingIndex] = this;
    } else {
      sessions.push(this);
    }
    
    return this;
  }

  // Method to add screen capture to session
  async addScreenCapture(captureData) {
    this.screenCaptures.push({
      timestamp: captureData.timestamp || new Date(),
      imageData: captureData.imageData,
      pageUrl: captureData.pageUrl,
      eventTriggered: captureData.eventTriggered,
      elementInfo: captureData.elementInfo || {}
    });
    
    return this.save();
  }

  // Method to add event to session
  async addEvent(eventType, details = {}) {
    this.events.push({
      timestamp: new Date(),
      eventType,
      details
    });
    
    return this.save();
  }

  // Static methods
  static create(sessionData) {
    const newSession = new UserSession(sessionData);
    return newSession.save();
  }

  static findOne(query) {
    return Promise.resolve(
      sessions.find(session => {
        for (const [key, value] of Object.entries(query)) {
          if (session[key] !== value) {
            return false;
          }
        }
        return true;
      })
    );
  }

  // Find an active session for a user
  static findActiveSessionByUser(userId) {
    return this.findOne({ user: userId, isActive: true });
  }
}

module.exports = UserSession;
