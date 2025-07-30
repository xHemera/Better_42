class BackgroundManager {
    constructor() {
        this.defaultImagesCaptured = false;
        this.defaultImages = {
            backgrounds: new Map(),
            profilePics: new Map()
        };
        
        this.captureDefaultImages();
    }

    // CAPTURES DEFAULT BACKGROUND AND PROFILE PICTURE IMAGES FROM THE WEBSITE
    captureDefaultImages() {
        if (this.defaultImagesCaptured) return;

        setTimeout(() => {
            this._captureBackgroundImages();
            this._captureProfilePicImages();
            this.defaultImagesCaptured = true;
        }, 1000);
    }

    // CAPTURES BACKGROUND IMAGES FROM DOM ELEMENTS
    _captureBackgroundImages() {
        const bgElements = document.querySelectorAll(Better42Config.SELECTORS.BACKGROUND);
        bgElements.forEach((el, index) => {
            if (!el.hasAttribute('data-better42-modified')) {
                const computedStyle = window.getComputedStyle(el);
                const backgroundImage = computedStyle.backgroundImage;
                const styleAttr = el.getAttribute('style') || '';
                
                this.defaultImages.backgrounds.set(index, {
                    element: el,
                    computedBackgroundImage: backgroundImage,
                    originalStyleAttr: styleAttr,
                    originalInnerHTML: el.innerHTML,
                    selector: this._getElementSelector(el)
                });
            }
        });
    }

    // CAPTURES PROFILE PICTURE IMAGES FROM DOM ELEMENTS
    _captureProfilePicImages() {
        const pfpElements = document.querySelectorAll(Better42Config.SELECTORS.PROFILE_PIC);
        pfpElements.forEach((el, index) => {
            if (!el.hasAttribute('data-better42-modified')) {
                const computedStyle = window.getComputedStyle(el);
                const backgroundImage = computedStyle.backgroundImage;
                const styleAttr = el.getAttribute('style') || '';
                
                this.defaultImages.profilePics.set(index, {
                    element: el,
                    computedBackgroundImage: backgroundImage,
                    originalStyleAttr: styleAttr,
                    selector: this._getElementSelector(el)
                });
            }
        });
    }

    // CREATES UNIQUE CSS SELECTOR FOR GIVEN DOM ELEMENT
    _getElementSelector(element) {
        if (element.id) return `#${element.id}`;
        
        let selector = element.tagName.toLowerCase();
        if (element.className) {
            selector += '.' + element.className.split(' ').join('.');
        }
        
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

    // APPLIES CUSTOM BACKGROUND IMAGE OR VIDEO TO BACKGROUND ELEMENTS
    applyCustomBackground(url) {
        if (!window.ThemeManager || !window.ThemeManager.isDark) {
            return;
        }

        if (Better42Utils.isYouTubeVideo(url)) {
            this._applyYouTubeBackground(url);
            return;
        }
        
        this._applyImageBackground(url);
    }

    // APPLIES YOUTUBE VIDEO AS BACKGROUND TO BACKGROUND ELEMENTS
    _applyYouTubeBackground(url) {
        const videoId = Better42Utils.extractYouTubeId(url);
        if (!videoId) return;
        
        const embedUrl = Better42Utils.generateYouTubeEmbedUrl(videoId);
        
        const bgElements = document.querySelectorAll(Better42Config.SELECTORS.BACKGROUND);
        bgElements.forEach((el, index) => {
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
            
            el.setAttribute('data-better42-modified', 'true');
            el.setAttribute('data-better42-element-index', index);
        });
    }

    // APPLIES STATIC IMAGE AS BACKGROUND TO BACKGROUND ELEMENTS
    _applyImageBackground(url) {
        const bgElements = document.querySelectorAll(Better42Config.SELECTORS.BACKGROUND);
        bgElements.forEach((el, index) => {
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
            
            el.setAttribute('data-better42-modified', 'true');
            el.setAttribute('data-better42-element-index', index);
        });
    }

    // APPLIES CUSTOM PROFILE PICTURE TO PROFILE PICTURE ELEMENTS
    applyCustomPfp(url) {
        if (!window.ThemeManager || !window.ThemeManager.isDark) {
            return;
        }

        const pfpElements = document.querySelectorAll(Better42Config.SELECTORS.PROFILE_PIC);
        pfpElements.forEach((el, index) => {
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
            
            el.setAttribute('data-better42-modified', 'true');
            el.setAttribute('data-better42-element-index', index);
        });
    }

    // CAPTURES DEFAULT STATE OF ELEMENT BEFORE MODIFICATION
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
    }

    // REMOVES ALL CUSTOMIZATIONS AND RESTORES DEFAULT IMAGES
    removeAllCustomizations() {
        this._removeInjectedStyles();
        this._restoreBackgroundElements();
        this._restoreProfilePicElements();
    }

    // RESTORES BACKGROUND ELEMENTS TO THEIR DEFAULT STATE
    _restoreBackgroundElements() {
        const modifiedBgElements = document.querySelectorAll('[data-better42-modified]');
        modifiedBgElements.forEach(el => {
            if (el.matches(Better42Config.SELECTORS.BACKGROUND.split(', ').join(', '))) {
                const elementIndex = parseInt(el.getAttribute('data-better42-element-index')) || 0;
                const defaultData = this.defaultImages.backgrounds.get(elementIndex);
                
                if (defaultData) {
                    if (defaultData.originalInnerHTML) {
                        el.innerHTML = defaultData.originalInnerHTML;
                    }
                    
                    if (defaultData.originalStyleAttr) {
                        el.setAttribute('style', defaultData.originalStyleAttr);
                    } else if (defaultData.computedBackgroundImage && defaultData.computedBackgroundImage !== 'none') {
                        el.style.backgroundImage = defaultData.computedBackgroundImage;
                    } else {
                        el.removeAttribute('style');
                    }
                } else {
                    this._cleanupElement(el);
                }
                
                el.removeAttribute('data-better42-modified');
                el.removeAttribute('data-better42-element-index');
            }
        });

        const allBgElements = document.querySelectorAll(Better42Config.SELECTORS.BACKGROUND);
        allBgElements.forEach((el, index) => {
            if (!el.hasAttribute('data-better42-modified')) {
                const defaultData = this.defaultImages.backgrounds.get(index);
                if (defaultData && this._elementNeedsRestoration(el)) {
                    if (defaultData.computedBackgroundImage && defaultData.computedBackgroundImage !== 'none') {
                        el.style.backgroundImage = defaultData.computedBackgroundImage;
                    }
                }
            }
            
            const iframes = el.querySelectorAll('iframe[src*="youtube"]');
            iframes.forEach(iframe => iframe.remove());
        });
    }

    // RESTORES PROFILE PICTURE ELEMENTS TO THEIR DEFAULT STATE
    _restoreProfilePicElements() {
        const modifiedPfpElements = document.querySelectorAll('[data-better42-modified]');
        modifiedPfpElements.forEach(el => {
            if (el.matches(Better42Config.SELECTORS.PROFILE_PIC)) {
                const elementIndex = parseInt(el.getAttribute('data-better42-element-index')) || 0;
                const defaultData = this.defaultImages.profilePics.get(elementIndex);
                
                if (defaultData) {
                    if (defaultData.originalStyleAttr) {
                        el.setAttribute('style', defaultData.originalStyleAttr);
                    } else if (defaultData.computedBackgroundImage && defaultData.computedBackgroundImage !== 'none') {
                        el.style.backgroundImage = defaultData.computedBackgroundImage;
                    } else {
                        el.removeAttribute('style');
                    }
                } else {
                    this._cleanupElement(el);
                }
                
                el.removeAttribute('data-better42-modified');
                el.removeAttribute('data-better42-element-index');
            }
        });

        const allPfpElements = document.querySelectorAll(Better42Config.SELECTORS.PROFILE_PIC);
        allPfpElements.forEach((el, index) => {
            if (!el.hasAttribute('data-better42-modified')) {
                const defaultData = this.defaultImages.profilePics.get(index);
                if (defaultData && this._elementNeedsRestoration(el)) {
                    if (defaultData.computedBackgroundImage && defaultData.computedBackgroundImage !== 'none') {
                        el.style.backgroundImage = defaultData.computedBackgroundImage;
                    }
                }
            }
        });
    }

    // CHECKS IF ELEMENT NEEDS RESTORATION TO DEFAULT STATE
    _elementNeedsRestoration(element) {
        const style = element.getAttribute('style');
        const computedStyle = window.getComputedStyle(element);
        
        return (!style || !style.includes('background-image')) && 
               (!computedStyle.backgroundImage || computedStyle.backgroundImage === 'none');
    }

    // CLEANS UP ELEMENT BY REMOVING CUSTOM MODIFICATIONS
    _cleanupElement(element) {
        const style = element.getAttribute('style');
        if (style && style.includes('background-image: url')) {
            const cleanedStyle = style.replace(/background-image\s*:\s*url\([^)]*\)\s*;?\s*/g, '');
            if (cleanedStyle.trim() === '') {
                element.removeAttribute('style');
            } else {
                element.setAttribute('style', cleanedStyle);
            }
        }
        
        const iframes = element.querySelectorAll('iframe[src*="youtube"]');
        iframes.forEach(iframe => iframe.remove());
    }

    // REMOVES INJECTED CSS STYLES CREATED BY BETTER42
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

    // LEGACY METHOD FOR REMOVING CUSTOMIZATIONS
    removeCustomizations() {
        this.removeAllCustomizations();
    }

    // RECAPTURES DEFAULT IMAGES WHEN PAGE CHANGES
    recaptureDefaultImages() {
        this.defaultImagesCaptured = false;
        this.defaultImages.backgrounds.clear();
        this.defaultImages.profilePics.clear();
        this.captureDefaultImages();
    }

    // RETURNS DIAGNOSTIC INFORMATION ABOUT CURRENT STATE
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

    // CHECKS IF THERE ARE ANY ACTIVE CUSTOMIZATIONS ON THE PAGE
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