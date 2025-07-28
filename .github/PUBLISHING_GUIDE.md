# 📦 Extension Veröffentlichung - Kompletter Leitfaden

## 🎯 Übersicht
Dieser Leitfaden führt dich Schritt für Schritt durch den gesamten Veröffentlichungsprozess deiner AI Token Tracker Extension.

## 📋 Voraussetzungen & Setup

### 1. Microsoft Publisher Account
```bash
# VSCE (Visual Studio Code Extension Manager) installieren
npm install -g @vscode/vsce

# Publisher Account erstellen
vsce create-publisher your-publisher-name
```

**Wichtige Infos:**
- Publisher Name muss einzigartig sein
- Verwende deinen GitHub Username oder Firma
- Kann später nicht geändert werden!

### 2. Personal Access Token (PAT)
1. Gehe zu: https://dev.azure.com/
2. Erstelle einen Personal Access Token
3. Scope: **Marketplace (manage)**
4. Token sicher speichern!

```bash
# Token mit VSCE verknüpfen
vsce login your-publisher-name
```

## 📝 Package.json Optimierung

### Basis-Konfiguration
```json
{
  "name": "ai-token-tracker",
  "displayName": "AI Token Tracker",
  "description": "Überwache deinen AI Token-Verbrauch und verhindere Halluzinationen",
  "version": "0.1.0",
  "publisher": "your-publisher-name",
  "engines": {
    "vscode": "^1.74.0"
  },
  "categories": [
    "AI",
    "Debuggers",
    "Visualization",
    "Other"
  ],
  "keywords": [
    "ai",
    "tokens",
    "copilot",
    "openai",
    "tracker",
    "monitoring",
    "hallucination",
    "prevention"
  ],
  "icon": "assets/icon.png",
  "galleryBanner": {
    "color": "#1e1e1e",
    "theme": "dark"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/haenel881988/ai-token-tracker"
  },
  "bugs": {
    "url": "https://github.com/haenel881988/ai-token-tracker/issues"
  },
  "homepage": "https://github.com/haenel881988/ai-token-tracker#readme",
  "license": "MIT"
}
```

### Aktivierung & Befehle
```json
{
  "activationEvents": [
    "onLanguage:javascript",
    "onLanguage:typescript",
    "onLanguage:python",
    "onCommand:aiTokenTracker.showDashboard"
  ],
  "main": "./out/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "aiTokenTracker.showDashboard",
        "title": "Token Dashboard öffnen",
        "category": "AI Token Tracker"
      },
      {
        "command": "aiTokenTracker.resetCounters",
        "title": "Token Zähler zurücksetzen",
        "category": "AI Token Tracker"
      }
    ],
    "configuration": {
      "title": "AI Token Tracker",
      "properties": {
        "aiTokenTracker.maxTokens": {
          "type": "number",
          "default": 64000,
          "description": "Maximale Anzahl Tokens pro Scope"
        },
        "aiTokenTracker.warningThreshold": {
          "type": "number",
          "default": 0.8,
          "description": "Warnschwelle (80% = 0.8)"
        }
      }
    }
  }
}
```

## 🎨 Assets erstellen

### Icon (128x128 PNG)
- **Design:** Stilisierter Zähler/Dashboard
- **Farben:** VS Code kompatibel
- **Format:** PNG, 128x128 Pixel
- **Pfad:** `assets/icon.png`

### Gallery Banner
- **Größe:** 1200x400 Pixel
- **Inhalt:** Extension Name + Kurzbeschreibung
- **Stil:** Konsistent mit Icon

## 📖 Marketplace Beschreibung

### README.md Template
```markdown
# AI Token Tracker 🚀

**Der Kilometerzähler für deine AI-Tokens!**

Verhindere AI-Halluzinationen, bevor sie entstehen. Diese Extension überwacht deinen Token-Verbrauch in Echtzeit und warnt dich, bevor kritische Limits erreicht werden.

## ✨ Features

- 📊 **Echtzeit Token-Überwachung**
- ⚠️ **Intelligente Warnungen**
- 🔍 **Scope-basiertes Tracking**
- 🎯 **Multi-AI-Provider Support**
- 📈 **Detaillierte Analytics**

## 🚀 Installation

1. Extension installieren
2. VS Code neustarten
3. Token-Tracking startet automatisch

## 📊 Dashboard

![Dashboard Screenshot](images/dashboard.png)

## ⚙️ Konfiguration

```json
{
  "aiTokenTracker.maxTokens": 64000,
  "aiTokenTracker.warningThreshold": 0.8
}
```

## 🤝 Support

- [GitHub Issues](https://github.com/haenel881988/ai-token-tracker/issues)
- [Dokumentation](https://github.com/haenel881988/ai-token-tracker/wiki)
```

## 🏗️ Build & Package Process

### 1. TypeScript Build
```bash
# Dependencies installieren
npm install

# TypeScript kompilieren
npm run compile

# Tests ausführen
npm test
```

### 2. Extension Package
```bash
# VSIX Package erstellen
vsce package

# Ergebnis: ai-token-tracker-0.1.0.vsix
```

### 3. Lokaler Test
```bash
# Extension lokal installieren
code --install-extension ai-token-tracker-0.1.0.vsix

# Oder über VS Code UI:
# Ctrl+Shift+P → "Extensions: Install from VSIX"
```

## 🚀 Veröffentlichung

### Option 1: Command Line
```bash
# Direkt veröffentlichen
vsce publish

# Oder mit spezifischer Version
vsce publish 0.1.0

# Pre-release Version
vsce publish --pre-release
```

### Option 2: Marketplace Portal
1. VSIX-Datei erstellen: `vsce package`
2. Zu https://marketplace.visualstudio.com/manage navigieren
3. "New extension" → VSIX hochladen
4. Marketplace-Details ausfüllen

## 📈 Marketing & Promotion

### GitHub Repository
- **README.md** mit Screenshots
- **Wiki** mit Dokumentation
- **Issues** Template
- **Contributing** Guidelines

### Community Outreach
- **Reddit:** r/vscode, r/programming
- **Twitter:** #vscode #ai #tokens
- **Dev.to:** Blog Post über Token-Problematik
- **YouTube:** Demo Video

### Marketplace Optimierung
- **Keywords:** ai, tokens, copilot, monitoring
- **Categories:** AI, Debuggers, Visualization
- **Tags:** Relevant und suchbar

## 🔄 Update Process

### Version Management
```bash
# Minor Update
vsce publish minor  # 0.1.0 → 0.2.0

# Patch Update
vsce publish patch  # 0.1.0 → 0.1.1

# Major Update
vsce publish major  # 0.1.0 → 1.0.0
```

### Changelog
```markdown
## [0.2.0] - 2025-07-28
### Added
- Dashboard Webview
- Multi-Provider Support

### Fixed
- Token counting accuracy
- Memory leak in scope manager

### Changed
- Improved UI responsiveness
```

## 📊 Erfolg messen

### Marketplace Metriken
- **Installations:** Anzahl Downloads
- **Ratings:** Benutzerbewertungen
- **Usage:** Aktive Benutzer

### GitHub Analytics
- **Stars:** Community Interest
- **Issues:** User Feedback
- **Contributors:** Community Growth

## 🛠️ Troubleshooting

### Häufige Probleme
1. **Token Fehler:** PAT erneuern
2. **Build Errors:** Dependencies prüfen
3. **Upload Fails:** Package.json validieren

### Debugging
```bash
# Verbose Publishing
vsce publish --verbose

# Package ohne Upload
vsce package --out my-extension.vsix
```

## ✅ Pre-Launch Checklist

### Technisch
- [ ] Extension läuft lokal
- [ ] Alle Tests bestehen
- [ ] TypeScript ohne Fehler
- [ ] Package.json vollständig

### Content
- [ ] README.md geschrieben
- [ ] Screenshots erstellt
- [ ] Changelog gepflegt
- [ ] License hinzugefügt

### Marketing
- [ ] Repository aufgeräumt
- [ ] Issues Template
- [ ] Social Media vorbereitet
- [ ] Blog Post geplant

---

**🎯 Nächster Schritt:** Starte mit dem Extension-Setup und arbeite dich durch Phase 1 der Entwicklung!
