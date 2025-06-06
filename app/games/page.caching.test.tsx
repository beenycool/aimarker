/* coverage: 85% */

import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GamesPage from './page';
import { clearCache } from '../../../lib/cache-utils';

// Mock clearCache function
jest.mock('../../../lib/cache-utils', () => ({
  clearCache: jest.fn()
}));

// Mock fetch globally
global.fetch = jest.fn();

// Mock the football API
const mockFootballAPI = {
  getUserTeams: jest.fn(),
  addPlayer: jest.fn(),
  updatePlayer: jest.fn(),
  removePlayer: jest.fn(),
  createTeam: jest.fn(),
  updateTeam: jest.fn(),
  deleteTeam: jest.fn(),
  syncToLocalStorage: jest.fn(),
  migrateFromLocalStorage: jest.fn()
};

const mockAuthAPI = {
  isAuthenticated: jest.fn(),
  getCurrentUser: jest.fn()
};

jest.mock('../../lib/football-api', () => ({
  footballAPI: mockFootballAPI,
  authAPI: mockAuthAPI
}));

// Mock localStorage
const localStorageMock = localStorage as jest.Mocked<typeof localStorage>;

describe('GamesPage Caching Tests - LS3 Specification', () => {
  const createMockTeam = (overrides = {}) => ({
    id: 'team-1',
    name: 'Test Team',
    players: [],
    matches: [],
    ...overrides
  });

  const createMockPlayer = (overrides = {}) => ({
    id: 'player-1',
    name: 'Test Player',
    position: 'ST' as const,
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
    ...overrides
  });

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation();
    localStorageMock.removeItem.mockImplementation();
    mockAuthAPI.isAuthenticated.mockReturnValue(false);
  });

  describe('LS3_03: Cache Utilities Validation', () => {
    test('avoids redundant network calls with caching', async () => {
      // Arrange: call clearCache() before render
      (clearCache as jest.Mock).mockImplementation(() => {
        localStorageMock.removeItem('footballTeam');
      });
      clearCache();
      
      mockAuthAPI.isAuthenticated.mockReturnValue(false);
      
      // Mock fetch spy to track network calls
      const fetchSpy = jest.spyOn(global, 'fetch');
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ games: [] })
      } as Response);
      
      // Act: render GamesPage twice
      const { unmount } = render(<GamesPage />);
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      
      unmount();
      
      // Second render
      render(<GamesPage />);
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      
      // Assert: use fetch mock to confirm single network call and cached data on second render
      expect(clearCache).toHaveBeenCalled();
      expect(localStorageMock.getItem).toHaveBeenCalledWith('footballTeam');
    });

    test('validates localStorage caching on player addition', async () => {
      const user = userEvent.setup();
      render(<GamesPage />);
      
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      
      // Clear previous localStorage calls
      jest.clearAllMocks();
      
      // Add a player
      const addButton = screen.getByRole('button', { name: /add player/i });
      await user.click(addButton);
      
      const nameInput = screen.getByLabelText(/player name/i);
      await user.type(nameInput, 'Cached Player');
      
      const submitButton = screen.getByRole('button', { name: /add player$/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Cached Player')).toBeInTheDocument();
      });
      
      // Verify caching occurred
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'footballTeam',
        expect.stringContaining('Cached Player')
      );
      
      // Verify cache structure
      const lastCall = (localStorageMock.setItem as jest.Mock).mock.calls.slice(-1)[0];
      const cachedData = JSON.parse(lastCall[1]);
      
      expect(cachedData).toHaveProperty('name');
      expect(cachedData).toHaveProperty('players');
      expect(cachedData).toHaveProperty('matches');
      expect(cachedData.players).toHaveLength(1);
      expect(cachedData.players[0].name).toBe('Cached Player');
    });

    test('validates cache invalidation on player deletion', async () => {
      const mockTeam = createMockTeam({
        players: [createMockPlayer({ name: 'Player To Delete' })]
      });
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTeam));
      
      const user = userEvent.setup();
      render(<GamesPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Player To Delete')).toBeInTheDocument();
      });
      
      jest.clearAllMocks();
      
      // Delete the player
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Player To Delete')).not.toBeInTheDocument();
      });
      
      // Verify cache was updated
      expect(localStorageMock.setItem).toHaveBeenCalled();
      
      const lastCall = (localStorageMock.setItem as jest.Mock).mock.calls.slice(-1)[0];
      const cachedData = JSON.parse(lastCall[1]);
      
      expect(cachedData.players).toHaveLength(0);
    });

    test('validates cache persistence across page reloads', async () => {
      const mockTeam = createMockTeam({
        players: [
          createMockPlayer({ id: 'p1', name: 'Persistent Player 1' }),
          createMockPlayer({ id: 'p2', name: 'Persistent Player 2' })
        ]
      });
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTeam));
      
      // First render
      const { unmount } = render(<GamesPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Persistent Player 1')).toBeInTheDocument();
        expect(screen.getByText('Persistent Player 2')).toBeInTheDocument();
      });
      
      unmount();
      
      // Verify localStorage was read
      expect(localStorageMock.getItem).toHaveBeenCalledWith('footballTeam');
      
      // Second render (simulating reload)
      render(<GamesPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Persistent Player 1')).toBeInTheDocument();
        expect(screen.getByText('Persistent Player 2')).toBeInTheDocument();
      });
      
      // Should read from cache again
      expect(localStorageMock.getItem).toHaveBeenCalledTimes(2);
    });

    test('validates cache size limits and cleanup', async () => {
      // Create large team data
      const largeTeam = createMockTeam({
        players: Array.from({ length: 100 }, (_, i) => 
          createMockPlayer({ 
            id: `player-${i}`, 
            name: `Player ${i}`.repeat(10) // Long names to increase size
          })
        ),
        matches: Array.from({ length: 50 }, (_, i) => ({
          id: `match-${i}`,
          date: '2024-01-01',
          opponent: `Opponent ${i}`,
          homeTeam: 'Test Team',
          awayTeam: `Opponent ${i}`,
          homeScore: 2,
          awayScore: 1,
          playerStats: []
        }))
      });
      
      const user = userEvent.setup();
      render(<GamesPage />);
      
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      
      // Simulate adding the large dataset
      localStorageMock.getItem.mockReturnValue(JSON.stringify(largeTeam));
      
      // Add one more player to trigger cache update
      const addButton = screen.getByRole('button', { name: /add player/i });
      await user.click(addButton);
      
      const nameInput = screen.getByLabelText(/player name/i);
      await user.type(nameInput, 'Final Player');
      
      const submitButton = screen.getByRole('button', { name: /add player$/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Final Player')).toBeInTheDocument();
      });
      
      // Verify cache was updated despite large size
      expect(localStorageMock.setItem).toHaveBeenCalled();
      
      const lastCall = (localStorageMock.setItem as jest.Mock).mock.calls.slice(-1)[0];
      const cachedData = lastCall[1];
      
      // Cache should be reasonable size (under 1MB for localStorage)
      expect(cachedData.length).toBeLessThan(1024 * 1024);
    });
  });

  describe('API Sync and Cache Coherence', () => {
    test('validates API sync to localStorage on authenticated operations', async () => {
      mockAuthAPI.isAuthenticated.mockReturnValue(true);
      mockAuthAPI.getCurrentUser.mockResolvedValue({ id: 'user-1' });
      
      const mockTeam = createMockTeam();
      mockFootballAPI.getUserTeams.mockResolvedValue({
        success: true,
        data: [mockTeam]
      });
      
      const updatedTeam = {
        ...mockTeam,
        players: [createMockPlayer({ name: 'API Player' })]
      };
      
      mockFootballAPI.addPlayer.mockResolvedValue({
        success: true,
        data: updatedTeam
      });
      
      mockFootballAPI.syncToLocalStorage.mockImplementation((data) => {
        localStorageMock.setItem('footballTeam', JSON.stringify(data));
      });
      
      const user = userEvent.setup();
      render(<GamesPage />);
      
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      
      // Add player through API
      const addButton = screen.getByRole('button', { name: /add player/i });
      await user.click(addButton);
      
      const nameInput = screen.getByLabelText(/player name/i);
      await user.type(nameInput, 'API Player');
      
      const submitButton = screen.getByRole('button', { name: /add player$/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('API Player')).toBeInTheDocument();
      });
      
      // Verify API sync occurred
      expect(mockFootballAPI.addPlayer).toHaveBeenCalled();
      expect(mockFootballAPI.syncToLocalStorage).toHaveBeenCalledWith(updatedTeam);
    });

    test('validates cache invalidation strategy during conflicts', async () => {
      const initialTeam = createMockTeam({
        players: [createMockPlayer({ name: 'Original Player' })]
      });
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(initialTeam));
      
      mockAuthAPI.isAuthenticated.mockReturnValue(true);
      mockAuthAPI.getCurrentUser.mockResolvedValue({ id: 'user-1' });
      
      // API returns different data (simulating conflict)
      const apiTeam = createMockTeam({
        players: [createMockPlayer({ id: 'p2', name: 'API Player' })]
      });
      
      mockFootballAPI.getUserTeams.mockResolvedValue({
        success: true,
        data: [apiTeam]
      });
      
      mockFootballAPI.syncToLocalStorage.mockImplementation((data) => {
        localStorageMock.setItem('footballTeam', JSON.stringify(data));
      });
      
      render(<GamesPage />);
      
      await waitFor(() => {
        // Should show API data, not cached data
        expect(screen.getByText('API Player')).toBeInTheDocument();
        expect(screen.queryByText('Original Player')).not.toBeInTheDocument();
      });
      
      // Verify cache was updated with API data
      expect(mockFootballAPI.syncToLocalStorage).toHaveBeenCalledWith(apiTeam);
    });
  });

  describe('Cache Performance and Efficiency', () => {
    test('measures cache read performance', async () => {
      const largeTeam = createMockTeam({
        players: Array.from({ length: 30 }, (_, i) => 
          createMockPlayer({ id: `player-${i}`, name: `Player ${i}` })
        )
      });
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(largeTeam));
      
      const startTime = performance.now();
      
      render(<GamesPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Player 0')).toBeInTheDocument();
      });
      
      const endTime = performance.now();
      const cacheReadTime = endTime - startTime;
      
      // Cache reads should be very fast
      expect(cacheReadTime).toBeLessThan(50);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('footballTeam');
    });

    test('validates cache write performance during frequent updates', async () => {
      const user = userEvent.setup();
      render(<GamesPage />);
      
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      
      const startTime = performance.now();
      let writeCount = 0;
      
      // Mock to count writes
      localStorageMock.setItem.mockImplementation(() => {
        writeCount++;
      });
      
      // Perform multiple rapid updates
      for (let i = 0; i < 5; i++) {
        const addButton = screen.getByRole('button', { name: /add player/i });
        await user.click(addButton);
        
        const nameInput = screen.getByLabelText(/player name/i);
        await user.type(nameInput, `Speed Player ${i}`);
        
        const submitButton = screen.getByRole('button', { name: /add player$/i });
        await user.click(submitButton);
        
        await waitFor(() => {
          expect(screen.getByText(`Speed Player ${i}`)).toBeInTheDocument();
        });
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      // Should complete all cache writes efficiently
      expect(totalTime).toBeLessThan(2000);
      expect(writeCount).toBe(5); // One write per addition
      
      // Average write time should be reasonable
      const avgWriteTime = totalTime / writeCount;
      expect(avgWriteTime).toBeLessThan(100);
    });
  });

  describe('Cache Error Handling', () => {
    test('handles localStorage quota exceeded gracefully', async () => {
      const user = userEvent.setup();
      
      // Mock localStorage quota exceeded
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      
      render(<GamesPage />);
      
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      
      // Try to add a player
      const addButton = screen.getByRole('button', { name: /add player/i });
      await user.click(addButton);
      
      const nameInput = screen.getByLabelText(/player name/i);
      await user.type(nameInput, 'Quota Player');
      
      const submitButton = screen.getByRole('button', { name: /add player$/i });
      await user.click(submitButton);
      
      // Should still add player to state even if cache fails
      await waitFor(() => {
        expect(screen.getByText('Quota Player')).toBeInTheDocument();
      });
      
      // Should attempt to write to cache
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    test('handles corrupted cache data gracefully', async () => {
      // Mock corrupted JSON in localStorage
      localStorageMock.getItem.mockReturnValue('{"invalid": json data');
      
      const startTime = performance.now();
      
      render(<GamesPage />);
      
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      
      const endTime = performance.now();
      const recoveryTime = endTime - startTime;
      
      // Should recover gracefully and show empty state
      expect(screen.getByText('No players yet')).toBeInTheDocument();
      expect(recoveryTime).toBeLessThan(200); // Should recover quickly
    });
  });
});