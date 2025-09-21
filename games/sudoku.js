class SudokuGame {
    constructor(difficulty = 'easy') {
        this.difficulty = difficulty;
        this.size = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 9;
        this.grid = [];
        this.solution = [];
        this.container = null;
    }
    
    init(container) {
        this.container = container;
        this.generatePuzzle();
        this.render();
    }
    
    generatePuzzle() {
        // Create solution grids
        if (this.size === 4) {
            this.solution = [
                [1,2,3,4],
                [3,4,1,2],
                [2,3,4,1],
                [4,1,2,3]
            ];
        } else if (this.size === 6) {
            this.solution = [
                [1,2,3,4,5,6],
                [4,5,6,1,2,3],
                [2,3,1,5,6,4],
                [5,6,4,2,3,1],
                [3,1,2,6,4,5],
                [6,4,5,3,1,2]
            ];
        } else {
            this.solution = [
                [5,3,4,6,7,8,9,1,2],
                [6,7,2,1,9,5,3,4,8],
                [1,9,8,3,4,2,5,6,7],
                [8,5,9,7,6,1,4,2,3],
                [4,2,6,8,5,3,7,9,1],
                [7,1,3,9,2,4,8,5,6],
                [9,6,1,5,3,7,2,8,4],
                [2,8,7,4,1,9,6,3,5],
                [3,4,5,2,8,6,1,7,9]
            ];
        }
        
        // Create puzzle by copying solution and removing numbers
        this.grid = this.solution.map(row => [...row]);
        const cellsToRemove = Math.floor(this.size * this.size * 0.5);
        
        for (let i = 0; i < cellsToRemove; i++) {
            const row = Math.floor(Math.random() * this.size);
            const col = Math.floor(Math.random() * this.size);
            this.grid[row][col] = 0;
        }
    }
    
    render() {
        this.container.innerHTML = `
            <div class="sudoku-game">
                <div class="sudoku-info">
                    <span>Fill the ${this.size}×${this.size} grid</span>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn sudoku-check">Check</button>
                        <button class="btn" onclick="gameManager.endGame()">Go Back</button>
                    </div>
                </div>
                <div class="sudoku-board"></div>
            </div>
        `;
        
        const board = this.container.querySelector('.sudoku-board');
        board.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
        
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const cell = document.createElement('input');
                cell.className = 'sudoku-cell';
                cell.type = 'number';
                cell.min = '1';
                cell.max = this.size.toString();
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                if (this.grid[row][col] !== 0) {
                    cell.value = this.grid[row][col];
                    cell.readOnly = true;
                    cell.classList.add('given');
                }
                
                cell.addEventListener('input', (e) => {
                    const value = parseInt(e.target.value) || 0;
                    if (value >= 1 && value <= this.size) {
                        this.grid[row][col] = value;
                    } else {
                        this.grid[row][col] = 0;
                        e.target.value = '';
                    }
                });
                
                board.appendChild(cell);
            }
        }
        
        this.container.querySelector('.sudoku-check').addEventListener('click', () => {
            this.checkSolution();
        });
    }
    
    checkSolution() {
        let correct = 0;
        let filled = 0;
        
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.grid[row][col] !== 0) {
                    filled++;
                    if (this.grid[row][col] === this.solution[row][col]) {
                        correct++;
                    }
                }
            }
        }
        
        const score = Math.floor((correct / (this.size * this.size)) * 100);
        gameManager.updateScore(score);
        
        if (filled === this.size * this.size && correct === filled) {
            alert('Perfect! Sudoku solved!');
            gameManager.saveScore('sudoku');
        } else {
            alert(`Score: ${score}% (${correct}/${this.size * this.size} correct)`);
        }
    }
    
    destroy() {}
}

gameManager.registerGame('sudoku', SudokuGame);