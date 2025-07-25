
class URLHelper {
    constructor() {
        this.currentURL = window.location.href;
        this.observers = [];
    }

    getUserFromURL(url = window.location.href) {
        const patterns = [
            /\/users\/([^\/\?\#]+)/,
            /profile-v3\.intra\.42\.fr\/users\/([^\/\?\#]+)/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1].toLowerCase();
            }
        }

        return null;
    }

    isUserProfileURL(url = window.location.href) {
        return this.getUserFromURL(url) !== null;
    }

    isHomePage(url = window.location.href) {
        const homePatterns = [
            /^https?:\/\/[^\/]+\/?$/,
            /\/dashboard/,
            /\/home/
        ];

        return homePatterns.some(pattern => pattern.test(url));
    }

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

    onURLChange(callback) {
        this.observers.push(callback);
        
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

    normalizeUsername(username) {
        if (!username) return null;
        return username.toLowerCase().trim();
    }

    isSameUser(user1, user2) {
        const norm1 = this.normalizeUsername(user1);
        const norm2 = this.normalizeUsername(user2);
        return norm1 && norm2 && norm1 === norm2;
    }

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
                const dataUser = element.getAttribute('data-user-login') || 
                                element.getAttribute('data-login') || 
                                element.getAttribute('data-username');
                if (dataUser) {
                    return this.normalizeUsername(dataUser);
                }

                const textContent = element.textContent.trim();
                if (textContent && this.looksLikeUsername(textContent)) {
                    return this.normalizeUsername(textContent);
                }
            }
        }

        return null;
    }

    looksLikeUsername(text) {
        const normalized = text.toLowerCase().trim();
        return /^[a-z][a-z0-9-_]{0,15}$/.test(normalized) && 
               !['profile', 'user', 'account', 'dashboard', 'home', 'projects'].includes(normalized);
    }

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