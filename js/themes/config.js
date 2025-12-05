
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
        },
        // Catppuccin Themes
        catppuccinMocha: {
            name: '🌙 Catppuccin Mocha',
            category: 'predefined',
            colors: {
                primary: '#cba6f7',
                primaryLight: '#d4bbfc',
                primaryLighter: '#e5d5ff',
                primaryDark: '#b491e8',
                primaryDarker: '#9b7dd4',
                primaryAlpha: 'rgba(203, 166, 247, 0.3)',
                primaryAlphaLight: 'rgba(203, 166, 247, 0.1)'
            }
        },
        catppuccinLatte: {
            name: '☕ Catppuccin Latte',
            category: 'predefined',
            colors: {
                primary: '#8839ef',
                primaryLight: '#9d5eff',
                primaryLighter: '#b37fff',
                primaryDark: '#7627d6',
                primaryDarker: '#6420b8',
                primaryAlpha: 'rgba(136, 57, 239, 0.3)',
                primaryAlphaLight: 'rgba(136, 57, 239, 0.1)'
            }
        },
        catppuccinFrappe: {
            name: '🥤 Catppuccin Frappé',
            category: 'predefined',
            colors: {
                primary: '#ca9ee6',
                primaryLight: '#d5adef',
                primaryLighter: '#e0c2f7',
                primaryDark: '#b88fd9',
                primaryDarker: '#a680cc',
                primaryAlpha: 'rgba(202, 158, 230, 0.3)',
                primaryAlphaLight: 'rgba(202, 158, 230, 0.1)'
            }
        },
        catppuccinMacchiato: {
            name: '🍵 Catppuccin Macchiato',
            category: 'predefined',
            colors: {
                primary: '#c6a0f6',
                primaryLight: '#d2b1f9',
                primaryLighter: '#ddc3fc',
                primaryDark: '#b38fe8',
                primaryDarker: '#a07ed9',
                primaryAlpha: 'rgba(198, 160, 246, 0.3)',
                primaryAlphaLight: 'rgba(198, 160, 246, 0.1)'
            }
        },
        // Tokyo Night Theme
        tokyoNight: {
            name: '🌃 Tokyo Night',
            category: 'predefined',
            colors: {
                primary: '#7aa2f7',
                primaryLight: '#89b4fa',
                primaryLighter: '#a5c6fc',
                primaryDark: '#6890e8',
                primaryDarker: '#5680d9',
                primaryAlpha: 'rgba(122, 162, 247, 0.3)',
                primaryAlphaLight: 'rgba(122, 162, 247, 0.1)'
            }
        },
        // Dracula Theme
        dracula: {
            name: '🧛 Dracula',
            category: 'predefined',
            colors: {
                primary: '#bd93f9',
                primaryLight: '#caa7fc',
                primaryLighter: '#d7bbff',
                primaryDark: '#aa7fe6',
                primaryDarker: '#976bd3',
                primaryAlpha: 'rgba(189, 147, 249, 0.3)',
                primaryAlphaLight: 'rgba(189, 147, 249, 0.1)'
            }
        },
        // Nord Theme
        nord: {
            name: '❄️ Nord',
            category: 'predefined',
            colors: {
                primary: '#88c0d0',
                primaryLight: '#9fced9',
                primaryLighter: '#b6dce2',
                primaryDark: '#71b2c1',
                primaryDarker: '#5ea4b2',
                primaryAlpha: 'rgba(136, 192, 208, 0.3)',
                primaryAlphaLight: 'rgba(136, 192, 208, 0.1)'
            }
        },
        // Gruvbox Theme
        gruvbox: {
            name: '🟤 Gruvbox',
            category: 'predefined',
            colors: {
                primary: '#d79921',
                primaryLight: '#fabd2f',
                primaryLighter: '#fdd872',
                primaryDark: '#b57614',
                primaryDarker: '#8f5902',
                primaryAlpha: 'rgba(215, 153, 33, 0.3)',
                primaryAlphaLight: 'rgba(215, 153, 33, 0.1)'
            }
        },
        // One Dark Theme
        oneDark: {
            name: '🌑 One Dark',
            category: 'predefined',
            colors: {
                primary: '#61afef',
                primaryLight: '#7bc1f2',
                primaryLighter: '#95d3f5',
                primaryDark: '#4f9ddc',
                primaryDarker: '#3d8bc9',
                primaryAlpha: 'rgba(97, 175, 239, 0.3)',
                primaryAlphaLight: 'rgba(97, 175, 239, 0.1)'
            }
        },
        // Solarized Dark Theme
        solarizedDark: {
            name: '🌅 Solarized Dark',
            category: 'predefined',
            colors: {
                primary: '#268bd2',
                primaryLight: '#4ba0db',
                primaryLighter: '#70b5e4',
                primaryDark: '#1f76c9',
                primaryDarker: '#1861b0',
                primaryAlpha: 'rgba(38, 139, 210, 0.3)',
                primaryAlphaLight: 'rgba(38, 139, 210, 0.1)'
            }
        },
        // Material Theme
        material: {
            name: '💎 Material',
            category: 'predefined',
            colors: {
                primary: '#82aaff',
                primaryLight: '#96bbff',
                primaryLighter: '#aaccff',
                primaryDark: '#6e99f6',
                primaryDarker: '#5a88ed',
                primaryAlpha: 'rgba(130, 170, 255, 0.3)',
                primaryAlphaLight: 'rgba(130, 170, 255, 0.1)'
            }
        },
        // Monokai Theme
        monokai: {
            name: '🎨 Monokai',
            category: 'predefined',
            colors: {
                primary: '#f92672',
                primaryLight: '#ff4081',
                primaryLighter: '#ff6699',
                primaryDark: '#e61563',
                primaryDarker: '#d30554',
                primaryAlpha: 'rgba(249, 38, 114, 0.3)',
                primaryAlphaLight: 'rgba(249, 38, 114, 0.1)'
            }
        },
        // Ayu Theme
        ayu: {
            name: '🌊 Ayu',
            category: 'predefined',
            colors: {
                primary: '#59c2ff',
                primaryLight: '#73ccff',
                primaryLighter: '#8dd6ff',
                primaryDark: '#47b8f6',
                primaryDarker: '#35aeed',
                primaryAlpha: 'rgba(89, 194, 255, 0.3)',
                primaryAlphaLight: 'rgba(89, 194, 255, 0.1)'
            }
        },
        // Synthwave Theme
        synthwave: {
            name: '🌆 Synthwave',
            category: 'predefined',
            colors: {
                primary: '#ff7edb',
                primaryLight: '#ff9de5',
                primaryLighter: '#ffbcef',
                primaryDark: '#f65fd1',
                primaryDarker: '#ed40c7',
                primaryAlpha: 'rgba(255, 126, 219, 0.3)',
                primaryAlphaLight: 'rgba(255, 126, 219, 0.1)'
            }
        },
        // GitHub Dark Theme
        githubDark: {
            name: '🐙 GitHub Dark',
            category: 'predefined',
            colors: {
                primary: '#58a6ff',
                primaryLight: '#79b8ff',
                primaryLighter: '#9acaff',
                primaryDark: '#3694f6',
                primaryDarker: '#1482ed',
                primaryAlpha: 'rgba(88, 166, 255, 0.3)',
                primaryAlphaLight: 'rgba(88, 166, 255, 0.1)'
            }
        }
    },

    // Utilitaires pour les couleurs
    COLOR_UTILS: {
        // CONVERTS HEX COLOR TO RGB OBJECT
        hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },

        // CONVERTS RGB VALUES TO HEX COLOR STRING
        rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        },

        // LIGHTENS HEX COLOR BY SPECIFIED PERCENTAGE
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

        // DARKENS HEX COLOR BY SPECIFIED PERCENTAGE
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

        // GENERATES RGBA COLOR STRING FROM HEX WITH OPACITY
        generateAlpha(hex, opacity) {
            const rgb = this.hexToRgb(hex);
            if (!rgb) return `rgba(0, 0, 0, ${opacity})`;
            return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
        },

        // GENERATES COMPLETE THEME OBJECT FROM BASE COLOR
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
