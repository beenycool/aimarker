"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Player } from './types';
import { CSVImport } from './csv-import';
import { Zap, Copy, Users, Star, Target, Crown, Trophy } from 'lucide-react';

interface QuickPlayerCreatorProps {
  onCreatePlayer: (player: Player) => void;
  onCreateMultiple: (players: Player[]) => void;
}

const PLAYER_TEMPLATES = {
  'world-class-striker': {
    name: 'World Class Striker',
    position: 'ST' as const,
    pace: 90, shooting: 95, passing: 75, dribbling: 88, defending: 35, physical: 85
  },
  'elite-midfielder': {
    name: 'Elite Midfielder',
    position: 'CM' as const,
    pace: 75, shooting: 80, passing: 95, dribbling: 85, defending: 75, physical: 80
  },
  'solid-defender': {
    name: 'Solid Defender',
    position: 'CB' as const,
    pace: 70, shooting: 40, passing: 75, dribbling: 55, defending: 92, physical: 90
  },
  'top-goalkeeper': {
    name: 'Top Goalkeeper',
    position: 'GK' as const,
    pace: 55, shooting: 25, passing: 70, dribbling: 45, defending: 95, physical: 85
  },
  'speedy-winger': {
    name: 'Speedy Winger',
    position: 'RW' as const,
    pace: 95, shooting: 75, passing: 80, dribbling: 92, defending: 45, physical: 70
  },
  'young-talent': {
    name: 'Young Talent',
    position: 'CAM' as const,
    pace: 82, shooting: 75, passing: 85, dribbling: 88, defending: 55, physical: 68
  }
};

const QUICK_TEAMS = {
  'premier-league-stars': {
    name: 'Premier League Stars',
    players: [
      { name: 'Player A', position: 'ST', pace: 85, shooting: 95, passing: 82, dribbling: 85, defending: 40, physical: 88 },
      { name: 'Player B', position: 'CAM', pace: 78, shooting: 88, passing: 96, dribbling: 90, defending: 65, physical: 82 },
      { name: 'Player C', position: 'CB', pace: 82, shooting: 50, passing: 85, dribbling: 70, defending: 95, physical: 92 },
      { name: 'Player D', position: 'RW', pace: 92, shooting: 90, passing: 82, dribbling: 93, defending: 45, physical: 78 },
      { name: 'Player E', position: 'GK', pace: 60, shooting: 30, passing: 75, dribbling: 50, defending: 94, physical: 88 }
    ]
  },
  'la-liga-legends': {
    name: 'La Liga Legends',
    players: [
      { name: 'Karim Benzema', position: 'ST', pace: 82, shooting: 92, passing: 85, dribbling: 88, defending: 42, physical: 85 },
      { name: 'Luka Modric', position: 'CM', pace: 75, shooting: 78, passing: 94, dribbling: 88, defending: 72, physical: 75 },
      { name: 'Sergio Ramos', position: 'CB', pace: 78, shooting: 65, passing: 82, dribbling: 72, defending: 92, physical: 90 },
      { name: 'Pedri', position: 'CAM', pace: 80, shooting: 75, passing: 90, dribbling: 88, defending: 65, physical: 70 },
      { name: 'Ter Stegen', position: 'GK', pace: 58, shooting: 28, passing: 80, dribbling: 52, defending: 92, physical: 85 }
    ]
  }
};

export function QuickPlayerCreator({ onCreatePlayer, onCreateMultiple }: QuickPlayerCreatorProps) {
  const [playerName, setPlayerName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof PLAYER_TEMPLATES>('world-class-striker');
  const [quickRating, setQuickRating] = useState(85);

  const createFromTemplate = () => {
    if (!playerName.trim()) return;

    const template = PLAYER_TEMPLATES[selectedTemplate];
    const player: Player = {
      id: Date.now().toString(),
      name: playerName.trim(),
      position: template.position,
      pace: template.pace,
      shooting: template.shooting,
      passing: template.passing,
      dribbling: template.dribbling,
      defending: template.defending,
      physical: template.physical,
      overallRating: Math.round((template.pace + template.shooting + template.passing + template.dribbling + template.defending + template.physical) / 6),
      goals: 0,
      assists: 0,
      appearances: 0,
      ...(template.position === 'GK' && { cleanSheets: 0 })
    };

    onCreatePlayer(player);
    setPlayerName('');
  };

  const createFromRating = () => {
    if (!playerName.trim()) return;

    // Auto-generate balanced stats based on overall rating
    const baseVariation = 10;
    const player: Player = {
      id: Date.now().toString(),
      name: playerName.trim(),
      position: 'ST',
      pace: Math.max(40, Math.min(99, quickRating + Math.random() * baseVariation - baseVariation/2)),
      shooting: Math.max(40, Math.min(99, quickRating + Math.random() * baseVariation - baseVariation/2)),
      passing: Math.max(40, Math.min(99, quickRating + Math.random() * baseVariation - baseVariation/2)),
      dribbling: Math.max(40, Math.min(99, quickRating + Math.random() * baseVariation - baseVariation/2)),
      defending: Math.max(40, Math.min(99, quickRating + Math.random() * baseVariation - baseVariation/2)),
      physical: Math.max(40, Math.min(99, quickRating + Math.random() * baseVariation - baseVariation/2)),
      overallRating: quickRating,
      goals: 0,
      assists: 0,
      appearances: 0
    };

    // Round all stats
    player.pace = Math.round(player.pace);
    player.shooting = Math.round(player.shooting);
    player.passing = Math.round(player.passing);
    player.dribbling = Math.round(player.dribbling);
    player.defending = Math.round(player.defending);
    player.physical = Math.round(player.physical);

    onCreatePlayer(player);
    setPlayerName('');
  };

  const loadQuickTeam = (teamKey: keyof typeof QUICK_TEAMS) => {
    const team = QUICK_TEAMS[teamKey];
    const players: Player[] = team.players.map((template, index) => ({
      id: `${Date.now()}-${index}`,
      name: template.name,
      position: template.position as Player['position'],
      pace: template.pace,
      shooting: template.shooting,
      passing: template.passing,
      dribbling: template.dribbling,
      defending: template.defending,
      physical: template.physical,
      overallRating: Math.round((template.pace + template.shooting + template.passing + template.dribbling + template.defending + template.physical) / 6),
      goals: 0,
      assists: 0,
      appearances: 0,
      ...(template.position === 'GK' && { cleanSheets: 0 })
    }));

    onCreateMultiple(players);
  };

  const createRandomPlayer = () => {
    if (!playerName.trim()) return;

    const positions = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST'];
    const randomPosition = positions[Math.floor(Math.random() * positions.length)] as Player['position'];
    
    const baseRating = 60 + Math.random() * 30; // 60-90 rating range
    const variation = 15;

    const player: Player = {
      id: Date.now().toString(),
      name: playerName.trim(),
      position: randomPosition,
      pace: Math.round(Math.max(40, Math.min(99, baseRating + (Math.random() - 0.5) * variation))),
      shooting: Math.round(Math.max(40, Math.min(99, baseRating + (Math.random() - 0.5) * variation))),
      passing: Math.round(Math.max(40, Math.min(99, baseRating + (Math.random() - 0.5) * variation))),
      dribbling: Math.round(Math.max(40, Math.min(99, baseRating + (Math.random() - 0.5) * variation))),
      defending: Math.round(Math.max(40, Math.min(99, baseRating + (Math.random() - 0.5) * variation))),
      physical: Math.round(Math.max(40, Math.min(99, baseRating + (Math.random() - 0.5) * variation))),
      overallRating: Math.round(baseRating),
      goals: 0,
      assists: 0,
      appearances: 0,
      ...(randomPosition === 'GK' && { cleanSheets: 0 })
    };

    onCreatePlayer(player);
    setPlayerName('');
  };

  const bulkCreateFromText = () => {
    const names = playerName.split('\n').filter(name => name.trim());
    const players: Player[] = names.map((name, index) => {
      const baseRating = 70 + Math.random() * 20; // 70-90 range
      return {
        id: `${Date.now()}-${index}`,
        name: name.trim(),
        position: 'ST' as Player['position'],
        pace: Math.round(baseRating + (Math.random() - 0.5) * 10),
        shooting: Math.round(baseRating + (Math.random() - 0.5) * 10),
        passing: Math.round(baseRating + (Math.random() - 0.5) * 10),
        dribbling: Math.round(baseRating + (Math.random() - 0.5) * 10),
        defending: Math.round(baseRating + (Math.random() - 0.5) * 10),
        physical: Math.round(baseRating + (Math.random() - 0.5) * 10),
        overallRating: Math.round(baseRating),
        goals: 0,
        assists: 0,
        appearances: 0
      };
    });

    onCreateMultiple(players);
    setPlayerName('');
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Quick Single Player */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="text-yellow-500" />
            Quick Player Creator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="quick-name">Player Name</Label>
            <Input
              id="quick-name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter player name..."
              onKeyDown={(e) => e.key === 'Enter' && createFromTemplate()}
            />
          </div>

          <div className="space-y-3">
            <div>
              <Label>Player Template</Label>
              <Select value={selectedTemplate} onValueChange={(value: keyof typeof PLAYER_TEMPLATES) => setSelectedTemplate(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="world-class-striker">⚽ World Class Striker (90+ OVR)</SelectItem>
                  <SelectItem value="elite-midfielder">🎯 Elite Midfielder (85+ OVR)</SelectItem>
                  <SelectItem value="solid-defender">🛡️ Solid Defender (85+ OVR)</SelectItem>
                  <SelectItem value="top-goalkeeper">🧤 Top Goalkeeper (85+ OVR)</SelectItem>
                  <SelectItem value="speedy-winger">💨 Speedy Winger (85+ OVR)</SelectItem>
                  <SelectItem value="young-talent">⭐ Young Talent (80+ OVR)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={createFromTemplate} className="w-full" disabled={!playerName.trim()}>
              <Star className="mr-2 h-4 w-4" />
              Create Player
            </Button>
          </div>

          <div className="border-t pt-3">
            <Label>Or Quick Rating (60-95)</Label>
            <div className="flex gap-2 mt-2">
              <Input
                type="number"
                min={60}
                max={95}
                value={quickRating}
                onChange={(e) => setQuickRating(Number(e.target.value))}
                className="w-20"
              />
              <Button onClick={createFromRating} variant="outline" className="flex-1" disabled={!playerName.trim()}>
                Auto-Generate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="text-blue-500" />
            Bulk Creation Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Load Full Team</Label>
            <div className="grid gap-2 mt-2">
              <Button 
                onClick={() => loadQuickTeam('premier-league-stars')} 
                variant="outline" 
                className="justify-start"
              >
                <Crown className="mr-2 h-4 w-4" />
                Premier League Stars (5 players)
              </Button>
              <Button 
                onClick={() => loadQuickTeam('la-liga-legends')} 
                variant="outline" 
                className="justify-start"
              >
                <Trophy className="mr-2 h-4 w-4" />
                La Liga Legends (5 players)
              </Button>
            </div>
          </div>

          <div className="border-t pt-3">
            <Label>Bulk Create from Names</Label>
            <textarea
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter multiple names (one per line):&#10;Player One&#10;Player Two&#10;Player Three"
              className="w-full h-20 p-2 border rounded text-sm mt-2 resize-none"
            />
            <Button 
              onClick={bulkCreateFromText} 
              className="w-full mt-2" 
              disabled={!playerName.trim()}
            >
              <Copy className="mr-2 h-4 w-4" />
              Create All Players
            </Button>
          </div>

          <div className="border-t pt-3">
            <Button 
              onClick={createRandomPlayer} 
              variant="outline" 
              className="w-full" 
              disabled={!playerName.trim()}
            >
              <Target className="mr-2 h-4 w-4" />
              Create Random Player
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}