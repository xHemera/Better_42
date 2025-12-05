# 📚 Documentation - Better 42 Extension

Bienvenue dans la documentation complète de Better 42 !

---

## 📖 Index de la Documentation

### 🚀 Pour Commencer
- **[README.md](README.md)** - Introduction et installation
  - Installation Firefox et Chrome
  - Commandes de compilation
  - Vue d'ensemble des fonctionnalités

### 🎨 Système de Thèmes
- **[THEMES_GUIDE.md](THEMES_GUIDE.md)** - Guide complet des thèmes
  - Comment créer un thème personnalisé
  - Exporter/Importer des thèmes
  - Structure technique d'un thème
  - Conseils de design

- **[THEMES_GALLERY.md](THEMES_GALLERY.md)** - Gallery visuelle
  - Aperçu de tous les 23 thèmes
  - Palettes de couleurs détaillées
  - Suggestions d'utilisation
  - Comparaison des thèmes

### 📝 Historique
- **[CHANGELOG.md](CHANGELOG.md)** - Historique des versions
  - Nouveaux thèmes ajoutés
  - Améliorations du mode sombre
  - Organisation des fichiers compilés
  - Notes de version

---

## 🎯 Liens Rapides

### Pour les Utilisateurs

**Je veux installer l'extension**
→ [README.md - Installation](README.md#-installation)

**Je veux voir tous les thèmes disponibles**
→ [THEMES_GALLERY.md](THEMES_GALLERY.md)

**Je veux créer mon propre thème**
→ [THEMES_GUIDE.md - Créer un Thème](THEMES_GUIDE.md#-créer-un-thème-personnalisé)

**Je veux partager mes thèmes**
→ [THEMES_GUIDE.md - Exporter/Importer](THEMES_GUIDE.md#-exporterimporter-des-thèmes)

### Pour les Développeurs

**Je veux compiler l'extension**
→ [README.md - Compilation](README.md#-compilation-rapide)

**Je veux comprendre la structure du code**
→ [README.md - Développement](README.md#-développement)

**Je veux contribuer**
→ Voir section "Contribuer" ci-dessous

**Je veux voir les dernières mises à jour**
→ [CHANGELOG.md](CHANGELOG.md)

---

## 🎨 Thèmes Disponibles (23 au total)

### Thèmes de Base (8)
🟣 Purple | ⚪ White | 🔵 Blue | 🩷 Pink | 🟢 Green | 🟠 Orange | 🔴 Red | 🔵 Cyan

### Collection Catppuccin (4)
🌙 Mocha | ☕ Latte | 🥤 Frappé | 🍵 Macchiato

### Thèmes Populaires (11)
🌃 Tokyo Night | 🧛 Dracula | ❄️ Nord | 🟤 Gruvbox | 🌑 One Dark
🌅 Solarized | 💎 Material | 🎨 Monokai | 🌊 Ayu | 🌆 Synthwave | 🐙 GitHub

### Thèmes Personnalisés
✨ **Illimités** - Créez autant de thèmes que vous voulez !

→ [Voir la gallery complète](THEMES_GALLERY.md)

---

## 🛠️ Structure du Projet

```
Better_42/
├── 📄 README.md              # Documentation principale
├── 📄 CHANGELOG.md           # Historique des versions
├── 📄 THEMES_GUIDE.md        # Guide des thèmes
├── 📄 THEMES_GALLERY.md      # Gallery visuelle
├── 📄 DOCUMENTATION.md       # Ce fichier
│
├── manifest.json             # Manifest V2 (Firefox)
├── manifest-v3.json          # Manifest V3 (Chrome)
├── main.js                   # Point d'entrée
├── Makefile                  # Automatisation de build
├── build.sh                  # Script de compilation
│
├── assets/
│   └── css/
│       ├── buttons.css       # Styles des boutons
│       ├── events.css        # Styles des événements
│       ├── popup.css         # Styles des popups
│       ├── scrollbar.css     # Styles du scrollbar
│       ├── settingsSections.css  # Styles des paramètres
│       ├── text.css          # Styles du texte
│       ├── theme.css         # Styles du thème principal
│       ├── topbar.css        # Styles de la barre du haut
│       ├── uiControls.css    # Styles des contrôles UI
│       ├── userStats.css     # Styles des statistiques
│       ├── variables.css     # Variables CSS globales
│       └── domains/
│           ├── companies.css
│           ├── elearning.css
│           ├── meta.css
│           ├── project.css
│           └── shop.css
│
└── js/
    ├── core/
    │   └── config.js         # Configuration globale
    ├── detection/
    │   ├── pageDetector.js   # Détection de pages
    │   ├── profileDetector.js
    │   └── urlHelper.js
    ├── managers/
    │   ├── backgroundManager.js
    │   ├── clusterMapManager.js
    │   ├── colorThemeManager.js  # Gestionnaire de thèmes
    │   ├── logtimeStatsManager.js
    │   ├── profileManager.js
    │   ├── sectionStyleManager.js
    │   ├── themeManager.js
    │   └── timeRemainingManager.js
    ├── sync/
    │   └── themeSyncAPI.js
    ├── themes/
    │   ├── config.js         # Configuration des thèmes
    │   ├── generator.js      # Générateur CSS
    │   ├── manager.js        # Gestionnaire principal
    │   ├── storage.js        # Stockage des thèmes
    │   └── ui.js             # Interface utilisateur
    └── ui/
        └── uiManager.js
```

---

## 🚀 Installation Rapide

### Firefox
```bash
make firefox
```
Puis ouvrez `about:debugging#/runtime/this-firefox` et chargez `build/better42-firefox/manifest.json`

### Chrome/Edge/Brave
```bash
make chrome
```
Puis ouvrez `chrome://extensions/`, activez le mode développeur et chargez `build/better42-chrome/`

---

## 📦 Compilation

### Commandes disponibles
```bash
make              # Afficher l'aide
make firefox      # Compiler pour Firefox
make chrome       # Compiler pour Chrome/Edge/Brave
make both         # Compiler les deux versions
make clean        # Nettoyer les fichiers de build
```

### Structure des builds
```
build/
├── better42-firefox/
│   ├── manifest.json
│   ├── main.js
│   ├── assets/
│   └── js/
├── better42-chrome/
│   ├── manifest.json
│   ├── main.js
│   ├── assets/
│   └── js/
├── better42-firefox.zip
└── better42-chrome.zip
```

---

## 🎨 Système de Thèmes

### Architecture

1. **Configuration** (`js/themes/config.js`)
   - Définition de tous les thèmes prédéfinis
   - Utilitaires de manipulation de couleurs

2. **Stockage** (`js/themes/storage.js`)
   - Gestion du localStorage
   - CRUD des thèmes personnalisés

3. **Générateur** (`js/themes/generator.js`)
   - Génération du CSS à partir des couleurs
   - Application des styles dans le DOM

4. **Manager** (`js/themes/manager.js`)
   - Coordination de tous les modules
   - Application des thèmes

5. **UI** (`js/themes/ui.js`)
   - Interface utilisateur
   - Gestion des événements

### Flux de Données

```
User Action
    ↓
ThemeUI (js/themes/ui.js)
    ↓
ColorThemeManager (js/themes/manager.js)
    ↓
ThemeCSSGenerator (js/themes/generator.js)
    ↓
Apply to DOM
    ↓
ThemeStorage (js/themes/storage.js)
    ↓
localStorage
```

---

## 🤝 Contribuer

### Ajouter un Nouveau Thème Prédéfini

1. Ouvrez `js/themes/config.js`
2. Ajoutez votre thème dans `PREDEFINED_THEMES` :

```javascript
myTheme: {
    name: '🎨 Mon Thème',
    category: 'predefined',
    colors: {
        primary: '#hexcolor',
        primaryLight: '#hexcolor',
        primaryLighter: '#hexcolor',
        primaryDark: '#hexcolor',
        primaryDarker: '#hexcolor',
        primaryAlpha: 'rgba(..., 0.3)',
        primaryAlphaLight: 'rgba(..., 0.1)'
    }
}
```

3. Testez avec `make both`
4. Créez une Pull Request

### Rapporter un Bug

1. Ouvrez une issue sur GitHub
2. Décrivez le problème
3. Ajoutez des captures d'écran si possible
4. Indiquez votre navigateur et OS

### Proposer une Fonctionnalité

1. Ouvrez une issue avec le tag `enhancement`
2. Décrivez la fonctionnalité souhaitée
3. Expliquez le cas d'usage
4. Discutez avec la communauté

---

## 📊 Statistiques du Projet

- **Thèmes prédéfinis :** 20
- **Lignes de code CSS :** ~2000+
- **Lignes de code JavaScript :** ~3000+
- **Fichiers CSS :** 16
- **Fichiers JS :** 20
- **Domaines supportés :** 5 (profile, meta, companies, elearning, projects)

---

## 🐛 Dépannage

### Le thème ne s'applique pas
1. Vérifiez que le mode sombre est activé (bouton "Better")
2. Rechargez la page (F5)
3. Vérifiez la console pour des erreurs (F12)
4. Essayez un autre thème pour isoler le problème

### Les couleurs sont incorrectes
1. Vérifiez que vous avez la dernière version
2. Effacez le cache du navigateur
3. Réinstallez l'extension

### Mes thèmes personnalisés ont disparu
1. Vérifiez le localStorage : F12 → Application → Local Storage
2. Les thèmes sont stockés sous `better42-custom-themes`
3. Restaurez depuis un export si disponible

### L'extension ne se charge pas
1. Vérifiez les erreurs dans la console
2. Assurez-vous d'avoir la bonne version du manifest
3. Firefox = manifest.json / Chrome = manifest-v3.json

---

## 📞 Support

### Communauté
- **Discord 42** - Canal dédié Better 42
- **GitHub Issues** - Pour les bugs et features
- **Pull Requests** - Pour contribuer

### Développement
- **Repository :** github.com/xHemera/Better_42
- **Branch principale :** main
- **License :** Voir LICENSE

---

## 🎯 Roadmap

### Version Actuelle (2.0)
- ✅ 20 thèmes prédéfinis
- ✅ Thèmes personnalisés illimités
- ✅ Export/Import de thèmes
- ✅ Mode sombre optimisé

### Prochaines Versions
- [ ] Synchronisation cloud des thèmes
- [ ] Marketplace de thèmes communautaires
- [ ] Prévisualisation en temps réel
- [ ] Animations de transition entre thèmes
- [ ] Thèmes dynamiques (selon l'heure)
- [ ] API publique pour développeurs tiers

---

## 📚 Ressources Externes

### Inspiration de Thèmes
- [Catppuccin](https://github.com/catppuccin/catppuccin)
- [Dracula Theme](https://draculatheme.com/)
- [Nord Theme](https://www.nordtheme.com/)
- [Tokyo Night](https://github.com/enkia/tokyo-night-vscode-theme)

### Outils de Couleurs
- [Coolors](https://coolors.co/) - Générateur de palettes
- [Color Hunt](https://colorhunt.co/) - Inspiration
- [Adobe Color](https://color.adobe.com/) - Roue chromatique

### Documentation Technique
- [MDN Web Docs](https://developer.mozilla.org/)
- [Chrome Extensions](https://developer.chrome.com/docs/extensions/)
- [Firefox Add-ons](https://extensionworkshop.com/)

---

## ⭐ Remerciements

Merci à :
- La communauté 42 pour les retours
- Les créateurs des thèmes originaux
- Tous les contributeurs du projet

---

## 📄 License

Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

**Dernière mise à jour :** Décembre 2025
**Version :** 2.0
**Maintenu par :** xHemera

---

**Créé avec 💜 pour la communauté 42**
