
class ProfileDetector {
    constructor() {
        this.currentUserLogin = null;
        this.viewedUserLogin = null;
        this.isOwnProfile = false;
        this.initialized = false;
    }

    // INITIALIZE PROFILE DETECTOR
    init() {
        if (this.initialized) return;
        
        
        this.detectCurrentUser();
        this.detectViewedProfile();
        this.checkIfOwnProfile();
        
        
        this.setupURLWatcher();
        
        this.initialized = true;
        
        if (!this.isOwnProfile && this.viewedUserLogin) {
            setTimeout(() => {
                if (window.ThemeSync && window.ThemeSync.isReady()) {
                    window.ThemeSync.autoLoadThemeForUser(this.viewedUserLogin);
                }
            }, 1000);
        }
    }

    // DETECT CURRENT LOGGED-IN USER
    detectCurrentUser() {
        
        // Check for data-login in HTML first (specific to projects.intra.42.fr)
        const dataLoginElement = document.querySelector('[data-login]');
        if (dataLoginElement) {
            const login = dataLoginElement.getAttribute('data-login');
            if (login) {
                this.currentUserLogin = login;
                return;
            }
        }
        
        this.tryDetectFromJWT();
        if (this.currentUserLogin) return;
        
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

        const navElements = document.querySelectorAll('a[href*="/users/"]');
        for (const element of navElements) {
            const href = element.getAttribute('href');
            if (href && href.includes('/users/') && !href.includes('/projects/')) {
                const match = href.match(/\/users\/([^\/]+)(?:$|\/(?!projects))/);
                if (match) {
                    const text = element.textContent.toLowerCase();
                    if (text.includes('profile') || text.includes('me') || element.closest('.user-menu, .dropdown')) {
                        this.currentUserLogin = match[1];
                        return;
                    }
                }
            }
        }

        const storedUser = localStorage.getItem('current-user-login');
        if (storedUser) {
            this.currentUserLogin = storedUser;
            return;
        }

        this.tryDetectFromDOM();
    }
    
    // TRY TO DETECT USER FROM JWT TOKENS
    tryDetectFromJWT() {
        try {
            const scripts = document.querySelectorAll('script');
            for (const script of scripts) {
                const content = script.textContent || script.innerHTML;
                
                const jwtMatches = content.match(/eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+/g);
                if (jwtMatches) {
                    for (const jwt of jwtMatches) {
                        const username = this.extractUsernameFromJWT(jwt);
                        if (username) {
                            this.currentUserLogin = username;
                            return;
                        }
                    }
                }
                
                const usernameMatch = content.match(/"preferred_username"\s*:\s*"([^"]+)"/);
                if (usernameMatch) {
                    this.currentUserLogin = usernameMatch[1];
                    return;
                }
            }
            
            
        } catch (error) {
        }
    }
    
    // EXTRACT USERNAME FROM JWT TOKEN
    extractUsernameFromJWT(token) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return null;
            
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
            return payload.preferred_username || payload.username || payload.login || null;
        } catch (error) {
            return null;
        }
    }

    // TRY TO DETECT USER FROM DOM ELEMENTS
    tryDetectFromDOM() {
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

    // CHECK IF ELEMENT BELONGS TO CURRENT USER
    isCurrentUserElement(element) {
        const parent = element.closest('.profile-owner, .current-user, .my-profile, [class*="own"]');
        return !!parent;
    }

    // DETECT WHICH USER PROFILE IS BEING VIEWED
    detectViewedProfile() {
        const currentURL = window.location.href;
        const urlMatch = currentURL.match(/\/users\/([^\/\?]+)/);
        if (urlMatch) {
            this.viewedUserLogin = urlMatch[1];
            return;
        }

        const profileElements = document.querySelectorAll('[data-profile-login], h1, .profile-name, .username');
        for (const element of profileElements) {
            const login = element.getAttribute('data-profile-login');
            if (login) {
                this.viewedUserLogin = login;
                return;
            }
            
            const text = element.textContent.trim();
            if (text && this.looksLikeUsername(text)) {
                this.viewedUserLogin = text.toLowerCase();
                return;
            }
        }
    }

    // CHECK IF TEXT LOOKS LIKE A USERNAME
    looksLikeUsername(text) {
        return /^[a-z][a-z0-9-_]{1,15}$/.test(text.toLowerCase()) && 
               !['profile', 'user', 'account', 'dashboard'].includes(text.toLowerCase());
    }

    // CHECK IF VIEWING OWN PROFILE
    checkIfOwnProfile() {
        if (!this.currentUserLogin || !this.viewedUserLogin) {
            this.isOwnProfile = !this.viewedUserLogin || window.location.pathname === '/';
            return;
        }

        this.isOwnProfile = this.currentUserLogin.toLowerCase() === this.viewedUserLogin.toLowerCase();
    }

    // SETUP URL CHANGE WATCHER
    setupURLWatcher() {
        let lastURL = window.location.href;
        
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

        window.addEventListener('popstate', () => this.onURLChange());
        window.addEventListener('pushstate', () => this.onURLChange());
        window.addEventListener('replacestate', () => this.onURLChange());
    }

    // HANDLE URL CHANGES
    onURLChange() {
        setTimeout(() => {
            const oldViewedUser = this.viewedUserLogin;
            const oldIsOwnProfile = this.isOwnProfile;
            
            this.detectViewedProfile();
            this.checkIfOwnProfile();
            
            if (oldViewedUser !== this.viewedUserLogin || oldIsOwnProfile !== this.isOwnProfile) {
                this.notifyProfileChange();
            }
        }, 100);
    }

    // NOTIFY OTHER COMPONENTS OF PROFILE CHANGES
    notifyProfileChange() {
        if (window.ProfileManager && window.ProfileManager.onProfileChange) {
            window.ProfileManager.onProfileChange(this.isOwnProfile);
        }
        
        if (!this.isOwnProfile && this.viewedUserLogin && window.ThemeSync) {
            window.ThemeSync.autoLoadThemeForUser(this.viewedUserLogin);
        }

        const event = new CustomEvent('profileChange', {
            detail: {
                currentUser: this.currentUserLogin,
                viewedUser: this.viewedUserLogin,
                isOwnProfile: this.isOwnProfile
            }
        });
        document.dispatchEvent(event);
    }

    // GET CURRENT USER LOGIN
    getCurrentUser() {
        return this.currentUserLogin;
    }

    // GET VIEWED USER LOGIN
    getViewedUser() {
        return this.viewedUserLogin;
    }

    // CHECK IF VIEWING OWN PROFILE
    isViewingOwnProfile() {
        return this.isOwnProfile;
    }

    // REFRESH PROFILE DETECTION
    refresh() {
        this.detectCurrentUser();
        this.detectViewedProfile();
        this.checkIfOwnProfile();
        return this.isOwnProfile;
    }

    // SAVE CURRENT USER LOGIN
    saveCurrentUser(login) {
        this.currentUserLogin = login;
        localStorage.setItem('current-user-login', login);
        this.checkIfOwnProfile();
    }

    // GET DEBUG INFORMATION
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