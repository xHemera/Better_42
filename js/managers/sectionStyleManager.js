class DomainStyleManager {
    // INITIALIZES DOMAIN STYLE MANAGER WITH DOMAIN-SPECIFIC CSS PATHS
    constructor() {
        this.domainStyles = {
            'companies.intra.42.fr': 'assets/css/domains/companies.css',
            'elearning.intra.42.fr': 'assets/css/domains/elearning.css',
            'meta.intra.42.fr': 'assets/css/domains/meta.css',
            'projects.intra.42.fr': 'assets/css/domains/project.css',
            'shop.intra.42.fr': 'assets/css/domains/shop.css'
        };
        this.loadedStyles = new Set();
    }

    // INITIALIZES THE DOMAIN STYLE MANAGER AND LOADS DOMAIN-SPECIFIC STYLES
    init() {
        this.loadDomainSpecificStyles();
    }

    // RETURNS THE CURRENT DOMAIN HOSTNAME
    getCurrentDomain() {
        return window.location.hostname;
    }

    // LOADS CSS STYLES SPECIFIC TO THE CURRENT DOMAIN
    loadDomainSpecificStyles() {
        const currentDomain = this.getCurrentDomain();
        const cssPath = this.domainStyles[currentDomain];
        
        
        if (cssPath && !this.loadedStyles.has(currentDomain)) {
            this.injectCSS(cssPath, currentDomain);
            this.loadedStyles.add(currentDomain);
        }
    }

    // INJECTS CSS FILE INTO THE DOCUMENT HEAD FOR SPECIFIED DOMAIN
    injectCSS(cssPath, domain) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = chrome.runtime.getURL(cssPath);
        link.setAttribute('data-better42-domain-style', domain);
        
        document.head.appendChild(link);
    }

    // REMOVES ALL INJECTED DOMAIN-SPECIFIC STYLES FROM DOCUMENT
    cleanup() {
        const domainStyleLinks = document.querySelectorAll('link[data-better42-domain-style]');
        domainStyleLinks.forEach(link => link.remove());
        this.loadedStyles.clear();
    }
}

window.domainStyleManager = new DomainStyleManager();