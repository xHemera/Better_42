
class ThemeStorage {
    constructor() {
        this.config = window.THEME_CONFIG;
    }

    getCurrentTheme() {
        return localStorage.getItem(this.config.STORAGE_KEYS.CURRENT_THEME) || this.config.DEFAULT_THEME;
    }

    setCurrentTheme(themeId) {
        localStorage.setItem(this.config.STORAGE_KEYS.CURRENT_THEME, themeId);
    }

    getAllThemes() {
        const predefined = this.config.PREDEFINED_THEMES;
        const custom = this.getCustomThemes();
        
        return { ...predefined, ...custom };
    }

    getTheme(themeId) {
        const allThemes = this.getAllThemes();
        return allThemes[themeId] || null;
    }

    getCustomThemes() {
        const stored = localStorage.getItem(this.config.STORAGE_KEYS.CUSTOM_THEMES);
        return stored ? JSON.parse(stored) : {};
    }

    setCustomThemes(themes) {
        localStorage.setItem(this.config.STORAGE_KEYS.CUSTOM_THEMES, JSON.stringify(themes));
    }

    addCustomTheme(themeId, themeData) {
        const customThemes = this.getCustomThemes();
        customThemes[themeId] = {
            ...themeData,
            category: 'custom',
            createdAt: new Date().toISOString()
        };
        this.setCustomThemes(customThemes);
        return themeId;
    }

    removeCustomTheme(themeId) {
        const customThemes = this.getCustomThemes();
        if (customThemes[themeId]) {
            delete customThemes[themeId];
            this.setCustomThemes(customThemes);
            
            if (this.getCurrentTheme() === themeId) {
                this.setCurrentTheme(this.config.DEFAULT_THEME);
            }
            
            return true;
        }
        return false;
    }

    themeExists(themeId) {
        const allThemes = this.getAllThemes();
        return !!allThemes[themeId];
    }

    generateThemeId(baseName) {
        const sanitized = baseName.toLowerCase().replace(/[^a-z0-9]/g, '_');
        let id = `custom_${sanitized}`;
        let counter = 1;
        
        while (this.themeExists(id)) {
            id = `custom_${sanitized}_${counter}`;
            counter++;
        }
        
        return id;
    }

    exportCustomThemes() {
        const customThemes = this.getCustomThemes();
        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            themes: customThemes
        };
        
        return JSON.stringify(exportData, null, 2);
    }

    importCustomThemes(jsonData) {
        try {
            const importData = JSON.parse(jsonData);
            
            if (!importData.themes) {
                throw new Error('Format de données invalide');
            }
            
            const currentCustom = this.getCustomThemes();
            const imported = { ...currentCustom };
            let importedCount = 0;
            
            Object.entries(importData.themes).forEach(([themeId, themeData]) => {
                let finalId = themeId;
                if (this.themeExists(themeId)) {
                    finalId = this.generateThemeId(themeData.name || 'imported');
                }
                
                imported[finalId] = {
                    ...themeData,
                    category: 'custom',
                    importedAt: new Date().toISOString()
                };
                importedCount++;
            });
            
            this.setCustomThemes(imported);
            return { success: true, imported: importedCount };
            
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    cleanup() {
        try {
            const currentTheme = this.getCurrentTheme();
            if (!this.themeExists(currentTheme)) {
                this.setCurrentTheme(this.config.DEFAULT_THEME);
            }
            
            const customThemes = this.getCustomThemes();
            const cleaned = {};
            
            Object.entries(customThemes).forEach(([id, theme]) => {
                if (theme && theme.colors && theme.name) {
                    cleaned[id] = theme;
                }
            });
            
            this.setCustomThemes(cleaned);
            return true;
            
        } catch (error) {
            console.error('Erreur lors du nettoyage des thèmes:', error);
            return false;
        }
    }
}

window.ThemeStorage = new ThemeStorage();