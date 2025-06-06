import { useState, useEffect, useCallback } from 'react';
import { footballAPI, authAPI } from '../../lib/football-api';

// Custom hook for managing football team data
export const useFootballTeam = () => {
  const [team, setTeam] = useState({
    name: 'My Team',
    players: [],
    matches: []
  });
  const [isOnline, setIsOnline] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTeamId, setCurrentTeamId] = useState(null);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = authAPI.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        try {
          await authAPI.getCurrentUser();
        } catch (error) {
          console.error('Auth check failed:', error);
          setIsAuthenticated(false);
        }
      }
    };
    
    checkAuth();
  }, []);

  // Check if online
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load team data (localStorage fallback when offline or not authenticated)
  const loadTeamData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (isAuthenticated && isOnline) {
        // Try to load from API
        const response = await footballAPI.getUserTeams({ limit: 1 });
        
        if (response.success && response.data.length > 0) {
          const apiTeam = response.data[0];
          setCurrentTeamId(apiTeam.id || apiTeam._id);
          setTeam({
            name: apiTeam.name,
            players: (apiTeam.players || []).map(player => ({
              ...player,
              id: player._id || player.id,
              goals: player.goals || 0,
              assists: player.assists || 0,
              appearances: player.appearances || 0,
              overall: player.overall || 50,
              ...(player.position === 'GK' && { cleanSheets: player.cleanSheets || 0 })
            })),
            matches: apiTeam.matches || []
          });
          
          // Sync to localStorage for offline use
          await footballAPI.syncToLocalStorage(apiTeam);
        } else {
          // No teams found, try to migrate from localStorage or create a new team
          const migrationResult = await footballAPI.migrateFromLocalStorage();
          if (migrationResult?.success) {
            setCurrentTeamId(migrationResult.data.id || migrationResult.data._id);
            setTeam({
              name: migrationResult.data.name,
              players: (migrationResult.data.players || []).map(player => ({
                ...player,
                id: player._id || player.id,
                goals: player.goals || 0,
                assists: player.assists || 0,
                appearances: player.appearances || 0,
                overall: player.overall || 50,
                ...(player.position === 'GK' && { cleanSheets: player.cleanSheets || 0 })
              })),
              matches: migrationResult.data.matches || []
            });
          } else {
            // Create a new empty team
            const newTeamResult = await footballAPI.createTeam({
              name: 'My Team',
              formation: '4-4-2',
              players: [],
              description: 'New team',
              isPublic: false
            });
            
            if (newTeamResult.success) {
              setCurrentTeamId(newTeamResult.data.id || newTeamResult.data._id);
              setTeam({
                name: newTeamResult.data.name,
                players: [],
                matches: []
              });
            }
          }
        }
      } else {
        // Fallback to localStorage
        const savedTeam = localStorage.getItem('footballTeam');
        if (savedTeam) {
          setTeam(JSON.parse(savedTeam));
        }
      }
    } catch (error) {
      console.error('Error loading team data:', error);
      setError(error.message);
      
      // Fallback to localStorage on error
      const savedTeam = localStorage.getItem('footballTeam');
      if (savedTeam) {
        setTeam(JSON.parse(savedTeam));
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isOnline]);

  // Save team data
  const saveTeamData = useCallback(async (newTeam) => {
    try {
      if (isAuthenticated && isOnline && currentTeamId) {
        // Update via API
        const response = await footballAPI.updateTeam(currentTeamId, {
          name: newTeam.name,
          players: newTeam.players,
          // Note: matches might need separate handling depending on your schema
        });
        
        if (response.success) {
          await footballAPI.syncToLocalStorage(response.data);
        }
      } else {
        // Save to localStorage
        localStorage.setItem('footballTeam', JSON.stringify(newTeam));
      }
      
      setTeam(newTeam);
    } catch (error) {
      console.error('Error saving team data:', error);
      setError(error.message);
      
      // Fallback to localStorage
      localStorage.setItem('footballTeam', JSON.stringify(newTeam));
      setTeam(newTeam);
    }
  }, [isAuthenticated, isOnline, currentTeamId]);

  // Load data when dependencies change
  useEffect(() => {
    loadTeamData();
  }, [loadTeamData]);

  // Player management functions
  const addPlayer = useCallback(async (playerData) => {
    try {
      if (isAuthenticated && isOnline && currentTeamId) {
        const response = await footballAPI.addPlayer(currentTeamId, playerData);
        if (response.success) {
          const mappedPlayers = (response.data.players || []).map(player => ({
            ...player,
            id: player._id || player.id,
            goals: player.goals || 0,
            assists: player.assists || 0,
            appearances: player.appearances || 0,
            overall: player.overall || 50,
            ...(player.position === 'GK' && { cleanSheets: player.cleanSheets || 0 })
          }));
          
          setTeam(prev => ({
            ...prev,
            players: mappedPlayers
          }));
          await footballAPI.syncToLocalStorage(response.data);
          return mappedPlayers[mappedPlayers.length - 1];
        }
      } else {
        // Local addition
        const newPlayer = {
          id: Date.now().toString(),
          ...playerData
        };
        const newTeam = {
          ...team,
          players: [...team.players, newPlayer]
        };
        await saveTeamData(newTeam);
        return newPlayer;
      }
    } catch (error) {
      console.error('Error adding player:', error);
      setError(error.message);
      throw error;
    }
  }, [isAuthenticated, isOnline, currentTeamId, team, saveTeamData]);

  const updatePlayer = useCallback(async (playerId, updates) => {
    try {
      if (isAuthenticated && isOnline && currentTeamId) {
        const response = await footballAPI.updatePlayer(currentTeamId, playerId, updates);
        if (response.success) {
          const mappedPlayers = (response.data.players || []).map(player => ({
            ...player,
            id: player._id || player.id,
            goals: player.goals || 0,
            assists: player.assists || 0,
            appearances: player.appearances || 0,
            overall: player.overall || 50,
            ...(player.position === 'GK' && { cleanSheets: player.cleanSheets || 0 })
          }));
          
          setTeam(prev => ({
            ...prev,
            players: mappedPlayers
          }));
          await footballAPI.syncToLocalStorage(response.data);
          return;
        }
      }
      
      // Local update
      const newTeam = {
        ...team,
        players: team.players.map(player => 
          player.id === playerId ? { ...player, ...updates } : player
        )
      };
      await saveTeamData(newTeam);
    } catch (error) {
      console.error('Error updating player:', error);
      setError(error.message);
      throw error;
    }
  }, [isAuthenticated, isOnline, currentTeamId, team, saveTeamData]);

  const removePlayer = useCallback(async (playerId) => {
    try {
      if (isAuthenticated && isOnline && currentTeamId) {
        const response = await footballAPI.removePlayer(currentTeamId, playerId);
        if (response.success) {
          const mappedPlayers = (response.data.players || []).map(player => ({
            ...player,
            id: player._id || player.id,
            goals: player.goals || 0,
            assists: player.assists || 0,
            appearances: player.appearances || 0,
            overall: player.overall || 50,
            ...(player.position === 'GK' && { cleanSheets: player.cleanSheets || 0 })
          }));
          
          setTeam(prev => ({
            ...prev,
            players: mappedPlayers
          }));
          await footballAPI.syncToLocalStorage(response.data);
          return;
        }
      }
      
      // Local removal
      const newTeam = {
        ...team,
        players: team.players.filter(player => player.id !== playerId)
      };
      await saveTeamData(newTeam);
    } catch (error) {
      console.error('Error removing player:', error);
      setError(error.message);
      throw error;
    }
  }, [isAuthenticated, isOnline, currentTeamId, team, saveTeamData]);

  const clearTeamData = useCallback(async () => {
    try {
      if (isAuthenticated && isOnline && currentTeamId) {
        await footballAPI.deleteTeam(currentTeamId);
        setCurrentTeamId(null);
      }
      
      const emptyTeam = {
        name: 'My Team',
        players: [],
        matches: []
      };
      
      localStorage.removeItem('footballTeam');
      setTeam(emptyTeam);
    } catch (error) {
      console.error('Error clearing team data:', error);
      setError(error.message);
      throw error;
    }
  }, [isAuthenticated, isOnline, currentTeamId]);

  return {
    team,
    isLoading,
    error,
    isOnline,
    isAuthenticated,
    currentTeamId,
    addPlayer,
    updatePlayer,
    removePlayer,
    saveTeamData,
    clearTeamData,
    reloadTeamData: loadTeamData,
    setError
  };
};