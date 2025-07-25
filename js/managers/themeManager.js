
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
        if (window.ColorThemeManager) {
            return window.ColorThemeManager.getCurrentThemeRgb();
        }
        
        return '92, 5, 143';
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