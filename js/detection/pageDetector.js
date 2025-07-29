class PageDetector {
    constructor() {
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;
    }

    isSupported() {
        const supportedDomains = [
            'profile-v3.intra.42.fr',
            'meta.intra.42.fr',
            'companies.intra.42.fr',
            'elearning.intra.42.fr',
            'projects.intra.42.fr',
            'shop.intra.42.fr'
        ];
        return supportedDomains.includes(window.location.hostname);
    }

    getPageConfig() {
        return {
            showSettings: true,
            showUI: true,
            applyThemes: true,
            showCustomization: true
        };
    }
}

window.PageDetector = new PageDetector();