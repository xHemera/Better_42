console.log('🔄 Chargement de l\'API ThemeSync...');

window.checkThemeSync = function() {
    console.log('🔍 Debug ThemeSync:');
    console.log('- window.ThemeSync existe:', !!window.ThemeSync);
    console.log('- Firebase prêt:', !!window.firebaseReady);
    console.log('- Firebase DB:', !!window.firebaseDB); 
    console.log('- Firebase Auth:', !!window.firebaseAuth);
    
    const contexts = [window, document, document.body];
    contexts.forEach((ctx, index) => {
        const themeSyncKeys = Object.getOwnPropertyNames(ctx).filter(name => 
            name.toLowerCase().includes('theme') || name.toLowerCase().includes('sync')
        );
        if (themeSyncKeys.length > 0) {
            console.log(`- Contexte ${index} contient:`, themeSyncKeys);
        }
    });
    
    if (window.ThemeSync) {
        try {
            console.log('- ThemeSync.isReady():', window.ThemeSync.isReady());
            console.log('- Méthodes disponibles:', Object.getOwnPropertyNames(Object.getPrototypeOf(window.ThemeSync)));
        } catch (error) {
            console.log('- Erreur accès ThemeSync:', error);
        }
    }
};

window.shareMyTheme = function(username, isPublic = true) {
    console.log('📤 Demande de partage de thème pour:', username);
    
    if (window.ThemeSync && typeof window.ThemeSync.shareMyTheme === 'function') {
        console.log('✅ Accès direct à ThemeSync trouvé');
        return window.ThemeSync.shareMyTheme(username, isPublic);
    }
    
    const event = new CustomEvent('shareThemeRequest', {
        detail: { username: username, isPublic: isPublic }
    });
    document.dispatchEvent(event);
    
    console.log('📡 Événement envoyé, vérifiez les logs...');
    return 'Demande envoyée via événement';
};

window.loadUserTheme = function(username) {
    console.log('📥 Demande de chargement de thème pour:', username);
    
    if (window.ThemeSync && typeof window.ThemeSync.autoLoadThemeForUser === 'function') {
        return window.ThemeSync.autoLoadThemeForUser(username);
    }
    
    const event = new CustomEvent('loadThemeRequest', {
        detail: { username: username }
    });
    document.dispatchEvent(event);
    
    return 'Demande de chargement envoyée';
};

console.log('✅ API ThemeSync chargée - Fonctions disponibles:');
console.log('- window.checkThemeSync()');
console.log('- window.shareMyTheme(username, isPublic)');  
console.log('- window.loadUserTheme(username)');