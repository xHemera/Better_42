// main.js - Version finale avec nouvelle architecture

class Better42App {
    constructor() {
        this.initialized = false;
    }

    earlyInit() {
        document.documentElement.style.visibility = 'hidden';
        
        Better42Utils.onDOMReady(() => {
            // Vérifier que tous les managers sont chargés
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
            
            // Initialiser ProfileDetector en premier
            window.ProfileDetector.init();
            
            // Initialiser le système de thèmes
            window.ColorThemeManager.init();
            
            // Charger le profil par défaut qui appliquera aussi le thème
            window.ProfileManager.earlyLoadDefaultProfile();
            
            // Initialiser l'application complète
            this.init();
        });
    }

    init() {
        if (this.initialized) return;
        
        // Vérifier que UIManager est chargé
        if (!window.UIManager) {
            console.error('UIManager not loaded');
            return;
        }
        
        try {
            // Initialiser les managers dans le bon ordre
            if (window.ThemeManager && window.ThemeManager.init) {
                window.ThemeManager.init();
            }
            
            // Créer l'interface utilisateur
            window.UIManager.createUI();
            
            // Charger le profil par défaut au démarrage
            setTimeout(() => {
                if (window.ProfileManager && window.ProfileManager.loadDefaultProfileOnStartup) {
                    window.ProfileManager.loadDefaultProfileOnStartup();
                }
            }, 200);
            
            // Rendre la page visible
            setTimeout(() => {
                document.documentElement.style.visibility = 'visible';
            }, 300);
            
            this.initialized = true;
            console.log('Better 42 App initialized successfully');
        } catch (error) {
            console.error('Error during initialization:', error);
            // Rendre la page visible même en cas d'erreur
            document.documentElement.style.visibility = 'visible';
        }
    }
}

// Créer et initialiser l'application
const better42App = new Better42App();
better42App.earlyInit();