class PageDetector {
    constructor() {
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;
    }

    isSupported() {
        return window.location.hostname === 'profile-v3.intra.42.fr';
    }

    getPageConfig() {
        return {
            showSettings: true,
            showUI: true,
            applyThemes: true
        };
    }
}

window.PageDetector = new PageDetector();