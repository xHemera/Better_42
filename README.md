# Better 42 Extension

Extension pour l'intranet 42 avec système de thèmes avancé et partage de thèmes.

## � Compilation rapide

Utilisez le Makefile pour compiler l'extension :

```bash
# Compiler pour Firefox
make firefox

# Compiler pour Chrome/Edge/Brave
make chrome

# Compiler les deux versions
make both

# Nettoyer les fichiers de build
make clean
```

Les archives seront créées :
- `better42-firefox.zip` - Version Firefox (Manifest V2)
- `better42-chrome.zip` - Version Chrome/Edge (Manifest V3)
- Dossiers sources dans `build/better42-firefox/` et `build/better42-chrome/`

## �📦 Installation

### Firefox

**Méthode 1 : Utiliser le build automatique**
```bash
make firefox
```
Puis dans Firefox :
1. Ouvrez `about:debugging#/runtime/this-firefox`
2. Cliquez sur **"Charger un module complémentaire temporaire"**
3. Sélectionnez `build/better42-firefox/manifest.json`

**Méthode 2 : Installation manuelle**
1. Glissez-déposez le fichier `better42-firefox.zip` dans Firefox
2. L'extension sera installée automatiquement

> **Note :** L'extension utilise Manifest V2 pour Firefox

### Chrome / Edge / Brave

**Méthode automatique**
```bash
make chrome
```
Puis dans votre navigateur :
1. Ouvrez :
   - Chrome : `chrome://extensions/`
   - Edge : `edge://extensions/`
   - Brave : `brave://extensions/`
2. Activez le **"Mode développeur"** (interrupteur en haut à droite)
3. Cliquez sur **"Charger l'extension non empaquetée"**
4. Sélectionnez le dossier `build/better42-chrome/`

> **Note :** L'extension utilise Manifest V3 pour les navigateurs Chromium

## � Commandes disponibles

```bash
make              # Afficher l'aide
make firefox      # Compiler pour Firefox
make chrome       # Compiler pour Chrome/Edge/Brave
make both         # Compiler les deux versions
make clean        # Nettoyer les fichiers de build
make install-firefox  # Instructions d'installation Firefox
make install-chrome   # Instructions d'installation Chrome
```

## 📝 Fichiers de configuration

- `manifest.json` - Manifest V2 pour Firefox (source)
- `manifest-v3.json` - Manifest V3 pour Chrome/Edge (source)
- `Makefile` - Script de compilation automatique
- `better42-firefox.zip` - Build Firefox (généré)
- `better42-chrome.zip` - Build Chrome (généré)
- `build/` - Dossier contenant les builds déployables

## 🎨 Fonctionnalités

### Système de Thèmes Avancé

L'extension propose **deux types de thèmes** :

#### 📦 Thèmes Prédéfinis (20 thèmes disponibles)

**Thèmes de base :**
- 🟣 Purple (par défaut)
- ⚪ White
- 🔵 Blue
- 🩷 Pink
- 🟢 Green
- 🟠 Orange
- 🔴 Red
- 🔵 Cyan

**Thèmes populaires :**
- 🌙 **Catppuccin Mocha** - Palette pastel avec accent violet
- ☕ **Catppuccin Latte** - Version claire de Catppuccin
- 🥤 **Catppuccin Frappé** - Palette moyenne avec violet doux
- 🍵 **Catppuccin Macchiato** - Palette sombre avec violet élégant
- 🌃 **Tokyo Night** - Inspiré de l'esthétique de Tokyo
- 🧛 **Dracula** - Thème sombre avec violet vibrant
- ❄️ **Nord** - Palette froide et épurée
- 🟤 **Gruvbox** - Rétro avec tons chauds
- 🌑 **One Dark** - Inspiré d'Atom
- 🌅 **Solarized Dark** - Palette scientifiquement optimisée
- 💎 **Material** - Design Material de Google
- 🎨 **Monokai** - Classique coloré
- 🌊 **Ayu** - Palette claire et aérée
- 🌆 **Synthwave** - Aesthetic années 80
- 🐙 **GitHub Dark** - Style GitHub

#### ✨ Thèmes Personnalisés

Créez vos propres thèmes avec :
- 🎨 Sélecteur de couleur personnalisé
- 💾 Sauvegarde locale de vos créations
- 📤 Export/Import de thèmes
- 🗑️ Gestion facile (suppression, modification)
- 🎭 Emoji personnalisable pour chaque thème

**Comment créer un thème personnalisé :**
1. Cliquez sur le bouton "⚙️ Settings"
2. Allez dans la section "🎨 Color Themes"
3. Cliquez sur "➕ Create Custom"
4. Choisissez votre couleur de base
5. Donnez un nom et un emoji à votre thème
6. Le thème sera automatiquement appliqué !

> 📚 **Documentation complète :**
> - [Guide des Thèmes](THEMES_GUIDE.md) - Tutoriel détaillé
> - [Gallery de Thèmes](THEMES_GALLERY.md) - Aperçu visuel de tous les thèmes
> - [Changelog](CHANGELOG.md) - Historique des mises à jour

### Autres Fonctionnalités

- **👤 Photos de Profil dans les Évaluations** - Affiche automatiquement les photos de profil des personnes à évaluer avec animation au survol
- **Mode Sombre Optimisé** - Texte blanc/clair automatique pour une lisibilité maximale
- **Partage de thèmes** - Exportez et partagez vos créations avec la communauté
- **Styles pour différentes pages** de l'intranet 42 :
  - Profile V3
  - Meta (avec support des évaluations)
  - Companies
  - E-learning
  - Projects

## 🛠️ Développement

Aucune compilation nécessaire ! L'extension utilise du JavaScript vanilla, HTML et CSS.

Structure du projet :
```
Better_42/
├── manifest.json          # Configuration principale
├── main.js               # Point d'entrée
├── assets/               # Ressources CSS
│   └── css/
│       ├── domains/      # Styles spécifiques par domaine
│       └── *.css         # Styles globaux
└── js/                   # Code JavaScript
    ├── core/             # Configuration
    ├── detection/        # Détection de pages
    ├── managers/         # Gestionnaires
    ├── sync/             # Synchronisation
    ├── themes/           # Système de thèmes
    └── ui/               # Interface utilisateur
```

## 📄 Licence

Voir le fichier LICENSE pour plus de détails.
