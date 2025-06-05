"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Player, Team, Match } from './types';
import { Trophy, Star, Target, Zap, Crown, Award, Medal, Flame } from 'lucide-react';

interface AchievementsProps {
  team: Team;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum';
  category: 'team' | 'player' | 'simulation' | 'management';
  requirement: number;
  current: number;
  unlocked: boolean;
  reward?: string;
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'bronze': return 'bg-amber-600';
    case 'silver': return 'bg-gray-400';
    case 'gold': return 'bg-yellow-500';
    case 'platinum': return 'bg-purple-600';
    default: return 'bg-gray-400';
  }
};

const getRarityTextColor = (rarity: string) => {
  switch (rarity) {
    case 'bronze': return 'text-amber-600';
    case 'silver': return 'text-gray-600';
    case 'gold': return 'text-yellow-600';
    case 'platinum': return 'text-purple-600';
    default: return 'text-gray-600';
  }
};

export function Achievements({ team }: AchievementsProps) {
  const calculateAchievements = (): Achievement[] => {
    const totalGoals = team.players.reduce((sum, p) => sum + p.goals, 0);
    const totalAssists = team.players.reduce((sum, p) => sum + p.assists, 0);
    const totalMatches = team.matches.length;
    const wins = team.matches.filter(m => m.homeScore > m.awayScore).length;
    const highestRatedPlayer = team.players.reduce((max, p) => p.overallRating > max.overallRating ? p : max, team.players[0] || { overallRating: 0 });
    const topScorer = team.players.reduce((max, p) => p.goals > max.goals ? p : max, team.players[0] || { goals: 0 });
    const averageTeamRating = team.players.length > 0 ? team.players.reduce((sum, p) => sum + p.overallRating, 0) / team.players.length : 0;
    
    return [
      // Team Achievements
      {
        id: 'first_team',
        title: 'Squad Builder',
        description: 'Create your first team',
        icon: Trophy,
        rarity: 'bronze',
        category: 'team',
        requirement: 1,
        current: team.players.length > 0 ? 1 : 0,
        unlocked: team.players.length > 0,
        reward: 'Team Management unlocked'
      },
      {
        id: 'full_squad',
        title: 'Full Squad',
        description: 'Have 11 players in your team',
        icon: Star,
        rarity: 'silver',
        category: 'team',
        requirement: 11,
        current: team.players.length,
        unlocked: team.players.length >= 11,
        reward: 'Formation tactics unlocked'
      },
      {
        id: 'elite_team',
        title: 'Elite Team',
        description: 'Achieve 85+ average team rating',
        icon: Crown,
        rarity: 'gold',
        category: 'team',
        requirement: 85,
        current: Math.round(averageTeamRating),
        unlocked: averageTeamRating >= 85,
        reward: 'Elite competition access'
      },
      {
        id: 'legendary_squad',
        title: 'Legendary Squad',
        description: 'Have a player with 95+ overall rating',
        icon: Crown,
        rarity: 'platinum',
        category: 'team',
        requirement: 95,
        current: highestRatedPlayer?.overallRating || 0,
        unlocked: (highestRatedPlayer?.overallRating || 0) >= 95,
        reward: 'Legendary status'
      },

      // Simulation Achievements
      {
        id: 'first_match',
        title: 'Debut',
        description: 'Play your first simulated match',
        icon: Target,
        rarity: 'bronze',
        category: 'simulation',
        requirement: 1,
        current: totalMatches,
        unlocked: totalMatches >= 1,
        reward: 'Match analysis unlocked'
      },
      {
        id: 'ten_matches',
        title: 'Experienced',
        description: 'Play 10 simulated matches',
        icon: Medal,
        rarity: 'silver',
        category: 'simulation',
        requirement: 10,
        current: totalMatches,
        unlocked: totalMatches >= 10,
        reward: 'Advanced statistics'
      },
      {
        id: 'winning_streak',
        title: 'Winning Streak',
        description: 'Win 5 matches in a row',
        icon: Flame,
        rarity: 'gold',
        category: 'simulation',
        requirement: 5,
        current: getWinningStreak(team.matches),
        unlocked: getWinningStreak(team.matches) >= 5,
        reward: 'Momentum boost'
      },
      {
        id: 'century_goals',
        title: 'Century Club',
        description: 'Score 100 goals as a team',
        icon: Target,
        rarity: 'gold',
        category: 'simulation',
        requirement: 100,
        current: totalGoals,
        unlocked: totalGoals >= 100,
        reward: 'Goal celebration styles'
      },

      // Player Achievements
      {
        id: 'first_goal',
        title: 'First Blood',
        description: 'Score your first goal',
        icon: Target,
        rarity: 'bronze',
        category: 'player',
        requirement: 1,
        current: totalGoals,
        unlocked: totalGoals >= 1,
        reward: 'Goal tracking enabled'
      },
      {
        id: 'hat_trick_hero',
        title: 'Hat-trick Hero',
        description: 'Have a player score 10+ goals',
        icon: Award,
        rarity: 'silver',
        category: 'player',
        requirement: 10,
        current: topScorer?.goals || 0,
        unlocked: (topScorer?.goals || 0) >= 10,
        reward: 'Player spotlight feature'
      },
      {
        id: 'assist_master',
        title: 'Assist Master',
        description: 'Record 50 team assists',
        icon: Star,
        rarity: 'silver',
        category: 'player',
        requirement: 50,
        current: totalAssists,
        unlocked: totalAssists >= 50,
        reward: 'Playmaker badge'
      },
      {
        id: 'legend',
        title: 'Living Legend',
        description: 'Have a player with 50+ appearances',
        icon: Crown,
        rarity: 'platinum',
        category: 'player',
        requirement: 50,
        current: Math.max(...team.players.map(p => p.appearances), 0),
        unlocked: Math.max(...team.players.map(p => p.appearances), 0) >= 50,
        reward: 'Hall of Fame entry'
      },

      // Management Achievements
      {
        id: 'tactician',
        title: 'Master Tactician',
        description: 'Use all formation types',
        icon: Zap,
        rarity: 'gold',
        category: 'management',
        requirement: 3,
        current: 0, // Would need to track formation usage
        unlocked: false,
        reward: 'Custom formations'
      },
      {
        id: 'scout',
        title: 'Talent Scout',
        description: 'Create 25 players',
        icon: Star,
        rarity: 'silver',
        category: 'management',
        requirement: 25,
        current: team.players.length,
        unlocked: team.players.length >= 25,
        reward: 'Player generator tool'
      }
    ];
  };

  function getWinningStreak(matches: Match[]): number {
    let currentStreak = 0;
    let maxStreak = 0;
    
    for (let i = matches.length - 1; i >= 0; i--) {
      const match = matches[i];
      if (match.homeScore > match.awayScore) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    return maxStreak;
  }

  const achievements = calculateAchievements();
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = (unlockedCount / totalCount) * 100;

  const categories = {
    team: achievements.filter(a => a.category === 'team'),
    player: achievements.filter(a => a.category === 'player'),
    simulation: achievements.filter(a => a.category === 'simulation'),
    management: achievements.filter(a => a.category === 'management')
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="text-yellow-500" />
            Achievement Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">
                {unlockedCount} / {totalCount} Achievements Unlocked
              </span>
              <span className="text-2xl font-bold text-yellow-600">
                {Math.round(completionPercentage)}%
              </span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {Object.entries(categories).map(([category, categoryAchievements]) => {
                const unlocked = categoryAchievements.filter(a => a.unlocked).length;
                const total = categoryAchievements.length;
                const percentage = (unlocked / total) * 100;
                
                return (
                  <div key={category} className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{unlocked}/{total}</div>
                    <div className="text-sm text-muted-foreground capitalize">{category}</div>
                    <div className="text-xs text-green-600 font-medium">{Math.round(percentage)}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Categories */}
      {Object.entries(categories).map(([categoryName, categoryAchievements]) => (
        <Card key={categoryName}>
          <CardHeader>
            <CardTitle className="capitalize flex items-center gap-2">
              {categoryName === 'team' && <Star className="text-blue-500" />}
              {categoryName === 'player' && <Award className="text-green-500" />}
              {categoryName === 'simulation' && <Target className="text-red-500" />}
              {categoryName === 'management' && <Zap className="text-purple-500" />}
              {categoryName} Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {categoryAchievements.map((achievement) => {
                const IconComponent = achievement.icon;
                const progress = Math.min((achievement.current / achievement.requirement) * 100, 100);
                
                return (
                  <div 
                    key={achievement.id}
                    className={`p-4 rounded-lg border transition-all duration-300 ${
                      achievement.unlocked 
                        ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                        : 'bg-muted/50 border-muted'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`p-3 rounded-full ${getRarityColor(achievement.rarity)} ${
                        achievement.unlocked ? 'text-white' : 'text-muted-foreground bg-muted'
                      }`}>
                        <IconComponent size={24} />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold ${
                            achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {achievement.title}
                          </h3>
                          <Badge 
                            variant="outline" 
                            className={`${getRarityTextColor(achievement.rarity)} border-current`}
                          >
                            {achievement.rarity}
                          </Badge>
                          {achievement.unlocked && (
                            <Badge className="bg-green-500 text-white">
                              ✓ Unlocked
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                        
                        {/* Progress */}
                        {!achievement.unlocked && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{achievement.current} / {achievement.requirement}</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                        )}
                        
                        {/* Reward */}
                        {achievement.reward && (
                          <div className={`text-xs ${
                            achievement.unlocked ? 'text-green-600' : 'text-muted-foreground'
                          }`}>
                            🎁 Reward: {achievement.reward}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}