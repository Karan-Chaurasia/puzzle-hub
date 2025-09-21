class Connect4 {
    constructor(difficulty = 'easy') {
        this.rows = 6;
        this.cols = 7;
        this.board = [];
        this.currentPlayer = 1;
        this.gameOver = false;
        this.winner = null;
        this.container = null;
    }
    
    init(container) {
        this.container = container;
        this.initBoard();
        this.render();
    }
    
    initBoard() {
        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.currentPlayer = 1;
        this.gameOver = false;
        this.winner = null;
    }
    
    render() {
        this.container.innerHTML = `
            <div class="mp-game-container">
                <div class="player-info">
                    <div class="player player1 ${this.currentPlayer === 1 ? 'active' : ''}">
                        <div class="player-name">Player 1</div>
                        <div class="player-score">🔴</div>
                    </div>
                    <div class="game-status">${this.getStatusText()}</div>
                    <div class="player player2 ${this.currentPlayer === 2 ? 'active' : ''}">
                        <div class="player-name">Player 2</div>
                        <div class="player-score">🟡</div>
                    </div>
                </div>
                <div class="connect4-container">
                    <div class="connect4-columns"></div>
                    <div class="connect4-grid"></div>
                </div>
                <div class="mp-controls">
                    <button class="mp-btn reset" onclick="gameManager.currentGame.resetGame()">New Game</button>
                    <button class="mp-btn" onclick="gameManager.endGame()">Go Back</button>
                </div>
            </div>
        `;
        
        this.createBoard();
    }
    
    createBoard() {
        const columnsDiv = this.container.querySelector('.connect4-columns');
        const gridDiv = this.container.querySelector('.connect4-grid');
        
        columnsDiv.innerHTML = '';
        gridDiv.innerHTML = '';
        
        // Create column buttons
        for (let col = 0; col < this.cols; col++) {
            const colBtn = document.createElement('button');
            colBtn.className = 'connect4-column-btn';
            colBtn.textContent = '↓';
            colBtn.addEventListener('click', () => this.dropPiece(col));
            columnsDiv.appendChild(colBtn);
        }
        
        // Create grid
        gridDiv.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
        gridDiv.style.width = 'min(420px, 90vw)';
        gridDiv.style.height = 'min(360px, 77vw)';
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = document.createElement('div');
                cell.className = 'connect4-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                gridDiv.appendChild(cell);
            }
        }
    }
    
    dropPiece(col) {
        if (this.gameOver) return;
        
        // Find the lowest empty row in this column
        let row = -1;
        for (let r = this.rows - 1; r >= 0; r--) {
            if (this.board[r][col] === 0) {
                row = r;
                break;
            }
        }
        
        if (row === -1) return; // Column is full
        
        this.board[row][col] = this.currentPlayer;
        const cell = this.container.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        
        // Add dropping animation
        cell.style.transform = 'translateY(-100px)';
        cell.classList.add(`player${this.currentPlayer}`);
        
        setTimeout(() => {
            cell.style.transform = 'translateY(0)';
        }, 50);
        
        setTimeout(() => {
            if (this.checkWin(row, col)) {
                this.gameOver = true;
                this.winner = this.currentPlayer;
                this.highlightWinningCells(row, col);
            } else if (this.isBoardFull()) {
                this.gameOver = true;
            } else {
                this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
            }
            this.updateDisplay();
        }, 300);
        
        this.updateDisplay();
    }
    
    checkWin(row, col) {
        const player = this.board[row][col];
        
        // Check horizontal
        let count = 1;
        for (let c = col - 1; c >= 0 && this.board[row][c] === player; c--) count++;
        for (let c = col + 1; c < this.cols && this.board[row][c] === player; c++) count++;
        if (count >= 4) return true;
        
        // Check vertical
        count = 1;
        for (let r = row + 1; r < this.rows && this.board[r][col] === player; r++) count++;
        if (count >= 4) return true;
        
        // Check diagonal (top-left to bottom-right)
        count = 1;
        for (let i = 1; row - i >= 0 && col - i >= 0 && this.board[row - i][col - i] === player; i++) count++;
        for (let i = 1; row + i < this.rows && col + i < this.cols && this.board[row + i][col + i] === player; i++) count++;
        if (count >= 4) return true;
        
        // Check diagonal (top-right to bottom-left)
        count = 1;
        for (let i = 1; row - i >= 0 && col + i < this.cols && this.board[row - i][col + i] === player; i++) count++;
        for (let i = 1; row + i < this.rows && col - i >= 0 && this.board[row + i][col - i] === player; i++) count++;
        if (count >= 4) return true;
        
        return false;
    }
    
    isBoardFull() {
        return this.board[0].every(cell => cell !== 0);
    }
    
    highlightWinningCells(row, col) {
        this.container.querySelectorAll('.connect4-cell').forEach(cell => {
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
        
        // Disable column buttons if game is over
        this.container.querySelectorAll('.connect4-column-btn').forEach(btn => {
            btn.disabled = this.gameOver;
        });
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

gameManager.registerGame('connect4', Connect4);