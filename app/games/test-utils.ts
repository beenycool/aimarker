import { Player, Team, Match } from './types';
import { render } from '@testing-library/react';
import React, { ReactElement } from 'react';

/**
 * Test utilities for Games Page tests - LS3_05 Enhanced Coverage
 * Provides mock data creators, common test helpers, and coverage utilities
 * Target: >80% test coverage through comprehensive test cases
 */

export const createMockPlayer = (overrides: Partial<Player> = {}): Player => ({
  id: 'player-1',
  name: 'Test Player',
  position: 'ST',
  pace: 70,
  shooting: 75,
  passing: 70,
  dribbling: 70,
  defending: 50,
  physical: 70,
  overall: 70,
  overallRating: 70,
  goals: 0,
  assists: 0,
  appearances: 0,
  nationality: 'Test Country',
  age: 25,
  height: 180,
  weight: 75,
  ...overrides
});

export const createMockTeam = (overrides: Partial<Team> = {}): Team => ({
  id: 'team-1',
  name: 'Test Team',
  formation: '4-4-2',
  players: [],
  matches: [],
  description: 'Test team description',
  league: 'Test League',
  season: '2024',
  isPublic: false,
  teamRating: 75,
  createdBy: 'test-user',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  statistics: {
    matchesPlayed: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0
  },
  ...overrides
});

export const createMockMatch = (overrides: Partial<Match> = {}): Match => ({
  id: 'match-1',
  date: '2024-01-01',
  opponent: 'Test Opponent',
  homeTeam: 'Test Team',
  awayTeam: 'Test Opponent',
  homeScore: 2,
  awayScore: 1,
  playerStats: [],
  ...overrides
});

export const createMockTeamWithPlayers = (playerCount: number): Team => {
  const players = Array.from({ length: playerCount }, (_, i) => 
    createMockPlayer({
      id: `player-${i}`,
      name: `Player ${i}`,
      overall: 70 + i,
      overallRating: 70 + i,
      goals: i * 2,
      assists: i,
      appearances: i * 3,
      pace: 70 + (i % 10),
      shooting: 75 + (i % 8),
      passing: 70 + (i % 12),
      dribbling: 70 + (i % 9),
      defending: 50 + (i % 15),
      physical: 70 + (i % 7)
    })
  );

  const matches = Array.from({ length: Math.min(playerCount, 5) }, (_, i) =>
    createMockMatch({
      id: `match-${i}`,
      date: `2024-01-0${i + 1}`,
      opponent: `Opponent ${i}`,
      homeScore: 2 + (i % 3),
      awayScore: i % 2,
      playerStats: players.slice(0, Math.min(11, playerCount)).map(player => ({
        playerId: player.id!,
        goals: Math.floor(Math.random() * 3),
        assists: Math.floor(Math.random() * 2),
        rating: 6.0 + Math.random() * 3
      }))
    })
  );

  return createMockTeam({
    players,
    matches,
    statistics: {
      matchesPlayed: matches.length,
      wins: matches.filter(m => m.homeScore > m.awayScore).length,
      draws: matches.filter(m => m.homeScore === m.awayScore).length,
      losses: matches.filter(m => m.homeScore < m.awayScore).length,
      goalsFor: matches.reduce((sum, m) => sum + m.homeScore, 0),
      goalsAgainst: matches.reduce((sum, m) => sum + m.awayScore, 0)
    }
  });
};

export const createLargeTeamDataset = (playerCount: number = 100): Team => {
  const team = createMockTeamWithPlayers(playerCount);
  
  // Add extensive match history
  const extensiveMatches = Array.from({ length: 50 }, (_, i) =>
    createMockMatch({
      id: `match-${i}`,
      date: `2024-${String(Math.floor(i / 4) + 1).padStart(2, '0')}-${String((i % 4) * 7 + 1).padStart(2, '0')}`,
      opponent: `Opponent ${i % 20}`, // 20 different opponents
      homeScore: Math.floor(Math.random() * 5),
      awayScore: Math.floor(Math.random() * 4),
      playerStats: team.players.slice(0, 11).map(player => ({
        playerId: player.id!,
        goals: Math.floor(Math.random() * 4),
        assists: Math.floor(Math.random() * 3),
        rating: 5.0 + Math.random() * 5
      }))
    })
  );

  return {
    ...team,
    matches: extensiveMatches
  };
};

export const createPerformanceTestData = () => ({
  smallTeam: createMockTeamWithPlayers(5),
  mediumTeam: createMockTeamWithPlayers(25),
  largeTeam: createMockTeamWithPlayers(50),
  extraLargeTeam: createLargeTeamDataset(100)
});

export const mockLocalStorage = () => {
  const store: { [key: string]: string } = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
    get length() {
      return Object.keys(store).length;
    }
  };
};

export const mockFootballAPI = () => ({
  getUserTeams: jest.fn(),
  addPlayer: jest.fn(),
  updatePlayer: jest.fn(),
  removePlayer: jest.fn(),
  createTeam: jest.fn(),
  updateTeam: jest.fn(),
  deleteTeam: jest.fn(),
  syncToLocalStorage: jest.fn(),
  migrateFromLocalStorage: jest.fn()
});

export const mockAuthAPI = () => ({
  isAuthenticated: jest.fn(() => false),
  getCurrentUser: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  signup: jest.fn(),
  refreshToken: jest.fn()
});

export const createDelayedPromise = <T>(data: T, delay: number = 100): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

export const createNetworkErrorPromise = (delay: number = 50): Promise<never> => {
  return new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Network error')), delay)
  );
};

export const measureRenderTime = async (renderFn: () => void): Promise<number> => {
  const start = performance.now();
  renderFn();
  const end = performance.now();
  return end - start;
};

export const waitForCondition = async (
  condition: () => boolean,
  timeout: number = 5000,
  interval: number = 100
): Promise<void> => {
  const start = Date.now();
  
  while (!condition() && Date.now() - start < timeout) {
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  if (!condition()) {
    throw new Error(`Condition not met within ${timeout}ms`);
  }
};

export const simulateMemoryPressure = () => {
  // Create large objects to simulate memory pressure
  const largeArray = new Array(1000000).fill(0).map((_, i) => ({
    id: i,
    data: new Array(100).fill(Math.random())
  }));
  
  return () => {
    // Cleanup function
    largeArray.length = 0;
  };
};

export const createCacheTestScenarios = () => ({
  validCache: JSON.stringify(createMockTeamWithPlayers(3)),
  invalidJsonCache: '{"invalid": json data',
  emptyCache: null,
  corruptedCache: 'not-json-at-all',
  oversizedCache: JSON.stringify({
    ...createLargeTeamDataset(200),
    extraData: new Array(10000).fill('x').join('')
  })
});

export const profilerDataCollector = () => {
  const data: Array<{
    id: string;
    phase: 'mount' | 'update' | 'nested-update';
    actualDuration: number;
    baseDuration: number;
    startTime: number;
    commitTime: number;
  }> = [];

  const onRender = (
    id: string,
    phase: 'mount' | 'update' | 'nested-update',
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number
  ) => {
    data.push({
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime
    });
  };

  return {
    onRender,
    getData: () => [...data],
    clear: () => data.length = 0,
    getSlowRenders: (threshold: number = 16) => 
      data.filter(d => d.actualDuration > threshold),
    getTotalRenderTime: () => 
      data.reduce((sum, d) => sum + d.actualDuration, 0),
    getAverageRenderTime: () => {
      const total = data.reduce((sum, d) => sum + d.actualDuration, 0);
      return data.length > 0 ? total / data.length : 0;
    }
  };
};

export const createBenchmarkSuite = () => {
  const benchmarks: Array<{
    name: string;
    fn: () => Promise<void> | void;
    iterations: number;
  }> = [];

  const add = (name: string, fn: () => Promise<void> | void, iterations = 1) => {
    benchmarks.push({ name, fn, iterations });
  };

  const run = async () => {
    const results: Array<{
      name: string;
      avgTime: number;
      minTime: number;
      maxTime: number;
      iterations: number;
    }> = [];

    for (const benchmark of benchmarks) {
      const times: number[] = [];
      
      for (let i = 0; i < benchmark.iterations; i++) {
        const start = performance.now();
        await benchmark.fn();
        const end = performance.now();
        times.push(end - start);
      }

      results.push({
        name: benchmark.name,
        avgTime: times.reduce((sum, t) => sum + t, 0) / times.length,
        minTime: Math.min(...times),
        maxTime: Math.max(...times),
        iterations: benchmark.iterations
      });
    }

    return results;
  };

  return { add, run };
};

/**
 * Enhanced utilities for LS3_05 coverage requirements
 */

export const renderWithProviders = (ui: ReactElement) => {
  // Custom render logic for comprehensive testing
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return React.createElement('div', { 'data-testid': 'test-provider-wrapper' }, children);
  };

  return render(ui, { wrapper: AllTheProviders });
};

export const createCoverageScenarios = () => ({
  // Performance scenarios
  performance: {
    lightweight: createMockTeamWithPlayers(5),
    medium: createMockTeamWithPlayers(25),
    heavy: createMockTeamWithPlayers(100),
    extreme: createLargeTeamDataset(500)
  },
  
  // Data fetch scenarios
  dataFetch: {
    success: {
      success: true,
      data: [createMockTeamWithPlayers(10)]
    },
    failure: {
      success: false,
      error: 'Network error'
    },
    timeout: new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), 5000)
    ),
    malformed: {
      success: true,
      data: 'invalid-format'
    }
  },
  
  // Caching scenarios
  caching: {
    valid: JSON.stringify(createMockTeamWithPlayers(10)),
    invalid: '{"malformed": json',
    empty: null,
    corrupted: 'not-json',
    oversized: JSON.stringify(createLargeTeamDataset(1000))
  },
  
  // Edge cases
  edgeCases: {
    emptyTeam: createMockTeam(),
    maxPlayers: createMockTeamWithPlayers(1000),
    specialChars: createMockTeam({
      name: 'José María\'s Team 李小明 Müller',
      players: [
        createMockPlayer({ name: 'José María Fernández' }),
        createMockPlayer({ name: 'Müller' }),
        createMockPlayer({ name: 'O\'Connor' }),
        createMockPlayer({ name: '李小明' }),
        createMockPlayer({ name: 'Ñoño' })
      ]
    }),
    malformedData: {
      name: 'Test Team',
      players: [
        { id: 'p1', name: '', position: 'INVALID' }, // Invalid
        { id: 'p2' }, // Missing fields
        null, // Null player
        createMockPlayer({ name: 'Valid Player' })
      ],
      matches: []
    }
  }
});

export const createTestMatrices = () => ({
  // User interaction matrix
  userInteractions: [
    { action: 'addPlayer', data: { name: 'Test Player', position: 'ST' } },
    { action: 'editPlayer', data: { id: 'p1', name: 'Updated Player' } },
    { action: 'deletePlayer', data: { id: 'p1' } },
    { action: 'switchTab', data: { tab: 'simulation' } },
    { action: 'startSimulation', data: {} },
    { action: 'rapidClicks', data: { count: 10 } }
  ],
  
  // Network condition matrix
  networkConditions: [
    { type: 'fast', delay: 50, success: true },
    { type: 'slow', delay: 2000, success: true },
    { type: 'timeout', delay: 10000, success: false },
    { type: 'intermittent', delay: 500, success: Math.random() > 0.5 },
    { type: 'rateLimited', delay: 100, success: false, status: 429 }
  ],
  
  // Browser environment matrix
  browserEnvironments: [
    { localStorage: true, performance: true, modern: true },
    { localStorage: false, performance: true, modern: true },
    { localStorage: true, performance: false, modern: true },
    { localStorage: false, performance: false, modern: false }
  ],
  
  // Data size matrix
  dataSizes: [
    { players: 0, matches: 0, label: 'empty' },
    { players: 5, matches: 2, label: 'small' },
    { players: 25, matches: 10, label: 'medium' },
    { players: 100, matches: 50, label: 'large' },
    { players: 500, matches: 200, label: 'extreme' }
  ]
});

export const generateCoverageTests = (scenarios: any[]) => {
  return scenarios.map((scenario, index) => ({
    id: `coverage-test-${index}`,
    name: `Coverage test ${index + 1}: ${scenario.label || 'Unnamed'}`,
    scenario,
    execute: scenario.execute || (() => Promise.resolve())
  }));
};

export const mockBrowserAPIs = (options: {
  localStorage?: boolean;
  performance?: boolean;
  fetch?: boolean;
} = {}) => {
  const mocks: any = {};
  
  if (options.localStorage !== false) {
    mocks.localStorage = mockLocalStorage();
    Object.defineProperty(global, 'localStorage', {
      value: mocks.localStorage,
      writable: true
    });
  }
  
  if (options.performance !== false) {
    mocks.performance = {
      now: jest.fn(() => Date.now()),
      mark: jest.fn(),
      measure: jest.fn(),
      getEntriesByType: jest.fn(() => [])
    };
    Object.defineProperty(global, 'performance', {
      value: mocks.performance,
      writable: true
    });
  }
  
  if (options.fetch !== false) {
    mocks.fetch = jest.fn();
    global.fetch = mocks.fetch;
  }
  
  return mocks;
};

export const simulateNetworkConditions = (condition: {
  delay: number;
  success: boolean;
  status?: number;
}) => {
  return jest.fn().mockImplementation(() => {
    if (!condition.success) {
      return Promise.reject(new Error(`Network error ${condition.status || 500}`));
    }
    
    return new Promise(resolve =>
      setTimeout(() => resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true, data: [] })
      }), condition.delay)
    );
  });
};

export const coverageReporter = () => {
  const coverage = {
    statements: 0,
    branches: 0,
    functions: 0,
    lines: 0
  };
  
  return {
    addCoverage: (type: keyof typeof coverage, count: number) => {
      coverage[type] += count;
    },
    getCoverage: () => ({ ...coverage }),
    getPercentage: (total: number) => ({
      statements: (coverage.statements / total) * 100,
      branches: (coverage.branches / total) * 100,
      functions: (coverage.functions / total) * 100,
      lines: (coverage.lines / total) * 100
    }),
    meetsThreshold: (threshold = 80) => {
      const total = 100; // Assume 100 total items for simplicity
      const percentages = {
        statements: (coverage.statements / total) * 100,
        branches: (coverage.branches / total) * 100,
        functions: (coverage.functions / total) * 100,
        lines: (coverage.lines / total) * 100
      };
      
      return Object.values(percentages).every(p => p >= threshold);
    }
  };
};

export const testOrganizer = () => {
  const suites = {
    performance: [],
    dataFetch: [],
    caching: [],
    edge: [],
    tdd: []
  } as Record<string, any[]>;
  
  return {
    addTest: (suite: keyof typeof suites, test: any) => {
      suites[suite].push(test);
    },
    getSuite: (suite: keyof typeof suites) => suites[suite],
    getAllSuites: () => ({ ...suites }),
    getTestCount: () => Object.values(suites).reduce((sum, tests) => sum + tests.length, 0),
    organizeBySuite: () => {
      return Object.entries(suites).map(([name, tests]) => ({
        suite: name,
        testCount: tests.length,
        tests
      }));
    }
  };
};