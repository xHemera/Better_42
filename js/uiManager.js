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
    }
    getSettingsPopupHTML() {
        return `
            <div class="popup-content">
                <h3>🎨 Better 42 Settings</h3>
                
                <div class="profile-section">
                    <h4>📁 Profile Manager</h4>
                    <div class="profile-controls">
                        <input type="text" id="profile-name-input" placeholder="Profile name..." maxlength="20" />
                        <button id="create-profile">➕ Create</button>
                    </div>
                    <select id="profile-selector">
                        <option value="">-- No Profile Selected --</option>
                    </select>
                    <div class="profile-buttons">
                        <button id="load-profile">📂 Load</button>
                        <button id="save-profile">💾 Save</button>
                        <button id="delete-profile">🗑️ Delete</button>
                    </div>
                </div>
                
                <div class="settings-section">
                    <h4>🖼️ Background (IMG/GIF/VIDEO)</h4>
                    <input type="text" id="bg-url-input" placeholder="URL: Image, GIF or YouTube video..." />
                    <div class="section-buttons">
                        <button id="apply-bg">Apply BG</button>
                        <button id="reset-bg">Reset BG</button>
                    </div>
                </div>
                
                <div class="settings-section">
                    <h4>👤 Profile Picture (IMG/GIF only)</h4>
                    <input type="text" id="pfp-url-input" placeholder="URL: Image or GIF only..." />
                    <div class="section-buttons">
                        <button id="apply-pfp">Apply PFP</button>
                        <button id="reset-pfp">Reset PFP</button>
                    </div>
                </div>
                
                <div class="popup-footer">
                    <button id="close-popup">✖️ Close</button>
                </div>
            </div>
        `;
    }
    attachEventListeners() {
        this.themeBtn.addEventListener('click', () => {
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
    }
    hideSettingsPopup() {
        this.settingsPopup.classList.remove('show');
    }
    appendToDOM() {
        document.body.appendChild(this.themeBtn);
        document.body.appendChild(this.settingsBtn);
        document.body.appendChild(this.settingsPopup);
        
        document.body.classList.add('page-loaded');
    }
    updateThemeButtonText() {
        if (this.themeBtn) {
            this.themeBtn.innerHTML = window.ThemeManager.getThemeButtonText();
        }
    }
}
window.UIManager = new UIManager();