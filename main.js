// main.js - Point d'entrée principal de Better 42
class Better42App {
    constructor() {
        this.initialized = false;
    }

    // Initialisation précoce (avant le chargement complet du DOM)
    earlyInit() {
        // Cacher le document pendant le chargement
        document.documentElement.style.visibility = 'hidden';
        
        // Charger le profil par défaut si disponible
        Better42Utils.onDOMReady(() => {
            window.ProfileManager.earlyLoadDefaultProfile();
        });
    }

    // Initialisation principale (après le chargement de la page)
    init() {
        if (this.initialized) return;
        
        // Attendre un délai pour s'assurer que la page est complètement chargée
        setTimeout(() => {
            // Initialiser les managers
            window.ThemeManager.init();
            
            // Créer l'interface utilisateur
            window.UIManager.createUI();
            
            this.initialized = true;
        }, 500);
    }
}

// Initialisation de l'application
const better42App = new Better42App();

// Initialisation précoce
better42App.earlyInit();

// Initialisation principale après le chargement de la page
window.addEventListener('load', () => {
    better42App.init();
});