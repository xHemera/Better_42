# 🎨 Guide des Thèmes - Better 42 Extension

Ce guide détaille tous les thèmes disponibles et comment créer les vôtres.

---

## 📚 Table des Matières

1. [Thèmes Prédéfinis](#thèmes-prédéfinis)
2. [Collection Catppuccin](#collection-catppuccin)
3. [Thèmes Populaires](#thèmes-populaires)
4. [Créer un Thème Personnalisé](#créer-un-thème-personnalisé)
5. [Exporter/Importer des Thèmes](#exporterimporter-des-thèmes)
6. [Structure d'un Thème](#structure-dun-thème)

---

## 🎯 Thèmes Prédéfinis

### Thèmes de Base (8)

| Emoji | Nom | Couleur Principale | Hex |
|-------|-----|-------------------|-----|
| 🟣 | Purple | Violet | `#5c058f` |
| ⚪ | White | Blanc | `#e5e5e5` |
| 🔵 | Blue | Bleu | `#1e40af` |
| 🩷 | Pink | Rose | `#be185d` |
| 🟢 | Green | Vert | `#059669` |
| 🟠 | Orange | Orange | `#ea580c` |
| 🔴 | Red | Rouge | `#dc2626` |
| 🔵 | Cyan | Cyan | `#0891b2` |

---

## 🌙 Collection Catppuccin

Catppuccin est une palette de couleurs pastel qui offre 4 variations :

### 1. Catppuccin Mocha 🌙
**Palette sombre élégante**
- **Couleur principale :** `#cba6f7` (Mauve)
- **Style :** Doux pour les yeux, parfait pour le travail nocturne
- **Inspiration :** Un café mocha réconfortant dans la pénombre
- **Meilleur usage :** Sessions de code tardives, ambiance cosy

```css
primary: #cba6f7
light: #d4bbfc
lighter: #e5d5ff
dark: #b491e8
```

### 2. Catppuccin Latte ☕
**Palette claire énergique**
- **Couleur principale :** `#8839ef` (Violet vif)
- **Style :** Clair et énergique, parfait pour le jour
- **Inspiration :** Un café latte du matin
- **Meilleur usage :** Journées productives, clarté maximale

```css
primary: #8839ef
light: #9d5eff
lighter: #b37fff
dark: #7627d6
```

### 3. Catppuccin Frappé 🥤
**Palette moyenne équilibrée**
- **Couleur principale :** `#ca9ee6` (Violet doux)
- **Style :** Équilibré entre clair et sombre
- **Inspiration :** Un frappé rafraîchissant
- **Meilleur usage :** Sessions de travail prolongées

```css
primary: #ca9ee6
light: #d5adef
lighter: #e0c2f7
dark: #b88fd9
```

### 4. Catppuccin Macchiato 🍵
**Palette sombre raffinée**
- **Couleur principale :** `#c6a0f6` (Violet élégant)
- **Style :** Sombre mais raffiné
- **Inspiration :** Un macchiato parfaitement dosé
- **Meilleur usage :** Ambiance élégante et professionnelle

```css
primary: #c6a0f6
light: #d2b1f9
lighter: #ddc3fc
dark: #b38fe8
```

---

## 🎯 Thèmes Populaires

### Tokyo Night 🌃
Inspiré de l'esthétique nocturne de Tokyo
- **Couleur :** `#7aa2f7` (Bleu nuit électrique)
- **Origine :** Extension VS Code populaire
- **Caractéristiques :** Bleus vifs, contraste élevé

### Dracula 🧛
Le thème sombre classique
- **Couleur :** `#bd93f9` (Violet vibrant)
- **Origine :** dracula.theme
- **Caractéristiques :** Palette riche, violet signature

### Nord ❄️
Palette froide et minimaliste
- **Couleur :** `#88c0d0` (Cyan glacé)
- **Origine :** Nord Theme
- **Caractéristiques :** Tons froids, minimaliste

### Gruvbox 🟤
Rétro avec des tons chauds
- **Couleur :** `#d79921` (Orange doré)
- **Origine :** Gruvbox
- **Caractéristiques :** Vintage, tons terre

### One Dark 🌑
Le thème d'Atom
- **Couleur :** `#61afef` (Bleu ciel)
- **Origine :** Atom Editor
- **Caractéristiques :** Équilibré, professionnel

### Solarized Dark 🌅
Scientifiquement optimisé
- **Couleur :** `#268bd2` (Bleu océan)
- **Origine :** Ethan Schoonover
- **Caractéristiques :** Contraste optimal pour les yeux

### Material 💎
Design Material de Google
- **Couleur :** `#82aaff` (Bleu matériel)
- **Origine :** Google Material Design
- **Caractéristiques :** Moderne, épuré

### Monokai 🎨
Classique coloré
- **Couleur :** `#f92672` (Rose magenta)
- **Origine :** Sublime Text
- **Caractéristiques :** Coloré, contrasté

### Ayu 🌊
Palette claire et aérée
- **Couleur :** `#59c2ff` (Cyan clair)
- **Origine :** Ayu Theme
- **Caractéristiques :** Lumineux, aéré

### Synthwave 🌆
Aesthetic années 80
- **Couleur :** `#ff7edb` (Rose néon)
- **Origine :** Culture Synthwave
- **Caractéristiques :** Néon, rétro-futuriste

### GitHub Dark 🐙
Style GitHub officiel
- **Couleur :** `#58a6ff` (Bleu GitHub)
- **Origine :** GitHub
- **Caractéristiques :** Familier, professionnel

---

## ✨ Créer un Thème Personnalisé

### Étapes de Création

1. **Ouvrir les Paramètres**
   - Cliquez sur le bouton "Better" en haut à droite
   - Puis sur "⚙️ Settings"

2. **Accéder aux Thèmes**
   - Scrollez jusqu'à "🎨 Color Themes"
   - Trouvez la section "✨ Custom Themes"

3. **Créer le Thème**
   - Cliquez sur "➕ Create Custom"
   - Une popup apparaît avec :
     - 🎨 Sélecteur de couleur
     - 📝 Champ pour le nom
     - 😀 Champ pour l'emoji (optionnel)

4. **Choisir la Couleur**
   - Utilisez le color picker pour sélectionner votre couleur préférée
   - Ou entrez directement un code hex (ex: `#ff69b4`)

5. **Nommer le Thème**
   - Donnez un nom descriptif (ex: "Mon Thème Rose")
   - Ajoutez un emoji pour le reconnaître facilement (ex: 🌸)

6. **Valider**
   - Cliquez sur "Create"
   - Le thème est automatiquement appliqué !

### Système de Génération Automatique

Quand vous choisissez une couleur de base, le système génère automatiquement :

- **primaryLight** : +20% de luminosité
- **primaryLighter** : +40% de luminosité
- **primaryDark** : -20% de luminosité
- **primaryDarker** : -40% de luminosité
- **primaryAlpha** : Version semi-transparente (30%)
- **primaryAlphaLight** : Version très transparente (10%)

### Exemples de Couleurs Populaires

```
Rose Bonbon : #ff69b4
Turquoise   : #40e0d0
Lavande     : #b19cd9
Pêche       : #ffcba4
Menthe      : #98ff98
Corail      : #ff7f50
Améthyste   : #9966cc
Or          : #ffd700
```

---

## 📤📥 Exporter/Importer des Thèmes

### Exporter vos Thèmes

1. Allez dans "🎨 Color Themes"
2. Cliquez sur "📤 Export"
3. Un fichier JSON est téléchargé contenant tous vos thèmes personnalisés
4. Partagez ce fichier avec vos amis !

### Importer des Thèmes

1. Allez dans "🎨 Color Themes"
2. Cliquez sur "📥 Import"
3. Sélectionnez un fichier JSON de thèmes
4. Les thèmes sont ajoutés à votre collection
5. Doublon ? Les thèmes existants sont conservés

### Format d'Export

```json
{
  "myCustomTheme": {
    "name": "🌸 Mon Thème Rose",
    "category": "custom",
    "colors": {
      "primary": "#ff69b4",
      "primaryLight": "#ff85c3",
      "primaryLighter": "#ffa1d2",
      "primaryDark": "#f64da1",
      "primaryDarker": "#ed318e",
      "primaryAlpha": "rgba(255, 105, 180, 0.3)",
      "primaryAlphaLight": "rgba(255, 105, 180, 0.1)"
    }
  },
  "anotherTheme": {
    ...
  }
}
```

---

## 🔧 Structure d'un Thème

### Propriétés Obligatoires

```javascript
{
  name: string,           // Nom affiché (avec emoji)
  category: string,       // 'predefined' ou 'custom'
  colors: {
    primary: string,      // Couleur principale (hex)
    primaryLight: string, // Version claire
    primaryLighter: string, // Version très claire
    primaryDark: string,  // Version sombre
    primaryDarker: string, // Version très sombre
    primaryAlpha: string, // Version transparente (rgba)
    primaryAlphaLight: string // Version très transparente (rgba)
  }
}
```

### Utilisation dans le CSS

Les couleurs sont appliquées via des variables CSS :

```css
:root {
  --better42-primary: <primary>;
  --better42-primary-light: <primaryLight>;
  --better42-primary-lighter: <primaryLighter>;
  --better42-primary-dark: <primaryDark>;
  --better42-primary-darker: <primaryDarker>;
  --better42-primary-dark-alpha: <primaryAlpha>;
  --better42-primary-alpha-dark: <primaryAlphaLight>;
}
```

Ces variables sont ensuite utilisées dans tous les CSS de l'extension.

---

## 💡 Conseils de Design

### Choisir une Bonne Couleur

1. **Contraste** : Assurez-vous qu'elle se détache sur fond sombre
2. **Saturation** : Évitez les couleurs trop vives qui fatiguent les yeux
3. **Cohérence** : Testez avec différentes pages de l'intranet

### Couleurs à Éviter

- ❌ Jaune pur : Trop vif sur fond sombre
- ❌ Vert fluo : Fatigue les yeux rapidement
- ❌ Gris foncé : Pas assez de contraste
- ❌ Rouge sang : Trop agressif

### Couleurs Recommandées

- ✅ Bleus : Apaisants et lisibles
- ✅ Violets : Élégants et modernes
- ✅ Cyans : Frais et énergiques
- ✅ Roses pastels : Doux et agréables

---

## 🤝 Partager avec la Communauté

### Où Partager

1. **Discord 42** : Partagez dans le canal dédié
2. **GitHub Issues** : Proposez vos thèmes via une issue
3. **Pull Request** : Contribuez directement au code

### Format de Partage

Créez un message avec :

```markdown
## 🎨 Mon Nouveau Thème : [Nom]

**Couleur principale :** #hexcode
**Inspiration :** Description
**Capture d'écran :** [lien ou image]

**Fichier JSON :**
```json
{ ... }
```

---

## 📊 Statistiques des Thèmes

L'extension garde en mémoire :
- Nombre de thèmes prédéfinis : 20
- Nombre de thèmes personnalisés créés
- Thème actuellement actif
- Historique des thèmes utilisés (via localStorage)

---

## 🐛 Dépannage

### Le thème ne s'applique pas ?
1. Rechargez la page
2. Vérifiez que le mode sombre est activé ("Better")
3. Vérifiez la console pour des erreurs

### Mes thèmes personnalisés ont disparu ?
- Ils sont stockés dans `localStorage`
- Vérifiez vos paramètres de navigateur
- Exportez régulièrement vos thèmes !

### Les couleurs sont étranges ?
- Le système génère automatiquement les variantes
- Certaines couleurs peuvent donner des résultats inattendus
- Essayez une couleur légèrement différente

---

## 📚 Ressources

- [Catppuccin Official](https://github.com/catppuccin/catppuccin)
- [Dracula Theme](https://draculatheme.com/)
- [Nord Theme](https://www.nordtheme.com/)
- [Color Hunt](https://colorhunt.co/) - Inspiration de palettes
- [Coolors](https://coolors.co/) - Générateur de palettes

---

**Créé avec 💜 pour la communauté 42**
