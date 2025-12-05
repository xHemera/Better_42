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

- Système de thèmes personnalisés
- Partage de thèmes
- Styles pour différentes pages de l'intranet 42 :
  - Profile V3
  - Meta
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
