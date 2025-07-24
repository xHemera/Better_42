// js/urlHelper.js - Utilitaires pour la gestion des URLs et profils

class URLHelper {
    constructor() {
        this.currentURL = window.location.href;
        this.observers = [];
    }

    // Obtenir le nom d'utilisateur depuis l'URL
    getUserFromURL(url = window.location.href) {
        const patterns = [
            /\/users\/([^\/\?\#]+)/,  // Standard: /users/username
            /profile-v3\.intra\.42\.fr\/users\/([^\/\?\#]+)/, // Spécifique à 42
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1].toLowerCase();
            }
        }

        return null;
    }

    // Vérifier si l'URL correspond à un profil utilisateur
    isUserProfileURL(url = window.location.href) {
        return this.getUserFromURL(url) !== null;
    }

    // Vérifier si on est sur la page d'accueil/dashboard
    isHomePage(url = window.location.href) {
        const homePatterns = [
            /^https?:\/\/[^\/]+\/?$/,  // Racine du site
            /\/dashboard/,             // Dashboard
            /\/home/,                  // Home
        ];

        return homePatterns.some(pattern => pattern.test(url));
    }

    // Obtenir le type de page actuelle
    getPageType(url = window.location.href) {
        if (this.isUserProfileURL(url)) {
            return 'user_profile';
        } else if (this.isHomePage(url)) {
            return 'home';
        } else if (url.includes('/projects/')) {
            return 'project';
        } else if (url.includes('/cursus/')) {
            return 'cursus';
        } else if (url.includes('/events/')) {
            return 'events';
        }
        
        return 'other';
    }

    // Surveiller les changements d'URL
    onURLChange(callback) {
        this.observers.push(callback);
        
        // Observer les changements de l'historique
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        history.pushState = (...args) => {
            originalPushState.apply(history, args);
            this.notifyURLChange();
        };
        
        history.replaceState = (...args) => {
            originalReplaceState.apply(history, args);
            this.notifyURLChange();
        };
        
        window.addEventListener('popstate', () => {
            this.notifyURLChange();
        });

        // Observer les changements DOM pour les SPA
        const observer = new MutationObserver(() => {
            if (window.location.href !== this.currentURL) {
                this.notifyURLChange();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        return () => {
            const index = this.observers.indexOf(callback);
            if (index > -1) {
                this.observers.splice(index, 1);
            }
        };
    }

    // Notifier les observateurs des changements d'URL
    notifyURLChange() {
        const oldURL = this.currentURL;
        const newURL = window.location.href;
        
        if (oldURL !== newURL) {
            this.currentURL = newURL;
            
            setTimeout(() => {
                this.observers.forEach(callback => {
                    try {
                        callback(newURL, oldURL);
                    } catch (error) {
                        console.error('Error in URL change callback:', error);
                    }
                });
            }, 100);
        }
    }

    // Obtenir des informations sur l'URL actuelle
    getCurrentPageInfo() {
        const url = window.location.href;
        return {
            url,
            user: this.getUserFromURL(url),
            type: this.getPageType(url),
            isUserProfile: this.isUserProfileURL(url),
            isHomePage: this.isHomePage(url)
        };
    }

    // Normaliser un nom d'utilisateur
    normalizeUsername(username) {
        if (!username) return null;
        return username.toLowerCase().trim();
    }

    // Vérifier si deux noms d'utilisateur sont identiques
    isSameUser(user1, user2) {
        const norm1 = this.normalizeUsername(user1);
        const norm2 = this.normalizeUsername(user2);
        return norm1 && norm2 && norm1 === norm2;
    }

    // Extraire l'utilisateur depuis différents éléments DOM
    extractUserFromDOM() {
        const selectors = [
            '[data-user-login]',
            '[data-login]',
            '[data-username]',
            '.profile-username',
            '.user-login',
            'h1[class*="username"]',
            '[class*="profile-name"]'
        ];

        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                // Essayer les attributs data
                const dataUser = element.getAttribute('data-user-login') || 
                                element.getAttribute('data-login') || 
                                element.getAttribute('data-username');
                if (dataUser) {
                    return this.normalizeUsername(dataUser);
                }

                // Essayer le contenu textuel
                const textContent = element.textContent.trim();
                if (textContent && this.looksLikeUsername(textContent)) {
                    return this.normalizeUsername(textContent);
                }
            }
        }

        return null;
    }

    // Vérifier si un texte ressemble à un nom d'utilisateur 42
    looksLikeUsername(text) {
        // Les usernames 42 sont généralement des lettres minuscules avec des chiffres
        const normalized = text.toLowerCase().trim();
        return /^[a-z][a-z0-9-_]{0,15}$/.test(normalized) && 
               !['profile', 'user', 'account', 'dashboard', 'home', 'projects'].includes(normalized);
    }

    // Debug: obtenir toutes les informations
    getDebugInfo() {
        return {
            currentURL: this.currentURL,
            pageInfo: this.getCurrentPageInfo(),
            userFromDOM: this.extractUserFromDOM(),
            observersCount: this.observers.length
        };
    }
}

window.URLHelper = new URLHelper();