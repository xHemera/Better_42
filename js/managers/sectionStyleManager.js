class DomainStyleManager {
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

    init() {
        console.log('[Better42] DomainStyleManager initializing...');
        console.log('[Better42] Current domain:', this.getCurrentDomain());
        this.loadDomainSpecificStyles();
    }

    getCurrentDomain() {
        return window.location.hostname;
    }

    loadDomainSpecificStyles() {
        const currentDomain = this.getCurrentDomain();
        const cssPath = this.domainStyles[currentDomain];
        
        console.log('[Better42] Body classes:', document.body.classList.toString());
        console.log('[Better42] Has dark-theme:', document.body.classList.contains('dark-theme'));
        
        if (cssPath && !this.loadedStyles.has(currentDomain)) {
            this.injectCSS(cssPath, currentDomain);
            this.loadedStyles.add(currentDomain);
            console.log(`[Better42] Loaded domain-specific styles for: ${currentDomain}`);
        }
    }

    injectCSS(cssPath, domain) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = chrome.runtime.getURL(cssPath);
        link.setAttribute('data-better42-domain-style', domain);
        
        document.head.appendChild(link);
    }

    cleanup() {
        const domainStyleLinks = document.querySelectorAll('link[data-better42-domain-style]');
        domainStyleLinks.forEach(link => link.remove());
        this.loadedStyles.clear();
    }
}

window.domainStyleManager = new DomainStyleManager();