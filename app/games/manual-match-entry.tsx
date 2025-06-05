"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Player, Team, Match } from './types';
import { Plus, Trash2, Save, Calendar } from 'lucide-react';

interface ManualMatchEntryProps {
  team: Team;
  onMatchAdded: (match: Match) => void;
}

interface GoalEvent {
  playerId: string;
  minute: number;
  isAssist?: boolean;
  assistPlayerId?: string;
}

export function ManualMatchEntry({ team, onMatchAdded }: ManualMatchEntryProps) {
  const [opponent, setOpponent] = useState('');
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [matchDate, setMatchDate] = useState(new Date().toISOString().split('T')[0]);
  const [goalEvents, setGoalEvents] = useState<GoalEvent[]>([]);
  
  const addGoal = () => {
    setGoalEvents([...goalEvents, { playerId: '', minute: 1 }]);
  };

  const removeGoal = (index: number) => {
    setGoalEvents(goalEvents.filter((_, i) => i !== index));
  };

  const updateGoal = (index: number, field: keyof GoalEvent, value: string | number) => {
    const updated = goalEvents.map((goal, i) => 
      i === index ? { ...goal, [field]: value } : goal
    );
    setGoalEvents(updated);
  };

  const saveMatch = () => {
    if (!opponent.trim()) {
      alert('Please enter opponent name');
      return;
    }

    // Count goals per player
    const playerStats = team.players.map(player => {
      const playerGoals = goalEvents.filter(g => g.playerId === player.id).length;
      const playerAssists = goalEvents.filter(g => g.assistPlayerId === player.id).length;
      
      return {
        playerId: player.id,
        goals: playerGoals,
        assists: playerAssists,
        rating: 7.0 // Default rating - could be made customizable
      };
    });

    const match: Match = {
      id: Date.now().toString(),
      date: matchDate,
      opponent: opponent.trim(),
      homeTeam: team.name,
      awayTeam: opponent.trim(),
      homeScore,
      awayScore,
      playerStats
    };

    onMatchAdded(match);
    
    // Reset form
    setOpponent('');
    setHomeScore(0);
    setAwayScore(0);
    setGoalEvents([]);
    setMatchDate(new Date().toISOString().split('T')[0]);
  };

  const quickFillGoals = () => {
    // Auto-create goal events based on home score
    const newGoals: GoalEvent[] = [];
    for (let i = 0; i < homeScore; i++) {
      newGoals.push({
        playerId: '',
        minute: 10 + (i * 15) // Spread goals throughout match
      });
    }
    setGoalEvents(newGoals);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="text-blue-500" />
          Add Match Result
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Match Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="opponent">Opponent Team</Label>
            <Input
              id="opponent"
              value={opponent}
              onChange={(e) => setOpponent(e.target.value)}
              placeholder="Enter opponent name..."
            />
          </div>
          
          <div>
            <Label htmlFor="match-date">Match Date</Label>
            <Input
              id="match-date"
              type="date"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
            />
          </div>
          
          <div>
            <Label>Final Score</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                max="20"
                value={homeScore}
                onChange={(e) => setHomeScore(Number(e.target.value))}
                className="w-16 text-center"
              />
              <span className="font-bold">-</span>
              <Input
                type="number"
                min="0"
                max="20"
                value={awayScore}
                onChange={(e) => setAwayScore(Number(e.target.value))}
                className="w-16 text-center"
              />
            </div>
          </div>
        </div>

        {/* Score Preview */}
        <div className="p-4 bg-muted rounded-lg text-center">
          <div className="text-lg font-semibold">
            {team.name} <span className="text-2xl font-bold mx-4">{homeScore} - {awayScore}</span> {opponent || 'Opponent'}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {new Date(matchDate).toLocaleDateString()}
          </div>
        </div>

        {/* Goal Scorers */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <Label className="text-base font-semibold">Goal Scorers (Optional)</Label>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={quickFillGoals}
                disabled={homeScore === 0}
              >
                Quick Fill ({homeScore} goals)
              </Button>
              <Button variant="outline" size="sm" onClick={addGoal}>
                <Plus size={16} />
                Add Goal
              </Button>
            </div>
          </div>

          {goalEvents.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground bg-muted/30 rounded-lg">
              <p>No goals recorded yet</p>
              <p className="text-xs mt-1">Goals are optional - match will be saved with just the score</p>
            </div>
          ) : (
            <div className="space-y-3">
              {goalEvents.map((goal, index) => (
                <div key={index} className="flex gap-3 items-center p-3 border rounded-lg">
                  <div className="font-medium text-sm">#{index + 1}</div>
                  
                  <div className="flex-1">
                    <Label className="text-xs">Goal Scorer</Label>
                    <Select 
                      value={goal.playerId} 
                      onValueChange={(value) => updateGoal(index, 'playerId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select player..." />
                      </SelectTrigger>
                      <SelectContent>
                        {team.players.map(player => (
                          <SelectItem key={player.id} value={player.id}>
                            {player.name} ({player.position})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-20">
                    <Label className="text-xs">Minute</Label>
                    <Input
                      type="number"
                      min="1"
                      max="120"
                      value={goal.minute}
                      onChange={(e) => updateGoal(index, 'minute', Number(e.target.value))}
                      className="text-center"
                    />
                  </div>

                  <div className="flex-1">
                    <Label className="text-xs">Assist (Optional)</Label>
                    <Select 
                      value={goal.assistPlayerId || ''} 
                      onValueChange={(value) => updateGoal(index, 'assistPlayerId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select assist..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No assist</SelectItem>
                        {team.players
                          .filter(p => p.id !== goal.playerId)
                          .map(player => (
                            <SelectItem key={player.id} value={player.id}>
                              {player.name} ({player.position})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => removeGoal(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button 
            onClick={saveMatch}
            disabled={!opponent.trim()}
            className="flex items-center gap-2"
          >
            <Save size={16} />
            Save Match Result
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded">
          <strong>How to use:</strong>
          <ul className="mt-1 space-y-1 list-disc list-inside">
            <li>Enter the opponent team name and final score</li>
            <li>Optionally add individual goal scorers with assist information</li>
            <li>Use "Quick Fill" to automatically create goal entries based on your score</li>
            <li>Player stats will be automatically updated when you save</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}