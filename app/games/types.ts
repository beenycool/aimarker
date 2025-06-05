export interface Player {
  id: string;
  name: string;
  position: 'GK' | 'CB' | 'LB' | 'RB' | 'CDM' | 'CM' | 'CAM' | 'LW' | 'RW' | 'ST';
  overallRating: number;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  goals: number;
  assists: number;
  appearances: number;
  cleanSheets?: number; // for goalkeepers
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
  name: string;
  players: Player[];
  matches: Match[];
}