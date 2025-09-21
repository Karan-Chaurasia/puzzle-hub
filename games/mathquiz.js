class MathQuizGame {
    constructor(difficulty = 'easy') {
        this.difficulty = difficulty;
        this.currentQuestion = 0;
        this.totalQuestions = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 10;
        this.correctAnswers = 0;
        this.questions = [];
        this.container = null;
    }
    
    init(container) {
        this.container = container;
        this.generateQuestions();
        this.currentQuestion = 0;
        this.correctAnswers = 0;
        this.showQuestion();
    }
    
    generateQuestions() {
        this.questions = [];
        let operations, maxNum1, maxNum2;
        
        if (this.difficulty === 'easy') {
            operations = ['+', '-'];
            maxNum1 = 20;
            maxNum2 = 10;
        } else if (this.difficulty === 'medium') {
            operations = ['+', '-', '*'];
            maxNum1 = 50;
            maxNum2 = 20;
        } else {
            operations = ['+', '-', '*', '/'];
            maxNum1 = 100;
            maxNum2 = 25;
        }
        
        for (let i = 0; i < this.totalQuestions; i++) {
            const operation = operations[Math.floor(Math.random() * operations.length)];
            let num1, num2, answer;
            
            switch (operation) {
                case '+':
                    num1 = Math.floor(Math.random() * maxNum1) + 1;
                    num2 = Math.floor(Math.random() * maxNum2) + 1;
                    answer = num1 + num2;
                    break;
                case '-':
                    num1 = Math.floor(Math.random() * maxNum1) + maxNum2;
                    num2 = Math.floor(Math.random() * maxNum2) + 1;
                    answer = num1 - num2;
                    break;
                case '*':
                    num1 = Math.floor(Math.random() * 12) + 1;
                    num2 = Math.floor(Math.random() * 12) + 1;
                    answer = num1 * num2;
                    break;
                case '/':
                    answer = Math.floor(Math.random() * 12) + 1;
                    num2 = Math.floor(Math.random() * 12) + 1;
                    num1 = answer * num2;
                    break;
            }
            
            const wrongAnswers = this.generateWrongAnswers(answer);
            const options = [answer, ...wrongAnswers].sort(() => Math.random() - 0.5);
            
            this.questions.push({
                question: `${num1} ${operation} ${num2} = ?`,
                options: options,
                correct: answer
            });
        }
    }
    
    generateWrongAnswers(correct) {
        const wrong = [];
        while (wrong.length < 3) {
            const offset = Math.floor(Math.random() * 20) - 10;
            const wrongAnswer = correct + offset;
            if (wrongAnswer !== correct && wrongAnswer > 0 && !wrong.includes(wrongAnswer)) {
                wrong.push(wrongAnswer);
            }
        }
        return wrong;
    }
    
    showQuestion() {
        if (this.currentQuestion >= this.totalQuestions) {
            this.showResults();
            return;
        }
        
        const question = this.questions[this.currentQuestion];
        
        this.container.innerHTML = `
            <div class="mathquiz-container">
                <div class="mathquiz-info">
                    <div>Question ${this.currentQuestion + 1} of ${this.totalQuestions}</div>
                    <button class="btn" onclick="gameManager.endGame()" style="padding: 8px 16px; font-size: 0.9rem;">Go Back</button>
                </div>
                <div class="mathquiz-question">${question.question}</div>
                <div class="mathquiz-options">
                    ${question.options.map(option => 
                        `<button class="mathquiz-option" onclick="gameManager.currentGame.selectAnswer(${option})">${option}</button>`
                    ).join('')}
                </div>
            </div>
        `;
        
        // Store reference for answer selection
        this.container.querySelector('.quiz-container').mathQuiz = this;
    }
    
    selectAnswer(selectedAnswer) {
        const question = this.questions[this.currentQuestion];
        const options = this.container.querySelectorAll('.quiz-option');
        
        options.forEach(option => {
            const value = parseInt(option.textContent);
            if (value === question.correct) {
                option.classList.add('correct');
            } else if (value === selectedAnswer && value !== question.correct) {
                option.classList.add('incorrect');
            }
            option.disabled = true;
        });
        
        if (selectedAnswer === question.correct) {
            this.correctAnswers++;
            gameManager.updateScore(10);
        }
        
        setTimeout(() => {
            this.currentQuestion++;
            this.showQuestion();
        }, 1500);
    }
    
    showResults() {
        const percentage = Math.round((this.correctAnswers / this.totalQuestions) * 100);
        
        const message = percentage >= 80 ? '🎉 Excellent work!' : percentage >= 60 ? '👍 Good job!' : '💪 Keep practicing!';
        
        this.container.innerHTML = `
            <div class="mathquiz-container">
                <div class="mathquiz-results">
                    <h3>${message}</h3>
                    <div class="mathquiz-question">Quiz Complete!</div>
                    <div class="result-stats">
                        <p>✅ Correct: ${this.correctAnswers}/${this.totalQuestions}</p>
                        <p>📊 Score: ${percentage}%</p>
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
                        <button class="btn" onclick="gameManager.currentGame.restart()">Play Again</button>
                        <button class="btn" onclick="gameManager.endGame()">Go Back</button>
                    </div>
                </div>
            </div>
        `;
        
        // Store reference for restart
        this.container.querySelector('.quiz-results').mathQuiz = this;
        
        gameManager.saveScore('mathquiz');
    }
    
    restart() {
        this.init(this.container);
    }
    
    destroy() {
        // Cleanup if needed
    }
}

gameManager.registerGame('mathquiz', MathQuizGame);