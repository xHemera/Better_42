class ProfileManager {
    constructor() {
        this.currentProfile = null;
        this.isOwnProfile = true; // Par défaut, assumer que c'est son propre profil
    }

    // Callback appelé par ProfileDetector lors des changements de profil
    onProfileChange(isOwnProfile) {
        const wasOwnProfile = this.isOwnProfile;
        this.isOwnProfile = isOwnProfile;
        
        console.log('ProfileManager: Profile change detected', { wasOwnProfile, isOwnProfile });
        
        if (wasOwnProfile && !isOwnProfile) {
            // On quitte son propre profil vers celui d'un autre
            this.removeCustomizations();
        } else if (!wasOwnProfile && isOwnProfile) {
            // On revient sur son propre profil
            this.applyOwnProfileCustomizations();
        }
    }

    // Vérifier si on doit appliquer les customisations
    shouldApplyCustomizations() {
        // Toujours vérifier avec ProfileDetector si disponible
        if (window.ProfileDetector && window.ProfileDetector.initialized) {
            return window.ProfileDetector.isViewingOwnProfile();
        }
        
        // Fallback: utiliser la valeur locale
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
        
        const profiles = JSON.parse(localStorage.getItem(Better42Config.STORAGE_KEYS.PROFILES_LIST) || '[]');
        const defaultProfileId = this.getDefaultProfile();
        
        profiles.forEach(profile => {
            const option = document.createElement('option');
            option.value = profile.id;
            option.textContent = `📁 ${profile.name}${profile.id === defaultProfileId ? ' (Default)' : ''}`;
            selector.appendChild(option);
        });
        
        if (defaultProfileId) {
            selector.value = defaultProfileId;
        }
    }

    loadDefaultProfileOnStartup() {
        // Ne pas appliquer les customisations si on n'est pas sur son propre profil
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
        alert(`💾 Profile saved!`);
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
        
        const profiles = JSON.parse(localStorage.getItem(Better42Config.STORAGE_KEYS.PROFILES_LIST) || '[]');
        const profileToDelete = selector.value;
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
        const forceWorseMode = localStorage.getItem(Better42Config.STORAGE_KEYS.FORCE_WORSE_MODE);
        
        if (forceWorseMode === 'true') {
            document.documentElement.style.visibility = 'visible';
            return;
        }
        
        // Attendre que ProfileDetector soit initialisé
        setTimeout(() => {
            if (!this.shouldApplyCustomizations()) {
                console.log('ProfileManager: Skipping early customizations (not own profile)');
                document.documentElement.style.visibility = 'visible';
                return;
            }

            this.applyEarlyCustomizations();
        }, 50);
    }

    // Appliquer les customisations précoces (avant le chargement complet)
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

    // Appliquer les customisations du profil personnel
    applyOwnProfileCustomizations() {
        if (!this.shouldApplyCustomizations()) return;
        
        // Réappliquer le thème sombre
        document.body.classList.add('dark-theme');
        
        // Recharger le profil par défaut
        this.loadDefaultProfileOnStartup();
    }

    // Supprimer toutes les customisations
    removeCustomizations() {
        console.log('ProfileManager: Removing customizations');
        
        // Supprimer les styles injectés
        const injectedStyles = document.querySelectorAll('style');
        injectedStyles.forEach(style => {
            if (style.textContent.includes('background-image: url') || 
                style.textContent.includes(Better42Config.SELECTORS.BACKGROUND) ||
                style.textContent.includes(Better42Config.SELECTORS.PROFILE_PIC)) {
                style.remove();
            }
        });

        // Supprimer la classe dark-theme si on n'est pas sur son profil
        if (!this.shouldApplyCustomizations()) {
            document.body.classList.remove('dark-theme');
        }

        // Réinitialiser les éléments modifiés
        this.resetBackgroundElements();
        this.resetProfilePicElements();
    }

    // Réinitialiser les éléments de background
    resetBackgroundElements() {
        const bgElements = document.querySelectorAll(Better42Config.SELECTORS.BACKGROUND);
        bgElements.forEach(el => {
            // Supprimer les styles inline de background
            const style = el.getAttribute('style') || '';
            const newStyle = style.replace(/background-image:[^;]*;?/g, '');
            if (newStyle !== style) {
                el.setAttribute('style', newStyle);
            }
            
            // Supprimer les iframes YouTube si présentes
            const iframes = el.querySelectorAll('iframe[src*="youtube"]');
            iframes.forEach(iframe => iframe.remove());
            
            // Restaurer le contenu original si nécessaire
            const contentDiv = el.querySelector('div[style*="z-index:2"]');
            if (contentDiv) {
                el.innerHTML = contentDiv.innerHTML;
            }
        });
    }

    // Réinitialiser les éléments de photo de profil
    resetProfilePicElements() {
        const pfpElements = document.querySelectorAll(Better42Config.SELECTORS.PROFILE_PIC);
        pfpElements.forEach(el => {
            // Supprimer les styles inline de background
            const style = el.getAttribute('style') || '';
            const newStyle = style.replace(/background-image:[^;]*;?/g, '');
            if (newStyle !== style) {
                el.setAttribute('style', newStyle);
            }
        });
    }
}

window.ProfileManager = new ProfileManager();