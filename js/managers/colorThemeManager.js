class ColorThemeManager {
    constructor() {
        this.logtimeObserver = null;
        this.themes = {
            violet: {
                name: 'Violet',
                primary: '#5c058f',
                primaryLight: '#7d1aaa',
                primaryLighter: '#9d2acc',
                primaryDark: '#430169',
                primaryDarker: '#2a0241',
                primaryAlpha: 'rgba(92, 5, 143, 0.3)',
                primaryAlphaLight: 'rgba(92, 5, 143, 0.1)'
            },
            blanc: {
                name: 'Blanc',
                primary: '#e5e5e5',
                primaryLight: '#f0f0f0',
                primaryLighter: '#f8f8f8',
                primaryDark: '#d0d0d0',
                primaryDarker: '#b8b8b8',
                primaryAlpha: 'rgba(229, 229, 229, 0.3)',
                primaryAlphaLight: 'rgba(229, 229, 229, 0.1)'
            },
            bleu: {
                name: 'Bleu',
                primary: '#1e40af',
                primaryLight: '#3b82f6',
                primaryLighter: '#60a5fa',
                primaryDark: '#1e3a8a',
                primaryDarker: '#1d2f5a',
                primaryAlpha: 'rgba(30, 64, 175, 0.3)',
                primaryAlphaLight: 'rgba(30, 64, 175, 0.1)'
            },
            rose: {
                name: 'Rose',
                primary: '#be185d',
                primaryLight: '#ec4899',
                primaryLighter: '#f472b6',
                primaryDark: '#9d174d',
                primaryDarker: '#6b1138',
                primaryAlpha: 'rgba(190, 24, 93, 0.3)',
                primaryAlphaLight: 'rgba(190, 24, 93, 0.1)'
            },
            vert: {
                name: 'Vert',
                primary: '#059669',
                primaryLight: '#10b981',
                primaryLighter: '#34d399',
                primaryDark: '#047857',
                primaryDarker: '#064e3b',
                primaryAlpha: 'rgba(5, 150, 105, 0.3)',
                primaryAlphaLight: 'rgba(5, 150, 105, 0.1)'
            },
            orange: {
                name: 'Orange',
                primary: '#ea580c',
                primaryLight: '#f97316',
                primaryLighter: '#fb923c',
                primaryDark: '#c2410c',
                primaryDarker: '#9a3412',
                primaryAlpha: 'rgba(234, 88, 12, 0.3)',
                primaryAlphaLight: 'rgba(234, 88, 12, 0.1)'
            },
            rouge: {
                name: 'Rouge',
                primary: '#dc2626',
                primaryLight: '#ef4444',
                primaryLighter: '#f87171',
                primaryDark: '#b91c1c',
                primaryDarker: '#991b1b',
                primaryAlpha: 'rgba(220, 38, 38, 0.3)',
                primaryAlphaLight: 'rgba(220, 38, 38, 0.1)'
            },
            cyan: {
                name:  'Cyan',
                primary: '#0891b2',
                primaryLight: '#06b6d4',
                primaryLighter: '#22d3ee',
                primaryDark: '#0e7490',
                primaryDarker: '#164e63',
                primaryAlpha: 'rgba(8, 145, 178, 0.3)',
                primaryAlphaLight: 'rgba(8, 145, 178, 0.1)'
            }
        };
        
        this.currentTheme = 'violet';
    }

    getCurrentTheme() {
        return localStorage.getItem('better42-color-theme') || 'violet';
    }

    setCurrentTheme(themeName) {
        this.currentTheme = themeName;
        localStorage.setItem('better42-color-theme', themeName);
    }

    applyTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;

        const oldStyleElement = document.getElementById('dynamic-color-theme');
        if (oldStyleElement) {
            oldStyleElement.remove();
        }

        const styleElement = document.createElement('style');
        styleElement.id = 'dynamic-color-theme';
        styleElement.textContent = this.generateThemeCSS(theme);
        document.head.appendChild(styleElement);

        this.updateLogtimeColors(theme);

        if (window.ThemeManager && window.ThemeManager.isDark) {
            setTimeout(() => {
                window.ThemeManager.updateLogtime();
                // Forcer la mise à jour des boutons UI immédiatement
                if (window.UIManager) {
                    window.UIManager.lastButtonState = null; // Reset pour forcer la mise à jour
                    window.UIManager.enforceButtonPositions();
                }
                // Mettre à jour les totaux du logtime
                if (window.LogtimeStatsManager) {
                    window.LogtimeStatsManager.refresh();
                }
            }, 50);
        }

        this.setCurrentTheme(themeName);
    }

    updateLogtimeColors(theme) {
        const primaryRgb = theme.primary.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ');
        const allLogtimeCases = document.querySelectorAll('.bg-slate-50.w-4.h-4[style*="background-color"]');
        
        allLogtimeCases.forEach(el => {
            const style = el.getAttribute('style');
            if (style && style.includes('background-color')) {
                let newStyle = style
                    .replace(/background-color: rgb\(0, 186, 188\)/g, `background-color: rgb(${primaryRgb})`)
                    .replace(/rgba\(0, 186, 188, ([0-9.]+)\)/g, `rgba(${primaryRgb}, $1)`)
                    .replace(/background-color: rgb\([0-9, ]+\)/g, `background-color: rgb(${primaryRgb})`)
                    .replace(/background-color: rgba\([0-9, ]+, ([0-9.]+)\)/g, `background-color: rgba(${primaryRgb}, $1)`);
                
                el.setAttribute('style', newStyle);
            }
        });
        
    }

    generateThemeCSS(theme) {
        return `
            :root {
                --better42-purple: ${theme.primary} !important;
                --better42-purple-light: ${theme.primaryLight} !important;
                --better42-purple-lighter: ${theme.primaryLighter} !important;
                --better42-purple-dark: ${theme.primaryDark} !important;
                --better42-purple-darker: ${theme.primaryDarker} !important;
                --better42-purple-alpha: ${theme.primaryAlpha} !important;
                --better42-purple-alpha-light: ${theme.primaryAlphaLight} !important;
            }

            body.dark-theme .text-center.text-legacy-main.bg-transparent.border.border-legacy-main.py-1\\.5.px-2.cursor-pointer.text-xs.uppercase,
            body.dark-theme .text-center.text-legacy-main.bg-transparent.border.border-legacy-main.py-1\\.5.px-1.cursor-pointer.text-xs.uppercase {
                color: ${theme.primary} !important;
                border-color: ${theme.primary} !important;
            }

            body.dark-theme .block.px-2\\.5.py-2.font-medium.hover\\:text-teal-700.text-legacy-main {
                color: ${theme.primary} !important;
            }

            body.dark-theme .text-legacy-main.hover\\:underline {
                color: ${theme.primary} !important;
            }

            body.dark-theme .cursor-pointer.text-xs.uppercase.font-bold.hover\\:text-legacy-main.text-legacy-main {
                color: ${theme.primary} !important;
            }

            body.dark-theme .font-bold.text-legacy-main {
                color: ${theme.primary} !important;
            }

            body.dark-theme svg[stroke="hsl(var(--legacy-main))"] {
                stroke: ${theme.primary} !important;
            }

            body.dark-theme .fill-legacy-main {
                fill: ${theme.primary} !important;
            }

            body.dark-theme .stroke-legacy-main {
                stroke: ${theme.primary} !important;
            }

            body.dark-theme #theme-switcher {
                background: linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight}) !important;
                box-shadow: 0 4px 12px ${theme.primaryAlpha} !important;
            }

            body.dark-theme #theme-switcher:hover {
                background: linear-gradient(135deg, ${theme.primaryLight}, ${theme.primaryLighter}) !important;
                box-shadow: 0 6px 20px ${theme.primaryAlpha} !important;
            }

            body.dark-theme #settings-btn {
                background: linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight}) !important;
                border-color: ${theme.primaryLight} !important;
                box-shadow: 0 4px 12px ${theme.primaryAlpha} !important;
            }

            body.dark-theme #settings-btn:hover {
                background: linear-gradient(135deg, ${theme.primaryLight}, ${theme.primaryLighter}) !important;
                border-color: ${theme.primaryLighter} !important;
                box-shadow: 0 6px 20px ${theme.primaryAlpha} !important;
            }
        `;
    }

    loadSavedTheme() {
        const savedTheme = this.getCurrentTheme();
        if (savedTheme && this.themes[savedTheme]) {
            this.applyTheme(savedTheme);
        } else {
            const defaultTheme = this.themes['violet'];
            if (defaultTheme) {
                this.updateLogtimeColors(defaultTheme);
            }
        }
    }

    createColorSelector() {
        const colorSection = document.createElement('div');
        colorSection.className = 'settings-section';
        colorSection.innerHTML = `
            <h4>🎨 Couleurs</h4>
            <div class="color-theme-grid">
                ${Object.keys(this.themes).map(themeKey => {
                    const theme = this.themes[themeKey];
                    return `
                        <button class="color-theme-btn" data-theme="${themeKey}" style="background: linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight})">
                            ${theme.name}
                        </button>
                    `;
                }).join('')}
            </div>
            
            <div class="custom-color-section">
                <h5>🎨 Couleur Personnalisée</h5>
                <div class="custom-color-row">
                    <input type="color" id="custom-color-picker" value="#5c058f" title="Choisir une couleur">
                    <button id="apply-custom-color" class="apply-custom-btn">Appliquer</button>
                    <button id="save-custom-color" class="save-custom-btn">💾 Sauver</button>
                </div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .color-theme-grid {
                display: flex !important;
                flex-wrap: wrap !important;
                gap: 12px !important;
                margin-top: 15px !important;
                justify-content: center !important;
            }

            .color-theme-btn {
                flex: 0 1 auto !important;
                min-width: 120px !important;
            }

            @media (max-width: 1024px) {
                .color-theme-grid {
                    gap: 10px !important;
                }
                .color-theme-btn {
                    min-width: 110px !important;
                }
            }

            @media (max-width: 768px) {
                .color-theme-grid {
                    gap: 8px !important;
                }
                .color-theme-btn {
                    min-width: 100px !important;
                    flex: 1 1 calc(50% - 4px) !important;
                }
            }

            @media (max-width: 480px) {
                .color-theme-grid {
                    gap: 6px !important;
                }
                .color-theme-btn {
                    min-width: 90px !important;
                    flex: 1 1 calc(50% - 3px) !important;
                    font-size: 11px !important;
                    padding: 12px 8px !important;
                }
            }

            .color-theme-btn:not(.responsive-override) {
                padding: 14px 16px !important;
                border: 2px solid transparent !important;
                border-radius: 12px !important;
                cursor: pointer !important;
                color: white !important;
                font-weight: 600 !important;
                font-size: 13px !important;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                text-shadow: 0 1px 3px rgba(0,0,0,0.6) !important;
                text-align: center !important;
                position: relative !important;
                overflow: hidden !important;
                backdrop-filter: blur(10px) !important;
            }

            .color-theme-btn::before {
                content: '' !important;
                position: absolute !important;
                top: 0 !important;
                left: -100% !important;
                width: 100% !important;
                height: 100% !important;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent) !important;
                transition: left 0.6s !important;
            }

            .color-theme-btn:hover::before {
                left: 100% !important;
            }

            .color-theme-btn:hover {
                transform: translateY(-3px) scale(1.02) !important;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4) !important;
                border-color: rgba(255, 255, 255, 0.3) !important;
            }

            .color-theme-btn.active {
                border-color: rgba(255, 255, 255, 0.8) !important;
                transform: scale(1.05) !important;
                box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.4), 0 8px 25px rgba(0, 0, 0, 0.5) !important;
            }

            .color-theme-btn.active::after {
                content: '✓' !important;
                position: absolute !important;
                top: 6px !important;
                right: 8px !important;
                background: rgba(255, 255, 255, 0.95) !important;
                color: #000 !important;
                border-radius: 50% !important;
                width: 20px !important;
                height: 20px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 12px !important;
                font-weight: bold !important;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3) !important;
            }

            .custom-color-section {
                margin-top: 20px !important;
                padding: 15px !important;
                background: rgba(255, 255, 255, 0.03) !important;
                border-radius: 10px !important;
                border: 1px solid rgba(255, 255, 255, 0.08) !important;
                backdrop-filter: blur(5px) !important;
            }

            .custom-color-section h5 {
                color: white !important;
                font-size: 14px !important;
                font-weight: 600 !important;
                margin-bottom: 10px !important;
                text-align: center !important;
            }

            .custom-color-row {
                display: flex !important;
                gap: 10px !important;
                align-items: center !important;
                justify-content: center !important;
                flex-wrap: wrap !important;
            }

            @media (max-width: 480px) {
                .custom-color-row {
                    flex-direction: column !important;
                    gap: 8px !important;
                }
                
                .custom-color-row > * {
                    width: 100% !important;
                    max-width: 200px !important;
                }
            }

            #custom-color-picker {
                width: 50px !important;
                height: 40px !important;
                border: 2px solid rgba(255, 255, 255, 0.3) !important;
                border-radius: 8px !important;
                cursor: pointer !important;
                background: none !important;
            }

            .apply-custom-btn {
                background: linear-gradient(135deg, #059669, #10b981) !important;
                color: white !important;
                border: none !important;
                padding: 8px 16px !important;
                border-radius: 6px !important;
                cursor: pointer !important;
                font-weight: 600 !important;
                font-size: 12px !important;
                transition: all 0.3s ease !important;
            }

            .apply-custom-btn:hover {
                background: linear-gradient(135deg, #10b981, #34d399) !important;
                transform: translateY(-1px) !important;
            }

            .save-custom-btn {
                background: linear-gradient(135deg, #1e40af, #3b82f6) !important;
                color: white !important;
                border: none !important;
                padding: 8px 16px !important;
                border-radius: 6px !important;
                cursor: pointer !important;
                font-weight: 600 !important;
                font-size: 12px !important;
                transition: all 0.3s ease !important;
            }

            .save-custom-btn:hover {
                background: linear-gradient(135deg, #3b82f6, #60a5fa) !important;
                transform: translateY(-1px) !important;
            }
        `;
        document.head.appendChild(style);

        return colorSection;
    }

    attachColorSelectorEvents(colorSection) {
        const colorButtons = colorSection.querySelectorAll('.color-theme-btn');
        
        const currentTheme = this.getCurrentTheme();
        colorButtons.forEach(btn => {
            if (btn.dataset.theme === currentTheme) {
                btn.classList.add('active');
            }
            
            btn.addEventListener('click', (e) => {
                colorButtons.forEach(b => b.classList.remove('active'));
                
                e.target.classList.add('active');
                
                const themeName = e.target.dataset.theme;
                this.applyTheme(themeName);
            });
        });

        const colorPicker = colorSection.querySelector('#custom-color-picker');
        const applyBtn = colorSection.querySelector('#apply-custom-color');
        const saveBtn = colorSection.querySelector('#save-custom-color');

        const savedCustomColor = localStorage.getItem('better42-custom-color');
        if (savedCustomColor) {
            colorPicker.value = savedCustomColor;
        }

        applyBtn.addEventListener('click', () => {
            console.log('🔴 Bouton Appliquer cliqué (temporaire)');
            const selectedColor = colorPicker.value;
            
            // Appliquer temporairement SANS sauvegarder
            this.applyCustomColor(selectedColor);
            
            colorButtons.forEach(b => b.classList.remove('active'));
            
            // Forcer la mise à jour avec la couleur temporaire
            setTimeout(() => {
                // Calculer la couleur RGB à partir du hex
                const hex = selectedColor.replace('#', '');
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                const tempColor = `${r}, ${g}, ${b}`;
                
                // Mettre à jour logtime avec couleur temporaire
                if (window.LogtimeStatsManager) {
                    console.log('🔴 Mise à jour logtime temporaire:', tempColor);
                    document.querySelectorAll('.monthly-stats-btn').forEach(btn => {
                        btn.style.background = `rgba(${tempColor}, 0.1)`;
                        btn.style.borderColor = `rgba(${tempColor}, 0.3)`;
                        btn.style.color = `rgb(${tempColor})`;
                    });
                    document.querySelectorAll('.weekly-stats-btn').forEach(btn => {
                        btn.style.background = `rgba(${tempColor}, 0.15)`;
                        btn.style.borderColor = `rgba(${tempColor}, 0.3)`;
                        btn.style.color = `rgb(${tempColor})`;
                    });
                }
                
                // Mettre à jour boutons UI temporairement
                if (window.ThemeManager && window.ThemeManager.updateButtonColors) {
                    console.log('🔴 Mise à jour boutons UI temporaire:', tempColor);
                    window.ThemeManager.updateButtonColors();
                }
                
                // Mettre à jour directement le bouton Worse/Better
                const themeBtn = document.getElementById('theme-switcher');
                const settingsBtn = document.getElementById('settings-btn');
                if (themeBtn) {
                    themeBtn.style.background = `linear-gradient(135deg, rgb(${tempColor}), rgba(${tempColor}, 0.8))`;
                    themeBtn.style.borderColor = `rgba(${tempColor}, 0.8)`;
                    themeBtn.style.boxShadow = `0 4px 12px rgba(${tempColor}, 0.3)`;
                }
                if (settingsBtn) {
                    settingsBtn.style.background = `linear-gradient(135deg, rgb(${tempColor}), rgba(${tempColor}, 0.8))`;
                    settingsBtn.style.borderColor = `rgba(${tempColor}, 0.8)`;
                    settingsBtn.style.boxShadow = `0 4px 12px rgba(${tempColor}, 0.3)`;
                }
            }, 150);
        });

        saveBtn.addEventListener('click', () => {
            console.log('🟢 Bouton Sauver cliqué');
            const selectedColor = colorPicker.value;
            localStorage.setItem('better42-custom-color', selectedColor);
            this.applyCustomColor(selectedColor);
            
            colorButtons.forEach(b => b.classList.remove('active'));
            
            // Forcer la mise à jour des boutons logtime ET boutons UI
            if (window.LogtimeStatsManager) {
                console.log('🟢 LogtimeStatsManager trouvé, mise à jour couleurs...');
                setTimeout(() => {
                    window.LogtimeStatsManager.updateButtonColors();
                }, 150);
            } else {
                console.log('🟢 LogtimeStatsManager non trouvé !');
            }
            
            // Mettre à jour les boutons engrenage/better/worse
            if (window.ThemeManager && window.ThemeManager.updateButtonColors) {
                console.log('🟢 ThemeManager trouvé, mise à jour boutons UI...');
                setTimeout(() => {
                    window.ThemeManager.updateButtonColors();
                }, 150);
            }
            
            alert('💾 Couleur personnalisée sauvegardée !');
        });

        // Supprimé: mise à jour en temps réel pour éviter les bugs/crashes
    }

    applyCustomColor(hexColor) {
        const customTheme = this.generateCustomTheme(hexColor);
        
        const oldStyleElement = document.getElementById('dynamic-color-theme');
        if (oldStyleElement) {
            oldStyleElement.remove();
        }

        const styleElement = document.createElement('style');
        styleElement.id = 'dynamic-color-theme';
        styleElement.textContent = this.generateThemeCSS(customTheme);
        document.head.appendChild(styleElement);

        this.updateLogtimeColors(customTheme);

        if (window.ThemeManager && window.ThemeManager.isDark) {
            setTimeout(() => {
                window.ThemeManager.updateLogtime();
                // Forcer la mise à jour des boutons UI immédiatement
                if (window.UIManager) {
                    window.UIManager.lastButtonState = null; // Reset pour forcer la mise à jour
                    window.UIManager.enforceButtonPositions();
                }
                // Mettre à jour les totaux du logtime
                if (window.LogtimeStatsManager) {
                    window.LogtimeStatsManager.refresh();
                }
            }, 50);
        }

        // Déclencher l'événement de changement de couleur
        document.dispatchEvent(new CustomEvent('better42-color-changed', {
            detail: { color: hexColor }
        }));

        localStorage.setItem('better42-color-theme', 'custom');
        this.currentTheme = 'custom';
    }

    generateCustomTheme(baseColor) {
        const rgb = this.hexToRgb(baseColor);
        if (!rgb) return this.themes.violet;

        const lighter = this.lightenColor(baseColor, 20);
        const evenLighter = this.lightenColor(baseColor, 40);
        const darker = this.darkenColor(baseColor, 20);
        const evenDarker = this.darkenColor(baseColor, 40);

        return {
            name: 'Custom',
            primary: baseColor,
            primaryLight: lighter,
            primaryLighter: evenLighter,
            primaryDark: darker,
            primaryDarker: evenDarker,
            primaryAlpha: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`,
            primaryAlphaLight: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`
        };
    }

    lightenColor(hex, percent) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return hex;

        const factor = 1 + (percent / 100);
        const r = Math.min(255, Math.round(rgb.r * factor));
        const g = Math.min(255, Math.round(rgb.g * factor));
        const b = Math.min(255, Math.round(rgb.b * factor));

        return this.rgbToHex(r, g, b);
    }

    darkenColor(hex, percent) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return hex;

        const factor = 1 - (percent / 100);
        const r = Math.max(0, Math.round(rgb.r * factor));
        const g = Math.max(0, Math.round(rgb.g * factor));
        const b = Math.max(0, Math.round(rgb.b * factor));

        return this.rgbToHex(r, g, b);
    }

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    init() {
        // Ne pas appliquer les thèmes de couleur en mode normal
        if (!window.ThemeManager || !window.ThemeManager.isDark) {
            this.startLogtimeObserver();
            return;
        }
        
        const currentTheme = this.getCurrentTheme();
        
        if (currentTheme === 'custom') {
            const savedCustomColor = localStorage.getItem('better42-custom-color');
            if (savedCustomColor) {
                this.applyCustomColor(savedCustomColor);
            }
        } else {
            this.loadSavedTheme();
        }
        
        this.startLogtimeObserver();
        
        this.forceInitialLogtimeCheck();
    }
    
    startLogtimeObserver() {
        if (this.logtimeObserver) {
            this.logtimeObserver.disconnect();
        }
        
        this.logtimeObserver = new MutationObserver((mutations) => {
            let needsUpdate = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (this.hasLogtimeColors(node)) {
                                needsUpdate = true;
                            }
                        }
                    });
                } else if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (this.hasLogtimeColors(mutation.target)) {
                        needsUpdate = true;
                    }
                }
            });
            
            if (needsUpdate) {
                setTimeout(() => {
                    // Ne pas changer les couleurs si on n'est pas en mode sombre
                    if (!window.ThemeManager || !window.ThemeManager.isDark) {
                        return;
                    }
                    
                    const currentTheme = this.getCurrentTheme();
                    if (currentTheme === 'custom') {
                        const savedCustomColor = localStorage.getItem('better42-custom-color');
                        if (savedCustomColor) {
                            const customTheme = this.generateCustomTheme(savedCustomColor);
                            this.updateLogtimeColors(customTheme);
                        }
                    } else if (this.themes[currentTheme]) {
                        this.updateLogtimeColors(this.themes[currentTheme]);
                    } else {
                        this.updateLogtimeColors(this.themes['violet']);
                    }
                }, 100);
            }
        });
        
        this.logtimeObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style']
        });
    }
    
    hasLogtimeColors(element) {
        if (!element.getAttribute) return false;
        
        const style = element.getAttribute('style');
        if (!style) return false;
        
        if (style.includes('rgb(0, 186, 188)') || style.includes('rgba(0, 186, 188,')) {
            if (element.classList.contains('bg-slate-50') && 
                element.classList.contains('w-4') && 
                element.classList.contains('h-4')) {
                return true;
            }
        }
        
        return false;
    }
    
    forceInitialLogtimeCheck() {
        const delays = [500, 1000, 2000, 3000];
        
        delays.forEach(delay => {
            setTimeout(() => {
                // Ne pas changer les couleurs si on n'est pas en mode sombre
                if (!window.ThemeManager || !window.ThemeManager.isDark) {
                    return;
                }
                
                const currentTheme = this.getCurrentTheme();
                let theme;
                
                if (currentTheme === 'custom') {
                    const savedCustomColor = localStorage.getItem('better42-custom-color');
                    if (savedCustomColor) {
                        theme = this.generateCustomTheme(savedCustomColor);
                    }
                } else if (this.themes[currentTheme]) {
                    theme = this.themes[currentTheme];
                } else {
                    theme = this.themes['violet'];
                }
                
                if (theme) {
                    this.updateLogtimeColors(theme);
                    console.log(`🔄 Vérification logtime forcée à ${delay}ms`);
                }
            }, delay);
        });
    }

    createUI() {
        const colorSection = this.createColorSelector();
        this.attachColorSelectorEvents(colorSection);
        return colorSection;
    }

    getCurrentThemeRgb() {
        const currentTheme = this.getCurrentTheme();
        
        if (currentTheme === 'custom') {
            const savedCustomColor = localStorage.getItem('better42-custom-color');
            if (savedCustomColor) {
                const rgb = this.hexToRgb(savedCustomColor);
                if (rgb) {
                    return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
                }
            }
        }
        
        const theme = this.themes[currentTheme];
        if (!theme) return '92, 5, 143';
        
        const hex = theme.primary.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        return `${r}, ${g}, ${b}`;
    }

    resetToDefaults() {
        localStorage.removeItem('better42-color-theme');
        
        this.currentTheme = 'violet';
        this.applyTheme('violet');
        
        alert('🎨 Couleurs remises par défaut (Violet) !');
        
        return true;
    }

    getThemeStats() {
        return {
            currentTheme: this.getCurrentTheme(),
            availableThemes: Object.keys(this.themes),
            themeCount: Object.keys(this.themes).length
        };
    }
}

window.ColorThemeManager = new ColorThemeManager();