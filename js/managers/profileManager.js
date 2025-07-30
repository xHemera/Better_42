class ProfileManager {
    // INITIALIZES THE PROFILE MANAGER WITH DEFAULT VALUES
    constructor() {
        this.currentProfile = null;
        this.isOwnProfile = true;
    }

    // HANDLES PROFILE OWNERSHIP CHANGES AND APPLIES OR REMOVES CUSTOMIZATIONS ACCORDINGLY
    onProfileChange(isOwnProfile) {
        const wasOwnProfile = this.isOwnProfile;
        this.isOwnProfile = isOwnProfile;
        
        if (wasOwnProfile && !isOwnProfile) {
            this.removeCustomizations();
        } else if (!wasOwnProfile && isOwnProfile) {
            this.applyOwnProfileCustomizations();
        }
    }

    // DETERMINES WHETHER CUSTOMIZATIONS SHOULD BE APPLIED BASED ON PROFILE OWNERSHIP
    shouldApplyCustomizations() {
        if (window.ProfileDetector && window.ProfileDetector.initialized) {
            return window.ProfileDetector.isViewingOwnProfile();
        }
        
        return this.isOwnProfile;
    }

    // RETRIEVES THE DEFAULT PROFILE ID FROM LOCAL STORAGE
    getDefaultProfile() {
        return localStorage.getItem(Better42Config.STORAGE_KEYS.DEFAULT_PROFILE);
    }

    // SETS THE DEFAULT PROFILE ID IN LOCAL STORAGE
    setDefaultProfile(profileId) {
        localStorage.setItem(Better42Config.STORAGE_KEYS.DEFAULT_PROFILE, profileId);
    }

    // LOADS AND POPULATES THE PROFILES LIST IN THE SELECTOR DROPDOWN
    loadProfilesList() {
        const selector = document.getElementById('profile-selector');
        if (!selector) return;
        
        selector.innerHTML = '<option value="">-- No Profile Selected --</option>';
        
        this.ensurePublicProfileExists();
        
        const profiles = JSON.parse(localStorage.getItem(Better42Config.STORAGE_KEYS.PROFILES_LIST) || '[]');
        const defaultProfileId = this.getDefaultProfile();
        
        profiles.forEach(profile => {
            const option = document.createElement('option');
            option.value = profile.id;
            
            const icon = profile.id === 'public' ? '🌐' : '📁';
            const suffix = profile.id === defaultProfileId ? ' (Default)' : '';
            option.textContent = `${icon} ${profile.name}${suffix}`;
            
            selector.appendChild(option);
        });
        
        if (defaultProfileId) {
            selector.value = defaultProfileId;
        }
    }
    
    // ENSURES THE PUBLIC PROFILE EXISTS IN STORAGE AND CREATES IT IF MISSING
    ensurePublicProfileExists() {
        let profiles = JSON.parse(localStorage.getItem(Better42Config.STORAGE_KEYS.PROFILES_LIST) || '[]');
        
        const publicProfileExists = profiles.some(profile => profile.id === 'public');
        
        if (!publicProfileExists) {
            const publicProfile = {
                id: 'public',
                name: 'Public',
                createdAt: new Date().toISOString()
            };
            
            profiles.unshift(publicProfile);
            
            localStorage.setItem(Better42Config.STORAGE_KEYS.PROFILES_LIST, JSON.stringify(profiles));
            
            const publicDataKey = `${Better42Config.STORAGE_KEYS.PROFILE_DATA_PREFIX}public`;
            if (!localStorage.getItem(publicDataKey)) {
                const emptyPublicData = {
                    backgroundUrl: '',
                    profilePicUrl: '',
                    createdAt: new Date().toISOString()
                };
                localStorage.setItem(publicDataKey, JSON.stringify(emptyPublicData));
            }
        }
    }

    // LOADS THE DEFAULT PROFILE ON STARTUP IF CONDITIONS ARE MET
    loadDefaultProfileOnStartup() {
        if (!window.PageDetector) {
            return;
        }

        const pageConfig = window.PageDetector.getPageConfig();
        if (!pageConfig.showCustomization) {
            return;
        }

        if (!this.shouldApplyCustomizations()) {
            return;
        }
        
        if (!window.ThemeManager || !window.ThemeManager.isDark) {
            return;
        }

        const defaultProfileId = this.getDefaultProfile();
        if (!defaultProfileId) return;
        
        const profileData = localStorage.getItem(`${Better42Config.STORAGE_KEYS.PROFILE_DATA_PREFIX}${defaultProfileId}`);
        if (!profileData) return;
        
        const data = JSON.parse(profileData);
        
        setTimeout(() => {
            if (data.backgroundUrl) {
                window.BackgroundManager.applyCustomBackground(data.backgroundUrl);
            }
            if (data.profilePicUrl) {
                window.BackgroundManager.applyCustomPfp(data.profilePicUrl);
            }
        }, 100);
        
        this.currentProfile = defaultProfileId;
        
        setTimeout(() => {
            const bgInput = document.getElementById('bg-url-input');
            const pfpInput = document.getElementById('pfp-url-input');
            if (bgInput) bgInput.value = data.backgroundUrl || '';
            if (pfpInput) pfpInput.value = data.profilePicUrl || '';
        }, 100);
    }

    // CREATES A NEW PROFILE WITH THE SPECIFIED NAME AND ADDS IT TO STORAGE
    createProfile() {
        const nameInput = document.getElementById('profile-name-input');
        if (!nameInput) return;
        
        const name = nameInput.value.trim();
        if (!name) {
            alert('❌ Enter a profile name!');
            return;
        }
        
        const profiles = JSON.parse(localStorage.getItem(Better42Config.STORAGE_KEYS.PROFILES_LIST) || '[]');
        
        if (profiles.length >= 5) {
            alert('❌ Maximum 5 profiles allowed!');
            return;
        }
        
        if (profiles.some(p => p.name === name)) {
            alert('❌ Profile name already exists!');
            return;
        }
        
        const profileId = Date.now().toString();
        profiles.push({ id: profileId, name: name });
        localStorage.setItem(Better42Config.STORAGE_KEYS.PROFILES_LIST, JSON.stringify(profiles));
        
        if (profiles.length === 1) {
            this.setDefaultProfile(profileId);
            alert(`✅ Profile "${name}" created and set as default!`);
        } else {
            alert(`✅ Profile "${name}" created!`);
        }
        
        nameInput.value = '';
        this.loadProfilesList();
    }

    // SAVES THE CURRENT PROFILE DATA INCLUDING BACKGROUND AND PROFILE PICTURE URLS
    saveCurrentProfile() {
        const selector = document.getElementById('profile-selector');
        if (!selector || !selector.value) {
            alert('❌ Select a profile first!');
            return;
        }
        
        const bgInput = document.getElementById('bg-url-input');
        const pfpInput = document.getElementById('pfp-url-input');
        
        const profileData = {
            backgroundUrl: bgInput ? bgInput.value.trim() : '',
            profilePicUrl: pfpInput ? pfpInput.value.trim() : '',
            savedAt: new Date().toISOString()
        };
        
        localStorage.setItem(`${Better42Config.STORAGE_KEYS.PROFILE_DATA_PREFIX}${selector.value}`, JSON.stringify(profileData));
        
        if (selector.value === 'public') {
            this.syncPublicProfileToFirebase(profileData);
        }
        
        alert(`💾 Profile saved!`);
    }
    
    // SYNCHRONIZES THE PUBLIC PROFILE DATA TO FIREBASE FOR SHARING
    async syncPublicProfileToFirebase(profileData) {
        try {
            const currentUser = window.ProfileDetector?.getCurrentUser();
            if (!currentUser) {
                return;
            }
            
            if (window.ThemeSync && window.ThemeSync.shareMyTheme) {
                const oldProfileData = window.ProfileManager.getCurrentProfileData;
                
                window.ProfileManager.getCurrentProfileData = () => profileData;
                
                const success = await window.ThemeSync.shareMyTheme(currentUser, true);
                
                if (oldProfileData) {
                    window.ProfileManager.getCurrentProfileData = oldProfileData;
                }
            }
        } catch (error) {
            console.error('❌ Erreur synchronisation profil Public:', error);
        }
    }

    // LOADS A SELECTED PROFILE AND APPLIES ITS CUSTOMIZATIONS
    loadProfile() {
        const selector = document.getElementById('profile-selector');
        if (!selector || !selector.value) {
            alert('❌ Select a profile first!');
            return;
        }
        
        const profileData = localStorage.getItem(`${Better42Config.STORAGE_KEYS.PROFILE_DATA_PREFIX}${selector.value}`);
        if (!profileData) {
            alert('❌ Profile has no saved data!');
            return;
        }
        
        const data = JSON.parse(profileData);
        
        const bgInput = document.getElementById('bg-url-input');
        const pfpInput = document.getElementById('pfp-url-input');
        
        if (bgInput) bgInput.value = data.backgroundUrl || '';
        if (pfpInput) pfpInput.value = data.profilePicUrl || '';
        
        if (data.backgroundUrl) {
            window.BackgroundManager.applyCustomBackground(data.backgroundUrl);
        }
        if (data.profilePicUrl) {
            window.BackgroundManager.applyCustomPfp(data.profilePicUrl);
        }
        
        this.currentProfile = selector.value;
        alert(`📂 Profile loaded!`);
    }

    // DELETES A SELECTED PROFILE AND HANDLES DEFAULT PROFILE REASSIGNMENT
    deleteProfile() {
        const selector = document.getElementById('profile-selector');
        if (!selector || !selector.value) {
            alert('❌ Select a profile first!');
            return;
        }
        
        const profileToDelete = selector.value;
        
        if (profileToDelete === 'public') {
            alert('🚫 Cannot delete the Public profile!');
            return;
        }
        
        const profiles = JSON.parse(localStorage.getItem(Better42Config.STORAGE_KEYS.PROFILES_LIST) || '[]');
        const profileName = profiles.find(p => p.id === profileToDelete)?.name || 'Unknown';
        
        if (!confirm(`🗑️ Delete profile "${profileName}"?`)) return;
        
        const newProfiles = profiles.filter(p => p.id !== profileToDelete);
        localStorage.setItem(Better42Config.STORAGE_KEYS.PROFILES_LIST, JSON.stringify(newProfiles));
        
        localStorage.removeItem(`${Better42Config.STORAGE_KEYS.PROFILE_DATA_PREFIX}${profileToDelete}`);
        
        if (this.getDefaultProfile() === profileToDelete) {
            if (newProfiles.length > 0) {
                this.setDefaultProfile(newProfiles[0].id);
            } else {
                localStorage.removeItem(Better42Config.STORAGE_KEYS.DEFAULT_PROFILE);
            }
        }
        
        this.loadProfilesList();
        
        if (this.currentProfile === profileToDelete) {
            const bgInput = document.getElementById('bg-url-input');
            const pfpInput = document.getElementById('pfp-url-input');
            if (bgInput) bgInput.value = '';
            if (pfpInput) pfpInput.value = '';
            this.currentProfile = null;
            
            if (newProfiles.length > 0) {
                this.loadDefaultProfileOnStartup();
            }
        }
        
        alert(`🗑️ Profile "${profileName}" deleted!`);
    }

    // LOADS THE DEFAULT PROFILE EARLY IN THE PAGE LIFECYCLE TO PREVENT FLASHING
    earlyLoadDefaultProfile() {
        const userModePreference = localStorage.getItem(Better42Config.STORAGE_KEYS.USER_MODE_PREFERENCE);
        const forceWorseMode = localStorage.getItem(Better42Config.STORAGE_KEYS.FORCE_WORSE_MODE);
        
        if (forceWorseMode === 'true' || userModePreference === 'worse') {
            if (forceWorseMode === 'true') {
                localStorage.removeItem(Better42Config.STORAGE_KEYS.FORCE_WORSE_MODE);
            }
            document.documentElement.style.visibility = 'visible';
            return;
        }
        
        setTimeout(() => {
            const currentMode = localStorage.getItem(Better42Config.STORAGE_KEYS.USER_MODE_PREFERENCE);
            if (currentMode === 'worse') {
                document.documentElement.style.visibility = 'visible';
                return;
            }
            
            if (!this.shouldApplyCustomizations()) {
                document.documentElement.style.visibility = 'visible';
                return;
            }

            this.applyEarlyCustomizations();
        }, 50);
    }

    // APPLIES EARLY CUSTOMIZATIONS FROM DEFAULT PROFILE TO PREVENT VISUAL FLASHING
    applyEarlyCustomizations() {
        const defaultProfileId = this.getDefaultProfile();
        if (!defaultProfileId) {
            document.documentElement.style.visibility = 'visible';
            return;
        }
        
        const profileData = localStorage.getItem(`${Better42Config.STORAGE_KEYS.PROFILE_DATA_PREFIX}${defaultProfileId}`);
        if (!profileData) {
            document.documentElement.style.visibility = 'visible';
            return;
        }
        
        const data = JSON.parse(profileData);
        
        document.body.classList.add('dark-theme');
        
        if (data.backgroundUrl && !Better42Utils.isYouTubeVideo(data.backgroundUrl)) {
            Better42Utils.injectStyles(`
                ${Better42Config.SELECTORS.BACKGROUND} {
                    background-image: url("${data.backgroundUrl}") !important;
                }
            `);
        }
        
        if (data.profilePicUrl) {
            Better42Utils.injectStyles(`
                ${Better42Config.SELECTORS.PROFILE_PIC} {
                    background-image: url("${data.profilePicUrl}") !important;
                }
            `);
        }
        
        setTimeout(() => {
            document.documentElement.style.visibility = 'visible';
        }, 100);
    }

    // APPLIES PROFILE CUSTOMIZATIONS WHEN VIEWING OWN PROFILE
    applyOwnProfileCustomizations() {
        if (!this.shouldApplyCustomizations()) {
            return;
        }
        
        if (!window.ThemeManager || !window.ThemeManager.isDark) {
            return;
        }
        
        document.body.classList.add('dark-theme');
        this.loadDefaultProfileOnStartup();
    }

    // REMOVES ALL PROFILE CUSTOMIZATIONS WHEN NOT VIEWING OWN PROFILE
    removeCustomizations() {
        if (window.ThemeManager && window.ThemeManager.isDark) {
            return;
        }
        
        if (window.BackgroundManager) {
            window.BackgroundManager.removeAllCustomizations();
        }
        
        if (!this.shouldApplyCustomizations()) {
            document.body.classList.remove('dark-theme');
        }
    }

    // RESETS ALL BACKGROUND ELEMENTS TO THEIR DEFAULT STATE
    resetBackgroundElements() {
        const bgElements = document.querySelectorAll(Better42Config.SELECTORS.BACKGROUND);
        bgElements.forEach(el => {
            const iframes = el.querySelectorAll('iframe[src*="youtube"]');
            iframes.forEach(iframe => iframe.remove());
            
            const contentDiv = el.querySelector('div[style*="z-index:2"]');
            if (contentDiv) {
                el.innerHTML = contentDiv.innerHTML;
            }
            
            el.style.removeProperty('background-image');
            el.style.removeProperty('background-size');
            el.style.removeProperty('background-position');
            el.style.removeProperty('background-repeat');
            
            const style = el.getAttribute('style') || '';
            if (style.includes('background-image:')) {
                const newStyle = style.replace(/background-image:[^;]*;?/g, '').trim();
                if (newStyle === '') {
                    el.removeAttribute('style');
                } else {
                    el.setAttribute('style', newStyle);
                }
            }
        });
    }

    // RESETS ALL PROFILE PICTURE ELEMENTS TO THEIR DEFAULT STATE
    resetProfilePicElements() {
        const pfpElements = document.querySelectorAll(Better42Config.SELECTORS.PROFILE_PIC);
        pfpElements.forEach(el => {
            el.style.removeProperty('background-image');
            el.style.removeProperty('background-size');
            el.style.removeProperty('background-position');
            el.style.removeProperty('background-repeat');
            
            const style = el.getAttribute('style') || '';
            if (style.includes('background-image:')) {
                const newStyle = style.replace(/background-image:[^;]*;?/g, '').trim();
                if (newStyle === '') {
                    el.removeAttribute('style');
                } else {
                    el.setAttribute('style', newStyle);
                }
            }
        });
    }

    // FORCES DEFAULT STYLES TO BE REAPPLIED BY TRIGGERING A REFLOW
    forceDefaultStyles() {
        const bgElements = document.querySelectorAll(Better42Config.SELECTORS.BACKGROUND);
        const pfpElements = document.querySelectorAll(Better42Config.SELECTORS.PROFILE_PIC);
        
        [...bgElements, ...pfpElements].forEach(el => {
            const display = el.style.display;
            el.style.display = 'none';
            el.offsetHeight;
            el.style.display = display || '';
            
            el.style.removeProperty('background');
            el.style.removeProperty('background-image');
            el.style.removeProperty('background-size');
            el.style.removeProperty('background-position');
            el.style.removeProperty('background-repeat');
        });
    }
}

window.ProfileManager = new ProfileManager();