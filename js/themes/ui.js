
class ThemeUI {
    // INITIALIZES THEME UI COMPONENT WITH STORAGE AND MANAGER REFERENCES
    constructor() {
        this.storage = window.ThemeStorage;
        this.manager = null;
    }

    // CREATES AND RETURNS THE COMPLETE THEME SECTION ELEMENT WITH HTML AND EVENT HANDLERS
    createThemeSection() {
        const section = document.createElement('div');
        section.className = 'settings-section theme-section';
        section.innerHTML = this.getThemeSectionHTML();
        
        this.injectThemeStyles();
        this.attachThemeEvents(section);
        
        return section;
    }

    // GENERATES THE HTML CONTENT FOR THE THEME SECTION INCLUDING PREDEFINED AND CUSTOM THEMES
    getThemeSectionHTML() {
        return `
            <h4>🎨 Color Themes</h4>
            
            <div class="theme-category">
                <h5>📦 Predefined Themes</h5>
                <div class="predefined-themes-grid" id="predefined-themes">
                    ${this.generatePredefinedThemesHTML()}
                </div>
            </div>
            
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

    // GENERATES HTML FOR PREDEFINED THEMES GRID WITH ACTIVE STATE AND STYLING
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

    // GENERATES HTML FOR CUSTOM THEMES GRID WITH DELETE BUTTONS AND ACTIVE STATE
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

    // INJECTS CSS STYLES FOR THEME UI COMPONENTS INCLUDING RESPONSIVE DESIGN
    injectThemeStyles() {
        if (document.getElementById('theme-ui-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'theme-ui-styles';
        style.textContent = `
            .theme-section {
                max-height: 60vh !important;
                overflow-y: auto !important;
                background: rgba(255, 255, 255, 0.02) !important;
                border-radius: 12px !important;
                padding: 20px !important;
                border: 1px solid rgba(255, 255, 255, 0.05) !important;
                backdrop-filter: blur(5px) !important;
            }

            @media (max-width: 768px) {
                .theme-section {
                    padding: 15px !important;
                    max-height: 70vh !important;
                }
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
                display: flex !important;
                flex-wrap: wrap !important;
                gap: 12px !important;
                margin-bottom: 15px !important;
                justify-content: center !important;
            }

            .predefined-themes-grid .theme-btn {
                flex: 0 1 auto !important;
                min-width: 120px !important;
            }

            @media (max-width: 1024px) {
                .predefined-themes-grid {
                    gap: 10px !important;
                }
                .predefined-themes-grid .theme-btn {
                    min-width: 110px !important;
                }
            }

            @media (max-width: 768px) {
                .predefined-themes-grid {
                    gap: 8px !important;
                }
                .predefined-themes-grid .theme-btn {
                    min-width: 100px !important;
                    flex: 1 1 calc(50% - 4px) !important;
                }
            }

            @media (max-width: 480px) {
                .predefined-themes-grid {
                    gap: 6px !important;
                }
                .predefined-themes-grid .theme-btn {
                    min-width: 90px !important;
                    flex: 1 1 calc(50% - 3px) !important;
                    font-size: 11px !important;
                    padding: 12px 8px !important;
                }
            }

            .custom-themes-container {
                position: relative !important;
            }

            .custom-themes-grid {
                display: flex !important;
                flex-wrap: wrap !important;
                gap: 12px !important;
                margin-bottom: 15px !important;
                min-height: 40px !important;
                justify-content: center !important;
            }

            .custom-theme-item {
                flex: 0 1 auto !important;
                min-width: 140px !important;
            }

            @media (max-width: 1024px) {
                .custom-themes-grid {
                    gap: 10px !important;
                }
                .custom-theme-item {
                    min-width: 130px !important;
                }
            }

            @media (max-width: 768px) {
                .custom-themes-grid {
                    gap: 8px !important;
                }
                .custom-theme-item {
                    min-width: 120px !important;
                    flex: 1 1 calc(50% - 4px) !important;
                }
            }

            @media (max-width: 480px) {
                .custom-themes-grid {
                    gap: 6px !important;
                }
                .custom-theme-item {
                    min-width: 100px !important;
                    flex: 1 1 calc(50% - 3px) !important;
                }
                .custom-theme-item .theme-btn {
                    font-size: 11px !important;
                    padding: 12px 8px !important;
                }
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
                padding: 14px 16px !important;
                border: 2px solid transparent !important;
                border-radius: 12px !important;
                cursor: pointer !important;
                color: white !important;
                font-weight: 600 !important;
                font-size: 13px !important;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                text-shadow: 0 1px 3px rgba(0,0,0,0.6) !important;
                position: relative !important;
                overflow: hidden !important;
                backdrop-filter: blur(10px) !important;
            }

            .theme-btn::before {
                content: '' !important;
                position: absolute !important;
                top: 0 !important;
                left: -100% !important;
                width: 100% !important;
                height: 100% !important;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent) !important;
                transition: left 0.6s !important;
            }

            .theme-btn:hover::before {
                left: 100% !important;
            }

            .theme-btn:hover {
                transform: translateY(-3px) scale(1.02) !important;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4) !important;
                border-color: rgba(255, 255, 255, 0.3) !important;
            }

            .theme-btn.active {
                border-color: rgba(255, 255, 255, 0.8) !important;
                transform: scale(1.05) !important;
                box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.4), 0 8px 25px rgba(0, 0, 0, 0.5) !important;
            }

            .theme-btn.active::after {
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
                gap: 10px !important;
                justify-content: center !important;
                flex-wrap: wrap !important;
                margin-top: 10px !important;
            }

            @media (max-width: 480px) {
                .custom-theme-controls {
                    flex-direction: column !important;
                    gap: 8px !important;
                }
            }

            .theme-control-btn {
                padding: 10px 16px !important;
                border: 2px solid var(--better42-primary-dark-alpha) !important;
                border-radius: 8px !important;
                cursor: pointer !important;
                color: white !important;
                font-weight: 600 !important;
                font-size: 12px !important;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                background: var(--better42-primary-alpha-dark) !important;
                backdrop-filter: blur(10px) !important;
                min-width: 100px !important;
            }

            .theme-control-btn:hover {
                transform: translateY(-2px) scale(1.02) !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
            }

            .create-btn {
                border-color: var(--better42-primary) !important;
                background: linear-gradient(135deg, var(--better42-primary-dark), var(--better42-primary)) !important;
            }

            .create-btn:hover {
                background: linear-gradient(135deg, var(--better42-primary), var(--better42-primary-light)) !important;
            }

            .import-btn {
                border-color: var(--better42-primary-light) !important;
                background: linear-gradient(135deg, var(--better42-primary), var(--better42-primary-light)) !important;
            }

            .import-btn:hover {
                background: linear-gradient(135deg, var(--better42-primary-light), var(--better42-primary-lighter)) !important;
            }

            .export-btn {
                border-color: var(--better42-primary-lighter) !important;
                background: linear-gradient(135deg, var(--better42-primary-light), var(--better42-primary-lighter)) !important;
            }

            .export-btn:hover {
                background: linear-gradient(135deg, var(--better42-primary-lighter), var(--better42-primary-light)) !important;
                opacity: 0.9 !important;
            }

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
                background: linear-gradient(135deg, var(--better42-primary), var(--better42-primary-light)) !important;
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
    // INITIALIZES THEME IMPORTER WITH STORAGE REFERENCE AND CALLBACK FUNCTION
    constructor(storage, onThemesImported) {
        this.storage = storage;
        this.onThemesImported = onThemesImported;
    }

    // DISPLAYS FILE INPUT DIALOG FOR IMPORTING THEME FILES
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

    // PROCESSES IMPORTED THEME FILE AND HANDLES SUCCESS OR ERROR STATES
    handleFileImport(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const result = this.storage.importCustomThemes(e.target.result);
                if (result.success) {
                    alert(`✅ Successfully imported ${result.imported} theme(s)!`);
                    this.onThemesImported();
                } else {
                    console.error('Import failed:', result.error);
                    alert(`❌ Import failed: ${result.error}`);
                }
            } catch (error) {
                console.error('Error reading file:', error.message);
                alert(`❌ Error reading file: ${error.message}`);
            }
        };
        reader.readAsText(file);
    }
}

window.ThemeUI = new ThemeUI();