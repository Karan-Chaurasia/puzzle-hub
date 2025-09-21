class Storage {
    static getScore(game) {
        const scores = JSON.parse(localStorage.getItem('puzzleHubScores') || '{}');
        return scores[game] || 0;
    }
    
    static setScore(game, score) {
        const scores = JSON.parse(localStorage.getItem('puzzleHubScores') || '{}');
        scores[game] = Math.max(scores[game] || 0, score);
        localStorage.setItem('puzzleHubScores', JSON.stringify(scores));
    }
    
    static getAllScores() {
        return JSON.parse(localStorage.getItem('puzzleHubScores') || '{}');
    }
    
    static getTheme() {
        return localStorage.getItem('puzzleHubTheme') || 'light';
    }
    
    static setTheme(theme) {
        localStorage.setItem('puzzleHubTheme', theme);
    }
    
    static setCompleted(game, difficulty) {
        const completed = JSON.parse(localStorage.getItem('puzzleHubCompleted') || '{}');
        if (!completed[game]) completed[game] = [];
        if (!completed[game].includes(difficulty)) {
            completed[game].push(difficulty);
        }
        localStorage.setItem('puzzleHubCompleted', JSON.stringify(completed));
    }
    
    static isCompleted(game, difficulty) {
        const completed = JSON.parse(localStorage.getItem('puzzleHubCompleted') || '{}');
        return completed[game] && completed[game].includes(difficulty);
    }
}