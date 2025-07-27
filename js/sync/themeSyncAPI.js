
window.checkThemeSync = function() {
    
    const contexts = [window, document, document.body];
    contexts.forEach((ctx, index) => {
        const themeSyncKeys = Object.getOwnPropertyNames(ctx).filter(name => 
            name.toLowerCase().includes('theme') || name.toLowerCase().includes('sync')
        );
        if (themeSyncKeys.length > 0) {
        }
    });
    
    if (window.ThemeSync) {
        try {
        } catch (error) {
        }
    }
};

window.shareMyTheme = function(username, isPublic = true) {
    
    if (window.ThemeSync && typeof window.ThemeSync.shareMyTheme === 'function') {
        return window.ThemeSync.shareMyTheme(username, isPublic);
    }
    
    const event = new CustomEvent('shareThemeRequest', {
        detail: { username: username, isPublic: isPublic }
    });
    document.dispatchEvent(event);
    
    return 'Demande envoyée via événement';
};

window.loadUserTheme = function(username) {
    
    if (window.ThemeSync && typeof window.ThemeSync.autoLoadThemeForUser === 'function') {
        return window.ThemeSync.autoLoadThemeForUser(username);
    }
    
    const event = new CustomEvent('loadThemeRequest', {
        detail: { username: username }
    });
    document.dispatchEvent(event);
    
    return 'Demande de chargement envoyée';
};

