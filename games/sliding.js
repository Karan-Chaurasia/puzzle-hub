class SlidingPuzzleGame {
    constructor() {
        this.size = 4;
        this.tiles = [];
        this.emptyPos = { row: 3, col: 3 };
        this.moves = 0;
        this.container = null;
    }
    
    init(container) {
        this.container = container;
        this.initializeTiles();
        this.shuffle();
        this.render();
    }
    
    initializeTiles() {
        this.tiles = [];
        for (let i = 0; i < this.size; i++) {
            this.tiles[i] = [];
            for (let j = 0; j < this.size; j++) {
                this.tiles[i][j] = i * this.size + j + 1;
            }
        }
        this.tiles[this.size - 1][this.size - 1] = 0; // Empty space
        this.emptyPos = { row: this.size - 1, col: this.size - 1 };
    }
    
    shuffle() {
        // Perform random valid moves to shuffle
        for (let i = 0; i < 1000; i++) {
            const validMoves = this.getValidMoves();
            if (validMoves.length > 0) {
                const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
                this.moveTile(randomMove.row, randomMove.col, false);
            }
        }
        this.moves = 0;
    }
    
    getValidMoves() {
        const moves = [];
        const { row, col } = this.emptyPos;
        
        // Check all four directions
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        
        directions.forEach(([dr, dc]) => {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (newRow >= 0 && newRow < this.size && newCol >= 0 && newCol < this.size) {
                moves.push({ row: newRow, col: newCol });
            }
        });
        
        return moves;
    }
    
    render() {
        this.container.innerHTML = `
            <div class="sliding-container">
                <div class="game-info">
                    <div>Moves: <span id="move-counter">${this.moves}</span></div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn" onclick="gameManager.currentGame.shuffle(); gameManager.currentGame.render();">New Game</button>
                        <button class="btn" onclick="gameManager.endGame()">Go Back</button>
                    </div>
                </div>
                <div class="sliding-grid"></div>
            </div>
        `;
        
        const grid = this.container.querySelector('.sliding-grid');
        
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const tile = document.createElement('button');
                tile.className = 'sliding-tile';
                
                if (this.tiles[i][j] === 0) {
                    tile.classList.add('empty');
                    tile.textContent = '';
                } else {
                    tile.textContent = this.tiles[i][j];
                    tile.addEventListener('click', () => this.moveTile(i, j));
                }
                
                grid.appendChild(tile);
            }
        }
        
        // Store reference for new game button
        this.container.querySelector('.sliding-container').slidingGame = this;
        
        // Update move counter
        const counter = this.container.querySelector('#move-counter');
        if (counter) counter.textContent = this.moves;
    }
    
    moveTile(row, col, countMove = true) {
        const { row: emptyRow, col: emptyCol } = this.emptyPos;
        
        // Check if the tile is adjacent to empty space
        const isAdjacent = (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
                          (Math.abs(col - emptyCol) === 1 && row === emptyRow);
        
        if (isAdjacent) {
            // Swap tile with empty space
            this.tiles[emptyRow][emptyCol] = this.tiles[row][col];
            this.tiles[row][col] = 0;
            this.emptyPos = { row, col };
            
            if (countMove) {
                this.moves++;
                this.render();
                
                if (this.isSolved()) {
                    const score = Math.max(100 - this.moves, 10);
                    gameManager.updateScore(score);
                    setTimeout(() => {
                        alert(`Congratulations! Solved in ${this.moves} moves!`);
                        gameManager.saveScore('sliding');
                    }, 100);
                }
            }
        }
    }
    
    isSolved() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const expectedValue = i * this.size + j + 1;
                if (i === this.size - 1 && j === this.size - 1) {
                    // Last position should be empty (0)
                    if (this.tiles[i][j] !== 0) return false;
                } else {
                    if (this.tiles[i][j] !== expectedValue) return false;
                }
            }
        }
        return true;
    }
    
    destroy() {
        // Cleanup if needed
    }
}

gameManager.registerGame('sliding', SlidingPuzzleGame);