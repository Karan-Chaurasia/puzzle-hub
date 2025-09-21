class DotsAndBoxes {
    constructor(difficulty = 'easy') {
        this.size = difficulty === 'easy' ? 4 : 6;
        this.horizontalLines = [];
        this.verticalLines = [];
        this.boxes = [];
        this.currentPlayer = 1;
        this.player1Score = 0;
        this.player2Score = 0;
        this.gameOver = false;
        this.container = null;
    }
    
    init(container) {
        console.log('Initializing Dots and Boxes with difficulty:', this.difficulty, 'size:', this.size);
        this.container = container;
        this.initGame();
        this.render();
    }
    
    initGame() {
        // Initialize line arrays
        this.horizontalLines = Array(this.size + 1).fill().map(() => Array(this.size).fill(false));
        this.verticalLines = Array(this.size).fill().map(() => Array(this.size + 1).fill(false));
        this.boxes = Array(this.size).fill().map(() => Array(this.size).fill(0));
        
        this.currentPlayer = 1;
        this.player1Score = 0;
        this.player2Score = 0;
        this.gameOver = false;
    }
    
    render() {
        this.container.innerHTML = `
            <div class="mp-game-container">
                <div class="player-info">
                    <div class="player player1 ${this.currentPlayer === 1 ? 'active' : ''}">
                        <div class="player-name">Player 1</div>
                        <div class="player-score">${this.player1Score}</div>
                    </div>
                    <div class="game-status">${this.getStatusText()}</div>
                    <div class="player player2 ${this.currentPlayer === 2 ? 'active' : ''}">
                        <div class="player-name">Player 2</div>
                        <div class="player-score">${this.player2Score}</div>
                    </div>
                </div>
                <div class="dots-container">
                    <div class="dots-grid" style="width: min(${this.size * 45 + 30}px, 80vw); height: min(${this.size * 45 + 30}px, 80vw);"></div>
                </div>
                <div class="mp-controls">
                    <button class="mp-btn reset" onclick="gameManager.currentGame.resetGame()">New Game</button>
                    <button class="mp-btn" onclick="gameManager.endGame()">Go Back</button>
                </div>
            </div>
        `;
        
        this.createGrid();
    }
    
    createGrid() {
        const grid = this.container.querySelector('.dots-grid');
        grid.innerHTML = '';
        
        // Create dots and lines
        for (let row = 0; row <= this.size; row++) {
            for (let col = 0; col <= this.size; col++) {
                // Create dot
                const dot = document.createElement('div');
                dot.className = 'dot';
                dot.style.gridRow = row * 2 + 1;
                dot.style.gridColumn = col * 2 + 1;
                grid.appendChild(dot);
                
                // Create horizontal line (if not last column)
                if (col < this.size) {
                    const hLine = document.createElement('div');
                    hLine.className = 'line horizontal';
                    hLine.style.gridRow = row * 2 + 1;
                    hLine.style.gridColumn = col * 2 + 2;
                    hLine.dataset.type = 'horizontal';
                    hLine.dataset.row = row;
                    hLine.dataset.col = col;
                    hLine.addEventListener('click', () => this.drawLine('horizontal', row, col));
                    grid.appendChild(hLine);
                }
                
                // Create vertical line (if not last row)
                if (row < this.size) {
                    const vLine = document.createElement('div');
                    vLine.className = 'line vertical';
                    vLine.style.gridRow = row * 2 + 2;
                    vLine.style.gridColumn = col * 2 + 1;
                    vLine.dataset.type = 'vertical';
                    vLine.dataset.row = row;
                    vLine.dataset.col = col;
                    vLine.addEventListener('click', () => this.drawLine('vertical', row, col));
                    grid.appendChild(vLine);
                }
                
                // Create box area (if not last row/column)
                if (row < this.size && col < this.size) {
                    const box = document.createElement('div');
                    box.className = 'box';
                    box.style.gridRow = row * 2 + 2;
                    box.style.gridColumn = col * 2 + 2;
                    box.dataset.row = row;
                    box.dataset.col = col;
                    grid.appendChild(box);
                }
            }
        }
        
        // Set grid template
        grid.style.gridTemplateRows = `repeat(${this.size * 2 + 1}, 1fr)`;
        grid.style.gridTemplateColumns = `repeat(${this.size * 2 + 1}, 1fr)`;
    }
    
    drawLine(type, row, col) {
        let lineArray = type === 'horizontal' ? this.horizontalLines : this.verticalLines;
        
        if (lineArray[row][col]) return; // Line already drawn
        
        lineArray[row][col] = true;
        
        // Update visual
        const line = this.container.querySelector(`[data-type="${type}"][data-row="${row}"][data-col="${col}"]`);
        line.classList.add('drawn', `player${this.currentPlayer}`);
        
        // Check for completed boxes
        let boxesCompleted = this.checkCompletedBoxes();
        
        if (boxesCompleted > 0) {
            // Player gets another turn for completing boxes
            if (this.currentPlayer === 1) {
                this.player1Score += boxesCompleted;
            } else {
                this.player2Score += boxesCompleted;
            }
        } else {
            // Switch players
            this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        }
        
        // Check if game is over
        if (this.player1Score + this.player2Score === this.size * this.size) {
            this.gameOver = true;
        }
        
        this.updateDisplay();
    }
    
    checkCompletedBoxes() {
        let completed = 0;
        
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.boxes[row][col] === 0) { // Box not yet claimed
                    if (this.isBoxComplete(row, col)) {
                        this.boxes[row][col] = this.currentPlayer;
                        completed++;
                        
                        // Update visual
                        const box = this.container.querySelector(`[data-row="${row}"][data-col="${col}"].box`);
                        box.classList.add('completed', `player${this.currentPlayer}`);
                        box.textContent = this.currentPlayer;
                    }
                }
            }
        }
        
        return completed;
    }
    
    isBoxComplete(row, col) {
        return this.horizontalLines[row][col] && // top
               this.horizontalLines[row + 1][col] && // bottom
               this.verticalLines[row][col] && // left
               this.verticalLines[row][col + 1]; // right
    }
    
    updateDisplay() {
        const player1 = this.container.querySelector('.player1');
        const player2 = this.container.querySelector('.player2');
        const status = this.container.querySelector('.game-status');
        
        player1.classList.toggle('active', this.currentPlayer === 1 && !this.gameOver);
        player2.classList.toggle('active', this.currentPlayer === 2 && !this.gameOver);
        
        player1.querySelector('.player-score').textContent = this.player1Score;
        player2.querySelector('.player-score').textContent = this.player2Score;
        
        status.textContent = this.getStatusText();
    }
    
    getStatusText() {
        if (this.gameOver) {
            if (this.player1Score > this.player2Score) {
                return `Player 1 Wins! (${this.player1Score}-${this.player2Score})`;
            } else if (this.player2Score > this.player1Score) {
                return `Player 2 Wins! (${this.player2Score}-${this.player1Score})`;
            } else {
                return `It's a Tie! (${this.player1Score}-${this.player2Score})`;
            }
        } else {
            return `Player ${this.currentPlayer}'s Turn`;
        }
    }
    
    resetGame() {
        this.initGame();
        this.render();
    }
    
    destroy() {}
}

gameManager.registerGame('dots', DotsAndBoxes);