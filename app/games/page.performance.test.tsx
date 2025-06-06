/* coverage: 85% */

import React, { Profiler, ProfilerOnRenderCallback } from 'react';
import { render, screen, waitFor, waitForElementToBeRemoved, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GamesPage from './page';
import { FootballSimulation } from './simulation-engine';

// Mock localStorage
const localStorageMock = localStorage as jest.Mocked<typeof localStorage>;

// Mock FootballSimulation
jest.mock('./simulation-engine');
const MockedFootballSimulation = FootballSimulation as jest.MockedClass<typeof FootballSimulation>;

describe('GamesPage Performance Tests - LS3 Specification', () => {
  let profilerData: Array<{
    id: string;
    phase: 'mount' | 'update' | 'nested-update';
    actualDuration: number;
    baseDuration: number;
    startTime: number;
    commitTime: number;
  }>;

  const onRenderCallback: ProfilerOnRenderCallback = (
    id, phase, actualDuration, baseDuration, startTime, commitTime
  ) => {
    profilerData.push({
      id, phase, actualDuration, baseDuration, startTime, commitTime
    });
  };

  const createMockTeamWithPlayers = (playerCount: number) => ({
    name: 'Test Team',
    players: Array.from({ length: playerCount }, (_, i) => ({
      id: `player-${i}`,
      name: `Player ${i}`,
      position: 'ST' as const,
      pace: 70, shooting: 75, passing: 70, dribbling: 70, defending: 50, physical: 70,
      overall: 70,
      overallRating: 70,
      goals: i, assists: i * 2, appearances: i * 3
    })),
    matches: []
  });

  beforeEach(() => {
    profilerData = [];
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation();
  });

  describe('LS3_01: Performance Profiling with Arrange-Act-Assert', () => {
    test('measures render durations under user interactions with 50ms threshold', async () => {
      // Arrange: render GamesPage wrapped in Profiler
      render(
        <Profiler id="GamesPage" onRender={onRenderCallback}>
          <GamesPage />
        </Profiler>
      );
      
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      
      // Act: simulate user click on "Start Simulation"
      const simulationTab = screen.getByRole('tab', { name: /simulation/i });
      fireEvent.click(simulationTab);
      
      const startButton = screen.getByRole('button', { name: /start simulation/i });
      fireEvent.click(startButton);
      
      // Assert: verify actualDuration < 50ms on initial render
      expect(profilerData.length).toBeGreaterThan(0);
      expect(profilerData[0].actualDuration).toBeLessThan(50);
      expect(profilerData[0].phase).toBe('mount');
    });

    test('measures initial render time under 200ms threshold', async () => {
      const startTime = performance.now();
      
      render(
        <Profiler id="GamesPage" onRender={onRenderCallback}>
          <GamesPage />
        </Profiler>
      );
      
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      expect(renderTime).toBeLessThan(200);
      expect(profilerData.length).toBeGreaterThan(0);
      expect(profilerData[0].actualDuration).toBeLessThan(100);
    });

    test('identifies excessive re-renders during player addition', async () => {
      const user = userEvent.setup();
      
      render(
        <Profiler id="GamesPage" onRender={onRenderCallback}>
          <GamesPage />
        </Profiler>
      );
      
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      const initialRenderCount = profilerData.length;
      
      const addButton = screen.getByRole('button', { name: /add player/i });
      await user.click(addButton);
      
      const nameInput = screen.getByLabelText(/player name/i);
      await user.type(nameInput, 'Test Player');
      
      const submitButton = screen.getByRole('button', { name: /add player$/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Test Player')).toBeInTheDocument();
      });
      
      const totalRenders = profilerData.length - initialRenderCount;
      expect(totalRenders).toBeLessThan(5);
      
      const slowRenders = profilerData.filter(data => data.actualDuration > 50);
      expect(slowRenders).toHaveLength(0);
    });

    test('measures tab switching performance', async () => {
      const user = userEvent.setup();
      
      render(
        <Profiler id="GamesPage" onRender={onRenderCallback}>
          <GamesPage />
        </Profiler>
      );
      
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      const initialRenderCount = profilerData.length;
      
      const simulationTab = screen.getByRole('tab', { name: /simulation/i });
      const startTime = performance.now();
      
      await user.click(simulationTab);
      
      const endTime = performance.now();
      const tabSwitchTime = endTime - startTime;
      
      expect(tabSwitchTime).toBeLessThan(50);
      
      const tabSwitchRenders = profilerData.length - initialRenderCount;
      expect(tabSwitchRenders).toBeLessThanOrEqual(2);
    });

    test('large player dataset renders efficiently', async () => {
      const largeMockTeam = createMockTeamWithPlayers(50);
      localStorageMock.getItem.mockReturnValue(JSON.stringify(largeMockTeam));
      
      const startTime = performance.now();
      
      render(
        <Profiler id="GamesPage" onRender={onRenderCallback}>
          <GamesPage />
        </Profiler>
      );
      
      await waitFor(() => {
        expect(screen.getByText('Player 0')).toBeInTheDocument();
      });
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      expect(renderTime).toBeLessThan(500);
      expect(profilerData[0].actualDuration).toBeLessThan(150);
    });
  });

  describe('Simulation Performance', () => {
    test('simulation events render efficiently with rapid updates', async () => {
      const mockTeam = createMockTeamWithPlayers(11);
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTeam));
      
      const mockSimulationInstance = {
        simulate: jest.fn().mockImplementation((onProgress) => {
          return new Promise((resolve) => {
            let minute = 0;
            const interval = setInterval(() => {
              minute++;
              onProgress?.(minute, {
                minute,
                type: 'goal',
                player: mockTeam.players[0],
                description: `Goal at ${minute}`,
                homeTeam: true
              });
              
              if (minute >= 10) {
                clearInterval(interval);
                resolve({
                  homeScore: 3,
                  awayScore: 1,
                  events: [],
                  playerStats: mockTeam.players.map(p => ({
                    playerId: p.id,
                    goals: 1,
                    assists: 0,
                    rating: 7.0,
                    minutesPlayed: 90
                  })),
                  matchRating: 7.5
                });
              }
            }, 50);
          });
        })
      };
      
      MockedFootballSimulation.mockImplementation(() => mockSimulationInstance as any);
      
      const user = userEvent.setup();
      
      render(
        <Profiler id="GamesPage" onRender={onRenderCallback}>
          <GamesPage />
        </Profiler>
      );
      
      const simulationTab = screen.getByRole('tab', { name: /simulation/i });
      await user.click(simulationTab);
      
      const startButton = screen.getByRole('button', { name: /start simulation/i });
      const startTime = performance.now();
      
      await user.click(startButton);
      
      await waitFor(() => {
        expect(mockSimulationInstance.simulate).toHaveBeenCalled();
      }, { timeout: 2000 });
      
      const endTime = performance.now();
      const simulationTime = endTime - startTime;
      
      expect(simulationTime).toBeLessThan(1000);
      
      const simulationRenders = profilerData.filter(data => data.phase === 'update');
      const slowUpdates = simulationRenders.filter(data => data.actualDuration > 30);
      expect(slowUpdates.length).toBeLessThan(simulationRenders.length * 0.1);
    });
  });
});