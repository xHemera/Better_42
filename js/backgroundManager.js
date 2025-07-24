// backgroundManager.js - Gestion des arrière-plans et images de profil
class BackgroundManager {
    constructor() {}

    // Appliquer un arrière-plan personnalisé
    applyCustomBackground(url) {
        if (Better42Utils.isYouTubeVideo(url)) {
            this._applyYouTubeBackground(url);
            return;
        }
        
        this._applyImageBackground(url);
    }

    // Appliquer un arrière-plan YouTube
    _applyYouTubeBackground(url) {
        const videoId = Better42Utils.extractYouTubeId(url);
        if (!videoId) return;
        
        const embedUrl = Better42Utils.generateYouTubeEmbedUrl(videoId);
        
        const bgElements = document.querySelectorAll(Better42Config.SELECTORS.BACKGROUND);
        bgElements.forEach(el => {
            const originalContent = el.innerHTML;
            
            el.innerHTML = `
                <iframe src="${embedUrl}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;z-index:1;pointer-events:none;"></iframe>
                <div style="position:relative;z-index:2;width:100%;height:100%;display:flex;flex-direction:column;justify-content:inherit;align-items:inherit;">${originalContent}</div>
            `;
            el.style.position = 'relative';
            el.style.overflow = 'hidden';
            el.style.backgroundImage = 'none';
        });
    }

    // Appliquer un arrière-plan image/GIF
    _applyImageBackground(url) {
        const bgElements = document.querySelectorAll(Better42Config.SELECTORS.BACKGROUND);
        bgElements.forEach(el => {
            // Nettoyer les iframes YouTube si présentes
            const contentDiv = el.querySelector('div[style*="z-index:2"]');
            if (contentDiv) {
                el.innerHTML = contentDiv.innerHTML;
            }
            
            const style = el.getAttribute('style') || '';
            if (style.includes('background-image: url')) {
                const newStyle = style.replace(/background-image: url\([^)]+\)/g, `background-image: url("${url}")`);
                el.setAttribute('style', newStyle);
            } else {
                el.setAttribute('style', style + ` background-image: url("${url}");`);
            }
        });
    }

    // Appliquer une image de profil personnalisée
    applyCustomPfp(url) {
        const pfpElements = document.querySelectorAll(Better42Config.SELECTORS.PROFILE_PIC);
        pfpElements.forEach(el => {
            const style = el.getAttribute('style') || '';
            if (style.includes('background-image: url')) {
                const newStyle = style.replace(/background-image: url\([^)]+\)/g, `background-image: url("${url}")`);
                el.setAttribute('style', newStyle);
            } else {
                el.setAttribute('style', style + ` background-image: url("${url}");`);
            }
        });
    }

    // Supprimer toutes les personnalisations
    removeCustomizations() {
        // Supprimer tous les styles injectés par l'extension
        const injectedStyles = document.querySelectorAll('style');
        injectedStyles.forEach(style => {
            if (style.textContent.includes('w-full.xl\\:h-72.bg-center.bg-cover.bg-ft-black') || 
                style.textContent.includes('w-52.h-52.text-black.md\\:w-40.md\\:h-40.lg\\:h-28.lg\\:w-28')) {
                style.remove();
            }
        });
        
        // Simplement recharger la page pour revenir à l'état original
        location.reload();
    }
}

// Export global
window.BackgroundManager = new BackgroundManager();