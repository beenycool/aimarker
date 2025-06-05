// Utility functions for the football tracker

// Function to clear all data
export const clearAllData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('footballTeam');
  }
};

// Function to get team stats
export const getTeamStats = (players: any[]) => {
  return {
    totalPlayers: players.length,
    totalGoals: players.reduce((sum, player) => sum + player.goals, 0),
    totalAssists: players.reduce((sum, player) => sum + player.assists, 0),
    averageRating: players.length > 0 
      ? Math.round(players.reduce((sum, player) => sum + player.overallRating, 0) / players.length)
      : 0,
    topScorer: players.length > 0
      ? players.reduce((top, player) => 
          player.goals > top.goals ? player : top, players[0]
        )
      : { goals: 0, name: 'None' },
    highestRated: players.length > 0
      ? players.reduce((top, player) => 
          player.overallRating > top.overallRating ? player : top, players[0]
        )
      : { overallRating: 0, name: 'None' }
  };
};