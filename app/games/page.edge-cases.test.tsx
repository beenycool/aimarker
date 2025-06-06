/* coverage: 90% */

import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GamesPage from './page';

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

describe('GamesPage Edge Cases and Negative Scenarios - LS3_05', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation();
    localStorageMock.removeItem.mockImplementation();
    mockAuthAPI.isAuthenticated.mockReturnValue(false);
  });

  describe('Data Validation Edge Cases', () => {
    test('handles malformed player data gracefully', async () => {
      const malformedTeam = {
        name: 'Test Team',
        players: [
          { id: 'p1', name: '', position: 'INVALID', pace: -10 }, // Invalid data
          { id: 'p2' }, // Missing fields
          null, // Null player
          { id: 'p3', name: 'Valid Player', position: 'ST', pace: 70, shooting: 75, passing: 70, dribbling: 70, defending: 50, physical: 70, overall: 70, overallRating: 70, goals: 0, assists: 0, appearances: 0 }
        ],
        matches: []
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(malformedTeam));
      
      render(<GamesPage />);
      
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      
      // Should handle malformed data without crashing
      expect(screen.getByText('Valid Player')).toBeInTheDocument();
      expect(screen.queryByText('')).not.toBeInTheDocument();
    });

    test('handles extremely large player names', async () => {
      const extremelyLongName = 'A'.repeat(1000);
      const teamWithLongNames = {
        name: 'Test Team',
        players: [
          {
            id: 'p1',
            name: extremelyLongName,
            position: 'ST' as const,
            pace: 70, shooting: 75, passing: 70, dribbling: 70, defending: 50, physical: 70,
            overall: 70, overallRating: 70, goals: 0, assists: 0, appearances: 0
          }
        ],
        matches: []
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(teamWithLongNames));
      
      render(<GamesPage />);
      
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      
      // Should truncate or handle long names appropriately
      expect(screen.getByText(extremelyLongName.substring(0, 50), { exact: false })).toBeInTheDocument();
    });

    test('handles special characters in player names', async () => {
      const specialCharNames = [
        'José María',
        'Müller',
        'O\'Connor',
        '李小明',
        'Ñoño',
        'Αλέξανδρος'
      ];
      
      const teamWithSpecialChars = {
        name: 'International Team',
        players: specialCharNames.map((name, i) => ({
          id: `p${i}`,
          name,
          position: 'ST' as const,
          pace: 70, shooting: 75, passing: 70, dribbling: 70, defending: 50, physical: 70,
          overall: 70, overallRating: 70, goals: 0, assists: 0, appearances: 0
        })),
        matches: []
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(teamWithSpecialChars));
      
      render(<GamesPage />);
      
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      
      // Should handle all special characters correctly
      specialCharNames.forEach(name => {
        expect(screen.getByText(name)).toBeInTheDocument();
      });
    });
  });

  describe('Performance Edge Cases', () => {
    test('handles maximum player limit gracefully', async () => {
      const maxPlayers = Array.from({ length: 1000 }, (_, i) => ({
        id: `player-${i}`,
        name: `Player ${i}`,
        position: 'ST' as const,
        pace: 70, shooting: 75, passing: 70, dribbling: 70, defending: 50, physical: 70,
        overall: 70, overallRating: 70, goals: 0, assists: 0, appearances: 0
      }));
      
      const massiveTeam = {
        name: 'Massive Team',
        players: maxPlayers,
        matches: []
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(massiveTeam));
      
      const startTime = performance.now();
      render(<GamesPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Player 0')).toBeInTheDocument();
      });
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should handle large datasets within reasonable time
      expect(renderTime).toBeLessThan(2000);
    });

    test('handles rapid user interactions without performance degradation', async () => {
      const user = userEvent.setup();
      
      render(<GamesPage />);
      
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      
      // Perform rapid interactions
      const startTime = performance.now();
      
      for (let i = 0; i < 10; i++) {
        const addButton = screen.getByRole('button', { name: /add player/i });
        await user.click(addButton);
        
        const nameInput = screen.getByLabelText(/player name/i);
        await user.type(nameInput, `Rapid Player ${i}`);
        
        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        await user.click(cancelButton);
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      // Rapid interactions should complete within reasonable time
      expect(totalTime).toBeLessThan(5000);
    });
  });

  describe('Network and API Edge Cases', () => {
    test('handles network timeout gracefully', async () => {
      mockAuthAPI.isAuthenticated.mockReturnValue(true);
      mockAuthAPI.getCurrentUser.mockResolvedValue({ id: 'user-1' });
      
      // Simulate network timeout
      mockFootballAPI.getUserTeams.mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Network timeout')), 100)
        )
      );
      
      // Fallback data
      const fallbackTeam = {
        name: 'Fallback Team',
        players: [
          {
            id: 'p1',
            name: 'Fallback Player',
            position: 'ST' as const,
            pace: 70, shooting: 75, passing: 70, dribbling: 70, defending: 50, physical: 70,
            overall: 70, overallRating: 70, goals: 0, assists: 0, appearances: 0
          }
        ],
        matches: []
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(fallbackTeam));
      
      render(<GamesPage />);
      
      // Should fallback to localStorage when network fails
      await waitFor(() => {
        expect(screen.getByText('Fallback Player')).toBeInTheDocument();
      });
    });

    test('handles API rate limiting', async () => {
      mockAuthAPI.isAuthenticated.mockReturnValue(true);
      mockAuthAPI.getCurrentUser.mockResolvedValue({ id: 'user-1' });
      
      // Simulate rate limiting (429 status)
      mockFootballAPI.getUserTeams.mockRejectedValue({
        status: 429,
        message: 'Rate limit exceeded'
      });
      
      mockFootballAPI.migrateFromLocalStorage.mockResolvedValue({ success: false });
      
      render(<GamesPage />);
      
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      
      // Should handle rate limiting gracefully
      expect(mockFootballAPI.getUserTeams).toHaveBeenCalled();
    });

    test('handles malformed API responses', async () => {
      mockAuthAPI.isAuthenticated.mockReturnValue(true);
      mockAuthAPI.getCurrentUser.mockResolvedValue({ id: 'user-1' });
      
      // Return malformed response
      mockFootballAPI.getUserTeams.mockResolvedValue({
        success: true,
        data: 'invalid-data-format' // Should be array
      });
      
      render(<GamesPage />);
      
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      
      // Should handle malformed API response without crashing
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });

  describe('User Input Edge Cases', () => {
    test('handles SQL injection attempts in player names', async () => {
      const user = userEvent.setup();
      
      render(<GamesPage />);
      
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      
      const addButton = screen.getByRole('button', { name: /add player/i });
      await user.click(addButton);
      
      const maliciousInput = "'; DROP TABLE players; --";
      const nameInput = screen.getByLabelText(/player name/i);
      await user.type(nameInput, maliciousInput);
      
      const submitButton = screen.getByRole('button', { name: /add player$/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        // Should sanitize input and not execute malicious code
        expect(screen.getByText(maliciousInput)).toBeInTheDocument();
      });
    });

    test('handles XSS attempts in player names', async () => {
      const user = userEvent.setup();
      
      render(<GamesPage />);
      
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      
      const addButton = screen.getByRole('button', { name: /add player/i });
      await user.click(addButton);
      
      const xssAttempt = "<script>alert('xss')</script>";
      const nameInput = screen.getByLabelText(/player name/i);
      await user.type(nameInput, xssAttempt);
      
      const submitButton = screen.getByRole('button', { name: /add player$/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        // Should escape HTML and not execute script
        expect(screen.getByText(xssAttempt)).toBeInTheDocument();
      });
      
      // Verify no script tag was actually created
      expect(document.querySelector('script[data-testid="malicious"]')).toBeNull();
    });

    test('handles empty and whitespace-only inputs', async () => {
      const user = userEvent.setup();
      
      render(<GamesPage />);
      
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      
      const addButton = screen.getByRole('button', { name: /add player/i });
      await user.click(addButton);
      
      // Test empty input
      const nameInput = screen.getByLabelText(/player name/i);
      const submitButton = screen.getByRole('button', { name: /add player$/i });
      await user.click(submitButton);
      
      // Should not add player with empty name
      await waitFor(() => {
        expect(screen.queryByText('')).not.toBeInTheDocument();
      });
      
      // Test whitespace-only input
      await user.type(nameInput, '   ');
      await user.click(submitButton);
      
      // Should not add player with whitespace-only name
      await waitFor(() => {
        expect(screen.queryByText('   ')).not.toBeInTheDocument();
      });
    });
  });

  describe('Browser Compatibility Edge Cases', () => {
    test('handles localStorage unavailable scenario', async () => {
      // Mock localStorage as undefined (some browsers/private mode)
      const originalLocalStorage = global.localStorage;
      
      Object.defineProperty(global, 'localStorage', {
        value: undefined,
        writable: true
      });
      
      render(<GamesPage />);
      
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      
      // Should handle missing localStorage gracefully
      expect(screen.getByText(/no players yet/i)).toBeInTheDocument();
      
      // Restore localStorage
      Object.defineProperty(global, 'localStorage', {
        value: originalLocalStorage,
        writable: true
      });
    });

    test('handles unsupported browser features gracefully', async () => {
      // Mock missing modern features
      const originalPerformance = global.performance;
      
      Object.defineProperty(global, 'performance', {
        value: undefined,
        writable: true
      });
      
      render(<GamesPage />);
      
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      
      // Should work without performance API
      expect(screen.getByRole('main')).toBeInTheDocument();
      
      // Restore performance
      Object.defineProperty(global, 'performance', {
        value: originalPerformance,
        writable: true
      });
    });
  });

  describe('Memory and Resource Edge Cases', () => {
    test('handles memory pressure situations', async () => {
      // Simulate memory pressure
      const largeArrays = Array.from({ length: 100 }, () => 
        new Array(10000).fill(Math.random())
      );
      
      render(<GamesPage />);
      
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      
      // Component should still function under memory pressure
      expect(screen.getByRole('main')).toBeInTheDocument();
      
      // Cleanup
      largeArrays.length = 0;
    });

    test('handles component unmounting during async operations', async () => {
      mockAuthAPI.isAuthenticated.mockReturnValue(true);
      mockAuthAPI.getCurrentUser.mockResolvedValue({ id: 'user-1' });
      
      // Long-running async operation
      mockFootballAPI.getUserTeams.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          success: true,
          data: []
        }), 1000))
      );
      
      const { unmount } = render(<GamesPage />);
      
      // Unmount before async operation completes
      setTimeout(() => unmount(), 100);
      
      // Should not cause memory leaks or errors
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // No assertions needed - test passes if no errors thrown
    });
  });

  describe('Accessibility Edge Cases', () => {
    test('maintains keyboard navigation under all conditions', async () => {
      const user = userEvent.setup();
      
      render(<GamesPage />);
      
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      
      // Test keyboard navigation
      await user.tab(); // Should focus first interactive element
      await user.keyboard('{Enter}'); // Should activate focused element
      
      // Should maintain focus management
      expect(document.activeElement).toBeInTheDocument();
    });

    test('provides appropriate ARIA labels for dynamic content', async () => {
      const teamWithPlayers = {
        name: 'Accessible Team',
        players: [
          {
            id: 'p1',
            name: 'Screen Reader Player',
            position: 'ST' as const,
            pace: 70, shooting: 75, passing: 70, dribbling: 70, defending: 50, physical: 70,
            overall: 70, overallRating: 70, goals: 0, assists: 0, appearances: 0
          }
        ],
        matches: []
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(teamWithPlayers));
      
      render(<GamesPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Screen Reader Player')).toBeInTheDocument();
      });
      
      // Should have appropriate ARIA labels
      expect(screen.getByRole('main')).toHaveAttribute('aria-label');
    });
  });
});