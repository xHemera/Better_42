
// CHECKS FOR THEME SYNC FUNCTIONALITY AND AVAILABLE PROPERTIES
window.checkThemeSync = function() {
    
    const contexts = [window, document, document.body];
    contexts.forEach((ctx, index) => {
        const themeSyncKeys = Object.getOwnPropertyNames(ctx).filter(name => 
            name.toLowerCase().includes('theme') || name.toLowerCase().includes('sync')
        );
    });
    
    if (window.ThemeSync) {
        try {
        } catch (error) {
        }
    }
};

// SHARES CURRENT THEME TO SPECIFIED USERNAME WITH PUBLIC OPTION
window.shareMyTheme = function(username, isPublic = true) {
    
    if (window.ThemeSync && typeof window.ThemeSync.shareMyTheme === 'function') {
        return window.ThemeSync.shareMyTheme(username, isPublic);
    }
    
    const event = new CustomEvent('shareThemeRequest', {
        detail: { username: username, isPublic: isPublic }
    });
    document.dispatchEvent(event);
    
    return 'Request sent via event';
};

// LOADS THEME FROM SPECIFIED USERNAME
window.loadUserTheme = function(username) {
    
    if (window.ThemeSync && typeof window.ThemeSync.autoLoadThemeForUser === 'function') {
        return window.ThemeSync.autoLoadThemeForUser(username);
    }
    
    const event = new CustomEvent('loadThemeRequest', {
        detail: { username: username }
    });
    document.dispatchEvent(event);
    
    return 'Load request sent';
};

