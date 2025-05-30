// In-memory activity log storage
const activityLogs = [];
let logIdCounter = 1;

class ActivityLog {
  constructor(data) {
    this._id = data._id || logIdCounter++;
    this.user = data.user;
    this.username = data.username;
    this.ipAddress = data.ipAddress;
    this.userAgent = data.userAgent;
    this.actionType = data.actionType;
    this.actionDetails = data.actionDetails || {};
    this.pageUrl = data.pageUrl;
    this.performedAt = data.performedAt || new Date();
  }

  // Save the activity log
  async save() {
    // Update or add log to in-memory storage
    const existingIndex = activityLogs.findIndex(log => log._id === this._id);
    if (existingIndex >= 0) {
      activityLogs[existingIndex] = this;
    } else {
      activityLogs.push(this);
    }
    
    return this;
  }

  // Static methods
  static create(logData) {
    const newLog = new ActivityLog(logData);
    return newLog.save();
  }

  static find(query) {
    return Promise.resolve(
      activityLogs.filter(log => {
        if (!query) return true;
        
        for (const [key, value] of Object.entries(query)) {
          if (log[key] !== value) {
            return false;
          }
        }
        return true;
      })
    );
  }
}

module.exports = ActivityLog;
