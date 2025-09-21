class MinesweeperGame {
    constructor(difficulty = 'easy') {
        this.difficulty = difficulty;
        this.size = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 12 : 16;
        this.mineCount = Math.floor(this.size * this.size * 0.15);
        this.board = [];
        this.revealed = [];
        this.flagged = [];
        this.gameOver = false;
        this.container = null;
    }
    
    init(container) {
        this.container = container;
        this.initBoard();
        this.render();
    }
    
    initBoard() {
        this.board = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.revealed = Array(this.size).fill().map(() => Array(this.size).fill(false));
        this.flagged = Array(this.size).fill().map(() => Array(this.size).fill(false));
        
        // Place mines
        let minesPlaced = 0;
        while (minesPlaced < this.mineCount) {
            const row = Math.floor(Math.random() * this.size);
            const col = Math.floor(Math.random() * this.size);
            
            if (this.board[row][col] !== -1) {
                this.board[row][col] = -1;
                minesPlaced++;
                
                // Update adjacent numbers
                for (let r = Math.max(0, row - 1); r <= Math.min(this.size - 1, row + 1); r++) {
                    for (let c = Math.max(0, col - 1); c <= Math.min(this.size - 1, col + 1); c++) {
                        if (this.board[r][c] !== -1) {
                            this.board[r][c]++;
                        }
                    }
                }
            }
        }
    }
    
    render() {
        this.container.innerHTML = `
            <div class="minesweeper-container">
                <div class="minesweeper-info">
                    <div>Mines: <span id="mine-count">${this.mineCount}</span></div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn" onclick="gameManager.currentGame.newGame()">New Game</button>
                        <button class="btn" onclick="gameManager.endGame()">Go Back</button>
                    </div>
                </div>
                <div class="minesweeper-grid" style="grid-template-columns: repeat(${this.size}, 1fr);">
                    ${Array(this.size * this.size).fill().map((_, i) => {
                        const row = Math.floor(i / this.size);
                        const col = i % this.size;
                        return `<button class="mine-cell" data-row="${row}" data-col="${col}"></button>`;
                    }).join('')}
                </div>
            </div>
        `;
        
        this.container.querySelectorAll('.mine-cell').forEach(cell => {
            cell.addEventListener('click', (e) => {
                const row = parseInt(e.target.dataset.row);
                const col = parseInt(e.target.dataset.col);
                this.revealCell(row, col);
            });
            
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const row = parseInt(e.target.dataset.row);
                const col = parseInt(e.target.dataset.col);
                this.toggleFlag(row, col);
            });
        });
    }
    
    revealCell(row, col) {
        if (this.gameOver || this.revealed[row][col] || this.flagged[row][col]) return;
        
        this.revealed[row][col] = true;
        const cell = this.container.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        
        if (this.board[row][col] === -1) {
            cell.textContent = '💣';
            cell.style.background = '#f44336';
            this.gameOver = true;
            this.revealAllMines();
            alert('Game Over! You hit a mine!');
            return;
        }
        
        const value = this.board[row][col];
        cell.textContent = value || '';
        cell.style.background = '#e0e0e0';
        cell.disabled = true;
        
        if (value > 0) {
            cell.style.color = this.getNumberColor(value);
        }
        
        gameManager.updateScore(1);
        
        if (value === 0) {
            // Reveal adjacent cells
            for (let r = Math.max(0, row - 1); r <= Math.min(this.size - 1, row + 1); r++) {
                for (let c = Math.max(0, col - 1); c <= Math.min(this.size - 1, col + 1); c++) {
                    if (!this.revealed[r][c]) {
                        this.revealCell(r, c);
                    }
                }
            }
        }
        
        this.checkWin();
    }
    
    toggleFlag(row, col) {
        if (this.gameOver || this.revealed[row][col]) return;
        
        this.flagged[row][col] = !this.flagged[row][col];
        const cell = this.container.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        
        if (this.flagged[row][col]) {
            cell.textContent = '🚩';
            cell.style.background = '#ffeb3b';
        } else {
            cell.textContent = '';
            cell.style.background = '';
        }
        
        const flagCount = this.flagged.flat().filter(f => f).length;
        this.container.querySelector('#mine-count').textContent = this.mineCount - flagCount;
    }
    
    revealAllMines() {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.board[row][col] === -1) {
                    const cell = this.container.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                    cell.textContent = '💣';
                    cell.style.background = '#f44336';
                }
            }
        }
    }
    
    checkWin() {
        let revealedCount = 0;
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.revealed[row][col] && this.board[row][col] !== -1) {
                    revealedCount++;
                }
            }
        }
        
        if (revealedCount === this.size * this.size - this.mineCount) {
            this.gameOver = true;
            const bonus = Math.floor(this.size * this.size / 2);
            gameManager.updateScore(bonus);
            alert('Congratulations! You cleared the minefield!');
            gameManager.saveScore('minesweeper');
        }
    }
    
    getNumberColor(num) {
        const colors = ['', '#1976d2', '#388e3c', '#d32f2f', '#7b1fa2', '#f57c00', '#c2185b', '#000000', '#424242'];
        return colors[num] || '#000000';
    }
    
    newGame() {
        this.gameOver = false;
        gameManager.updateScore(-gameManager.currentScore);
        this.initBoard();
        this.render();
    }
    
    destroy() {}
}

gameManager.registerGame('minesweeper', MinesweeperGame);