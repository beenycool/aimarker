const { FootballTeam } = require('../models/FootballTeam.ts');

// Create a new football team
const createTeam = async (req, res) => {
  try {
    const { name, formation, players, description, league, season, isPublic, tactics } = req.body;
    
    if (!name || !formation) {
      return res.status(400).json({
        success: false,
        message: 'Team name and formation are required'
      });
    }

    const team = new FootballTeam({
      name,
      formation,
      players: players || [],
      description,
      league,
      season,
      isPublic: isPublic || false,
      tactics,
      createdBy: req.user.id, // From auth middleware
      statistics: {
        matchesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0
      }
    });

    await team.save();

    res.status(201).json({
      success: true,
      data: team,
      message: 'Team created successfully'
    });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating team',
      error: error.message
    });
  }
};

// Get all teams for the authenticated user
const getUserTeams = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    const teams = await FootballTeam.find({ createdBy: req.user.id })
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'username');

    const total = await FootballTeam.countDocuments({ createdBy: req.user.id });

    res.json({
      success: true,
      data: teams,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching user teams:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching teams',
      error: error.message
    });
  }
};

// Get a specific team by ID
const getTeamById = async (req, res) => {
  try {
    const team = await FootballTeam.findById(req.params.id).populate('createdBy', 'username');
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if user owns the team or if it's public
    if (team.createdBy._id.toString() !== req.user.id && !team.isPublic) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: team
    });
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching team',
      error: error.message
    });
  }
};

// Update a team
const updateTeam = async (req, res) => {
  try {
    const team = await FootballTeam.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if user owns the team
    if (team.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const allowedUpdates = ['name', 'formation', 'players', 'description', 'league', 'season', 'isPublic', 'tactics', 'statistics'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedTeam = await FootballTeam.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username');

    res.json({
      success: true,
      data: updatedTeam,
      message: 'Team updated successfully'
    });
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating team',
      error: error.message
    });
  }
};

// Delete a team
const deleteTeam = async (req, res) => {
  try {
    const team = await FootballTeam.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if user owns the team
    if (team.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await FootballTeam.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Team deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting team',
      error: error.message
    });
  }
};

// Get public teams
const getPublicTeams = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'teamRating', order = 'desc' } = req.query;
    
    const teams = await FootballTeam.findPublicTeams(limit * 1, (page - 1) * limit);
    const total = await FootballTeam.countDocuments({ isPublic: true });

    res.json({
      success: true,
      data: teams,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching public teams:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching public teams',
      error: error.message
    });
  }
};

// Add a player to a team
const addPlayer = async (req, res) => {
  try {
    const team = await FootballTeam.findById(req.params.teamId);
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if user owns the team
    if (team.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { name, position, overall, pace, shooting, passing, dribbling, defending, physical, nationality, age, height, weight } = req.body;
    
    if (!name || !position || !overall) {
      return res.status(400).json({
        success: false,
        message: 'Player name, position, and overall rating are required'
      });
    }

    const newPlayer = {
      name,
      position,
      overall,
      pace,
      shooting,
      passing,
      dribbling,
      defending,
      physical,
      nationality,
      age,
      height,
      weight
    };

    team.players.push(newPlayer);
    await team.save();

    res.status(201).json({
      success: true,
      data: team,
      message: 'Player added successfully'
    });
  } catch (error) {
    console.error('Error adding player:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding player',
      error: error.message
    });
  }
};

// Update a player in a team
const updatePlayer = async (req, res) => {
  try {
    const team = await FootballTeam.findById(req.params.teamId);
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if user owns the team
    if (team.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const playerIndex = team.players.findIndex(p => p._id.toString() === req.params.playerId);
    
    if (playerIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    const allowedUpdates = ['name', 'position', 'overall', 'pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical', 'nationality', 'age', 'height', 'weight'];
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        team.players[playerIndex][field] = req.body[field];
      }
    });

    await team.save();

    res.json({
      success: true,
      data: team,
      message: 'Player updated successfully'
    });
  } catch (error) {
    console.error('Error updating player:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating player',
      error: error.message
    });
  }
};

// Remove a player from a team
const removePlayer = async (req, res) => {
  try {
    const team = await FootballTeam.findById(req.params.teamId);
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if user owns the team
    if (team.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const playerIndex = team.players.findIndex(p => p._id.toString() === req.params.playerId);
    
    if (playerIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    team.players.splice(playerIndex, 1);
    await team.save();

    res.json({
      success: true,
      data: team,
      message: 'Player removed successfully'
    });
  } catch (error) {
    console.error('Error removing player:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing player',
      error: error.message
    });
  }
};

module.exports = {
  createTeam,
  getUserTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  getPublicTeams,
  addPlayer,
  updatePlayer,
  removePlayer
};