class Better42App {
    constructor() {
        this.initialized = false;
    }
    earlyInit() {
        document.documentElement.style.visibility = 'hidden';
        Better42Utils.onDOMReady(() => {
            window.ProfileManager.earlyLoadDefaultProfile();
        });
    }
    init() {
        if (this.initialized) return;
        setTimeout(() => {
            window.ThemeManager.init();
            window.UIManager.createUI();
            this.initialized = true;
        }, 500);
    }
}
const better42App = new Better42App();
better42App.earlyInit();
window.addEventListener('load', () => {
    better42App.init();
});