// Demo data for the football tracker
export const samplePlayers = [
  {
    id: '1',
    name: 'Alex Martinez',
    position: 'ST' as const,
    pace: 87,
    shooting: 92,
    passing: 78,
    dribbling: 89,
    defending: 35,
    physical: 82,
    overallRating: 85,
    goals: 15,
    assists: 7,
    appearances: 20
  },
  {
    id: '2',
    name: 'Jamie Thompson',
    position: 'GK' as const,
    pace: 45,
    shooting: 25,
    passing: 68,
    dribbling: 42,
    defending: 89,
    physical: 85,
    overallRating: 78,
    goals: 0,
    assists: 2,
    appearances: 20,
    cleanSheets: 12
  },
  {
    id: '3',
    name: 'Sam Wilson',
    position: 'CM' as const,
    pace: 72,
    shooting: 65,
    passing: 91,
    dribbling: 83,
    defending: 76,
    physical: 70,
    overallRating: 81,
    goals: 8,
    assists: 14,
    appearances: 19
  },
  {
    id: '4',
    name: 'Ryan Davies',
    position: 'CB' as const,
    pace: 58,
    shooting: 35,
    passing: 72,
    dribbling: 45,
    defending: 90,
    physical: 88,
    overallRating: 76,
    goals: 3,
    assists: 1,
    appearances: 18
  },
  {
    id: '5',
    name: 'Casey Park',
    position: 'LW' as const,
    pace: 93,
    shooting: 78,
    passing: 74,
    dribbling: 91,
    defending: 28,
    physical: 68,
    overallRating: 82,
    goals: 12,
    assists: 9,
    appearances: 17
  },
  {
    id: '6',
    name: 'Jordan Lee',
    position: 'CDM' as const,
    pace: 65,
    shooting: 58,
    passing: 88,
    dribbling: 70,
    defending: 85,
    physical: 79,
    overallRating: 79,
    goals: 4,
    assists: 8,
    appearances: 20
  },
  {
    id: '7',
    name: 'Taylor Brown',
    position: 'RB' as const,
    pace: 81,
    shooting: 42,
    passing: 79,
    dribbling: 68,
    defending: 78,
    physical: 75,
    overallRating: 74,
    goals: 2,
    assists: 11,
    appearances: 19
  }
];

export const sampleTeam = {
  name: 'Riverside High School FC',
  players: samplePlayers,
  matches: []
};

// Function to load sample data
export const loadSampleData = () => {
  if (typeof window !== 'undefined') {
    const existingData = localStorage.getItem('schoolFootballTeam');
    if (!existingData || JSON.parse(existingData).players.length === 0) {
      localStorage.setItem('schoolFootballTeam', JSON.stringify(sampleTeam));
      return true; // Indicates sample data was loaded
    }
  }
  return false; // Indicates existing data was kept
};

// Function to clear all data
export const clearAllData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('schoolFootballTeam');
  }
};

// Function to get team stats
export const getTeamStats = (players: typeof samplePlayers) => {
  return {
    totalPlayers: players.length,
    totalGoals: players.reduce((sum, player) => sum + player.goals, 0),
    totalAssists: players.reduce((sum, player) => sum + player.assists, 0),
    averageRating: players.length > 0 
      ? Math.round(players.reduce((sum, player) => sum + player.overallRating, 0) / players.length)
      : 0,
    topScorer: players.reduce((top, player) => 
      player.goals > top.goals ? player : top, players[0] || { goals: 0, name: 'None' }
    ),
    highestRated: players.reduce((top, player) => 
      player.overallRating > top.overallRating ? player : top, players[0] || { overallRating: 0, name: 'None' }
    )
  };
};