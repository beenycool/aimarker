import mongoose, { Document, Schema, Types } from 'mongoose';

// TypeScript interfaces for nested objects
export interface IPlayer {
  name: string;
  position: 'GK' | 'CB' | 'LB' | 'RB' | 'CDM' | 'CM' | 'CAM' | 'LM' | 'RM' | 'LW' | 'RW' | 'CF' | 'ST';
  overall: number;
  pace?: number;
  shooting?: number;
  passing?: number;
  dribbling?: number;
  defending?: number;
  physical?: number;
  nationality?: string;
  age?: number;
  height?: number;
  weight?: number;
}

export interface IFormation {
  name: '4-4-2' | '4-3-3' | '3-5-2' | '5-3-2' | '4-2-3-1' | '3-4-3' | '4-5-1' | '5-4-1';
  positions: {
    [key: string]: {
      x: number;
      y: number;
    };
  };
}

// TypeScript interface for FootballTeam
export interface IFootballTeam extends Document {
  name: string;
  formation: string;
  players: IPlayer[];
  createdBy: Types.ObjectId;
  isPublic: boolean;
  description?: string;
  league?: string;
  season?: string;
  teamRating: number;
  tactics?: {
    attackingStyle?: 'Possession' | 'Counter Attack' | 'High Press' | 'Wing Play';
    defensiveStyle?: 'High Line' | 'Deep Block' | 'Pressing' | 'Zonal Marking';
    buildUpPlay?: 'Short Passing' | 'Long Ball' | 'Balanced';
  };
  statistics?: {
    matchesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Player sub-schema
const PlayerSchema = new Schema<IPlayer>({
  name: {
    type: String,
    required: [true, 'Player name is required'],
    trim: true,
    maxlength: [50, 'Player name cannot exceed 50 characters']
  },
  position: {
    type: String,
    required: [true, 'Player position is required'],
    enum: {
      values: ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'CF', 'ST'],
      message: '{VALUE} is not a valid position'
    }
  },
  overall: {
    type: Number,
    required: [true, 'Player overall rating is required'],
    min: [1, 'Overall rating must be at least 1'],
    max: [99, 'Overall rating cannot exceed 99']
  },
  pace: {
    type: Number,
    min: [1, 'Pace must be at least 1'],
    max: [99, 'Pace cannot exceed 99']
  },
  shooting: {
    type: Number,
    min: [1, 'Shooting must be at least 1'],
    max: [99, 'Shooting cannot exceed 99']
  },
  passing: {
    type: Number,
    min: [1, 'Passing must be at least 1'],
    max: [99, 'Passing cannot exceed 99']
  },
  dribbling: {
    type: Number,
    min: [1, 'Dribbling must be at least 1'],
    max: [99, 'Dribbling cannot exceed 99']
  },
  defending: {
    type: Number,
    min: [1, 'Defending must be at least 1'],
    max: [99, 'Defending cannot exceed 99']
  },
  physical: {
    type: Number,
    min: [1, 'Physical must be at least 1'],
    max: [99, 'Physical cannot exceed 99']
  },
  nationality: {
    type: String,
    maxlength: [50, 'Nationality cannot exceed 50 characters']
  },
  age: {
    type: Number,
    min: [15, 'Age must be at least 15'],
    max: [45, 'Age cannot exceed 45']
  },
  height: {
    type: Number,
    min: [150, 'Height must be at least 150cm'],
    max: [220, 'Height cannot exceed 220cm']
  },
  weight: {
    type: Number,
    min: [50, 'Weight must be at least 50kg'],
    max: [120, 'Weight cannot exceed 120kg']
  }
});

// Main FootballTeam schema
const FootballTeamSchema: Schema<IFootballTeam> = new Schema({
  name: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true,
    maxlength: [100, 'Team name cannot exceed 100 characters'],
    minlength: [2, 'Team name must be at least 2 characters']
  },
  formation: {
    type: String,
    required: [true, 'Formation is required'],
    enum: {
      values: ['4-4-2', '4-3-3', '3-5-2', '5-3-2', '4-2-3-1', '3-4-3', '4-5-1', '5-4-1'],
      message: '{VALUE} is not a valid formation'
    }
  },
  players: {
    type: [PlayerSchema],
    validate: {
      validator: function(players: IPlayer[]) {
        return players.length <= 25; // Maximum squad size
      },
      message: 'Squad cannot exceed 25 players'
    }
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required'],
    index: true
  },
  isPublic: {
    type: Boolean,
    default: false,
    index: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  league: {
    type: String,
    maxlength: [100, 'League name cannot exceed 100 characters']
  },
  season: {
    type: String,
    maxlength: [20, 'Season cannot exceed 20 characters']
  },
  teamRating: {
    type: Number,
    min: [1, 'Team rating must be at least 1'],
    max: [99, 'Team rating cannot exceed 99'],
    default: 0
  },
  tactics: {
    attackingStyle: {
      type: String,
      enum: ['Possession', 'Counter Attack', 'High Press', 'Wing Play']
    },
    defensiveStyle: {
      type: String,
      enum: ['High Line', 'Deep Block', 'Pressing', 'Zonal Marking']
    },
    buildUpPlay: {
      type: String,
      enum: ['Short Passing', 'Long Ball', 'Balanced']
    }
  },
  statistics: {
    matchesPlayed: { type: Number, default: 0, min: 0 },
    wins: { type: Number, default: 0, min: 0 },
    draws: { type: Number, default: 0, min: 0 },
    losses: { type: Number, default: 0, min: 0 },
    goalsFor: { type: Number, default: 0, min: 0 },
    goalsAgainst: { type: Number, default: 0, min: 0 }
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

// Indexes for efficient querying
FootballTeamSchema.index({ createdBy: 1, createdAt: -1 });
FootballTeamSchema.index({ isPublic: 1, teamRating: -1 });
FootballTeamSchema.index({ name: 'text', description: 'text' });

// Pre-save middleware to calculate team rating
FootballTeamSchema.pre<IFootballTeam>('save', function(next: any) {
  if (this.players && this.players.length > 0) {
    const totalRating = this.players.reduce((sum, player) => sum + player.overall, 0);
    this.teamRating = Math.round(totalRating / this.players.length);
  }
  next();
});

// Instance method to get starting XI
FootballTeamSchema.methods.getStartingXI = function() {
  return this.players.slice(0, 11);
};

// Instance method to get bench players
FootballTeamSchema.methods.getBenchPlayers = function() {
  return this.players.slice(11);
};

// Static method to find public teams
FootballTeamSchema.statics.findPublicTeams = function(limit = 10, skip = 0) {
  return this.find({ isPublic: true })
    .sort({ teamRating: -1, createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('createdBy', 'username');
};

// Export the model
export const FootballTeam = mongoose.model<IFootballTeam>('FootballTeam', FootballTeamSchema);
export default FootballTeam;