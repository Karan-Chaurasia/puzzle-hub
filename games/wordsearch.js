class WordSearchGame {
    constructor(difficulty = 'easy') {
        this.difficulty = difficulty;
        this.grid = [];
        this.foundWords = new Set();
        this.container = null;
        
        if (difficulty === 'easy') {
            this.gridSize = 5;
            this.words = ['CAT', 'DOG', 'SUN', 'FUN', 'TOY'];
        } else if (difficulty === 'medium') {
            this.gridSize = 8;
            this.words = ['HAPPY', 'SMILE', 'PLAY', 'JUMP', 'DANCE', 'LAUGH'];
        } else {
            this.gridSize = 12;
            this.words = ['PUZZLE', 'ADVENTURE', 'EXPLORE', 'DISCOVER', 'CHALLENGE', 'VICTORY', 'AMAZING', 'FANTASTIC'];
        }
    }
    
    init(container) {
        this.container = container;
        this.generateGrid();
        this.render();
    }
    
    generateGrid() {
        // Initialize empty grid
        this.grid = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(''));
        
        // Place words randomly
        this.words.forEach(word => {
            this.placeWord(word);
        });
        
        // Fill empty cells with random letters
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (this.grid[i][j] === '') {
                    this.grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                }
            }
        }
    }
    
    placeWord(word) {
        const directions = [
            [0, 1],   // horizontal
            [1, 0],   // vertical
            [1, 1],   // diagonal down-right
            [-1, 1]   // diagonal up-right
        ];
        
        let placed = false;
        let attempts = 0;
        
        while (!placed && attempts < 100) {
            const direction = directions[Math.floor(Math.random() * directions.length)];
            const startRow = Math.floor(Math.random() * this.gridSize);
            const startCol = Math.floor(Math.random() * this.gridSize);
            
            if (this.canPlaceWord(word, startRow, startCol, direction)) {
                for (let i = 0; i < word.length; i++) {
                    const row = startRow + i * direction[0];
                    const col = startCol + i * direction[1];
                    this.grid[row][col] = word[i];
                }
                placed = true;
            }
            attempts++;
        }
    }
    
    canPlaceWord(word, startRow, startCol, direction) {
        for (let i = 0; i < word.length; i++) {
            const row = startRow + i * direction[0];
            const col = startCol + i * direction[1];
            
            if (row < 0 || row >= this.gridSize || col < 0 || col >= this.gridSize) {
                return false;
            }
            
            if (this.grid[row][col] !== '' && this.grid[row][col] !== word[i]) {
                return false;
            }
        }
        return true;
    }
    
    render() {
        this.container.innerHTML = `
            <div class="wordsearch-container">
                <div class="wordsearch-info">
                    <div>Found: ${this.foundWords.size}/${this.words.length} words</div>
                    <button class="btn" onclick="gameManager.endGame()" style="padding: 8px 16px; font-size: 0.9rem;">Go Back</button>
                </div>
                <div class="wordsearch-grid" style="grid-template-columns: repeat(${this.gridSize}, 1fr);"></div>
                <div class="wordsearch-words">
                    <h4 style="color: var(--accent-color); margin-bottom: 10px; text-align: center;">🔍 Find these words:</h4>
                    <div class="wordsearch-word-list">
                        ${this.words.map(word => `<span class="wordsearch-word" data-word="${word}">${word}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
        
        const grid = this.container.querySelector('.wordsearch-grid');
        
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'wordsearch-cell';
                cell.textContent = this.grid[i][j];
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                cell.addEventListener('click', () => this.selectCell(i, j));
                
                grid.appendChild(cell);
            }
        }
    }
    
    selectCell(row, col) {
        // Simple word finding - check if clicked cell starts any word
        this.words.forEach(word => {
            if (!this.foundWords.has(word) && this.checkWordAt(word, row, col)) {
                this.foundWords.add(word);
                this.highlightWord(word, row, col);
                gameManager.updateScore(10);
                
                const wordElement = this.container.querySelector(`[data-word="${word}"]`);
                wordElement.style.textDecoration = 'line-through';
                wordElement.style.opacity = '0.5';
                
                // Update found counter
                this.container.querySelector('.wordsearch-info div').textContent = `Found: ${this.foundWords.size}/${this.words.length} words`;
                
                if (this.foundWords.size === this.words.length) {
                    setTimeout(() => {
                        alert('🎉 Amazing! You found all the words!');
                        gameManager.saveScore('wordsearch');
                    }, 100);
                }
            }
        });
    }
    
    checkWordAt(word, startRow, startCol) {
        const directions = [[0, 1], [1, 0], [1, 1], [-1, 1]];
        
        return directions.some(direction => {
            for (let i = 0; i < word.length; i++) {
                const row = startRow + i * direction[0];
                const col = startCol + i * direction[1];
                
                if (row < 0 || row >= this.gridSize || col < 0 || col >= this.gridSize ||
                    this.grid[row][col] !== word[i]) {
                    return false;
                }
            }
            return true;
        });
    }
    
    highlightWord(word, startRow, startCol) {
        const directions = [[0, 1], [1, 0], [1, 1], [-1, 1]];
        
        directions.forEach(direction => {
            let match = true;
            for (let i = 0; i < word.length; i++) {
                const row = startRow + i * direction[0];
                const col = startCol + i * direction[1];
                
                if (row < 0 || row >= this.gridSize || col < 0 || col >= this.gridSize ||
                    this.grid[row][col] !== word[i]) {
                    match = false;
                    break;
                }
            }
            
            if (match) {
                for (let i = 0; i < word.length; i++) {
                    const row = startRow + i * direction[0];
                    const col = startCol + i * direction[1];
                    const cell = this.container.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                    cell.classList.add('found');
                }
            }
        });
    }
    
    destroy() {
        // Cleanup if needed
    }
}

gameManager.registerGame('wordsearch', WordSearchGame);