console.log('🔄 Chargement du script themeSync-local.js...');

window.checkThemeSync = function() {
    console.log('🔍 Debug ThemeSync:');
    console.log('- window.ThemeSync existe:', !!window.ThemeSync);
    console.log('- Firebase prêt:', !!window.firebaseReady);
    console.log('- Firebase DB:', !!window.firebaseDB);
    console.log('- Firebase Auth:', !!window.firebaseAuth);
    
    if (window.ThemeSync) {
        console.log('- ThemeSync.isReady():', window.ThemeSync.isReady());
        console.log('- Méthodes disponibles:', Object.getOwnPropertyNames(Object.getPrototypeOf(window.ThemeSync)));
    }
};

window.shareMyTheme = function(username, isPublic = true) {
    if (window.ThemeSync && window.ThemeSync.shareMyTheme) {
        return window.ThemeSync.shareMyTheme(username, isPublic);
    } else {
        console.error('❌ ThemeSync pas disponible. Essayez window.checkThemeSync() pour diagnostiquer.');
        return false;
    }
};

console.log('✅ Fonctions utilitaires définies');

class ThemeSync {
    constructor() {
        this.db = null;
        this.auth = null;
        this.ready = false;
        
        console.log('🔧 Construction de ThemeSync...');
        
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
        console.log('🔄 ThemeSync initialisé (local)');
    }
    
    isReady() {
        return window.firebaseDB && window.firebaseAuth && window.firebaseReady;
    }
    
    generateUserId(username) {
        return `user_${username.toLowerCase()}`;
    }
    
    async shareMyTheme(username, isPublic = true) {
        if (!this.isReady()) {
            console.error('❌ Firebase pas encore prêt');
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
            console.log(`✅ Thème partagé pour ${username} (${visibility})!`);
            return true;
            
        } catch (error) {
            console.error('❌ Erreur partage thème:', error);
            return false;
        }
    }
    
    async togglePrivacy(username) {
        if (!this.isReady()) {
            console.error('❌ Firebase pas encore prêt');
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
                console.log(`🔄 Profil ${username} maintenant ${visibility}`);
                return newPublicState;
            } else {
                console.log('❌ Aucun profil à modifier');
                return false;
            }
            
        } catch (error) {
            console.error('❌ Erreur modification privacité:', error);
            return false;
        }
    }
    
    async loadUserTheme(username) {
        if (!this.isReady()) {
            console.error('❌ Firebase pas encore prêt');
            return null;
        }
        
        try {
            const userId = this.generateUserId(username);
            const doc = await this.db.collection('sharedThemes').doc(userId).get();
            
            if (doc.exists) {
                const data = doc.data();
                
                if (data.isPublic !== false) {
                    console.log(`📥 Thème trouvé pour ${username}`);
                    return data;
                } else {
                    console.log(`🔒 Profil privé pour ${username}`);
                    return null;
                }
            } else {
                console.log(`ℹ️ Pas de thème partagé pour ${username}`);
                return null;
            }
            
        } catch (error) {
            console.error('❌ Erreur chargement thème:', error);
            return null;
        }
    }
    
    async autoLoadThemeForUser(username) {
        if (!username) return false;
        
        console.log(`🔍 Recherche du thème pour ${username}...`);
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
                console.log(`🎨 Thème appliqué: ${themeData.colorTheme}`);
            }
            
            if (themeData.backgroundUrl && window.ProfileManager) {
                const profileData = { backgroundUrl: themeData.backgroundUrl };
                window.ProfileManager.applyTempProfile(profileData);
                console.log(`🖼️ Fond appliqué: ${themeData.backgroundUrl}`);
            }
            
            console.log(`✅ Profil Better 42 de ${themeData.username} chargé!`);
            
        } catch (error) {
            console.error('❌ Erreur application thème:', error);
        }
    }
    
    async test() {
        if (!this.isReady()) {
            console.log('❌ Firebase pas prêt');
            return;
        }
        
        console.log('🧪 Test Firebase...');
        
        try {
            const user = window.firebaseAuth.currentUser;
            if (user) {
                console.log('✅ Firebase connecté avec succès! Utilisateur:', user.uid);
                console.log('📋 ThemeSync prêt à fonctionner');
            } else {
                console.log('⚠️ Pas d\'utilisateur connecté');
            }
        } catch (error) {
            console.error('❌ Erreur test Firebase:', error);
        }
    }
}

try {
    const themeSyncInstance = new ThemeSync();
    window.ThemeSync = themeSyncInstance;
    console.log('📋 ThemeSync instance créée et assignée à window.ThemeSync');
    
    let checkCount = 0;
    const checkInterval = setInterval(() => {
        checkCount++;
        if (!window.ThemeSync || window.ThemeSync !== themeSyncInstance) {
            console.error(`❌ window.ThemeSync a été écrasé! (check ${checkCount})`);
            console.log('- window.ThemeSync actuel:', window.ThemeSync);
            console.log('- Instance originale:', themeSyncInstance);
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
            console.log('⏳ En attente de l\'authentification Firebase...');
            setTimeout(() => {
                if (window.ThemeSync && window.ThemeSync.isReady()) {
                    window.ThemeSync.test();
                }
            }, 2000);
        }
    }, 500);
    
} catch (error) {
    console.error('❌ Erreur création ThemeSync:', error);
}

console.log('🔧 Exposition des fonctions ThemeSync via DOM...');

const themeSyncAPI = document.createElement('div');
themeSyncAPI.id = 'themeSyncAPI';
themeSyncAPI.style.display = 'none';
document.body.appendChild(themeSyncAPI);

themeSyncAPI.checkThemeSync = function() {
    console.log('🔍 Debug ThemeSync:');
    console.log('- Content script window.ThemeSync existe:', !!window.ThemeSync);
    console.log('- Firebase prêt:', !!window.firebaseReady);
    console.log('- Firebase DB:', !!window.firebaseDB);
    console.log('- Firebase Auth:', !!window.firebaseAuth);
    
    if (window.ThemeSync) {
        console.log('- ThemeSync.isReady():', window.ThemeSync.isReady());
        console.log('- Méthodes disponibles:', Object.getOwnPropertyNames(Object.getPrototypeOf(window.ThemeSync)));
    }
};

themeSyncAPI.shareMyTheme = function(username, isPublic = true) {
    console.log('📤 Demande de partage de thème pour:', username);
    
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

console.log('✅ Fonctions exposées via DOM et window');

document.addEventListener('shareThemeRequest', async (event) => {
    const { username, isPublic } = event.detail;
    console.log('🎯 Réception demande partage:', username);
    
    if (window.ThemeSync && window.ThemeSync.shareMyTheme) {
        try {
            const result = await window.ThemeSync.shareMyTheme(username, isPublic);
            console.log(result ? '✅ Partage réussi!' : '❌ Partage échoué');
        } catch (error) {
            console.error('❌ Erreur lors du partage:', error);
        }
    } else {
        console.error('❌ ThemeSync pas disponible dans le content script');
    }
});

document.addEventListener('loadThemeRequest', async (event) => {
    const { username } = event.detail;
    console.log('🎯 Réception demande chargement:', username);
    
    if (window.ThemeSync && window.ThemeSync.autoLoadThemeForUser) {
        try {
            const result = await window.ThemeSync.autoLoadThemeForUser(username);
            console.log(result ? '✅ Chargement réussi!' : 'ℹ️ Pas de thème trouvé');
        } catch (error) {
            console.error('❌ Erreur lors du chargement:', error);
        }
    } else {
        console.error('❌ ThemeSync pas disponible dans le content script');
    }
});

console.log('🎯 Fin du script themeSync-local.js');