# 🚀 AI Token Tracker

**Der Kilometerzähler für deine AI-Tokens!**

Verhindere AI-Halluzinationen, bevor sie entstehen. Diese Extension überwacht deinen Token-Verbrauch in Echtzeit und warnt dich, bevor kritische Limits erreicht werden.

## ✨ Features

- 📊 **Echtzeit Token-Überwachung**: Verfolge deinen Token-Verbrauch kontinuierlich
- ⚠️ **Intelligente Warnungen**: Erhalte Benachrichtigungen bevor Token-Limits erreicht werden
- 🔍 **Scope-basiertes Tracking**: Separate Token-Zählung für Dateien, Projekte und Sessions
- 🎯 **Multi-AI-Provider Support**: Unterstützung für GitHub Copilot, OpenAI und mehr
- 📈 **Detaillierte Analytics**: Umfassende Einblicke in deinen Token-Verbrauch
- 🎨 **Status Bar Integration**: Token-Info direkt in der VS Code Status Bar

## 🎯 Das Problem

Die meisten Entwickler kennen das Problem: Man arbeitet mit AI-Tools wie GitHub Copilot, und plötzlich beginnt die AI zu halluzinieren oder produziert unsinnige Antworten. Der Grund? **Token-Überschreitung!**

Was oft vergessen wird:
- ✅ Prompt-Tokens werden gezählt
- ✅ Datei-Inhalte werden gezählt  
- ✅ AI-Antworten werden gezählt
- ❌ **Chat-Verlauf wird oft übersehen!**
- ❌ **Zusammenfassungen der AI werden vergessen!**

Diese Extension hilft dir, **alle** Token-Quellen im Blick zu behalten.

## 🚀 Installation

1. Extension aus dem VS Code Marketplace installieren
2. VS Code neustarten
3. Token-Tracking startet automatisch

## 📊 Verwendung

### Status Bar
Die Extension zeigt deinen aktuellen Token-Verbrauch direkt in der Status Bar:
```
🟢 1,234/8,000 (15%)  - Alles im grünen Bereich
🟡 6,400/8,000 (80%)  - Vorsicht, Warnschwelle erreicht  
🔴 7,600/8,000 (95%)  - Kritisch! Halluzinationen drohen
```

### Scopes (Modulare Token-Verwaltung)
- **Datei-Scope**: Token pro geöffneter Datei
- **Projekt-Scope**: Token für das gesamte Projekt
- **Session-Scope**: Token für die aktuelle Arbeitssitzung
- **Custom-Scope**: Eigene Token-Bereiche definieren

### Commands
- `AI Token Tracker: Token Dashboard öffnen` - Detaillierte Übersicht
- `AI Token Tracker: Token Zähler zurücksetzen` - Alle Zähler auf null
- `AI Token Tracker: Neuen Scope erstellen` - Custom Scope anlegen

## ⚙️ Konfiguration

```json
{
  "aiTokenTracker.defaultMaxTokens": 64000,
  "aiTokenTracker.warningThreshold": 0.8,
  "aiTokenTracker.enabledProviders": ["copilot", "openai"],
  "aiTokenTracker.autoCreateScopes": true
}
```

### Verfügbare Einstellungen

| Setting | Beschreibung | Standard |
|---------|-------------|----------|
| `defaultMaxTokens` | Maximale Tokens pro Scope | 64000 |
| `warningThreshold` | Warnschwelle (0.8 = 80%) | 0.8 |
| `enabledProviders` | Aktive AI-Provider | ["copilot", "openai"] |
| `autoCreateScopes` | Auto-Erstellung von Scopes | true |

## 🎯 Warum diese Extension?

### Das "Autobahn-Problem"
Stell dir vor, du fährst auf der Autobahn und wirst plötzlich blind. Du weißt nicht:
- Soll ich anhalten?
- Soll ich weiterfahren?
- Nach links oder rechts?

**Genau so ergeht es der AI bei Token-Überschreitung!**

Sie wird "blind" und beginnt:
- 🚨 Zu halluzinieren
- 🚨 Falsche Informationen zu liefern
- 🚨 Inkonsistente Antworten zu geben
- 🚨 Aus "Panik" irgendwas zu tun

### Die Lösung
Diese Extension fungiert als **"Token-Kilometerzähler"** und warnt dich **bevor** die AI blind wird.

## 🔧 Für Entwickler

### Modulare Architektur
```
src/
├── core/              # Kern-Funktionalitäten
│   ├── tokenCounter.ts
│   ├── scopeManager.ts
│   └── configManager.ts
├── ui/                # Benutzeroberfläche
│   ├── statusBar.ts
│   └── notifications.ts
└── providers/         # AI-Provider Integration
    ├── copilotProvider.ts
    └── openaiProvider.ts
```

### Scope-Konzept
```typescript
interface TokenScope {
  id: string;
  name: string;
  type: 'file' | 'project' | 'session' | 'custom';
  maxTokens: number;
  currentTokens: number;
  warningThreshold: number;
}
```

## 🤝 Contributing

Beiträge sind willkommen! Siehe [CONTRIBUTING.md](CONTRIBUTING.md) für Details.

### Development Setup
```bash
git clone https://github.com/haenel881988/ai-token-tracker
cd ai-token-tracker
npm install
npm run compile
```

### Testing
```bash
# Extension testen
F5 in VS Code (startet Extension Development Host)

# Tests ausführen
npm test
```

## 📝 Roadmap

### Version 0.2.0
- [ ] Webview Dashboard mit Diagrammen
- [ ] Export von Token-Statistiken
- [ ] Erweiterte Provider-Integration

### Version 0.3.0
- [ ] Machine Learning für Token-Vorhersagen
- [ ] Team-Funktionen für Workspace-Sharing
- [ ] Advanced Analytics & Reporting

## 🐛 Bug Reports & Feature Requests

- [GitHub Issues](https://github.com/haenel881988/ai-token-tracker/issues)
- [Feature Requests](https://github.com/haenel881988/ai-token-tracker/discussions)

## 📄 License

MIT License - siehe [LICENSE](LICENSE) Datei für Details.

## 🙏 Acknowledgments

- Inspiriert durch die täglichen Herausforderungen mit AI-Token-Limits
- Dank an die VS Code Extension Community
- Besonderer Dank an alle Beta-Tester

---

**🎯 Mache Token-Überschreitungen sichtbar, bevor sie zu Problemen werden!**

Entwickelt mit ❤️ für die Developer Community.
