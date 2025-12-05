# Makefile pour Better 42 Extension
# Usage: make firefox  ou  make chrome

.PHONY: all firefox chrome clean help

# Variables
BUILD_DIR = build
FIREFOX_DIR = $(BUILD_DIR)/better42-firefox
CHROME_DIR = $(BUILD_DIR)/better42-chrome
FIREFOX_ZIP = $(BUILD_DIR)/better42-firefox.zip
CHROME_ZIP = $(BUILD_DIR)/better42-chrome.zip

# Fichiers à inclure
FILES = assets js main.js

# Fichiers à exclure
EXCLUDE = .git* node_modules/* *.DS_Store build/ *.zip Makefile README.md .gitignore

all: help

help:
	@echo "📦 Better 42 Extension Build System"
	@echo ""
	@echo "Usage:"
	@echo "  make firefox    - Compile pour Firefox (Manifest V2)"
	@echo "  make chrome     - Compile pour Chrome/Edge (Manifest V3)"
	@echo "  make both       - Compile pour Firefox ET Chrome"
	@echo "  make clean      - Nettoyer les fichiers de build"
	@echo ""

firefox:
	@echo "🦊 Compilation pour Firefox..."
	@mkdir -p $(BUILD_DIR)
	@mkdir -p $(FIREFOX_DIR)
	@# Copier tous les fichiers nécessaires
	@cp -r assets js main.js $(FIREFOX_DIR)/
	@# Utiliser le manifest V2 pour Firefox
	@cp manifest.json $(FIREFOX_DIR)/manifest.json
	@# Créer l'archive dans le dossier build
	@cd $(FIREFOX_DIR) && zip -r ../better42-firefox.zip . -q
	@echo "✅ Firefox build créé: $(FIREFOX_ZIP)"
	@echo "📦 Dossier: $(FIREFOX_DIR)"

chrome:
	@echo "🌐 Compilation pour Chrome/Edge..."
	@mkdir -p $(BUILD_DIR)
	@mkdir -p $(CHROME_DIR)
	@# Copier tous les fichiers nécessaires
	@cp -r assets js main.js $(CHROME_DIR)/
	@# Utiliser le manifest V3 pour Chrome
	@cp manifest-v3.json $(CHROME_DIR)/manifest.json
	@# Créer l'archive dans le dossier build
	@cd $(CHROME_DIR) && zip -r ../better42-chrome.zip . -q
	@echo "✅ Chrome build créé: $(CHROME_ZIP)"
	@echo "📦 Dossier: $(CHROME_DIR)"

both: firefox chrome
	@echo ""
	@echo "✨ Les deux versions ont été compilées avec succès!"

clean:
	@echo "🧹 Nettoyage des fichiers de build..."
	@rm -rf build/
	@rm -f $(FIREFOX_ZIP) $(CHROME_ZIP)
	@echo "✅ Nettoyage terminé"

# Installer l'extension dans Firefox (mode développeur)
install-firefox: firefox
	@echo "🔧 Pour installer dans Firefox:"
	@echo "   1. Ouvrez about:debugging#/runtime/this-firefox"
	@echo "   2. Cliquez sur 'Charger un module complémentaire temporaire'"
	@echo "   3. Sélectionnez: $(FIREFOX_DIR)/manifest.json"

# Installer l'extension dans Chrome (mode développeur)
install-chrome: chrome
	@echo "🔧 Pour installer dans Chrome:"
	@echo "   1. Ouvrez chrome://extensions/"
	@echo "   2. Activez le 'Mode développeur'"
	@echo "   3. Cliquez sur 'Charger l'extension non empaquetée'"
	@echo "   4. Sélectionnez le dossier: $(CHROME_DIR)"
