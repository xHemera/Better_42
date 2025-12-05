#!/bin/zsh
# Script de build pour Better 42 Extension
# Usage: ./build.sh [firefox|chrome|both|clean]

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directories
BUILD_DIR="build"
FIREFOX_DIR="$BUILD_DIR/better42-firefox"
CHROME_DIR="$BUILD_DIR/better42-chrome"
FIREFOX_ZIP="$BUILD_DIR/better42-firefox.zip"
CHROME_ZIP="$BUILD_DIR/better42-chrome.zip"

# Fonction pour afficher l'aide
show_help() {
    echo "${BLUE}📦 Better 42 Extension Build System${NC}"
    echo ""
    echo "Usage: ./build.sh [command]"
    echo ""
    echo "Commands:"
    echo "  firefox     - Compile pour Firefox (Manifest V2)"
    echo "  chrome      - Compile pour Chrome/Edge (Manifest V3)"
    echo "  both        - Compile pour Firefox ET Chrome"
    echo "  clean       - Nettoyer les fichiers de build"
    echo "  help        - Afficher cette aide"
    echo ""
}

# Fonction pour compiler Firefox
build_firefox() {
    echo "${BLUE}🦊 Compilation pour Firefox...${NC}"

    # Créer le dossier de build
    mkdir -p "$BUILD_DIR"
    mkdir -p "$FIREFOX_DIR"

    # Copier les fichiers nécessaires
    cp -r assets js main.js "$FIREFOX_DIR/"

    # Utiliser le manifest V2 pour Firefox
    cp manifest.json "$FIREFOX_DIR/manifest.json"

    # Créer l'archive dans le dossier build
    cd "$FIREFOX_DIR"
    zip -r "../better42-firefox.zip" . -q
    cd - > /dev/null

    echo "${GREEN}✅ Firefox build créé: $FIREFOX_ZIP${NC}"
    echo "${YELLOW}📦 Dossier: $FIREFOX_DIR${NC}"
}

# Fonction pour compiler Chrome
build_chrome() {
    echo "${BLUE}🌐 Compilation pour Chrome/Edge...${NC}"

    # Créer le dossier de build
    mkdir -p "$BUILD_DIR"
    mkdir -p "$CHROME_DIR"

    # Copier les fichiers nécessaires
    cp -r assets js main.js "$CHROME_DIR/"

    # Utiliser le manifest V3 pour Chrome
    cp manifest-v3.json "$CHROME_DIR/manifest.json"

    # Créer l'archive dans le dossier build
    cd "$CHROME_DIR"
    zip -r "../better42-chrome.zip" . -q
    cd - > /dev/null

    echo "${GREEN}✅ Chrome build créé: $CHROME_ZIP${NC}"
    echo "${YELLOW}📦 Dossier: $CHROME_DIR${NC}"
}

# Fonction pour nettoyer
clean() {
    echo "${BLUE}🧹 Nettoyage des fichiers de build...${NC}"
    rm -rf build/
    rm -f "$FIREFOX_ZIP" "$CHROME_ZIP"
    echo "${GREEN}✅ Nettoyage terminé${NC}"
}

# Main script
case "${1:-help}" in
    firefox)
        build_firefox
        ;;
    chrome)
        build_chrome
        ;;
    both)
        build_firefox
        echo ""
        build_chrome
        echo ""
        echo "${GREEN}✨ Les deux versions ont été compilées avec succès!${NC}"
        ;;
    clean)
        clean
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "${RED}❌ Commande inconnue: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
