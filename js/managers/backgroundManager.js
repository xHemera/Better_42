class BackgroundManager {
    constructor() {
        this.defaultImagesCaptured = false;
        this.defaultImages = {
            backgrounds: new Map(),
            profilePics: new Map()
        };
        
        // Capturer les images par défaut dès que possible
        this.captureDefaultImages();
    }

    // ✅ NOUVELLE MÉTHODE : Capturer les images par défaut du site
    captureDefaultImages() {
        if (this.defaultImagesCaptured) return;

        // Attendre que le DOM soit chargé
        setTimeout(() => {
            this._captureBackgroundImages();
            this._captureProfilePicImages();
            this.defaultImagesCaptured = true;
            console.log('📸 Images par défaut capturées:', this.defaultImages);
        }, 1000);
    }

    _captureBackgroundImages() {
        const bgElements = document.querySelectorAll(Better42Config.SELECTORS.BACKGROUND);
        bgElements.forEach((el, index) => {
            // Capturer seulement si pas encore modifié par Better42
            if (!el.hasAttribute('data-better42-modified')) {
                const computedStyle = window.getComputedStyle(el);
                const backgroundImage = computedStyle.backgroundImage;
                const styleAttr = el.getAttribute('style') || '';
                
                // Stocker les informations par défaut
                this.defaultImages.backgrounds.set(index, {
                    element: el,
                    computedBackgroundImage: backgroundImage,
                    originalStyleAttr: styleAttr,
                    originalInnerHTML: el.innerHTML,
                    selector: this._getElementSelector(el)
                });
                
                console.log(`📸 Background ${index} capturé:`, backgroundImage);
            }
        });
    }

    _captureProfilePicImages() {
        const pfpElements = document.querySelectorAll(Better42Config.SELECTORS.PROFILE_PIC);
        pfpElements.forEach((el, index) => {
            // Capturer seulement si pas encore modifié par Better42
            if (!el.hasAttribute('data-better42-modified')) {
                const computedStyle = window.getComputedStyle(el);
                const backgroundImage = computedStyle.backgroundImage;
                const styleAttr = el.getAttribute('style') || '';
                
                // Stocker les informations par défaut
                this.defaultImages.profilePics.set(index, {
                    element: el,
                    computedBackgroundImage: backgroundImage,
                    originalStyleAttr: styleAttr,
                    selector: this._getElementSelector(el)
                });
                
                console.log(`📸 ProfilePic ${index} capturé:`, backgroundImage);
            }
        });
    }

    _getElementSelector(element) {
        // Créer un sélecteur unique pour retrouver l'élément plus tard
        if (element.id) return `#${element.id}`;
        
        let selector = element.tagName.toLowerCase();
        if (element.className) {
            selector += '.' + element.className.split(' ').join('.');
        }
        
        // Ajouter la position si nécessaire
        const parent = element.parentElement;
        if (parent) {
            const siblings = Array.from(parent.children).filter(child => 
                child.tagName === element.tagName && 
                child.className === element.className
            );
            if (siblings.length > 1) {
                const index = siblings.indexOf(element);
                selector += `:nth-of-type(${index + 1})`;
            }
        }
        
        return selector;
    }

    applyCustomBackground(url) {
        // ❌ Ne pas appliquer si on n'est pas en mode Better
        if (!window.ThemeManager || !window.ThemeManager.isDark) {
            return;
        }

        if (Better42Utils.isYouTubeVideo(url)) {
            this._applyYouTubeBackground(url);
            return;
        }
        
        this._applyImageBackground(url);
    }

    _applyYouTubeBackground(url) {
        const videoId = Better42Utils.extractYouTubeId(url);
        if (!videoId) return;
        
        const embedUrl = Better42Utils.generateYouTubeEmbedUrl(videoId);
        
        const bgElements = document.querySelectorAll(Better42Config.SELECTORS.BACKGROUND);
        bgElements.forEach((el, index) => {
            // ✅ Capturer l'état par défaut AVANT modification
            if (!this.defaultImages.backgrounds.has(index)) {
                this._captureElementDefaults(el, index, 'backgrounds');
            }
            
            const originalContent = el.innerHTML;
            
            el.innerHTML = `
                <iframe src="${embedUrl}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;z-index:1;pointer-events:none;"></iframe>
                <div style="position:relative;z-index:2;width:100%;height:100%;display:flex;flex-direction:column;justify-content:inherit;align-items:inherit;">${originalContent}</div>
            `;
            el.style.position = 'relative';
            el.style.overflow = 'hidden';
            el.style.backgroundImage = 'none';
            
            // ✅ Marquer l'élément comme modifié par Better42
            el.setAttribute('data-better42-modified', 'true');
            el.setAttribute('data-better42-element-index', index);
        });
    }

    _applyImageBackground(url) {
        const bgElements = document.querySelectorAll(Better42Config.SELECTORS.BACKGROUND);
        bgElements.forEach((el, index) => {
            // ✅ Capturer l'état par défaut AVANT modification
            if (!this.defaultImages.backgrounds.has(index)) {
                this._captureElementDefaults(el, index, 'backgrounds');
            }

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
            
            // ✅ Marquer l'élément comme modifié par Better42
            el.setAttribute('data-better42-modified', 'true');
            el.setAttribute('data-better42-element-index', index);
        });
    }

    applyCustomPfp(url) {
        // ❌ Ne pas appliquer si on n'est pas en mode Better
        if (!window.ThemeManager || !window.ThemeManager.isDark) {
            return;
        }

        const pfpElements = document.querySelectorAll(Better42Config.SELECTORS.PROFILE_PIC);
        pfpElements.forEach((el, index) => {
            // ✅ Capturer l'état par défaut AVANT modification
            if (!this.defaultImages.profilePics.has(index)) {
                this._captureElementDefaults(el, index, 'profilePics');
            }

            const style = el.getAttribute('style') || '';
            if (style.includes('background-image: url')) {
                const newStyle = style.replace(/background-image: url\([^)]+\)/g, `background-image: url("${url}")`);
                el.setAttribute('style', newStyle);
            } else {
                el.setAttribute('style', style + ` background-image: url("${url}");`);
            }
            
            // ✅ Marquer l'élément comme modifié par Better42
            el.setAttribute('data-better42-modified', 'true');
            el.setAttribute('data-better42-element-index', index);
        });
    }

    _captureElementDefaults(element, index, type) {
        const computedStyle = window.getComputedStyle(element);
        const backgroundImage = computedStyle.backgroundImage;
        const styleAttr = element.getAttribute('style') || '';
        
        this.defaultImages[type].set(index, {
            element: element,
            computedBackgroundImage: backgroundImage,
            originalStyleAttr: styleAttr,
            originalInnerHTML: element.innerHTML,
            selector: this._getElementSelector(element)
        });
        
        console.log(`📸 ${type} ${index} capturé dynamiquement:`, backgroundImage);
    }

    // ✅ MÉTHODE PRINCIPALE : Suppression complète et restauration des défauts
    removeAllCustomizations() {
        console.log('🧹 Suppression complète des personnalisations...');
        
        // 1. Supprimer tous les styles injectés par Better42
        this._removeInjectedStyles();
        
        // 2. Restaurer tous les éléments background avec leurs images par défaut
        this._restoreBackgroundElements();
        
        // 3. Restaurer tous les éléments profile pic avec leurs images par défaut
        this._restoreProfilePicElements();
        
        console.log('✅ Personnalisations supprimées et images par défaut restaurées');
    }

    _restoreBackgroundElements() {
        console.log('🔄 Restauration des backgrounds...');
        
        // Restaurer tous les éléments background modifiés par Better42
        const modifiedBgElements = document.querySelectorAll('[data-better42-modified]');
        modifiedBgElements.forEach(el => {
            if (el.matches(Better42Config.SELECTORS.BACKGROUND.split(', ').join(', '))) {
                const elementIndex = parseInt(el.getAttribute('data-better42-element-index')) || 0;
                const defaultData = this.defaultImages.backgrounds.get(elementIndex);
                
                if (defaultData) {
                    // Restaurer le HTML original
                    if (defaultData.originalInnerHTML) {
                        el.innerHTML = defaultData.originalInnerHTML;
                    }
                    
                    // Restaurer le style original OU l'image par défaut
                    if (defaultData.originalStyleAttr) {
                        el.setAttribute('style', defaultData.originalStyleAttr);
                    } else if (defaultData.computedBackgroundImage && defaultData.computedBackgroundImage !== 'none') {
                        // Remettre l'image par défaut via CSS
                        el.style.backgroundImage = defaultData.computedBackgroundImage;
                    } else {
                        el.removeAttribute('style');
                    }
                    
                    console.log(`✅ Background ${elementIndex} restauré:`, defaultData.computedBackgroundImage);
                } else {
                    // Fallback : nettoyer au minimum
                    this._cleanupElement(el);
                }
                
                // Nettoyer les attributs Better42
                el.removeAttribute('data-better42-modified');
                el.removeAttribute('data-better42-element-index');
            }
        });

        // Nettoyer aussi les éléments sans attributs mais modifiés
        const allBgElements = document.querySelectorAll(Better42Config.SELECTORS.BACKGROUND);
        allBgElements.forEach((el, index) => {
            // Si l'élément a été modifié mais n'a pas nos attributs
            if (!el.hasAttribute('data-better42-modified')) {
                const defaultData = this.defaultImages.backgrounds.get(index);
                if (defaultData && this._elementNeedsRestoration(el)) {
                    if (defaultData.computedBackgroundImage && defaultData.computedBackgroundImage !== 'none') {
                        el.style.backgroundImage = defaultData.computedBackgroundImage;
                        console.log(`✅ Background ${index} restauré (sans attribut):`, defaultData.computedBackgroundImage);
                    }
                }
            }
            
            // Supprimer les iframes YouTube injectées
            const iframes = el.querySelectorAll('iframe[src*="youtube"]');
            iframes.forEach(iframe => iframe.remove());
        });
    }

    _restoreProfilePicElements() {
        console.log('🔄 Restauration des profile pics...');
        
        // Restaurer tous les éléments profile pic modifiés par Better42
        const modifiedPfpElements = document.querySelectorAll('[data-better42-modified]');
        modifiedPfpElements.forEach(el => {
            if (el.matches(Better42Config.SELECTORS.PROFILE_PIC)) {
                const elementIndex = parseInt(el.getAttribute('data-better42-element-index')) || 0;
                const defaultData = this.defaultImages.profilePics.get(elementIndex);
                
                if (defaultData) {
                    // Restaurer le style original OU l'image par défaut
                    if (defaultData.originalStyleAttr) {
                        el.setAttribute('style', defaultData.originalStyleAttr);
                    } else if (defaultData.computedBackgroundImage && defaultData.computedBackgroundImage !== 'none') {
                        // Remettre l'image par défaut via CSS
                        el.style.backgroundImage = defaultData.computedBackgroundImage;
                    } else {
                        el.removeAttribute('style');
                    }
                    
                    console.log(`✅ ProfilePic ${elementIndex} restauré:`, defaultData.computedBackgroundImage);
                } else {
                    // Fallback : nettoyer au minimum
                    this._cleanupElement(el);
                }
                
                // Nettoyer les attributs Better42
                el.removeAttribute('data-better42-modified');
                el.removeAttribute('data-better42-element-index');
            }
        });

        // Nettoyer aussi les éléments sans attributs mais modifiés
        const allPfpElements = document.querySelectorAll(Better42Config.SELECTORS.PROFILE_PIC);
        allPfpElements.forEach((el, index) => {
            if (!el.hasAttribute('data-better42-modified')) {
                const defaultData = this.defaultImages.profilePics.get(index);
                if (defaultData && this._elementNeedsRestoration(el)) {
                    if (defaultData.computedBackgroundImage && defaultData.computedBackgroundImage !== 'none') {
                        el.style.backgroundImage = defaultData.computedBackgroundImage;
                        console.log(`✅ ProfilePic ${index} restauré (sans attribut):`, defaultData.computedBackgroundImage);
                    }
                }
            }
        });
    }

    _elementNeedsRestoration(element) {
        const style = element.getAttribute('style');
        const computedStyle = window.getComputedStyle(element);
        
        // Vérifier si l'élément n'a pas d'image de fond
        return (!style || !style.includes('background-image')) && 
               (!computedStyle.backgroundImage || computedStyle.backgroundImage === 'none');
    }

    _cleanupElement(element) {
        // Nettoyage minimal pour les éléments sans données par défaut
        const style = element.getAttribute('style');
        if (style && style.includes('background-image: url')) {
            const cleanedStyle = style.replace(/background-image\s*:\s*url\([^)]*\)\s*;?\s*/g, '');
            if (cleanedStyle.trim() === '') {
                element.removeAttribute('style');
            } else {
                element.setAttribute('style', cleanedStyle);
            }
        }
        
        // Supprimer les iframes YouTube
        const iframes = element.querySelectorAll('iframe[src*="youtube"]');
        iframes.forEach(iframe => iframe.remove());
    }

    _removeInjectedStyles() {
        const injectedStyles = document.querySelectorAll('style');
        injectedStyles.forEach(style => {
            const content = style.textContent || '';
            if (content.includes('w-full.xl\\:h-72.bg-center.bg-cover') || 
                content.includes('w-52.h-52.text-black.md\\:w-40.md\\:h-40') ||
                content.includes('background-image: url') ||
                content.includes(Better42Config.SELECTORS.BACKGROUND) ||
                content.includes(Better42Config.SELECTORS.PROFILE_PIC)) {
                style.remove();
            }
        });
    }

    // ✅ ANCIENNE MÉTHODE : Gardée pour compatibilité
    removeCustomizations() {
        console.log('🧹 BackgroundManager.removeCustomizations() appelée');
        this.removeAllCustomizations();
    }

    // ✅ NOUVELLE MÉTHODE : Recapturer les images sur changement de page
    recaptureDefaultImages() {
        this.defaultImagesCaptured = false;
        this.defaultImages.backgrounds.clear();
        this.defaultImages.profilePics.clear();
        this.captureDefaultImages();
    }

    // ✅ DIAGNOSTICS améliorés
    getDiagnostics() {
        const modifiedBg = document.querySelectorAll(`${Better42Config.SELECTORS.BACKGROUND}[data-better42-modified]`).length;
        const modifiedPfp = document.querySelectorAll(`${Better42Config.SELECTORS.PROFILE_PIC}[data-better42-modified]`).length;
        const totalModified = document.querySelectorAll('[data-better42-modified]').length;
        const hasCustomizations = this.hasActiveCustomizations();
        
        return {
            modifiedBackgrounds: modifiedBg,
            modifiedProfilePics: modifiedPfp,
            totalModifiedElements: totalModified,
            hasActiveCustomizations: hasCustomizations,
            themeManagerDark: window.ThemeManager?.isDark || false,
            defaultImagesCaptured: this.defaultImagesCaptured,
            capturedBackgrounds: this.defaultImages.backgrounds.size,
            capturedProfilePics: this.defaultImages.profilePics.size,
            defaultImagesPreview: {
                backgrounds: Array.from(this.defaultImages.backgrounds.entries()).map(([index, data]) => ({
                    index,
                    backgroundImage: data.computedBackgroundImage
                })),
                profilePics: Array.from(this.defaultImages.profilePics.entries()).map(([index, data]) => ({
                    index,
                    backgroundImage: data.computedBackgroundImage
                }))
            }
        };
    }

    hasActiveCustomizations() {
        const modifiedElements = document.querySelectorAll('[data-better42-modified]');
        if (modifiedElements.length > 0) return true;
        
        const bgElements = document.querySelectorAll(Better42Config.SELECTORS.BACKGROUND);
        for (const el of bgElements) {
            const style = el.getAttribute('style');
            if (style && style.includes('background-image: url')) return true;
            if (el.querySelector('iframe[src*="youtube"]')) return true;
        }
        
        const pfpElements = document.querySelectorAll(Better42Config.SELECTORS.PROFILE_PIC);
        for (const el of pfpElements) {
            const style = el.getAttribute('style');
            if (style && style.includes('background-image: url')) return true;
        }
        
        return false;
    }
}

window.BackgroundManager = new BackgroundManager();