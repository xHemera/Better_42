
class ThemeCSSGenerator {
    constructor() {
        this.styleElementId = 'dynamic-color-theme';
    }

    generateThemeCSS(themeColors) {
        return `
            ${this.generateCSSVariables(themeColors)}
            ${this.generateButtonStyles(themeColors)}
            ${this.generateEventStyles(themeColors)}
            ${this.generateUserStatsStyles(themeColors)}
            ${this.generateTopbarStyles(themeColors)}
            ${this.generatePopupStyles(themeColors)}
            ${this.generateMiscStyles(themeColors)}
        `;
    }

    generateCSSVariables(colors) {
        return `
            :root {
                --better42-purple: ${colors.primary} !important;
                --better42-purple-light: ${colors.primaryLight} !important;
                --better42-purple-lighter: ${colors.primaryLighter} !important;
                --better42-purple-dark: ${colors.primaryDark} !important;
                --better42-purple-darker: ${colors.primaryDarker} !important;
                --better42-purple-alpha: ${colors.primaryAlpha} !important;
                --better42-purple-alpha-light: ${colors.primaryAlphaLight} !important;
            }
        `;
    }

    generateButtonStyles(colors) {
        return `
            /* ===== BOUTONS ===== */
            body.dark-theme .text-center.text-legacy-main.bg-transparent.border.border-legacy-main.py-1\\.5.px-2.cursor-pointer.text-xs.uppercase,
            body.dark-theme .text-center.text-legacy-main.bg-transparent.border.border-legacy-main.py-1\\.5.px-1.cursor-pointer.text-xs.uppercase {
                color: ${colors.primary} !important;
                border-color: ${colors.primary} !important;
            }

            body.dark-theme .block.px-2\\.5.py-2.font-medium.hover\\:text-teal-700.text-legacy-main {
                color: ${colors.primary} !important;
            }

            body.dark-theme .text-legacy-main.hover\\:underline {
                color: ${colors.primary} !important;
            }

            body.dark-theme .cursor-pointer.text-xs.uppercase.font-bold.hover\\:text-legacy-main.text-legacy-main {
                color: ${colors.primary} !important;
            }

            body.dark-theme .font-bold.text-legacy-main {
                color: ${colors.primary} !important;
            }

            /* Boutons de l'interface */
            body.dark-theme #theme-switcher {
                background: linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight}) !important;
                box-shadow: 0 4px 12px ${colors.primaryAlpha} !important;
            }

            body.dark-theme #theme-switcher:hover {
                background: linear-gradient(135deg, ${colors.primaryLight}, ${colors.primaryLighter}) !important;
                box-shadow: 0 6px 20px ${colors.primaryAlpha} !important;
            }

            body.dark-theme #settings-btn {
                background: linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight}) !important;
                box-shadow: 0 4px 12px ${colors.primaryAlpha} !important;
            }

            body.dark-theme #settings-btn:hover {
                background: linear-gradient(135deg, ${colors.primaryLight}, ${colors.primaryLighter}) !important;
                box-shadow: 0 6px 20px ${colors.primaryAlpha} !important;
            }
        `;
    }

    generateEventStyles(colors) {
        return `
            /* ===== ÉVÉNEMENTS ===== */
            body.dark-theme [style*="background-color: rgb(162, 179, 229)"] {
                background-color: ${colors.primaryAlpha.replace('0.3', '0.5')} !important;
            }

            body.dark-theme .inline-block.text-xl.pr-4[style*="color: rgb(162, 179, 229)"] {
                color: ${colors.primary} !important;
            }
        `;
    }

    generateUserStatsStyles(colors) {
        return `
            /* ===== STATS UTILISATEUR ===== */
            body.dark-theme .dropdown .flex.flex-row.items-center.text-stone-500 {
                background-color: ${colors.primary} !important;
            }

            body.dark-theme .fill-legacy-main {
                fill: ${colors.primary} !important;
            }

            body.dark-theme svg[stroke="hsl(var(--legacy-main))"] {
                stroke: ${colors.primary} !important;
            }

            body.dark-theme .stroke-legacy-main {
                stroke: ${colors.primary} !important;
            }

            /* ALL MILESTONE - muted plus foncé car pas validé */
            body.dark-theme .h-10.rounded.flex.items-center.cursor-pointer.bg-legacy-main-muted {
                background-color: ${colors.primaryDarker} !important;
            }

            body.dark-theme .h-10.rounded.flex.items-center.cursor-pointer.bg-legacy-main {
                background-color: ${colors.primary} !important;
            }

            /* Points et barres de progression */
            body.dark-theme .rounded-full.mr-0.h-3.w-3.bg-red-500 {
                background-color: ${colors.primary} !important;
            }

            body.dark-theme .w-\\[2px\\].mr-0.h-full.bg-red-500 {
                background-color: ${colors.primaryDark} !important;
            }

            body.dark-theme .mx-2\\.5.w-8.rounded-3xl.h-full.bg-legacy-main-muted.cursor-pointer,
            body.dark-theme .mx-2\\.5.w-8.rounded-3xl.h-full.bg-legacy-main-muted.cursor-pointer:hover {
                background-color: ${colors.primary} !important;
            }

            body.dark-theme [style*="color: rgb(181, 22, 63);"] {
                color: ${colors.primary} !important;
            }

            body.dark-theme .h-full.w-full.flex-1.transition.duration-1000.ease-out {
                background-color: ${colors.primary} !important;
            }
        `;
    }

    generateTopbarStyles(colors) {
        return `
            /* ===== BARRE SUPÉRIEURE ===== */
            body.dark-theme .hover\\:text-legacy-main:hover {
                color: ${colors.primary} !important;
            }

            body.dark-theme .hover\\:fill-legacy-main:hover {
                fill: ${colors.primary} !important;
            }

            body.dark-theme .hover\\:stroke-legacy-main:hover {
                stroke: ${colors.primary} !important;
            }

            body.dark-theme .w-52.h-52.text-black.md\\:w-40.md\\:h-40.lg\\:h-28.lg\\:w-28.bg-cover.bg-no-repeat.bg-center.rounded-full.bg-gray-300.border-2.shadow-base {
                border-color: ${colors.primary} !important;
            }

            body.dark-theme .py-5.w-full.flex.justify-center.hover\\:opacity-100.opacity-40:hover svg {
                stroke: ${colors.primary} !important;
            }

            body.dark-theme .py-5.w-full.flex.justify-center.hover\\:opacity-100.opacity-40:hover svg path {
                stroke: ${colors.primary} !important;
            }

            /* SVG de recherche */
            body.dark-theme svg[stroke="#000"] {
                stroke: ${colors.primary} !important;
            }
        `;
    }

    generatePopupStyles(colors) {
        return `
            /* ===== POPUP PARAMÈTRES ===== */
            body.dark-theme .profile-section {
                background: ${colors.primaryAlphaLight} !important;
                border: 2px solid ${colors.primaryAlpha} !important;
            }

            body.dark-theme .profile-section:hover {
                background: ${colors.primaryAlpha} !important;
                border-color: ${colors.primary}50 !important;
            }

            body.dark-theme #profile-selector {
                border: 2px solid ${colors.primary} !important;
            }

            body.dark-theme #profile-selector:focus {
                border-color: ${colors.primaryLight} !important;
                box-shadow: 0 0 0 3px ${colors.primaryAlpha} !important;
            }

            body.dark-theme .profile-controls button,
            body.dark-theme #save-profile {
                background: linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight}) !important;
            }

            body.dark-theme #apply-bg {
                background: linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight}) !important;
            }

            body.dark-theme #bg-url-input:focus,
            body.dark-theme #pfp-url-input:focus,
            body.dark-theme #profile-name-input:focus {
                border-color: ${colors.primary} !important;
                box-shadow: 0 0 0 3px ${colors.primaryAlpha} !important;
            }
        `;
    }

    generateMiscStyles(colors) {
        return `
            /* ===== DIVERS ===== */
            body.dark-theme .hover\\:text-emerald-500:hover {
                color: ${colors.primary} !important;
            }

            body.dark-theme .hover\\:text-emerald-500:hover a {
                color: ${colors.primary} !important;
            }
        `;
    }

    applyCSSToDOM(css) {
        const oldStyleElement = document.getElementById(this.styleElementId);
        if (oldStyleElement) {
            oldStyleElement.remove();
        }

        const styleElement = document.createElement('style');
        styleElement.id = this.styleElementId;
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
    }

    removeThemeCSS() {
        const styleElement = document.getElementById(this.styleElementId);
        if (styleElement) {
            styleElement.remove();
        }
    }
}

window.ThemeCSSGenerator = new ThemeCSSGenerator();