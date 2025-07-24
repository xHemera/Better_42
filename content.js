console.log("Better 42 loaded");

window.addEventListener('load', function() {

    // Créer bouton principal
    const btn = document.createElement('button');
    btn.id = 'theme-switcher';
    btn.innerHTML = 'Worse';

    // Créer bouton engrenage
    const settingsBtn = document.createElement('button');
    settingsBtn.id = 'settings-btn';
    settingsBtn.innerHTML = '⚙️';

    // Créer popup settings
    const settingsPopup = document.createElement('div');
    settingsPopup.id = 'settings-popup';
    settingsPopup.innerHTML = `
        <div class="popup-content">
            <h3>Background Settings</h3>
            <input type="text" id="bg-url-input" placeholder="Enter image URL..." />
            <div class="popup-buttons">
                <button id="apply-bg">Apply</button>
                <button id="reset-bg">Reset</button>
                <button id="close-popup">Close</button>
            </div>
        </div>
    `;
    settingsPopup.style.display = 'none';

    let isDark = true;
    let customBgUrl = localStorage.getItem('custom-bg-url') || '';

    // TES FONCTIONS LOGTIME (corrigées)
    function updateLogtime() {
        const elements = document.querySelectorAll('[style*="rgba(0, 186, 188,"]');
        
        elements.forEach(el => {
            const style = el.getAttribute('style');
            const match = style.match(/rgba\(0, 186, 188, ([\d\.]+)\)/);
            if (match) {
                const opacity = match[1];
                const newStyle = style.replace(/rgba\(0, 186, 188, [\d\.]+\)/, 'rgba(92, 5, 143, ' + opacity + ')');
                el.setAttribute('style', newStyle);
            }
        });
    }

    function restoreLogtime() {
        const elements = document.querySelectorAll('[style*="rgba(92, 5, 143,"]');
        
        elements.forEach(el => {
            const style = el.getAttribute('style');
            const match = style.match(/rgba\(92, 5, 143, ([\d\.]+)\)/);
            if (match) {
                const opacity = match[1];
                const newStyle = style.replace(/rgba\(92, 5, 143, [\d\.]+\)/, 'rgba(0, 186, 188, ' + opacity + ')');
                el.setAttribute('style', newStyle);
            }
        });
    }

    // Fonction pour appliquer un background personnalisé
    function applyCustomBackground(url) {
        const bgElements = document.querySelectorAll('[style*="background-image: url"]');
        bgElements.forEach(el => {
            const style = el.getAttribute('style');
            if (style.includes('background-image: url')) {
                const newStyle = style.replace(/background-image: url\([^)]+\)/g, `background-image: url("${url}")`);
                el.setAttribute('style', newStyle);
            }
        });
    }

    // MAINTENANT appliquer le background personnalisé au chargement
    if (customBgUrl) {
        applyCustomBackground(customBgUrl);
    }

    // Dark par défaut
    document.body.classList.add('dark-theme');
    updateLogtime();

    // Event listener principal
    btn.addEventListener('click', function() {
        if (isDark) {
            document.body.classList.remove('dark-theme');
            btn.innerHTML = 'Better';
            isDark = false;
            restoreLogtime();
        } else {
            document.body.classList.add('dark-theme');
            btn.innerHTML = 'Worse';
            isDark = true;
            updateLogtime();
        }
    });

    // Event listener bouton engrenage
    settingsBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (settingsPopup.style.display === 'none' || settingsPopup.style.display === '') {
            settingsPopup.style.display = 'block';
            document.getElementById('bg-url-input').value = customBgUrl;
        } else {
            settingsPopup.style.display = 'none';
        }
    });

    // Fermer popup en cliquant sur le fond noir
    settingsPopup.addEventListener('click', function(e) {
        if (e.target === settingsPopup) {
            settingsPopup.style.display = 'none';
        }
    });

    // Event listeners popup
    document.addEventListener('click', function(e) {
        if (e.target.id === 'apply-bg') {
            const url = document.getElementById('bg-url-input').value.trim();
            if (url) {
                customBgUrl = url;
                localStorage.setItem('custom-bg-url', url);
                applyCustomBackground(url);
                settingsPopup.style.display = 'none';
                console.log('Background applied:', url);
            }
        } else if (e.target.id === 'reset-bg') {
            customBgUrl = '';
            localStorage.removeItem('custom-bg-url');
            settingsPopup.style.display = 'none';
            location.reload();
        } else if (e.target.id === 'close-popup') {
            settingsPopup.style.display = 'none';
        }
    });

    // Ajouter à la page
    document.body.appendChild(btn);
    document.body.appendChild(settingsBtn);
    document.body.appendChild(settingsPopup);

});