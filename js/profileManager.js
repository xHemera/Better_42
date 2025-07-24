// profileManager.js - Gestion des profils utilisateur
class ProfileManager {
    constructor() {
        this.currentProfile = null;
    }

    // Obtenir le profil par défaut
    getDefaultProfile() {
        return localStorage.getItem(Better42Config.STORAGE_KEYS.DEFAULT_PROFILE);
    }

    // Définir le profil par défaut
    setDefaultProfile(profileId) {
        localStorage.setItem(Better42Config.STORAGE_KEYS.DEFAULT_PROFILE, profileId);
    }

    // Charger la liste des profils
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

    // Charger le profil par défaut au démarrage
    loadDefaultProfileOnStartup() {
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

    // Créer un nouveau profil
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

    // Sauvegarder le profil actuel
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

    // Charger un profil
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

    // Supprimer un profil
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
}

window.ProfileManager = new ProfileManager();