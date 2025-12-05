class UIManager {
    constructor() {
        this.themeBtn = null;
        this.settingsBtn = null;
        this.settingsPopup = null;
        this.buttonsCreated = false;
        this.listenersAttached = false;
        this.lastButtonState = null;
    }

    createUI() {

        if (!window.PageDetector) {
            console.error('PageDetector not available');
            return;
        }


        if (!window.PageDetector.isSupported()) {
            return;
        }


        const existingThemeBtn = document.getElementById('theme-switcher');
        const existingSettingsBtn = document.getElementById('settings-btn');

        if (existingThemeBtn && existingSettingsBtn) {
            this.themeBtn = existingThemeBtn;
            this.settingsBtn = existingSettingsBtn;
            this.buttonsCreated = true;
            this.updateThemeButtonText();
            return;
        }

        const pageConfig = window.PageDetector.getPageConfig();

        if (!this.buttonsCreated) {
            this.createThemeButton();

            if (pageConfig.showSettings) {
                this.createSettingsButton();
                this.createSettingsPopup();
            }

            this.attachEventListeners();
            this.appendToDOM();
            this.buttonsCreated = true;
        }
    }

    createThemeButton() {
        if (document.getElementById('theme-switcher')) {
            this.themeBtn = document.getElementById('theme-switcher');
            return;
        }

        this.themeBtn = document.createElement('button');
        this.themeBtn.id = 'theme-switcher';
        this.themeBtn.innerHTML = window.ThemeManager.getThemeButtonText();

        this.themeBtn.style.cssText = `
            position: fixed !important;
            top: 10px !important;
            right: 180px !important;
            z-index: 10000 !important;
        `;
    }

    createSettingsButton() {
        if (document.getElementById('settings-btn')) {
            this.settingsBtn = document.getElementById('settings-btn');
            return;
        }

        this.settingsBtn = document.createElement('button');
        this.settingsBtn.id = 'settings-btn';
        this.settingsBtn.innerHTML = '⚙︎';

        this.settingsBtn.style.cssText = `
            position: fixed !important;
            top: 10px !important;
            right: 265px !important;
            z-index: 10000 !important;
        `;
    }

    createSettingsPopup() {
        if (document.getElementById('settings-popup')) {
            this.settingsPopup = document.getElementById('settings-popup');
            return;
        }

        this.settingsPopup = document.createElement('div');
        this.settingsPopup.id = 'settings-popup';
        this.settingsPopup.innerHTML = this.getSettingsPopupHTML();
        this.settingsPopup.classList.remove('show');

        this.addColorThemeSection();
    }

    attachEventListeners() {
        if (this.themeBtn && !this.themeBtn.hasAttribute('data-listeners-attached')) {
            this.themeBtn.addEventListener('click', () => {
                if (window.ThemeManager.isDark) {
                    this.themeBtn.innerHTML = 'Better';
                    this.themeBtn.style.background = 'linear-gradient(135deg, #6b7280, #9ca3af) !important';
                    this.themeBtn.style.borderColor = '#6b7280 !important';
                } else {
                    this.themeBtn.innerHTML = 'Worse';
                }

                window.ThemeManager.toggleTheme();
                setTimeout(() => {
                    this.enforceButtonPositions();
                }, 0);
            });

            this.themeBtn.addEventListener('mouseenter', () => {
                this.applyHoverEffect(this.themeBtn, true);
            });

            this.themeBtn.addEventListener('mouseleave', () => {
                this.applyHoverEffect(this.themeBtn, false);
            });

            this.themeBtn.setAttribute('data-listeners-attached', 'true');
        }

        if (this.settingsBtn && !this.settingsBtn.hasAttribute('data-listeners-attached')) {
            this.settingsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleSettingsPopup();
            });

            this.settingsBtn.addEventListener('mouseenter', () => {
                this.applyHoverEffect(this.settingsBtn, true);
            });

            this.settingsBtn.addEventListener('mouseleave', () => {
                this.applyHoverEffect(this.settingsBtn, false);
            });

            this.settingsBtn.setAttribute('data-listeners-attached', 'true');
        }

        if (this.settingsPopup && !this.settingsPopup.hasAttribute('data-listeners-attached')) {
            this.settingsPopup.addEventListener('click', (e) => {
                if (e.target === this.settingsPopup) {
                    this.hideSettingsPopup();
                }
            });
            this.settingsPopup.setAttribute('data-listeners-attached', 'true');
        }

        if (!this.listenersAttached) {
            document.addEventListener('click', (e) => {
                this.handlePopupButtonClick(e);
            });
            this.listenersAttached = true;

            this.addResetButtonStyles();
        }
    }

    enforceButtonPositions() {
        if (!this.themeBtn) return;

        const currentState = `${window.ThemeManager?.isDark}-${window.ColorThemeManager?.getCurrentTheme()}`;
        if (this.lastButtonState === currentState) return;
        this.lastButtonState = currentState;

        const isThemeActive = window.ThemeManager && window.ThemeManager.isDark;
        let bgColors, borderColor;

        if (isThemeActive) {
            if (window.ColorThemeManager) {
                const currentTheme = window.ColorThemeManager.getCurrentTheme();
                if (currentTheme === 'custom') {
                    const savedCustomColor = localStorage.getItem('better42-custom-color');
                    if (savedCustomColor) {
                        const customTheme = window.ColorThemeManager.generateCustomTheme(savedCustomColor);
                        bgColors = `${customTheme.primary}, ${customTheme.primaryLight}`;
                        borderColor = customTheme.primary;
                    } else {
                        bgColors = 'var(--better42-primary), var(--better42-primary-light)';
                        borderColor = 'var(--better42-primary)';
                    }
                } else {
                    const theme = window.ColorThemeManager.themes[currentTheme];
                    if (theme) {
                        bgColors = `${theme.primary}, ${theme.primaryLight}`;
                        borderColor = theme.primary;
                    } else {
                        bgColors = 'var(--better42-primary), var(--better42-primary-light)';
                        borderColor = 'var(--better42-primary)';
                    }
                }
            } else {
                bgColors = 'var(--better42-primary), var(--better42-primary-light)';
                borderColor = 'var(--better42-primary)';
            }
        } else {
            bgColors = '#6b7280, #9ca3af';
            borderColor = '#6b7280';
        }

        this.themeBtn.style.cssText = `
            position: fixed !important;
            top: 10px !important;
            right: 180px !important;
            z-index: 99999 !important;
            background: linear-gradient(135deg, ${bgColors}) !important;
            color: white !important;
            border: 2px solid ${borderColor} !important;
            padding: 10px 16px !important;
            border-radius: 8px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            box-shadow: 0 4px 12px rgba(68, 68, 68, 0.3) !important;
            transition: none !important;
            display: block !important;
            visibility: visible !important;
        `;

        if (this.settingsBtn) {
            this.settingsBtn.style.cssText = `
                position: fixed !important;
                top: 10px !important;
                right: 265px !important;
                z-index: 99999 !important;
                background: linear-gradient(135deg, ${bgColors}) !important;
                color: white !important;
                border: 2px solid ${borderColor} !important;
                padding: 10px 16px !important;
                border-radius: 8px !important;
                cursor: pointer !important;
                font-size: 14px !important;
                font-weight: 600 !important;
                box-shadow: 0 4px 12px rgba(68, 68, 68, 0.3) !important;
                transition: none !important;
                display: block !important;
                visibility: visible !important;
            `;
        }
    }

    applyHoverEffect(button, isHover) {
        const isThemeActive = window.ThemeManager && window.ThemeManager.isDark;
        let bgColors, borderColor;

        if (isHover) {
            if (isThemeActive) {
                if (window.ColorThemeManager) {
                    const currentTheme = window.ColorThemeManager.getCurrentTheme();
                    if (currentTheme === 'custom') {
                        const savedCustomColor = localStorage.getItem('better42-custom-color');
                        if (savedCustomColor) {
                            const customTheme = window.ColorThemeManager.generateCustomTheme(savedCustomColor);
                            bgColors = `${customTheme.primaryLight}, ${customTheme.primaryLighter}`;
                            borderColor = customTheme.primaryLight;
                        } else {
                            bgColors = 'var(--better42-primary-light), var(--better42-primary-lighter)';
                            borderColor = 'var(--better42-primary-light)';
                        }
                    } else {
                        const theme = window.ColorThemeManager.themes[currentTheme];
                        if (theme) {
                            bgColors = `${theme.primaryLight}, ${theme.primaryLighter}`;
                            borderColor = theme.primaryLight;
                        } else {
                            bgColors = 'var(--better42-primary-light), var(--better42-primary-lighter)';
                            borderColor = 'var(--better42-primary-light)';
                        }
                    }
                } else {
                    bgColors = 'var(--better42-primary-light), var(--better42-primary-lighter)';
                    borderColor = 'var(--better42-primary-light)';
                }
            } else {
                bgColors = '#9ca3af, #d1d5db';
                borderColor = '#9ca3af';
            }

            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 20px rgba(68, 68, 68, 0.4) !important';
        } else {
            if (isThemeActive) {
                if (window.ColorThemeManager) {
                    const currentTheme = window.ColorThemeManager.getCurrentTheme();
                    if (currentTheme === 'custom') {
                        const savedCustomColor = localStorage.getItem('better42-custom-color');
                        if (savedCustomColor) {
                            const customTheme = window.ColorThemeManager.generateCustomTheme(savedCustomColor);
                            bgColors = `${customTheme.primary}, ${customTheme.primaryLight}`;
                            borderColor = customTheme.primary;
                        } else {
                            bgColors = 'var(--better42-primary), var(--better42-primary-light)';
                            borderColor = 'var(--better42-primary)';
                        }
                    } else {
                        const theme = window.ColorThemeManager.themes[currentTheme];
                        if (theme) {
                            bgColors = `${theme.primary}, ${theme.primaryLight}`;
                            borderColor = theme.primary;
                        } else {
                            bgColors = 'var(--better42-primary), var(--better42-primary-light)';
                            borderColor = 'var(--better42-primary)';
                        }
                    }
                } else {
                    bgColors = 'var(--better42-primary), var(--better42-primary-light)';
                    borderColor = 'var(--better42-primary)';
                }
            } else {
                bgColors = '#6b7280, #9ca3af';
                borderColor = '#6b7280';
            }

            button.style.transform = 'none';
            button.style.boxShadow = '0 4px 12px rgba(68, 68, 68, 0.3) !important';
        }

        button.style.background = `linear-gradient(135deg, ${bgColors}) !important`;
        button.style.borderColor = `${borderColor} !important`;
    }

    updateThemeButtonText() {
        if (this.themeBtn) {
            this.themeBtn.innerHTML = window.ThemeManager.getThemeButtonText();

            this.enforceButtonPositions();
        }
    }

    appendToDOM() {

        if (this.themeBtn && !document.getElementById('theme-switcher')) {
            document.body.appendChild(this.themeBtn);
        }

        const pageConfig = window.PageDetector.getPageConfig();
        if (pageConfig.showSettings) {
            if (this.settingsBtn && !document.getElementById('settings-btn')) {
                document.body.appendChild(this.settingsBtn);
            }
            if (this.settingsPopup && !document.getElementById('settings-popup')) {
                document.body.appendChild(this.settingsPopup);
            }
        }

        setTimeout(() => {
            this.enforceButtonPositions();
        }, 100);

        document.body.classList.add('page-loaded');
    }

    refreshUI() {
        this.updateThemeButtonText();
        this.enforceButtonPositions();
        if (this.settingsBtn) {
            const shouldShow = window.ThemeManager && window.ThemeManager.isDark;
            this.settingsBtn.style.display = shouldShow ? 'block' : 'none';
        }
    }
    observePageChanges() {
        const observer = new MutationObserver(() => {
            const themeBtn = document.getElementById('theme-switcher');
            const settingsBtn = document.getElementById('settings-btn');

            if (!themeBtn || !settingsBtn) {
                this.createUI();
            } else {
                this.enforceButtonPositions();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    addColorThemeSection() {
        if (!this.settingsPopup) return;

        const popupContent = this.settingsPopup.querySelector('.popup-content');
        if (!popupContent) return;

        const popupFooter = popupContent.querySelector('.popup-footer');

        if (window.ColorThemeManager && window.ColorThemeManager.createUI) {
            const colorSection = window.ColorThemeManager.createUI();

            if (popupFooter) {
                popupContent.insertBefore(colorSection, popupFooter);
            } else {
                popupContent.appendChild(colorSection);
            }
        }
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

    addResetButtonStyles() {
        if (document.getElementById('ui-manager-styles')) return;

        const style = document.createElement('style');
        style.id = 'ui-manager-styles';
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

            #apply-bg, #apply-pfp {
                background: linear-gradient(135deg, #059669, #10b981) !important;
                color: white !important;
                border: none !important;
                padding: 8px 16px !important;
                border-radius: 6px !important;
                cursor: pointer !important;
                font-weight: 600 !important;
                font-size: 12px !important;
                transition: none !important;
            }

            #apply-bg:hover, #apply-pfp:hover {
                background: linear-gradient(135deg, #10b981, #34d399) !important;
                transform: translateY(-1px) !important;
            }

            #reset-bg, #reset-pfp {
                background: linear-gradient(135deg, #dc2626, #ef4444) !important;
                color: white !important;
                border: none !important;
                padding: 8px 16px !important;
                border-radius: 6px !important;
                cursor: pointer !important;
                font-weight: 600 !important;
                font-size: 12px !important;
                transition: none !important;
            }

            #reset-bg:hover, #reset-pfp:hover {
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
                transition: none !important;
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
        if (window.ColorThemeManager && window.ColorThemeManager.resetToDefaults) {
            if (window.ColorThemeManager.resetToDefaults()) {
                this.hideSettingsPopup();
                setTimeout(() => {
                    this.showSettingsPopup();
                }, 500);
            }
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

        // Remove saved background URL
        localStorage.removeItem('better42-current-background-url');

        if (window.ProfileManager) {
            window.ProfileManager.resetBackgroundElements();
        }
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

        if (window.ProfileManager) {
            window.ProfileManager.resetProfilePicElements();
        }
    }

    toggleSettingsPopup() {
        if (!this.settingsPopup) return;

        if (this.settingsPopup.classList.contains('show')) {
            this.hideSettingsPopup();
        } else {
            this.showSettingsPopup();
        }
    }

    showSettingsPopup() {
        if (!this.settingsPopup) return;

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

        if (window.ColorThemeManager && window.ColorThemeManager.getThemeStats) {
        }
    }

    hideSettingsPopup() {
        if (!this.settingsPopup) return;

        this.settingsPopup.classList.remove('show');
    }
}

window.UIManager = new UIManager();
