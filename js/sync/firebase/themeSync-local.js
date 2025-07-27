window.checkThemeSync = function() {
    
    if (window.ThemeSync) {
        
    }
};

window.shareMyTheme = function(username, isPublic = true) {
    if (window.ThemeSync && window.ThemeSync.shareMyTheme) {
        return window.ThemeSync.shareMyTheme(username, isPublic);
    } else {
        return false;
    }
};


class ThemeSync {
    constructor() {
        this.db = null;
        this.auth = null;
        this.ready = false;
        
        
        if (window.firebaseReady) {
            this.init();
        } else {
            document.addEventListener('firebaseReady', () => this.init());
        }
    }
    
    init() {
        this.db = window.firebaseDB;
        this.auth = window.firebaseAuth;
        this.ready = true;
    }
    
    isReady() {
        return window.firebaseDB && window.firebaseAuth && window.firebaseReady;
    }
    
    generateUserId(username) {
        return `user_${username.toLowerCase()}`;
    }
    
    async shareMyTheme(username, isPublic = true) {
        if (!this.isReady()) {
            return false;
        }
        
        try {
            const currentTheme = window.ColorThemeManager?.getCurrentTheme();
            const currentThemeData = null; 
            
            const defaultProfile = window.ProfileManager?.getDefaultProfile();
            let profileData = {};
            
            if (defaultProfile) {
                const storedData = localStorage.getItem(`profile-data-${defaultProfile}`);
                if (storedData) {
                    profileData = JSON.parse(storedData);
                }
            }
            
            const userId = this.generateUserId(username);
            
            const shareData = {
                username: username,
                colorTheme: currentTheme || 'purple',
                colorThemeData: currentThemeData || null,
                backgroundUrl: profileData.backgroundUrl || null,
                profilePicUrl: profileData.profilePicUrl || null,
                sharedAt: new Date().toISOString(),
                school: '42',
                version: '2.0',
                isPublic: isPublic
            };
            
            await this.db.collection('sharedThemes').doc(userId).set(shareData);
            
            const visibility = isPublic ? 'public' : 'privé';
            return true;
            
        } catch (error) {
            return false;
        }
    }
    
    async togglePrivacy(username) {
        if (!this.isReady()) {
            return false;
        }
        
        try {
            const userId = this.generateUserId(username);
            const doc = await this.db.collection('sharedThemes').doc(userId).get();
            
            if (doc.exists) {
                const currentData = doc.data();
                const newPublicState = !currentData.isPublic;
                
                await this.db.collection('sharedThemes').doc(userId).update({
                    isPublic: newPublicState,
                    updatedAt: new Date().toISOString()
                });
                
                const visibility = newPublicState ? 'public' : 'privé';
                return newPublicState;
            } else {
                return false;
            }
            
        } catch (error) {
            return false;
        }
    }
    
    async loadUserTheme(username) {
        if (!this.isReady()) {
            return null;
        }
        
        try {
            const userId = this.generateUserId(username);
            const doc = await this.db.collection('sharedThemes').doc(userId).get();
            
            if (doc.exists) {
                const data = doc.data();
                
                if (data.isPublic !== false) {
                    return data;
                } else {
                    return null;
                }
            } else {
                return null;
            }
            
        } catch (error) {
            return null;
        }
    }
    
    async autoLoadThemeForUser(username) {
        if (!username) return false;
        
        const themeData = await this.loadUserTheme(username);
        
        if (themeData) {
            this.applyLoadedTheme(themeData);
            return true;
        }
        
        return false;
    }
    
    applyLoadedTheme(themeData) {
        try {
            if (themeData.colorTheme && window.ColorThemeManager) {
                window.ColorThemeManager.changeTheme(themeData.colorTheme);
            }
            
            if (themeData.backgroundUrl && window.ProfileManager) {
                const profileData = { backgroundUrl: themeData.backgroundUrl };
                window.ProfileManager.applyTempProfile(profileData);
            }
            
            
        } catch (error) {
        }
    }
    
    async test() {
        if (!this.isReady()) {
            return;
        }
        
        
        try {
            const user = window.firebaseAuth.currentUser;
            if (user) {
            } else {
            }
        } catch (error) {
        }
    }
}

try {
    const themeSyncInstance = new ThemeSync();
    window.ThemeSync = themeSyncInstance;
    
    let checkCount = 0;
    const checkInterval = setInterval(() => {
        checkCount++;
        if (!window.ThemeSync || window.ThemeSync !== themeSyncInstance) {
            window.ThemeSync = themeSyncInstance; 
        }
        
        if (checkCount >= 20) { 
            clearInterval(checkInterval);
        }
    }, 500);
    
    setTimeout(() => {
        if (window.ThemeSync && window.ThemeSync.isReady()) {
            window.ThemeSync.test();
        } else {
            setTimeout(() => {
                if (window.ThemeSync && window.ThemeSync.isReady()) {
                    window.ThemeSync.test();
                }
            }, 2000);
        }
    }, 500);
    
} catch (error) {
}


const themeSyncAPI = document.createElement('div');
themeSyncAPI.id = 'themeSyncAPI';
themeSyncAPI.style.display = 'none';
document.body.appendChild(themeSyncAPI);

themeSyncAPI.checkThemeSync = function() {
    
    if (window.ThemeSync) {
        
    }
};

themeSyncAPI.shareMyTheme = function(username, isPublic = true) {
    
    const event = new CustomEvent('shareThemeRequest', {
        detail: { username: username, isPublic: isPublic }
    });
    document.dispatchEvent(event);
    
    return 'Demande envoyée...';
};

Object.assign(window, {
    checkThemeSync: themeSyncAPI.checkThemeSync,
    shareMyTheme: themeSyncAPI.shareMyTheme
});


document.addEventListener('shareThemeRequest', async (event) => {
    const { username, isPublic } = event.detail;
    
    if (window.ThemeSync && window.ThemeSync.shareMyTheme) {
        try {
            const result = await window.ThemeSync.shareMyTheme(username, isPublic);
        } catch (error) {
        }
    } else {
    }
});

document.addEventListener('loadThemeRequest', async (event) => {
    const { username } = event.detail;
    
    if (window.ThemeSync && window.ThemeSync.autoLoadThemeForUser) {
        try {
            const result = await window.ThemeSync.autoLoadThemeForUser(username);
        } catch (error) {
        }
    } else {
    }
});

