// js/themes/manager.js - Gestionnaire principal des thèmes

class ColorThemeManager {
    constructor() {
        this.storage = window.ThemeStorage;
        this.cssGenerator = window.ThemeCSSGenerator;
        this.ui = window.ThemeUI;
        this.currentTheme = null;
        
        // Lier l'UI au manager
        this.ui.setThemeManager(this);
    }

    // Initialiser le gestionnaire de thèmes
    init() {
        // Nettoyer les données corrompues au démarrage
        this.storage.cleanup();
        
        // Charger le thème sauvegardé
        this.loadSavedTheme();
    }

    // Charger le thème sauvegardé
    loadSavedTheme() {
        const savedThemeId = this.storage.getCurrentTheme();
        const theme = this.storage.getTheme(savedThemeId);
        
        if (theme) {
            this.applyTheme(savedThemeId);
        } else {
            // Si le thème sauvegardé n'existe plus, utiliser le thème par défaut
            this.applyTheme(window.THEME_CONFIG.DEFAULT_THEME);
        }
    }

    // Appliquer un thème
    applyTheme(themeId) {
        const theme = this.storage.getTheme(themeId);
        if (!theme) {
            console.error(`Theme ${themeId} not found`);
            return false;
        }

        // Générer et appliquer le CSS
        const css = this.cssGenerator.generateThemeCSS(theme.colors);
        this.cssGenerator.applyCSSToDOM(css);

        // Mettre à jour les éléments inline existants
        this.updateInlineElements(theme.colors);

        // Sauvegarder le thème actuel
        this.storage.setCurrentTheme(themeId);
        this.currentTheme = themeId;

        // Notifier le ThemeManager pour la synchronisation du logtime
        this.notifyThemeManager();

        return true;
    }

    // Mettre à jour les éléments avec styles inline
    updateInlineElements(colors) {
        // Conversion hex vers rgb pour les calculs
        const primaryRgb = this.hexToRgb(colors.primary);
        if (!primaryRgb) return;

        // Mise à jour des éléments logtime
        this.updateLogtimeElements(primaryRgb);
        
        // Mise à jour des événements avec background rgb(162, 179, 229)
        this.updateEventElements(colors);
    }

    // Mettre à jour les éléments logtime
    updateLogtimeElements(primaryRgb) {
        const rgbString = `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`;
        
        // Éléments avec l'ancienne couleur teal
        const tealElements = document.querySelectorAll('[style*="rgba(0, 186, 188,"]');
        tealElements.forEach(el => {
            const style = el.getAttribute('style');
            const newStyle = style.replace(/rgba\(0, 186, 188, ([\d\.]+)\)/g, `rgba(${rgbString}, $1)`);
            if (newStyle !== style) {
                el.setAttribute('style', newStyle);
            }
        });

        // Éléments avec d'anciennes couleurs de thème
        const oldThemePatterns = [
            /rgba\(92, 5, 143, ([\d\.]+)\)/g,    // Ancien purple
            /rgba\(30, 64, 175, ([\d\.]+)\)/g,   // Ancien blue
            /rgba\(190, 24, 93, ([\d\.]+)\)/g,   // Ancien pink
            /rgba\(5, 150, 105, ([\d\.]+)\)/g,   // Ancien green
            /rgba\(229, 229, 229, ([\d\.]+)\)/g, // Ancien white
            /rgba\(234, 88, 12, ([\d\.]+)\)/g,   // Ancien orange  
            /rgba\(220, 38, 38, ([\d\.]+)\)/g,   // Ancien red
            /rgba\(8, 145, 178, ([\d\.]+)\)/g    // Ancien cyan
        ];

        oldThemePatterns.forEach(pattern => {
            const elements = document.querySelectorAll(`[style*="rgba("]`);
            elements.forEach(el => {
                const style = el.getAttribute('style');
                if (pattern.test(style)) {
                    const newStyle = style.replace(pattern, `rgba(${rgbString}, $1)`);
                    if (newStyle !== style) {
                        el.setAttribute('style', newStyle);
                    }
                }
            });
        });
    }

    // Mettre à jour les éléments d'événements
    updateEventElements(colors) {
        const eventElements = document.querySelectorAll('[style*="background-color: rgb(162, 179, 229)"]');
        eventElements.forEach(el => {
            const style = el.getAttribute('style');
            const newStyle = style.replace(
                /background-color: rgb\(162, 179, 229\)/g, 
                `background-color: ${colors.primaryAlpha.replace('0.3', '0.5')}`
            );
            if (newStyle !== style) {
                el.setAttribute('style', newStyle);
            }
        });
    }

    // Notifier le ThemeManager pour synchronisation
    notifyThemeManager() {
        if (window.ThemeManager && window.ThemeManager.isDark) {
            setTimeout(() => {
                window.ThemeManager.updateLogtime();
            }, 100);
        }
    }

    // Obtenir le thème actuel
    getCurrentTheme() {
        return this.currentTheme || this.storage.getCurrentTheme();
    }

    // Obtenir les données du thème actuel
    getCurrentThemeData() {
        const currentId = this.getCurrentTheme();
        return this.storage.getTheme(currentId);
    }

    // Obtenir la couleur RGB du thème actuel pour le ThemeManager
    getCurrentThemeRgb() {
        const theme = this.getCurrentThemeData();
        if (!theme) return '92, 5, 143'; // Fallback violet
        
        const rgb = this.hexToRgb(theme.colors.primary);
        return rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : '92, 5, 143';
    }

    // Créer l'interface utilisateur des thèmes
    createUI() {
        return this.ui.createThemeSection();
    }

    // Créer un thème custom depuis une couleur de base
    createCustomTheme(name, baseColor, emoji = '✨') {
        const themeData = window.THEME_CONFIG.COLOR_UTILS.generateThemeFromBase(baseColor, name, emoji);
        const themeId = this.storage.generateThemeId(name);
        
        this.storage.addCustomTheme(themeId, themeData);
        return themeId;
    }

    // Supprimer un thème custom
    deleteCustomTheme(themeId) {
        return this.storage.removeCustomTheme(themeId);
    }

    // Exporter tous les thèmes customs
    exportCustomThemes() {
        return this.storage.exportCustomThemes();
    }

    // Importer des thèmes customs
    importCustomThemes(jsonData) {
        return this.storage.importCustomThemes(jsonData);
    }

    // Obtenir tous les thèmes disponibles
    getAllThemes() {
        return this.storage.getAllThemes();
    }

    // Obtenir les statistiques des thèmes
    getThemeStats() {
        const allThemes = this.getAllThemes();
        const predefinedCount = Object.values(allThemes).filter(t => t.category === 'predefined').length;
        const customCount = Object.values(allThemes).filter(t => t.category === 'custom').length;
        
        return {
            total: Object.keys(allThemes).length,
            predefined: predefinedCount,
            custom: customCount,
            current: this.getCurrentTheme()
        };
    }

    // Réinitialiser tous les thèmes (retour aux paramètres d'usine)
    resetToDefaults() {
        if (confirm('⚠️ Reset all themes to defaults?\n\nThis will delete all custom themes and cannot be undone.')) {
            // Supprimer tous les thèmes customs
            localStorage.removeItem(window.THEME_CONFIG.STORAGE_KEYS.CUSTOM_THEMES);
            
            // Retourner au thème par défaut
            this.applyTheme(window.THEME_CONFIG.DEFAULT_THEME);
            
            // Rafraîchir l'UI si elle existe
            const themeSection = document.querySelector('.theme-section');
            if (themeSection) {
                const newSection = this.createUI();
                themeSection.parentNode.replaceChild(newSection, themeSection);
            }
            
            alert('✅ Themes reset to defaults!');
            return true;
        }
        return false;
    }

    // Dupliquer un thème existant
    duplicateTheme(themeId, newName) {
        const originalTheme = this.storage.getTheme(themeId);
        if (!originalTheme) return null;
        
        const duplicatedTheme = {
            ...originalTheme,
            name: `${originalTheme.name.replace(/^[^\s]+ /, '')} Copy`,
            category: 'custom'
        };
        
        if (newName) {
            duplicatedTheme.name = newName;
        }
        
        const newThemeId = this.storage.generateThemeId(duplicatedTheme.name);
        this.storage.addCustomTheme(newThemeId, duplicatedTheme);
        
        return newThemeId;
    }

    // Prévisualiser un thème sans l'appliquer définitivement
    previewTheme(themeId, duration = 3000) {
        const originalTheme = this.getCurrentTheme();
        
        // Appliquer temporairement le nouveau thème
        if (this.applyTheme(themeId)) {
            // Restaurer l'ancien thème après la durée spécifiée
            setTimeout(() => {
                this.applyTheme(originalTheme);
            }, duration);
            
            return true;
        }
        
        return false;
    }

    // Valider la structure d'un thème
    validateTheme(themeData) {
        const requiredProps = ['name', 'colors'];
        const requiredColors = ['primary', 'primaryLight', 'primaryLighter', 'primaryDark', 'primaryDarker', 'primaryAlpha', 'primaryAlphaLight'];
        
        // Vérifier les propriétés principales
        for (const prop of requiredProps) {
            if (!themeData[prop]) {
                return { valid: false, error: `Missing property: ${prop}` };
            }
        }
        
        // Vérifier les couleurs
        for (const color of requiredColors) {
            if (!themeData.colors[color]) {
                return { valid: false, error: `Missing color: ${color}` };
            }
        }
        
        // Vérifier le format des couleurs hex
        const hexColors = ['primary', 'primaryLight', 'primaryLighter', 'primaryDark', 'primaryDarker'];
        for (const colorKey of hexColors) {
            const color = themeData.colors[colorKey];
            if (!/^#[0-9A-F]{6}$/i.test(color)) {
                return { valid: false, error: `Invalid hex color format: ${colorKey}` };
            }
        }
        
        // Vérifier le format des couleurs rgba
        const rgbaColors = ['primaryAlpha', 'primaryAlphaLight'];
        for (const colorKey of rgbaColors) {
            const color = themeData.colors[colorKey];
            if (!/^rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)$/i.test(color)) {
                return { valid: false, error: `Invalid rgba color format: ${colorKey}` };
            }
        }
        
        return { valid: true };
    }

    // Utilitaires de couleur
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    // Analyser la luminosité d'une couleur
    getColorLuminance(hex) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return 0;
        
        // Formule de luminance relative
        const { r, g, b } = rgb;
        const rsRGB = r / 255;
        const gsRGB = g / 255;
        const bsRGB = b / 255;
        
        const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
        const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
        const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
        
        return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
    }

    // Suggérer des thèmes similaires
    getSimilarThemes(themeId, maxResults = 3) {
        const targetTheme = this.storage.getTheme(themeId);
        if (!targetTheme) return [];
        
        const allThemes = this.getAllThemes();
        const targetLuminance = this.getColorLuminance(targetTheme.colors.primary);
        
        const similarities = Object.entries(allThemes)
            .filter(([id]) => id !== themeId)
            .map(([id, theme]) => {
                const luminance = this.getColorLuminance(theme.colors.primary);
                const difference = Math.abs(targetLuminance - luminance);
                return { id, theme, similarity: 1 - difference };
            })
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, maxResults);
        
        return similarities.map(s => ({ id: s.id, theme: s.theme }));
    }

    // Générer un thème aléatoire
    generateRandomTheme(name = 'Random Theme') {
        const hue = Math.floor(Math.random() * 360);
        const saturation = 60 + Math.floor(Math.random() * 40); // 60-100%
        const lightness = 35 + Math.floor(Math.random() * 30);  // 35-65%
        
        const baseColor = this.hslToHex(hue, saturation, lightness);
        const emoji = ['🎨', '✨', '🌈', '💫', '🎭', '🔮', '💎', '🌟'][Math.floor(Math.random() * 8)];
        
        return this.createCustomTheme(name, baseColor, emoji);
    }

    // Convertir HSL en Hex
    hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    // Diagnostics et informations de debug
    getDiagnostics() {
        const stats = this.getThemeStats();
        const currentTheme = this.getCurrentThemeData();
        
        return {
            version: '2.0',
            stats,
            currentTheme: currentTheme ? {
                id: this.getCurrentTheme(),
                name: currentTheme.name,
                category: currentTheme.category,
                primaryColor: currentTheme.colors.primary
            } : null,
            storage: {
                customThemesSize: JSON.stringify(this.storage.getCustomThemes()).length,
                localStorageAvailable: typeof(Storage) !== "undefined"
            },
            performance: {
                cssGeneratorReady: !!this.cssGenerator,
                uiReady: !!this.ui,
                storageReady: !!this.storage
            }
        };
    }
}

window.ColorThemeManager = new ColorThemeManager();