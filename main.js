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
            
            window.ColorThemeManager.init();
            
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
            
            window.UIManager.createUI();
            
            // Démarrer l'observateur des changements de page
            this.setupPageChangeWatcher();
            
            if (window.ClusterMapManager) {
                window.ClusterMapManager.init();
            }
            
            setTimeout(() => {
                if (window.ProfileManager && window.ProfileManager.loadDefaultProfileOnStartup) {
                    window.ProfileManager.loadDefaultProfileOnStartup();
                }
            }, 200);
            
            setTimeout(() => {
                document.documentElement.style.visibility = 'visible';
            }, 300);
            
            this.initialized = true;
            console.log('Better 42 App initialized successfully');
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
                
                console.log('🔄 Changement de page détecté:', oldURL, '→', lastURL);
                this.handlePageChange();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Observer pour les événements de navigation
        window.addEventListener('popstate', () => {
            console.log('🔄 Popstate détecté');
            this.handlePageChange();
        });
        
        // Observer pour les changements d'état de l'historique
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        history.pushState = function() {
            originalPushState.apply(history, arguments);
            setTimeout(() => {
                console.log('🔄 PushState détecté');
                better42App.handlePageChange();
            }, 100);
        };
        
        history.replaceState = function() {
            originalReplaceState.apply(history, arguments);
            setTimeout(() => {
                console.log('🔄 ReplaceState détecté');
                better42App.handlePageChange();
            }, 100);
        };
        
        // Observer les changements de DOM qui pourraient supprimer nos boutons
        window.UIManager.observePageChanges();
    }

    handlePageChange() {
        console.log('🔧 Gestion du changement de page...');
        
        // Délai pour laisser le temps à la nouvelle page de se charger
        setTimeout(() => {
            try {
                // Rafraîchir l'UI pour maintenir les boutons
                if (window.UIManager) {
                    window.UIManager.refreshUI();
                }
                
                // Re-appliquer les thèmes si nécessaire
                if (window.ThemeManager && window.ThemeManager.isDark) {
                    setTimeout(() => {
                        window.ThemeManager.updateLogtime();
                    }, 200);
                }
                
                console.log('✅ Changement de page géré');
                
            } catch (error) {
                console.error('❌ Erreur lors du changement de page:', error);
            }
        }, 300);
    }

    // Méthode pour forcer la réinitialisation si nécessaire
    forceReinit() {
        console.log('🔄 Force réinitialisation...');
        
        if (window.UIManager) {
            window.UIManager.createUI();
        }
        
        if (window.ThemeManager && window.ThemeManager.isDark) {
            setTimeout(() => {
                window.ThemeManager.updateLogtime();
            }, 100);
        }
    }
}

const better42App = new Better42App();
better42App.earlyInit();

// Exposer l'instance globalement pour le debug
window.Better42App = better42App;