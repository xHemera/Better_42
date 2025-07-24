// themeManager.js - Gestion du thème dark/light
class ThemeManager {
    constructor() {
        this.isDark = false;
        this.observer = null;
        this.intervalId = null;
    }

    // Initialiser le thème
    init() {
        // Déterminer l'état initial basé sur s'il y a un profil par défaut
        const hasDefaultProfile = window.ProfileManager.getDefaultProfile();
        this.isDark = !!hasDefaultProfile; // Si profil par défaut = dark mode
        
        if (this.isDark) {
            this.activateDarkMode();
        }
    }

    // Activer le mode sombre
    activateDarkMode() {
        document.body.classList.add('dark-theme');
        this.isDark = true;
        this.updateLogtime();
        this.startLogtimeWatcher();
        window.ProfileManager.loadDefaultProfileOnStartup();
    }

    // Désactiver le mode sombre
    deactivateDarkMode() {
        window.BackgroundManager.removeCustomizations();
    }

    // Basculer entre les thèmes
    toggleTheme() {
        if (this.isDark) {
            this.deactivateDarkMode();
        } else {
            this.activateDarkMode();
        }
    }

    // Mettre à jour les couleurs logtime
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

    // Restaurer les couleurs logtime originales
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

    // Démarrer la surveillance des changements logtime
    startLogtimeWatcher() {
        if (!this.isDark) return;
        
        // Observer les mutations DOM
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
        
        // Interval de vérification
        this.intervalId = setInterval(() => {
            if (this.isDark) {
                this.updateLogtime();
            }
        }, 1000);
    }

    // Arrêter la surveillance
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

    // Obtenir l'état du thème
    getThemeButtonText() {
        return this.isDark ? 'Worse' : 'Better';
    }
}

// Export global
window.ThemeManager = new ThemeManager();