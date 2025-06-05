"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Player } from './types';
import { Users, Zap, Target } from 'lucide-react';

interface FormationViewProps {
  players: Player[];
  onPlayerClick: (player: Player) => void;
}

const FORMATIONS = {
  '4-4-2': {
    name: '4-4-2 Classic',
    positions: [
      { position: 'GK', x: 50, y: 5 },
      { position: 'CB', x: 30, y: 20 }, { position: 'CB', x: 70, y: 20 },
      { position: 'LB', x: 10, y: 20 }, { position: 'RB', x: 90, y: 20 },
      { position: 'CM', x: 30, y: 45 }, { position: 'CM', x: 70, y: 45 },
      { position: 'LW', x: 10, y: 45 }, { position: 'RW', x: 90, y: 45 },
      { position: 'ST', x: 35, y: 75 }, { position: 'ST', x: 65, y: 75 }
    ]
  },
  '4-3-3': {
    name: '4-3-3 Attack',
    positions: [
      { position: 'GK', x: 50, y: 5 },
      { position: 'CB', x: 30, y: 20 }, { position: 'CB', x: 70, y: 20 },
      { position: 'LB', x: 10, y: 20 }, { position: 'RB', x: 90, y: 20 },
      { position: 'CDM', x: 50, y: 35 },
      { position: 'CM', x: 25, y: 50 }, { position: 'CM', x: 75, y: 50 },
      { position: 'LW', x: 15, y: 75 }, { position: 'ST', x: 50, y: 80 }, { position: 'RW', x: 85, y: 75 }
    ]
  },
  '3-5-2': {
    name: '3-5-2 Midfield',
    positions: [
      { position: 'GK', x: 50, y: 5 },
      { position: 'CB', x: 20, y: 20 }, { position: 'CB', x: 50, y: 15 }, { position: 'CB', x: 80, y: 20 },
      { position: 'LB', x: 5, y: 40 }, { position: 'RB', x: 95, y: 40 },
      { position: 'CDM', x: 50, y: 40 },
      { position: 'CM', x: 25, y: 55 }, { position: 'CM', x: 75, y: 55 },
      { position: 'ST', x: 35, y: 80 }, { position: 'ST', x: 65, y: 80 }
    ]
  }
};

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

export function FormationView({ players, onPlayerClick }: FormationViewProps) {
  const [selectedFormation, setSelectedFormation] = useState<keyof typeof FORMATIONS>('4-4-2');
  const [selectedPlayers, setSelectedPlayers] = useState<{ [key: string]: Player | null }>({});

  const formation = FORMATIONS[selectedFormation];

  // Auto-assign best players to positions
  const autoAssignPlayers = () => {
    const newAssignment: { [key: string]: Player | null } = {};
    const availablePlayers = [...players];
    
    formation.positions.forEach((pos, index) => {
      // Find best player for this position
      const bestPlayer = availablePlayers
        .filter(p => p.position === pos.position)
        .sort((a, b) => b.overallRating - a.overallRating)[0];
      
      if (bestPlayer) {
        newAssignment[`${pos.position}-${index}`] = bestPlayer;
        const playerIndex = availablePlayers.indexOf(bestPlayer);
        availablePlayers.splice(playerIndex, 1);
      } else {
        // If no exact position match, find best overall player
        const anyPlayer = availablePlayers
          .sort((a, b) => b.overallRating - a.overallRating)[0];
        if (anyPlayer) {
          newAssignment[`${pos.position}-${index}`] = anyPlayer;
          const playerIndex = availablePlayers.indexOf(anyPlayer);
          availablePlayers.splice(playerIndex, 1);
        }
      }
    });
    
    setSelectedPlayers(newAssignment);
  };

  const getTeamStats = () => {
    const assignedPlayers = Object.values(selectedPlayers).filter(p => p !== null) as Player[];
    if (assignedPlayers.length === 0) return { avgRating: 0, totalGoals: 0, totalAssists: 0, chemistry: 0 };
    
    const avgRating = assignedPlayers.reduce((sum, p) => sum + p.overallRating, 0) / assignedPlayers.length;
    const totalGoals = assignedPlayers.reduce((sum, p) => sum + p.goals, 0);
    const totalAssists = assignedPlayers.reduce((sum, p) => sum + p.assists, 0);
    
    // Calculate chemistry (players in correct positions get bonus)
    let chemistry = 0;
    formation.positions.forEach((pos, index) => {
      const player = selectedPlayers[`${pos.position}-${index}`];
      if (player) {
        chemistry += player.position === pos.position ? 10 : 7;
      }
    });
    chemistry = chemistry / formation.positions.length;
    
    return { avgRating, totalGoals, totalAssists, chemistry };
  };

  const teamStats = getTeamStats();

  return (
    <div className="space-y-6">
      {/* Formation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="text-blue-500" />
            Team Formation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Formation:</label>
              <Select value={selectedFormation} onValueChange={(value: keyof typeof FORMATIONS) => setSelectedFormation(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FORMATIONS).map(([key, formation]) => (
                    <SelectItem key={key} value={key}>
                      {formation.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={autoAssignPlayers} variant="outline" className="flex items-center gap-2">
              <Zap size={16} />
              Auto-Assign Best XI
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Team Stats */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{teamStats.avgRating.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Team Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{teamStats.chemistry.toFixed(0)}</div>
              <div className="text-sm text-muted-foreground">Chemistry</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{teamStats.totalGoals}</div>
              <div className="text-sm text-muted-foreground">Total Goals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{teamStats.totalAssists}</div>
              <div className="text-sm text-muted-foreground">Total Assists</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formation Pitch */}
      <Card>
        <CardContent className="p-6">
          <div 
            className="relative bg-gradient-to-b from-green-400 to-green-600 rounded-lg shadow-inner"
            style={{ height: '600px', background: 'linear-gradient(to bottom, #22c55e, #16a34a)' }}
          >
            {/* Pitch markings */}
            <div className="absolute inset-4 border-2 border-white/50 rounded"></div>
            <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-white/50"></div>
            <div className="absolute left-1/2 top-4 bottom-4 w-0.5 bg-white/50"></div>
            <div className="absolute left-1/2 top-1/2 w-20 h-20 border-2 border-white/50 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            
            {/* Goal areas */}
            <div className="absolute left-1/2 top-4 w-24 h-16 border-2 border-white/50 transform -translate-x-1/2"></div>
            <div className="absolute left-1/2 bottom-4 w-24 h-16 border-2 border-white/50 transform -translate-x-1/2"></div>
            
            {/* Players */}
            {formation.positions.map((pos, index) => {
              const player = selectedPlayers[`${pos.position}-${index}`];
              const positionKey = `${pos.position}-${index}`;
              
              return (
                <div
                  key={positionKey}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  onClick={() => {
                    if (player) {
                      onPlayerClick(player);
                    }
                  }}
                >
                  {player ? (
                    <div className="group relative">
                      <div className={`w-12 h-12 rounded-full ${getPositionColor(player.position)} border-2 border-white shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                        <span className="text-white font-bold text-xs">{player.overallRating}</span>
                      </div>
                      <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <div className="font-medium">{player.name}</div>
                        <div className="text-xs">{player.position} • {player.overallRating} OVR</div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-400/50 border-2 border-dashed border-white flex items-center justify-center">
                      <span className="text-white text-xs">{pos.position}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Available Players */}
      <Card>
        <CardHeader>
          <CardTitle>Available Players</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {players
              .filter(player => !Object.values(selectedPlayers).includes(player))
              .map(player => (
                <div 
                  key={player.id}
                  className="p-3 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => onPlayerClick(player)}
                >
                  <div className="flex items-center gap-2">
                    <Badge className={`${getPositionColor(player.position)} text-white text-xs`}>
                      {player.position}
                    </Badge>
                    <span className={`font-bold ${getRatingColor(player.overallRating)}`}>
                      {player.overallRating}
                    </span>
                  </div>
                  <div className="font-medium text-sm mt-1">{player.name}</div>
                  <div className="text-xs text-muted-foreground">
                    ⚽{player.goals} 🎯{player.assists}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}