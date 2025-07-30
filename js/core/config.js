console.log("Better 42 loaded");

// MAIN CONFIGURATION OBJECT FOR BETTER42
const BETTER42_CONFIG = {
    SELECTORS: {
        BACKGROUND: '.w-full.xl\\:h-72.bg-center.bg-cover.bg-ft-black, .w-full.xl\\:h-72.bg-center.bg-cover',
        PROFILE_PIC: '.w-52.h-52.text-black.md\\:w-40.md\\:h-40.lg\\:h-28.lg\\:w-28.bg-cover.bg-no-repeat.bg-center.rounded-full',
        LOGTIME_ELEMENTS: '[style*="rgba(0, 186, 188,"]',
        LOGTIME_PURPLE: '[style*="rgba(92, 5, 143,"]'
    },
    COLORS: {
        PURPLE: 'rgba(92, 5, 143,',
        TEAL: 'rgba(0, 186, 188,'
    },
    STORAGE_KEYS: {
        DEFAULT_PROFILE: 'default-profile-id',
        PROFILES_LIST: 'profiles-list',
        PROFILE_DATA_PREFIX: 'profile-data-',
        FORCE_WORSE_MODE: 'better42-force-worse-mode',
        USER_MODE_PREFERENCE: 'better42-user-mode-preference'
    }
};

// UTILITY FUNCTIONS FOR BETTER42
const Better42Utils = {
    // CHECK IF URL IS A YOUTUBE VIDEO
    isYouTubeVideo(url) {
        return url.includes('youtube.com/watch') || url.includes('youtu.be/');
    },

    // EXTRACT YOUTUBE VIDEO ID FROM URL
    extractYouTubeId(url) {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        return match?.[1];
    },

    // GENERATE YOUTUBE EMBED URL FOR BACKGROUND
    generateYouTubeEmbedUrl(videoId) {
        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0`;
    },

    // EXECUTE CALLBACK WHEN DOM IS READY
    onDOMReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    },

    // INJECT CSS STYLES INTO DOCUMENT HEAD
    injectStyles(css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }
};

window.Better42Config = BETTER42_CONFIG;
window.Better42Utils = Better42Utils;