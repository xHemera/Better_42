class Better42App {
    constructor() {
        this.initialized = false;
        this.urlWatcher = null;
    }

    earlyInit() {
        document.documentElement.style.visibility = 'hidden';
        
        Better42Utils.onDOMReady(() => {
            if (!window.ColorThemeManager) {
                console.error('ColorThemeManager not loaded');
                return;
            }
            if (!window.ProfileManager) {
                console.error('ProfileManager not loaded');
                return;
            }
            if (!window.ThemeManager) {
                console.error('ThemeManager not loaded');
                return;
            }
            if (!window.ProfileDetector) {
                console.error('ProfileDetector not loaded');
                return;
            }
            if (!window.PageDetector) {
                console.error('PageDetector not loaded');
                return;
            }
            
            window.PageDetector.init();
            window.ProfileDetector.init();
            
            // Initialiser ColorThemeManager mais sans appliquer les thèmes tout de suite
            // Les thèmes seront appliqués après que ThemeManager soit initialisé
            window.ColorThemeManager.startLogtimeObserver();
            
            window.ProfileManager.earlyLoadDefaultProfile();
            
            this.init();
        });
    }

    init() {
        if (this.initialized) return;
        
        if (!window.UIManager) {
            console.error('UIManager not loaded');
            return;
        }
        
        try {
            if (window.ThemeManager && window.ThemeManager.init) {
                window.ThemeManager.init();
            }
            
            // Maintenant appliquer les thèmes de couleurs après que ThemeManager soit initialisé
            if (window.ColorThemeManager) {
                window.ColorThemeManager.init();
            }
            
            window.UIManager.createUI();
            
            // Démarrer l'observateur des changements de page
            this.setupPageChangeWatcher();
            
            if (window.ClusterMapManager) {
                window.ClusterMapManager.init();
            }
            
            // Initialiser LogtimeStatsManager seulement si on est en mode better
            setTimeout(() => {
                if (window.LogtimeStatsManager && window.ThemeManager && window.ThemeManager.isDark) {
                    window.LogtimeStatsManager.init();
                }
            }, 100);
            
            // Initialiser TimeRemainingManager
            setTimeout(() => {
                if (window.TimeRemainingManager) {
                    window.TimeRemainingManager.init();
                }
            }, 150);
            
            setTimeout(() => {
                if (window.ProfileManager && window.ProfileManager.loadDefaultProfileOnStartup) {
                    window.ProfileManager.loadDefaultProfileOnStartup();
                }
            }, 200);
            
            setTimeout(() => {
                document.documentElement.style.visibility = 'visible';
            }, 300);
            
            this.initialized = true;
        } catch (error) {
            console.error('Error during initialization:', error);
            document.documentElement.style.visibility = 'visible';
        }
    }

    setupPageChangeWatcher() {
        let lastURL = window.location.href;
        
        // Observer pour détecter les changements de navigation SPA
        const observer = new MutationObserver(() => {
            if (window.location.href !== lastURL) {
                const oldURL = lastURL;
                lastURL = window.location.href;
                
                this.handlePageChange();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Observer pour les événements de navigation
        window.addEventListener('popstate', () => {
            this.handlePageChange();
        });
        
        // Observer pour les changements d'état de l'historique
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        history.pushState = function() {
            originalPushState.apply(history, arguments);
            setTimeout(() => {
                better42App.handlePageChange();
            }, 100);
        };
        
        history.replaceState = function() {
            originalReplaceState.apply(history, arguments);
            setTimeout(() => {
                better42App.handlePageChange();
            }, 100);
        };
        
        // Observer les changements de DOM qui pourraient supprimer nos boutons
        window.UIManager.observePageChanges();
    }

    handlePageChange() {
    // Délai pour laisser le temps à la nouvelle page de se charger
        setTimeout(() => {
            try {
                // ✅ NOUVEAU : Recapturer les images par défaut sur changement de page
                if (window.BackgroundManager) {
                    window.BackgroundManager.recaptureDefaultImages();
                }
                
                // Rafraîchir l'UI pour maintenir les boutons
                if (window.UIManager) {
                    window.UIManager.refreshUI();
                }
                
                // ... reste du code existant
                
            } catch (error) {
                console.error('❌ Erreur lors du changement de page:', error);
            }
        }, 300);
    }

    // Méthode pour forcer la réinitialisation si nécessaire
    forceReinit() {
        
        if (window.UIManager) {
            window.UIManager.createUI();
        }
        
        // Forcer la ré-application complète des thèmes de couleurs SEULEMENT en mode dark
        if (window.ColorThemeManager && window.ThemeManager && window.ThemeManager.isDark) {
            const currentTheme = window.ColorThemeManager.getCurrentTheme();
            if (currentTheme === 'custom') {
                const savedCustomColor = localStorage.getItem('better42-custom-color');
                if (savedCustomColor) {
                    window.ColorThemeManager.applyCustomColor(savedCustomColor);
                }
            } else if (window.ColorThemeManager.themes[currentTheme]) {
                window.ColorThemeManager.applyTheme(currentTheme);
            }
        }
        
        if (window.ThemeManager && window.ThemeManager.isDark) {
            setTimeout(() => {
                window.ThemeManager.updateLogtime();
                window.ThemeManager.updateButtonColors();
            }, 100);
        }
        
        if (window.LogtimeStatsManager && window.ThemeManager && window.ThemeManager.isDark) {
            setTimeout(() => {
                window.LogtimeStatsManager.refresh();
            }, 150);
        }
    }
}

const better42App = new Better42App();
better42App.earlyInit();

// Exposer l'instance globalement pour le debug
window.Better42App = better42App;

