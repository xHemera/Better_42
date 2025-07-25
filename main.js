
class Better42App {
    constructor() {
        this.initialized = false;
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
}

const better42App = new Better42App();
better42App.earlyInit();