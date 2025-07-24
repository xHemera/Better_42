console.log("Better 42 loaded");

window.addEventListener('load', function() {
    
    setTimeout(function() {

        const btn = document.createElement('button');
        btn.id = 'theme-switcher';
        btn.innerHTML = 'Worse';

        const settingsBtn = document.createElement('button');
        settingsBtn.id = 'settings-btn';
        settingsBtn.innerHTML = '⚙️';

        const settingsPopup = document.createElement('div');
        settingsPopup.id = 'settings-popup';
        settingsPopup.innerHTML = `
            <div class="popup-content">
                <h3>🎨 Better 42 Settings</h3>
                
                <div class="profile-section">
                    <h4>📁 Profile Manager</h4>
                    <div class="profile-controls">
                        <input type="text" id="profile-name-input" placeholder="Profile name..." maxlength="20" />
                        <button id="create-profile">➕ Create</button>
                    </div>
                    <select id="profile-selector">
                        <option value="">-- No Profile Selected --</option>
                    </select>
                    <div class="profile-buttons">
                        <button id="load-profile">📂 Load</button>
                        <button id="save-profile">💾 Save</button>
                        <button id="delete-profile">🗑️ Delete</button>
                    </div>
                </div>
                
                <div class="settings-section">
                    <h4>🖼️ Background (IMG/GIF/VIDEO)</h4>
                    <input type="text" id="bg-url-input" placeholder="URL: Image, GIF or YouTube video..." />
                    <div class="section-buttons">
                        <button id="apply-bg">Apply BG</button>
                        <button id="reset-bg">Reset BG</button>
                    </div>
                </div>
                
                <div class="settings-section">
                    <h4>👤 Profile Picture (IMG/GIF only)</h4>
                    <input type="text" id="pfp-url-input" placeholder="URL: Image or GIF only..." />
                    <div class="section-buttons">
                        <button id="apply-pfp">Apply PFP</button>
                        <button id="reset-pfp">Reset PFP</button>
                    </div>
                </div>
                
                <div class="popup-footer">
                    <button id="close-popup">✖️ Close</button>
                </div>
            </div>
        `;
        settingsPopup.classList.remove('show');

        let isDark = true;
        let currentProfile = null;
        
        function loadProfilesList() {
            const selector = document.getElementById('profile-selector');
            if (!selector) return;
            
            selector.innerHTML = '<option value="">-- No Profile Selected --</option>';
            
            const profiles = JSON.parse(localStorage.getItem('profiles-list') || '[]');
            profiles.forEach(profile => {
                const option = document.createElement('option');
                option.value = profile.id;
                option.textContent = `📁 ${profile.name}`;
                selector.appendChild(option);
            });
        }
        
        function createProfile() {
            const nameInput = document.getElementById('profile-name-input');
            if (!nameInput) return;
            
            const name = nameInput.value.trim();
            if (!name) {
                alert('❌ Enter a profile name!');
                return;
            }
            
            const profiles = JSON.parse(localStorage.getItem('profiles-list') || '[]');
            
            if (profiles.length >= 5) {
                alert('❌ Maximum 5 profiles allowed!');
                return;
            }
            
            if (profiles.some(p => p.name === name)) {
                alert('❌ Profile name already exists!');
                return;
            }
            
            const profileId = Date.now().toString();
            profiles.push({ id: profileId, name: name });
            localStorage.setItem('profiles-list', JSON.stringify(profiles));
            
            nameInput.value = '';
            loadProfilesList();
            alert(`✅ Profile "${name}" created!`);
        }
        
        function saveCurrentProfile() {
            const selector = document.getElementById('profile-selector');
            if (!selector || !selector.value) {
                alert('❌ Select a profile first!');
                return;
            }
            
            const bgInput = document.getElementById('bg-url-input');
            const pfpInput = document.getElementById('pfp-url-input');
            
            const profileData = {
                backgroundUrl: bgInput ? bgInput.value.trim() : '',
                profilePicUrl: pfpInput ? pfpInput.value.trim() : '',
                savedAt: new Date().toISOString()
            };
            
            localStorage.setItem(`profile-data-${selector.value}`, JSON.stringify(profileData));
            alert(`💾 Profile saved!`);
        }
        
        function loadProfile() {
            const selector = document.getElementById('profile-selector');
            if (!selector || !selector.value) {
                alert('❌ Select a profile first!');
                return;
            }
            
            const profileData = localStorage.getItem(`profile-data-${selector.value}`);
            if (!profileData) {
                alert('❌ Profile has no saved data!');
                return;
            }
            
            const data = JSON.parse(profileData);
            
            const bgInput = document.getElementById('bg-url-input');
            const pfpInput = document.getElementById('pfp-url-input');
            
            if (bgInput) bgInput.value = data.backgroundUrl || '';
            if (pfpInput) pfpInput.value = data.profilePicUrl || '';
            
            if (data.backgroundUrl) {
                applyCustomBackground(data.backgroundUrl);
            }
            if (data.profilePicUrl) {
                applyCustomPfp(data.profilePicUrl);
            }
            
            currentProfile = selector.value;
            alert(`📂 Profile loaded!`);
        }
        
        function deleteProfile() {
            const selector = document.getElementById('profile-selector');
            if (!selector || !selector.value) {
                alert('❌ Select a profile first!');
                return;
            }
            
            const profiles = JSON.parse(localStorage.getItem('profiles-list') || '[]');
            const profileName = profiles.find(p => p.id === selector.value)?.name || 'Unknown';
            
            if (!confirm(`🗑️ Delete profile "${profileName}"?`)) return;
            
            const newProfiles = profiles.filter(p => p.id !== selector.value);
            localStorage.setItem('profiles-list', JSON.stringify(newProfiles));
            
            localStorage.removeItem(`profile-data-${selector.value}`);
            
            loadProfilesList();
            
            if (currentProfile === selector.value) {
                const bgInput = document.getElementById('bg-url-input');
                const pfpInput = document.getElementById('pfp-url-input');
                if (bgInput) bgInput.value = '';
                if (pfpInput) pfpInput.value = '';
                currentProfile = null;
            }
            
            alert(`🗑️ Profile "${profileName}" deleted!`);
        }

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

        function applyCustomBackground(url) {
            if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
                const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
                if (videoId) {
                    const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0`;
                    
                    const bgElements = document.querySelectorAll('.w-full.xl\\:h-72.bg-center.bg-cover.bg-ft-black');
                    bgElements.forEach(el => {
                        const originalContent = el.innerHTML;
                        
                        el.innerHTML = `
                            <iframe src="${embedUrl}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;z-index:1;pointer-events:none;"></iframe>
                            <div style="position:relative;z-index:2;width:100%;height:100%;display:flex;flex-direction:column;justify-content:inherit;align-items:inherit;">${originalContent}</div>
                        `;
                        el.style.position = 'relative';
                        el.style.overflow = 'hidden';
                        el.style.backgroundImage = 'none';
                    });
                    return;
                }
            }
            
            const bgElements = document.querySelectorAll('.w-full.xl\\:h-72.bg-center.bg-cover.bg-ft-black');
            bgElements.forEach(el => {
                const contentDiv = el.querySelector('div[style*="z-index:2"]');
                if (contentDiv) {
                    el.innerHTML = contentDiv.innerHTML;
                }
                
                const style = el.getAttribute('style') || '';
                if (style.includes('background-image: url')) {
                    const newStyle = style.replace(/background-image: url\([^)]+\)/g, `background-image: url("${url}")`);
                    el.setAttribute('style', newStyle);
                } else {
                    el.setAttribute('style', style + ` background-image: url("${url}");`);
                }
            });
        }

        function applyCustomPfp(url) {
            const pfpElements = document.querySelectorAll('.w-52.h-52.text-black.md\\:w-40.md\\:h-40.lg\\:h-28.lg\\:w-28.bg-cover.bg-no-repeat.bg-center.rounded-full');
            pfpElements.forEach(el => {
                const style = el.getAttribute('style') || '';
                if (style.includes('background-image: url')) {
                    const newStyle = style.replace(/background-image: url\([^)]+\)/g, `background-image: url("${url}")`);
                    el.setAttribute('style', newStyle);
                } else {
                    el.setAttribute('style', style + ` background-image: url("${url}");`);
                }
            });
        }

        document.body.classList.add('dark-theme');
        updateLogtime();

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

        settingsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (settingsPopup.classList.contains('show')) {
                settingsPopup.classList.remove('show');
            } else {
                settingsPopup.classList.add('show');
                loadProfilesList();
            }
        });

        settingsPopup.addEventListener('click', function(e) {
            if (e.target === settingsPopup) {
                settingsPopup.classList.remove('show');
            }
        });

        document.addEventListener('click', function(e) {
            if (e.target.id === 'create-profile') {
                createProfile();
            } else if (e.target.id === 'load-profile') {
                loadProfile();
            } else if (e.target.id === 'save-profile') {
                saveCurrentProfile();
            } else if (e.target.id === 'delete-profile') {
                deleteProfile();
            
            } else if (e.target.id === 'apply-bg') {
                const bgInput = document.getElementById('bg-url-input');
                const url = bgInput ? bgInput.value.trim() : '';
                if (url) {
                    applyCustomBackground(url);
                }
            } else if (e.target.id === 'reset-bg') {
                const bgInput = document.getElementById('bg-url-input');
                if (bgInput) bgInput.value = '';
                location.reload();
            
            } else if (e.target.id === 'apply-pfp') {
                const pfpInput = document.getElementById('pfp-url-input');
                const url = pfpInput ? pfpInput.value.trim() : '';
                if (url) {
                    applyCustomPfp(url);
                }
            } else if (e.target.id === 'reset-pfp') {
                const pfpInput = document.getElementById('pfp-url-input');
                if (pfpInput) pfpInput.value = '';
                location.reload();
            
            } else if (e.target.id === 'close-popup') {
                settingsPopup.classList.remove('show');
            }
        });

        document.body.appendChild(btn);
        document.body.appendChild(settingsBtn);
        document.body.appendChild(settingsPopup);
        
        document.body.classList.add('page-loaded');
        
    }, 500);
    
});