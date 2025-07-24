// js/themes/ui.js - Interface utilisateur pour les thèmes

class ThemeUI {
    constructor() {
        this.storage = window.ThemeStorage;
        this.manager = null; // Sera assigné plus tard
    }

    // Créer la section complète des thèmes
    createThemeSection() {
        const section = document.createElement('div');
        section.className = 'settings-section theme-section';
        section.innerHTML = this.getThemeSectionHTML();
        
        this.injectThemeStyles();
        this.attachThemeEvents(section);
        
        return section;
    }

    // HTML de la section thèmes
    getThemeSectionHTML() {
        return `
            <h4>🎨 Color Themes</h4>
            
            <!-- Thèmes prédéfinis -->
            <div class="theme-category">
                <h5>📦 Predefined Themes</h5>
                <div class="predefined-themes-grid" id="predefined-themes">
                    ${this.generatePredefinedThemesHTML()}
                </div>
            </div>
            
            <!-- Thèmes customs -->
            <div class="theme-category" id="custom-themes-category">
                <h5>✨ Custom Themes</h5>
                <div class="custom-themes-container">
                    <div class="custom-themes-grid" id="custom-themes">
                        ${this.generateCustomThemesHTML()}
                    </div>
                    <div class="custom-theme-controls">
                        <button id="create-custom-theme" class="theme-control-btn create-btn">
                            ➕ Create Custom
                        </button>
                        <button id="import-themes" class="theme-control-btn import-btn">
                            📥 Import
                        </button>
                        <button id="export-themes" class="theme-control-btn export-btn">
                            📤 Export
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Générer HTML des thèmes prédéfinis
    generatePredefinedThemesHTML() {
        const predefinedThemes = window.THEME_CONFIG.PREDEFINED_THEMES;
        const currentTheme = this.storage.getCurrentTheme();
        
        return Object.entries(predefinedThemes).map(([themeId, theme]) => {
            const isActive = themeId === currentTheme ? 'active' : '';
            return `
                <button class="theme-btn predefined-theme-btn ${isActive}" 
                        data-theme="${themeId}" 
                        style="background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryLight})">
                    <span class="theme-name">${theme.name}</span>
                </button>
            `;
        }).join('');
    }

    // Générer HTML des thèmes customs
    generateCustomThemesHTML() {
        const customThemes = this.storage.getCustomThemes();
        const currentTheme = this.storage.getCurrentTheme();
        
        if (Object.keys(customThemes).length === 0) {
            return '<div class="no-custom-themes">No custom themes yet</div>';
        }
        
        return Object.entries(customThemes).map(([themeId, theme]) => {
            const isActive = themeId === currentTheme ? 'active' : '';
            return `
                <div class="custom-theme-item ${isActive}">
                    <button class="theme-btn custom-theme-btn" 
                            data-theme="${themeId}" 
                            style="background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryLight})">
                        <span class="theme-name">${theme.name}</span>
                    </button>
                    <button class="delete-custom-theme" data-theme="${themeId}" title="Delete theme">
                        🗑️
                    </button>
                </div>
            `;
        }).join('');
    }

    // Injecter les styles CSS pour l'UI des thèmes
    injectThemeStyles() {
        if (document.getElementById('theme-ui-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'theme-ui-styles';
        style.textContent = `
            .theme-section {
                max-height: 400px !important;
                overflow-y: auto !important;
            }

            .theme-category {
                margin-bottom: 20px !important;
            }

            .theme-category h5 {
                color: var(--better42-text-light) !important;
                font-size: 14px !important;
                font-weight: 600 !important;
                margin-bottom: 10px !important;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
                padding-bottom: 5px !important;
            }

            .predefined-themes-grid {
                display: grid !important;
                grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)) !important;
                gap: 8px !important;
                margin-bottom: 15px !important;
            }

            .custom-themes-container {
                position: relative !important;
            }

            .custom-themes-grid {
                display: grid !important;
                grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)) !important;
                gap: 10px !important;
                margin-bottom: 15px !important;
                min-height: 40px !important;
            }

            .no-custom-themes {
                color: var(--better42-text-light) !important;
                font-style: italic !important;
                text-align: center !important;
                padding: 20px !important;
                background: rgba(255, 255, 255, 0.05) !important;
                border-radius: 8px !important;
                border: 1px dashed rgba(255, 255, 255, 0.2) !important;
            }

            .theme-btn {
                padding: 12px 16px !important;
                border: 2px solid transparent !important;
                border-radius: 8px !important;
                cursor: pointer !important;
                color: white !important;
                font-weight: 600 !important;
                font-size: 13px !important;
                transition: all 0.3s ease !important;
                text-shadow: 0 1px 2px rgba(0,0,0,0.5) !important;
                position: relative !important;
                overflow: hidden !important;
            }

            .theme-btn:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
            }

            .theme-btn.active {
                border-color: rgba(255, 255, 255, 0.8) !important;
                transform: scale(1.05) !important;
                box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3) !important;
            }

            .theme-btn.active::after {
                content: '✓' !important;
                position: absolute !important;
                top: 4px !important;
                right: 6px !important;
                background: rgba(255, 255, 255, 0.9) !important;
                color: #000 !important;
                border-radius: 50% !important;
                width: 18px !important;
                height: 18px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 12px !important;
                font-weight: bold !important;
            }

            .custom-theme-item {
                position: relative !important;
                display: flex !important;
                align-items: stretch !important;
                gap: 5px !important;
            }

            .custom-theme-item .theme-btn {
                flex: 1 !important;
            }

            .delete-custom-theme {
                background: #dc2626 !important;
                border: none !important;
                border-radius: 8px !important;
                cursor: pointer !important;
                color: white !important;
                padding: 8px !important;
                font-size: 14px !important;
                transition: all 0.3s ease !important;
                opacity: 0.7 !important;
            }

            .delete-custom-theme:hover {
                opacity: 1 !important;
                background: #ef4444 !important;
                transform: scale(1.1) !important;
            }

            .custom-theme-controls {
                display: flex !important;
                gap: 8px !important;
                justify-content: center !important;
                flex-wrap: wrap !important;
            }

            .theme-control-btn {
                padding: 8px 12px !important;
                border: 2px solid #555 !important;
                border-radius: 6px !important;
                cursor: pointer !important;
                color: white !important;
                font-weight: 600 !important;
                font-size: 12px !important;
                transition: all 0.3s ease !important;
                background: rgba(0, 0, 0, 0.3) !important;
            }

            .theme-control-btn:hover {
                transform: translateY(-1px) !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
            }

            .create-btn {
                border-color: #059669 !important;
                background: linear-gradient(135deg, #047857, #059669) !important;
            }

            .create-btn:hover {
                background: linear-gradient(135deg, #059669, #10b981) !important;
            }

            .import-btn {
                border-color: #1e40af !important;
                background: linear-gradient(135deg, #1e3a8a, #1e40af) !important;
            }

            .import-btn:hover {
                background: linear-gradient(135deg, #1e40af, #3b82f6) !important;
            }

            .export-btn {
                border-color: #d97706 !important;
                background: linear-gradient(135deg, #c2410c, #d97706) !important;
            }

            .export-btn:hover {
                background: linear-gradient(135deg, #d97706, #f59e0b) !important;
            }

            /* Scrollbar pour la section thèmes */
            .theme-section::-webkit-scrollbar {
                width: 6px !important;
            }

            .theme-section::-webkit-scrollbar-track {
                background: var(--better42-bg-dark) !important;
                border-radius: 3px !important;
            }

            .theme-section::-webkit-scrollbar-thumb {
                background: var(--better42-bg-secondary) !important;
                border-radius: 3px !important;
            }

            .theme-section::-webkit-scrollbar-thumb:hover {
                background: #555 !important;
            }

            .primary-btn {
                background: linear-gradient(135deg, var(--better42-purple), var(--better42-purple-light)) !important;
                color: white !important;
                border: none !important;
                padding: 12px 24px !important;
                border-radius: 8px !important;
                cursor: pointer !important;
                font-weight: 600 !important;
                transition: all 0.3s ease !important;
            }

            .primary-btn:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
            }

            .secondary-btn {
                background: #555 !important;
                color: white !important;
                border: none !important;
                padding: 12px 24px !important;
                border-radius: 8px !important;
                cursor: pointer !important;
                font-weight: 600 !important;
                transition: all 0.3s ease !important;
            }

            .secondary-btn:hover {
                background: #666 !important;
                transform: translateY(-2px) !important;
            }
        `;
        document.head.appendChild(style);
    }
}

class ThemeImporter {
    constructor(storage, onThemesImported) {
        this.storage = storage;
        this.onThemesImported = onThemesImported;
    }

    show() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleFileImport(file);
            }
        });
        input.click();
    }

    handleFileImport(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const result = this.storage.importCustomThemes(e.target.result);
                if (result.success) {
                    alert(`✅ Successfully imported ${result.imported} theme(s)!`);
                    this.onThemesImported();
                } else {
                    alert(`❌ Import failed: ${result.error}`);
                }
            } catch (error) {
                alert(`❌ Error reading file: ${error.message}`);
            }
        };
        reader.readAsText(file);
    }
}

window.ThemeUI = new ThemeUI();