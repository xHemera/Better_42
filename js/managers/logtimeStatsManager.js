
class LogtimeStatsManager {
    // INITIALIZES LOGTIME STATS MANAGER WITH DEFAULT VALUES
    constructor() {
        this.initialized = false;
        this.observer = null;
    }

    // INITIALIZES THE MANAGER AND SETS UP OBSERVERS AND BUTTONS
    init() {
        this.initialized = true;
        this.addStatsButtons();
        this.setupObserver();
    }

    // SETS UP MUTATION OBSERVER TO DETECT LOGTIME TABLE CHANGES
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

        this.setupColorObserver();
    }

    // SETS UP OBSERVERS FOR COLOR THEME CHANGES
    setupColorObserver() {
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
            const applyBtn = document.querySelector('#apply-custom-color');
            if (applyBtn) {
                applyBtn.addEventListener('click', () => {
                    setTimeout(() => {
                        this.updateButtonColors();
                    }, 100);
                });
            }

            const saveBtn = document.querySelector('#save-custom-color');
            if (saveBtn) {
                saveBtn.addEventListener('click', () => {
                    setTimeout(() => {
                        this.updateButtonColors();
                    }, 100);
                });
            }

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


    // UPDATES THE COLORS OF ALL STATS BUTTONS TO MATCH CURRENT THEME
    updateButtonColors() {
        if (!this.initialized) return;
        
        const newColor = this.getCurrentThemeColor();
        
        const monthlyBtns = document.querySelectorAll('.monthly-stats-btn');
        monthlyBtns.forEach(btn => {
            btn.style.background = `rgba(${newColor}, 0.1)`;
            btn.style.borderColor = `rgba(${newColor}, 0.3)`;
            btn.style.color = `rgb(${newColor})`;
        });

        const weeklyBtns = document.querySelectorAll('.weekly-stats-btn');
        weeklyBtns.forEach(btn => {
            btn.style.background = `rgba(${newColor}, 0.15)`;
            btn.style.borderColor = `rgba(${newColor}, 0.3)`;
            btn.style.color = `rgb(${newColor})`;
        });
    }

    // CONVERTS CSS OPACITY VALUE TO HOURS USING CALIBRATED FORMULA
    convertOpacityToHours(opacity) {
        if (!opacity || opacity <= 0) return 0;
        return opacity / 0.0414;
    }

    // EXTRACTS OPACITY VALUE FROM CSS STYLE STRING
    extractOpacityFromStyle(styleText) {
        if (!styleText) return 0;
        
        const match = styleText.match(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)\s*\)/);
        if (match) {
            return parseFloat(match[1]) || 0;
        }
        
        return 0;
    }

    // GETS LOGTIME HOURS FROM A TABLE CELL ELEMENT
    getLogtimeFromCell(cellElement) {
        const styleAttr = cellElement.getAttribute('style');
        if (!styleAttr) return 0;
        
        const opacity = this.extractOpacityFromStyle(styleAttr);
        return this.convertOpacityToHours(opacity);
    }

    // FORMATS HOURS INTO READABLE TIME STRING
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

    // CALCULATES TOTAL HOURS FOR A WEEK ROW
    calculateWeeklyTotal(row) {
        let total = 0;
        
        const dayCells = row.querySelectorAll('td div[style*="background-color: rgba"]');
        
        dayCells.forEach(dayCell => {
            const hours = this.getLogtimeFromCell(dayCell);
            total += hours;
        });
        
        return total;
    }

    // CALCULATES TOTAL HOURS FOR AN ENTIRE MONTH TABLE
    calculateMonthlyTotal(table) {
        let total = 0;
        
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            total += this.calculateWeeklyTotal(row);
        });
        
        return total;
    }

    // GETS CURRENT THEME COLOR FROM LOCALSTORAGE OR THEME MANAGER
    getCurrentThemeColor() {
        const currentTheme = localStorage.getItem('better42-color-theme') || 'violet';
        
        if (currentTheme === 'custom') {
            const savedCustomColor = localStorage.getItem('better42-custom-color');
            
            if (savedCustomColor) {
                const hex = savedCustomColor.replace('#', '');
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                const rgbColor = `${r}, ${g}, ${b}`;
                return rgbColor;
            }
        }
        
        if (window.ThemeManager && window.ThemeManager.getCurrentThemeColor) {
            const color = window.ThemeManager.getCurrentThemeColor();
            return color;
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
        
        const fallbackColor = themeColors[currentTheme] || '124, 58, 237';
        return fallbackColor;
    }

    // ADDS STATS BUTTONS TO ALL LOGTIME TABLES ON THE PAGE
    addStatsButtons() {
        const tables = document.querySelectorAll('table');
        
        tables.forEach(table => {
            const monthHeader = table.querySelector('thead tr th[colspan="7"]');
            if (!monthHeader) return;
            
            this.addMonthlyStatsButton(table, monthHeader);
            this.addWeeklyStatsButtons(table);
        });
    }

    // ADDS MONTHLY TOTAL BUTTON TO TABLE HEADER
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
    }

    // ADDS WEEKLY TOTAL BUTTONS TO EACH TABLE ROW
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
    }

    // REFRESHES ALL STATS BUTTONS IF MANAGER IS INITIALIZED
    refresh() {
        if (this.initialized) {
            this.addStatsButtons();
        }
    }

    // DESTROYS THE MANAGER AND REMOVES ALL STATS BUTTONS AND OBSERVERS
    destroy() {
        this.initialized = false;
        
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        
        document.querySelectorAll('.monthly-stats-btn, .weekly-stats-btn').forEach(btn => {
            btn.remove();
        });
        
        document.querySelectorAll('table thead tr th[colspan="7"]').forEach(header => {
            const div = header.querySelector('div');
            if (div && div.querySelector('span')) {
                const monthText = div.querySelector('span').textContent;
                header.innerHTML = monthText;
            }
        });
        
        document.querySelectorAll('table tbody tr').forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 7) {
                const lastCell = cells[cells.length - 1];
                if (lastCell.querySelector('.weekly-stats-btn')) {
                    lastCell.remove();
                }
            }
        });
        
        document.removeEventListener('better42-color-changed', this.updateButtonColors);
        window.removeEventListener('storage', this.updateButtonColors);
    }
}

const logtimeStatsManager = new LogtimeStatsManager();
window.LogtimeStatsManager = logtimeStatsManager;

