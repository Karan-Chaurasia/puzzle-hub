class MultiplayerMemory {
    constructor(difficulty = 'easy') {
        this.difficulty = difficulty;
        this.size = difficulty === 'easy' ? 4 : 6;
        this.cards = [];
        this.flippedCards = [];
        this.currentPlayer = 1;
        this.player1Score = 0;
        this.player2Score = 0;
        this.gameOver = false;
        this.container = null;
        this.canFlip = true;
    }
    
    init(container) {
        console.log('Initializing MP Memory with difficulty:', this.difficulty, 'size:', this.size);
        this.container = container;
        this.generateCards();
        this.render();
    }
    
    generateCards() {
        const totalCards = this.size * this.size;
        const pairs = totalCards / 2;
        const symbols = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦'];
        
        this.cards = [];
        for (let i = 0; i < pairs; i++) {
            this.cards.push(symbols[i], symbols[i]);
        }
        
        // Shuffle cards
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    
    render() {
        const gridSize = this.size === 4 ? 'min(280px, 75vw)' : 'min(350px, 80vw)';
        
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
                <div class="memory-grid" style="grid-template-columns: repeat(${this.size}, 1fr); width: ${gridSize}; height: ${gridSize};"></div>
                <div class="mp-controls">
                    <button class="mp-btn reset" onclick="gameManager.currentGame.resetGame()">New Game</button>
                    <button class="mp-btn" onclick="gameManager.endGame()">Go Back</button>
                </div>
            </div>
        `;
        
        this.createCards();
    }
    
    createCards() {
        const grid = this.container.querySelector('.memory-grid');
        grid.innerHTML = '';
        
        this.cards.forEach((symbol, index) => {
            const card = document.createElement('button');
            card.className = 'memory-card';
            card.dataset.index = index;
            card.textContent = '?';
            card.addEventListener('click', () => this.flipCard(index));
            grid.appendChild(card);
        });
    }
    
    flipCard(index) {
        if (!this.canFlip || this.gameOver) return;
        
        const card = this.container.querySelector(`[data-index="${index}"]`);
        if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
        
        card.classList.add('flipped');
        card.textContent = this.cards[index];
        card.style.background = '#fff';
        card.style.color = '#333';
        card.disabled = true;
        
        this.flippedCards.push(index);
        
        if (this.flippedCards.length === 2) {
            this.canFlip = false;
            setTimeout(() => this.checkMatch(), 1200);
        }
    }
    
    checkMatch() {
        const [index1, index2] = this.flippedCards;
        const card1 = this.container.querySelector(`[data-index="${index1}"]`);
        const card2 = this.container.querySelector(`[data-index="${index2}"]`);
        
        if (this.cards[index1] === this.cards[index2]) {
            // Match found
            card1.classList.add('matched');
            card2.classList.add('matched');
            card1.style.background = '#4caf50';
            card2.style.background = '#4caf50';
            
            if (this.currentPlayer === 1) {
                this.player1Score++;
            } else {
                this.player2Score++;
            }
            
            // Player gets another turn for finding a match
        } else {
            // No match - flip cards back
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '?';
            card2.textContent = '?';
            card1.style.background = 'var(--accent-color)';
            card2.style.background = 'var(--accent-color)';
            card1.style.color = 'white';
            card2.style.color = 'white';
            card1.disabled = false;
            card2.disabled = false;
            
            // Switch players
            this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        }
        
        this.flippedCards = [];
        this.canFlip = true;
        
        // Check if game is over
        if (this.container.querySelectorAll('.memory-card.matched').length === this.cards.length) {
            this.gameOver = true;
        }
        
        this.updateDisplay();
    }
    
    updateDisplay() {
        const player1 = this.container.querySelector('.player1');
        const player2 = this.container.querySelector('.player2');
        const status = this.container.querySelector('.game-status');
        
        player1.classList.toggle('active', this.currentPlayer === 1 && !this.gameOver);
        player2.classList.toggle('active', this.currentPlayer === 2 && !this.gameOver);
        
        // Update scores
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
        this.currentPlayer = 1;
        this.player1Score = 0;
        this.player2Score = 0;
        this.gameOver = false;
        this.flippedCards = [];
        this.canFlip = true;
        this.generateCards();
        this.render();
    }
    
    destroy() {}
}

gameManager.registerGame('mp-memory', MultiplayerMemory);