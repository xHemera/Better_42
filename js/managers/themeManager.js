class ThemeManager {
    constructor() {
        this.isDark = false;
        this.observer = null;
        this.intervalId = null;
    }

    init() {
        const userModePreference = localStorage.getItem(Better42Config.STORAGE_KEYS.USER_MODE_PREFERENCE);
        const forceWorseMode = localStorage.getItem(Better42Config.STORAGE_KEYS.FORCE_WORSE_MODE);
        
        if (forceWorseMode === 'true') {
            localStorage.removeItem(Better42Config.STORAGE_KEYS.FORCE_WORSE_MODE);
        }
        
        if (userModePreference === 'worse') {
            this.isDark = false;
            return;
        } else if (userModePreference === 'better') {
            this.isDark = true;
            this.activateDarkModeWithoutSaving();
            return;
        }
        
        const hasDefaultProfile = window.ProfileManager.getDefaultProfile();
        this.isDark = !!hasDefaultProfile; 
        
        if (this.isDark) {
            localStorage.setItem(Better42Config.STORAGE_KEYS.USER_MODE_PREFERENCE, 'better');
            this.activateDarkModeWithoutSaving();
        } else {
            localStorage.setItem(Better42Config.STORAGE_KEYS.USER_MODE_PREFERENCE, 'worse');
        }
    }

    activateDarkMode() {
        document.body.classList.add('dark-theme');
        this.isDark = true;
        localStorage.setItem(Better42Config.STORAGE_KEYS.USER_MODE_PREFERENCE, 'better');
        
        if (window.ColorThemeManager) {
            window.ColorThemeManager.init();
        }
        
        this.updateLogtime();
        this.updateButtonColors(); // Ajout de la méthode
        this.startLogtimeWatcher();
        window.ProfileManager.loadDefaultProfileOnStartup();
    }

    activateDarkModeWithoutSaving() {
        document.body.classList.add('dark-theme');
        this.isDark = true;
        
        if (window.ColorThemeManager) {
            window.ColorThemeManager.init();
        }
        
        this.updateLogtime();
        this.updateButtonColors(); // Ajout de la méthode
        this.startLogtimeWatcher();
        window.ProfileManager.loadDefaultProfileOnStartup();
    }

    deactivateDarkMode() {
        document.body.classList.remove('dark-theme');
        this.isDark = false;
        this.restoreLogtime();
        this.stopLogtimeWatcher();
        localStorage.setItem(Better42Config.STORAGE_KEYS.USER_MODE_PREFERENCE, 'worse');
        localStorage.setItem(Better42Config.STORAGE_KEYS.FORCE_WORSE_MODE, 'true');
        window.BackgroundManager.removeCustomizations();
    }

    toggleTheme() {
        if (this.isDark) {
            this.deactivateDarkMode();
        } else {
            this.activateDarkMode();
        }
        
        // Notifier le ClusterMapManager du changement de thème
        if (window.ClusterMapManager) {
            setTimeout(() => {
                window.ClusterMapManager.onThemeChange();
            }, 100);
        }
    }

    getCurrentThemeColor() {
        // Récupérer directement depuis le localStorage pour éviter les problèmes de timing
        const currentTheme = localStorage.getItem('better42-color-theme') || 'violet';
        
        if (currentTheme === 'custom') {
            const savedCustomColor = localStorage.getItem('better42-custom-color');
            if (savedCustomColor) {
                const rgb = this.hexToRgb(savedCustomColor);
                if (rgb) {
                    return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
                }
            }
        }
        
        // Couleurs des thèmes prédéfinis
        const themes = {
            violet: '#5c058f',
            blanc: '#e5e5e5',
            bleu: '#1e40af',
            rose: '#be185d',
            vert: '#059669',
            orange: '#ea580c',
            rouge: '#dc2626',
            cyan: '#0891b2'
        };
        
        const themeColor = themes[currentTheme] || themes.violet;
        const rgb = this.hexToRgb(themeColor);
        
        if (rgb) {
            return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
        }
        
        return '92, 5, 143'; // Fallback violet
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // MÉTHODE MANQUANTE AJOUTÉE
    updateButtonColors() {
        // Mettre à jour les couleurs des boutons selon le thème actuel
        const currentColor = this.getCurrentThemeColor();
        
        // Mettre à jour les boutons de l'interface
        const themeBtn = document.getElementById('theme-switcher');
        const settingsBtn = document.getElementById('settings-btn');
        
        if (this.isDark) {
            if (settingsBtn) {
                settingsBtn.style.background = `linear-gradient(135deg, rgb(${currentColor}), rgba(${currentColor}, 0.8))`;
                settingsBtn.style.boxShadow = `0 4px 12px rgba(${currentColor}, 0.3)`;
                settingsBtn.style.borderColor = `rgba(${currentColor}, 0.8)`;
            }
        }
        
        // Mettre à jour d'autres éléments colorés si nécessaire
        this.updateColoredElements(currentColor);
    }

    updateColoredElements(currentColor) {
        // Mettre à jour les éléments avec des couleurs dynamiques
        const elementsToUpdate = [
            '.fill-legacy-main',
            '.stroke-legacy-main', 
            '.text-legacy-main',
            '.border-legacy-main'
        ];
        
        elementsToUpdate.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (selector.includes('fill')) {
                    el.style.fill = `rgb(${currentColor})`;
                } else if (selector.includes('stroke')) {
                    el.style.stroke = `rgb(${currentColor})`;
                } else if (selector.includes('text')) {
                    el.style.color = `rgb(${currentColor})`;
                } else if (selector.includes('border')) {
                    el.style.borderColor = `rgb(${currentColor})`;
                }
            });
        });
    }

    updateLogtime() {
        const currentColor = this.getCurrentThemeColor();
        
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

        const oldThemePatterns = [
            /rgba\(92, 5, 143, ([\d\.]+)\)/g,
            /rgba\(30, 64, 175, ([\d\.]+)\)/g,
            /rgba\(190, 24, 93, ([\d\.]+)\)/g,
            /rgba\(5, 150, 105, ([\d\.]+)\)/g,
            /rgba\(229, 229, 229, ([\d\.]+)\)/g,
            /rgba\(234, 88, 12, ([\d\.]+)\)/g,
            /rgba\(220, 38, 38, ([\d\.]+)\)/g,
            /rgba\(8, 145, 178, ([\d\.]+)\)/g
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
        }, 2000);
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

    syncWithColorThemeManager() {
        if (this.isDark && window.ColorThemeManager) {
            setTimeout(() => {
                this.updateLogtime();
                this.updateButtonColors(); // Ajout de la méthode
            }, 200);
        }
    }

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