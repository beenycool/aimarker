export interface Player {
  id?: string;
  _id?: string;
  name: string;
  position: 'GK' | 'CB' | 'LB' | 'RB' | 'CDM' | 'CM' | 'CAM' | 'LW' | 'RW' | 'ST';
  overall?: number;
  overallRating?: number;
  pace?: number;
  shooting?: number;
  passing?: number;
  dribbling?: number;
  defending?: number;
  physical?: number;
  goals?: number;
  assists?: number;
  appearances?: number;
  cleanSheets?: number;
  nationality?: string;
  age?: number;
  height?: number;
  weight?: number;
}

export interface Match {
  id: string;
  date: string;
  opponent: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  playerStats: {
    playerId: string;
    goals: number;
    assists: number;
    rating: number;
  }[];
}

export interface Team {
  id?: string;
  _id?: string;
  name: string;
  formation?: string;
  players: Player[];
  matches: Match[];
  description?: string;
  league?: string;
  season?: string;
  isPublic?: boolean;
  teamRating?: number;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  statistics?: {
    matchesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
  };
}