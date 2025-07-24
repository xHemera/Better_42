// js/themeManager.js - Version synchronisée avec ColorThemeManager

class ThemeManager {
    constructor() {
        this.isDark = false;
        this.observer = null;
        this.intervalId = null;
    }

    init() {
        const forceWorseMode = localStorage.getItem(Better42Config.STORAGE_KEYS.FORCE_WORSE_MODE);
        
        if (forceWorseMode === 'true') {
            localStorage.removeItem(Better42Config.STORAGE_KEYS.FORCE_WORSE_MODE);
            this.isDark = false;
            return;
        }
        
        const hasDefaultProfile = window.ProfileManager.getDefaultProfile();
        this.isDark = !!hasDefaultProfile; 
        
        if (this.isDark) {
            this.activateDarkMode();
        }
    }

    activateDarkMode() {
        document.body.classList.add('dark-theme');
        this.isDark = true;
        this.updateLogtime();
        this.startLogtimeWatcher();
        window.ProfileManager.loadDefaultProfileOnStartup();
    }

    deactivateDarkMode() {
        localStorage.setItem(Better42Config.STORAGE_KEYS.FORCE_WORSE_MODE, 'true');
        window.BackgroundManager.removeCustomizations();
    }

    toggleTheme() {
        if (this.isDark) {
            this.deactivateDarkMode();
        } else {
            this.activateDarkMode();
        }
    }

    getCurrentThemeColor() {
        // Utilisation du nouveau ColorThemeManager pour obtenir la couleur
        if (window.ColorThemeManager) {
            return window.ColorThemeManager.getCurrentThemeRgb();
        }
        
        // Fallback vers l'ancien système si ColorThemeManager n'est pas disponible
        return '92, 5, 143';
    }

    updateLogtime() {
        const currentColor = this.getCurrentThemeColor();
        
        // Mettre à jour tous les éléments avec l'ancienne couleur teal
        const tealElements = document.querySelectorAll('[style*="rgba(0, 186, 188,"]');
        tealElements.forEach(el => {
            const style = el.getAttribute('style');
            const match = style.match(/rgba\(0, 186, 188, ([\d\.]+)\)/);
            if (match) {
                const opacity = match[1];
                const newStyle = style.replace(
                    /rgba\(0, 186, 188, [\d\.]+\)/, 
                    `rgba(${currentColor}, ${opacity})`
                );
                el.setAttribute('style', newStyle);
            }
        });

        // Mettre à jour les éléments qui ont déjà été convertis mais avec une ancienne couleur
        const oldThemePatterns = [
            /rgba\(92, 5, 143, ([\d\.]+)\)/g,    // Ancien purple
            /rgba\(30, 64, 175, ([\d\.]+)\)/g,   // Ancien blue
            /rgba\(190, 24, 93, ([\d\.]+)\)/g,   // Ancien pink
            /rgba\(5, 150, 105, ([\d\.]+)\)/g,   // Ancien green
            /rgba\(229, 229, 229, ([\d\.]+)\)/g, // Ancien white
            /rgba\(234, 88, 12, ([\d\.]+)\)/g,   // Ancien orange
            /rgba\(220, 38, 38, ([\d\.]+)\)/g,   // Ancien red
            /rgba\(8, 145, 178, ([\d\.]+)\)/g    // Ancien cyan
        ];

        oldThemePatterns.forEach(pattern => {
            const elements = document.querySelectorAll(`[style*="rgba("]`);
            elements.forEach(el => {
                const style = el.getAttribute('style');
                if (pattern.test(style)) {
                    const newStyle = style.replace(pattern, `rgba(${currentColor}, $1)`);
                    if (newStyle !== style) {
                        el.setAttribute('style', newStyle);
                    }
                }
            });
        });
    }

    restoreLogtime() {
        const currentColor = this.getCurrentThemeColor();
        const elements = document.querySelectorAll(`[style*="rgba(${currentColor.replace(/,/g, ',\\s*')},"]`);
        
        elements.forEach(el => {
            const style = el.getAttribute('style');
            const colorRegex = new RegExp(`rgba\\(${currentColor.replace(/,/g, ',\\s*')}, ([\\d\\.]+)\\)`);
            const match = style.match(colorRegex);
            if (match) {
                const opacity = match[1];
                const newStyle = style.replace(
                    colorRegex, 
                    `rgba(0, 186, 188, ${opacity})`
                );
                el.setAttribute('style', newStyle);
            }
        });
    }

    startLogtimeWatcher() {
        if (!this.isDark) return;
        
        this.observer = new MutationObserver((mutations) => {
            if (this.isDark) {
                // Délai court pour éviter les conflits avec ColorThemeManager
                setTimeout(() => {
                    this.updateLogtime();
                }, 50);
            }
        });
        
        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style']
        });
        
        this.intervalId = setInterval(() => {
            if (this.isDark) {
                this.updateLogtime();
            }
        }, 2000); // Intervalle réduit pour éviter les conflits
    }

    stopLogtimeWatcher() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    getThemeButtonText() {
        return this.isDark ? 'Worse' : 'Better';
    }

    // Nouvelle méthode pour synchroniser avec ColorThemeManager
    syncWithColorThemeManager() {
        if (this.isDark && window.ColorThemeManager) {
            // Forcer une mise à jour après changement de thème couleur
            setTimeout(() => {
                this.updateLogtime();
            }, 200);
        }
    }

    // Méthode pour obtenir des informations de debug
    getDebugInfo() {
        return {
            isDark: this.isDark,
            currentThemeColor: this.getCurrentThemeColor(),
            observerActive: !!this.observer,
            intervalActive: !!this.intervalId,
            colorThemeManagerAvailable: !!window.ColorThemeManager
        };
    }
}

window.ThemeManager = new ThemeManager();