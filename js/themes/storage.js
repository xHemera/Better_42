
class ThemeStorage {
    // INITIALIZES THE THEME STORAGE WITH CONFIGURATION FROM WINDOW OBJECT
    constructor() {
        this.config = window.THEME_CONFIG;
    }

    // RETRIEVES THE CURRENTLY ACTIVE THEME ID FROM LOCAL STORAGE OR RETURNS DEFAULT THEME
    getCurrentTheme() {
        return localStorage.getItem(this.config.STORAGE_KEYS.CURRENT_THEME) || this.config.DEFAULT_THEME;
    }

    // SAVES THE SPECIFIED THEME ID AS THE CURRENT ACTIVE THEME IN LOCAL STORAGE
    setCurrentTheme(themeId) {
        localStorage.setItem(this.config.STORAGE_KEYS.CURRENT_THEME, themeId);
    }

    // COMBINES PREDEFINED THEMES WITH CUSTOM THEMES AND RETURNS THE COMPLETE THEME COLLECTION
    getAllThemes() {
        const predefined = this.config.PREDEFINED_THEMES;
        const custom = this.getCustomThemes();
        return { ...predefined, ...custom };
    }

    // RETRIEVES A SPECIFIC THEME BY ID FROM ALL AVAILABLE THEMES OR RETURNS NULL IF NOT FOUND
    getTheme(themeId) {
        const allThemes = this.getAllThemes();
        return allThemes[themeId] || null;
    }

    // RETRIEVES ALL CUSTOM THEMES STORED IN LOCAL STORAGE OR RETURNS EMPTY OBJECT IF NONE EXIST
    getCustomThemes() {
        const stored = localStorage.getItem(this.config.STORAGE_KEYS.CUSTOM_THEMES);
        return stored ? JSON.parse(stored) : {};
    }

    // SAVES THE PROVIDED CUSTOM THEMES OBJECT TO LOCAL STORAGE
    setCustomThemes(themes) {
        localStorage.setItem(this.config.STORAGE_KEYS.CUSTOM_THEMES, JSON.stringify(themes));
    }

    // ADDS A NEW CUSTOM THEME WITH METADATA AND SAVES IT TO STORAGE
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

    // REMOVES A CUSTOM THEME BY ID AND RESETS TO DEFAULT IF IT WAS THE ACTIVE THEME
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

    // CHECKS IF A THEME WITH THE SPECIFIED ID EXISTS IN ALL AVAILABLE THEMES
    themeExists(themeId) {
        const allThemes = this.getAllThemes();
        return !!allThemes[themeId];
    }

    // GENERATES A UNIQUE THEME ID BASED ON A BASE NAME WITH INCREMENTAL SUFFIX IF NEEDED
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

    // EXPORTS ALL CUSTOM THEMES AS A JSON STRING WITH VERSION AND DATE METADATA
    exportCustomThemes() {
        const customThemes = this.getCustomThemes();
        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            themes: customThemes
        };
        return JSON.stringify(exportData, null, 2);
    }

    // IMPORTS CUSTOM THEMES FROM JSON DATA AND HANDLES ID CONFLICTS BY GENERATING NEW IDS
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

    // VALIDATES AND CLEANS UP THEME STORAGE BY REMOVING INVALID THEMES AND FIXING CURRENT THEME
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