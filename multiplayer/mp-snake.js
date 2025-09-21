class MultiplayerSnake {
    constructor(difficulty = 'easy') {
        this.canvas = null;
        this.ctx = null;
        this.gameLoop = null;
        this.container = null;
        
        this.gridSize = 16;
        this.canvasSize = 320;
        
        this.snake1 = [{ x: 100, y: 200 }];
        this.snake2 = [{ x: 300, y: 200 }];
        this.direction1 = { x: 20, y: 0 };
        this.direction2 = { x: -20, y: 0 };
        this.food = this.generateFood();
        
        this.score1 = 0;
        this.score2 = 0;
        this.gameOver = false;
        this.winner = null;
        
        this.keys = {};
    }
    
    init(container) {
        this.container = container;
        this.render();
        this.setupControls();
        this.startGame();
    }
    
    render() {
        this.container.innerHTML = `
            <div class="mp-game-container">
                <div class="player-info">
                    <div class="player player1">
                        <div class="player-name">Player 1</div>
                        <div class="player-score">${this.score1}</div>
                    </div>
                    <div class="game-status">${this.getStatusText()}</div>
                    <div class="player player2">
                        <div class="player-name">Player 2</div>
                        <div class="player-score">${this.score2}</div>
                    </div>
                </div>
                
                <div class="snake-container">
                    <canvas id="mp-snake-canvas" width="320" height="320"></canvas>
                    <div class="snake-controls">
                        <div class="control-info">
                            <div>Player 1: WASD keys</div>
                            <div>Player 2: Arrow keys</div>
                        </div>
                    </div>
                </div>
                
                <div class="mp-controls">
                    <button class="mp-btn" onclick="gameManager.currentGame.pauseResume()">${this.gameLoop ? 'Pause' : 'Resume'}</button>
                    <button class="mp-btn reset" onclick="gameManager.currentGame.resetGame()">New Game</button>
                    <button class="mp-btn" onclick="gameManager.endGame()">Go Back</button>
                </div>
            </div>
        `;
        
        this.canvas = this.container.querySelector('#mp-snake-canvas');
        this.ctx = this.canvas.getContext('2d');
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            this.handleInput(e.key.toLowerCase());
        });
    }
    
    handleInput(key) {
        // Player 1 controls (WASD)
        if (key === 'w' && this.direction1.y === 0) this.direction1 = { x: 0, y: -16 };
        if (key === 's' && this.direction1.y === 0) this.direction1 = { x: 0, y: 16 };
        if (key === 'a' && this.direction1.x === 0) this.direction1 = { x: -16, y: 0 };
        if (key === 'd' && this.direction1.x === 0) this.direction1 = { x: 16, y: 0 };
        
        // Player 2 controls (Arrow keys)
        if (key === 'arrowup' && this.direction2.y === 0) this.direction2 = { x: 0, y: -16 };
        if (key === 'arrowdown' && this.direction2.y === 0) this.direction2 = { x: 0, y: 16 };
        if (key === 'arrowleft' && this.direction2.x === 0) this.direction2 = { x: -16, y: 0 };
        if (key === 'arrowright' && this.direction2.x === 0) this.direction2 = { x: 16, y: 0 };
    }
    
    startGame() {
        if (this.gameLoop) return;
        
        this.gameLoop = setInterval(() => {
            this.update();
            this.draw();
        }, 150);
    }
    
    update() {
        if (this.gameOver) return;
        
        // Move snakes
        const head1 = { x: this.snake1[0].x + this.direction1.x, y: this.snake1[0].y + this.direction1.y };
        const head2 = { x: this.snake2[0].x + this.direction2.x, y: this.snake2[0].y + this.direction2.y };
        
        // Check wall collisions
        if (this.checkWallCollision(head1) || this.checkWallCollision(head2)) {
            this.endGame();
            return;
        }
        
        // Check self collisions
        if (this.checkSelfCollision(head1, this.snake1) || this.checkSelfCollision(head2, this.snake2)) {
            this.endGame();
            return;
        }
        
        // Check snake-to-snake collisions
        if (this.checkSnakeCollision(head1, this.snake2) || this.checkSnakeCollision(head2, this.snake1)) {
            this.endGame();
            return;
        }
        
        // Check head-to-head collision
        if (head1.x === head2.x && head1.y === head2.y) {
            this.endGame();
            return;
        }
        
        this.snake1.unshift(head1);
        this.snake2.unshift(head2);
        
        // Check food collision
        let snake1AteFood = head1.x === this.food.x && head1.y === this.food.y;
        let snake2AteFood = head2.x === this.food.x && head2.y === this.food.y;
        
        if (snake1AteFood || snake2AteFood) {
            if (snake1AteFood) this.score1++;
            if (snake2AteFood) this.score2++;
            this.food = this.generateFood();
        } else {
            this.snake1.pop();
            this.snake2.pop();
        }
        
        this.updateScoreDisplay();
    }
    
    checkWallCollision(head) {
        return head.x < 0 || head.x >= this.canvasSize || head.y < 0 || head.y >= this.canvasSize;
    }
    
    checkSelfCollision(head, snake) {
        return snake.some(segment => segment.x === head.x && segment.y === head.y);
    }
    
    checkSnakeCollision(head, otherSnake) {
        return otherSnake.some(segment => segment.x === head.x && segment.y === head.y);
    }
    
    generateFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * (this.canvasSize / this.gridSize)) * this.gridSize,
                y: Math.floor(Math.random() * (this.canvasSize / this.gridSize)) * this.gridSize
            };
        } while (this.snake1.some(s => s.x === food.x && s.y === food.y) || 
                 this.snake2.some(s => s.x === food.x && s.y === food.y));
        return food;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);
        
        // Draw grid
        this.ctx.strokeStyle = '#333';
        for (let i = 0; i <= this.canvasSize; i += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.canvasSize);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.canvasSize, i);
            this.ctx.stroke();
        }
        
        // Draw snake 1 (blue)
        this.ctx.fillStyle = '#2196f3';
        this.snake1.forEach(segment => {
            this.ctx.fillRect(segment.x, segment.y, this.gridSize - 2, this.gridSize - 2);
        });
        
        // Draw snake 2 (red)
        this.ctx.fillStyle = '#f44336';
        this.snake2.forEach(segment => {
            this.ctx.fillRect(segment.x, segment.y, this.gridSize - 2, this.gridSize - 2);
        });
        
        // Draw food
        this.ctx.fillStyle = '#4caf50';
        this.ctx.fillRect(this.food.x, this.food.y, this.gridSize - 2, this.gridSize - 2);
    }
    
    updateScoreDisplay() {
        const player1Score = this.container.querySelector('.player1 .player-score');
        const player2Score = this.container.querySelector('.player2 .player-score');
        
        if (player1Score) player1Score.textContent = this.score1;
        if (player2Score) player2Score.textContent = this.score2;
    }
    
    endGame() {
        this.gameOver = true;
        this.stopGame();
        
        if (this.score1 > this.score2) {
            this.winner = 1;
        } else if (this.score2 > this.score1) {
            this.winner = 2;
        }
        
        const status = this.container.querySelector('.game-status');
        if (status) status.textContent = this.getStatusText();
    }
    
    getStatusText() {
        if (this.gameOver) {
            if (this.winner) {
                return `Player ${this.winner} Wins!`;
            } else {
                return `It's a Tie!`;
            }
        } else {
            return `Eat the green food!`;
        }
    }
    
    pauseResume() {
        if (this.gameLoop) {
            this.stopGame();
        } else {
            this.startGame();
        }
        
        const btn = this.container.querySelector('.mp-controls .mp-btn:not(.reset)');
        if (btn) {
            btn.textContent = this.gameLoop ? 'Pause' : 'Resume';
        }
    }
    
    stopGame() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }
    
    resetGame() {
        this.stopGame();
        this.snake1 = [{ x: 100, y: 200 }];
        this.snake2 = [{ x: 300, y: 200 }];
        this.direction1 = { x: 20, y: 0 };
        this.direction2 = { x: -20, y: 0 };
        this.food = this.generateFood();
        this.score1 = 0;
        this.score2 = 0;
        this.gameOver = false;
        this.winner = null;
        this.render();
        this.setupControls();
        this.startGame();
    }
    
    destroy() {
        this.stopGame();
    }
}

gameManager.registerGame('mp-snake', MultiplayerSnake);