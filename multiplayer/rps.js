class RockPaperScissors {
    constructor(difficulty = 'easy') {
        this.maxRounds = 5;
        this.currentRound = 1;
        this.player1Score = 0;
        this.player2Score = 0;
        this.player1Choice = null;
        this.player2Choice = null;
        this.gameOver = false;
        this.winner = null;
        this.container = null;
        this.roundResult = '';
    }
    
    init(container) {
        this.container = container;
        this.render();
    }
    
    render() {
        this.container.innerHTML = `
            <div class="mp-game-container">
                <div class="player-info">
                    <div class="player player1">
                        <div class="player-name">Player 1</div>
                        <div class="player-score">${this.player1Score}</div>
                    </div>
                    <div class="game-status">Round ${this.currentRound} of ${this.maxRounds}</div>
                    <div class="player player2">
                        <div class="player-name">Player 2</div>
                        <div class="player-score">${this.player2Score}</div>
                    </div>
                </div>
                
                <div class="rps-game">
                    <div class="rps-choices">
                        <div class="rps-player-section">
                            <h3>Player 1</h3>
                            <div class="rps-choice-display">${this.getChoiceDisplay(this.player1Choice)}</div>
                            <div class="rps-buttons">
                                <button class="rps-btn" data-choice="rock" data-player="1">🪨</button>
                                <button class="rps-btn" data-choice="paper" data-player="1">📄</button>
                                <button class="rps-btn" data-choice="scissors" data-player="1">✂️</button>
                            </div>
                        </div>
                        
                        <div class="rps-vs">VS</div>
                        
                        <div class="rps-player-section">
                            <h3>Player 2</h3>
                            <div class="rps-choice-display">${this.getChoiceDisplay(this.player2Choice)}</div>
                            <div class="rps-buttons">
                                <button class="rps-btn" data-choice="rock" data-player="2">🪨</button>
                                <button class="rps-btn" data-choice="paper" data-player="2">📄</button>
                                <button class="rps-btn" data-choice="scissors" data-player="2">✂️</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="rps-result">${this.roundResult}</div>
                    
                    <div class="mp-controls">
                        ${this.gameOver ? 
                            `<button class="mp-btn reset" onclick="gameManager.currentGame.resetGame()">New Game</button>` :
                            `<button class="mp-btn" onclick="gameManager.currentGame.nextRound()" ${!this.canProceed() ? 'disabled' : ''}>Next Round</button>`
                        }
                        <button class="mp-btn" onclick="gameManager.endGame()">Go Back</button>
                    </div>
                </div>
            </div>
        `;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.container.querySelectorAll('.rps-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const choice = e.target.dataset.choice;
                const player = parseInt(e.target.dataset.player);
                this.makeChoice(player, choice);
            });
        });
    }
    
    makeChoice(player, choice) {
        if (this.gameOver) return;
        
        if (player === 1) {
            this.player1Choice = choice;
        } else {
            this.player2Choice = choice;
        }
        
        // Update display
        const choiceDisplay = this.container.querySelector(`.rps-player-section:nth-child(${player === 1 ? 1 : 3}) .rps-choice-display`);
        choiceDisplay.textContent = this.getChoiceDisplay(choice);
        
        // Disable buttons for this player
        this.container.querySelectorAll(`[data-player="${player}"]`).forEach(btn => {
            btn.disabled = true;
            if (btn.dataset.choice === choice) {
                btn.style.background = '#4caf50';
            }
        });
        
        // Check if both players have chosen
        if (this.player1Choice && this.player2Choice) {
            this.evaluateRound();
        }
        
        this.updateNextButton();
    }
    
    evaluateRound() {
        const result = this.getWinner(this.player1Choice, this.player2Choice);
        
        if (result === 1) {
            this.player1Score++;
            this.roundResult = `Player 1 wins this round!`;
        } else if (result === 2) {
            this.player2Score++;
            this.roundResult = `Player 2 wins this round!`;
        } else {
            this.roundResult = `This round is a tie!`;
        }
        
        // Update result display
        this.container.querySelector('.rps-result').textContent = this.roundResult;
        
        // Check if game is over
        if (this.currentRound >= this.maxRounds) {
            this.endGame();
        }
    }
    
    getWinner(choice1, choice2) {
        if (choice1 === choice2) return 0; // Tie
        
        const winConditions = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper'
        };
        
        return winConditions[choice1] === choice2 ? 1 : 2;
    }
    
    getChoiceDisplay(choice) {
        if (!choice) return '❓';
        const displays = {
            rock: '🪨',
            paper: '📄',
            scissors: '✂️'
        };
        return displays[choice];
    }
    
    canProceed() {
        return this.player1Choice && this.player2Choice && !this.gameOver;
    }
    
    nextRound() {
        if (!this.canProceed()) return;
        
        this.currentRound++;
        this.player1Choice = null;
        this.player2Choice = null;
        this.roundResult = '';
        this.render();
    }
    
    updateNextButton() {
        const nextBtn = this.container.querySelector('.mp-controls .mp-btn:not(.reset)');
        if (nextBtn) {
            nextBtn.disabled = !this.canProceed();
        }
    }
    
    endGame() {
        this.gameOver = true;
        
        if (this.player1Score > this.player2Score) {
            this.winner = 1;
            this.roundResult = `🎉 Player 1 Wins the Game! (${this.player1Score}-${this.player2Score})`;
        } else if (this.player2Score > this.player1Score) {
            this.winner = 2;
            this.roundResult = `🎉 Player 2 Wins the Game! (${this.player2Score}-${this.player1Score})`;
        } else {
            this.roundResult = `🤝 It's a Tie Game! (${this.player1Score}-${this.player2Score})`;
        }
        
        this.render();
    }
    
    resetGame() {
        this.currentRound = 1;
        this.player1Score = 0;
        this.player2Score = 0;
        this.player1Choice = null;
        this.player2Choice = null;
        this.gameOver = false;
        this.winner = null;
        this.roundResult = '';
        this.render();
    }
    
    destroy() {}
}

gameManager.registerGame('rps', RockPaperScissors);