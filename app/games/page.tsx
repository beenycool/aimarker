"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Plus, Trophy, Target, Users, Star, Edit2, Trash2, Download, RotateCcw, Play, Settings, Clock, BarChart3, Award, Grid3X3, Database, Calendar } from 'lucide-react';
import { loadSampleData, clearAllData } from './demo-data';
import { Player, Team, Match } from './types';
import { FootballSimulation, SimulationSettings, SimulationResult, GameEvent } from './simulation-engine';
import { FormationView } from './formation-view';
import { PlayerComparison } from './player-comparison';
import { Achievements } from './achievements';
import { TeamExport } from './team-export';
import { SeasonMode } from './season-mode';
import { QuickPlayerCreator } from './quick-player-creator';
import { ManualMatchEntry } from './manual-match-entry';

const POSITIONS = [
  { value: 'GK', label: 'Goalkeeper' },
  { value: 'CB', label: 'Centre Back' },
  { value: 'LB', label: 'Left Back' },
  { value: 'RB', label: 'Right Back' },
  { value: 'CDM', label: 'Defensive Midfielder' },
  { value: 'CM', label: 'Central Midfielder' },
  { value: 'CAM', label: 'Attacking Midfielder' },
  { value: 'LW', label: 'Left Winger' },
  { value: 'RW', label: 'Right Winger' },
  { value: 'ST', label: 'Striker' }
];

const getPositionColor = (position: string) => {
  switch (position) {
    case 'GK': return 'bg-yellow-500';
    case 'CB': case 'LB': case 'RB': return 'bg-green-500';
    case 'CDM': case 'CM': case 'CAM': return 'bg-blue-500';
    case 'LW': case 'RW': case 'ST': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getRatingColor = (rating: number) => {
  if (rating >= 90) return 'text-green-600 font-bold';
  if (rating >= 80) return 'text-blue-600 font-semibold';
  if (rating >= 70) return 'text-yellow-600';
  if (rating >= 60) return 'text-orange-600';
  return 'text-red-600';
};

export default function GamesPage() {
  const [team, setTeam] = useState<Team>({
    name: 'School Football Team',
    players: [],
    matches: []
  });

  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
  const [isAddMatchOpen, setIsAddMatchOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  
  // Simulation state
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [simulationEvents, setSimulationEvents] = useState<GameEvent[]>([]);
  const [currentMinute, setCurrentMinute] = useState(0);
  const [simulationSettings, setSimulationSettings] = useState<SimulationSettings>({
    gameSpeed: 5,
    gameDuration: 90,
    difficulty: 'medium',
    opponentStrength: 75,
    weatherCondition: 'sunny',
    pitchCondition: 'excellent'
  });
  
  // Player stats modal
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isPlayerStatsOpen, setIsPlayerStatsOpen] = useState(false);

  const [newPlayer, setNewPlayer] = useState<Partial<Player>>({
    name: '',
    position: 'ST',
    pace: 50,
    shooting: 50,
    passing: 50,
    dribbling: 50,
    defending: 50,
    physical: 50
  });

  const [newMatch, setNewMatch] = useState({
    opponent: '',
    homeTeam: team.name,
    awayTeam: '',
    homeScore: 0,
    awayScore: 0,
    date: new Date().toISOString().split('T')[0]
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTeam = localStorage.getItem('schoolFootballTeam');
    if (savedTeam) {
      setTeam(JSON.parse(savedTeam));
    }
  }, []);

  // Save data to localStorage whenever team changes
  useEffect(() => {
    localStorage.setItem('schoolFootballTeam', JSON.stringify(team));
  }, [team]);

  const calculateOverallRating = (player: Partial<Player>) => {
    const { pace = 50, shooting = 50, passing = 50, dribbling = 50, defending = 50, physical = 50, position = 'ST' } = player;
    
    // Different weightings based on position
    let weights;
    switch (position) {
      case 'GK':
        weights = { pace: 0.1, shooting: 0.05, passing: 0.15, dribbling: 0.1, defending: 0.4, physical: 0.2 };
        break;
      case 'CB':
        weights = { pace: 0.1, shooting: 0.05, passing: 0.15, dribbling: 0.05, defending: 0.45, physical: 0.2 };
        break;
      case 'LB':
      case 'RB':
        weights = { pace: 0.2, shooting: 0.05, passing: 0.2, dribbling: 0.15, defending: 0.25, physical: 0.15 };
        break;
      case 'CDM':
        weights = { pace: 0.15, shooting: 0.1, passing: 0.25, dribbling: 0.15, defending: 0.25, physical: 0.1 };
        break;
      case 'CM':
        weights = { pace: 0.15, shooting: 0.15, passing: 0.25, dribbling: 0.2, defending: 0.15, physical: 0.1 };
        break;
      case 'CAM':
        weights = { pace: 0.15, shooting: 0.2, passing: 0.25, dribbling: 0.25, defending: 0.05, physical: 0.1 };
        break;
      case 'LW':
      case 'RW':
        weights = { pace: 0.25, shooting: 0.2, passing: 0.15, dribbling: 0.25, defending: 0.05, physical: 0.1 };
        break;
      case 'ST':
        weights = { pace: 0.2, shooting: 0.3, passing: 0.1, dribbling: 0.2, defending: 0.05, physical: 0.15 };
        break;
      default:
        weights = { pace: 0.17, shooting: 0.17, passing: 0.17, dribbling: 0.17, defending: 0.17, physical: 0.15 };
    }

    const overall = Math.round(
      pace * weights.pace +
      shooting * weights.shooting +
      passing * weights.passing +
      dribbling * weights.dribbling +
      defending * weights.defending +
      physical * weights.physical
    );

    return Math.min(99, Math.max(40, overall));
  };

  const handleAddPlayer = () => {
    if (!newPlayer.name) return;

    const player: Player = {
      id: Date.now().toString(),
      name: newPlayer.name,
      position: newPlayer.position as Player['position'],
      pace: newPlayer.pace || 50,
      shooting: newPlayer.shooting || 50,
      passing: newPlayer.passing || 50,
      dribbling: newPlayer.dribbling || 50,
      defending: newPlayer.defending || 50,
      physical: newPlayer.physical || 50,
      overallRating: calculateOverallRating(newPlayer),
      goals: 0,
      assists: 0,
      appearances: 0,
      ...(newPlayer.position === 'GK' && { cleanSheets: 0 })
    };

    setTeam(prev => ({
      ...prev,
      players: [...prev.players, player]
    }));

    setNewPlayer({
      name: '',
      position: 'ST',
      pace: 50,
      shooting: 50,
      passing: 50,
      dribbling: 50,
      defending: 50,
      physical: 50
    });
    setIsAddPlayerOpen(false);
  };

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setNewPlayer({
      name: player.name,
      position: player.position,
      pace: player.pace,
      shooting: player.shooting,
      passing: player.passing,
      dribbling: player.dribbling,
      defending: player.defending,
      physical: player.physical
    });
    setIsAddPlayerOpen(true);
  };

  const handleUpdatePlayer = () => {
    if (!editingPlayer || !newPlayer.name) return;

    const updatedPlayer: Player = {
      ...editingPlayer,
      name: newPlayer.name,
      position: newPlayer.position as Player['position'],
      pace: newPlayer.pace || 50,
      shooting: newPlayer.shooting || 50,
      passing: newPlayer.passing || 50,
      dribbling: newPlayer.dribbling || 50,
      defending: newPlayer.defending || 50,
      physical: newPlayer.physical || 50,
      overallRating: calculateOverallRating(newPlayer)
    };

    setTeam(prev => ({
      ...prev,
      players: prev.players.map(p => p.id === editingPlayer.id ? updatedPlayer : p)
    }));

    setEditingPlayer(null);
    setNewPlayer({
      name: '',
      position: 'ST',
      pace: 50,
      shooting: 50,
      passing: 50,
      dribbling: 50,
      defending: 50,
      physical: 50
    });
    setIsAddPlayerOpen(false);
  };

  const handleDeletePlayer = (playerId: string) => {
    setTeam(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== playerId)
    }));
  };

  const handleLoadSampleData = () => {
    const loaded = loadSampleData();
    if (loaded) {
      // Force reload from localStorage
      const savedTeam = localStorage.getItem('schoolFootballTeam');
      if (savedTeam) {
        setTeam(JSON.parse(savedTeam));
      }
    }
  };

  const handleClearAllData = () => {
    clearAllData();
    setTeam({
      name: 'School Football Team',
      players: [],
      matches: []
    });
  };

  const handleImportTeam = (importedTeam: Team) => {
    setTeam(importedTeam);
    localStorage.setItem('schoolFootballTeam', JSON.stringify(importedTeam));
  };

  const handleTeamUpdate = (updatedTeam: Team) => {
    setTeam(updatedTeam);
    localStorage.setItem('schoolFootballTeam', JSON.stringify(updatedTeam));
  };

  const handleQuickCreatePlayer = (player: Player) => {
    setTeam(prev => ({
      ...prev,
      players: [...prev.players, player]
    }));
  };

  const handleQuickCreateMultiple = (players: Player[]) => {
    setTeam(prev => ({
      ...prev,
      players: [...prev.players, ...players]
    }));
  };

  const handleManualMatchEntry = (match: Match) => {
    // Update player stats based on the match
    const updatedPlayers = team.players.map(player => {
      const playerStat = match.playerStats.find(ps => ps.playerId === player.id);
      if (playerStat) {
        return {
          ...player,
          goals: player.goals + playerStat.goals,
          assists: player.assists + playerStat.assists,
          appearances: player.appearances + 1
        };
      }
      return { ...player, appearances: player.appearances + 1 };
    });

    // Add match to team history
    const updatedTeam = {
      ...team,
      players: updatedPlayers,
      matches: [...team.matches, match]
    };

    setTeam(updatedTeam);
    localStorage.setItem('schoolFootballTeam', JSON.stringify(updatedTeam));
  };

  const handleViewPlayerStats = (player: Player) => {
    setSelectedPlayer(player);
    setIsPlayerStatsOpen(true);
  };

  const getPlayerMatchHistory = (playerId: string) => {
    return team.matches.map(match => {
      const playerStat = match.playerStats.find(ps => ps.playerId === playerId);
      return {
        ...match,
        playerPerformance: playerStat || { goals: 0, assists: 0, rating: 6.0 }
      };
    });
  };

  const getPlayerAdvancedStats = (player: Player) => {
    const matchHistory = getPlayerMatchHistory(player.id);
    const totalMatches = matchHistory.length;
    
    if (totalMatches === 0) {
      return {
        averageRating: 0,
        goalsPerGame: 0,
        assistsPerGame: 0,
        totalGoalContributions: player.goals + player.assists,
        bestRating: 0,
        worstRating: 0,
        cleanSheetsPercentage: 0,
        formRating: 0
      };
    }

    const ratings = matchHistory.map(m => m.playerPerformance.rating);
    const totalGoalsInMatches = matchHistory.reduce((sum, m) => sum + m.playerPerformance.goals, 0);
    const totalAssistsInMatches = matchHistory.reduce((sum, m) => sum + m.playerPerformance.assists, 0);
    
    // Form rating (last 5 matches)
    const recentMatches = matchHistory.slice(-5);
    const formRating = recentMatches.length > 0
      ? recentMatches.reduce((sum, m) => sum + m.playerPerformance.rating, 0) / recentMatches.length
      : 0;

    // Clean sheets (for goalkeepers)
    const cleanSheets = player.position === 'GK'
      ? matchHistory.filter(m => m.awayScore === 0).length
      : 0;

    return {
      averageRating: ratings.reduce((sum, r) => sum + r, 0) / ratings.length,
      goalsPerGame: totalGoalsInMatches / totalMatches,
      assistsPerGame: totalAssistsInMatches / totalMatches,
      totalGoalContributions: player.goals + player.assists,
      bestRating: Math.max(...ratings),
      worstRating: Math.min(...ratings),
      cleanSheetsPercentage: player.position === 'GK' ? (cleanSheets / totalMatches) * 100 : 0,
      formRating: formRating
    };
  };

  const handleStartSimulation = async () => {
    if (team.players.length === 0) {
      alert('Please add some players to your team first!');
      return;
    }
    
    setIsSimulating(true);
    setSimulationEvents([]);
    setCurrentMinute(0);
    setSimulationResult(null);
    
    const simulation = new FootballSimulation(team, simulationSettings);
    
    try {
      const result = await simulation.simulate((minute, event) => {
        setCurrentMinute(minute);
        if (event) {
          setSimulationEvents(prev => [...prev, event]);
        }
      });
      
      setSimulationResult(result);
      
      // Update player stats in team
      const updatedPlayers = team.players.map(player => {
        const playerStat = result.playerStats.find(ps => ps.playerId === player.id);
        if (playerStat) {
          return {
            ...player,
            goals: player.goals + playerStat.goals,
            assists: player.assists + playerStat.assists,
            appearances: player.appearances + 1
          };
        }
        return { ...player, appearances: player.appearances + 1 };
      });
      
      // Create match record
      const newMatch: Match = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        opponent: 'AI Opposition',
        homeTeam: team.name,
        awayTeam: 'AI Opposition',
        homeScore: result.homeScore,
        awayScore: result.awayScore,
        playerStats: result.playerStats.map(ps => ({
          playerId: ps.playerId,
          goals: ps.goals,
          assists: ps.assists,
          rating: ps.rating
        }))
      };
      
      setTeam(prev => ({
        ...prev,
        players: updatedPlayers,
        matches: [...prev.matches, newMatch]
      }));
      
    } catch (error) {
      console.error('Simulation error:', error);
    }
    
    setIsSimulating(false);
  };

  const topScorers = [...team.players]
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 5);

  const topRated = [...team.players]
    .sort((a, b) => b.overallRating - a.overallRating)
    .slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-2 flex items-center justify-center gap-2">
          <Trophy className="text-yellow-500" />
          {team.name}
        </h1>
        <p className="text-center text-muted-foreground">FIFA-Style Football Management System</p>
      </div>

      <Tabs defaultValue="squad" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-10">
          <TabsTrigger value="squad" className="flex items-center gap-1 text-xs lg:text-sm">
            <Users size={14} />
            <span className="hidden sm:inline">Squad</span>
          </TabsTrigger>
          <TabsTrigger value="formation" className="flex items-center gap-1 text-xs lg:text-sm">
            <Grid3X3 size={14} />
            <span className="hidden sm:inline">Formation</span>
          </TabsTrigger>
          <TabsTrigger value="simulation" className="flex items-center gap-1 text-xs lg:text-sm">
            <Play size={14} />
            <span className="hidden sm:inline">Simulate</span>
          </TabsTrigger>
          <TabsTrigger value="season" className="flex items-center gap-1 text-xs lg:text-sm">
            <Calendar size={14} />
            <span className="hidden sm:inline">Season</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-1 text-xs lg:text-sm">
            <BarChart3 size={14} />
            <span className="hidden sm:inline">Compare</span>
          </TabsTrigger>
          <TabsTrigger value="matches" className="flex items-center gap-1 text-xs lg:text-sm">
            <Trophy size={14} />
            <span className="hidden sm:inline">Matches</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-1 text-xs lg:text-sm">
            <Target size={14} />
            <span className="hidden sm:inline">Stats</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-1 text-xs lg:text-sm">
            <Award size={14} />
            <span className="hidden sm:inline">Achievements</span>
          </TabsTrigger>
          <TabsTrigger value="management" className="flex items-center gap-1 text-xs lg:text-sm">
            <Database size={14} />
            <span className="hidden sm:inline">Export</span>
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-1 text-xs lg:text-sm">
            <Star size={14} />
            <span className="hidden sm:inline">Leaders</span>
          </TabsTrigger>
        </TabsList>

        {/* Squad Tab */}
        <TabsContent value="squad" className="space-y-4">
          {/* Quick Player Creator */}
          <QuickPlayerCreator
            onCreatePlayer={handleQuickCreatePlayer}
            onCreateMultiple={handleQuickCreateMultiple}
          />
          
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Team Squad</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleLoadSampleData}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Load Demo Team
              </Button>
              <Button
                variant="outline"
                onClick={handleClearAllData}
                className="flex items-center gap-2"
              >
                <RotateCcw size={16} />
                Clear All
              </Button>
              <Dialog open={isAddPlayerOpen} onOpenChange={setIsAddPlayerOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingPlayer(null)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Player
                  </Button>
                </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingPlayer ? 'Edit Player' : 'Add New Player'}
                  </DialogTitle>
                  <DialogDescription>
                    Create a FIFA-style player with detailed ratings
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Player Name</Label>
                      <Input
                        id="name"
                        value={newPlayer.name}
                        onChange={(e) => setNewPlayer(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter player name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Select 
                        value={newPlayer.position} 
                        onValueChange={(value) => setNewPlayer(prev => ({ ...prev, position: value as Player['position'] }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {POSITIONS.map(pos => (
                            <SelectItem key={pos.value} value={pos.value}>
                              {pos.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold text-primary">
                      {calculateOverallRating(newPlayer)}
                    </div>
                    <div className="text-sm text-muted-foreground">Overall Rating</div>
                  </div>

                  <div className="grid gap-4">
                    {[
                      { key: 'pace', label: 'Pace', icon: '⚡' },
                      { key: 'shooting', label: 'Shooting', icon: '⚽' },
                      { key: 'passing', label: 'Passing', icon: '🎯' },
                      { key: 'dribbling', label: 'Dribbling', icon: '🏃' },
                      { key: 'defending', label: 'Defending', icon: '🛡️' },
                      { key: 'physical', label: 'Physical', icon: '💪' }
                    ].map(({ key, label, icon }) => (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label className="flex items-center gap-2">
                            <span>{icon}</span>
                            {label}
                          </Label>
                          <span className="text-sm font-medium">
                            {newPlayer[key as keyof typeof newPlayer] || 50}
                          </span>
                        </div>
                        <Slider
                          value={[newPlayer[key as keyof typeof newPlayer] as number || 50]}
                          onValueChange={([value]) => setNewPlayer(prev => ({ ...prev, [key]: value }))}
                          max={99}
                          min={30}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddPlayerOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={editingPlayer ? handleUpdatePlayer : handleAddPlayer}>
                      {editingPlayer ? 'Update Player' : 'Add Player'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
             </Dialog>
           </div>
         </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {team.players.map((player) => (
              <Card key={player.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{player.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`${getPositionColor(player.position)} text-white text-xs`}>
                          {player.position}
                        </Badge>
                        <span className={`text-2xl font-bold ${getRatingColor(player.overallRating)}`}>
                          {player.overallRating}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewPlayerStats(player)}
                        title="View Stats"
                      >
                        <Target size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditPlayer(player)}
                        title="Edit Player"
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePlayer(player.id)}
                        title="Delete Player"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-medium">PAC</div>
                      <div className="text-lg font-bold">{player.pace}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">SHO</div>
                      <div className="text-lg font-bold">{player.shooting}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">PAS</div>
                      <div className="text-lg font-bold">{player.passing}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">DRI</div>
                      <div className="text-lg font-bold">{player.dribbling}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">DEF</div>
                      <div className="text-lg font-bold">{player.defending}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">PHY</div>
                      <div className="text-lg font-bold">{player.physical}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-3 pt-3 border-t text-sm text-muted-foreground">
                    <span>⚽ {player.goals}</span>
                    <span>🎯 {player.assists}</span>
                    <span>📊 {player.appearances}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {team.players.length === 0 && (
            <Card className="p-12 text-center">
              <CardContent>
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No players yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start building your team by adding your first player
                </p>
                <Button onClick={() => setIsAddPlayerOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Player
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Simulation Tab */}
        <TabsContent value="simulation" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Match Simulation</h2>
            <div className="flex gap-2">
              <Dialog open={isSimulationOpen} onOpenChange={setIsSimulationOpen}>
                <DialogTrigger asChild>
                  <Button disabled={team.players.length === 0} className="flex items-center gap-2">
                    <Settings size={16} />
                    Simulation Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Simulation Settings</DialogTitle>
                    <DialogDescription>
                      Customize your match simulation parameters
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Game Speed: {simulationSettings.gameSpeed}</Label>
                      <Slider
                        value={[simulationSettings.gameSpeed]}
                        onValueChange={([value]) => setSimulationSettings(prev => ({ ...prev, gameSpeed: value }))}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-xs text-muted-foreground">1 = Slow, 10 = Very Fast</div>
                    </div>

                    <div className="space-y-2">
                      <Label>Match Duration: {simulationSettings.gameDuration} minutes</Label>
                      <Slider
                        value={[simulationSettings.gameDuration]}
                        onValueChange={([value]) => setSimulationSettings(prev => ({ ...prev, gameDuration: value }))}
                        max={120}
                        min={45}
                        step={15}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Difficulty</Label>
                      <Select
                        value={simulationSettings.difficulty}
                        onValueChange={(value: 'easy' | 'medium' | 'hard') => setSimulationSettings(prev => ({ ...prev, difficulty: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Opponent Strength: {simulationSettings.opponentStrength}</Label>
                      <Slider
                        value={[simulationSettings.opponentStrength]}
                        onValueChange={([value]) => setSimulationSettings(prev => ({ ...prev, opponentStrength: value }))}
                        max={100}
                        min={30}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Weather Condition</Label>
                      <Select
                        value={simulationSettings.weatherCondition}
                        onValueChange={(value: 'sunny' | 'rainy' | 'windy' | 'snow') => setSimulationSettings(prev => ({ ...prev, weatherCondition: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sunny">☀️ Sunny</SelectItem>
                          <SelectItem value="rainy">🌧️ Rainy</SelectItem>
                          <SelectItem value="windy">💨 Windy</SelectItem>
                          <SelectItem value="snow">❄️ Snow</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Pitch Condition</Label>
                      <Select
                        value={simulationSettings.pitchCondition}
                        onValueChange={(value: 'excellent' | 'good' | 'poor') => setSimulationSettings(prev => ({ ...prev, pitchCondition: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">🟢 Excellent</SelectItem>
                          <SelectItem value="good">🟡 Good</SelectItem>
                          <SelectItem value="poor">🔴 Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsSimulationOpen(false)}>
                      Close
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button
                onClick={handleStartSimulation}
                disabled={isSimulating || team.players.length === 0}
                className="flex items-center gap-2"
              >
                <Play size={16} />
                {isSimulating ? 'Simulating...' : 'Start Match'}
              </Button>
            </div>
          </div>

          {/* Simulation Display */}
          {isSimulating && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock size={20} />
                  Live Match - Minute {currentMinute}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center text-2xl font-bold">
                    {team.name} vs AI Opposition
                  </div>
                  
                  <div className="text-center text-4xl font-bold">
                    {simulationResult?.homeScore || 0} - {simulationResult?.awayScore || 0}
                  </div>
                  
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {simulationEvents.slice(-5).map((event, index) => (
                      <div key={index} className="text-sm p-2 bg-muted rounded">
                        <span className="font-medium">{event.minute}'</span> - {event.description}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Simulation Results */}
          {simulationResult && !isSimulating && (
            <Card>
              <CardHeader>
                <CardTitle>Match Result</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold">{team.name} vs AI Opposition</div>
                    <div className="text-3xl font-bold my-2">
                      {simulationResult.homeScore} - {simulationResult.awayScore}
                    </div>
                    <Badge variant={simulationResult.homeScore > simulationResult.awayScore ? 'default' :
                                   simulationResult.homeScore < simulationResult.awayScore ? 'destructive' : 'secondary'}>
                      {simulationResult.homeScore > simulationResult.awayScore ? 'WIN' :
                       simulationResult.homeScore < simulationResult.awayScore ? 'LOSS' : 'DRAW'}
                    </Badge>
                  </div>

                  <div className="grid gap-2">
                    <h3 className="font-semibold">Match Events</h3>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {simulationResult.events.map((event, index) => (
                        <div key={index} className="text-sm p-2 bg-muted rounded">
                          <span className="font-medium">{event.minute}'</span> - {event.description}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <h3 className="font-semibold">Player Ratings</h3>
                    <div className="grid gap-1 max-h-32 overflow-y-auto">
                      {simulationResult.playerStats.map((stat) => {
                        const player = team.players.find(p => p.id === stat.playerId);
                        return player ? (
                          <div key={stat.playerId} className="flex justify-between text-sm p-2 bg-muted rounded">
                            <span>{player.name}</span>
                            <div className="flex gap-2">
                              <span>⚽{stat.goals}</span>
                              <span>🎯{stat.assists}</span>
                              <span className={`font-medium ${getRatingColor(stat.rating * 10)}`}>
                                {stat.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {team.players.length === 0 && (
            <Card className="p-12 text-center">
              <CardContent>
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No players available</h3>
                <p className="text-muted-foreground mb-4">
                  Add some players to your squad before running a simulation
                </p>
                <Button onClick={() => setIsAddPlayerOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Players
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Formation Tab */}
        <TabsContent value="formation" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Team Formation</h2>
          </div>
          <FormationView players={team.players} onPlayerClick={handleViewPlayerStats} />
        </TabsContent>

        {/* Season Mode Tab */}
        <TabsContent value="season" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Season Mode</h2>
          </div>
          <SeasonMode team={team} onTeamUpdate={handleTeamUpdate} />
        </TabsContent>

        {/* Player Comparison Tab */}
        <TabsContent value="comparison" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Player Comparison</h2>
          </div>
          <PlayerComparison players={team.players} />
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Achievements</h2>
          </div>
          <Achievements team={team} />
        </TabsContent>

        {/* Management Tab */}
        <TabsContent value="management" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Team Management</h2>
          </div>
          <TeamExport team={team} onImportTeam={handleImportTeam} />
        </TabsContent>

        {/* Matches Tab */}
        <TabsContent value="matches" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Match Management</h2>
          </div>

          {/* Manual Match Entry */}
          <ManualMatchEntry team={team} onMatchAdded={handleManualMatchEntry} />

          {/* Match History */}
          {team.matches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Match History ({team.matches.length} matches)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {team.matches.slice(-10).reverse().map((match) => (
                    <div key={match.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">
                          {match.homeTeam} vs {match.awayTeam}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(match.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          {match.homeScore} - {match.awayScore}
                        </div>
                        <div className="text-sm">
                          {match.homeScore > match.awayScore ? '🟢 Win' :
                           match.homeScore === match.awayScore ? '🟡 Draw' : '🔴 Loss'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {team.matches.length === 0 && (
            <Card className="p-8 text-center">
              <CardContent>
                <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No matches recorded yet</h3>
                <p className="text-muted-foreground">Use the form above to add your first match result</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats" className="space-y-4">
          <h2 className="text-2xl font-semibold">Team Statistics</h2>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Players</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{team.players.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {team.players.reduce((sum, player) => sum + player.goals, 0)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Assists</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {team.players.reduce((sum, player) => sum + player.assists, 0)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {team.players.length > 0 
                    ? Math.round(team.players.reduce((sum, player) => sum + player.overallRating, 0) / team.players.length)
                    : 0
                  }
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-4">
          <h2 className="text-2xl font-semibold">Player Leaderboards</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Top Scorers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topScorers.length > 0 ? (
                  <div className="space-y-3">
                    {topScorers.map((player, index) => (
                      <div key={player.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{player.name}</div>
                            <div className="text-sm text-muted-foreground">{player.position}</div>
                          </div>
                        </div>
                        <div className="text-lg font-bold">{player.goals}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No goals scored yet</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Highest Rated
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topRated.length > 0 ? (
                  <div className="space-y-3">
                    {topRated.map((player, index) => (
                      <div key={player.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{player.name}</div>
                            <div className="text-sm text-muted-foreground">{player.position}</div>
                          </div>
                        </div>
                        <div className={`text-lg font-bold ${getRatingColor(player.overallRating)}`}>
                          {player.overallRating}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No players added yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Player Stats Modal */}
      <Dialog open={isPlayerStatsOpen} onOpenChange={setIsPlayerStatsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="text-blue-500" />
              {selectedPlayer?.name} - Detailed Statistics
            </DialogTitle>
            <DialogDescription>
              Comprehensive player performance analysis and match history
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlayer && (
            <div className="grid gap-6 py-4">
              {/* Player Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Player Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Position</div>
                      <Badge className={`${getPositionColor(selectedPlayer.position)} text-white`}>
                        {selectedPlayer.position}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Overall Rating</div>
                      <div className={`text-2xl font-bold ${getRatingColor(selectedPlayer.overallRating)}`}>
                        {selectedPlayer.overallRating}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Appearances</div>
                      <div className="text-xl font-semibold">{selectedPlayer.appearances}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Goal Contributions</div>
                      <div className="text-xl font-semibold text-green-600">
                        {selectedPlayer.goals + selectedPlayer.assists}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Player Attributes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Player Attributes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { label: 'Pace', value: selectedPlayer.pace, icon: '⚡', color: 'text-yellow-600' },
                      { label: 'Shooting', value: selectedPlayer.shooting, icon: '⚽', color: 'text-red-600' },
                      { label: 'Passing', value: selectedPlayer.passing, icon: '🎯', color: 'text-blue-600' },
                      { label: 'Dribbling', value: selectedPlayer.dribbling, icon: '🏃', color: 'text-purple-600' },
                      { label: 'Defending', value: selectedPlayer.defending, icon: '🛡️', color: 'text-green-600' },
                      { label: 'Physical', value: selectedPlayer.physical, icon: '💪', color: 'text-orange-600' }
                    ].map(({ label, value, icon, color }) => (
                      <div key={label} className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl mb-1">{icon}</div>
                        <div className="text-sm text-muted-foreground">{label}</div>
                        <div className={`text-xl font-bold ${color}`}>{value}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Basic Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl mb-1">⚽</div>
                      <div className="text-sm text-muted-foreground">Goals</div>
                      <div className="text-2xl font-bold text-green-600">{selectedPlayer.goals}</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl mb-1">🎯</div>
                      <div className="text-sm text-muted-foreground">Assists</div>
                      <div className="text-2xl font-bold text-blue-600">{selectedPlayer.assists}</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl mb-1">📊</div>
                      <div className="text-sm text-muted-foreground">Appearances</div>
                      <div className="text-2xl font-bold">{selectedPlayer.appearances}</div>
                    </div>
                    {selectedPlayer.position === 'GK' && selectedPlayer.cleanSheets !== undefined && (
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl mb-1">🧤</div>
                        <div className="text-sm text-muted-foreground">Clean Sheets</div>
                        <div className="text-2xl font-bold text-yellow-600">{selectedPlayer.cleanSheets}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Statistics */}
              {(() => {
                const advancedStats = getPlayerAdvancedStats(selectedPlayer);
                return (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Advanced Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-sm text-muted-foreground">Average Rating</div>
                          <div className={`text-xl font-bold ${getRatingColor(advancedStats.averageRating * 10)}`}>
                            {advancedStats.averageRating.toFixed(1)}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-sm text-muted-foreground">Goals per Game</div>
                          <div className="text-xl font-bold text-green-600">
                            {advancedStats.goalsPerGame.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-sm text-muted-foreground">Assists per Game</div>
                          <div className="text-xl font-bold text-blue-600">
                            {advancedStats.assistsPerGame.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-sm text-muted-foreground">Current Form</div>
                          <div className={`text-xl font-bold ${getRatingColor(advancedStats.formRating * 10)}`}>
                            {advancedStats.formRating.toFixed(1)}
                          </div>
                        </div>
                        {advancedStats.bestRating > 0 && (
                          <>
                            <div className="text-center p-3 bg-muted rounded-lg">
                              <div className="text-sm text-muted-foreground">Best Rating</div>
                              <div className={`text-xl font-bold ${getRatingColor(advancedStats.bestRating * 10)}`}>
                                {advancedStats.bestRating.toFixed(1)}
                              </div>
                            </div>
                            <div className="text-center p-3 bg-muted rounded-lg">
                              <div className="text-sm text-muted-foreground">Worst Rating</div>
                              <div className={`text-xl font-bold ${getRatingColor(advancedStats.worstRating * 10)}`}>
                                {advancedStats.worstRating.toFixed(1)}
                              </div>
                            </div>
                          </>
                        )}
                        {selectedPlayer.position === 'GK' && advancedStats.cleanSheetsPercentage > 0 && (
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-sm text-muted-foreground">Clean Sheet %</div>
                            <div className="text-xl font-bold text-yellow-600">
                              {advancedStats.cleanSheetsPercentage.toFixed(0)}%
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}

              {/* Match History */}
              {(() => {
                const matchHistory = getPlayerMatchHistory(selectedPlayer.id);
                return matchHistory.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Match History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {matchHistory.slice(-10).reverse().map((match, index) => (
                          <div key={match.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium">{match.homeTeam} vs {match.awayTeam}</div>
                              <div className="text-sm text-muted-foreground">{match.date}</div>
                            </div>
                            <div className="text-center mx-4">
                              <div className="font-bold">{match.homeScore} - {match.awayScore}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground">Performance</div>
                              <div className="flex gap-2 text-sm">
                                <span>⚽{match.playerPerformance.goals}</span>
                                <span>🎯{match.playerPerformance.assists}</span>
                                <span className={`font-medium ${getRatingColor(match.playerPerformance.rating * 10)}`}>
                                  {match.playerPerformance.rating.toFixed(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Match History</h3>
                      <p className="text-muted-foreground">
                        This player hasn't participated in any simulated matches yet.
                      </p>
                    </CardContent>
                  </Card>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}