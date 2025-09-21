class Checkers {
    constructor(difficulty = 'easy') {
        this.board = [];
        this.currentPlayer = 1; // 1 = red, 2 = black
        this.gameOver = false;
        this.winner = null;
        this.container = null;
        this.selectedPiece = null;
    }
    
    init(container) {
        this.container = container;
        this.initBoard();
        this.render();
    }
    
    initBoard() {
        this.board = Array(8).fill().map(() => Array(8).fill(0));
        
        // Place red pieces (player 1)
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 8; col++) {
                if ((row + col) % 2 === 1) {
                    this.board[row][col] = 1;
                }
            }
        }
        
        // Place black pieces (player 2)
        for (let row = 5; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if ((row + col) % 2 === 1) {
                    this.board[row][col] = 2;
                }
            }
        }
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
                        <div class="player-score">⚫</div>
                    </div>
                </div>
                <div class="checkers-board"></div>
                <div class="mp-controls">
                    <button class="mp-btn reset" onclick="gameManager.currentGame.resetGame()">New Game</button>
                    <button class="mp-btn" onclick="gameManager.endGame()">Go Back</button>
                </div>
            </div>
        `;
        
        this.createBoard();
    }
    
    createBoard() {
        const board = this.container.querySelector('.checkers-board');
        board.innerHTML = '';
        board.style.gridTemplateColumns = 'repeat(8, 1fr)';
        board.style.width = 'min(300px, 70vw)';
        board.style.height = 'min(300px, 70vw)';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const cell = document.createElement('div');
                cell.className = `checkers-cell ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                if (this.board[row][col] !== 0) {
                    const piece = document.createElement('div');
                    piece.className = `checkers-piece player${this.board[row][col]}`;
                    piece.textContent = this.board[row][col] === 1 ? '🔴' : '⚫';
                    piece.dataset.player = this.board[row][col];
                    cell.appendChild(piece);
                }
                
                cell.addEventListener('click', () => this.handleCellClick(row, col));
                board.appendChild(cell);
            }
        }
    }
    
    handleCellClick(row, col) {
        // Simplified checkers - just basic movement for now
        if (this.selectedPiece) {
            if (this.isValidMove(this.selectedPiece.row, this.selectedPiece.col, row, col)) {
                this.makeMove(this.selectedPiece.row, this.selectedPiece.col, row, col);
            }
            this.clearSelection();
        } else if (this.board[row][col] === this.currentPlayer) {
            this.selectPiece(row, col);
        }
    }
    
    selectPiece(row, col) {
        this.selectedPiece = { row, col };
        const cell = this.container.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add('selected');
    }
    
    clearSelection() {
        this.container.querySelectorAll('.checkers-cell').forEach(cell => {
            cell.classList.remove('selected');
        });
        this.selectedPiece = null;
    }
    
    isValidMove(fromRow, fromCol, toRow, toCol) {
        if (this.board[toRow][toCol] !== 0) return false;
        if ((toRow + toCol) % 2 === 0) return false; // Must move to dark squares
        
        const rowDiff = toRow - fromRow;
        const colDiff = Math.abs(toCol - fromCol);
        
        // Player 1 (red) moves down, Player 2 (black) moves up
        if (this.currentPlayer === 1) {
            return rowDiff === 1 && colDiff === 1;
        } else {
            return rowDiff === -1 && colDiff === 1;
        }
    }
    
    makeMove(fromRow, fromCol, toRow, toCol) {
        this.board[toRow][toCol] = this.board[fromRow][fromCol];
        this.board[fromRow][fromCol] = 0;
        
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.render();
    }
    
    getStatusText() {
        if (this.gameOver) {
            return `Player ${this.winner} Wins!`;
        } else {
            return `Player ${this.currentPlayer}'s Turn`;
        }
    }
    
    resetGame() {
        this.initBoard();
        this.currentPlayer = 1;
        this.gameOver = false;
        this.winner = null;
        this.selectedPiece = null;
        this.render();
    }
    
    destroy() {}
}

gameManager.registerGame('checkers', Checkers);