"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Player } from './types';
import { BarChart3, TrendingUp, Users, Trophy } from 'lucide-react';

interface PlayerComparisonProps {
  players: Player[];
}

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

export function PlayerComparison({ players }: PlayerComparisonProps) {
  const [player1Id, setPlayer1Id] = useState<string>('');
  const [player2Id, setPlayer2Id] = useState<string>('');

  const player1 = players.find(p => p.id === player1Id);
  const player2 = players.find(p => p.id === player2Id);

  const getStatComparison = (stat1: number, stat2: number) => {
    if (stat1 > stat2) return { winner: 1, difference: stat1 - stat2 };
    if (stat2 > stat1) return { winner: 2, difference: stat2 - stat1 };
    return { winner: 0, difference: 0 };
  };

  const StatBar = ({ label, value1, value2, icon }: { label: string; value1: number; value2: number; icon: string }) => {
    const maxValue = Math.max(value1, value2, 50); // Minimum scale of 50
    const comparison = getStatComparison(value1, value2);
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium flex items-center gap-1">
            <span>{icon}</span>
            {label}
          </span>
        </div>
        <div className="relative">
          <div className="flex items-center gap-2">
            {/* Player 1 bar */}
            <div className="flex-1 text-right">
              <div className="text-sm font-bold mb-1">{value1}</div>
              <div className="h-3 bg-gray-200 rounded-l-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    comparison.winner === 1 ? 'bg-green-500' : 
                    comparison.winner === 0 ? 'bg-gray-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${(value1 / maxValue) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* VS divider */}
            <div className="text-xs font-bold text-muted-foreground px-2">VS</div>
            
            {/* Player 2 bar */}
            <div className="flex-1">
              <div className="text-sm font-bold mb-1">{value2}</div>
              <div className="h-3 bg-gray-200 rounded-r-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    comparison.winner === 2 ? 'bg-green-500' : 
                    comparison.winner === 0 ? 'bg-gray-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${(value2 / maxValue) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!player1 || !player2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="text-purple-500" />
            Player Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select First Player</label>
              <Select value={player1Id} onValueChange={setPlayer1Id}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose player..." />
                </SelectTrigger>
                <SelectContent>
                  {players.map(player => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name} ({player.position} - {player.overallRating})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Select Second Player</label>
              <Select value={player2Id} onValueChange={setPlayer2Id}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose player..." />
                </SelectTrigger>
                <SelectContent>
                  {players.filter(p => p.id !== player1Id).map(player => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name} ({player.position} - {player.overallRating})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-8 text-center text-muted-foreground">
            <Users className="mx-auto h-12 w-12 mb-4" />
            <p>Select two players to compare their statistics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const overallComparison = getStatComparison(player1.overallRating, player2.overallRating);

  return (
    <div className="space-y-6">
      {/* Player Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="text-purple-500" />
            Player Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">First Player</label>
              <Select value={player1Id} onValueChange={setPlayer1Id}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {players.map(player => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name} ({player.position} - {player.overallRating})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Second Player</label>
              <Select value={player2Id} onValueChange={setPlayer2Id}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {players.filter(p => p.id !== player1Id).map(player => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name} ({player.position} - {player.overallRating})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Player Headers */}
      <div className="grid grid-cols-2 gap-4">
        <Card className={`${overallComparison.winner === 1 ? 'ring-2 ring-green-500' : ''}`}>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{player1.name}</div>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Badge className={`${getPositionColor(player1.position)} text-white`}>
                  {player1.position}
                </Badge>
                <span className={`text-3xl font-bold ${getRatingColor(player1.overallRating)}`}>
                  {player1.overallRating}
                </span>
              </div>
              {overallComparison.winner === 1 && (
                <div className="text-green-600 text-sm font-medium mt-2">
                  +{overallComparison.difference} Overall
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className={`${overallComparison.winner === 2 ? 'ring-2 ring-green-500' : ''}`}>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{player2.name}</div>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Badge className={`${getPositionColor(player2.position)} text-white`}>
                  {player2.position}
                </Badge>
                <span className={`text-3xl font-bold ${getRatingColor(player2.overallRating)}`}>
                  {player2.overallRating}
                </span>
              </div>
              {overallComparison.winner === 2 && (
                <div className="text-green-600 text-sm font-medium mt-2">
                  +{overallComparison.difference} Overall
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attributes Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Attribute Comparison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <StatBar label="Pace" value1={player1.pace} value2={player2.pace} icon="⚡" />
          <StatBar label="Shooting" value1={player1.shooting} value2={player2.shooting} icon="⚽" />
          <StatBar label="Passing" value1={player1.passing} value2={player2.passing} icon="🎯" />
          <StatBar label="Dribbling" value1={player1.dribbling} value2={player2.dribbling} icon="🏃" />
          <StatBar label="Defending" value1={player1.defending} value2={player2.defending} icon="🛡️" />
          <StatBar label="Physical" value1={player1.physical} value2={player2.physical} icon="💪" />
        </CardContent>
      </Card>

      {/* Performance Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="text-yellow-500" />
            Performance Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <StatBar label="Goals" value1={player1.goals} value2={player2.goals} icon="⚽" />
          <StatBar label="Assists" value1={player1.assists} value2={player2.assists} icon="🎯" />
          <StatBar label="Appearances" value1={player1.appearances} value2={player2.appearances} icon="📊" />
          
          {/* Goals per game and assists per game */}
          <StatBar 
            label="Goals per Game" 
            value1={player1.appearances > 0 ? Number((player1.goals / player1.appearances).toFixed(2)) : 0} 
            value2={player2.appearances > 0 ? Number((player2.goals / player2.appearances).toFixed(2)) : 0} 
            icon="📈" 
          />
          <StatBar 
            label="Assists per Game" 
            value1={player1.appearances > 0 ? Number((player1.assists / player1.appearances).toFixed(2)) : 0} 
            value2={player2.appearances > 0 ? Number((player2.assists / player2.appearances).toFixed(2)) : 0} 
            icon="📊" 
          />
          
          {/* Goal contributions */}
          <StatBar 
            label="Goal Contributions" 
            value1={player1.goals + player1.assists} 
            value2={player2.goals + player2.assists} 
            icon="🎖️" 
          />
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-blue-500" />
            Comparison Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {[
                  player1.pace > player2.pace,
                  player1.shooting > player2.shooting,
                  player1.passing > player2.passing,
                  player1.dribbling > player2.dribbling,
                  player1.defending > player2.defending,
                  player1.physical > player2.physical
                ].filter(Boolean).length}
              </div>
              <div className="text-sm text-muted-foreground">Attributes Won</div>
              <div className="text-xs font-medium">{player1.name}</div>
            </div>

            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.abs(player1.overallRating - player2.overallRating)}
              </div>
              <div className="text-sm text-muted-foreground">Rating Difference</div>
              <div className="text-xs font-medium">Overall</div>
            </div>

            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {[
                  player2.pace > player1.pace,
                  player2.shooting > player1.shooting,
                  player2.passing > player1.passing,
                  player2.dribbling > player1.dribbling,
                  player2.defending > player1.defending,
                  player2.physical > player1.physical
                ].filter(Boolean).length}
              </div>
              <div className="text-sm text-muted-foreground">Attributes Won</div>
              <div className="text-xs font-medium">{player2.name}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}