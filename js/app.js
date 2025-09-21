class App {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }
    
    init() {
        this.setupTheme();
        this.setupEventListeners();
        this.setupPWA();
        this.updateProgressDisplay();
    }
    
    setupTheme() {
        const savedTheme = Storage.getTheme();
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
    
    setupEventListeners() {
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            Storage.setTheme(newTheme);
            
            const themeToggle = document.getElementById('theme-toggle');
            themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });
        
        // Difficulty badge selection
        document.querySelectorAll('.badge').forEach(badge => {
            badge.addEventListener('click', (e) => {
                e.stopPropagation();
                if (badge.classList.contains('unlocked')) {
                    const gameName = badge.closest('.game-card').dataset.game;
                    const difficulty = badge.dataset.level;
                    gameManager.startGame(gameName, difficulty);
                }
            });
        });
        
        // Back button
        document.getElementById('back-btn').addEventListener('click', () => {
            gameManager.endGame();
        });
        
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                this.switchTab(tabName);
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('game-screen').classList.contains('active')) {
                gameManager.endGame();
            }
        });
    }
    
    updateProgressDisplay() {
        gameManager.updateProgressDisplay();
        gameManager.updateDifficultyBadges();
    }
    
    setupPWA() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });
        
        window.addEventListener('appinstalled', () => {
            this.hideInstallButton();
            this.deferredPrompt = null;
        });
    }
    
    showInstallButton() {
        const installBtn = document.createElement('button');
        installBtn.id = 'install-btn';
        installBtn.className = 'btn';
        installBtn.textContent = '📱 Install App';
        installBtn.style.position = 'fixed';
        installBtn.style.bottom = '20px';
        installBtn.style.right = '20px';
        installBtn.style.zIndex = '1000';
        
        installBtn.addEventListener('click', () => {
            if (this.deferredPrompt) {
                this.deferredPrompt.prompt();
                this.deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    }
                    this.deferredPrompt = null;
                    this.hideInstallButton();
                });
            }
        });
        
        document.body.appendChild(installBtn);
    }
    
    hideInstallButton() {
        const installBtn = document.getElementById('install-btn');
        if (installBtn) {
            installBtn.remove();
        }
    }
    
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});