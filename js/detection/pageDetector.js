class PageDetector {
    constructor() {
        this.currentDomain = null;
        this.currentPageType = null;
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;
        
        this.detectCurrentPage();
        this.isInitialized = true;
        
        console.log('PageDetector initialized:', {
            domain: this.currentDomain,
            pageType: this.currentPageType,
            hostname: window.location.hostname
        });
    }

    detectCurrentPage() {
        const hostname = window.location.hostname;
        const pathname = window.location.pathname;
        
        this.currentDomain = hostname;
        this.currentPageType = this.getPageTypeFromDomain(hostname, pathname);
    }

    getPageTypeFromDomain(hostname, pathname = '') {
        switch (hostname) {
            case 'profile-v3.intra.42.fr':
                return this.getProfilePageSubtype(pathname);
            case 'meta.intra.42.fr':
                return 'meta';
            case 'shop.intra.42.fr':
                return 'shop';
            case 'companies.intra.42.fr':
                return 'companies';
            case 'elearning.intra.42.fr':
                return 'elearning';
            case 'projects.intra.42.fr':
                return 'projects';
            default:
                return 'unknown';
        }
    }

    getProfilePageSubtype(pathname) {
        if (pathname.includes('/users/')) {
            return 'profile';
        } else if (pathname.includes('/projects/')) {
            return 'project';
        } else if (pathname.includes('/events/')) {
            return 'events';
        } else if (pathname.includes('/cursus/')) {
            return 'cursus';
        } else if (pathname === '/' || pathname.includes('/dashboard')) {
            return 'dashboard';
        } else {
            return 'profile-other';
        }
    }

    isProfileDomain() {
        return this.currentDomain === 'profile-v3.intra.42.fr';
    }

    getCurrentDomain() {
        return this.currentDomain;
    }

    getCurrentPageType() {
        return this.currentPageType;
    }

    shouldShowFullUI() {
        return this.isProfileDomain();
    }

    shouldShowMinimalUI() {
        return ['meta', 'shop', 'companies', 'elearning', 'projects'].includes(this.currentPageType);
    }

    shouldApplyThemeOnly() {
        return !this.isProfileDomain();
    }

    getPageConfig() {
        const configs = {
            'profile': {
                showUI: true,
                showSettings: true,
                showProfiles: true,
                showCustomization: true,
                applyThemes: true
            },
            'dashboard': {
                showUI: true,
                showSettings: true,
                showProfiles: true,
                showCustomization: true,
                applyThemes: true
            },
            'meta': {
                showUI: true,
                showSettings: false,
                showProfiles: false,
                showCustomization: false,
                applyThemes: true
            },
            'shop': {
                showUI: true,
                showSettings: false,
                showProfiles: false,
                showCustomization: false,
                applyThemes: true
            },
            'companies': {
                showUI: true,
                showSettings: false,
                showProfiles: false,
                showCustomization: false,
                applyThemes: true
            },
            'elearning': {
                showUI: true,
                showSettings: false,
                showProfiles: false,
                showCustomization: false,
                applyThemes: true
            },
            'projects': {
                showUI: true,
                showSettings: false,
                showProfiles: false,
                showCustomization: false,
                applyThemes: true
            }
        };

        return configs[this.currentPageType] || configs['profile'];
    }

    onURLChange() {
        const oldPageType = this.currentPageType;
        this.detectCurrentPage();
        
        if (oldPageType !== this.currentPageType) {
            this.notifyPageChange(oldPageType, this.currentPageType);
        }
    }

    notifyPageChange(oldPageType, newPageType) {
        console.log('Page type changed:', { from: oldPageType, to: newPageType });
        
        const event = new CustomEvent('pageTypeChange', {
            detail: {
                oldPageType,
                newPageType,
                domain: this.currentDomain,
                config: this.getPageConfig()
            }
        });
        document.dispatchEvent(event);
    }

    getDebugInfo() {
        return {
            currentDomain: this.currentDomain,
            currentPageType: this.currentPageType,
            isInitialized: this.isInitialized,
            hostname: window.location.hostname,
            pathname: window.location.pathname,
            config: this.getPageConfig()
        };
    }
}

window.PageDetector = new PageDetector();