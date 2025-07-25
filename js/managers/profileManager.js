class ProfileManager {
    constructor() {
        this.currentProfile = null;
        this.isOwnProfile = true; // Par défaut, assumer que c'est son propre profil
    }

    onProfileChange(isOwnProfile) {
        const wasOwnProfile = this.isOwnProfile;
        this.isOwnProfile = isOwnProfile;
        
        console.log('ProfileManager: Profile change detected', { wasOwnProfile, isOwnProfile });
        
        if (wasOwnProfile && !isOwnProfile) {
            this.removeCustomizations();
        } else if (!wasOwnProfile && isOwnProfile) {
            this.applyOwnProfileCustomizations();
        }
    }

    shouldApplyCustomizations() {
        if (window.ProfileDetector && window.ProfileDetector.initialized) {
            return window.ProfileDetector.isViewingOwnProfile();
        }
        
        return this.isOwnProfile;
    }

    getDefaultProfile() {
        return localStorage.getItem(Better42Config.STORAGE_KEYS.DEFAULT_PROFILE);
    }

    setDefaultProfile(profileId) {
        localStorage.setItem(Better42Config.STORAGE_KEYS.DEFAULT_PROFILE, profileId);
    }

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
            
            console.log('✅ Profil Public créé automatiquement');
        }
    }

    loadDefaultProfileOnStartup() {
        if (!window.PageDetector) {
            console.log('ProfileManager: PageDetector not available');
            return;
        }

        const pageConfig = window.PageDetector.getPageConfig();
        if (!pageConfig.showCustomization) {
            console.log('ProfileManager: Customization disabled for this page type');
            return;
        }

        if (!this.shouldApplyCustomizations()) {
            console.log('ProfileManager: Skipping customizations (not own profile)');
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
    
    async syncPublicProfileToFirebase(profileData) {
        try {
            const currentUser = window.ProfileDetector?.getCurrentUser();
            if (!currentUser) {
                console.log('⚠️ Impossible de synchroniser : nom d\'utilisateur non trouvé');
                return;
            }
            
            if (window.ThemeSync && window.ThemeSync.shareMyTheme) {
                const oldProfileData = window.ProfileManager.getCurrentProfileData;
                
                window.ProfileManager.getCurrentProfileData = () => profileData;
                
                const success = await window.ThemeSync.shareMyTheme(currentUser, true);
                
                if (oldProfileData) {
                    window.ProfileManager.getCurrentProfileData = oldProfileData;
                }
                
                if (success) {
                    console.log('🌐 Profil Public synchronisé avec Firebase');
                } else {
                    console.log('⚠️ Échec de la synchronisation du profil Public');
                }
            } else {
                console.log('⚠️ ThemeSync non disponible pour la synchronisation');
            }
        } catch (error) {
            console.error('❌ Erreur synchronisation profil Public:', error);
        }
    }

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

    earlyLoadDefaultProfile() {
        const userModePreference = localStorage.getItem(Better42Config.STORAGE_KEYS.USER_MODE_PREFERENCE);
        const forceWorseMode = localStorage.getItem(Better42Config.STORAGE_KEYS.FORCE_WORSE_MODE);
        
        if (forceWorseMode === 'true') {
            localStorage.removeItem(Better42Config.STORAGE_KEYS.FORCE_WORSE_MODE);
        }
        
        if (userModePreference === 'worse') {
            document.documentElement.style.visibility = 'visible';
            return;
        }
        
        setTimeout(() => {
            if (!this.shouldApplyCustomizations()) {
                console.log('ProfileManager: Skipping early customizations (not own profile)');
                document.documentElement.style.visibility = 'visible';
                return;
            }

            this.applyEarlyCustomizations();
        }, 50);
    }

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

    applyOwnProfileCustomizations() {
        if (!this.shouldApplyCustomizations()) return;
        
        document.body.classList.add('dark-theme');
        
        this.loadDefaultProfileOnStartup();
    }

    removeCustomizations() {
        console.log('ProfileManager: Removing customizations');
        
        const injectedStyles = document.querySelectorAll('style');
        injectedStyles.forEach(style => {
            if (style.textContent.includes('background-image: url') || 
                style.textContent.includes(Better42Config.SELECTORS.BACKGROUND) ||
                style.textContent.includes(Better42Config.SELECTORS.PROFILE_PIC)) {
                style.remove();
            }
        });

        if (!this.shouldApplyCustomizations()) {
            document.body.classList.remove('dark-theme');
        }

        this.resetBackgroundElements();
        this.resetProfilePicElements();
    }

    resetBackgroundElements() {
        const bgElements = document.querySelectorAll(Better42Config.SELECTORS.BACKGROUND);
        bgElements.forEach(el => {
            const style = el.getAttribute('style') || '';
            const newStyle = style.replace(/background-image:[^;]*;?/g, '');
            if (newStyle !== style) {
                el.setAttribute('style', newStyle);
            }
            
            const iframes = el.querySelectorAll('iframe[src*="youtube"]');
            iframes.forEach(iframe => iframe.remove());
            
            const contentDiv = el.querySelector('div[style*="z-index:2"]');
            if (contentDiv) {
                el.innerHTML = contentDiv.innerHTML;
            }
        });
    }

    resetProfilePicElements() {
        const pfpElements = document.querySelectorAll(Better42Config.SELECTORS.PROFILE_PIC);
        pfpElements.forEach(el => {
            const style = el.getAttribute('style') || '';
            const newStyle = style.replace(/background-image:[^;]*;?/g, '');
            if (newStyle !== style) {
                el.setAttribute('style', newStyle);
            }
        });
    }
}

window.ProfileManager = new ProfileManager();