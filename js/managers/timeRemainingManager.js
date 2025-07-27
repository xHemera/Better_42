class TimeRemainingManager {
    constructor() {
        this.initialized = false;
        this.observer = null;
    }

    init() {
        this.initialized = true;
        this.setupObserver();
        this.setupThemeObserver();
        this.addTimeRemainingButton();
    }

    setupObserver() {
        if (this.observer) {
            this.observer.disconnect();
        }

        this.observer = new MutationObserver((mutations) => {
            let needsRefresh = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Détecter si le SVG du temps écoulé a été ajouté
                            if (node.querySelector && 
                                (node.querySelector('text.fill-legacy-main') || 
                                 node.querySelector('text.fill-gray-400'))) {
                                needsRefresh = true;
                            }
                        }
                    });
                }
            });
            
            if (needsRefresh) {
                setTimeout(() => {
                    this.addTimeRemainingButton();
                }, 100);
            }
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    setupThemeObserver() {
        // Écouter les changements de thème pour supprimer/ajouter le bouton
        document.addEventListener('better42-theme-changed', () => {
            setTimeout(() => {
                this.handleThemeChange();
            }, 100);
        });

        // Observer les clicks sur le bouton thème
        document.addEventListener('click', (e) => {
            if (e.target && e.target.id === 'theme-switcher') {
                setTimeout(() => {
                    this.handleThemeChange();
                }, 200);
            }
        });

        // Écouter les changements de couleur custom
        document.addEventListener('better42-color-changed', () => {
            setTimeout(() => {
                this.updateButtonColors();
            }, 50);
        });

        // Observer les changements dans localStorage pour le thème
        window.addEventListener('storage', (event) => {
            if (event.key === 'better42-color-theme' || event.key === 'better42-custom-color') {
                setTimeout(() => {
                    this.updateButtonColors();
                }, 50);
            }
        });

        // Observer les boutons Apply/Save et les couleurs prédéfinies
        setTimeout(() => {
            this.attachColorObservers();
        }, 1000);

        // Observer aussi quand les éléments sont ajoutés dynamiquement
        const settingsObserver = new MutationObserver(() => {
            this.attachColorObservers();
        });
        
        settingsObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    attachColorObservers() {
        // Observer le color picker en temps réel
        const colorPicker = document.querySelector('#custom-color-picker');
        if (colorPicker && !colorPicker.hasAttribute('data-time-remaining-listener')) {
            colorPicker.addEventListener('input', () => {
                this.updateButtonColors();
            });
            colorPicker.setAttribute('data-time-remaining-listener', 'true');
        }

        // Observer le bouton Appliquer
        const applyBtn = document.querySelector('#apply-custom-color');
        if (applyBtn && !applyBtn.hasAttribute('data-time-remaining-listener')) {
            applyBtn.addEventListener('click', () => {
                setTimeout(() => {
                    this.updateButtonColors();
                }, 100);
            });
            applyBtn.setAttribute('data-time-remaining-listener', 'true');
        }

        // Observer le bouton Sauver
        const saveBtn = document.querySelector('#save-custom-color');
        if (saveBtn && !saveBtn.hasAttribute('data-time-remaining-listener')) {
            saveBtn.addEventListener('click', () => {
                setTimeout(() => {
                    this.updateButtonColors();
                }, 100);
            });
            saveBtn.setAttribute('data-time-remaining-listener', 'true');
        }

        // Observer les boutons de couleur prédéfinis
        const colorButtons = document.querySelectorAll('[data-theme]:not([data-time-remaining-listener])');
        colorButtons.forEach(button => {
            button.addEventListener('click', () => {
                setTimeout(() => {
                    this.updateButtonColors();
                }, 100);
            });
            button.setAttribute('data-time-remaining-listener', 'true');
        });
    }

    handleThemeChange() {
        // Si on est en mode "Worse" (pas de thème sombre), supprimer le bouton
        if (!window.ThemeManager || !window.ThemeManager.isDark) {
            this.removeButton();
        } else {
            // Si on est en mode "Better", ajouter le bouton
            this.addTimeRemainingButton();
        }
    }

    removeButton() {
        const button = document.querySelector('.time-remaining-btn');
        if (button) {
            button.remove();
        }
    }

    extractTimeData() {
        // Chercher les éléments text avec les bonnes classes
        const elapsedElement = document.querySelector('text.fill-legacy-main[font-size="24"]');
        const totalElement = document.querySelector('text.fill-gray-400[font-size="16"]');
        
        if (!elapsedElement || !totalElement) return null;

        // Extraire le nombre de jours écoulés (ex: "157 days")
        const elapsedMatch = elapsedElement.textContent.match(/(\d+)\s*days?/);
        const elapsedDays = elapsedMatch ? parseInt(elapsedMatch[1]) : null;

        // Extraire le total (ex: "On 188")
        const totalMatch = totalElement.textContent.match(/On\s*(\d+)/);
        const totalDays = totalMatch ? parseInt(totalMatch[1]) : null;

        if (elapsedDays !== null && totalDays !== null) {
            return {
                elapsed: elapsedDays,
                total: totalDays,
                remaining: totalDays - elapsedDays
            };
        }

        return null;
    }

    getCurrentThemeColor() {
        const currentTheme = localStorage.getItem('better42-color-theme') || 'violet';
        
        if (currentTheme === 'custom') {
            const savedCustomColor = localStorage.getItem('better42-custom-color');
            if (savedCustomColor) {
                const hex = savedCustomColor.replace('#', '');
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                return `${r}, ${g}, ${b}`;
            }
        }
        
        if (window.ThemeManager && window.ThemeManager.getCurrentThemeColor) {
            return window.ThemeManager.getCurrentThemeColor();
        }
        
        const themeColors = {
            violet: '124, 58, 237',
            blue: '59, 130, 246', 
            green: '34, 197, 94',
            red: '239, 68, 68',
            orange: '249, 115, 22',
            pink: '236, 72, 153',
            yellow: '234, 179, 8'
        };
        
        return themeColors[currentTheme] || '124, 58, 237';
    }

    addTimeRemainingButton() {
        // Ne pas ajouter le bouton si on n'est pas en mode "Better"
        if (!window.ThemeManager || !window.ThemeManager.isDark) {
            return;
        }

        // Supprimer le bouton existant
        const existingBtn = document.querySelector('.time-remaining-btn');
        if (existingBtn) {
            existingBtn.remove();
        }

        const timeData = this.extractTimeData();
        if (!timeData) return;

        // Trouver le conteneur du SVG en cherchant par les éléments text
        const elapsedElement = document.querySelector('text.fill-legacy-main[font-size="24"]');
        if (!elapsedElement) return;

        const svg = elapsedElement.closest('svg');
        if (!svg) return;

        const svgContainer = svg.closest('.flex.flex-col.items-center');
        if (!svgContainer) return;

        // Rendre le conteneur relatif pour le positionnement absolu
        svgContainer.style.position = 'relative';

        // Créer le bouton
        const remainingButton = document.createElement('button');
        remainingButton.className = 'time-remaining-btn';
        
        const themeColor = this.getCurrentThemeColor();
        const remainingText = timeData.remaining > 0 ? 
            `${timeData.remaining} days${timeData.remaining > 1 ? 's' : ''} left${timeData.remaining > 1 ? 's' : ''}` : 
            'Terminé !';

        remainingButton.innerHTML = remainingText;
        remainingButton.style.cssText = `
            color: rgb(${themeColor}) !important;
            padding: 8px 16px !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            position: absolute !important;
            bottom: 3px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            transition: all 0.3s ease !important;
            min-width: 150px !important;
            text-align: center !important;
            z-index: 1000 !important;
            white-space: nowrap !important;
        `;

        // Effets hover
        remainingButton.addEventListener('mouseenter', () => {
            remainingButton.style.background = `rgba(${themeColor}, 0.2) !important`;
            remainingButton.style.transform = 'translateY(-2px) !important';
            remainingButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2) !important';
        });

        remainingButton.addEventListener('mouseleave', () => {
            remainingButton.style.background = `rgba(${themeColor}, 0.1) !important`;
            remainingButton.style.transform = 'none !important';
            remainingButton.style.boxShadow = 'none !important';
        });

        svgContainer.appendChild(remainingButton);
    }

    updateButtonColors() {
        const button = document.querySelector('.time-remaining-btn');
        if (!button) return;

        // Récupérer la couleur actuelle (y compris du color picker)
        const currentTheme = localStorage.getItem('better42-color-theme') || 'violet';
        let newColor;

        if (currentTheme === 'custom') {
            // Vérifier d'abord si le color picker est actif
            const colorPicker = document.querySelector('#custom-color-picker');
            if (colorPicker && colorPicker.value) {
                const hex = colorPicker.value.replace('#', '');
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);  
                const b = parseInt(hex.substring(4, 6), 16);
                newColor = `${r}, ${g}, ${b}`;
            } else {
                // Fallback sur la couleur sauvegardée
                newColor = this.getCurrentThemeColor();
            }
        } else {
            newColor = this.getCurrentThemeColor();
        }

        button.style.setProperty('color', `rgb(${newColor})`, 'important');
    }

    refresh() {
        if (this.initialized) {
            this.addTimeRemainingButton();
        }
    }

    destroy() {
        this.initialized = false;
        
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        
        const button = document.querySelector('.time-remaining-btn');
        if (button) {
            button.remove();
        }
    }
}

const timeRemainingManager = new TimeRemainingManager();
window.TimeRemainingManager = timeRemainingManager;