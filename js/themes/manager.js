class ColorThemeManager {
    // INITIALIZE THEME MANAGER WITH REQUIRED DEPENDENCIES
    constructor() {
        this.storage = window.ThemeStorage;
        this.cssGenerator = window.ThemeCSSGenerator;
        this.ui = window.ThemeUI;
        this.currentTheme = null;

        if (this.ui) {
            this.ui.setThemeManager(this);
        }
    }

    // INITIALIZE THEME SYSTEM AND LOAD SAVED THEME
    init() {
        this.storage.cleanup();

        this.loadSavedTheme();
    }

    // LOAD PREVIOUSLY SAVED THEME OR DEFAULT THEME
    loadSavedTheme() {
        const savedThemeId = this.storage.getCurrentTheme();
        const theme = this.storage.getTheme(savedThemeId);

        if (theme) {
            this.applyTheme(savedThemeId);
        } else {
            this.applyTheme(window.THEME_CONFIG.DEFAULT_THEME);
        }
    }

    // APPLY SPECIFIED THEME TO THE DOM AND UPDATE ELEMENTS
    applyTheme(themeId) {
        const theme = this.storage.getTheme(themeId);
        if (!theme) {
            console.error(`Theme ${themeId} not found`);
            return false;
        }

        const css = this.cssGenerator.generateThemeCSS(theme.colors);
        this.cssGenerator.applyCSSToDOM(css);

        this.updateInlineElements(theme.colors);

        this.storage.setCurrentTheme(themeId);
        this.currentTheme = themeId;

        this.notifyThemeManager();

        return true;
    }

    // UPDATE INLINE STYLED ELEMENTS WITH NEW THEME COLORS
    updateInlineElements(colors) {
        const primaryRgb = this.hexToRgb(colors.primary);
        if (!primaryRgb) return;

        this.updateLogtimeElements(primaryRgb);

        this.updateEventElements(colors);
    }

    // UPDATE LOGTIME ELEMENTS WITH PRIMARY COLOR RGB VALUES
    updateLogtimeElements(primaryRgb) {
        const rgbString = `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`;

        const tealElements = document.querySelectorAll('[style*="rgba(0, 186, 188,"]');
        tealElements.forEach(el => {
            const style = el.getAttribute('style');
            const newStyle = style.replace(/rgba\(0, 186, 188, ([\d\.]+)\)/g, `rgba(${rgbString}, $1)`);
            if (newStyle !== style) {
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
                    const newStyle = style.replace(pattern, `rgba(${rgbString}, $1)`);
                    if (newStyle !== style) {
                        el.setAttribute('style', newStyle);
                    }
                }
            });
        });
    }

    // UPDATE EVENT ELEMENTS WITH NEW THEME BACKGROUND COLORS
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

    // NOTIFY EXTERNAL THEME MANAGER OF THEME CHANGES
    notifyThemeManager() {
        if (window.ThemeManager && window.ThemeManager.isDark) {
            setTimeout(() => {
                window.ThemeManager.updateLogtime();
            }, 100);
        }
    }

    // GET CURRENTLY ACTIVE THEME ID
    getCurrentTheme() {
        return this.currentTheme || this.storage.getCurrentTheme();
    }

    // GET COMPLETE DATA OBJECT FOR CURRENT THEME
    getCurrentThemeData() {
        const currentId = this.getCurrentTheme();
        return this.storage.getTheme(currentId);
    }

    // GET PRIMARY COLOR RGB STRING FOR CURRENT THEME
    getCurrentThemeRgb() {
        const theme = this.getCurrentThemeData();
        if (!theme) return '92, 5, 143';

        const rgb = this.hexToRgb(theme.colors.primary);
        return rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : '92, 5, 143';
    }

    // CREATE THEME SELECTION USER INTERFACE
    createUI() {
        return this.ui.createThemeSection();
    }

    // CREATE NEW CUSTOM THEME FROM BASE COLOR AND NAME
    createCustomTheme(name, baseColor, emoji = '✨') {
        const themeData = window.THEME_CONFIG.COLOR_UTILS.generateThemeFromBase(baseColor, name, emoji);
        const themeId = this.storage.generateThemeId(name);

        this.storage.addCustomTheme(themeId, themeData);
        return themeId;
    }

    // DELETE CUSTOM THEME BY ID
    deleteCustomTheme(themeId) {
        return this.storage.removeCustomTheme(themeId);
    }

    // EXPORT ALL CUSTOM THEMES TO JSON FORMAT
    exportCustomThemes() {
        return this.storage.exportCustomThemes();
    }

    // IMPORT CUSTOM THEMES FROM JSON DATA
    importCustomThemes(jsonData) {
        return this.storage.importCustomThemes(jsonData);
    }

    // GET ALL AVAILABLE THEMES INCLUDING PREDEFINED AND CUSTOM
    getAllThemes() {
        return this.storage.getAllThemes();
    }

    // GET STATISTICS ABOUT THEME COLLECTION
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

    // RESET ALL THEMES TO DEFAULT STATE AND DELETE CUSTOM THEMES
    resetToDefaults() {
        if (confirm('⚠️ Reset all themes to defaults?\n\nThis will delete all custom themes and cannot be undone.')) {
            localStorage.removeItem(window.THEME_CONFIG.STORAGE_KEYS.CUSTOM_THEMES);

            this.applyTheme(window.THEME_CONFIG.DEFAULT_THEME);

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

    // CREATE DUPLICATE COPY OF EXISTING THEME
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

    // TEMPORARILY PREVIEW THEME FOR SPECIFIED DURATION
    previewTheme(themeId, duration = 3000) {
        const originalTheme = this.getCurrentTheme();

        if (this.applyTheme(themeId)) {
            setTimeout(() => {
                this.applyTheme(originalTheme);
            }, duration);

            return true;
        }

        return false;
    }

    // VALIDATE THEME DATA STRUCTURE AND COLOR FORMATS
    validateTheme(themeData) {
        const requiredProps = ['name', 'colors'];
        const requiredColors = ['primary', 'primaryLight', 'primaryLighter', 'primaryDark', 'primaryDarker', 'primaryAlpha', 'primaryAlphaLight'];

        for (const prop of requiredProps) {
            if (!themeData[prop]) {
                return { valid: false, error: `Missing property: ${prop}` };
            }
        }

        for (const color of requiredColors) {
            if (!themeData.colors[color]) {
                return { valid: false, error: `Missing color: ${color}` };
            }
        }

        const hexColors = ['primary', 'primaryLight', 'primaryLighter', 'primaryDark', 'primaryDarker'];
        for (const colorKey of hexColors) {
            const color = themeData.colors[colorKey];
            if (!/^#[0-9A-F]{6}$/i.test(color)) {
                return { valid: false, error: `Invalid hex color format: ${colorKey}` };
            }
        }

        const rgbaColors = ['primaryAlpha', 'primaryAlphaLight'];
        for (const colorKey of rgbaColors) {
            const color = themeData.colors[colorKey];
            if (!/^rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)$/i.test(color)) {
                return { valid: false, error: `Invalid rgba color format: ${colorKey}` };
            }
        }

        return { valid: true };
    }

    // CONVERT HEX COLOR CODE TO RGB OBJECT
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // CONVERT RGB VALUES TO HEX COLOR CODE
    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    // CALCULATE COLOR LUMINANCE VALUE FOR ACCESSIBILITY
    getColorLuminance(hex) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return 0;

        const { r, g, b } = rgb;
        const rsRGB = r / 255;
        const gsRGB = g / 255;
        const bsRGB = b / 255;

        const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
        const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
        const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

        return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
    }

    // FIND THEMES WITH SIMILAR COLOR LUMINANCE VALUES
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

    // GENERATE RANDOM THEME WITH RANDOM HSL COLOR VALUES
    generateRandomTheme(name = 'Random Theme') {
        const hue = Math.floor(Math.random() * 360);
        const saturation = 60 + Math.floor(Math.random() * 40);
        const lightness = 35 + Math.floor(Math.random() * 30);

        const baseColor = this.hslToHex(hue, saturation, lightness);
        const emoji = ['🎨', '✨', '🌈', '💫', '🎭', '🔮', '💎', '🌟'][Math.floor(Math.random() * 8)];

        return this.createCustomTheme(name, baseColor, emoji);
    }

    // CONVERT HSL COLOR VALUES TO HEX COLOR CODE
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

    // GET DIAGNOSTIC INFORMATION ABOUT THEME SYSTEM STATUS
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
