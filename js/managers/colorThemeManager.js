class ColorThemeManager {
    constructor() {
        this.logtimeObserver = null;
        this.themes = {
            catppuccinMacchiato: {
                name: '🍵 Catppuccin Macchiato',
                primary: '#c6a0f6',
                primaryLight: '#d2b1f9',
                primaryLighter: '#ddc3fc',
                primaryDark: '#b38fe8',
                primaryDarker: '#a07ed9',
                primaryAlpha: 'rgba(198, 160, 246, 0.3)',
                primaryAlphaLight: 'rgba(198, 160, 246, 0.1)',
                bgDark: '#24273a',
                bgSecondary: '#363a4f',
                textLight: '#cad3f5',
                textWhite: '#f4dbd6'
            }
        };

        this.currentTheme = 'catppuccinMacchiato';
    }

    // GET CURRENT ACTIVE THEME NAME
    getCurrentTheme() {
        const theme = localStorage.getItem('better42-color-theme') || 'catppuccinMacchiato';
        return theme;
    }

    // SET AND SAVE CURRENT THEME
    setCurrentTheme(themeName) {
        this.currentTheme = themeName;
        localStorage.setItem('better42-color-theme', themeName);
    }

    // APPLY THEME TO INTERFACE
    applyTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) {
            return;
        }

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
                    window.UIManager.lastButtonState = null;
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

    // UPDATE LOGTIME ELEMENT COLORS
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

    // GENERATE CSS FOR THEME
    generateThemeCSS(theme) {
        return `
            :root {
                --better42-primary: ${theme.primary} !important;
                --better42-primary-light: ${theme.primaryLight} !important;
                --better42-primary-lighter: ${theme.primaryLighter} !important;
                --better42-primary-dark: ${theme.primaryDark} !important;
                --better42-primary-darker: ${theme.primaryDarker} !important;
                --better42-primary-dark-alpha: ${theme.primaryAlpha} !important;
                --better42-primary-alpha-dark: ${theme.primaryAlphaLight} !important;
                ${theme.bgDark ? `--better42-bg-dark: ${theme.bgDark} !important;` : ''}
                ${theme.bgSecondary ? `--better42-bg-secondary: ${theme.bgSecondary} !important;` : ''}
                ${theme.textLight ? `--better42-text-light: ${theme.textLight} !important;` : ''}
                ${theme.textWhite ? `--better42-text-white: ${theme.textWhite} !important;` : ''}
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

    // LOAD PREVIOUSLY SAVED THEME
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

    // CREATE COLOR SELECTOR UI
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

    // ATTACH EVENT LISTENERS TO COLOR SELECTOR
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
            const selectedColor = colorPicker.value;

            this.applyCustomColor(selectedColor);

            colorButtons.forEach(b => b.classList.remove('active'));

            setTimeout(() => {
                const hex = selectedColor.replace('#', '');
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                const tempColor = `${r}, ${g}, ${b}`;

                if (window.LogtimeStatsManager) {
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

                if (window.ThemeManager && window.ThemeManager.updateButtonColors) {
                    window.ThemeManager.updateButtonColors();
                }

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
            const selectedColor = colorPicker.value;
            localStorage.setItem('better42-custom-color', selectedColor);
            this.applyCustomColor(selectedColor);

            colorButtons.forEach(b => b.classList.remove('active'));

            if (window.LogtimeStatsManager) {
                setTimeout(() => {
                    window.LogtimeStatsManager.updateButtonColors();
                }, 150);
            }

            if (window.ThemeManager && window.ThemeManager.updateButtonColors) {
                setTimeout(() => {
                    window.ThemeManager.updateButtonColors();
                }, 150);
            }

            alert('💾 Couleur personnalisée sauvegardée !');
        });
    }

    // APPLY CUSTOM COLOR THEME
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
                    window.UIManager.lastButtonState = null;
                    window.UIManager.enforceButtonPositions();
                }
                // Mettre à jour les totaux du logtime
                if (window.LogtimeStatsManager) {
                    window.LogtimeStatsManager.refresh();
                }
            }, 50);
        }

        document.dispatchEvent(new CustomEvent('better42-color-changed', {
            detail: { color: hexColor }
        }));

        localStorage.setItem('better42-color-theme', 'custom');
        this.currentTheme = 'custom';
    }

    // GENERATE CUSTOM THEME FROM BASE COLOR
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

    // LIGHTEN HEX COLOR BY PERCENTAGE
    lightenColor(hex, percent) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return hex;

        const factor = 1 + (percent / 100);
        const r = Math.min(255, Math.round(rgb.r * factor));
        const g = Math.min(255, Math.round(rgb.g * factor));
        const b = Math.min(255, Math.round(rgb.b * factor));

        return this.rgbToHex(r, g, b);
    }

    // DARKEN HEX COLOR BY PERCENTAGE
    darkenColor(hex, percent) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return hex;

        const factor = 1 - (percent / 100);
        const r = Math.max(0, Math.round(rgb.r * factor));
        const g = Math.max(0, Math.round(rgb.g * factor));
        const b = Math.max(0, Math.round(rgb.b * factor));

        return this.rgbToHex(r, g, b);
    }

    // CONVERT RGB VALUES TO HEX
    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
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

    // INITIALIZE COLOR THEME MANAGER
    init() {
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

    // START OBSERVING LOGTIME CHANGES
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

    // CHECK IF ELEMENT HAS LOGTIME COLORS
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

    // FORCE INITIAL LOGTIME COLOR CHECK
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
                }
            }, delay);
        });
    }

    // CREATE COLOR THEME UI
    createUI() {
        const colorSection = this.createColorSelector();
        this.attachColorSelectorEvents(colorSection);
        return colorSection;
    }

    // GET CURRENT THEME AS RGB STRING
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

    // RESET THEME TO DEFAULT VALUES
    resetToDefaults() {
        localStorage.removeItem('better42-color-theme');

        this.currentTheme = 'violet';
        this.applyTheme('violet');

        alert('🎨 Couleurs remises par défaut (Violet) !');

        return true;
    }

    // GET THEME STATISTICS
    getThemeStats() {
        return {
            currentTheme: this.getCurrentTheme(),
            availableThemes: Object.keys(this.themes),
            themeCount: Object.keys(this.themes).length
        };
    }
}

window.ColorThemeManager = new ColorThemeManager();
