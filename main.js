class Better42App {
    constructor() {
        this.initialized = false;
        this.urlWatcher = null;
    }

    earlyInit() {
        document.documentElement.style.visibility = 'hidden';
        
        Better42Utils.onDOMReady(() => {
            console.log('[Better42] Domain:', window.location.hostname);
            console.log('[Better42] URL:', window.location.href);
            
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
            
            window.ColorThemeManager.startLogtimeObserver();
            
            window.ProfileManager.earlyLoadDefaultProfile();
            
            if (window.domainStyleManager) {
                window.domainStyleManager.init();
            }
            
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
            
            if (window.ColorThemeManager) {
                window.ColorThemeManager.init();
            }
            
            window.UIManager.createUI();
            
            this.setupPageChangeWatcher();
            
            if (window.ClusterMapManager) {
                window.ClusterMapManager.init();
            }
            
            setTimeout(() => {
                if (window.LogtimeStatsManager && window.ThemeManager && window.ThemeManager.isDark) {
                    window.LogtimeStatsManager.init();
                }
            }, 100);
            
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
        
        window.addEventListener('popstate', () => {
            this.handlePageChange();
        });
        
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
        
        window.UIManager.observePageChanges();
    }

    handlePageChange() {
        setTimeout(() => {
            try {
                if (window.BackgroundManager) {
                    window.BackgroundManager.recaptureDefaultImages();
                }
                if (window.UIManager) {
                    window.UIManager.refreshUI();
                }
                if (window.ColorThemeManager && window.ThemeManager && window.ThemeManager.isDark) {
                    setTimeout(() => {
                        const currentTheme = window.ColorThemeManager.getCurrentTheme();
                        if (currentTheme === 'custom') {
                            const savedCustomColor = localStorage.getItem('better42-custom-color');
                            if (savedCustomColor) {
                                window.ColorThemeManager.applyCustomColor(savedCustomColor);
                            }
                        } else if (window.ColorThemeManager.themes[currentTheme]) {
                            window.ColorThemeManager.applyTheme(currentTheme);
                        }
                    }, 100);
                }
                if (window.ThemeManager && window.ThemeManager.isDark) {
                    setTimeout(() => {
                        window.ThemeManager.updateLogtime();
                        window.ThemeManager.updateButtonColors();
                    }, 200);
                }
                if (window.LogtimeStatsManager && window.ThemeManager && window.ThemeManager.isDark) {
                    setTimeout(() => {
                        window.LogtimeStatsManager.refresh();
                    }, 300);
                }
                if (window.TimeRemainingManager) {
                    setTimeout(() => {
                        window.TimeRemainingManager.refresh();
                    }, 400);
                }
            } catch (error) {
                console.error('❌ Erreur lors du changement de page:', error);
            }
        }, 300);
    }

    forceReinit() {
        
        if (window.UIManager) {
            window.UIManager.createUI();
        }
        
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

window.Better42App = better42App;

