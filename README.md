# Puzzle Hub - Multi-Game Web App

A collection of 2D puzzle and knowledge games built with vanilla HTML, CSS, and JavaScript. Designed to be hosted entirely on GitHub Pages with no backend dependencies.

## 🎮 Games Included

1. **Sudoku** - Classic 9x9 number puzzle
2. **Word Search** - Find hidden words in a letter grid
3. **Sliding Puzzle** - Arrange numbered tiles in order
4. **Math Quiz** - Test your arithmetic skills
5. **Crossword** - Fill in the word grid using clues

## ✨ Features

- **Progressive Web App (PWA)** - Install on mobile and desktop devices
- **Offline Play** - Works without internet connection after first load
- **Responsive Design** - Works on desktop and mobile browsers
- **Dark/Light Theme** - Toggle between themes with persistent storage
- **Score Tracking** - Progress saved in localStorage
- **Modular Architecture** - Easy to add new games
- **No Backend Required** - Pure frontend solution

## 📱 PWA Installation

### Mobile Devices
1. Open the app in your mobile browser
2. Look for "Add to Home Screen" prompt or browser menu option
3. Tap "Add" or "Install" to install the app
4. App icon will appear on your home screen
5. Launch like any native app with offline support

### Desktop Browsers
1. Open the app in Chrome, Edge, or other PWA-supported browser
2. Look for install icon in address bar or "Install App" button
3. Click to install the app
4. App will appear in your applications/start menu
5. Run as standalone app window

## 🚀 Deployment to GitHub Pages

### Method 1: Direct Upload

1. Create a new repository on GitHub
2. Upload all files from the `puzzle-hub` folder to your repository
3. Go to repository Settings → Pages
4. Select "Deploy from a branch" and choose "main" branch
5. Your app will be available at `https://yourusername.github.io/repository-name`

### Method 2: Git Commands

```bash
# Clone or create your repository
git clone https://github.com/yourusername/puzzle-hub.git
cd puzzle-hub

# Copy all files to the repository
# (copy the contents of this puzzle-hub folder)

# Commit and push
git add .
git commit -m "Initial commit - Puzzle Hub"
git push origin main

# Enable GitHub Pages in repository settings
```

## 🏗️ Project Structure

```
puzzle-hub/
├── index.html          # Main entry point with PWA links
├── manifest.json       # PWA manifest file
├── service-worker.js   # Service worker for offline caching
├── css/
│   └── styles.css      # All styling and responsive design
├── js/
│   ├── app.js          # Main application controller with PWA features
│   ├── gameManager.js  # Game management system
│   └── storage.js      # localStorage utilities
├── icons/
│   ├── icon-192x192.png # PWA icon 192x192
│   └── icon-512x512.png # PWA icon 512x512
└── games/
    ├── sudoku.js       # Sudoku game implementation
    ├── wordsearch.js   # Word Search game
    ├── sliding.js      # Sliding Puzzle game
    ├── mathquiz.js     # Math Quiz game
    └── crossword.js    # Crossword game
```

## 🔧 Adding New Games

To add a new game, follow these steps:

1. Create a new game file in the `games/` folder:

```javascript
class YourGameClass {
    constructor() {
        // Initialize game state
    }
    
    init(container) {
        // Set up the game UI
        this.container = container;
        this.render();
    }
    
    render() {
        // Create game HTML and event listeners
        this.container.innerHTML = `<div>Your game HTML</div>`;
    }
    
    destroy() {
        // Cleanup when game ends
    }
}

// Register the game
gameManager.registerGame('yourgame', YourGameClass);
```

2. Add the game card to `index.html`:

```html
<div class="game-card" data-game="yourgame">
    <div class="game-icon">🎯</div>
    <h3>Your Game</h3>
    <p>Game description</p>
</div>
```

3. Include the script in `index.html`:

```html
<script src="games/yourgame.js"></script>
```

4. Add game title mapping in `gameManager.js`:

```javascript
getGameTitle(gameName) {
    const titles = {
        // ... existing games
        yourgame: 'Your Game Title'
    };
    return titles[gameName] || gameName;
}
```

## 🎯 Scoring System

- Scores are automatically saved to localStorage
- Use `gameManager.updateScore(points)` to add points during gameplay
- Use `gameManager.saveScore('gamename')` to save the final score
- Progress is displayed on the main menu

## 🎨 Customization

### Themes
- Modify CSS custom properties in `:root` and `[data-theme="dark"]`
- Theme preference is automatically saved and restored

### Responsive Design
- Mobile-first approach with CSS Grid and Flexbox
- Breakpoints defined in media queries
- Touch-friendly interface elements

## 🌐 Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- No external dependencies required
- Uses ES6+ features (classes, arrow functions, template literals)

## 📱 Mobile Features

- Responsive grid layouts
- Touch-friendly buttons and controls
- Optimized font sizes and spacing
- Viewport meta tag for proper mobile rendering

## 🔒 Privacy

- All data stored locally in browser localStorage
- No external API calls or data transmission
- No cookies or tracking

## 🛠️ Development

To modify or extend the app:

1. Edit files locally
2. Test in browser by opening `index.html`
3. Commit changes to your repository
4. GitHub Pages will automatically update

## 📄 License

This project is open source and available under the MIT License.