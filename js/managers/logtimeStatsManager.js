console.log('🔄 Chargement logtimeStatsManager.js - Version Simple...');

class LogtimeStatsManager {
    constructor() {
        this.initialized = false;
        this.observer = null;
    }

    init() {
        console.log('📊 Initialisation LogtimeStatsManager...');
        this.initialized = true;
        this.addStatsButtons();
        this.setupObserver();
    }

    setupObserver() {
        if (this.observer) {
            this.observer.disconnect();
        }

        this.observer = new MutationObserver((mutations) => {
            let needsRefresh = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // Vérifier si des tables de logtime ont été ajoutées
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.querySelector && node.querySelector('table thead tr th[colspan="7"]')) {
                                needsRefresh = true;
                            }
                        }
                    });
                }
            });
            
            if (needsRefresh) {
                setTimeout(() => {
                    this.addStatsButtons();
                }, 100);
            }
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Observer pour les changements de couleur
        this.setupColorObserver();
    }

    setupColorObserver() {
        // Écouter les événements de changement de couleur custom
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

        // Observer seulement les boutons Apply/Save et les couleurs prédéfinies
        setTimeout(() => {
            // Observer le bouton Appliquer
            const applyBtn = document.querySelector('#apply-custom-color');
            if (applyBtn) {
                applyBtn.addEventListener('click', () => {
                    setTimeout(() => {
                        this.updateButtonColors();
                    }, 100);
                });
            }

            // Observer le bouton Sauver
            const saveBtn = document.querySelector('#save-custom-color');
            if (saveBtn) {
                saveBtn.addEventListener('click', () => {
                    setTimeout(() => {
                        this.updateButtonColors();
                    }, 100);
                });
            }

            // Observer aussi les boutons de couleur prédéfinis
            const colorButtons = document.querySelectorAll('[data-theme]');
            colorButtons.forEach(button => {
                button.addEventListener('click', () => {
                    setTimeout(() => {
                        this.updateButtonColors();
                    }, 100);
                });
            });
        }, 1000);
    }

    updateButtonColors() {
        if (!this.initialized) return;
        
        const newColor = this.getCurrentThemeColor();
        console.log('🎨 Mise à jour couleurs logtime boutons:', newColor);
        
        // Mettre à jour les boutons mensuels
        const monthlyBtns = document.querySelectorAll('.monthly-stats-btn');
        console.log(`📅 ${monthlyBtns.length} boutons mensuels trouvés`);
        monthlyBtns.forEach(btn => {
            btn.style.background = `rgba(${newColor}, 0.1)`;
            btn.style.borderColor = `rgba(${newColor}, 0.3)`;
            btn.style.color = `rgb(${newColor})`;
        });

        // Mettre à jour les boutons hebdomadaires  
        const weeklyBtns = document.querySelectorAll('.weekly-stats-btn');
        console.log(`📊 ${weeklyBtns.length} boutons hebdomadaires trouvés`);
        weeklyBtns.forEach(btn => {
            btn.style.background = `rgba(${newColor}, 0.15)`;
            btn.style.borderColor = `rgba(${newColor}, 0.3)`;
            btn.style.color = `rgb(${newColor})`;
        });
    }

    convertOpacityToHours(opacity) {
        if (!opacity || opacity <= 0) return 0;
        // Formule ultra précise calibrée avec vraies valeurs 42
        // 0.094 → 2h16, 0.224 → 5h23, 0.12 → 2h56, 0.075 → 1h48, 0.03 → 45min
        return opacity / 0.0414;
    }

    extractOpacityFromStyle(styleText) {
        if (!styleText) return 0;
        
        const match = styleText.match(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)\s*\)/);
        if (match) {
            return parseFloat(match[1]) || 0;
        }
        
        return 0;
    }

    getLogtimeFromCell(cellElement) {
        const styleAttr = cellElement.getAttribute('style');
        if (!styleAttr) return 0;
        
        const opacity = this.extractOpacityFromStyle(styleAttr);
        return this.convertOpacityToHours(opacity);
    }

    formatTime(totalHours) {
        if (totalHours <= 0) return "0h00";
        
        const hours = Math.floor(totalHours);
        const minutes = Math.round((totalHours - hours) * 60);
        
        if (hours === 0) {
            return `${minutes.toString().padStart(2, '0')}m`;
        } else {
            return `${hours}h${minutes.toString().padStart(2, '0')}`;
        }
    }

    calculateWeeklyTotal(row) {
        let total = 0;
        
        const dayCells = row.querySelectorAll('td div[style*="background-color: rgba"]');
        
        dayCells.forEach(dayCell => {
            const hours = this.getLogtimeFromCell(dayCell);
            total += hours;
        });
        
        return total;
    }

    calculateMonthlyTotal(table) {
        let total = 0;
        
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            total += this.calculateWeeklyTotal(row);
        });
        
        return total;
    }

    getCurrentThemeColor() {
        console.log('🔍 getCurrentThemeColor appelé');
        
        // Vérifier d'abord si on est en mode custom
        const currentTheme = localStorage.getItem('better42-color-theme') || 'violet';
        console.log('🔍 Thème actuel:', currentTheme);
        
        if (currentTheme === 'custom') {
            const savedCustomColor = localStorage.getItem('better42-custom-color');
            console.log('🔍 Couleur custom sauvée:', savedCustomColor);
            
            if (savedCustomColor) {
                // Convertir hex vers RGB
                const hex = savedCustomColor.replace('#', '');
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                const rgbColor = `${r}, ${g}, ${b}`;
                console.log('🔍 Couleur RGB calculée:', rgbColor);
                return rgbColor;
            }
        }
        
        // Utiliser ThemeManager si disponible pour les couleurs prédéfinies
        if (window.ThemeManager && window.ThemeManager.getCurrentThemeColor) {
            const color = window.ThemeManager.getCurrentThemeColor();
            console.log('🔍 Couleur depuis ThemeManager:', color);
            return color;
        }
        
        // Couleurs prédéfinies en fallback
        const themeColors = {
            violet: '124, 58, 237',
            blue: '59, 130, 246', 
            green: '34, 197, 94',
            red: '239, 68, 68',
            orange: '249, 115, 22',
            pink: '236, 72, 153',
            yellow: '234, 179, 8'
        };
        
        const fallbackColor = themeColors[currentTheme] || '124, 58, 237';
        console.log('🔍 Couleur fallback:', fallbackColor);
        return fallbackColor;
    }

    addStatsButtons() {
        console.log('🔍 Recherche des tables de logtime...');
        
        const tables = document.querySelectorAll('table');
        console.log(`📅 ${tables.length} tables trouvées`);
        
        tables.forEach(table => {
            const monthHeader = table.querySelector('thead tr th[colspan="7"]');
            if (!monthHeader) return;
            
            console.log('📊 Ajout des boutons de stats...');
            
            this.addMonthlyStatsButton(table, monthHeader);
            this.addWeeklyStatsButtons(table);
        });
    }

    addMonthlyStatsButton(table, monthHeader) {
        const existingBtn = monthHeader.querySelector('.monthly-stats-btn');
        if (existingBtn) existingBtn.remove();

        const monthlyTotal = this.calculateMonthlyTotal(table);
        const formattedTime = this.formatTime(monthlyTotal);
        
        const currentText = monthHeader.textContent.trim();
        const themeColor = this.getCurrentThemeColor();
        
        monthHeader.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <span>${currentText}</span>
                <button class="monthly-stats-btn" style="
                    background: rgba(${themeColor}, 0.1); 
                    border: 1px solid rgba(${themeColor}, 0.3); 
                    color: rgb(${themeColor}); 
                    padding: 2px 6px; 
                    border-radius: 4px; 
                    font-size: 10px; 
                    cursor: pointer;
                    min-width: 45px;
                    text-align: center;
                ">${formattedTime}</button>
            </div>
        `;
        
        console.log(`📅 Bouton mensuel ajouté: ${formattedTime}`);
    }

    addWeeklyStatsButtons(table) {
        const rows = table.querySelectorAll('tbody tr');
        const themeColor = this.getCurrentThemeColor();
        
        rows.forEach(row => {
            const existingBtn = row.querySelector('.weekly-stats-btn');
            if (existingBtn) existingBtn.parentElement.remove();

            const weeklyTotal = this.calculateWeeklyTotal(row);
            const formattedTime = this.formatTime(weeklyTotal);
            
            const statsCell = document.createElement('td');
            statsCell.className = 'text-xs border-white border';
            statsCell.innerHTML = `
                <button class="weekly-stats-btn" style="
                    background: rgba(${themeColor}, 0.15); 
                    border: 1px solid rgba(${themeColor}, 0.3); 
                    color: rgb(${themeColor}); 
                    padding: 2px 6px; 
                    border-radius: 4px; 
                    font-size: 10px; 
                    cursor: pointer;
                    min-width: 45px;
                    text-align: center;
                ">${formattedTime}</button>
            `;
            
            row.appendChild(statsCell);
        });
        
        console.log(`📊 ${rows.length} boutons hebdomadaires ajoutés`);
    }

    refresh() {
        if (this.initialized) {
            console.log('🔄 Refresh des stats logtime...');
            this.addStatsButtons();
        }
    }
}

const logtimeStatsManager = new LogtimeStatsManager();
window.LogtimeStatsManager = logtimeStatsManager;

console.log('✅ LogtimeStatsManager simple créé et exposé sur window');