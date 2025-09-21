class SnakeGame {
    constructor(difficulty = 'easy') {
        this.difficulty = difficulty;
        this.speed = difficulty === 'easy' ? 180 : difficulty === 'medium' ? 120 : 80;
        this.gridSize = 20;
        this.snake = [{x: 10, y: 10}];
        this.food = this.generateFood();
        this.direction = {x: 1, y: 0};
        this.nextDirection = {x: 1, y: 0};
        this.gameRunning = false;
        this.container = null;
        this.gameLoop = null;
        this.score = 0;
    }
    
    init(container) {
        this.container = container;
        this.render();
        this.setupControls();
    }
    
    render() {
        this.container.innerHTML = `
            <div class="snake-container">
                <div class="snake-info">
                    <div>Score: <span id="snake-score">0</span> | Length: <span id="snake-length">1</span></div>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn" onclick="gameManager.currentGame.startGame()" style="padding: 8px 16px; font-size: 0.9rem;">Start Game</button>
                        <button class="btn" onclick="gameManager.endGame()" style="padding: 8px 16px; font-size: 0.9rem;">Go Back</button>
                    </div>
                </div>
                <canvas id="snake-canvas" width="400" height="400"></canvas>
                <div class="snake-controls">
                    <div style="text-align: center; color: var(--accent-color); font-weight: bold; margin-top: 10px; line-height: 1.4;">
                        🎮 Controls: WASD or Arrow Keys<br>
                        <small>SPACE: Pause/Resume | ENTER: Start Game</small>
                    </div>
                </div>
            </div>
        `;
        
        this.canvas = this.container.querySelector('#snake-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Add roundRect polyfill for older browsers
        if (!this.ctx.roundRect) {
            this.ctx.roundRect = function(x, y, width, height, radius) {
                this.beginPath();
                this.moveTo(x + radius, y);
                this.lineTo(x + width - radius, y);
                this.quadraticCurveTo(x + width, y, x + width, y + radius);
                this.lineTo(x + width, y + height - radius);
                this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                this.lineTo(x + radius, y + height);
                this.quadraticCurveTo(x, y + height, x, y + height - radius);
                this.lineTo(x, y + radius);
                this.quadraticCurveTo(x, y, x + radius, y);
                this.closePath();
            };
        }
        
        this.draw();
    }
    
    setupControls() {
        this.keyHandler = (e) => {
            if (!this.gameRunning) {
                if (e.key.toLowerCase() === ' ' || e.key === 'Enter') {
                    this.startGame();
                }
                return;
            }
            e.preventDefault();
            switch(e.key.toLowerCase()) {
                case 'w': case 'arrowup': this.changeDirection('up'); break;
                case 's': case 'arrowdown': this.changeDirection('down'); break;
                case 'a': case 'arrowleft': this.changeDirection('left'); break;
                case 'd': case 'arrowright': this.changeDirection('right'); break;
                case ' ': this.pauseGame(); break;
            }
        };
        document.addEventListener('keydown', this.keyHandler);
    }
    
    changeDirection(dir) {
        if (!this.gameRunning) return;
        
        const directions = {
            up: {x: 0, y: -1},
            down: {x: 0, y: 1},
            left: {x: -1, y: 0},
            right: {x: 1, y: 0}
        };
        
        const newDir = directions[dir];
        if (newDir.x !== -this.direction.x || newDir.y !== -this.direction.y) {
            this.nextDirection = newDir;
        }
    }
    
    startGame() {
        this.gameRunning = true;
        this.snake = [{x: 10, y: 10}];
        this.food = this.generateFood();
        this.direction = {x: 1, y: 0};
        this.nextDirection = {x: 1, y: 0};
        this.score = 0;
        gameManager.updateScore(-gameManager.currentScore);
        
        this.container.querySelector('.btn').textContent = 'Pause';
        this.gameLoop = setInterval(() => this.update(), this.speed);
    }
    
    update() {
        this.direction = this.nextDirection;
        const head = {x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y};
        
        if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize ||
            this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }
        
        this.snake.unshift(head);
        
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            gameManager.updateScore(10);
            this.food = this.generateFood();
            
            // Update UI
            this.container.querySelector('#snake-score').textContent = this.score;
            this.container.querySelector('#snake-length').textContent = this.snake.length;
            
            // Increase speed slightly
            if (this.snake.length % 5 === 0) {
                clearInterval(this.gameLoop);
                this.speed = Math.max(this.speed - 5, 60);
                this.gameLoop = setInterval(() => this.update(), this.speed);
            }
        } else {
            this.snake.pop();
        }
        
        this.draw();
    }
    
    generateFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * this.gridSize),
                y: Math.floor(Math.random() * this.gridSize)
            };
        } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
        return food;
    }
    
    draw() {
        const cellSize = this.canvas.width / this.gridSize;
        
        // Clear canvas with gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#e8f5e8');
        gradient.addColorStop(1, '#f0f8f0');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw snake with gradient and rounded corners
        this.snake.forEach((segment, index) => {
            const x = segment.x * cellSize + 1;
            const y = segment.y * cellSize + 1;
            const size = cellSize - 2;
            
            if (index === 0) {
                // Snake head
                this.ctx.fillStyle = '#2e7d32';
                this.ctx.beginPath();
                this.ctx.roundRect(x, y, size, size, 4);
                this.ctx.fill();
                
                // Eyes
                this.ctx.fillStyle = '#fff';
                this.ctx.beginPath();
                this.ctx.arc(x + size * 0.3, y + size * 0.3, 2, 0, Math.PI * 2);
                this.ctx.arc(x + size * 0.7, y + size * 0.3, 2, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                // Snake body
                this.ctx.fillStyle = index % 2 === 0 ? '#4caf50' : '#66bb6a';
                this.ctx.beginPath();
                this.ctx.roundRect(x, y, size, size, 2);
                this.ctx.fill();
            }
        });
        
        // Draw food with pulsing effect
        const foodX = this.food.x * cellSize + 1;
        const foodY = this.food.y * cellSize + 1;
        const foodSize = cellSize - 2;
        const pulse = Math.sin(Date.now() * 0.01) * 2 + foodSize;
        
        this.ctx.fillStyle = '#ff5722';
        this.ctx.beginPath();
        this.ctx.roundRect(foodX - (pulse - foodSize) / 2, foodY - (pulse - foodSize) / 2, pulse, pulse, 4);
        this.ctx.fill();
    }
    
    gameOver() {
        this.gameRunning = false;
        clearInterval(this.gameLoop);
        this.container.querySelector('.btn').textContent = 'Start Game';
        
        // Flash effect
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        setTimeout(() => {
            alert(`Game Over! Final Score: ${this.score}`);
            gameManager.saveScore('snake');
        }, 100);
    }
    
    pauseGame() {
        if (this.gameRunning) {
            clearInterval(this.gameLoop);
            this.gameRunning = false;
            this.container.querySelector('.btn').textContent = 'Resume';
        } else {
            this.gameRunning = true;
            this.container.querySelector('.btn').textContent = 'Pause';
            this.gameLoop = setInterval(() => this.update(), this.speed);
        }
    }
    
    destroy() {
        if (this.gameLoop) clearInterval(this.gameLoop);
        if (this.keyHandler) document.removeEventListener('keydown', this.keyHandler);
        this.gameRunning = false;
    }
}

gameManager.registerGame('snake', SnakeGame);