import { Player, Team } from './types';

export interface SimulationSettings {
  gameSpeed: number; // 1-10 (1 = slow, 10 = very fast)
  gameDuration: number; // minutes (e.g., 90 for full match)
  difficulty: 'easy' | 'medium' | 'hard';
  opponentStrength: number; // 1-100
  weatherCondition: 'sunny' | 'rainy' | 'windy' | 'snow';
  pitchCondition: 'excellent' | 'good' | 'poor';
}

export interface GameEvent {
  minute: number;
  type: 'goal' | 'assist' | 'card' | 'substitution' | 'injury' | 'save' | 'miss';
  player?: Player;
  description: string;
  homeTeam: boolean;
}

export interface SimulationResult {
  homeScore: number;
  awayScore: number;
  events: GameEvent[];
  playerStats: {
    playerId: string;
    goals: number;
    assists: number;
    rating: number;
    minutesPlayed: number;
  }[];
  matchRating: number;
}

export class FootballSimulation {
  private team: Team;
  private settings: SimulationSettings;
  private events: GameEvent[] = [];
  private homeScore = 0;
  private awayScore = 0;
  private currentMinute = 0;
  
  constructor(team: Team, settings: SimulationSettings) {
    this.team = team;
    this.settings = settings;
  }

  private getTeamStrength(): number {
    if (this.team.players.length === 0) return 50;
    const averageRating = this.team.players.reduce((sum: number, p: Player) => sum + p.overallRating, 0) / this.team.players.length;
    return Math.min(100, Math.max(30, averageRating));
  }

  private getWeatherEffect(): number {
    switch (this.settings.weatherCondition) {
      case 'sunny': return 1.0;
      case 'rainy': return 0.9;
      case 'windy': return 0.85;
      case 'snow': return 0.8;
      default: return 1.0;
    }
  }

  private getPitchEffect(): number {
    switch (this.settings.pitchCondition) {
      case 'excellent': return 1.0;
      case 'good': return 0.95;
      case 'poor': return 0.85;
      default: return 1.0;
    }
  }

  private getDifficultyModifier(): number {
    switch (this.settings.difficulty) {
      case 'easy': return 1.2;
      case 'medium': return 1.0;
      case 'hard': return 0.8;
      default: return 1.0;
    }
  }

  private calculateEventProbability(minute: number): number {
    // Higher probability in certain minutes (injury time, etc.)
    let baseProbability = 0.15;
    
    // Increase probability in final minutes
    if (minute > 80) baseProbability *= 1.5;
    if (minute > 45 && minute < 50) baseProbability *= 1.3; // Half-time energy
    
    return baseProbability;
  }

  private selectRandomPlayer(position?: string): Player {
    let eligiblePlayers = this.team.players;
    
    if (position) {
      eligiblePlayers = this.team.players.filter((p: Player) => {
        if (position === 'attacker') return ['ST', 'LW', 'RW', 'CAM'].includes(p.position);
        if (position === 'midfielder') return ['CM', 'CDM', 'CAM'].includes(p.position);
        if (position === 'defender') return ['CB', 'LB', 'RB'].includes(p.position);
        if (position === 'goalkeeper') return p.position === 'GK';
        return p.position === position;
      });
    }
    
    if (eligiblePlayers.length === 0) eligiblePlayers = this.team.players;
    
    // Weight selection by player rating
    const weights = eligiblePlayers.map((p: Player) => p.overallRating);
    const totalWeight = weights.reduce((sum: number, w: number) => sum + w, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < eligiblePlayers.length; i++) {
      random -= weights[i];
      if (random <= 0) return eligiblePlayers[i];
    }
    
    return eligiblePlayers[0];
  }

  private generateEvent(minute: number): GameEvent | null {
    const teamStrength = this.getTeamStrength();
    const opponentStrength = this.settings.opponentStrength;
    const weatherEffect = this.getWeatherEffect();
    const pitchEffect = this.getPitchEffect();
    const difficultyModifier = this.getDifficultyModifier();
    
    const ourAdvantage = (teamStrength / (teamStrength + opponentStrength)) * weatherEffect * pitchEffect * difficultyModifier;
    
    const eventTypes = ['goal', 'miss', 'save', 'card', 'injury'];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    const isOurEvent = Math.random() < ourAdvantage;
    
    switch (eventType) {
      case 'goal':
        if (Math.random() < 0.3) { // 30% chance of goal events
          const scorer = this.selectRandomPlayer('attacker');
          const assister = Math.random() < 0.7 ? this.selectRandomPlayer('midfielder') : null;
          
          if (isOurEvent) {
            this.homeScore++;
            this.events.push({
              minute,
              type: 'goal',
              player: scorer,
              description: `⚽ GOAL! ${scorer.name} scores${assister ? ` (assisted by ${assister.name})` : ''}!`,
              homeTeam: true
            });
            
            if (assister) {
              this.events.push({
                minute,
                type: 'assist',
                player: assister,
                description: `🎯 ${assister.name} with the assist!`,
                homeTeam: true
              });
            }
          } else {
            this.awayScore++;
            this.events.push({
              minute,
              type: 'goal',
              description: `⚽ Opposition scores!`,
              homeTeam: false
            });
          }
          return this.events[this.events.length - 1];
        }
        break;
        
      case 'miss':
        if (Math.random() < 0.2) {
          const player = this.selectRandomPlayer('attacker');
          this.events.push({
            minute,
            type: 'miss',
            player,
            description: `😤 ${player.name} misses a great chance!`,
            homeTeam: isOurEvent
          });
          return this.events[this.events.length - 1];
        }
        break;
        
      case 'save':
        if (Math.random() < 0.15) {
          const goalkeeper = this.selectRandomPlayer('goalkeeper');
          if (goalkeeper) {
            this.events.push({
              minute,
              type: 'save',
              player: goalkeeper,
              description: `🧤 Brilliant save by ${goalkeeper.name}!`,
              homeTeam: true
            });
            return this.events[this.events.length - 1];
          }
        }
        break;
        
      case 'card':
        if (Math.random() < 0.1) {
          const player = this.selectRandomPlayer();
          this.events.push({
            minute,
            type: 'card',
            player,
            description: `🟨 ${player.name} receives a yellow card`,
            homeTeam: true
          });
          return this.events[this.events.length - 1];
        }
        break;
        
      case 'injury':
        if (Math.random() < 0.05) {
          const player = this.selectRandomPlayer();
          this.events.push({
            minute,
            type: 'injury',
            player,
            description: `🚑 ${player.name} is down injured`,
            homeTeam: true
          });
          return this.events[this.events.length - 1];
        }
        break;
    }
    
    return null;
  }

  private calculatePlayerStats(): { playerId: string; goals: number; assists: number; rating: number; minutesPlayed: number; }[] {
    const playerStats: { [key: string]: { goals: number; assists: number; rating: number; minutesPlayed: number; } } = {};
    
    // Initialize all players
    this.team.players.forEach((player: Player) => {
      playerStats[player.id] = {
        goals: 0,
        assists: 0,
        rating: 6.0, // Base rating
        minutesPlayed: this.settings.gameDuration
      };
    });
    
    // Count goals and assists from events
    this.events.forEach(event => {
      if (event.player && event.homeTeam) {
        if (event.type === 'goal') {
          playerStats[event.player.id].goals++;
          playerStats[event.player.id].rating += 1.0;
        } else if (event.type === 'assist') {
          playerStats[event.player.id].assists++;
          playerStats[event.player.id].rating += 0.5;
        } else if (event.type === 'save') {
          playerStats[event.player.id].rating += 0.3;
        } else if (event.type === 'card') {
          playerStats[event.player.id].rating -= 0.5;
        } else if (event.type === 'miss') {
          playerStats[event.player.id].rating -= 0.3;
        }
      }
    });
    
    // Add some randomness based on player attributes
    this.team.players.forEach((player: Player) => {
      const performanceModifier = (Math.random() - 0.5) * 2; // -1 to +1
      const attributeBonus = (player.overallRating - 70) / 30; // -2.33 to +0.97
      playerStats[player.id].rating += performanceModifier + attributeBonus;
      playerStats[player.id].rating = Math.max(1, Math.min(10, playerStats[player.id].rating));
    });
    
    return Object.entries(playerStats).map(([playerId, stats]) => ({
      playerId,
      ...stats
    }));
  }

  async simulate(onProgress?: (minute: number, event?: GameEvent) => void): Promise<SimulationResult> {
    this.events = [];
    this.homeScore = 0;
    this.awayScore = 0;
    this.currentMinute = 0;
    
    const intervalTime = Math.max(50, 1000 / this.settings.gameSpeed); // Faster = shorter intervals
    
    return new Promise((resolve) => {
      const simulateMinute = () => {
        if (this.currentMinute >= this.settings.gameDuration) {
          // Match finished
          const playerStats = this.calculatePlayerStats();
          const matchRating = Math.min(10, Math.max(1, 
            5 + (this.homeScore - this.awayScore) * 0.5 + (this.events.length * 0.1)
          ));
          
          resolve({
            homeScore: this.homeScore,
            awayScore: this.awayScore,
            events: this.events,
            playerStats,
            matchRating
          });
          return;
        }
        
        this.currentMinute++;
        
        // Check for events this minute
        const eventProbability = this.calculateEventProbability(this.currentMinute);
        let event: GameEvent | null = null;
        
        if (Math.random() < eventProbability) {
          event = this.generateEvent(this.currentMinute);
        }
        
        // Call progress callback
        if (onProgress) {
          onProgress(this.currentMinute, event || undefined);
        }
        
        // Continue simulation
        setTimeout(simulateMinute, intervalTime);
      };
      
      simulateMinute();
    });
  }
}