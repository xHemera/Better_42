class TimeRemainingManager {
    // INITIALIZES THE TIME REMAINING MANAGER WITH DEFAULT PROPERTIES
    constructor() {
        this.initialized = false;
        this.observer = null;
    }

    // INITIALIZES THE TIME REMAINING MANAGER AND SETS UP ALL OBSERVERS AND BUTTONS
    init() {
        this.initialized = true;
        this.setupObserver();
        this.setupThemeObserver();
        this.addTimeRemainingButton();
    }

    // SETS UP MUTATION OBSERVER TO DETECT WHEN TIME DISPLAY ELEMENTS ARE ADDED TO THE DOM
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

    // SETS UP THEME AND COLOR CHANGE OBSERVERS TO UPDATE BUTTON APPEARANCE AND VISIBILITY
    setupThemeObserver() {
        document.addEventListener('better42-theme-changed', () => {
            setTimeout(() => {
                this.handleThemeChange();
            }, 100);
        });

        document.addEventListener('click', (e) => {
            if (e.target && e.target.id === 'theme-switcher') {
                this.handleThemeChange();
            }
        });

        document.addEventListener('better42-color-changed', () => {
            setTimeout(() => {
                this.updateButtonColors();
            }, 50);
        });

        window.addEventListener('storage', (event) => {
            if (event.key === 'better42-color-theme' || event.key === 'better42-custom-color') {
                setTimeout(() => {
                    this.updateButtonColors();
                }, 50);
            }
        });

        setTimeout(() => {
            this.attachColorObservers();
        }, 1000);

        const settingsObserver = new MutationObserver(() => {
            this.attachColorObservers();
        });
        
        settingsObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ATTACHES EVENT LISTENERS TO COLOR CONTROLS FOR REAL-TIME BUTTON COLOR UPDATES
    attachColorObservers() {
        const colorPicker = document.querySelector('#custom-color-picker');
        if (colorPicker && !colorPicker.hasAttribute('data-time-remaining-listener')) {
            colorPicker.addEventListener('input', () => {
                this.updateButtonColors();
            });
            colorPicker.setAttribute('data-time-remaining-listener', 'true');
        }

        const applyBtn = document.querySelector('#apply-custom-color');
        if (applyBtn && !applyBtn.hasAttribute('data-time-remaining-listener')) {
            applyBtn.addEventListener('click', () => {
                setTimeout(() => {
                    this.updateButtonColors();
                }, 100);
            });
            applyBtn.setAttribute('data-time-remaining-listener', 'true');
        }

        const saveBtn = document.querySelector('#save-custom-color');
        if (saveBtn && !saveBtn.hasAttribute('data-time-remaining-listener')) {
            saveBtn.addEventListener('click', () => {
                setTimeout(() => {
                    this.updateButtonColors();
                }, 100);
            });
            saveBtn.setAttribute('data-time-remaining-listener', 'true');
        }

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

    // HANDLES THEME CHANGES BY SHOWING OR HIDING THE TIME REMAINING BUTTON
    handleThemeChange() {
        if (!window.ThemeManager || !window.ThemeManager.isDark) {
            this.removeButton();
        } else {
            this.addTimeRemainingButton();
        }
    }

    // REMOVES THE TIME REMAINING BUTTON FROM THE DOM
    removeButton() {
        const button = document.querySelector('.time-remaining-btn');
        if (button) {
            button.style.transition = 'none !important';
            button.remove();
        }
    }

    // EXTRACTS TIME DATA FROM THE DOM TO CALCULATE REMAINING DAYS
    extractTimeData() {
        const elapsedElement = document.querySelector('text.fill-legacy-main[font-size="24"]');
        const totalElement = document.querySelector('text.fill-gray-400[font-size="16"]');
        
        if (!elapsedElement || !totalElement) return null;

        const elapsedMatch = elapsedElement.textContent.match(/(\d+)\s*days?/);
        const elapsedDays = elapsedMatch ? parseInt(elapsedMatch[1]) : null;

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

    // GETS THE CURRENT THEME COLOR AS RGB VALUES FOR STYLING THE BUTTON
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

    // ADDS THE TIME REMAINING BUTTON TO THE DOM WITH PROPER STYLING AND POSITIONING
    addTimeRemainingButton() {
        if (!window.ThemeManager || !window.ThemeManager.isDark) {
            return;
        }

        const existingBtn = document.querySelector('.time-remaining-btn');
        if (existingBtn) {
            existingBtn.remove();
        }

        const timeData = this.extractTimeData();
        if (!timeData) return;

        const elapsedElement = document.querySelector('text.fill-legacy-main[font-size="24"]');
        if (!elapsedElement) return;

        const svg = elapsedElement.closest('svg');
        if (!svg) return;

        const svgContainer = svg.closest('.flex.flex-col.items-center');
        if (!svgContainer) return;

        svgContainer.style.position = 'relative';

        const remainingButton = document.createElement('button');
        remainingButton.className = 'time-remaining-btn';
        
        const themeColor = this.getCurrentThemeColor();
        const remainingText = timeData.remaining > 0 ? 
            `${timeData.remaining} day${timeData.remaining > 1 ? 's' : ''} left` : 
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
            transition: color 0.2s ease, background 0.2s ease !important;
            min-width: 150px !important;
            text-align: center !important;
            z-index: 1000 !important;
            white-space: nowrap !important;
        `;

        remainingButton.addEventListener('mouseenter', () => {
            remainingButton.style.background = `rgba(${themeColor}, 0.2) !important`;
            remainingButton.style.transform = 'translateX(-50%) translateY(-2px) !important';
            remainingButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2) !important';
        });

        remainingButton.addEventListener('mouseleave', () => {
            remainingButton.style.background = `rgba(${themeColor}, 0.1) !important`;
            remainingButton.style.transform = 'translateX(-50%) !important';
            remainingButton.style.boxShadow = 'none !important';
        });

        svgContainer.appendChild(remainingButton);
    }

    // UPDATES THE BUTTON COLORS WHEN THEME OR CUSTOM COLORS CHANGE
    updateButtonColors() {
        const button = document.querySelector('.time-remaining-btn');
        if (!button) return;

        const currentTheme = localStorage.getItem('better42-color-theme') || 'violet';
        let newColor;

        if (currentTheme === 'custom') {
            const colorPicker = document.querySelector('#custom-color-picker');
            if (colorPicker && colorPicker.value) {
                const hex = colorPicker.value.replace('#', '');
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);  
                const b = parseInt(hex.substring(4, 6), 16);
                newColor = `${r}, ${g}, ${b}`;
            } else {
                newColor = this.getCurrentThemeColor();
            }
        } else {
            newColor = this.getCurrentThemeColor();
        }

        button.style.setProperty('color', `rgb(${newColor})`, 'important');
    }

    // REFRESHES THE TIME REMAINING BUTTON IF THE MANAGER IS INITIALIZED
    refresh() {
        if (this.initialized) {
            this.addTimeRemainingButton();
        }
    }

    // DESTROYS THE MANAGER AND CLEANS UP ALL OBSERVERS AND DOM ELEMENTS
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