// js/colorThemeManager.js

class ColorThemeManager {
    constructor() {
        this.themes = {
            violet: {
                name: '💜 Violet',
                primary: '#5c058f',
                primaryLight: '#7d1aaa',
                primaryLighter: '#9d2acc',
                primaryDark: '#430169',
                primaryDarker: '#2a0241',
                primaryAlpha: 'rgba(92, 5, 143, 0.3)',
                primaryAlphaLight: 'rgba(92, 5, 143, 0.1)'
            },
            blanc: {
                name: '🤍 Blanc',
                primary: '#e5e5e5',
                primaryLight: '#f0f0f0',
                primaryLighter: '#f8f8f8',
                primaryDark: '#d0d0d0',
                primaryDarker: '#b8b8b8',
                primaryAlpha: 'rgba(229, 229, 229, 0.3)',
                primaryAlphaLight: 'rgba(229, 229, 229, 0.1)'
            },
            bleu: {
                name: '💙 Bleu',
                primary: '#1e40af',
                primaryLight: '#3b82f6',
                primaryLighter: '#60a5fa',
                primaryDark: '#1e3a8a',
                primaryDarker: '#1d2f5a',
                primaryAlpha: 'rgba(30, 64, 175, 0.3)',
                primaryAlphaLight: 'rgba(30, 64, 175, 0.1)'
            },
            rose: {
                name: '💗 Rose',
                primary: '#be185d',
                primaryLight: '#ec4899',
                primaryLighter: '#f472b6',
                primaryDark: '#9d174d',
                primaryDarker: '#6b1138',
                primaryAlpha: 'rgba(190, 24, 93, 0.3)',
                primaryAlphaLight: 'rgba(190, 24, 93, 0.1)'
            },
            vert: {
                name: '💚 Vert',
                primary: '#059669',
                primaryLight: '#10b981',
                primaryLighter: '#34d399',
                primaryDark: '#047857',
                primaryDarker: '#064e3b',
                primaryAlpha: 'rgba(5, 150, 105, 0.3)',
                primaryAlphaLight: 'rgba(5, 150, 105, 0.1)'
            },
            orange: {
                name: '🧡 Orange',
                primary: '#ea580c',
                primaryLight: '#f97316',
                primaryLighter: '#fb923c',
                primaryDark: '#c2410c',
                primaryDarker: '#9a3412',
                primaryAlpha: 'rgba(234, 88, 12, 0.3)',
                primaryAlphaLight: 'rgba(234, 88, 12, 0.1)'
            },
            rouge: {
                name: '❤️ Rouge',
                primary: '#dc2626',
                primaryLight: '#ef4444',
                primaryLighter: '#f87171',
                primaryDark: '#b91c1c',
                primaryDarker: '#991b1b',
                primaryAlpha: 'rgba(220, 38, 38, 0.3)',
                primaryAlphaLight: 'rgba(220, 38, 38, 0.1)'
            },
            cyan: {
                name: '💎 Cyan',
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

        // Supprimer l'ancien style de thème
        const oldStyleElement = document.getElementById('dynamic-color-theme');
        if (oldStyleElement) {
            oldStyleElement.remove();
        }

        // Créer le nouveau style
        const styleElement = document.createElement('style');
        styleElement.id = 'dynamic-color-theme';
        styleElement.textContent = this.generateThemeCSS(theme);
        document.head.appendChild(styleElement);

        // Forcer la mise à jour du logtime avec la nouvelle couleur
        this.updateLogtimeColors(theme);

        // Notifier le ThemeManager pour qu'il mette à jour ses couleurs aussi
        if (window.ThemeManager && window.ThemeManager.isDark) {
            setTimeout(() => {
                window.ThemeManager.updateLogtime();
            }, 100);
        }

        this.setCurrentTheme(themeName);
    }

    updateLogtimeColors(theme) {
        // Mise à jour immédiate des éléments logtime existants
        const logtimeElements = document.querySelectorAll('[style*="rgba(0, 186, 188,"], [style*="rgba(92, 5, 143,"]');
        
        logtimeElements.forEach(el => {
            const style = el.getAttribute('style');
            if (style) {
                // Remplacer les anciennes couleurs par la nouvelle couleur du thème
                let newStyle = style
                    .replace(/rgba\(0, 186, 188, ([0-9.]+)\)/g, `rgba(${theme.primary.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, $1)`)
                    .replace(/rgba\(92, 5, 143, ([0-9.]+)\)/g, `rgba(${theme.primary.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, $1)`);
                
                el.setAttribute('style', newStyle);
            }
        });

        // Mise à jour des couleurs de fond rgb(162, 179, 229) pour les événements
        const eventElements = document.querySelectorAll('[style*="background-color: rgb(162, 179, 229)"]');
        eventElements.forEach(el => {
            const style = el.getAttribute('style');
            if (style) {
                const newStyle = style.replace(/background-color: rgb\(162, 179, 229\)/g, `background-color: ${theme.primaryAlpha.replace('0.3', '0.5')}`);
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
                box-shadow: 0 4px 12px ${theme.primaryAlpha} !important;
            }

            body.dark-theme #settings-btn:hover {
                background: linear-gradient(135deg, ${theme.primaryLight}, ${theme.primaryLighter}) !important;
                box-shadow: 0 6px 20px ${theme.primaryAlpha} !important;
            }
        `;
    }

    loadSavedTheme() {
        const savedTheme = this.getCurrentTheme();
        if (savedTheme && this.themes[savedTheme]) {
            this.applyTheme(savedTheme);
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

        // Ajouter les styles pour la grille de couleurs
        const style = document.createElement('style');
        style.textContent = `
            .color-theme-grid {
                display: grid !important;
                grid-template-columns: 1fr 1fr 1fr 1fr !important;
                gap: 8px !important;
                margin-top: 15px !important;
            }

            .color-theme-btn {
                padding: 8px 12px !important;
                border: none !important;
                border-radius: 8px !important;
                cursor: pointer !important;
                color: white !important;
                font-weight: 600 !important;
                font-size: 12px !important;
                transition: all 0.3s ease !important;
                text-shadow: 0 1px 2px rgba(0,0,0,0.5) !important;
                text-align: center !important;
            }

            .color-theme-btn:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
            }

            .color-theme-btn.active {
                box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.5) !important;
                transform: scale(1.05) !important;
            }

            .custom-color-section {
                margin-top: 20px !important;
                padding: 15px !important;
                background: rgba(255, 255, 255, 0.05) !important;
                border-radius: 10px !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
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
        
        // Marquer le thème actuel comme actif
        const currentTheme = this.getCurrentTheme();
        colorButtons.forEach(btn => {
            if (btn.dataset.theme === currentTheme) {
                btn.classList.add('active');
            }
            
            btn.addEventListener('click', (e) => {
                // Retirer la classe active de tous les boutons
                colorButtons.forEach(b => b.classList.remove('active'));
                
                // Ajouter la classe active au bouton cliqué
                e.target.classList.add('active');
                
                // Appliquer le thème
                const themeName = e.target.dataset.theme;
                this.applyTheme(themeName);
            });
        });

        // Gérer le color picker personnalisé
        const colorPicker = colorSection.querySelector('#custom-color-picker');
        const applyBtn = colorSection.querySelector('#apply-custom-color');
        const saveBtn = colorSection.querySelector('#save-custom-color');

        // Charger la couleur custom sauvegardée
        const savedCustomColor = localStorage.getItem('better42-custom-color');
        if (savedCustomColor) {
            colorPicker.value = savedCustomColor;
        }

        // Appliquer la couleur custom
        applyBtn.addEventListener('click', () => {
            const selectedColor = colorPicker.value;
            this.applyCustomColor(selectedColor);
            
            // Désactiver tous les boutons de thème
            colorButtons.forEach(b => b.classList.remove('active'));
        });

        // Sauvegarder la couleur custom
        saveBtn.addEventListener('click', () => {
            const selectedColor = colorPicker.value;
            localStorage.setItem('better42-custom-color', selectedColor);
            this.applyCustomColor(selectedColor);
            
            // Désactiver tous les boutons de thème
            colorButtons.forEach(b => b.classList.remove('active'));
            
            alert('💾 Couleur personnalisée sauvegardée !');
        });

        // Prévisualisation en temps réel
        colorPicker.addEventListener('input', (e) => {
            this.applyCustomColor(e.target.value);
            colorButtons.forEach(b => b.classList.remove('active'));
        });
    }

    // Appliquer une couleur personnalisée
    applyCustomColor(hexColor) {
        // Générer un thème complet à partir de la couleur de base
        const customTheme = this.generateCustomTheme(hexColor);
        
        // Supprimer l'ancien style de thème
        const oldStyleElement = document.getElementById('dynamic-color-theme');
        if (oldStyleElement) {
            oldStyleElement.remove();
        }

        // Créer le nouveau style
        const styleElement = document.createElement('style');
        styleElement.id = 'dynamic-color-theme';
        styleElement.textContent = this.generateThemeCSS(customTheme);
        document.head.appendChild(styleElement);

        // Forcer la mise à jour du logtime avec la nouvelle couleur
        this.updateLogtimeColors(customTheme);

        // Notifier le ThemeManager
        if (window.ThemeManager && window.ThemeManager.isDark) {
            setTimeout(() => {
                window.ThemeManager.updateLogtime();
            }, 100);
        }

        // Marquer comme couleur custom
        localStorage.setItem('better42-color-theme', 'custom');
        this.currentTheme = 'custom';
    }

    // Générer un thème complet à partir d'une couleur
    generateCustomTheme(baseColor) {
        const rgb = this.hexToRgb(baseColor);
        if (!rgb) return this.themes.violet;

        // Générer des variations de la couleur
        const lighter = this.lightenColor(baseColor, 20);
        const evenLighter = this.lightenColor(baseColor, 40);
        const darker = this.darkenColor(baseColor, 20);
        const evenDarker = this.darkenColor(baseColor, 40);

        return {
            name: '✨ Custom',
            primary: baseColor,
            primaryLight: lighter,
            primaryLighter: evenLighter,
            primaryDark: darker,
            primaryDarker: evenDarker,
            primaryAlpha: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`,
            primaryAlphaLight: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`
        };
    }

    // Éclaircir une couleur
    lightenColor(hex, percent) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return hex;

        const factor = 1 + (percent / 100);
        const r = Math.min(255, Math.round(rgb.r * factor));
        const g = Math.min(255, Math.round(rgb.g * factor));
        const b = Math.min(255, Math.round(rgb.b * factor));

        return this.rgbToHex(r, g, b);
    }

    // Assombrir une couleur
    darkenColor(hex, percent) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return hex;

        const factor = 1 - (percent / 100);
        const r = Math.max(0, Math.round(rgb.r * factor));
        const g = Math.max(0, Math.round(rgb.g * factor));
        const b = Math.max(0, Math.round(rgb.b * factor));

        return this.rgbToHex(r, g, b);
    }

    // Convertir RGB en Hex
    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    // Convertir Hex en RGB
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // Méthode d'initialisation
    init() {
        const currentTheme = this.getCurrentTheme();
        
        // Si c'est une couleur custom, charger la couleur sauvegardée
        if (currentTheme === 'custom') {
            const savedCustomColor = localStorage.getItem('better42-custom-color');
            if (savedCustomColor) {
                this.applyCustomColor(savedCustomColor);
                return;
            }
        }
        
        // Sinon charger le thème normal
        this.loadSavedTheme();
    }

    // Méthode pour créer l'UI du sélecteur de couleurs
    createUI() {
        const colorSection = this.createColorSelector();
        this.attachColorSelectorEvents(colorSection);
        return colorSection;
    }

    // Méthode pour obtenir la couleur RGB actuelle
    getCurrentThemeRgb() {
        const currentTheme = this.getCurrentTheme();
        
        // Si c'est une couleur custom
        if (currentTheme === 'custom') {
            const savedCustomColor = localStorage.getItem('better42-custom-color');
            if (savedCustomColor) {
                const rgb = this.hexToRgb(savedCustomColor);
                if (rgb) {
                    return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
                }
            }
        }
        
        // Sinon utiliser le thème prédéfini
        const theme = this.themes[currentTheme];
        if (!theme) return '92, 5, 143';
        
        // Convertir hex en RGB
        const hex = theme.primary.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        return `${r}, ${g}, ${b}`;
    }

    // Méthode pour réinitialiser aux paramètres par défaut
    resetToDefaults() {
        // Supprimer le thème sauvegardé
        localStorage.removeItem('better42-color-theme');
        
        // Réappliquer le thème par défaut
        this.currentTheme = 'violet';
        this.applyTheme('violet');
        
        // Notifier le succès
        alert('🎨 Couleurs remises par défaut (Violet) !');
        
        return true;
    }

    // Méthode pour obtenir les statistiques des thèmes
    getThemeStats() {
        return {
            currentTheme: this.getCurrentTheme(),
            availableThemes: Object.keys(this.themes),
            themeCount: Object.keys(this.themes).length
        };
    }
}

window.ColorThemeManager = new ColorThemeManager();