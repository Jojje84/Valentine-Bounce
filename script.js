/*
 * Valentine Bounce - Interactive Animation Script
 * Copyright (c) 2025 Jorge Avila
 * Author: Jorge Avila (jorgeavilas@icloud.com)
 * Repository: https://github.com/Jojje84/Valentine-Bounce
 * License: MIT License - see LICENSE file for details
 * 
 * This file contains custom interactive animations and effects.
 * Original work by Jorge Avila - please maintain attribution.
 */

// Valentine Bounce - Avancerat Interaktivt Animationsskript
// Hanterar tema, ljud, partiklar, klickräknare och alla interaktioner

class ValentineBounce {
    constructor() {
        this.clickCount = 0;
        this.soundEnabled = true;
        this.isLightTheme = false;
        this.audioContext = null;
        this.particles = [];
        
        this.init();
    }
    
    init() {
        this.loadPreferences();
        this.setupElements();
        this.setupEventListeners();
        this.setupAudio();
        this.showLoadingAnimation();
    }
    
    setupElements() {
        this.content = document.querySelector(".content");
        this.themeToggle = document.getElementById("themeToggle");
        this.soundToggle = document.getElementById("soundToggle");
        this.clickCountDisplay = document.getElementById("clickCount");
        this.particleContainer = document.getElementById("particleContainer");
        
        if (!this.content) {
            console.error("Content element not found");
            return;
        }
    }
    
    setupEventListeners() {
        // Huvudinteraktioner
        this.content.addEventListener("click", (e) => this.handleInteraction(e));
        this.content.addEventListener("touchstart", (e) => this.handleTouch(e), { passive: true });
        this.content.addEventListener("keydown", (e) => this.handleKeyboard(e));
        
        // Kontroller
        this.themeToggle.addEventListener("click", () => this.toggleTheme());
        this.soundToggle.addEventListener("click", () => this.toggleSound());
        
        // Tangentbordsnavigering för accessibility
        document.addEventListener("keydown", (e) => {
            if (e.key === "Tab") {
                this.content.focus();
            }
        });
    }
    
    setupAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn("Web Audio API inte tillgängligt:", error);
        }
    }
    
    showLoadingAnimation() {
        document.body.style.opacity = "0";
        setTimeout(() => {
            document.body.style.transition = "opacity 1s ease-in-out";
            document.body.style.opacity = "1";
        }, 100);
    }
    
    handleInteraction(event) {
        this.incrementClickCount();
        this.bounce();
        this.createParticles(event.clientX, event.clientY);
        this.playSound();
    }
    
    handleTouch(event) {
        event.preventDefault();
        const touch = event.touches[0];
        this.handleInteraction({
            clientX: touch.clientX,
            clientY: touch.clientY
        });
    }
    
    handleKeyboard(event) {
        if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            const rect = this.content.getBoundingClientRect();
            this.handleInteraction({
                clientX: rect.left + rect.width / 2,
                clientY: rect.top + rect.height / 2
            });
        }
    }
    
    bounce() {
        this.content.classList.add("bounce");
        setTimeout(() => {
            this.content.classList.remove("bounce");
        }, 500);
    }
    
    incrementClickCount() {
        this.clickCount++;
        this.clickCountDisplay.textContent = this.clickCount;
        this.savePreferences();
        
        // Achievement-notifiering
        if (this.clickCount % 10 === 0) {
            this.showAchievement(`${this.clickCount} klick! 🎉`);
        }
    }
    
    createParticles(x, y) {
        const particleCount = 8;
        const hearts = ['💖', '💕', '💗', '💓', '❤️', '💝'];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            
            // Slumpmässig position runt klickpunkten
            const angle = (i / particleCount) * 2 * Math.PI;
            const distance = 50 + Math.random() * 50;
            const particleX = x + Math.cos(angle) * distance;
            const particleY = y + Math.sin(angle) * distance;
            
            particle.style.left = particleX + 'px';
            particle.style.top = particleY + 'px';
            
            this.particleContainer.appendChild(particle);
            
            // Ta bort partikeln efter animationen
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 3000);
        }
    }
    
    playSound() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        try {
            // Skapa en enkel bounce-ljud med Web Audio API
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.2);
        } catch (error) {
            console.warn("Kunde inte spela ljud:", error);
        }
    }
    
    toggleTheme() {
        this.isLightTheme = !this.isLightTheme;
        document.body.classList.toggle('light-theme', this.isLightTheme);
        this.themeToggle.textContent = this.isLightTheme ? '☀️' : '🌙';
        this.savePreferences();
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.soundToggle.textContent = this.soundEnabled ? '🔊' : '🔇';
        this.savePreferences();
    }
    
    showAchievement(message) {
        const achievement = document.createElement('div');
        achievement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--primary-color);
            color: var(--text-color);
            padding: 20px;
            border-radius: 10px;
            font-size: 1.2em;
            font-weight: bold;
            z-index: 10000;
            animation: achievementPop 2s ease-out forwards;
        `;
        achievement.textContent = message;
        document.body.appendChild(achievement);
        
        setTimeout(() => {
            if (achievement.parentNode) {
                achievement.parentNode.removeChild(achievement);
            }
        }, 2000);
    }
    
    savePreferences() {
        const preferences = {
            clickCount: this.clickCount,
            soundEnabled: this.soundEnabled,
            isLightTheme: this.isLightTheme
        };
        localStorage.setItem('valentineBouncePrefs', JSON.stringify(preferences));
    }
    
    loadPreferences() {
        try {
            const saved = localStorage.getItem('valentineBouncePrefs');
            if (saved) {
                const preferences = JSON.parse(saved);
                this.clickCount = preferences.clickCount || 0;
                this.soundEnabled = preferences.soundEnabled !== false;
                this.isLightTheme = preferences.isLightTheme || false;
                
                // Applicera sparade inställningar
                if (this.isLightTheme) {
                    document.body.classList.add('light-theme');
                }
            }
        } catch (error) {
            console.warn("Kunde inte ladda sparade inställningar:", error);
        }
    }
}

// CSS för achievement-animation
const achievementStyle = document.createElement('style');
achievementStyle.textContent = `
    @keyframes achievementPop {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
        50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1);
        }
    }
`;
document.head.appendChild(achievementStyle);

// Initialisera när DOM är redo
document.addEventListener('DOMContentLoaded', function() {
    try {
        new ValentineBounce();
    } catch (error) {
        console.error("Fel vid initialisering av Valentine Bounce:", error);
        // Fallback för grundläggande funktionalitet
        const content = document.querySelector(".content");
        if (content) {
            content.addEventListener("click", function() {
                this.classList.add("bounce");
                setTimeout(() => this.classList.remove("bounce"), 500);
            });
        }
    }
});