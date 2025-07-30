class ThemeManager {
    constructor() {
        this.isDark = false;
        this.observer = null;
        this.intervalId = null;
    }

    // INITIALIZE THEME MANAGER
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

    // ACTIVATE DARK THEME MODE
    activateDarkMode() {
        document.body.classList.add('dark-theme');
        this.isDark = true;
        localStorage.setItem(Better42Config.STORAGE_KEYS.USER_MODE_PREFERENCE, 'better');
        
        if (window.ColorThemeManager) {
            window.ColorThemeManager.init();
        }
        
        this.updateLogtime();
        this.updateButtonColors();
        this.startLogtimeWatcher();
        
        if (window.LogtimeStatsManager) {
            setTimeout(() => {
                window.LogtimeStatsManager.init();
            }, 500);
        }
        
        setTimeout(() => {
            window.ProfileManager.loadDefaultProfileOnStartup();
        }, 200);
    }

    // ACTIVATE DARK MODE WITHOUT SAVING PREFERENCE
    activateDarkModeWithoutSaving() {
        document.body.classList.add('dark-theme');
        this.isDark = true;
        
        if (window.ColorThemeManager) {
            window.ColorThemeManager.init();
        }
        
        this.updateLogtime();
        this.updateButtonColors();
        this.startLogtimeWatcher();
        
        if (window.LogtimeStatsManager) {
            setTimeout(() => {
                window.LogtimeStatsManager.init();
            }, 500);
        }
        
        setTimeout(() => {
            window.ProfileManager.loadDefaultProfileOnStartup();
        }, 200);
    }

    // DEACTIVATE DARK THEME MODE
    deactivateDarkMode() {
        
        document.body.classList.remove('dark-theme');
        this.isDark = false;
        
        if (window.BackgroundManager) {
            window.BackgroundManager.removeAllCustomizations();
        }
        
        this.restoreLogtime();
        this.stopLogtimeWatcher();
        
        this.restoreLegacyElements();
        
        this.restoreButtonColors();
        
        if (window.LogtimeStatsManager) {
            window.LogtimeStatsManager.destroy();
        }
        
        if (window.TimeRemainingManager) {
            window.TimeRemainingManager.destroy();
        }
        
        localStorage.setItem(Better42Config.STORAGE_KEYS.USER_MODE_PREFERENCE, 'worse');
        localStorage.setItem(Better42Config.STORAGE_KEYS.FORCE_WORSE_MODE, 'true');
        
        
    }

    // TOGGLE BETWEEN DARK AND LIGHT THEME
    toggleTheme() {
        if (this.isDark) {
            this.deactivateDarkMode();
        } else {
            this.activateDarkMode();
        }
        
        if (window.ClusterMapManager) {
            setTimeout(() => {
                window.ClusterMapManager.onThemeChange();
            }, 100);
        }
    }

    // GET CURRENT THEME COLOR AS RGB VALUES
    getCurrentThemeColor() {
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
        
        return '92, 5, 143';
    }

    // CONVERT HEX COLOR TO RGB OBJECT
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // UPDATE BUTTON COLORS ACCORDING TO CURRENT THEME
    updateButtonColors() {
        const currentColor = this.getCurrentThemeColor();
        
        const themeBtn = document.getElementById('theme-switcher');
        const settingsBtn = document.getElementById('settings-btn');
        
        if (this.isDark) {
            if (settingsBtn) {
                settingsBtn.style.background = `linear-gradient(135deg, rgb(${currentColor}), rgba(${currentColor}, 0.8))`;
                settingsBtn.style.boxShadow = `0 4px 12px rgba(${currentColor}, 0.3)`;
                settingsBtn.style.borderColor = `rgba(${currentColor}, 0.8)`;
            }
        }
        
        this.updateColoredElements(currentColor);
    }

    // UPDATE ALL COLORED ELEMENTS WITH CURRENT THEME
    updateColoredElements(currentColor) {
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

    // UPDATE LOGTIME COLORS TO MATCH CURRENT THEME
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

    // RESTORE LOGTIME TO ORIGINAL TEAL COLOR
    restoreLogtime() {
        const allColoredElements = document.querySelectorAll('[style*="rgba("]');
        
        allColoredElements.forEach(el => {
            const style = el.getAttribute('style');
            if (!style) return;
            
            const customColorPatterns = [
                /rgba\(92, 5, 143, ([\d\.]+)\)/g,
                /rgba\(30, 64, 175, ([\d\.]+)\)/g,
                /rgba\(190, 24, 93, ([\d\.]+)\)/g,
                /rgba\(5, 150, 105, ([\d\.]+)\)/g,
                /rgba\(229, 229, 229, ([\d\.]+)\)/g,
                /rgba\(234, 88, 12, ([\d\.]+)\)/g,
                /rgba\(220, 38, 38, ([\d\.]+)\)/g,
                /rgba\(8, 145, 178, ([\d\.]+)\)/g,
                /rgba\((?!0, 186, 188)(\d{1,3}, \d{1,3}, \d{1,3}), ([\d\.]+)\)/g
            ];
            
            let newStyle = style;
            let hasChanged = false;
            
            customColorPatterns.forEach(pattern => {
                if (pattern.test(newStyle)) {
                    newStyle = newStyle.replace(pattern, 'rgba(0, 186, 188, $1)');
                    hasChanged = true;
                }
            });
            
            if (hasChanged) {
                el.setAttribute('style', newStyle);
            }
        });
    }

    // RESTORE LEGACY ELEMENTS TO ORIGINAL COLORS
    restoreLegacyElements() {
        const strokeElements = document.querySelectorAll('.stroke-legacy-main');
        strokeElements.forEach(el => {
            el.style.stroke = '';
        });
        
  
        const fillElements = document.querySelectorAll('.fill-legacy-main');
        fillElements.forEach(el => {
            el.style.fill = '';
            el.style.color = '';
        });
        
        const textElements = document.querySelectorAll('.text-legacy-main');
        textElements.forEach(el => {
            el.style.color = '';
        });
        
        const borderElements = document.querySelectorAll('.border-legacy-main');
        borderElements.forEach(el => {
            el.style.borderColor = '';
        });
    }

    // RESTORE BUTTON COLORS TO DEFAULT
    restoreButtonColors() {
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.style.background = '';
            settingsBtn.style.boxShadow = '';
            settingsBtn.style.borderColor = '';
        }
        
        const themeBtn = document.getElementById('theme-switcher');
        if (themeBtn) {
            themeBtn.style.background = '';
            themeBtn.style.boxShadow = '';
            themeBtn.style.borderColor = '';
        }
    }

    // START WATCHING FOR LOGTIME CHANGES
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

    // STOP LOGTIME WATCHER
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

    // GET TEXT FOR THEME TOGGLE BUTTON
    getThemeButtonText() {
        return this.isDark ? 'Worse' : 'Better';
    }

    // SYNC WITH COLOR THEME MANAGER
    syncWithColorThemeManager() {
        if (this.isDark && window.ColorThemeManager) {
            setTimeout(() => {
                this.updateLogtime();
                this.updateButtonColors();
                
                if (window.LogtimeStatsManager) {
                    window.LogtimeStatsManager.refresh();
                }
            }, 200);
        }
    }

    // GET DEBUG INFORMATION FOR THEME MANAGER
    getDebugInfo() {
        return {
            isDark: this.isDark,
            currentThemeColor: this.getCurrentThemeColor(),
            observerActive: !!this.observer,
            intervalActive: !!this.intervalId,
            colorThemeManagerAvailable: !!window.ColorThemeManager
        };
    }

    // FORCE CLEANUP FOR WORSE MODE
    forceCleanupForWorseMode() {
        const rootStyle = document.documentElement.style;
        rootStyle.removeProperty('--better42-primary');
        rootStyle.removeProperty('--better42-primary-light');
        rootStyle.removeProperty('--better42-primary-lighter');
        
        const allStyles = document.querySelectorAll('style');
        allStyles.forEach(style => {
            const content = style.textContent;
            if (content.includes('--better42-') || 
                content.includes('background-image: url') || 
                content.includes('w-full.xl') ||
                content.includes('w-52.h-52') ||
                content.includes('Better42Config') ||
                content.includes('rgba(92, 5, 143') ||
                content.includes('!important')) {
                style.remove();
            }
        });

        const bgSelector = '.w-full.xl\\:h-72.bg-center.bg-cover.bg-ft-black, .w-full.xl\\:h-72.bg-center.bg-cover';
        const pfpSelector = '.w-52.h-52.text-black.md\\:w-40.md\\:h-40.lg\\:h-28.lg\\:w-28.bg-cover.bg-no-repeat.bg-center.rounded-full';
        
        document.querySelectorAll(`${bgSelector}, ${pfpSelector}`).forEach(el => {
            el.removeAttribute('style');
            
            el.querySelectorAll('iframe').forEach(iframe => iframe.remove());
            
            const wrappedContent = el.querySelector('div[style*="z-index:2"]');
            if (wrappedContent) {
                el.innerHTML = wrappedContent.innerHTML;
            }
            
            const originalDisplay = el.style.display;
            el.style.display = 'none';
            el.offsetHeight;
            el.style.display = originalDisplay;
            
            const classes = el.className;
            el.className = '';
            el.offsetHeight;
            el.className = classes;
        });

        const overrideStyle = document.createElement('style');
        overrideStyle.id = 'better42-worse-mode-override';
        overrideStyle.textContent = `
            /* OVERRIDE TOTAL pour mode worse - priorite maximale */
            html body #theme-switcher,
            html body #theme-switcher:hover,
            html body #theme-switcher[style],
            body.dark-theme #theme-switcher,
            body #theme-switcher[style*="background"] {
                background: linear-gradient(135deg, #6b7280, #9ca3af) !important;
                border: 2px solid #6b7280 !important;
                box-shadow: 0 4px 12px rgba(68, 68, 68, 0.3) !important;
                transition: none !important;
            }
            
            html body #settings-btn,
            html body #settings-btn:hover,
            html body #settings-btn[style],
            body.dark-theme #settings-btn,
            body #settings-btn[style*="background"] {
                display: none !important;
            }
            
            /* Redefinir les variables CSS pour qu'elles soient grises */
            :root {
                --better42-primary: #6b7280 !important;
                --better42-primary-light: #9ca3af !important;
                --better42-primary-lighter: #d1d5db !important;
            }
        `;
        document.head.appendChild(overrideStyle);
        
        const themeBtn = document.getElementById('theme-switcher');
        const settingsBtn = document.getElementById('settings-btn');
        
        if (themeBtn) {
            themeBtn.style.cssText = `
                position: fixed !important;
                top: 10px !important;
                right: 180px !important;
                z-index: 10000 !important;
                background: linear-gradient(135deg, #6b7280, #9ca3af) !important;
                color: white !important;
                border: 2px solid #6b7280 !important;
                padding: 10px 16px !important;
                border-radius: 8px !important;
                cursor: pointer !important;
                font-size: 14px !important;
                font-weight: 600 !important;
                box-shadow: 0 4px 12px rgba(68, 68, 68, 0.3) !important;
                transition: none !important;
            `;
        }
        
        if (settingsBtn) {
            settingsBtn.style.display = 'none !important';
        }
    }
}

window.ThemeManager = new ThemeManager();