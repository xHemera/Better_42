# Changelog - Better 42 Extension

## [Nouveaux Thèmes] - 2025-12-05

### 🎨 Ajout de 15 Nouveaux Thèmes Prédéfinis

L'extension propose maintenant **20 thèmes prédéfinis** + la possibilité de créer des thèmes personnalisés !

#### 🌙 Collection Catppuccin (4 thèmes)
La palette Catppuccin offre des couleurs pastel douces et agréables pour les yeux :

1. **Catppuccin Mocha** 🌙
   - Couleur principale : `#cba6f7` (Violet pastel)
   - Style : Sombre et élégant
   - Idéal pour : Sessions nocturnes de code

2. **Catppuccin Latte** ☕
   - Couleur principale : `#8839ef` (Violet vif)
   - Style : Clair et énergique
   - Idéal pour : Journées productives

3. **Catppuccin Frappé** 🥤
   - Couleur principale : `#ca9ee6` (Violet doux)
   - Style : Équilibré et doux
   - Idéal pour : Sessions de travail prolongées

4. **Catppuccin Macchiato** 🍵
   - Couleur principale : `#c6a0f6` (Violet élégant)
   - Style : Sombre raffiné
   - Idéal pour : Ambiance cosy

#### 🎯 Thèmes Populaires de la Communauté

5. **Tokyo Night** 🌃
   - Inspiré de l'éditeur VS Code
   - Couleur : `#7aa2f7` (Bleu nuit)

6. **Dracula** 🧛
   - Le classique intemporel
   - Couleur : `#bd93f9` (Violet vibrant)

7. **Nord** ❄️
   - Palette froide et minimaliste
   - Couleur : `#88c0d0` (Cyan glacé)

8. **Gruvbox** 🟤
   - Rétro avec des tons chauds
   - Couleur : `#d79921` (Orange doré)

9. **One Dark** 🌑
   - Inspiré d'Atom
   - Couleur : `#61afef` (Bleu ciel)

10. **Solarized Dark** 🌅
    - Palette scientifiquement optimisée
    - Couleur : `#268bd2` (Bleu océan)

11. **Material** 💎
    - Design Material de Google
    - Couleur : `#82aaff` (Bleu matériel)

12. **Monokai** 🎨
    - Classique coloré
    - Couleur : `#f92672` (Rose magenta)

13. **Ayu** 🌊
    - Palette claire et aérée
    - Couleur : `#59c2ff` (Cyan clair)

14. **Synthwave** 🌆
    - Aesthetic années 80
    - Couleur : `#ff7edb` (Rose néon)

15. **GitHub Dark** 🐙
    - Style GitHub officiel
    - Couleur : `#58a6ff` (Bleu GitHub)

#### ✨ Système de Thèmes Personnalisés

En plus des thèmes prédéfinis, vous pouvez maintenant :

- **Créer** des thèmes illimités avec votre couleur favorite
- **Nommer** vos thèmes avec emoji et texte personnalisé
- **Exporter** vos thèmes pour les partager
- **Importer** des thèmes partagés par la communauté
- **Gérer** facilement vos thèmes (supprimer, modifier)

#### 🎨 Comment Utiliser

1. Cliquez sur le bouton **"Better"** pour activer le mode sombre
2. Cliquez sur **"⚙️ Settings"**
3. Naviguez jusqu'à la section **"🎨 Color Themes"**
4. Choisissez parmi les 20 thèmes prédéfinis ou créez le vôtre !

#### 💾 Format d'Export

Les thèmes peuvent être exportés au format JSON pour partage :

```json
{
  "customTheme1": {
    "name": "🌸 Mon Thème",
    "category": "custom",
    "colors": {
      "primary": "#ff69b4",
      "primaryLight": "#ff85c3",
      "primaryLighter": "#ffa1d2",
      ...
    }
  }
}
```

---

## [Améliorations récentes] - 2025-12-05

### 🎨 Améliorations du Mode Sombre

#### Problème résolu
- **Texte illisible en mode sombre** : Certains textes restaient noirs/foncés sur fond sombre, les rendant impossibles à lire.

#### Solutions appliquées

1. **Règles CSS générales pour tous les textes** (`text.css`)
   - Ajout de règles pour `body.dark-theme` affectant tous les éléments textuels (p, span, div, h1-h6, li, td, th, label)
   - Couleur par défaut : `var(--better42-text-light)` (#e5e5e5)

2. **Override des classes Tailwind sombres** (`text.css`)
   - Force la couleur claire pour toutes les classes `.text-black`, `.text-gray-*`, `.text-stone-*`, `.text-zinc-*`
   - Garantit la lisibilité même avec des classes Tailwind CSS

3. **Amélioration des liens** (`text.css`)
   - Liens en blanc par défaut : `var(--better42-text-white)` (#ffffff)
   - Au survol : couleur primaire du thème actif
   - Exception pour les liens `.text-legacy-main` qui gardent leur style personnalisé

4. **Couleur de texte sur les conteneurs principaux** (`theme.css`)
   - Ajout de `color: var(--better42-text-light)` sur `body.dark-theme`
   - Assure que tous les enfants héritent d'une couleur lisible par défaut

5. **Domaines spécifiques** (`domains/project.css`)
   - Ajout de `color: var(--better42-text-light)` sur le body des pages projets
   - Garantit la cohérence sur projects.intra.42.fr

#### Variables CSS utilisées
```css
--better42-text-light: #e5e5e5   /* Gris clair pour texte principal */
--better42-text-white: #ffffff   /* Blanc pur pour les liens et accents */
--better42-primary: <dynamique>  /* Couleur du thème actif (violet, rose, etc.) */
```

### 📦 Organisation des Fichiers Compilés

#### Amélioration
Tous les fichiers compilés sont maintenant organisés dans un dossier `build/` dédié :

```
build/
├── better42-firefox/          # Extension Firefox décompressée
├── better42-chrome/           # Extension Chrome décompressée
├── better42-firefox.zip       # Archive Firefox
└── better42-chrome.zip        # Archive Chrome
```

#### Modifications
- **build.sh** : Archives ZIP créées dans `build/`
- **Makefile** : Même logique appliquée
- **.gitignore** : Ajout de `build/` et `*.zip` pour éviter de versionner les builds

---

## Guide de Test

Pour tester les améliorations du mode sombre :

1. Compilez l'extension : `make firefox` ou `make chrome`
2. Chargez l'extension dans votre navigateur
3. Activez le mode sombre avec le bouton "Better"
4. Testez différentes pages :
   - Profile : `profile.intra.42.fr`
   - Projects : `projects.intra.42.fr`
   - Meta : `meta.intra.42.fr`
5. Vérifiez que tous les textes sont lisibles (blanc/gris clair sur fond sombre)
6. Testez avec différents thèmes de couleur (violet, rose, bleu, etc.)

## Prochaines Étapes

- [ ] Tester sur différentes résolutions d'écran
- [ ] Vérifier la cohérence sur toutes les pages de l'intranet
- [ ] Recueillir les retours utilisateurs
- [ ] Optimiser les performances si nécessaire
