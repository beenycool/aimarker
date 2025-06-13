"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Team, Player, Match } from './types';
import { FootballSimulation, SimulationSettings, SimulationResult, GameEvent } from './simulation-engine';
import { Plus, Users, Trophy, Trash2, Edit2, Swords, Play, Settings, Star, Calendar } from 'lucide-react';

interface TeamManagerProps {
  teams: Team[];
  currentTeam: Team | null;
  onTeamCreate: (team: Omit<Team, 'id'>) => void;
  onTeamSelect: (team: Team) => void;
  onTeamUpdate: (teamId: string, updates: Partial<Team>) => void;
  onTeamDelete: (teamId: string) => void;
  onMatchSimulate: (homeTeam: Team, awayTeam: Team, settings: SimulationSettings) => Promise<SimulationResult>;
}

interface TeamFormData {
  name: string;
  formation: string;
  description: string;
  league: string;
  season: string;
}

const FORMATIONS = [
  '4-4-2', '4-3-3', '3-5-2', '4-2-3-1', '5-3-2', '3-4-3', '4-1-4-1', '4-5-1'
];

const LEAGUES = [
  'Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1', 'Championship', 'Custom League'
];

export function TeamManager({ 
  teams, 
  currentTeam, 
  onTeamCreate, 
  onTeamSelect, 
  onTeamUpdate, 
  onTeamDelete,
  onMatchSimulate 
}: TeamManagerProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [isVersusOpen, setIsVersusOpen] = useState(false);
  const [homeTeam, setHomeTeam] = useState<Team | null>(null);
  const [awayTeam, setAwayTeam] = useState<Team | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [simulationEvents, setSimulationEvents] = useState<GameEvent[]>([]);
  
  const [formData, setFormData] = useState<TeamFormData>({
    name: '',
    formation: '4-4-2',
    description: '',
    league: 'Premier League',
    season: new Date().getFullYear().toString()
  });

  const [simulationSettings, setSimulationSettings] = useState<SimulationSettings>({
    gameSpeed: 5,
    gameDuration: 90,
    difficulty: 'medium',
    opponentStrength: 75,
    weatherCondition: 'sunny',
    pitchCondition: 'excellent'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      formation: '4-4-2',
      description: '',
      league: 'Premier League',
      season: new Date().getFullYear().toString()
    });
  };

  const handleCreateTeam = () => {
    if (!formData.name.trim()) return;

    const newTeam: Omit<Team, 'id'> = {
      name: formData.name.trim(),
      formation: formData.formation,
      description: formData.description,
      league: formData.league,
      season: formData.season,
      players: [],
      matches: [],
      isPublic: false,
      teamRating: 0,
      statistics: {
        matchesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0
      }
    };

    onTeamCreate(newTeam);
    resetForm();
    setIsCreateOpen(false);
  };

  const handleEditTeam = () => {
    if (!editingTeam || !formData.name.trim()) return;

    onTeamUpdate(editingTeam.id!, {
      name: formData.name.trim(),
      formation: formData.formation,
      description: formData.description,
      league: formData.league,
      season: formData.season
    });

    setIsEditOpen(false);
    setEditingTeam(null);
    resetForm();
  };

  const openEditDialog = (team: Team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      formation: team.formation || '4-4-2',
      description: team.description || '',
      league: team.league || 'Premier League',
      season: team.season || new Date().getFullYear().toString()
    });
    setIsEditOpen(true);
  };

  const getTeamStats = (team: Team) => {
    const totalRating = team.players.reduce((sum, player) => sum + (player.overallRating || 0), 0);
    const averageRating = team.players.length > 0 ? totalRating / team.players.length : 0;
    
    return {
      playerCount: team.players.length,
      averageRating: Math.round(averageRating),
      matchesPlayed: team.matches.length,
      wins: team.statistics?.wins || 0,
      draws: team.statistics?.draws || 0,
      losses: team.statistics?.losses || 0
    };
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 85) return 'text-green-600';
    if (rating >= 75) return 'text-blue-600';
    if (rating >= 65) return 'text-yellow-600';
    if (rating >= 55) return 'text-orange-600';
    return 'text-red-600';
  };

  const handleVersusMatch = async () => {
    if (!homeTeam || !awayTeam) return;

    setIsSimulating(true);
    setSimulationEvents([]);
    setSimulationResult(null);

    try {
      const result = await onMatchSimulate(homeTeam, awayTeam, simulationSettings);
      setSimulationResult(result);
      setSimulationEvents(result.events);
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  const eligibleTeams = teams.filter(team => team.players.length >= 11);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Team Manager</h2>
        <div className="flex gap-2">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
                <DialogDescription>
                  Create a new football team to manage and compete with.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="teamName">Team Name *</Label>
                  <Input
                    id="teamName"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter team name"
                  />
                </div>
                <div>
                  <Label htmlFor="formation">Formation</Label>
                  <Select value={formData.formation} onValueChange={(value) => setFormData({...formData, formation: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FORMATIONS.map(formation => (
                        <SelectItem key={formation} value={formation}>{formation}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="league">League</Label>
                  <Select value={formData.league} onValueChange={(value) => setFormData({...formData, league: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAGUES.map(league => (
                        <SelectItem key={league} value={league}>{league}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="season">Season</Label>
                  <Input
                    id="season"
                    value={formData.season}
                    onChange={(e) => setFormData({...formData, season: e.target.value})}
                    placeholder="2024"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Brief team description"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTeam} disabled={!formData.name.trim()}>
                    Create Team
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {eligibleTeams.length >= 2 && (
            <Dialog open={isVersusOpen} onOpenChange={setIsVersusOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Swords className="h-4 w-4 mr-2" />
                  Team vs Team
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Team vs Team Match</DialogTitle>
                  <DialogDescription>
                    Simulate a match between two of your teams.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Team Selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Home Team</Label>
                      <Select value={homeTeam?.id || ''} onValueChange={(value) => {
                        const team = eligibleTeams.find(t => t.id === value);
                        setHomeTeam(team || null);
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select home team" />
                        </SelectTrigger>
                        <SelectContent>
                          {eligibleTeams.map(team => (
                            <SelectItem key={team.id} value={team.id!} disabled={team.id === awayTeam?.id}>
                              {team.name} ({team.players.length} players)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Away Team</Label>
                      <Select value={awayTeam?.id || ''} onValueChange={(value) => {
                        const team = eligibleTeams.find(t => t.id === value);
                        setAwayTeam(team || null);
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select away team" />
                        </SelectTrigger>
                        <SelectContent>
                          {eligibleTeams.map(team => (
                            <SelectItem key={team.id} value={team.id!} disabled={team.id === homeTeam?.id}>
                              {team.name} ({team.players.length} players)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Match Settings */}
                  {homeTeam && awayTeam && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Settings className="h-5 w-5" />
                          Match Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Game Speed: {simulationSettings.gameSpeed}</Label>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={simulationSettings.gameSpeed}
                              onChange={(e) => setSimulationSettings({
                                ...simulationSettings,
                                gameSpeed: parseInt(e.target.value)
                              })}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <Label>Match Duration</Label>
                            <Select 
                              value={simulationSettings.gameDuration.toString()} 
                              onValueChange={(value) => setSimulationSettings({
                                ...simulationSettings,
                                gameDuration: parseInt(value)
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="45">45 minutes</SelectItem>
                                <SelectItem value="90">90 minutes</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Weather</Label>
                            <Select 
                              value={simulationSettings.weatherCondition} 
                              onValueChange={(value: any) => setSimulationSettings({
                                ...simulationSettings,
                                weatherCondition: value
                              })}
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
                          <div>
                            <Label>Pitch Condition</Label>
                            <Select 
                              value={simulationSettings.pitchCondition} 
                              onValueChange={(value: any) => setSimulationSettings({
                                ...simulationSettings,
                                pitchCondition: value
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="excellent">🌟 Excellent</SelectItem>
                                <SelectItem value="good">✅ Good</SelectItem>
                                <SelectItem value="poor">⚠️ Poor</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Team Preview */}
                  {homeTeam && awayTeam && (
                    <div className="grid grid-cols-2 gap-4">
                      {[homeTeam, awayTeam].map((team, index) => {
                        const stats = getTeamStats(team);
                        return (
                          <Card key={team.id}>
                            <CardHeader>
                              <CardTitle className="text-lg">{team.name}</CardTitle>
                              <div className="text-sm text-muted-foreground">
                                {index === 0 ? 'Home Team' : 'Away Team'}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>Players:</span>
                                  <span className="font-medium">{stats.playerCount}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Avg Rating:</span>
                                  <span className={`font-medium ${getRatingColor(stats.averageRating)}`}>
                                    {stats.averageRating}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Matches:</span>
                                  <span className="font-medium">{stats.matchesPlayed}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Record:</span>
                                  <span className="font-medium text-xs">
                                    {stats.wins}W-{stats.draws}D-{stats.losses}L
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}

                  {/* Simulation Result */}
                  {simulationResult && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Match Result</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center space-y-4">
                          <div className="text-4xl font-bold">
                            {simulationResult.homeScore} - {simulationResult.awayScore}
                          </div>
                          <div className="text-lg">
                            {homeTeam!.name} vs {awayTeam!.name}
                          </div>
                          <Badge variant={
                            simulationResult.homeScore > simulationResult.awayScore ? 'default' :
                            simulationResult.homeScore < simulationResult.awayScore ? 'destructive' : 'secondary'
                          }>
                            {simulationResult.homeScore > simulationResult.awayScore ? `${homeTeam!.name} Wins!` :
                             simulationResult.homeScore < simulationResult.awayScore ? `${awayTeam!.name} Wins!` : 'Draw!'}
                          </Badge>
                          
                          {/* Recent Events */}
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

                  {/* Action Buttons */}
                  <div className="flex gap-2 justify-end">
                    {homeTeam && awayTeam && !isSimulating && (
                      <Button onClick={handleVersusMatch} disabled={isSimulating}>
                        <Play className="h-4 w-4 mr-2" />
                        {isSimulating ? 'Simulating...' : 'Start Match'}
                      </Button>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => {
          const stats = getTeamStats(team);
          const isSelected = currentTeam?.id === team.id;
          
          return (
            <Card 
              key={team.id} 
              className={`hover:shadow-md transition-shadow cursor-pointer ${
                isSelected ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onTeamSelect(team)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{team.name}</CardTitle>
                  {isSelected && <Badge variant="default">Active</Badge>}
                </div>
                <div className="text-sm text-muted-foreground">
                  {team.league} • {team.season}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Formation:</span>
                    <Badge variant="outline">{team.formation || 'Not Set'}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Players:</span>
                      <span className="font-medium">{stats.playerCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rating:</span>
                      <span className={`font-medium ${getRatingColor(stats.averageRating)}`}>
                        {stats.averageRating}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Matches:</span>
                      <span className="font-medium">{stats.matchesPlayed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Record:</span>
                      <span className="font-medium text-xs">
                        {stats.wins}W-{stats.draws}D-{stats.losses}L
                      </span>
                    </div>
                  </div>

                  {team.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {team.description}
                    </p>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditDialog(team);
                      }}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete team "${team.name}"? This cannot be undone.`)) {
                          onTeamDelete(team.id!);
                        }
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Empty State */}
        {teams.length === 0 && (
          <Card className="col-span-full p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Teams Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first team to start managing players and competing in matches.
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Team
            </Button>
          </Card>
        )}
      </div>

      {/* Edit Team Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
            <DialogDescription>
              Update your team's information and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editTeamName">Team Name *</Label>
              <Input
                id="editTeamName"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter team name"
              />
            </div>
            <div>
              <Label htmlFor="editFormation">Formation</Label>
              <Select value={formData.formation} onValueChange={(value) => setFormData({...formData, formation: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FORMATIONS.map(formation => (
                    <SelectItem key={formation} value={formation}>{formation}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="editLeague">League</Label>
              <Select value={formData.league} onValueChange={(value) => setFormData({...formData, league: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAGUES.map(league => (
                    <SelectItem key={league} value={league}>{league}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="editSeason">Season</Label>
              <Input
                id="editSeason"
                value={formData.season}
                onChange={(e) => setFormData({...formData, season: e.target.value})}
                placeholder="2024"
              />
            </div>
            <div>
              <Label htmlFor="editDescription">Description (Optional)</Label>
              <Input
                id="editDescription"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Brief team description"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditTeam} disabled={!formData.name.trim()}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}