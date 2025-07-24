class ThemeManager {
    constructor() {
        this.isDark = false;
        this.observer = null;
        this.intervalId = null;
    }

    init() {
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
        window.BackgroundManager.removeCustomizations();
    }
    toggleTheme() {
        if (this.isDark) {
            this.deactivateDarkMode();
        } else {
            this.activateDarkMode();
        }
    }
    updateLogtime() {
        const elements = document.querySelectorAll(Better42Config.SELECTORS.LOGTIME_ELEMENTS);
        elements.forEach(el => {
            const style = el.getAttribute('style');
            const match = style.match(new RegExp(`${Better42Config.COLORS.TEAL.replace('(', '\\(')} ([\\d\\.]+)\\)`));
            if (match) {
                const opacity = match[1];
                const newStyle = style.replace(
                    new RegExp(`${Better42Config.COLORS.TEAL.replace('(', '\\(')} [\\d\\.]+\\)`), 
                    Better42Config.COLORS.PURPLE + opacity + ')'
                );
                el.setAttribute('style', newStyle);
            }
        });
    }
    restoreLogtime() {
        const elements = document.querySelectorAll(Better42Config.SELECTORS.LOGTIME_PURPLE);
        elements.forEach(el => {
            const style = el.getAttribute('style');
            const match = style.match(new RegExp(`${Better42Config.COLORS.PURPLE.replace('(', '\\(')} ([\\d\\.]+)\\)`));
            if (match) {
                const opacity = match[1];
                const newStyle = style.replace(
                    new RegExp(`${Better42Config.COLORS.PURPLE.replace('(', '\\(')} [\\d\\.]+\\)`), 
                    Better42Config.COLORS.TEAL + opacity + ')'
                );
                el.setAttribute('style', newStyle);
            }
        });
    }
    startLogtimeWatcher() {
        if (!this.isDark) return;
        this.observer = new MutationObserver(() => {
            if (this.isDark) {
                this.updateLogtime();
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
        }, 1000);
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
}
window.ThemeManager = new ThemeManager();