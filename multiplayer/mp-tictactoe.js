class MultiplayerTicTacToe {
    constructor(difficulty = 'easy') {
        this.difficulty = difficulty;
        this.size = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;
        this.board = [];
        this.currentPlayer = 1;
        this.gameOver = false;
        this.winner = null;
        this.container = null;
    }
    
    init(container) {
        console.log('Initializing MP Tic Tac Toe with difficulty:', this.difficulty, 'size:', this.size);
        this.container = container;
        this.initBoard();
        this.render();
    }
    
    initBoard() {
        this.board = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.currentPlayer = 1;
        this.gameOver = false;
        this.winner = null;
    }
    
    render() {
        const gridSize = this.size === 3 ? 'min(250px, 70vw)' : this.size === 4 ? 'min(280px, 75vw)' : 'min(320px, 80vw)';
        
        this.container.innerHTML = `
            <div class="mp-game-container">
                <div class="player-info">
                    <div class="player player1 ${this.currentPlayer === 1 ? 'active' : ''}">
                        <div class="player-name">Player 1</div>
                        <div class="player-score">X</div>
                    </div>
                    <div class="game-status">${this.getStatusText()}</div>
                    <div class="player player2 ${this.currentPlayer === 2 ? 'active' : ''}">
                        <div class="player-name">Player 2</div>
                        <div class="player-score">O</div>
                    </div>
                </div>
                <div class="mp-grid" style="grid-template-columns: repeat(${this.size}, 1fr); width: ${gridSize}; height: ${gridSize};"></div>
                <div class="mp-controls">
                    <button class="mp-btn reset" onclick="gameManager.currentGame.resetGame()">New Game</button>
                    <button class="mp-btn" onclick="gameManager.endGame()">Go Back</button>
                </div>
            </div>
        `;
        
        this.createBoard();
    }
    
    createBoard() {
        const grid = this.container.querySelector('.mp-grid');
        grid.innerHTML = '';
        
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const cell = document.createElement('div');
                cell.className = 'mp-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', () => this.makeMove(row, col));
                grid.appendChild(cell);
            }
        }
    }
    
    makeMove(row, col) {
        if (this.gameOver || this.board[row][col] !== 0) return;
        
        this.board[row][col] = this.currentPlayer;
        const cell = this.container.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.textContent = this.currentPlayer === 1 ? 'X' : 'O';
        cell.classList.add(`player${this.currentPlayer}`);
        
        if (this.checkWin(row, col)) {
            this.gameOver = true;
            this.winner = this.currentPlayer;
            this.highlightWinningCells();
        } else if (this.isBoardFull()) {
            this.gameOver = true;
        } else {
            this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        }
        
        this.updateDisplay();
    }
    
    checkWin(row, col) {
        const player = this.board[row][col];
        const winLength = this.size === 3 ? 3 : this.size === 4 ? 4 : 4; // 5x5 needs 4 in a row
        
        // Check horizontal
        let count = 1;
        for (let c = col - 1; c >= 0 && this.board[row][c] === player; c--) count++;
        for (let c = col + 1; c < this.size && this.board[row][c] === player; c++) count++;
        if (count >= winLength) return true;
        
        // Check vertical
        count = 1;
        for (let r = row - 1; r >= 0 && this.board[r][col] === player; r--) count++;
        for (let r = row + 1; r < this.size && this.board[r][col] === player; r++) count++;
        if (count >= winLength) return true;
        
        // Check diagonal (top-left to bottom-right)
        count = 1;
        for (let i = 1; row - i >= 0 && col - i >= 0 && this.board[row - i][col - i] === player; i++) count++;
        for (let i = 1; row + i < this.size && col + i < this.size && this.board[row + i][col + i] === player; i++) count++;
        if (count >= winLength) return true;
        
        // Check diagonal (top-right to bottom-left)
        count = 1;
        for (let i = 1; row - i >= 0 && col + i < this.size && this.board[row - i][col + i] === player; i++) count++;
        for (let i = 1; row + i < this.size && col - i >= 0 && this.board[row + i][col - i] === player; i++) count++;
        if (count >= winLength) return true;
        
        return false;
    }
    
    isBoardFull() {
        return this.board.every(row => row.every(cell => cell !== 0));
    }
    
    highlightWinningCells() {
        // Simple highlight - could be enhanced to show exact winning line
        this.container.querySelectorAll('.mp-cell').forEach(cell => {
            if (cell.classList.contains(`player${this.winner}`)) {
                cell.style.boxShadow = '0 0 10px gold';
            }
        });
    }
    
    updateDisplay() {
        const player1 = this.container.querySelector('.player1');
        const player2 = this.container.querySelector('.player2');
        const status = this.container.querySelector('.game-status');
        
        player1.classList.toggle('active', this.currentPlayer === 1 && !this.gameOver);
        player2.classList.toggle('active', this.currentPlayer === 2 && !this.gameOver);
        
        status.textContent = this.getStatusText();
    }
    
    getStatusText() {
        if (this.winner) {
            return `Player ${this.winner} Wins!`;
        } else if (this.gameOver) {
            return "It's a Draw!";
        } else {
            return `Player ${this.currentPlayer}'s Turn`;
        }
    }
    
    resetGame() {
        this.initBoard();
        this.render();
    }
    
    destroy() {}
}

gameManager.registerGame('mp-tictactoe', MultiplayerTicTacToe);