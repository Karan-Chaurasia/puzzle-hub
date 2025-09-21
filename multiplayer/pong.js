class Pong {
    constructor(difficulty = 'easy') {
        this.canvas = null;
        this.ctx = null;
        this.gameLoop = null;
        this.container = null;
        
        this.ball = { x: 140, y: 80, dx: 2.5, dy: 1.5, size: 4 };
        this.paddle1 = { x: 8, y: 60, width: 8, height: 30, dy: 0 };
        this.paddle2 = { x: 264, y: 60, width: 8, height: 30, dy: 0 };
        this.score1 = 0;
        this.score2 = 0;
        this.gameOver = false;
        this.maxScore = 5;
        
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
                
                <div class="pong-container">
                    <canvas id="pong-canvas" width="280" height="160"></canvas>
                    <div class="pong-controls">
                        <div class="control-info">
                            <div>Player 1: W/S keys</div>
                            <div>Player 2: ↑/↓ keys</div>
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
        
        this.canvas = this.container.querySelector('#pong-canvas');
        this.ctx = this.canvas.getContext('2d');
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }
    
    startGame() {
        if (this.gameLoop) return;
        
        this.gameLoop = setInterval(() => {
            this.update();
            this.draw();
        }, 1000 / 60); // 60 FPS
    }
    
    update() {
        if (this.gameOver) return;
        
        // Paddle controls
        if (this.keys['w'] && this.paddle1.y > 0) {
            this.paddle1.y -= 3;
        }
        if (this.keys['s'] && this.paddle1.y < 130) {
            this.paddle1.y += 3;
        }
        if (this.keys['arrowup'] && this.paddle2.y > 0) {
            this.paddle2.y -= 3;
        }
        if (this.keys['arrowdown'] && this.paddle2.y < 130) {
            this.paddle2.y += 3;
        }
        
        // Ball movement
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        
        // Ball collision with top/bottom walls
        if (this.ball.y <= 0 || this.ball.y >= 160) {
            this.ball.dy = -this.ball.dy;
        }
        
        // Ball collision with paddles
        if (this.ball.x <= this.paddle1.x + this.paddle1.width &&
            this.ball.y >= this.paddle1.y &&
            this.ball.y <= this.paddle1.y + this.paddle1.height) {
            this.ball.dx = -this.ball.dx;
            this.ball.x = this.paddle1.x + this.paddle1.width;
        }
        
        if (this.ball.x >= this.paddle2.x - this.ball.size &&
            this.ball.y >= this.paddle2.y &&
            this.ball.y <= this.paddle2.y + this.paddle2.height) {
            this.ball.dx = -this.ball.dx;
            this.ball.x = this.paddle2.x - this.ball.size;
        }
        
        // Scoring
        if (this.ball.x < 0) {
            this.score2++;
            this.resetBall();
        } else if (this.ball.x > 280) {
            this.score1++;
            this.resetBall();
        }
        
        // Check for game over
        if (this.score1 >= this.maxScore || this.score2 >= this.maxScore) {
            this.gameOver = true;
            this.stopGame();
        }
        
        this.updateScoreDisplay();
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, 280, 160);
        
        // Draw center line
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(140, 0);
        this.ctx.lineTo(140, 160);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // Draw paddles
        this.ctx.fillStyle = '#2196f3';
        this.ctx.fillRect(this.paddle1.x, this.paddle1.y, this.paddle1.width, this.paddle1.height);
        
        this.ctx.fillStyle = '#f44336';
        this.ctx.fillRect(this.paddle2.x, this.paddle2.y, this.paddle2.width, this.paddle2.height);
        
        // Draw ball
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    resetBall() {
        this.ball.x = 140;
        this.ball.y = 80;
        this.ball.dx = (Math.random() > 0.5 ? 1 : -1) * 2.5;
        this.ball.dy = (Math.random() - 0.5) * 3.5;
    }
    
    updateScoreDisplay() {
        const player1Score = this.container.querySelector('.player1 .player-score');
        const player2Score = this.container.querySelector('.player2 .player-score');
        const status = this.container.querySelector('.game-status');
        
        if (player1Score) player1Score.textContent = this.score1;
        if (player2Score) player2Score.textContent = this.score2;
        if (status) status.textContent = this.getStatusText();
    }
    
    getStatusText() {
        if (this.gameOver) {
            if (this.score1 > this.score2) {
                return `Player 1 Wins!`;
            } else {
                return `Player 2 Wins!`;
            }
        } else {
            return `First to ${this.maxScore} wins`;
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
        this.ball = { x: 140, y: 80, dx: 2.5, dy: 1.5, size: 4 };
        this.paddle1 = { x: 8, y: 60, width: 8, height: 30, dy: 0 };
        this.paddle2 = { x: 264, y: 60, width: 8, height: 30, dy: 0 };
        this.score1 = 0;
        this.score2 = 0;
        this.gameOver = false;
        this.render();
        this.setupControls();
        this.startGame();
    }
    
    destroy() {
        this.stopGame();
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
    }
}

gameManager.registerGame('pong', Pong);