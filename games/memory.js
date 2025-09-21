class MemoryGame {
    constructor(difficulty = 'easy') {
        this.difficulty = difficulty;
        this.size = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
        this.cards = [];
        this.flipped = [];
        this.matched = [];
        this.moves = 0;
        this.container = null;
    }
    
    init(container) {
        this.container = container;
        this.generateCards();
        this.render();
    }
    
    generateCards() {
        const symbols = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎪', '🎸', '🎺', '🎻', '🎹', '🎤', '🎧', '🎬', '🎥', '📱'];
        const pairs = this.size * this.size / 2;
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
        this.container.innerHTML = `
            <div class="memory-container">
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <div class="memory-info">Moves: <span id="memory-moves">0</span></div>
                    <button class="btn" onclick="gameManager.endGame()">Go Back</button>
                </div>
                <div class="memory-grid" style="grid-template-columns: repeat(${this.size}, 1fr);">
                    ${this.cards.map((card, i) => 
                        `<button class="memory-card" data-index="${i}">?</button>`
                    ).join('')}
                </div>
            </div>
        `;
        
        this.container.querySelectorAll('.memory-card').forEach(card => {
            card.addEventListener('click', (e) => this.flipCard(parseInt(e.target.dataset.index)));
        });
    }
    
    flipCard(index) {
        if (this.flipped.length >= 2 || this.flipped.includes(index) || this.matched.includes(index)) {
            return;
        }
        
        const card = this.container.querySelector(`[data-index="${index}"]`);
        card.style.transform = 'rotateY(90deg)';
        
        setTimeout(() => {
            this.flipped.push(index);
            card.textContent = this.cards[index];
            card.style.background = '#fff';
            card.style.color = '#333';
            card.style.transform = 'rotateY(0deg)';
            card.disabled = true;
            
            if (this.flipped.length === 2) {
                this.moves++;
                this.container.querySelector('#memory-moves').textContent = this.moves;
                
                setTimeout(() => this.checkMatch(), 1200);
            }
        }, 150);
    }
    
    checkMatch() {
        const [first, second] = this.flipped;
        const card1 = this.container.querySelector(`[data-index="${first}"]`);
        const card2 = this.container.querySelector(`[data-index="${second}"]`);
        
        if (this.cards[first] === this.cards[second]) {
            this.matched.push(first, second);
            card1.style.background = '#4caf50';
            card2.style.background = '#4caf50';
            card1.style.transform = 'scale(1.1)';
            card2.style.transform = 'scale(1.1)';
            
            setTimeout(() => {
                card1.style.transform = 'scale(1)';
                card2.style.transform = 'scale(1)';
            }, 300);
            
            gameManager.updateScore(10);
            
            if (this.matched.length === this.cards.length) {
                const bonus = Math.max(100 - this.moves * 2, 20);
                gameManager.updateScore(bonus);
                setTimeout(() => {
                    alert(`Congratulations! 🎉 Completed in ${this.moves} moves!`);
                    gameManager.saveScore('memory');
                }, 500);
            }
        } else {
            card1.style.transform = 'rotateY(90deg)';
            card2.style.transform = 'rotateY(90deg)';
            
            setTimeout(() => {
                card1.textContent = '?';
                card2.textContent = '?';
                card1.style.background = 'var(--accent-color)';
                card2.style.background = 'var(--accent-color)';
                card1.style.color = 'white';
                card2.style.color = 'white';
                card1.style.transform = 'rotateY(0deg)';
                card2.style.transform = 'rotateY(0deg)';
                card1.disabled = false;
                card2.disabled = false;
            }, 150);
        }
        
        this.flipped = [];
    }
    
    destroy() {}
}

gameManager.registerGame('memory', MemoryGame);