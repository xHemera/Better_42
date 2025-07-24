// js/profileDetector.js - Détection du profil utilisateur

class ProfileDetector {
    constructor() {
        this.currentUserLogin = null;
        this.viewedUserLogin = null;
        this.isOwnProfile = false;
        this.initialized = false;
    }

    // Initialiser la détection
    init() {
        if (this.initialized) return;
        
        this.detectCurrentUser();
        this.detectViewedProfile();
        this.checkIfOwnProfile();
        
        // Écouter les changements d'URL pour les navigations SPA
        this.setupURLWatcher();
        
        this.initialized = true;
        console.log('ProfileDetector initialized:', {
            currentUser: this.currentUserLogin,
            viewedUser: this.viewedUserLogin,
            isOwnProfile: this.isOwnProfile
        });
    }

    // Détecter l'utilisateur connecté
    detectCurrentUser() {
        // Méthode 1: Chercher dans le menu utilisateur
        const userMenuElement = document.querySelector('[class*="user-menu"], [class*="profile-dropdown"], .dropdown-toggle img');
        if (userMenuElement) {
            const imgSrc = userMenuElement.src || userMenuElement.getAttribute('src');
            if (imgSrc) {
                const match = imgSrc.match(/\/users\/([^\/]+)\/profile_pictures/);
                if (match) {
                    this.currentUserLogin = match[1];
                    return;
                }
            }
        }

        // Méthode 2: Chercher dans les éléments de navigation
        const navElements = document.querySelectorAll('a[href*="/users/"]');
        for (const element of navElements) {
            const href = element.getAttribute('href');
            if (href && href.includes('/users/') && !href.includes('/projects/')) {
                const match = href.match(/\/users\/([^\/]+)(?:$|\/(?!projects))/);
                if (match) {
                    // Vérifier si c'est probablement l'utilisateur connecté (ex: lien "My Profile")
                    const text = element.textContent.toLowerCase();
                    if (text.includes('profile') || text.includes('me') || element.closest('.user-menu, .dropdown')) {
                        this.currentUserLogin = match[1];
                        return;
                    }
                }
            }
        }

        // Méthode 3: Utiliser l'API ou le localStorage si disponible
        const storedUser = localStorage.getItem('current-user-login');
        if (storedUser) {
            this.currentUserLogin = storedUser;
            return;
        }

        // Méthode 4: Détecter depuis les cookies/session si possible
        this.tryDetectFromDOM();
    }

    // Essayer de détecter depuis le DOM
    tryDetectFromDOM() {
        // Chercher des indices dans les attributs data-* 
        const userElements = document.querySelectorAll('[data-user-login], [data-login], [data-username]');
        for (const element of userElements) {
            const login = element.getAttribute('data-user-login') || 
                         element.getAttribute('data-login') || 
                         element.getAttribute('data-username');
            if (login && this.isCurrentUserElement(element)) {
                this.currentUserLogin = login;
                return;
            }
        }
    }

    // Vérifier si un élément appartient à l'utilisateur connecté
    isCurrentUserElement(element) {
        // Vérifier si l'élément est dans une zone "profile owner" ou similaire
        const parent = element.closest('.profile-owner, .current-user, .my-profile, [class*="own"]');
        return !!parent;
    }

    // Détecter le profil actuellement visualisé
    detectViewedProfile() {
        // Méthode 1: Depuis l'URL
        const currentURL = window.location.href;
        const urlMatch = currentURL.match(/\/users\/([^\/\?]+)/);
        if (urlMatch) {
            this.viewedUserLogin = urlMatch[1];
            return;
        }

        // Méthode 2: Depuis le DOM
        const profileElements = document.querySelectorAll('[data-profile-login], h1, .profile-name, .username');
        for (const element of profileElements) {
            const login = element.getAttribute('data-profile-login');
            if (login) {
                this.viewedUserLogin = login;
                return;
            }
            
            // Chercher dans le texte des éléments de titre
            const text = element.textContent.trim();
            if (text && this.looksLikeUsername(text)) {
                this.viewedUserLogin = text.toLowerCase();
                return;
            }
        }
    }

    // Vérifier si un texte ressemble à un nom d'utilisateur
    looksLikeUsername(text) {
        // Les usernames 42 sont généralement des lettres minuscules, parfois avec des chiffres
        return /^[a-z][a-z0-9-_]{1,15}$/.test(text.toLowerCase()) && 
               !['profile', 'user', 'account', 'dashboard'].includes(text.toLowerCase());
    }

    // Vérifier si on est sur son propre profil
    checkIfOwnProfile() {
        if (!this.currentUserLogin || !this.viewedUserLogin) {
            // Si on ne peut pas détecter, assumer que c'est son propre profil pour la compatibilité
            this.isOwnProfile = !this.viewedUserLogin || window.location.pathname === '/';
            return;
        }

        this.isOwnProfile = this.currentUserLogin.toLowerCase() === this.viewedUserLogin.toLowerCase();
    }

    // Surveiller les changements d'URL
    setupURLWatcher() {
        let lastURL = window.location.href;
        
        // Observer les changements d'URL avec MutationObserver
        const observer = new MutationObserver(() => {
            if (window.location.href !== lastURL) {
                lastURL = window.location.href;
                this.onURLChange();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Écouter aussi les événements de navigation
        window.addEventListener('popstate', () => this.onURLChange());
        window.addEventListener('pushstate', () => this.onURLChange());
        window.addEventListener('replacestate', () => this.onURLChange());
    }

    // Gérer les changements d'URL
    onURLChange() {
        setTimeout(() => {
            const oldViewedUser = this.viewedUserLogin;
            const oldIsOwnProfile = this.isOwnProfile;
            
            this.detectViewedProfile();
            this.checkIfOwnProfile();
            
            // Si le profil a changé, notifier les autres composants
            if (oldViewedUser !== this.viewedUserLogin || oldIsOwnProfile !== this.isOwnProfile) {
                this.notifyProfileChange();
            }
        }, 100);
    }

    // Notifier les autres composants du changement de profil
    notifyProfileChange() {
        console.log('Profile changed:', {
            currentUser: this.currentUserLogin,
            viewedUser: this.viewedUserLogin,
            isOwnProfile: this.isOwnProfile
        });

        // Notifier ProfileManager
        if (window.ProfileManager && window.ProfileManager.onProfileChange) {
            window.ProfileManager.onProfileChange(this.isOwnProfile);
        }

        // Déclencher un événement personnalisé
        const event = new CustomEvent('profileChange', {
            detail: {
                currentUser: this.currentUserLogin,
                viewedUser: this.viewedUserLogin,
                isOwnProfile: this.isOwnProfile
            }
        });
        document.dispatchEvent(event);
    }

    // Méthodes publiques
    getCurrentUser() {
        return this.currentUserLogin;
    }

    getViewedUser() {
        return this.viewedUserLogin;
    }

    isViewingOwnProfile() {
        return this.isOwnProfile;
    }

    // Forcer une nouvelle détection
    refresh() {
        this.detectCurrentUser();
        this.detectViewedProfile();
        this.checkIfOwnProfile();
        return this.isOwnProfile;
    }

    // Sauvegarder l'utilisateur connecté pour les sessions futures
    saveCurrentUser(login) {
        this.currentUserLogin = login;
        localStorage.setItem('current-user-login', login);
        this.checkIfOwnProfile();
    }

    // Obtenir des informations de debug
    getDebugInfo() {
        return {
            currentUserLogin: this.currentUserLogin,
            viewedUserLogin: this.viewedUserLogin,
            isOwnProfile: this.isOwnProfile,
            currentURL: window.location.href,
            initialized: this.initialized
        };
    }
}

window.ProfileDetector = new ProfileDetector();