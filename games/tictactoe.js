class TicTacToeGame {
    constructor(difficulty = 'easy') {
        this.difficulty = difficulty;
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameOver = false;
        this.container = null;
    }
    
    init(container) {
        this.container = container;
        this.render();
    }
    
    render() {
        const difficultyText = {
            easy: 'Easy AI - Random moves',
            medium: 'Smart AI - Strategic play', 
            hard: 'Expert AI - Unbeatable'
        };
        
        this.container.innerHTML = `
            <div class="tictactoe-container">
                <div class="tictactoe-info">
                    <span>Playing against: ${difficultyText[this.difficulty]}</span>
                </div>
                <div class="tictactoe-grid">
                    ${Array(9).fill().map((_, i) => 
                        `<button class="tictactoe-cell" data-index="${i}"></button>`
                    ).join('')}
                </div>
                <div class="game-status">Your turn! Click a square! 😄✨</div>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button class="btn" onclick="gameManager.currentGame.resetGame()">New Game</button>
                    <button class="btn" onclick="gameManager.endGame()">Go Back</button>
                </div>
            </div>
        `;
        
        this.container.querySelectorAll('.tictactoe-cell').forEach(cell => {
            cell.addEventListener('click', (e) => this.makeMove(parseInt(e.target.dataset.index)));
        });
    }
    
    makeMove(index) {
        if (this.board[index] || this.gameOver) return;
        
        const cell = this.container.querySelector(`[data-index="${index}"]`);
        cell.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            this.board[index] = this.currentPlayer;
            this.updateDisplay();
            cell.style.transform = 'scale(1)';
            
            if (this.checkWin()) {
                this.container.querySelector('.game-status').textContent = 'YOU WON! Amazing! 🎉🎆🎈';
                this.gameOver = true;
                gameManager.updateScore(100);
                gameManager.saveScore('tictactoe');
                this.highlightWinningCells();
                return;
            }
            
            if (this.board.every(cell => cell)) {
                this.container.querySelector('.game-status').textContent = 'Draw! 🤝';
                this.gameOver = true;
                return;
            }
            
            this.currentPlayer = 'O';
            this.container.querySelector('.game-status').textContent = 'Computer is thinking... 🤖💭';
            
            setTimeout(() => this.aiMove(), 800);
        }, 150);
    }
    
    aiMove() {
        let moveIndex;
        
        if (this.difficulty === 'easy') {
            // Random move
            const emptyCells = this.board.map((cell, i) => cell === '' ? i : null).filter(i => i !== null);
            moveIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        } else {
            // Smart AI for medium/hard
            moveIndex = this.getBestMove();
        }
        
        const cell = this.container.querySelector(`[data-index="${moveIndex}"]`);
        cell.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            this.board[moveIndex] = 'O';
            this.updateDisplay();
            cell.style.transform = 'scale(1)';
            
            if (this.checkWin()) {
                this.container.querySelector('.game-status').textContent = 'Computer wins! Try again! 🤖😊';
                this.gameOver = true;
                this.highlightWinningCells();
                return;
            }
            
            if (this.board.every(cell => cell)) {
                this.container.querySelector('.game-status').textContent = 'Draw! 🤝';
                this.gameOver = true;
                return;
            }
            
            this.currentPlayer = 'X';
            this.container.querySelector('.game-status').textContent = 'Your turn! Pick a square! 😄';
        }, 150);
    }
    
    updateDisplay() {
        this.container.querySelectorAll('.tictactoe-cell').forEach((cell, i) => {
            if (this.board[i] && !cell.textContent) {
                cell.style.transform = 'scale(0)';
                setTimeout(() => {
                    cell.textContent = this.board[i];
                    cell.dataset.player = this.board[i];
                    cell.style.transform = 'scale(1)';
                }, 50);
            }
            cell.disabled = this.board[i] !== '';
        });
    }
    
    highlightWinningCells() {
        const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        const winningCombo = wins.find(combo => 
            combo.every(i => this.board[i] === this.currentPlayer)
        );
        
        if (winningCombo) {
            winningCombo.forEach(i => {
                const cell = this.container.querySelector(`[data-index="${i}"]`);
                cell.style.background = '#4caf50';
                cell.style.color = 'white';
                cell.style.animation = 'pulse 1s infinite';
            });
        }
    }
    
    checkWin() {
        const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        return wins.some(combo => 
            combo.every(i => this.board[i] === this.currentPlayer)
        );
    }
    
    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameOver = false;
        this.container.querySelectorAll('.tictactoe-cell').forEach(cell => {
            cell.style.background = 'linear-gradient(45deg, #fff, #f8f9fa)';
            cell.style.color = 'var(--text-color)';
            cell.style.animation = 'none';
            cell.textContent = '';
            cell.removeAttribute('data-player');
            cell.disabled = false;
        });
        this.container.querySelector('.game-status').textContent = 'Your turn! Click a square! 😄✨';
    }
    
    getBestMove() {
        if (this.difficulty === 'hard') {
            return this.minimax(this.board, 'O').index;
        }
        
        // Medium difficulty - strategic but not perfect
        // Try to win
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'O';
                if (this.checkWin()) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }
        
        // Block player from winning
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'X';
                if (this.checkWin()) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }
        
        // Take center if available
        if (this.board[4] === '') return 4;
        
        // Take corners
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => this.board[i] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
        
        // Take any available spot
        const emptyCells = this.board.map((cell, i) => cell === '' ? i : null).filter(i => i !== null);
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
    
    minimax(board, player) {
        const availSpots = board.map((cell, i) => cell === '' ? i : null).filter(i => i !== null);
        
        if (this.checkWinForBoard(board, 'X')) return {score: -10};
        if (this.checkWinForBoard(board, 'O')) return {score: 10};
        if (availSpots.length === 0) return {score: 0};
        
        const moves = [];
        
        for (let i = 0; i < availSpots.length; i++) {
            const move = {};
            move.index = availSpots[i];
            board[availSpots[i]] = player;
            
            if (player === 'O') {
                const result = this.minimax(board, 'X');
                move.score = result.score;
            } else {
                const result = this.minimax(board, 'O');
                move.score = result.score;
            }
            
            board[availSpots[i]] = '';
            moves.push(move);
        }
        
        let bestMove;
        if (player === 'O') {
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        
        return moves[bestMove];
    }
    
    checkWinForBoard(board, player) {
        const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        return wins.some(combo => combo.every(i => board[i] === player));
    }
    
    destroy() {}
}

gameManager.registerGame('tictactoe', TicTacToeGame);