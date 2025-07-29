class ThemeManager {
    constructor() {
        this.isDark = false;
        this.observer = null;
        this.intervalId = null;
    }

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

    activateDarkMode() {
        document.body.classList.add('dark-theme');
        this.isDark = true;
        localStorage.setItem(Better42Config.STORAGE_KEYS.USER_MODE_PREFERENCE, 'better');
        
        if (window.ColorThemeManager) {
            window.ColorThemeManager.init();
        }
        
        this.updateLogtime();
        this.updateButtonColors(); // Ajout de la méthode
        this.startLogtimeWatcher();
        
        if (window.LogtimeStatsManager) {
            setTimeout(() => {
                window.LogtimeStatsManager.init();
            }, 500);
        }
        
        // Restaurer les images du profil par défaut
        setTimeout(() => {
            window.ProfileManager.loadDefaultProfileOnStartup();
        }, 200);
    }

    activateDarkModeWithoutSaving() {
        document.body.classList.add('dark-theme');
        this.isDark = true;
        
        if (window.ColorThemeManager) {
            window.ColorThemeManager.init();
        }
        
        this.updateLogtime();
        this.updateButtonColors(); // Ajout de la méthode
        this.startLogtimeWatcher();
        
        if (window.LogtimeStatsManager) {
            setTimeout(() => {
                window.LogtimeStatsManager.init();
            }, 500);
        }
        
        // Restaurer les images du profil par défaut
        setTimeout(() => {
            window.ProfileManager.loadDefaultProfileOnStartup();
        }, 200);
    }

    deactivateDarkMode() {
        console.log('🌙 Désactivation du mode sombre...');
        
        document.body.classList.remove('dark-theme');
        this.isDark = false;
        
        // ✅ 1. Nettoyer les personnalisations d'images PROPREMENT
        if (window.BackgroundManager) {
            window.BackgroundManager.removeAllCustomizations(); // ✅ Nouvelle méthode sans reload
        }
        
        // ✅ 2. Restaurer le logtime
        this.restoreLogtime();
        this.stopLogtimeWatcher();
        
        // ✅ 3. Restaurer les éléments SVG stroke-legacy-main et fill-legacy-main
        this.restoreLegacyElements();
        
        // ✅ 4. Nettoyer les couleurs des boutons
        this.restoreButtonColors();
        
        // ✅ 5. Détruire LogtimeStatsManager
        if (window.LogtimeStatsManager) {
            window.LogtimeStatsManager.destroy();
        }
        
        // ✅ 6. Détruire TimeRemainingManager
        if (window.TimeRemainingManager) {
            window.TimeRemainingManager.destroy();
        }
        
        // ✅ 7. Sauvegarder les préférences
        localStorage.setItem(Better42Config.STORAGE_KEYS.USER_MODE_PREFERENCE, 'worse');
        localStorage.setItem(Better42Config.STORAGE_KEYS.FORCE_WORSE_MODE, 'true');
        
        // ✅ 8. Ne plus appeler removeCustomizations() qui fait un reload
        // window.BackgroundManager.removeCustomizations(); // ❌ SUPPRIMÉ
        
        console.log('✅ Mode sombre désactivé proprement');
    }

    toggleTheme() {
        if (this.isDark) {
            this.deactivateDarkMode();
        } else {
            this.activateDarkMode();
        }
        
        // Notifier le ClusterMapManager du changement de thème
        if (window.ClusterMapManager) {
            setTimeout(() => {
                window.ClusterMapManager.onThemeChange();
            }, 100);
        }
    }

    getCurrentThemeColor() {
        // Récupérer directement depuis le localStorage pour éviter les problèmes de timing
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
        
        // Couleurs des thèmes prédéfinis
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
        
        return '92, 5, 143'; // Fallback violet
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // MÉTHODE MANQUANTE AJOUTÉE
    updateButtonColors() {
        // Mettre à jour les couleurs des boutons selon le thème actuel
        const currentColor = this.getCurrentThemeColor();
        
        // Mettre à jour les boutons de l'interface
        const themeBtn = document.getElementById('theme-switcher');
        const settingsBtn = document.getElementById('settings-btn');
        
        if (this.isDark) {
            if (settingsBtn) {
                settingsBtn.style.background = `linear-gradient(135deg, rgb(${currentColor}), rgba(${currentColor}, 0.8))`;
                settingsBtn.style.boxShadow = `0 4px 12px rgba(${currentColor}, 0.3)`;
                settingsBtn.style.borderColor = `rgba(${currentColor}, 0.8)`;
            }
        }
        
        // Mettre à jour d'autres éléments colorés si nécessaire
        this.updateColoredElements(currentColor);
    }

    updateColoredElements(currentColor) {
        // Mettre à jour les éléments avec des couleurs dynamiques
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
        // Restaurer tous les éléments avec des couleurs custom vers la couleur teal originale
        const allColoredElements = document.querySelectorAll('[style*="rgba("]');
        
        allColoredElements.forEach(el => {
            const style = el.getAttribute('style');
            if (!style) return;
            
            // Patterns pour toutes les couleurs de thème personnalisées
            const customColorPatterns = [
                /rgba\(92, 5, 143, ([\d\.]+)\)/g,      // violet
                /rgba\(30, 64, 175, ([\d\.]+)\)/g,      // bleu
                /rgba\(190, 24, 93, ([\d\.]+)\)/g,      // rose
                /rgba\(5, 150, 105, ([\d\.]+)\)/g,      // vert
                /rgba\(229, 229, 229, ([\d\.]+)\)/g,    // blanc
                /rgba\(234, 88, 12, ([\d\.]+)\)/g,      // orange
                /rgba\(220, 38, 38, ([\d\.]+)\)/g,      // rouge
                /rgba\(8, 145, 178, ([\d\.]+)\)/g,      // cyan
                // Patterns pour couleurs custom (n'importe quels RGB sauf teal)
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

    restoreLegacyElements() {
        // Restaurer stroke-legacy-main vers la couleur teal originale
        const strokeElements = document.querySelectorAll('.stroke-legacy-main');
        strokeElements.forEach(el => {
            el.style.stroke = '';
            // Retirer le style inline pour revenir au CSS original
        });
        
        // Restaurer fill-legacy-main vers la couleur teal originale  
        const fillElements = document.querySelectorAll('.fill-legacy-main');
        fillElements.forEach(el => {
            el.style.fill = '';
            el.style.color = '';
        });
        
        // Restaurer text-legacy-main
        const textElements = document.querySelectorAll('.text-legacy-main');
        textElements.forEach(el => {
            el.style.color = '';
        });
        
        // Restaurer border-legacy-main
        const borderElements = document.querySelectorAll('.border-legacy-main');
        borderElements.forEach(el => {
            el.style.borderColor = '';
        });
    }

    restoreButtonColors() {
        // Restaurer les couleurs des boutons de l'interface
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
                this.updateButtonColors(); // Ajout de la méthode
                
                if (window.LogtimeStatsManager) {
                    window.LogtimeStatsManager.refresh();
                }
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

    forceCleanupForWorseMode() {
        // 1. Supprimer IMMÉDIATEMENT toutes les variables CSS violettes
        const rootStyle = document.documentElement.style;
        rootStyle.removeProperty('--better42-purple');
        rootStyle.removeProperty('--better42-purple-light');
        rootStyle.removeProperty('--better42-purple-lighter');
        
        // 2. Supprimer TOUS les styles injectés par Better42
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

        // 3. Nettoyer tous les éléments directement ET restaurer les images par défaut
        const bgSelector = '.w-full.xl\\:h-72.bg-center.bg-cover.bg-ft-black, .w-full.xl\\:h-72.bg-center.bg-cover';
        const pfpSelector = '.w-52.h-52.text-black.md\\:w-40.md\\:h-40.lg\\:h-28.lg\\:w-28.bg-cover.bg-no-repeat.bg-center.rounded-full';
        
        document.querySelectorAll(`${bgSelector}, ${pfpSelector}`).forEach(el => {
            // Nettoyer complètement l'élément
            el.removeAttribute('style');
            
            // Supprimer les iframes YouTube
            el.querySelectorAll('iframe').forEach(iframe => iframe.remove());
            
            // Restaurer le contenu original
            const wrappedContent = el.querySelector('div[style*="z-index:2"]');
            if (wrappedContent) {
                el.innerHTML = wrappedContent.innerHTML;
            }
            
            // FORCER la réapplication des styles CSS par défaut
            const originalDisplay = el.style.display;
            el.style.display = 'none';
            el.offsetHeight; // Force reflow
            el.style.display = originalDisplay;
            
            // Forcer les classes à se réappliquer
            const classes = el.className;
            el.className = '';
            el.offsetHeight; // Force reflow
            el.className = classes;
        });

        // 4. INJECTER un CSS override ultra-fort pour écraser le CSS statique
        const overrideStyle = document.createElement('style');
        overrideStyle.id = 'better42-worse-mode-override';
        overrideStyle.textContent = `
            /* OVERRIDE TOTAL pour mode worse - priorité maximale */
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
            
            /* Redéfinir les variables CSS pour qu'elles soient grises */
            :root {
                --better42-purple: #6b7280 !important;
                --better42-purple-light: #9ca3af !important;
                --better42-purple-lighter: #d1d5db !important;
            }
        `;
        document.head.appendChild(overrideStyle);
        
        // 5. Forcer aussi les styles inline en backup
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