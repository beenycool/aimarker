import { render, waitFor } from '@testing-library/react';
import { screen, fireEvent } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GamesPage from './page';

// Get localStorage mock for type safety
const localStorageMock = localStorage as jest.Mocked<typeof localStorage>;

describe('GamesPage', () => {
  beforeEach(() => {
    // Clear localStorage mocks before each test
    jest.clearAllMocks();
  });

  describe('Page Rendering', () => {
    test('renders the main heading and navigation tabs', () => {
      render(<GamesPage />);
      
      expect(screen.getByText('School Football Team')).toBeInTheDocument();
      expect(screen.getByText('FIFA-Style Football Management System')).toBeInTheDocument();
      
      // Check all tabs are present
      expect(screen.getByRole('tab', { name: /squad/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /matches/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /statistics/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /leaderboard/i })).toBeInTheDocument();
    });

    test('shows empty state when no players exist', () => {
      render(<GamesPage />);
      
      expect(screen.getByText('No players yet')).toBeInTheDocument();
      expect(screen.getByText('Start building your team by adding your first player')).toBeInTheDocument();
    });
  });

  describe('Player Management', () => {
    test('opens add player dialog when button is clicked', async () => {
      const user = userEvent.setup();
      render(<GamesPage />);
      
      const addButton = screen.getByRole('button', { name: /add player/i });
      await user.click(addButton);
      
      expect(screen.getByText('Add New Player')).toBeInTheDocument();
      expect(screen.getByText('Create a FIFA-style player with detailed ratings')).toBeInTheDocument();
    });

    test('calculates overall rating correctly for striker', () => {
      render(<GamesPage />);
      
      // Open dialog and check initial rating calculation
      const addButton = screen.getByRole('button', { name: /add player/i });
      fireEvent.click(addButton);
      
      // Default values should show rating of 50 for striker
      expect(screen.getByText('50')).toBeInTheDocument(); // Overall rating display
    });

    test('updates overall rating when attributes change', async () => {
      const user = userEvent.setup();
      render(<GamesPage />);
      
      const addButton = screen.getByRole('button', { name: /add player/i });
      await user.click(addButton);
      
      // Find shooting slider and increase it
      const shootingSliders = screen.getAllByRole('slider');
      const shootingSlider = shootingSliders[1]; // Second slider should be shooting
      
      fireEvent.change(shootingSlider, { target: { value: 90 } });
      
      // Overall rating should have changed from default 50
      await waitFor(() => {
        const overallRatings = screen.getAllByText(/\d{2}/);
        // Should find a rating higher than 50 due to increased shooting
        expect(overallRatings.some((rating: Element) => parseInt(rating.textContent || '0') > 50)).toBe(true);
      });
    });

    test('adds a new player with correct attributes', async () => {
      const user = userEvent.setup();
      render(<GamesPage />);
      
      // Open add player dialog
      const addButton = screen.getByRole('button', { name: /add player/i });
      await user.click(addButton);
      
      // Fill in player details
      const nameInput = screen.getByLabelText(/player name/i);
      await user.type(nameInput, 'Test Player');
      
      // Select position
      const positionSelect = screen.getByRole('combobox');
      await user.click(positionSelect);
      await user.click(screen.getByText('Striker'));
      
      // Submit the form
      const submitButton = screen.getByRole('button', { name: /add player$/i });
      await user.click(submitButton);
      
      // Verify player was added
      await waitFor(() => {
        expect(screen.getByText('Test Player')).toBeInTheDocument();
        expect(screen.getByText('ST')).toBeInTheDocument();
      });
    });

    test('validates required fields before adding player', async () => {
      const user = userEvent.setup();
      render(<GamesPage />);
      
      // Open add player dialog
      const addButton = screen.getByRole('button', { name: /add player/i });
      await user.click(addButton);
      
      // Try to submit without name
      const submitButton = screen.getByRole('button', { name: /add player$/i });
      await user.click(submitButton);
      
      // Dialog should still be open (player not added)
      expect(screen.getByText('Add New Player')).toBeInTheDocument();
    });
  });

  describe('Player Editing', () => {
    test('opens edit dialog with pre-filled values', async () => {
      const user = userEvent.setup();
      
      // Mock localStorage to return a player
      const mockTeam = {
        name: 'School Football Team',
        players: [{
          id: '1',
          name: 'Test Player',
          position: 'ST',
          pace: 80,
          shooting: 85,
          passing: 70,
          dribbling: 75,
          defending: 40,
          physical: 70,
          overallRating: 75,
          goals: 5,
          assists: 3,
          appearances: 10
        }],
        matches: []
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTeam));
      
      render(<GamesPage />);
      
      // Find and click edit button
      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);
      
      // Check that dialog opens with correct title
      expect(screen.getByText('Edit Player')).toBeInTheDocument();
      
      // Check that name field is pre-filled
      const nameInput = screen.getByDisplayValue('Test Player');
      expect(nameInput).toBeInTheDocument();
    });
  });

  describe('Statistics Calculation', () => {
    test('calculates team statistics correctly', () => {
      // Mock localStorage with test data
      const mockTeam = {
        name: 'School Football Team',
        players: [
          {
            id: '1',
            name: 'Player 1',
            position: 'ST',
            pace: 80, shooting: 85, passing: 70, dribbling: 75, defending: 40, physical: 70,
            overallRating: 75,
            goals: 10,
            assists: 5,
            appearances: 15
          },
          {
            id: '2', 
            name: 'Player 2',
            position: 'CM',
            pace: 70, shooting: 60, passing: 85, dribbling: 70, defending: 75, physical: 65,
            overallRating: 71,
            goals: 3,
            assists: 12,
            appearances: 15
          }
        ],
        matches: []
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTeam));
      
      render(<GamesPage />);
      
      // Navigate to statistics tab
      const statsTab = screen.getByRole('tab', { name: /statistics/i });
      fireEvent.click(statsTab);
      
      // Check calculated statistics
      expect(screen.getByText('2')).toBeInTheDocument(); // Total Players
      expect(screen.getByText('13')).toBeInTheDocument(); // Total Goals (10 + 3)
      expect(screen.getByText('17')).toBeInTheDocument(); // Total Assists (5 + 12)
      expect(screen.getByText('73')).toBeInTheDocument(); // Average Rating (75 + 71) / 2
    });
  });

  describe('Leaderboard Functionality', () => {
    test('displays top scorers correctly', () => {
      const mockTeam = {
        name: 'School Football Team',
        players: [
          {
            id: '1', name: 'Top Scorer', position: 'ST',
            pace: 80, shooting: 85, passing: 70, dribbling: 75, defending: 40, physical: 70,
            overallRating: 75, goals: 15, assists: 5, appearances: 20
          },
          {
            id: '2', name: 'Second Scorer', position: 'CM', 
            pace: 70, shooting: 60, passing: 85, dribbling: 70, defending: 75, physical: 65,
            overallRating: 71, goals: 8, assists: 12, appearances: 18
          }
        ],
        matches: []
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTeam));
      
      render(<GamesPage />);
      
      // Navigate to leaderboard tab
      const leaderboardTab = screen.getByRole('tab', { name: /leaderboard/i });
      fireEvent.click(leaderboardTab);
      
      // Check top scorers are displayed in correct order
      const topScorerSection = screen.getByText('Top Scorers').closest('div');
      expect(topScorerSection).toContainElement(screen.getByText('Top Scorer'));
      expect(topScorerSection).toContainElement(screen.getByText('15')); // goals
    });

    test('displays highest rated players correctly', () => {
      const mockTeam = {
        name: 'School Football Team',
        players: [
          {
            id: '1', name: 'High Rated', position: 'ST',
            pace: 90, shooting: 95, passing: 80, dribbling: 88, defending: 50, physical: 85,
            overallRating: 85, goals: 10, assists: 5, appearances: 15
          },
          {
            id: '2', name: 'Medium Rated', position: 'CM',
            pace: 75, shooting: 65, passing: 80, dribbling: 70, defending: 70, physical: 68,
            overallRating: 72, goals: 5, assists: 8, appearances: 15
          }
        ],
        matches: []
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTeam));
      
      render(<GamesPage />);
      
      // Navigate to leaderboard tab
      const leaderboardTab = screen.getByRole('tab', { name: /leaderboard/i });
      fireEvent.click(leaderboardTab);
      
      // Check highest rated players are displayed
      const highestRatedSection = screen.getByText('Highest Rated').closest('div');
      expect(highestRatedSection).toContainElement(screen.getByText('High Rated'));
      expect(highestRatedSection).toContainElement(screen.getByText('85')); // rating
    });
  });

  describe('Position-Based Rating Calculation', () => {
    test('calculates goalkeeper rating with correct weightings', () => {
      render(<GamesPage />);
      
      const addButton = screen.getByRole('button', { name: /add player/i });
      fireEvent.click(addButton);
      
      // Select goalkeeper position
      const positionSelect = screen.getByRole('combobox');
      fireEvent.click(positionSelect);
      fireEvent.click(screen.getByText('Goalkeeper'));
      
      // Set high defending and low shooting (typical for GK)
      const sliders = screen.getAllByRole('slider');
      fireEvent.change(sliders[1], { target: { value: 30 } }); // shooting
      fireEvent.change(sliders[4], { target: { value: 90 } }); // defending
      
      // Overall rating should reflect GK weightings (defending more important)
      const overallDisplay = screen.getByText(/\d{2}/).textContent;
      const rating = parseInt(overallDisplay || '0');
      
      // Should be reasonable for a GK with high defending, low shooting
      expect(rating).toBeGreaterThan(45);
      expect(rating).toBeLessThan(85);
    });

    test('calculates striker rating with correct weightings', () => {
      render(<GamesPage />);
      
      const addButton = screen.getByRole('button', { name: /add player/i });
      fireEvent.click(addButton);
      
      // Default is striker, set high shooting and pace
      const sliders = screen.getAllByRole('slider');
      fireEvent.change(sliders[0], { target: { value: 90 } }); // pace
      fireEvent.change(sliders[1], { target: { value: 90 } }); // shooting
      fireEvent.change(sliders[4], { target: { value: 30 } }); // defending (low for striker)
      
      // Overall rating should be good for a fast, high-shooting striker
      const overallDisplay = screen.getByText(/\d{2}/).textContent;
      const rating = parseInt(overallDisplay || '0');
      
      expect(rating).toBeGreaterThan(70); // Should be high with good pace/shooting
    });
  });

  describe('Data Persistence', () => {
    test('saves team data to localStorage when player is added', async () => {
      const user = userEvent.setup();
      render(<GamesPage />);
      
      // Add a player
      const addButton = screen.getByRole('button', { name: /add player/i });
      await user.click(addButton);
      
      const nameInput = screen.getByLabelText(/player name/i);
      await user.type(nameInput, 'Test Player');
      
      const submitButton = screen.getByRole('button', { name: /add player$/i });
      await user.click(submitButton);
      
      // Check that localStorage.setItem was called
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'schoolFootballTeam',
        expect.stringContaining('Test Player')
      );
    });

    test('loads team data from localStorage on mount', () => {
      const mockTeam = {
        name: 'School Football Team',
        players: [{
          id: '1',
          name: 'Loaded Player',
          position: 'ST',
          pace: 80, shooting: 85, passing: 70, dribbling: 75, defending: 40, physical: 70,
          overallRating: 75,
          goals: 5,
          assists: 3,
          appearances: 10
        }],
        matches: []
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTeam));
      
      render(<GamesPage />);
      
      // Check that the loaded player is displayed
      expect(screen.getByText('Loaded Player')).toBeInTheDocument();
      expect(localStorageMock.getItem).toHaveBeenCalledWith('schoolFootballTeam');
    });
  });

  describe('Player Deletion', () => {
    test('removes player when delete button is clicked', async () => {
      const user = userEvent.setup();
      
      const mockTeam = {
        name: 'School Football Team',
        players: [{
          id: '1',
          name: 'Player To Delete',
          position: 'ST',
          pace: 80, shooting: 85, passing: 70, dribbling: 75, defending: 40, physical: 70,
          overallRating: 75,
          goals: 5,
          assists: 3,
          appearances: 10
        }],
        matches: []
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTeam));
      
      render(<GamesPage />);
      
      // Verify player exists
      expect(screen.getByText('Player To Delete')).toBeInTheDocument();
      
      // Find and click delete button
      const deleteButton = screen.getAllByRole('button').find(
        button => button.querySelector('svg') // Find button with trash icon
      );
      
      if (deleteButton) {
        await user.click(deleteButton);
        
        // Player should be removed
        expect(screen.queryByText('Player To Delete')).not.toBeInTheDocument();
      }
    });
  });
});