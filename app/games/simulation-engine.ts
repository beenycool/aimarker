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
  type: 'goal' | 'assist' | 'card' | 'substitution' | 'injury' | 'save' | 'miss' | 'corner' | 'freekick' | 'offside' | 'foul';
  player?: Player;
  assistPlayer?: Player;
  description: string;
  homeTeam: boolean;
  importance: 'low' | 'medium' | 'high';
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
    const totalRating = this.team.players.reduce((sum: number, p: Player) => {
      return sum + (p.overallRating || p.overall || 70);
    }, 0);
    const averageRating = totalRating / this.team.players.length;
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
    // More realistic event distribution
    let baseProbability = 0.25;
    
    // First 15 minutes - teams feeling each other out
    if (minute <= 15) baseProbability *= 0.7;
    
    // 15-30 minutes - game opening up
    else if (minute <= 30) baseProbability *= 1.0;
    
    // 30-45 minutes - first half intensity
    else if (minute <= 45) baseProbability *= 1.2;
    
    // 45-60 minutes - fresh legs after half-time
    else if (minute <= 60) baseProbability *= 1.1;
    
    // 60-75 minutes - substitutions and tactical changes
    else if (minute <= 75) baseProbability *= 1.3;
    
    // 75-90 minutes - desperate final push
    else baseProbability *= 1.8;
    
    // Added time drama
    if (minute > 90) baseProbability *= 2.0;
    
    return Math.min(0.4, baseProbability);
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
    const weights = eligiblePlayers.map((p: Player) => p.overallRating || p.overall || 70);
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
    
    // Enhanced event types with probabilities
    const eventTypes = [
      { type: 'goal', probability: 0.15 },
      { type: 'miss', probability: 0.25 },
      { type: 'save', probability: 0.20 },
      { type: 'corner', probability: 0.15 },
      { type: 'freekick', probability: 0.10 },
      { type: 'card', probability: 0.08 },
      { type: 'foul', probability: 0.05 },
      { type: 'injury', probability: 0.02 }
    ];
    
    const totalProb = eventTypes.reduce((sum, e) => sum + e.probability, 0);
    let randomValue = Math.random() * totalProb;
    
    let selectedEventType = 'goal';
    for (const eventType of eventTypes) {
      randomValue -= eventType.probability;
      if (randomValue <= 0) {
        selectedEventType = eventType.type;
        break;
      }
    }
    
    const isOurEvent = Math.random() < ourAdvantage;
    
    switch (selectedEventType) {
      case 'goal':
        const scorer = this.selectRandomPlayer('attacker');
        const assister = Math.random() < 0.7 ? this.selectRandomPlayer('midfielder') : null;
        
        if (isOurEvent) {
          this.homeScore++;
          this.events.push({
            minute,
            type: 'goal',
            player: scorer,
            assistPlayer: assister || undefined,
            description: `⚽ GOAL! ${scorer.name} scores${assister ? ` (assisted by ${assister.name})` : ''}!`,
            homeTeam: true,
            importance: 'high'
          });
          
          if (assister) {
            this.events.push({
              minute,
              type: 'assist',
              player: assister,
              description: `🎯 ${assister.name} with the assist!`,
              homeTeam: true,
              importance: 'medium'
            });
          }
        } else {
          this.awayScore++;
          this.events.push({
            minute,
            type: 'goal',
            description: `⚽ Opposition scores!`,
            homeTeam: false,
            importance: 'high'
          });
        }
        return this.events[this.events.length - 1];
        
      case 'miss':
        const missPlayer = this.selectRandomPlayer('attacker');
        this.events.push({
          minute,
          type: 'miss',
          player: missPlayer,
          description: `😤 ${missPlayer.name} misses a great chance!`,
          homeTeam: isOurEvent,
          importance: 'medium'
        });
        return this.events[this.events.length - 1];
        
      case 'save':
        if (isOurEvent) {
          const goalkeeper = this.selectRandomPlayer('goalkeeper');
          if (goalkeeper) {
            this.events.push({
              minute,
              type: 'save',
              player: goalkeeper,
              description: `🧤 Brilliant save by ${goalkeeper.name}!`,
              homeTeam: true,
              importance: 'medium'
            });
            return this.events[this.events.length - 1];
          }
        } else {
          this.events.push({
            minute,
            type: 'save',
            description: `🧤 Great save by the opposition goalkeeper!`,
            homeTeam: false,
            importance: 'medium'
          });
          return this.events[this.events.length - 1];
        }
        break;
        
      case 'corner':
        const cornerPlayer = this.selectRandomPlayer('midfielder');
        this.events.push({
          minute,
          type: 'corner',
          player: cornerPlayer,
          description: `⚪ Corner kick for ${isOurEvent ? 'us' : 'the opposition'}`,
          homeTeam: isOurEvent,
          importance: 'low'
        });
        return this.events[this.events.length - 1];
        
      case 'freekick':
        const freekickPlayer = this.selectRandomPlayer();
        this.events.push({
          minute,
          type: 'freekick',
          player: freekickPlayer,
          description: `🆓 Free kick ${isOurEvent ? 'awarded to us' : 'given away'} - ${freekickPlayer.name} involved`,
          homeTeam: isOurEvent,
          importance: 'low'
        });
        return this.events[this.events.length - 1];
        
      case 'card':
        const cardPlayer = this.selectRandomPlayer();
        const cardType = Math.random() < 0.9 ? 'yellow' : 'red';
        this.events.push({
          minute,
          type: 'card',
          player: cardPlayer,
          description: `${cardType === 'yellow' ? '🟨' : '🟥'} ${cardPlayer.name} receives a ${cardType} card`,
          homeTeam: true,
          importance: cardType === 'red' ? 'high' : 'low'
        });
        return this.events[this.events.length - 1];
        
      case 'foul':
        const foulPlayer = this.selectRandomPlayer();
        this.events.push({
          minute,
          type: 'foul',
          player: foulPlayer,
          description: `🚫 Foul by ${foulPlayer.name}`,
          homeTeam: true,
          importance: 'low'
        });
        return this.events[this.events.length - 1];
        
      case 'injury':
        const injuredPlayer = this.selectRandomPlayer();
        this.events.push({
          minute,
          type: 'injury',
          player: injuredPlayer,
          description: `🚑 ${injuredPlayer.name} is down injured`,
          homeTeam: true,
          importance: 'medium'
        });
        return this.events[this.events.length - 1];
    }
    
    return null;
  }

  private calculatePlayerStats(): { playerId: string; goals: number; assists: number; rating: number; minutesPlayed: number; }[] {
    const playerStats: { [key: string]: { goals: number; assists: number; rating: number; minutesPlayed: number; } } = {};
    
    // Initialize all players
    this.team.players.forEach((player: Player) => {
      if (player.id) {
        playerStats[player.id] = {
          goals: 0,
          assists: 0,
          rating: 6.0, // Base rating
          minutesPlayed: this.settings.gameDuration
        };
      }
    });
    
    // Count goals and assists from events
    this.events.forEach(event => {
      if (event.player && event.player.id && event.homeTeam && playerStats[event.player.id]) {
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
        } else if (event.type === 'corner' || event.type === 'freekick') {
          playerStats[event.player.id].rating += 0.1;
        } else if (event.type === 'foul') {
          playerStats[event.player.id].rating -= 0.2;
        }
      }
    });
    
    // Add some randomness based on player attributes
    this.team.players.forEach((player: Player) => {
      if (player.id && playerStats[player.id]) {
        const performanceModifier = (Math.random() - 0.5) * 2; // -1 to +1
        const playerRating = player.overallRating || player.overall || 70;
        const attributeBonus = (playerRating - 70) / 30; // -2.33 to +0.97
        playerStats[player.id].rating += performanceModifier + attributeBonus;
        playerStats[player.id].rating = Math.max(1, Math.min(10, playerStats[player.id].rating));
      }
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

  // New method for team vs team simulation
  static async simulateTeamVsTeam(
    homeTeam: Team, 
    awayTeam: Team, 
    settings: SimulationSettings,
    onProgress?: (minute: number, event?: GameEvent) => void
  ): Promise<SimulationResult & { awayTeamStats: { playerId: string; goals: number; assists: number; rating: number; minutesPlayed: number; }[] }> {
    
    // Create simulation instances for both teams
    const homeSimulation = new FootballSimulation(homeTeam, settings);
    const awaySimulation = new FootballSimulation(awayTeam, settings);
    
    const events: GameEvent[] = [];
    let homeScore = 0;
    let awayScore = 0;
    let currentMinute = 0;
    
    const intervalTime = Math.max(50, 1000 / settings.gameSpeed);
    
    return new Promise((resolve) => {
      const simulateMinute = () => {
        if (currentMinute >= settings.gameDuration) {
          // Match finished - calculate stats for both teams
          const homePlayerStats = homeSimulation['calculatePlayerStats']();
          const awayPlayerStats = awaySimulation['calculatePlayerStats']();
          
          const matchRating = Math.min(10, Math.max(1, 
            5 + Math.abs(homeScore - awayScore) * 0.3 + (events.length * 0.1)
          ));
          
          resolve({
            homeScore,
            awayScore,
            events,
            playerStats: homePlayerStats,
            awayTeamStats: awayPlayerStats,
            matchRating
          });
          return;
        }
        
        currentMinute++;
        
        // Calculate event probability for this minute
        const eventProbability = homeSimulation['calculateEventProbability'](currentMinute);
        let event: GameEvent | null = null;
        
        if (Math.random() < eventProbability) {
          // Determine which team gets the event
          const homeTeamStrength = homeSimulation['getTeamStrength']();
          const awayTeamStrength = awaySimulation['getTeamStrength']();
          const totalStrength = homeTeamStrength + awayTeamStrength;
          
          const isHomeTeamEvent = Math.random() < (homeTeamStrength / totalStrength);
          
          if (isHomeTeamEvent) {
            event = homeSimulation['generateEvent'](currentMinute);
            if (event && event.type === 'goal') {
              homeScore++;
            }
          } else {
            // Generate away team event
            const awayEvent = awaySimulation['generateEvent'](currentMinute);
            if (awayEvent) {
              event = {
                ...awayEvent,
                homeTeam: false,
                description: awayEvent.description.replace('us', awayTeam.name).replace('our', awayTeam.name + "'s")
              };
              if (event.type === 'goal') {
                awayScore++;
              }
            }
          }
          
          if (event) {
            events.push(event);
          }
        }
        
        // Call progress callback
        if (onProgress) {
          onProgress(currentMinute, event || undefined);
        }
        
        // Continue simulation
        setTimeout(simulateMinute, intervalTime);
      };
      
      simulateMinute();
    });
  }
}