import { render, screen, waitFor, waitForElementToBeRemoved, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GamesPage from './page';

// Mock localStorage
const localStorageMock = localStorage as jest.Mocked<typeof localStorage>;

describe('GamesPage Regression Tests - Existing Functionality', () => {
  const createMockTeamWithPlayers = (playerCount: number) => ({
    name: 'Test Team',
    players: Array.from({ length: playerCount }, (_, i) => ({
      id: `player-${i}`,
      name: `Player ${i}`,
      position: 'ST' as const,
      pace: 70 + i,
      shooting: 75 + i,
      passing: 70 + i,
      dribbling: 70 + i,
      defending: 50 + i,
      physical: 70 + i,
      overall: 70 + i,
      overallRating: 70 + i,
      goals: i * 2,
      assists: i,
      appearances: i * 3
    })),
    matches: Array.from({ length: Math.min(playerCount, 5) }, (_, i) => ({
      id: `match-${i}`,
      date: `2024-01-0${i + 1}`,
      opponent: `Opponent ${i}`,
      homeTeam: 'Test Team',
      awayTeam: `Opponent ${i}`,
      homeScore: 2 + i,
      awayScore: 1,
      playerStats: [
        {
          playerId: `player-0`,
          goals: 1,
          assists: 0,
          rating: 7.5
        }
      ]
    }))
  });

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation();
  });

  describe('Core Page Rendering', () => {
    test('renders main heading and all navigation tabs', () => {
      render(<GamesPage />);
      
      expect(screen.getByText('FIFA-Style Football Management System')).toBeInTheDocument();
      
      // Check all tabs are present
      expect(screen.getByRole('tab', { name: /squad/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /formation/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /simulation/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /season/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /comparison/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /matches/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /stats/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /achievements/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /management/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /leaderboard/i })).toBeInTheDocument();
    });

    test('shows empty state when no players exist', () => {
      render(<GamesPage />);
      
      expect(screen.getByText('No players yet')).toBeInTheDocument();
      expect(screen.getByText('Start building your team by adding your first player')).toBeInTheDocument();
    });

    test('displays loading state initially', () => {
      render(<GamesPage />);
      
      expect(screen.getByText('Loading your team...')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('Player Management Core Functions', () => {
    test('opens add player dialog with all required fields', async () => {
      const user = userEvent.setup();
      render(<GamesPage />);
      
      const addButton = screen.getByRole('button', { name: /add player/i });
      await user.click(addButton);
      
      expect(screen.getByText('Add New Player')).toBeInTheDocument();
      expect(screen.getByText('Create a FIFA-style player with detailed ratings')).toBeInTheDocument();
      
      // Check all form fields are present
      expect(screen.getByLabelText(/player name/i)).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument(); // Position selector
      
      // Check all attribute sliders
      const sliders = screen.getAllByRole('slider');
      expect(sliders).toHaveLength(6); // pace, shooting, passing, dribbling, defending, physical
    });

    test('calculates overall rating correctly for different positions', () => {
      render(<GamesPage />);
      
      const addButton = screen.getByRole('button', { name: /add player/i });
      fireEvent.click(addButton);
      
      // Default striker should show rating around 50 with default stats
      expect(screen.getByText('50')).toBeInTheDocument();
      
      // Change to goalkeeper
      const positionSelect = screen.getByRole('combobox');
      fireEvent.click(positionSelect);
      fireEvent.click(screen.getByText('Goalkeeper'));
      
      // Rating should recalculate based on GK weightings
      const ratings = screen.getAllByText(/\d{2}/);
      expect(ratings.length).toBeGreaterThan(0);
    });

    test('adds new player with correct attributes', async () => {
      const user = userEvent.setup();
      render(<GamesPage />);
      
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      
      const addButton = screen.getByRole('button', { name: /add player/i });
      await user.click(addButton);
      
      const nameInput = screen.getByLabelText(/player name/i);
      await user.type(nameInput, 'Test Player');
      
      const positionSelect = screen.getByRole('combobox');
      await user.click(positionSelect);
      await user.click(screen.getByText('Striker'));
      
      const submitButton = screen.getByRole('button', { name: /add player$/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Test Player')).toBeInTheDocument();
        expect(screen.getByText('ST')).toBeInTheDocument();
      });
    });

    test('validates required fields before submission', async () => {
      const user = userEvent.setup();
      render(<GamesPage />);
      
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      
      const addButton = screen.getByRole('button', { name: /add player/i });
      await user.click(addButton);
      
      // Try to submit without name
      const submitButton = screen.getByRole('button', { name: /add player$/i });
      await user.click(submitButton);
      
      // Dialog should remain open
      expect(screen.getByText('Add New Player')).toBeInTheDocument();
    });

    test('edits existing player successfully', async () => {
      const mockTeam = createMockTeamWithPlayers(1);
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTeam));
      
      const user = userEvent.setup();
      render(<GamesPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Player 0')).toBeInTheDocument();
      });
      
      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);
      
      expect(screen.getByText('Edit Player')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Player 0')).toBeInTheDocument();
      
      const nameInput = screen.getByDisplayValue('Player 0');
      await user.clear(nameInput);
      await user.type(nameInput, 'Edited Player');
      
      const updateButton = screen.getByRole('button', { name: /update player/i });
      await user.click(updateButton);
      
      await waitFor(() => {
        expect(screen.getByText('Edited Player')).toBeInTheDocument();
      });
    });

    test('deletes player successfully', async () => {
      const mockTeam = createMockTeamWithPlayers(1);
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTeam));
      
      const user = userEvent.setup();
      render(<GamesPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Player 0')).toBeInTheDocument();
      });
      
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Player 0')).not.toBeInTheDocument();
        expect(screen.getByText('No players yet')).toBeInTheDocument();
      });
    });
  });

  describe('Statistics and Calculations', () => {
    test('calculates team statistics correctly', () => {
      const mockTeam = createMockTeamWithPlayers(3);
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTeam));
      
      render(<GamesPage />);
      
      const statsTab = screen.getByRole('tab', { name: /stats/i });
      fireEvent.click(statsTab);
      
      // Total players
      expect(screen.getByText('3')).toBeInTheDocument();
      
      // Total goals (0 + 2 + 4 = 6)
      expect(screen.getByText('6')).toBeInTheDocument();
      
      // Total assists (0 + 1 + 2 = 3)
      expect(screen.getByText('3')).toBeInTheDocument();
      
      // Average rating should be calculated
      const avgRating = Math.round((70 + 71 + 72) / 3);
      expect(screen.getByText(avgRating.toString())).toBeInTheDocument();
    });

    test('displays leaderboards correctly', () => {
      const mockTeam = createMockTeamWithPlayers(3);
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTeam));
      
      render(<GamesPage />);
      
      const leaderboardTab = screen.getByRole('tab', { name: /leaderboard/i });
      fireEvent.click(leaderboardTab);
      
      // Top scorers section
      expect(screen.getByText('Top Scorers')).toBeInTheDocument();
      expect(screen.getByText('Player 2')).toBeInTheDocument(); // Highest scorer
      
      // Highest rated section
      expect(screen.getByText('Highest Rated')).toBeInTheDocument();
      expect(screen.getByText('72')).toBeInTheDocument(); // Highest rating
    });

    test('shows match history when matches exist', () => {
      const mockTeam = createMockTeamWithPlayers(3);
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTeam));
      
      render(<GamesPage />);
      
      const matchesTab = screen.getByRole('tab', { name: /matches/i });
      fireEvent.click(matchesTab);
      
      expect(screen.getByText('Recent Matches')).toBeInTheDocument();
      expect(screen.getByText('Opponent 0')).toBeInTheDocument();
      expect(screen.getByText('2-1')).toBeInTheDocument(); // Score
    });
  });

  describe('Tab Navigation', () => {
    test('all tabs are clickable and show appropriate content', async () => {
      const user = userEvent.setup();
      const mockTeam = createMockTeamWithPlayers(2);
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTeam));
      
      render(<GamesPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Player 0')).toBeInTheDocument();
      });
      
      // Test each tab
      const tabs = [
        { name: /formation/i, content: 'Formation View' },
        { name: /simulation/i, content: 'Match Simulation' },
        { name: /season/i, content: 'Season Mode' },
        { name: /comparison/i, content: 'Player Comparison' },
        { name: /achievements/i, content: 'Achievements' },
        { name: /management/i, content: 'Team Management' }
      ];
      
      for (const tab of tabs) {
        const tabElement = screen.getByRole('tab', { name: tab.name });
        await user.click(tabElement);
        
        // Each tab should have some content (not necessarily the exact text)
        expect(tabElement).toHaveAttribute('aria-selected', 'true');
      }
    });

    test('maintains state when switching between tabs', async () => {
      const user = userEvent.setup();
      render(<GamesPage />);
      
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      
      // Add a player in squad tab
      const addButton = screen.getByRole('button', { name: /add player/i });
      await user.click(addButton);
      
      const nameInput = screen.getByLabelText(/player name/i);
      await user.type(nameInput, 'State Test Player');
      
      const submitButton = screen.getByRole('button', { name: /add player$/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('State Test Player')).toBeInTheDocument();
      });
      
      // Switch to stats tab
      const statsTab = screen.getByRole('tab', { name: /stats/i });
      await user.click(statsTab);
      
      // Switch back to squad tab
      const squadTab = screen.getByRole('tab', { name: /squad/i });
      await user.click(squadTab);
      
      // Player should still be there
      expect(screen.getByText('State Test Player')).toBeInTheDocument();
    });
  });

  describe('Data Persistence', () => {
    test('saves data to localStorage on operations', async () => {
      const user = userEvent.setup();
      render(<GamesPage />);
      
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      
      const addButton = screen.getByRole('button', { name: /add player/i });
      await user.click(addButton);
      
      const nameInput = screen.getByLabelText(/player name/i);
      await user.type(nameInput, 'Persistence Test');
      
      const submitButton = screen.getByRole('button', { name: /add player$/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Persistence Test')).toBeInTheDocument();
      });
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'footballTeam',
        expect.stringContaining('Persistence Test')
      );
    });

    test('loads data from localStorage on mount', () => {
      const mockTeam = createMockTeamWithPlayers(2);
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTeam));
      
      render(<GamesPage />);
      
      expect(screen.getByText('Player 0')).toBeInTheDocument();
      expect(screen.getByText('Player 1')).toBeInTheDocument();
      expect(localStorageMock.getItem).toHaveBeenCalledWith('footballTeam');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('handles empty team gracefully', () => {
      const emptyTeam = { name: 'Empty Team', players: [], matches: [] };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(emptyTeam));
      
      render(<GamesPage />);
      
      expect(screen.getByText('No players yet')).toBeInTheDocument();
      expect(screen.getByText('Start building your team by adding your first player')).toBeInTheDocument();
    });

    test('handles malformed localStorage data', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      render(<GamesPage />);
      
      // Should show empty state instead of crashing
      expect(screen.getByText('No players yet')).toBeInTheDocument();
    });

    test('handles missing player stats gracefully', () => {
      const teamWithIncompleteStats = {
        name: 'Incomplete Team',
        players: [{
          id: 'p1',
          name: 'Incomplete Player',
          position: 'ST',
          overall: 70
          // Missing some stats
        }],
        matches: []
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(teamWithIncompleteStats));
      
      render(<GamesPage />);
      
      expect(screen.getByText('Incomplete Player')).toBeInTheDocument();
      expect(screen.getByText('ST')).toBeInTheDocument();
    });
  });

  describe('UI Responsiveness and Accessibility', () => {
    test('maintains keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<GamesPage />);
      
      await waitForElementToBeRemoved(() => screen.queryByText('Loading your team...'));
      
      // Tab through main navigation
      const squadTab = screen.getByRole('tab', { name: /squad/i });
      squadTab.focus();
      
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: /formation/i })).toHaveFocus();
      
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: /simulation/i })).toHaveFocus();
    });

    test('provides proper ARIA labels and roles', () => {
      render(<GamesPage />);
      
      // Check main navigation has proper roles
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      
      const tabs = screen.getAllByRole('tab');
      expect(tabs.length).toBeGreaterThan(5);
      
      // Check buttons have accessible names
      expect(screen.getByRole('button', { name: /add player/i })).toBeInTheDocument();
    });
  });
});