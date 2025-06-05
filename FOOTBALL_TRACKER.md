# 🏆 School Football Tracker

A FIFA-style football management system for school teams, built with Next.js and React.

## 🌟 Features

### Player Management
- **Add Players**: Create new players with detailed FIFA-style ratings
- **Player Positions**: Support for all football positions (GK, CB, LB, RB, CDM, CM, CAM, LW, RW, ST)
- **FIFA-Style Ratings**: Six core attributes with position-based weightings:
  - ⚡ **Pace** - Speed and acceleration
  - ⚽ **Shooting** - Finishing and shot power
  - 🎯 **Passing** - Short and long passing ability
  - 🏃 **Dribbling** - Ball control and skill moves
  - 🛡️ **Defending** - Tackling and positioning
  - 💪 **Physical** - Strength and stamina

### Smart Rating System
- **Position-Based Calculations**: Overall ratings calculated differently based on position
  - **Goalkeepers**: Higher weighting on defending and physical
  - **Defenders**: Focus on defending, physical, and passing
  - **Midfielders**: Balanced across passing, dribbling, and defending
  - **Attackers**: Emphasis on shooting, pace, and dribbling
- **Dynamic Updates**: Overall rating updates in real-time as you adjust attributes
- **Realistic Range**: Ratings from 30-99 like real FIFA cards

### Team Statistics
- **Player Count**: Total squad size
- **Goal Tracking**: Individual and team goal statistics
- **Assist Tracking**: Track player assists and contributions
- **Average Rating**: Team overall rating calculation

### Leaderboards
- **Top Scorers**: Rankings based on goals scored
- **Highest Rated**: Best players by overall rating
- **Performance Tracking**: Goals, assists, and appearances

### Data Persistence
- **Local Storage**: All data saved locally in browser
- **Auto-Save**: Changes saved automatically
- **Persistent Data**: Team data survives page refreshes

## 🎮 How to Use

### Adding Your First Player
1. Navigate to `/games` in your browser
2. Click "Add Player" button
3. Enter player name
4. Select position from dropdown
5. Adjust the six attribute sliders (30-99 range)
6. Watch the overall rating calculate automatically
7. Click "Add Player" to save

### Understanding Ratings
- **90-99**: World Class (Green)
- **80-89**: Excellent (Blue)
- **70-79**: Good (Yellow)
- **60-69**: Average (Orange)
- **Below 60**: Needs Improvement (Red)

### Managing Your Squad
- **Edit Players**: Click the edit icon to modify player attributes
- **Delete Players**: Remove players with the trash icon
- **View Stats**: Check team and individual statistics
- **Track Performance**: Monitor goals, assists, and appearances

## 🛠️ Technical Details

### Built With
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **Lucide React** - Icons

### File Structure
```
app/games/
├── page.tsx          # Main football tracker component
└── page.test.tsx     # Test suite (in development)

components/
├── ui/               # Reusable UI components
└── navigation-header.tsx # Updated with games link
```

### Key Features Implementation
- **Position-based rating calculations** with different weightings
- **Real-time rating updates** using React state
- **Local storage integration** for data persistence
- **Responsive design** works on mobile and desktop
- **Type-safe TypeScript** interfaces for all data structures

## 🎯 Future Enhancements

### Planned Features
- **Match Recording**: Add match results and player performance
- **Season Tracking**: Multiple seasons with historical data
- **Formation Builder**: Visual formation setup
- **Player Cards**: FIFA-style player card designs
- **Export/Import**: Share team data
- **Statistics Dashboard**: Advanced analytics

### Potential Integrations
- **Photo Upload**: Player profile pictures
- **Match Calendar**: Schedule and fixture management
- **League Tables**: Multiple teams and competitions
- **Performance Charts**: Visual statistics tracking

## 🚀 Getting Started

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000/games
   ```

3. Start building your team!

## 📱 Mobile Friendly

The football tracker is fully responsive and works great on:
- 📱 Mobile phones
- 📱 Tablets
- 💻 Desktop computers

## 🎨 Design Philosophy

The interface is designed to feel familiar to FIFA players while being simple enough for school use:
- **Clean, modern design** inspired by FIFA Ultimate Team
- **Color-coded positions** for easy identification
- **Intuitive controls** with sliders and dropdowns
- **Immediate feedback** with real-time rating calculations

---

*Built for schools to make football team management fun and engaging!* ⚽🏆