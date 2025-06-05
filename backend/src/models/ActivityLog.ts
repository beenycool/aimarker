import mongoose, { Document, Schema, Types } from 'mongoose';

// TypeScript interface for ActivityLog
export interface IActivityLog extends Document {
  userId: Types.ObjectId;
  action: 'LOGIN' | 'LOGOUT' | 'SUBMIT_QUESTION' | 'VIEW_FEEDBACK' | 'EXPORT_DATA' | 'IMPORT_CSV' | 'SAVE_TEAM';
  details: {
    question?: string;
    subject?: string;
    level?: string;
    submissionId?: string;
    teamId?: string;
    exportFormat?: string;
    csvFileName?: string;
    errorMessage?: string;
    [key: string]: any;
  };
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema for ActivityLog
const ActivityLogSchema: Schema<IActivityLog> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
    enum: {
      values: ['LOGIN', 'LOGOUT', 'SUBMIT_QUESTION', 'VIEW_FEEDBACK', 'EXPORT_DATA', 'IMPORT_CSV', 'SAVE_TEAM'],
      message: '{VALUE} is not a valid action'
    },
    index: true
  },
  details: {
    type: Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  ipAddress: {
    type: String,
    validate: {
      validator: function(ip: string) {
        if (!ip) return true; // Optional field
        // Basic IP validation (IPv4 and IPv6)
        const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
        return ipv4Regex.test(ip) || ipv6Regex.test(ip);
      },
      message: 'Invalid IP address format'
    }
  },
  userAgent: {
    type: String,
    maxlength: [500, 'User agent cannot exceed 500 characters']
  },
  success: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Compound indexes for efficient querying
ActivityLogSchema.index({ userId: 1, timestamp: -1 });
ActivityLogSchema.index({ action: 1, timestamp: -1 });
ActivityLogSchema.index({ success: 1, timestamp: -1 });

// Static method to log activity
ActivityLogSchema.statics.logActivity = async function(
  userId: Types.ObjectId, 
  action: IActivityLog['action'], 
  details: IActivityLog['details'] = {},
  metadata: { ipAddress?: string; userAgent?: string; success?: boolean } = {}
) {
  try {
    const log = new this({
      userId,
      action,
      details,
      timestamp: new Date(),
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
      success: metadata.success !== false // Default to true unless explicitly false
    });
    
    return await log.save();
  } catch (error) {
    console.error('Error logging activity:', error);
    throw error;
  }
};

// Instance method to get formatted log entry
ActivityLogSchema.methods.getFormattedEntry = function() {
  return {
    id: this._id,
    userId: this.userId,
    action: this.action,
    details: this.details,
    timestamp: this.timestamp,
    success: this.success,
    createdAt: this.createdAt
  };
};

// Export the model
export const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
export default ActivityLog;