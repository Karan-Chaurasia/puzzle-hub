class CrosswordGame {
    constructor(difficulty = 'easy') {
        this.difficulty = difficulty;
        this.gridSize = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 6 : 7;
        this.grid = [];
        this.words = this.getWordsForDifficulty(difficulty);
        this.container = null;
        this.currentCell = null;
    }
    
    getWordsForDifficulty(difficulty) {
        const puzzles = {
            easy: [
                [
                    { word: 'CAT', clue: 'Pet that meows', row: 1, col: 1, direction: 'across' },
                    { word: 'DOG', clue: 'Pet that barks', row: 3, col: 1, direction: 'across' },
                    { word: 'COD', clue: 'Type of fish', row: 1, col: 1, direction: 'down' }
                ],
                [
                    { word: 'SUN', clue: 'Bright star', row: 1, col: 1, direction: 'across' },
                    { word: 'FUN', clue: 'Good time', row: 3, col: 1, direction: 'across' },
                    { word: 'SIT', clue: 'Take a seat', row: 1, col: 1, direction: 'down' }
                ],
                [
                    { word: 'BIG', clue: 'Very large', row: 1, col: 1, direction: 'across' },
                    { word: 'BAG', clue: 'Carry things', row: 3, col: 1, direction: 'across' },
                    { word: 'BAT', clue: 'Flying animal', row: 1, col: 1, direction: 'down' }
                ],
                [
                    { word: 'RED', clue: 'Color of fire', row: 1, col: 1, direction: 'across' },
                    { word: 'BED', clue: 'Sleep here', row: 3, col: 1, direction: 'across' },
                    { word: 'RUN', clue: 'Move fast', row: 1, col: 1, direction: 'down' }
                ]
            ],
            medium: [
                [
                    { word: 'GAME', clue: 'Fun to play', row: 1, col: 1, direction: 'across' },
                    { word: 'BOOK', clue: 'Read for fun', row: 3, col: 1, direction: 'across' },
                    { word: 'GOAL', clue: 'Score in soccer', row: 1, col: 1, direction: 'down' },
                    { word: 'MAKE', clue: 'Create something', row: 1, col: 3, direction: 'down' }
                ],
                [
                    { word: 'PLAY', clue: 'Have fun', row: 1, col: 1, direction: 'across' },
                    { word: 'CAKE', clue: 'Sweet treat', row: 3, col: 1, direction: 'across' },
                    { word: 'PARK', clue: 'Green space', row: 1, col: 1, direction: 'down' },
                    { word: 'LAKE', clue: 'Body of water', row: 1, col: 3, direction: 'down' }
                ],
                [
                    { word: 'JUMP', clue: 'Leap up high', row: 1, col: 1, direction: 'across' },
                    { word: 'HELP', clue: 'Give aid', row: 3, col: 1, direction: 'across' },
                    { word: 'JOKE', clue: 'Funny story', row: 1, col: 1, direction: 'down' },
                    { word: 'HOPE', clue: 'Wish for good', row: 1, col: 3, direction: 'down' }
                ],
                [
                    { word: 'STAR', clue: 'Shines at night', row: 1, col: 1, direction: 'across' },
                    { word: 'TREE', clue: 'Has leaves', row: 3, col: 1, direction: 'across' },
                    { word: 'STOP', clue: 'Do not go', row: 1, col: 1, direction: 'down' },
                    { word: 'TIME', clue: 'Clock shows this', row: 1, col: 3, direction: 'down' }
                ]
            ],
            hard: [
                [
                    { word: 'PUZZLE', clue: 'Brain teaser', row: 1, col: 1, direction: 'across' },
                    { word: 'SCHOOL', clue: 'Place to learn', row: 3, col: 1, direction: 'across' },
                    { word: 'FRIEND', clue: 'Good buddy', row: 5, col: 1, direction: 'across' },
                    { word: 'PHONE', clue: 'Call device', row: 1, col: 1, direction: 'down' }
                ],
                [
                    { word: 'GARDEN', clue: 'Grow flowers', row: 1, col: 1, direction: 'across' },
                    { word: 'ANIMAL', clue: 'Living creature', row: 3, col: 1, direction: 'across' },
                    { word: 'FAMILY', clue: 'People you love', row: 5, col: 1, direction: 'across' },
                    { word: 'GUITAR', clue: 'Music instrument', row: 1, col: 1, direction: 'down' }
                ],
                [
                    { word: 'PLANET', clue: 'Earth is one', row: 1, col: 1, direction: 'across' },
                    { word: 'CASTLE', clue: 'Royal home', row: 3, col: 1, direction: 'across' },
                    { word: 'BRIDGE', clue: 'Cross water', row: 5, col: 1, direction: 'across' },
                    { word: 'PENCIL', clue: 'Write with this', row: 1, col: 1, direction: 'down' }
                ],
                [
                    { word: 'ROCKET', clue: 'Flies to space', row: 1, col: 1, direction: 'across' },
                    { word: 'JUNGLE', clue: 'Dense forest', row: 3, col: 1, direction: 'across' },
                    { word: 'MARKET', clue: 'Buy things here', row: 5, col: 1, direction: 'across' },
                    { word: 'RABBIT', clue: 'Hopping animal', row: 1, col: 1, direction: 'down' }
                ]
            ]
        };
        
        const puzzleSet = puzzles[difficulty];
        const randomIndex = Math.floor(Math.random() * puzzleSet.length);
        return puzzleSet[randomIndex];
    }
    
    init(container) {
        this.container = container;
        this.initializeGrid();
        this.placeWords();
        this.render();
    }
    
    initializeGrid() {
        this.grid = Array(this.gridSize).fill().map(() => 
            Array(this.gridSize).fill({ letter: '', number: 0, black: true })
        );
    }
    
    placeWords() {
        this.words.forEach((wordData, index) => {
            const { word, row, col, direction } = wordData;
            
            for (let i = 0; i < word.length; i++) {
                const currentRow = direction === 'across' ? row : row + i;
                const currentCol = direction === 'across' ? col + i : col;
                
                if (currentRow < this.gridSize && currentCol < this.gridSize) {
                    this.grid[currentRow][currentCol] = {
                        letter: word[i],
                        number: i === 0 ? index + 1 : 0,
                        black: false,
                        wordIndex: index,
                        letterIndex: i
                    };
                }
            }
        });
    }
    
    render() {
        const acrossWords = this.words.filter(w => w.direction === 'across');
        const downWords = this.words.filter(w => w.direction === 'down');
        
        this.container.innerHTML = `
            <div class="crossword-container">
                <div class="crossword-info">
                    <h3>Crossword - ${this.difficulty.toUpperCase()}</h3>
                    <p>Click and type your answers!</p>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn" onclick="gameManager.currentGame.newPuzzle()" style="background: #9c27b0; font-size: 0.9rem; padding: 8px 16px;">New Puzzle</button>
                        <button class="btn" onclick="gameManager.endGame()" style="font-size: 0.9rem; padding: 8px 16px;">Go Back</button>
                    </div>
                </div>
                
                <div class="crossword-main">
                    <div class="crossword-grid" style="grid-template-columns: repeat(${this.gridSize}, 1fr);"></div>
                    
                    <div class="crossword-clues">
                        <div class="clues-section">
                            <h4>Across</h4>
                            ${acrossWords.map((w, i) => 
                                `<div class="clue-item" data-word="${this.words.indexOf(w)}">
                                    <span class="clue-number">${this.words.indexOf(w) + 1}</span>
                                    <span class="clue-text">${w.clue}</span>
                                </div>`
                            ).join('')}
                        </div>
                        
                        <div class="clues-section">
                            <h4>Down</h4>
                            ${downWords.map((w, i) => 
                                `<div class="clue-item" data-word="${this.words.indexOf(w)}">
                                    <span class="clue-number">${this.words.indexOf(w) + 1}</span>
                                    <span class="clue-text">${w.clue}</span>
                                </div>`
                            ).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="crossword-buttons">
                    <button class="btn" onclick="gameManager.currentGame.checkAnswers()">Check</button>
                    <button class="btn" onclick="gameManager.currentGame.showHint()" style="background: #ff9800;">Hint</button>
                    <button class="btn" onclick="gameManager.currentGame.clearAll()" style="background: #f44336;">Clear</button>
                </div>
            </div>
        `;
        
        this.createGrid();
        this.setupEventListeners();
    }
    
    createGrid() {
        const grid = this.container.querySelector('.crossword-grid');
        
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                const cell = document.createElement('input');
                cell.className = 'crossword-cell';
                const cellData = this.grid[i][j];
                
                if (cellData.black) {
                    cell.classList.add('black');
                    cell.disabled = true;
                    cell.tabIndex = -1;
                } else {
                    cell.type = 'text';
                    cell.maxLength = 1;
                    cell.dataset.row = i;
                    cell.dataset.col = j;
                    cell.dataset.answer = cellData.letter;
                    
                    if (cellData.number > 0) {
                        cell.classList.add('numbered');
                        cell.dataset.number = cellData.number;
                    }
                }
                
                grid.appendChild(cell);
            }
        }
    }
    
    setupEventListeners() {
        const cells = this.container.querySelectorAll('.crossword-cell:not(.black)');
        
        cells.forEach(cell => {
            cell.addEventListener('input', (e) => {
                e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
                this.moveToNextCell(e.target);
            });
            
            cell.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value) {
                    this.moveToPrevCell(e.target);
                }
                if (e.key === 'ArrowRight') this.moveRight(e.target);
                if (e.key === 'ArrowLeft') this.moveLeft(e.target);
                if (e.key === 'ArrowDown') this.moveDown(e.target);
                if (e.key === 'ArrowUp') this.moveUp(e.target);
            });
            
            cell.addEventListener('focus', (e) => {
                e.target.style.background = '#fff3cd';
                this.currentCell = e.target;
            });
            
            cell.addEventListener('blur', (e) => {
                e.target.style.background = 'var(--card-bg)';
            });
        });
        
        // Clue click highlighting
        this.container.querySelectorAll('.clue-item').forEach(clue => {
            clue.addEventListener('click', () => {
                this.highlightWord(parseInt(clue.dataset.word));
            });
        });
    }
    
    moveToNextCell(cell) {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const nextCell = this.container.querySelector(`[data-row="${row}"][data-col="${col + 1}"]`);
        if (nextCell && !nextCell.disabled) {
            nextCell.focus();
        }
    }
    
    moveToPrevCell(cell) {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const prevCell = this.container.querySelector(`[data-row="${row}"][data-col="${col - 1}"]`);
        if (prevCell && !prevCell.disabled) {
            prevCell.focus();
        }
    }
    
    moveRight(cell) {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const nextCell = this.container.querySelector(`[data-row="${row}"][data-col="${col + 1}"]`);
        if (nextCell && !nextCell.disabled) nextCell.focus();
    }
    
    moveLeft(cell) {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const prevCell = this.container.querySelector(`[data-row="${row}"][data-col="${col - 1}"]`);
        if (prevCell && !prevCell.disabled) prevCell.focus();
    }
    
    moveDown(cell) {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const downCell = this.container.querySelector(`[data-row="${row + 1}"][data-col="${col}"]`);
        if (downCell && !downCell.disabled) downCell.focus();
    }
    
    moveUp(cell) {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const upCell = this.container.querySelector(`[data-row="${row - 1}"][data-col="${col}"]`);
        if (upCell && !upCell.disabled) upCell.focus();
    }
    
    highlightWord(wordIndex) {
        // Clear previous highlights
        this.container.querySelectorAll('.crossword-cell').forEach(cell => {
            cell.classList.remove('highlighted');
        });
        
        const word = this.words[wordIndex];
        for (let i = 0; i < word.word.length; i++) {
            const row = word.direction === 'across' ? word.row : word.row + i;
            const col = word.direction === 'across' ? word.col + i : word.col;
            const cell = this.container.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (cell) {
                cell.classList.add('highlighted');
            }
        }
    }
    
    showHint() {
        const emptyCells = this.container.querySelectorAll('.crossword-cell:not(.black)');
        const emptyCell = Array.from(emptyCells).find(cell => !cell.value);
        
        if (emptyCell) {
            emptyCell.value = emptyCell.dataset.answer;
            emptyCell.style.background = '#e3f2fd';
            emptyCell.style.color = '#1976d2';
            setTimeout(() => {
                emptyCell.style.background = 'var(--card-bg)';
                emptyCell.style.color = 'var(--text-color)';
            }, 2000);
        } else {
            alert('All letters are filled!');
        }
    }
    
    clearAll() {
        this.container.querySelectorAll('.crossword-cell:not(.black)').forEach(cell => {
            cell.value = '';
            cell.style.background = 'var(--card-bg)';
            cell.style.color = 'var(--text-color)';
            cell.classList.remove('highlighted');
        });
    }
    
    checkAnswers() {
        let correct = 0;
        let total = 0;
        
        this.container.querySelectorAll('.crossword-cell:not(.black)').forEach(cell => {
            total++;
            if (cell.value === cell.dataset.answer) {
                correct++;
                cell.style.background = '#4caf50';
                cell.style.color = 'white';
            } else if (cell.value) {
                cell.style.background = '#f44336';
                cell.style.color = 'white';
            } else {
                cell.style.background = '#ffeb3b';
                cell.style.color = '#333';
            }
        });
        
        const score = Math.floor((correct / total) * 100);
        gameManager.updateScore(score);
        
        setTimeout(() => {
            if (correct === total) {
                alert('AMAZING! Crossword completed!');
                gameManager.saveScore('crossword');
            } else {
                alert(`Score: ${score}%\nCorrect: ${correct}/${total}\n${correct === 0 ? 'Try using the Hint button!' : 'Keep going!'}`);
            }
        }, 500);
    }
    
    newPuzzle() {
        this.words = this.getWordsForDifficulty(this.difficulty);
        this.initializeGrid();
        this.placeWords();
        this.render();
    }
    
    destroy() {
        // Cleanup if needed
    }
}

gameManager.registerGame('crossword', CrosswordGame);