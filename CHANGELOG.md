# Changelog - Better 42 Extension

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
