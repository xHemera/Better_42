console.log("Better 42 loaded");

window.addEventListener('load', function() {
    
    // Créer bouton
    const btn = document.createElement('button');
    btn.id = 'theme-switcher';
    btn.innerHTML = 'Dark';
    
    let isDark = false;
    
    // Clic = toggle
    btn.addEventListener('click', function() {
        if (isDark) {
            document.body.classList.remove('dark-theme');
            btn.innerHTML = 'Dark';
            isDark = false;
        } else {
            document.body.classList.add('dark-theme');
            btn.innerHTML = 'Light';
            isDark = true;
        }
    });
    
    // Ajouter à la page
    document.body.appendChild(btn);
});