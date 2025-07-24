// js/themes/config.js - Configuration centralisée des thèmes

const THEME_CONFIG = {
    // Clés de stockage
    STORAGE_KEYS: {
        CURRENT_THEME: 'better42-color-theme',
        CUSTOM_THEMES: 'better42-custom-themes'
    },

    // Thème par défaut
    DEFAULT_THEME: 'purple',

    // Définition des thèmes prédéfinis
    PREDEFINED_THEMES: {
        purple: {
            name: '🟣 Purple',
            category: 'predefined',
            colors: {
                primary: '#5c058f',
                primaryLight: '#7d1aaa',
                primaryLighter: '#9d2acc',
                primaryDark: '#430169',
                primaryDarker: '#2a0241',
                primaryAlpha: 'rgba(92, 5, 143, 0.3)',
                primaryAlphaLight: 'rgba(92, 5, 143, 0.1)'
            }
        },
        white: {
            name: '⚪ White',
            category: 'predefined',
            colors: {
                primary: '#e5e5e5',
                primaryLight: '#f0f0f0',
                primaryLighter: '#f8f8f8',
                primaryDark: '#d0d0d0',
                primaryDarker: '#b8b8b8',
                primaryAlpha: 'rgba(229, 229, 229, 0.3)',
                primaryAlphaLight: 'rgba(229, 229, 229, 0.1)'
            }
        },
        blue: {
            name: '🔵 Blue',
            category: 'predefined',
            colors: {
                primary: '#1e40af',
                primaryLight: '#3b82f6',
                primaryLighter: '#60a5fa',
                primaryDark: '#1e3a8a',
                primaryDarker: '#1d2f5a',
                primaryAlpha: 'rgba(30, 64, 175, 0.3)',
                primaryAlphaLight: 'rgba(30, 64, 175, 0.1)'
            }
        },
        pink: {
            name: '🩷 Pink',
            category: 'predefined',
            colors: {
                primary: '#be185d',
                primaryLight: '#ec4899',
                primaryLighter: '#f472b6',
                primaryDark: '#9d174d',
                primaryDarker: '#6b1138',
                primaryAlpha: 'rgba(190, 24, 93, 0.3)',
                primaryAlphaLight: 'rgba(190, 24, 93, 0.1)'
            }
        },
        green: {
            name: '🟢 Green',
            category: 'predefined',
            colors: {
                primary: '#059669',
                primaryLight: '#10b981',
                primaryLighter: '#34d399',
                primaryDark: '#047857',
                primaryDarker: '#064e3b',
                primaryAlpha: 'rgba(5, 150, 105, 0.3)',
                primaryAlphaLight: 'rgba(5, 150, 105, 0.1)'
            }
        },
        orange: {
            name: '🟠 Orange',
            category: 'predefined',
            colors: {
                primary: '#ea580c',
                primaryLight: '#f97316',
                primaryLighter: '#fb923c',
                primaryDark: '#c2410c',
                primaryDarker: '#9a2a08',
                primaryAlpha: 'rgba(234, 88, 12, 0.3)',
                primaryAlphaLight: 'rgba(234, 88, 12, 0.1)'
            }
        },
        red: {
            name: '🔴 Red',
            category: 'predefined',
            colors: {
                primary: '#dc2626',
                primaryLight: '#ef4444',
                primaryLighter: '#f87171',
                primaryDark: '#b91c1c',
                primaryDarker: '#991b1b',
                primaryAlpha: 'rgba(220, 38, 38, 0.3)',
                primaryAlphaLight: 'rgba(220, 38, 38, 0.1)'
            }
        },
        cyan: {
            name: '🔵 Cyan',
            category: 'predefined',
            colors: {
                primary: '#0891b2',
                primaryLight: '#06b6d4',
                primaryLighter: '#22d3ee',
                primaryDark: '#0e7490',
                primaryDarker: '#155e75',
                primaryAlpha: 'rgba(8, 145, 178, 0.3)',
                primaryAlphaLight: 'rgba(8, 145, 178, 0.1)'
            }
        }
    },

    // Utilitaires pour les couleurs
    COLOR_UTILS: {
        hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },

        rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        },

        lighten(hex, percent) {
            const rgb = this.hexToRgb(hex);
            if (!rgb) return hex;
            
            const factor = 1 + percent / 100;
            return this.rgbToHex(
                Math.min(255, Math.round(rgb.r * factor)),
                Math.min(255, Math.round(rgb.g * factor)),
                Math.min(255, Math.round(rgb.b * factor))
            );
        },

        darken(hex, percent) {
            const rgb = this.hexToRgb(hex);
            if (!rgb) return hex;
            
            const factor = 1 - percent / 100;
            return this.rgbToHex(
                Math.max(0, Math.round(rgb.r * factor)),
                Math.max(0, Math.round(rgb.g * factor)),
                Math.max(0, Math.round(rgb.b * factor))
            );
        },

        generateAlpha(hex, opacity) {
            const rgb = this.hexToRgb(hex);
            if (!rgb) return `rgba(0, 0, 0, ${opacity})`;
            return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
        },

        generateThemeFromBase(baseColor, name, emoji) {
            const utils = THEME_CONFIG.COLOR_UTILS;
            return {
                name: `${emoji} ${name}`,
                category: 'custom',
                colors: {
                    primary: baseColor,
                    primaryLight: utils.lighten(baseColor, 20),
                    primaryLighter: utils.lighten(baseColor, 40),
                    primaryDark: utils.darken(baseColor, 20),
                    primaryDarker: utils.darken(baseColor, 40),
                    primaryAlpha: utils.generateAlpha(baseColor, 0.3),
                    primaryAlphaLight: utils.generateAlpha(baseColor, 0.1)
                }
            };
        }
    }
};

window.THEME_CONFIG = THEME_CONFIG;