"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Player, Team } from './types';
import { FootballSimulation, SimulationSettings } from './simulation-engine';
import { Trophy, Calendar, Target, Crown, Play, Pause, RotateCcw } from 'lucide-react';

interface SeasonModeProps {
  team: Team;
  onTeamUpdate: (team: Team) => void;
}

interface SeasonMatch {
  id: string;
  opponent: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  result?: {
    homeScore: number;
    awayScore: number;
    playerStats: any[];
  };
}

interface Season {
  id: string;
  name: string;
  matches: SeasonMatch[];
  currentMatch: number;
  completed: boolean;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
}

const SEASON_TEMPLATES = {
  'premier-league': {
    name: 'Premier League Season',
    opponents: [
      { name: 'Arsenal', difficulty: 'hard' },
      { name: 'Chelsea', difficulty: 'hard' },
      { name: 'Liverpool', difficulty: 'hard' },
      { name: 'Manchester City', difficulty: 'hard' },
      { name: 'Manchester United', difficulty: 'hard' },
      { name: 'Tottenham', difficulty: 'hard' },
      { name: 'Newcastle', difficulty: 'medium' },
      { name: 'Brighton', difficulty: 'medium' },
      { name: 'West Ham', difficulty: 'medium' },
      { name: 'Aston Villa', difficulty: 'medium' },
      { name: 'Crystal Palace', difficulty: 'easy' },
      { name: 'Brentford', difficulty: 'easy' },
      { name: 'Fulham', difficulty: 'easy' },
      { name: 'Wolves', difficulty: 'easy' },
      { name: 'Everton', difficulty: 'easy' }
    ]
  },
  'champions-league': {
    name: 'Champions League',
    opponents: [
      { name: 'Barcelona', difficulty: 'hard' },
      { name: 'Real Madrid', difficulty: 'hard' },
      { name: 'Bayern Munich', difficulty: 'hard' },
      { name: 'PSG', difficulty: 'hard' },
      { name: 'Juventus', difficulty: 'medium' },
      { name: 'AC Milan', difficulty: 'medium' },
      { name: 'Atletico Madrid', difficulty: 'medium' },
      { name: 'Borussia Dortmund', difficulty: 'medium' }
    ]
  },
  'world-cup': {
    name: 'World Cup',
    opponents: [
      { name: 'Brazil', difficulty: 'hard' },
      { name: 'Argentina', difficulty: 'hard' },
      { name: 'France', difficulty: 'hard' },
      { name: 'Germany', difficulty: 'medium' },
      { name: 'Spain', difficulty: 'medium' },
      { name: 'Netherlands', difficulty: 'medium' },
      { name: 'Portugal', difficulty: 'medium' }
    ]
  }
};

export function SeasonMode({ team, onTeamUpdate }: SeasonModeProps) {
  const [currentSeason, setCurrentSeason] = useState<Season | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSettings, setSimulationSettings] = useState<SimulationSettings>({
    gameSpeed: 8,
    gameDuration: 90,
    difficulty: 'medium',
    opponentStrength: 75,
    weatherCondition: 'sunny',
    pitchCondition: 'excellent'
  });

  const createSeason = (templateKey: keyof typeof SEASON_TEMPLATES) => {
    const template = SEASON_TEMPLATES[templateKey];
    const matches: SeasonMatch[] = template.opponents.map((opponent, index) => ({
      id: `match-${index}`,
      opponent: opponent.name,
      difficulty: opponent.difficulty as 'easy' | 'medium' | 'hard',
      completed: false
    }));

    const season: Season = {
      id: `season-${Date.now()}`,
      name: template.name,
      matches,
      currentMatch: 0,
      completed: false,
      points: 0,
      goalsFor: 0,
      goalsAgainst: 0
    };

    setCurrentSeason(season);
  };

  const getDifficultySettings = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return { opponentStrength: 65, weatherCondition: 'sunny' as const };
      case 'medium': return { opponentStrength: 75, weatherCondition: 'sunny' as const };
      case 'hard': return { opponentStrength: 85, weatherCondition: 'rainy' as const };
      default: return { opponentStrength: 75, weatherCondition: 'sunny' as const };
    }
  };

  const playNextMatch = async () => {
    if (!currentSeason || currentSeason.completed || isSimulating) return;

    const match = currentSeason.matches[currentSeason.currentMatch];
    if (!match || match.completed) return;

    setIsSimulating(true);

    try {
      const difficultySettings = getDifficultySettings(match.difficulty);
      const matchSettings: SimulationSettings = {
        ...simulationSettings,
        ...difficultySettings
      };

      const simulation = new FootballSimulation(team, matchSettings);
      const result = await simulation.simulate((minute, event) => {
        // Could add real-time updates here if needed
      });

      // Update match result
      match.completed = true;
      match.result = {
        homeScore: result.homeScore,
        awayScore: result.awayScore,
        playerStats: result.playerStats
      };

      // Update season stats
      const points = result.homeScore > result.awayScore ? 3 : 
                   result.homeScore === result.awayScore ? 1 : 0;
      
      const updatedSeason: Season = {
        ...currentSeason,
        currentMatch: currentSeason.currentMatch + 1,
        points: currentSeason.points + points,
        goalsFor: currentSeason.goalsFor + result.homeScore,
        goalsAgainst: currentSeason.goalsAgainst + result.awayScore,
        completed: currentSeason.currentMatch + 1 >= currentSeason.matches.length
      };

      setCurrentSeason(updatedSeason);

      // Update team with new player stats
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
      const newMatch = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        opponent: match.opponent,
        homeTeam: team.name,
        awayTeam: match.opponent,
        homeScore: result.homeScore,
        awayScore: result.awayScore,
        playerStats: result.playerStats.map(ps => ({
          playerId: ps.playerId,
          goals: ps.goals,
          assists: ps.assists,
          rating: ps.rating
        }))
      };

      const updatedTeam = {
        ...team,
        players: updatedPlayers,
        matches: [...team.matches, newMatch]
      };

      onTeamUpdate(updatedTeam);

    } catch (error) {
      console.error('Season match simulation error:', error);
    }

    setIsSimulating(false);
  };

  const resetSeason = () => {
    setCurrentSeason(null);
  };

  const getSeasonProgress = () => {
    if (!currentSeason) return 0;
    return (currentSeason.currentMatch / currentSeason.matches.length) * 100;
  };

  const getSeasonRank = () => {
    if (!currentSeason) return 'N/A';
    const winRate = currentSeason.currentMatch > 0 ? 
      (currentSeason.points / (currentSeason.currentMatch * 3)) * 100 : 0;
    
    if (winRate >= 75) return '🥇 Champion Level';
    if (winRate >= 60) return '🥈 Elite Level';
    if (winRate >= 45) return '🥉 Good Level';
    if (winRate >= 30) return '📊 Average Level';
    return '📉 Struggling';
  };

  if (!currentSeason) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="text-yellow-500" />
              Season Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Choose a season format to compete in a series of matches against top teams.
              Your performance will determine your final ranking!
            </p>
            
            <div className="grid gap-4 md:grid-cols-3">
              {Object.entries(SEASON_TEMPLATES).map(([key, template]) => (
                <Card key={key} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {template.opponents.length} matches
                      </p>
                      <div className="flex justify-center gap-1">
                        {template.opponents.map((opponent, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              opponent.difficulty === 'easy' ? 'bg-green-500' :
                              opponent.difficulty === 'medium' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                          />
                        ))}
                      </div>
                      <Button 
                        onClick={() => createSeason(key as keyof typeof SEASON_TEMPLATES)}
                        className="w-full mt-4"
                      >
                        Start Season
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Season Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="text-yellow-500" />
              {currentSeason.name}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetSeason}>
                <RotateCcw size={16} />
                Reset
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{currentSeason.currentMatch}</div>
              <div className="text-sm text-muted-foreground">Matches Played</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{currentSeason.points}</div>
              <div className="text-sm text-muted-foreground">Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{currentSeason.goalsFor}</div>
              <div className="text-sm text-muted-foreground">Goals Scored</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium">{getSeasonRank()}</div>
              <div className="text-sm text-muted-foreground">Current Form</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Season Progress</span>
              <span>{currentSeason.currentMatch} / {currentSeason.matches.length}</span>
            </div>
            <Progress value={getSeasonProgress()} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Current/Next Match */}
      {!currentSeason.completed && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="text-blue-500" />
              {currentSeason.currentMatch < currentSeason.matches.length ? 'Next Match' : 'Season Complete!'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentSeason.currentMatch < currentSeason.matches.length ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {team.name} vs {currentSeason.matches[currentSeason.currentMatch].opponent}
                    </h3>
                    <Badge className={`${
                      currentSeason.matches[currentSeason.currentMatch].difficulty === 'easy' ? 'bg-green-500' :
                      currentSeason.matches[currentSeason.currentMatch].difficulty === 'medium' ? 'bg-yellow-500' :
                      'bg-red-500'
                    } text-white`}>
                      {currentSeason.matches[currentSeason.currentMatch].difficulty.toUpperCase()}
                    </Badge>
                  </div>
                  <Button 
                    onClick={playNextMatch} 
                    disabled={isSimulating || team.players.length === 0}
                    className="flex items-center gap-2"
                  >
                    {isSimulating ? <Pause size={16} /> : <Play size={16} />}
                    {isSimulating ? 'Simulating...' : 'Play Match'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Crown className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Season Complete!</h3>
                <p className="text-muted-foreground mb-4">
                  Final Result: {getSeasonRank()}
                </p>
                <p className="text-sm">
                  Points: {currentSeason.points} | Goals: {currentSeason.goalsFor}-{currentSeason.goalsAgainst}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Match Results */}
      <Card>
        <CardHeader>
          <CardTitle>Match Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {currentSeason.matches.map((match, index) => (
              <div 
                key={match.id}
                className={`flex justify-between items-center p-3 rounded-lg ${
                  match.completed ? 'bg-muted' : 
                  index === currentSeason.currentMatch ? 'bg-blue-50 border border-blue-200' : 
                  'bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium w-6">{index + 1}</span>
                  <span className="font-medium">{team.name} vs {match.opponent}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      match.difficulty === 'easy' ? 'border-green-500 text-green-600' :
                      match.difficulty === 'medium' ? 'border-yellow-500 text-yellow-600' :
                      'border-red-500 text-red-600'
                    }`}
                  >
                    {match.difficulty}
                  </Badge>
                </div>
                
                <div className="text-right">
                  {match.completed && match.result ? (
                    <div className="flex items-center gap-2">
                      <span className="font-bold">
                        {match.result.homeScore} - {match.result.awayScore}
                      </span>
                      <Badge className={`${
                        match.result.homeScore > match.result.awayScore ? 'bg-green-500' :
                        match.result.homeScore === match.result.awayScore ? 'bg-yellow-500' :
                        'bg-red-500'
                      } text-white`}>
                        {match.result.homeScore > match.result.awayScore ? 'W' :
                         match.result.homeScore === match.result.awayScore ? 'D' : 'L'}
                      </Badge>
                    </div>
                  ) : index === currentSeason.currentMatch ? (
                    <Badge className="bg-blue-500 text-white">Next</Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">Upcoming</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}