
class UIManager {
    constructor() {
        this.themeBtn = null;
        this.settingsBtn = null;
        this.settingsPopup = null;
    }

    createUI() {
        this.createThemeButton();
        this.createSettingsButton();
        this.createSettingsPopup();
        this.attachEventListeners();
        this.appendToDOM();
    }

    createThemeButton() {
        this.themeBtn = document.createElement('button');
        this.themeBtn.id = 'theme-switcher';
        this.themeBtn.innerHTML = window.ThemeManager.getThemeButtonText();
    }

    createSettingsButton() {
        this.settingsBtn = document.createElement('button');
        this.settingsBtn.id = 'settings-btn';
        this.settingsBtn.innerHTML = '⚙️';
    }

    createSettingsPopup() {
        this.settingsPopup = document.createElement('div');
        this.settingsPopup.id = 'settings-popup';
        this.settingsPopup.innerHTML = this.getSettingsPopupHTML();
        this.settingsPopup.classList.remove('show');
        
        this.addColorThemeSection();
    }

    addColorThemeSection() {
        const popupContent = this.settingsPopup.querySelector('.popup-content');
        const popupFooter = popupContent.querySelector('.popup-footer');
        
        const colorSection = window.ColorThemeManager.createUI();
        
        popupContent.insertBefore(colorSection, popupFooter);
    }

    getSettingsPopupHTML() {
        return `
            <div class="popup-content">
                <h3>🎨 Better 42 Settings</h3>
                
                <div class="profile-section">
                    <h4>📁 Gestionnaire de Profils</h4>
                    <div class="profile-row">
                        <div class="profile-create">
                            <input type="text" id="profile-name-input" placeholder="Nom du profil..." maxlength="20" />
                            <button id="create-profile">➕ Créer</button>
                        </div>
                        <select id="profile-selector">
                            <option value="">-- Aucun Profil --</option>
                        </select>
                        <div class="profile-actions">
                            <button id="load-profile">📂 Charger</button>
                            <button id="save-profile">💾 Sauver</button>
                            <button id="delete-profile">🗑️ Supprimer</button>
                        </div>
                    </div>
                </div>
                
                <div class="settings-section">
                    <h4>🖼️ Fond d'écran (IMG/GIF/VIDEO)</h4>
                    <div class="input-row">
                        <input type="text" id="bg-url-input" placeholder="URL: Image, GIF ou vidéo YouTube..." />
                        <div class="section-buttons">
                            <button id="apply-bg">Appliquer</button>
                            <button id="reset-bg">Reset</button>
                        </div>
                    </div>
                </div>
                
                <div class="settings-section">
                    <h4>👤 Photo de profil (IMG/GIF)</h4>
                    <div class="input-row">
                        <input type="text" id="pfp-url-input" placeholder="URL: Image ou GIF..." />
                        <div class="section-buttons">
                            <button id="apply-pfp">Appliquer</button>
                            <button id="reset-pfp">Reset</button>
                        </div>
                    </div>
                </div>
                
                
                <div class="popup-footer">
                    <button id="close-popup">✖️ Fermer</button>
                    <button id="reset-all-themes" class="reset-themes-btn">🔄 Reset Couleurs</button>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        this.themeBtn.addEventListener('click', () => {
            if (window.ThemeManager.isDark) {
                this.themeBtn.innerHTML = 'Better';
            } else {
                this.themeBtn.innerHTML = 'Worse';
            }
            
            window.ThemeManager.toggleTheme();
        });

        this.settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleSettingsPopup();
        });

        this.settingsPopup.addEventListener('click', (e) => {
            if (e.target === this.settingsPopup) {
                this.hideSettingsPopup();
            }
        });

        document.addEventListener('click', (e) => {
            this.handlePopupButtonClick(e);
        });

        this.addResetButtonStyles();
    }

    addResetButtonStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .profile-row {
                display: flex !important;
                gap: 10px !important;
                align-items: end !important;
                flex-wrap: wrap !important;
            }

            .profile-create {
                display: flex !important;
                gap: 5px !important;
                flex: 1 !important;
                min-width: 200px !important;
            }

            .profile-actions {
                display: flex !important;
                gap: 5px !important;
                flex-wrap: wrap !important;
            }
            
            .profile-actions button {
                background: linear-gradient(135deg, #6366f1, #818cf8) !important;
                color: #fff !important;
                border: none !important;
                padding: 9px 18px !important;
                border-radius: 7px !important;
                cursor: pointer !important;
                font-weight: 600 !important;
                font-size: 14px !important;
                box-shadow: 0 2px 8px rgba(99, 102, 241, 0.10) !important;
                transition: all 0.18s;
                outline: none !important;
            }
            .profile-actions button:hover {
                transform: translateY(-1px) scale(1.02) !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
            }

            .input-row {
                display: flex !important;
                gap: 10px !important;
                align-items: center !important;
                flex-wrap: wrap !important;
            }

            .input-row input {
                flex: 1 !important;
                min-width: 250px !important;
            }

            .section-buttons {
                display: flex !important;
                gap: 5px !important;
                flex-shrink: 0 !important;
            }

            #apply-bg {
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

            #apply-bg:hover {
                background: linear-gradient(135deg, #10b981, #34d399) !important;
                transform: translateY(-1px) !important;
            }

            #reset-bg {
                background: linear-gradient(135deg, #dc2626, #ef4444) !important;
                color: white !important;
                border: none !important;
                padding: 8px 16px !important;
                border-radius: 6px !important;
                cursor: pointer !important;
                font-weight: 600 !important;
                font-size: 12px !important;
                transition: all 0.3s ease !important;
            }

            #reset-bg:hover {
                background: linear-gradient(135deg, #ef4444, #f87171) !important;
                transform: translateY(-1px) !important;
            }

            #apply-pfp {
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

            #apply-pfp:hover {
                background: linear-gradient(135deg, #10b981, #34d399) !important;
                transform: translateY(-1px) !important;
            }

            #reset-pfp {
                background: linear-gradient(135deg, #dc2626, #ef4444) !important;
                color: white !important;
                border: none !important;
                padding: 8px 16px !important;
                border-radius: 6px !important;
                cursor: pointer !important;
                font-weight: 600 !important;
                font-size: 12px !important;
                transition: all 0.3s ease !important;
            }

            #reset-pfp:hover {
                background: linear-gradient(135deg, #ef4444, #f87171) !important;
                transform: translateY(-1px) !important;
            }

            .popup-footer {
                display: flex !important;
                gap: 10px !important;
                justify-content: center !important;
                align-items: center !important;
            }

            .reset-themes-btn {
                background: linear-gradient(135deg, #dc2626, #ef4444) !important;
                color: white !important;
                border: none !important;
                padding: 12px 20px !important;
                border-radius: 8px !important;
                cursor: pointer !important;
                font-weight: 600 !important;
                font-size: 14px !important;
                transition: all 0.3s ease !important;
            }

            .reset-themes-btn:hover {
                background: linear-gradient(135deg, #ef4444, #f87171) !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3) !important;
            }
        `;
        document.head.appendChild(style);
    }

    handlePopupButtonClick(e) {
        switch (e.target.id) {
            case 'create-profile':
                window.ProfileManager.createProfile();
                break;
            case 'load-profile':
                window.ProfileManager.loadProfile();
                break;
            case 'save-profile':
                window.ProfileManager.saveCurrentProfile();
                break;
            case 'delete-profile':
                window.ProfileManager.deleteProfile();
                break;
            case 'apply-bg':
                this.applyBackground();
                break;
            case 'reset-bg':
                this.resetBackground();
                break;
            case 'apply-pfp':
                this.applyProfilePicture();
                break;
            case 'reset-pfp':
                this.resetProfilePicture();
                break;
            case 'close-popup':
                this.hideSettingsPopup();
                break;
            case 'reset-all-themes':
                this.resetAllThemes();
                break;
        }
    }

    resetAllThemes() {
        if (window.ColorThemeManager.resetToDefaults()) {
            this.hideSettingsPopup();
            setTimeout(() => {
                this.showSettingsPopup();
            }, 500);
        }
    }

    applyBackground() {
        const bgInput = document.getElementById('bg-url-input');
        const url = bgInput ? bgInput.value.trim() : '';
        if (url) {
            window.BackgroundManager.applyCustomBackground(url);
        }
    }

    resetBackground() {
        const bgInput = document.getElementById('bg-url-input');
        if (bgInput) bgInput.value = '';
        location.reload();
    }

    applyProfilePicture() {
        const pfpInput = document.getElementById('pfp-url-input');
        const url = pfpInput ? pfpInput.value.trim() : '';
        if (url) {
            window.BackgroundManager.applyCustomPfp(url);
        }
    }

    resetProfilePicture() {
        const pfpInput = document.getElementById('pfp-url-input');
        if (pfpInput) pfpInput.value = '';
        location.reload();
    }

    toggleSettingsPopup() {
        if (this.settingsPopup.classList.contains('show')) {
            this.hideSettingsPopup();
        } else {
            this.showSettingsPopup();
        }
    }

    showSettingsPopup() {
        this.settingsPopup.classList.add('show');
        window.ProfileManager.loadProfilesList();
        
        const bgInput = document.getElementById('bg-url-input');
        const pfpInput = document.getElementById('pfp-url-input');
        const defaultProfileId = window.ProfileManager.getDefaultProfile();
        
        if (defaultProfileId) {
            const profileData = localStorage.getItem(`${Better42Config.STORAGE_KEYS.PROFILE_DATA_PREFIX}${defaultProfileId}`);
            if (profileData) {
                const data = JSON.parse(profileData);
                if (bgInput) bgInput.value = data.backgroundUrl || '';
                if (pfpInput) pfpInput.value = data.profilePicUrl || '';
            }
        }

        console.log('Theme Statistics:', window.ColorThemeManager.getThemeStats());
    }

    hideSettingsPopup() {
        this.settingsPopup.classList.remove('show');
    }

    appendToDOM() {
        document.body.appendChild(this.themeBtn);
        
        if (window.location.hostname === 'profile-v3.intra.42.fr') {
            document.body.appendChild(this.settingsBtn);
            document.body.appendChild(this.settingsPopup);
        }
        
        document.body.classList.add('page-loaded');
    }

    updateThemeButtonText() {
        if (this.themeBtn) {
            this.themeBtn.innerHTML = window.ThemeManager.getThemeButtonText();
        }
    }
}

window.UIManager = new UIManager();