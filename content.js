console.log("🚀 Better 42 loaded:", window.location.href);

window.addEventListener('load', function() {
    
    const themeSwitcher = document.createElement('button');
    themeSwitcher.id = 'theme-switcher';
    themeSwitcher.innerHTML = '🌙 Dark';
    let currentTheme = localStorage.getItem('intra42-theme') || 'light';
    document.body.classList.add(currentTheme + '-theme');

    function updateButtonText() {
        if (currentTheme === 'light') {
            themeSwitcher.innerHTML = '🌙 Dark';
        } else {
            themeSwitcher.innerHTML = '☀️ Light';
        }
    }
    
    updateButtonText();
    
    themeSwitcher.addEventListener('click', function() {
        if (currentTheme === 'light') {
            currentTheme = 'dark';
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
        } else {
            currentTheme = 'light';
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
        }
        
        localStorage.setItem('intra42-theme', currentTheme);
        updateButtonText();
        console.log("Theme changed to:", currentTheme);
    });
    document.body.appendChild(themeSwitcher);
    console.log("✅ Theme switcher button added successfully!");
});