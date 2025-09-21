class GameManager {
    constructor() {
        this.currentGame = null;
        this.currentScore = 0;
        this.currentDifficulty = 'easy';
        this.games = {};
    }
    
    registerGame(name, gameClass) {
        this.games[name] = gameClass;
    }
    
    startGame(gameName, difficulty = 'easy') {
        if (this.games[gameName] && this.isLevelUnlocked(gameName, difficulty)) {
            this.currentGame = new this.games[gameName](difficulty);
            this.currentScore = 0;
            this.currentDifficulty = difficulty;
            this.updateScore(0);
            
            document.getElementById('game-title').textContent = `${this.getGameTitle(gameName)} - ${difficulty.toUpperCase()}`;
            document.getElementById('menu-screen').classList.remove('active');
            document.getElementById('game-screen').classList.add('active');
            
            const gameContainer = document.getElementById('game-container');
            this.currentGame.init(gameContainer);
        }
    }
    
    endGame() {
        if (this.currentGame) {
            this.currentGame.destroy();
            this.currentGame = null;
        }
        

        
        document.getElementById('game-screen').classList.remove('active');
        document.getElementById('menu-screen').classList.add('active');
        this.updateProgressDisplay();
    }
    
    updateScore(points) {
        this.currentScore += points;
        document.querySelector('#game-score span').textContent = this.currentScore;
    }
    
    saveScore(gameName) {
        const key = `${gameName}_${this.currentDifficulty}`;
        Storage.setScore(key, this.currentScore);
        Storage.setCompleted(gameName, this.currentDifficulty);
        this.updateProgressDisplay();
        this.updateDifficultyBadges();
    }
    
    getGameTitle(gameName) {
        const titles = {
            sudoku: 'Sudoku',
            wordsearch: 'Word Search',
            sliding: 'Sliding Puzzle',
            mathquiz: 'Math Quiz',
            crossword: 'Crossword',
            tictactoe: 'Tic Tac Toe',
            memory: 'Memory Match',
            snake: 'Snake',
            minesweeper: 'Minesweeper',
            'mp-tictactoe': 'Multiplayer Tic Tac Toe',
            'mp-memory': 'Multiplayer Memory Match',
            'connect4': 'Connect Four',
            'checkers': 'Checkers',
            'dots': 'Dots & Boxes',
            'rps': 'Rock Paper Scissors',
            'mp-snake': 'Two Player Snake',
            'pong': 'Pong'
        };
        return titles[gameName] || gameName;
    }
    
    updateProgressDisplay() {
        // Simplified for cleaner UI
    }
    
    isLevelUnlocked(gameName, difficulty) {
        // Multiplayer games have all levels unlocked
        const multiplayerGames = ['mp-tictactoe', 'mp-memory', 'connect4', 'checkers', 'dots', 'rps', 'mp-snake', 'pong'];
        if (multiplayerGames.includes(gameName)) {
            return true;
        }
        
        // Single player games use progression system
        if (difficulty === 'easy') return true;
        if (difficulty === 'medium') return Storage.isCompleted(gameName, 'easy');
        if (difficulty === 'hard') return Storage.isCompleted(gameName, 'medium');
        return false;
    }
    
    updateDifficultyBadges() {
        document.querySelectorAll('.game-card').forEach(card => {
            const gameName = card.dataset.game;
            const badges = card.querySelectorAll('.badge');
            
            badges.forEach(badge => {
                const level = badge.dataset.level;
                if (this.isLevelUnlocked(gameName, level)) {
                    badge.classList.remove('locked');
                    badge.classList.add('unlocked');
                } else {
                    badge.classList.remove('unlocked');
                    badge.classList.add('locked');
                }
            });
        });
    }
}

const gameManager = new GameManager();