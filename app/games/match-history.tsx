"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Team, Match, Player } from './types';
import { Search, Calendar, Trophy, Target, BarChart3, Filter, SortAsc, SortDesc } from 'lucide-react';

interface MatchHistoryProps {
  team: Team;
  onEditMatch?: (match: Match) => void;
  onDeleteMatch?: (matchId: string) => void;
}

type SortField = 'date' | 'opponent' | 'result' | 'goalsFor' | 'goalsAgainst';
type SortOrder = 'asc' | 'desc';

interface MatchFilter {
  opponent: string;
  result: 'all' | 'win' | 'draw' | 'loss';
  dateFrom: string;
  dateTo: string;
  minGoals: number;
  maxGoals: number;
}

export function MatchHistory({ team, onEditMatch, onDeleteMatch }: MatchHistoryProps) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<MatchFilter>({
    opponent: '',
    result: 'all',
    dateFrom: '',
    dateTo: '',
    minGoals: 0,
    maxGoals: 20
  });

  const getMatchResult = (match: Match): 'win' | 'draw' | 'loss' => {
    if (match.homeScore > match.awayScore) return 'win';
    if (match.homeScore < match.awayScore) return 'loss';
    return 'draw';
  };

  const getResultBadge = (result: 'win' | 'draw' | 'loss') => {
    const variants = {
      win: { variant: 'default' as const, text: 'W', color: 'bg-green-500' },
      draw: { variant: 'secondary' as const, text: 'D', color: 'bg-yellow-500' },
      loss: { variant: 'destructive' as const, text: 'L', color: 'bg-red-500' }
    };
    return variants[result];
  };

  const filteredAndSortedMatches = useMemo(() => {
    let filtered = team.matches.filter(match => {
      // Search filter
      if (searchTerm && !match.opponent.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Opponent filter
      if (filters.opponent && !match.opponent.toLowerCase().includes(filters.opponent.toLowerCase())) {
        return false;
      }

      // Result filter
      if (filters.result !== 'all') {
        const result = getMatchResult(match);
        if (result !== filters.result) return false;
      }

      // Date filters
      if (filters.dateFrom && match.date < filters.dateFrom) return false;
      if (filters.dateTo && match.date > filters.dateTo) return false;

      // Goals filters
      const totalGoals = match.homeScore + match.awayScore;
      if (totalGoals < filters.minGoals || totalGoals > filters.maxGoals) return false;

      return true;
    });

    // Sort matches
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'opponent':
          comparison = a.opponent.localeCompare(b.opponent);
          break;
        case 'result':
          const resultA = getMatchResult(a);
          const resultB = getMatchResult(b);
          comparison = resultA.localeCompare(resultB);
          break;
        case 'goalsFor':
          comparison = a.homeScore - b.homeScore;
          break;
        case 'goalsAgainst':
          comparison = a.awayScore - b.awayScore;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [team.matches, searchTerm, filters, sortField, sortOrder]);

  const matchStats = useMemo(() => {
    const stats = {
      total: team.matches.length,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      averageGoalsPerMatch: 0,
      cleanSheets: 0,
      biggestWin: { score: '', opponent: '' },
      biggestLoss: { score: '', opponent: '' }
    };

    let biggestWinMargin = -1;
    let biggestLossMargin = -1;

    team.matches.forEach(match => {
      const result = getMatchResult(match);
      stats[result === 'win' ? 'wins' : result === 'draw' ? 'draws' : 'losses']++;
      
      stats.goalsFor += match.homeScore;
      stats.goalsAgainst += match.awayScore;
      
      if (match.awayScore === 0) stats.cleanSheets++;

      const margin = match.homeScore - match.awayScore;
      if (margin > biggestWinMargin) {
        biggestWinMargin = margin;
        stats.biggestWin = {
          score: `${match.homeScore}-${match.awayScore}`,
          opponent: match.opponent
        };
      }
      if (margin < biggestLossMargin) {
        biggestLossMargin = margin;
        stats.biggestLoss = {
          score: `${match.homeScore}-${match.awayScore}`,
          opponent: match.opponent
        };
      }
    });

    stats.averageGoalsPerMatch = stats.total > 0 ? stats.goalsFor / stats.total : 0;

    return stats;
  }, [team.matches]);

  const getPlayerMatchStats = (playerId: string) => {
    const playerStats = { goals: 0, assists: 0, appearances: 0, averageRating: 0 };
    let totalRating = 0;

    team.matches.forEach(match => {
      const playerStat = match.playerStats.find(ps => ps.playerId === playerId);
      if (playerStat) {
        playerStats.goals += playerStat.goals;
        playerStats.assists += playerStat.assists;
        playerStats.appearances++;
        totalRating += playerStat.rating;
      }
    });

    playerStats.averageRating = playerStats.appearances > 0 ? totalRating / playerStats.appearances : 0;
    return playerStats;
  };

  const resetFilters = () => {
    setFilters({
      opponent: '',
      result: 'all',
      dateFrom: '',
      dateTo: '',
      minGoals: 0,
      maxGoals: 20
    });
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold">Match History</h2>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search opponents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-48"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{matchStats.total}</div>
            <div className="text-sm text-muted-foreground">Total Matches</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{matchStats.wins}</div>
            <div className="text-sm text-muted-foreground">Wins</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{matchStats.draws}</div>
            <div className="text-sm text-muted-foreground">Draws</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{matchStats.losses}</div>
            <div className="text-sm text-muted-foreground">Losses</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{matchStats.goalsFor}</div>
            <div className="text-sm text-muted-foreground">Goals For</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{matchStats.cleanSheets}</div>
            <div className="text-sm text-muted-foreground">Clean Sheets</div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium">Result</label>
                <Select value={filters.result} onValueChange={(value: any) => setFilters({...filters, result: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Results</SelectItem>
                    <SelectItem value="win">Wins</SelectItem>
                    <SelectItem value="draw">Draws</SelectItem>
                    <SelectItem value="loss">Losses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">From Date</label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">To Date</label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Min Goals</label>
                <Input
                  type="number"
                  min="0"
                  value={filters.minGoals}
                  onChange={(e) => setFilters({...filters, minGoals: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="flex items-end">
                <Button variant="outline" onClick={resetFilters} className="w-full">
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sort Controls */}
      <div className="flex gap-2 items-center">
        <span className="text-sm font-medium">Sort by:</span>
        <Select value={sortField} onValueChange={(value: SortField) => setSortField(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="opponent">Opponent</SelectItem>
            <SelectItem value="result">Result</SelectItem>
            <SelectItem value="goalsFor">Goals For</SelectItem>
            <SelectItem value="goalsAgainst">Goals Against</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
        </Button>
      </div>

      {/* Match List */}
      <div className="space-y-3">
        {filteredAndSortedMatches.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No matches found</h3>
              <p className="text-muted-foreground">
                {team.matches.length === 0 
                  ? "No matches have been played yet. Start by adding a match or running a simulation."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedMatches.map((match) => {
            const result = getMatchResult(match);
            const resultBadge = getResultBadge(result);
            
            return (
              <Card key={match.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Badge variant={resultBadge.variant} className="w-8 h-8 rounded-full flex items-center justify-center">
                        {resultBadge.text}
                      </Badge>
                      <div>
                        <div className="font-semibold">
                          {team.name} vs {match.opponent}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(match.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {match.homeScore} - {match.awayScore}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {match.playerStats.reduce((sum, ps) => sum + ps.goals, 0)} goals scored
                        </div>
                      </div>
                      
                      <Dialog open={isDetailOpen && selectedMatch?.id === match.id} 
                              onOpenChange={(open) => {
                                setIsDetailOpen(open);
                                if (!open) setSelectedMatch(null);
                              }}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedMatch(match)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              {match.homeTeam} vs {match.awayTeam}
                            </DialogTitle>
                            <DialogDescription>
                              Match details for {new Date(match.date).toLocaleDateString()}
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedMatch && (
                            <Tabs defaultValue="overview" className="w-full">
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="players">Player Stats</TabsTrigger>
                                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="overview" className="space-y-4">
                                <div className="text-center">
                                  <div className="text-4xl font-bold mb-2">
                                    {selectedMatch.homeScore} - {selectedMatch.awayScore}
                                  </div>
                                  <Badge variant={getResultBadge(getMatchResult(selectedMatch)).variant} className="text-lg px-4 py-2">
                                    {result === 'win' ? 'Victory!' : result === 'draw' ? 'Draw' : 'Defeat'}
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="text-center">
                                    <div className="font-semibold">{selectedMatch.homeTeam}</div>
                                    <div className="text-muted-foreground">Home</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold">{selectedMatch.awayTeam}</div>
                                    <div className="text-muted-foreground">Away</div>
                                  </div>
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="players" className="space-y-4">
                                <div className="space-y-2">
                                  {selectedMatch.playerStats
                                    .filter(ps => ps.goals > 0 || ps.assists > 0 || ps.rating >= 8)
                                    .sort((a, b) => (b.goals * 2 + b.assists) - (a.goals * 2 + a.assists))
                                    .map(playerStat => {
                                      const player = team.players.find(p => p.id === playerStat.playerId);
                                      if (!player) return null;
                                      
                                      return (
                                        <div key={playerStat.playerId} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                          <div>
                                            <div className="font-medium">{player.name}</div>
                                            <div className="text-sm text-muted-foreground">{player.position}</div>
                                          </div>
                                          <div className="flex gap-4 text-sm">
                                            {playerStat.goals > 0 && (
                                              <span className="flex items-center gap-1">
                                                <Target className="h-4 w-4" />
                                                {playerStat.goals}
                                              </span>
                                            )}
                                            {playerStat.assists > 0 && (
                                              <span className="flex items-center gap-1">
                                                <Trophy className="h-4 w-4" />
                                                {playerStat.assists}
                                              </span>
                                            )}
                                            <span className="font-medium">
                                              {playerStat.rating.toFixed(1)}★
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="analysis" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-base">Team Performance</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-2">
                                        <div className="flex justify-between">
                                          <span>Goals Scored:</span>
                                          <span className="font-medium">{selectedMatch.homeScore}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Goals Conceded:</span>
                                          <span className="font-medium">{selectedMatch.awayScore}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Goal Difference:</span>
                                          <span className={`font-medium ${selectedMatch.homeScore - selectedMatch.awayScore >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {selectedMatch.homeScore - selectedMatch.awayScore > 0 ? '+' : ''}{selectedMatch.homeScore - selectedMatch.awayScore}
                                          </span>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                  
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-base">Player Ratings</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-2">
                                        <div className="flex justify-between">
                                          <span>Average Rating:</span>
                                          <span className="font-medium">
                                            {(selectedMatch.playerStats.reduce((sum, ps) => sum + ps.rating, 0) / selectedMatch.playerStats.length).toFixed(1)}★
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Best Performance:</span>
                                          <span className="font-medium">
                                            {Math.max(...selectedMatch.playerStats.map(ps => ps.rating)).toFixed(1)}★
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Players 8+ Rating:</span>
                                          <span className="font-medium">
                                            {selectedMatch.playerStats.filter(ps => ps.rating >= 8).length}
                                          </span>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              </TabsContent>
                            </Tabs>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Results Summary */}
      {filteredAndSortedMatches.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="text-center text-sm text-muted-foreground">
              Showing {filteredAndSortedMatches.length} of {team.matches.length} matches
              {matchStats.total > 0 && (
                <span className="ml-4">
                  Win Rate: {((matchStats.wins / matchStats.total) * 100).toFixed(1)}%
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}