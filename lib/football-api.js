// Football API helper functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

// Helper function to make authenticated requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Team API functions
export const footballAPI = {
  // Team management
  async createTeam(teamData) {
    return apiRequest('/football/teams', {
      method: 'POST',
      body: JSON.stringify(teamData),
    });
  },

  async getUserTeams(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/football/teams?${queryString}`);
  },

  async getPublicTeams(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/football/teams/public?${queryString}`);
  },

  async getTeamById(teamId) {
    return apiRequest(`/football/teams/${teamId}`);
  },

  async updateTeam(teamId, updates) {
    return apiRequest(`/football/teams/${teamId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteTeam(teamId) {
    return apiRequest(`/football/teams/${teamId}`, {
      method: 'DELETE',
    });
  },

  // Player management
  async addPlayer(teamId, playerData) {
    return apiRequest(`/football/teams/${teamId}/players`, {
      method: 'POST',
      body: JSON.stringify(playerData),
    });
  },

  async updatePlayer(teamId, playerId, updates) {
    return apiRequest(`/football/teams/${teamId}/players/${playerId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async removePlayer(teamId, playerId) {
    return apiRequest(`/football/teams/${teamId}/players/${playerId}`, {
      method: 'DELETE',
    });
  },

  // Helper functions for migration from localStorage
  async migrateFromLocalStorage() {
    if (typeof window === 'undefined') return null;
    
    const savedTeam = localStorage.getItem('footballTeam');
    if (!savedTeam) return null;

    try {
      const teamData = JSON.parse(savedTeam);
      
      // Transform localStorage format to API format
      const apiTeamData = {
        name: teamData.name || 'My Team',
        formation: '4-4-2', // Default formation
        players: (teamData.players || []).map(player => ({
          name: player.name,
          position: player.position,
          overall: player.overallRating || player.overall || 50,
          pace: player.pace || 50,
          shooting: player.shooting || 50,
          passing: player.passing || 50,
          dribbling: player.dribbling || 50,
          defending: player.defending || 50,
          physical: player.physical || 50
        })),
        description: 'Migrated from local storage',
        isPublic: false,
      };

      // Create team in database
      const result = await this.createTeam(apiTeamData);
      
      // Clear localStorage after successful migration
      localStorage.removeItem('footballTeam');
      
      return result;
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  },

  async syncToLocalStorage(teamData) {
    if (typeof window === 'undefined') return;
    
    // Transform API format back to localStorage format for backward compatibility
    const localStorageFormat = {
      name: teamData.name,
      players: teamData.players,
      matches: teamData.matches || [],
    };
    
    localStorage.setItem('footballTeam', JSON.stringify(localStorageFormat));
  },
};

// Auth API functions
export const authAPI = {
  async login(credentials) {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.token) {
      localStorage.setItem('authToken', response.token);
    }
    
    return response;
  },

  async register(userData) {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.token) {
      localStorage.setItem('authToken', response.token);
    }
    
    return response;
  },

  async logout() {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('authToken');
    }
  },

  async getCurrentUser() {
    return apiRequest('/auth/user');
  },

  isAuthenticated() {
    return !!getAuthToken();
  },
};

export default footballAPI;