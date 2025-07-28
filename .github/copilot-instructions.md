# AI Token Tracker - Entwicklungsleitfaden

## 🎯 Projektziel
Eine VS Code Extension, die als "Kilometerzähler für Tokens" fungiert und Entwicklern hilft, Token-Verbrauch zu überwachen, bevor AI-Halluzinationen auftreten.

## 🤖 AI Token Tracker Integration

### **WICHTIG: Token-Überwachung verwenden**

Vor jeder Code-Änderung und bei komplexen Aufgaben:
1. **Token-Status prüfen**: Schaue auf die AI Token Tracker Anzeige
2. **Bei >75% Token-Auslastung**: Aufgabe automatisch splitten
3. **Anleitung befolgen**: Siehe `.github/ai_token_tracker/token-tracker.md`

### **Automatische Token-Optimierung:**
- Extension sendet automatisch Token-Updates an diesen Chat
- Bei kritischen Limits: Sofortiger Chat-Neustart empfohlen
- Scope-basierte Modularisierung verwenden

**Anleitung für optimale Token-Nutzung:**
📖 `.github/ai_token_tracker/token-tracker.md`

---

## 🤖 AI-Integration Rules für Copilot

### **WICHTIGE TOKEN-REGELN FÜR AI:**
```json
{
  "aiTokenTracker.aiInstructions": {
    "tokenAwareness": true,
    "autoSplit": true,
    "maxTokensPerRequest": 2000,
    "warningThreshold": 75,
    "criticalThreshold": 90,
    "autoNewChatAt": 85,
    "splitComplexTasks": true,
    "includeTokenInfo": true
  }
}
```

### **AI-VERHALTEN BEI TOKEN-LIMITS:**

#### 🟢 **0-50% Token-Auslastung:**
- Normale Entwicklung möglich
- Komplexe Refactorings erlaubt
- Umfassende Code-Generierung OK

#### 🟡 **50-75% Token-Auslastung:**
- Präzisere Prompts verwenden
- Aufgaben in kleinere Teile splitten
- Weniger Kontext pro Request

#### 🟠 **75-90% Token-Auslastung:**
- **AUTOMATISCH:** Aufgaben in Sub-Tasks aufteilen
- **AUTOMATISCH:** Neue Scopes erstellen
- **AUTOMATISCH:** Chat-Split-Empfehlung anzeigen
- Nur essentielle Code-Änderungen

#### 🔴 **90%+ Token-Auslastung:**
- **SOFORT:** Neuen Chat starten
- **SOFORT:** Task in Unter-Verzeichnisse splitten
- **SOFORT:** Todo-Liste erstellen
- Keine großen Code-Änderungen mehr

### **AUTOMATISCHE TASK-SPLITTING REGELN:**

#### **Bei 75% Token-Auslastung:**
```
1. Aktuelle Aufgabe analysieren
2. In logische Sub-Tasks aufteilen
3. Neue Scope-Struktur erstellen:
   - docs/01_current_task/
   - docs/02_sub_task_a/
   - docs/03_sub_task_b/
   - docs/04_tests/
   - docs/05_documentation/
4. TODO.md mit Aufgabenliste erstellen
5. Aktuellen Progress speichern
6. Neuen Scope für ersten Sub-Task starten
```

#### **Task-Splitting Beispiel:**
```markdown
# TODO.md - Automatisch erstellt bei 75% Token-Auslastung

## Haupt-Aufgabe: "Feature XY implementieren"
- **Status:** Bei 75% Token-Limit aufgeteilt
- **Ursprünglicher Scope:** feature_xy_main
- **Aufgeteilt in:** 4 Sub-Tasks

### 📋 Sub-Tasks:
- [ ] 01_core_logic/ - Basis-Funktionalität
- [ ] 02_ui_components/ - UI-Komponenten  
- [ ] 03_api_integration/ - API-Anbindung
- [ ] 04_tests_docs/ - Tests & Dokumentation

### 🎯 Aktueller Focus:
- **Active Scope:** 01_core_logic
- **Next:** 02_ui_components nach Completion
```

## 📋 Entwicklungsplan - Phasenweise Umsetzung

### Phase 1: Grundgerüst & Core-Module (Start hier!)
**Ziel:** Funktionsfähige Basis-Extension mit modularer Architektur

#### 1.1 Extension Setup
- [ ] `package.json` - Extension Manifest
- [ ] `src/extension.ts` - Main Entry Point
- [ ] `tsconfig.json` - TypeScript Konfiguration
- [ ] `.vscode/launch.json` - Debug Konfiguration

#### 1.2 Core Module Structure
```
src/
├── core/                    # Kern-Funktionalitäten
│   ├── tokenCounter.ts     # Token-Zählung Logik
│   ├── scopeManager.ts     # Scope-Verwaltung
│   └── configManager.ts    # Konfiguration
├── ui/                     # Benutzeroberfläche
│   ├── statusBar.ts        # Status Bar Integration
│   ├── webview.ts          # Dashboard Webview
│   └── notifications.ts    # Benachrichtigungen
├── providers/              # AI-Provider Integration
│   ├── copilotProvider.ts  # GitHub Copilot
│   ├── openaiProvider.ts   # OpenAI API
│   └── baseProvider.ts     # Basis-Interface
└── utils/                  # Hilfsfunktionen
    ├── fileUtils.ts        # Datei-Operationen
    └── logger.ts           # Logging
```

### Phase 2: Token-Tracking Implementation
**Scope:** Core Token-Zählung und Überwachung

#### 2.1 Token Counter Module
- [ ] Text-to-Token Konvertierung
- [ ] Chat-Verlauf Tracking
- [ ] Zusammenfassungs-Token Berechnung
- [ ] Scope-basierte Token-Limits

#### 2.2 Scope Manager
- [ ] Datei-Scopes definieren
- [ ] Projekt-Scopes verwalten
- [ ] Session-Scopes tracken
- [ ] Custom Scopes erstellen

### Phase 3: UI & Visualisierung
**Scope:** Benutzerfreundliche Oberfläche

#### 3.1 Status Bar Integration
- [ ] Token-Zähler Anzeige
- [ ] Warnungs-Indikatoren
- [ ] Quick-Actions

#### 3.2 Dashboard Webview
- [ ] Echtzeit Token-Übersicht
- [ ] Verlaufs-Diagramme
- [ ] Scope-Übersicht
- [ ] Einstellungen-Panel

### Phase 4: Provider Integration
**Scope:** Multi-AI-Provider Support

#### 4.1 Provider Architecture
- [ ] Base Provider Interface
- [ ] GitHub Copilot Integration
- [ ] OpenAI API Integration
- [ ] Claude API Integration

### Phase 5: Advanced Features
**Scope:** Erweiterte Funktionen

#### 5.1 Intelligent Warnings
- [ ] Threshold-basierte Warnungen
- [ ] Predictive Token-Usage
- [ ] Auto-Scope-Optimization

#### 5.2 Analytics & Reporting
- [ ] Usage Reports
- [ ] Performance Metrics
- [ ] Export Funktionen

## 🔧 Technische Spezifikationen

### Modularisierung & Scopes

#### Scope-Konzept
```typescript
interface TokenScope {
  id: string;
  name: string;
  type: 'file' | 'project' | 'session' | 'custom';
  maxTokens: number;
  currentTokens: number;
  warningThreshold: number;
  files?: string[];
  startTime: Date;
  endTime?: Date;
}
```

#### Core Module Interfaces
```typescript
// Token Counter Interface
interface ITokenCounter {
  countTokens(text: string): number;
  trackUsage(scope: string, tokens: number): void;
  getCurrentUsage(scope: string): TokenUsage;
}

// Scope Manager Interface
interface IScopeManager {
  createScope(config: ScopeConfig): TokenScope;
  getActiveScopes(): TokenScope[];
  updateScope(id: string, update: Partial<TokenScope>): void;
  deleteScope(id: string): void;
}
```

### Extension Configuration
```json
{
  "aiTokenTracker.defaultMaxTokens": 8000,
  "aiTokenTracker.warningThreshold": 0.8,
  "aiTokenTracker.providers": ["copilot", "openai"],
  "aiTokenTracker.scopes": {
    "enabled": true,
    "autoCreate": true,
    "types": ["file", "project", "session"]
  }
}
```

## 📦 Extension Veröffentlichung - Schritt für Schritt

### Vorbereitung
1. **Publisher Account erstellen**
   ```bash
   npm install -g vsce
   vsce create-publisher <your-publisher-name>
   ```

2. **Package.json optimieren**
   - Icon hinzufügen (128x128 PNG)
   - Categories definieren
   - Keywords für Suche
   - Repository Links
   - License

### Veröffentlichungsprocess
1. **Extension testen**
   ```bash
   # Extension lokal testen
   F5 in VS Code (Debug-Modus)
   
   # Package erstellen
   vsce package
   ```

2. **Marketplace Upload**
   ```bash
   # Direkt veröffentlichen
   vsce publish
   
   # Oder manuell über Web-Interface
   # https://marketplace.visualstudio.com/manage
   ```

### Marketing & Distribution
- **GitHub Repository** mit guter README
- **VS Code Marketplace** Beschreibung
- **Community Sharing** (Reddit, Twitter)
- **Blog Posts** über Token-Problematik

## 🚀 Sofortige nächste Schritte

### 1. Extension Basis erstellen
```bash
# Yo Code Generator installieren
npm install -g yo generator-code

# Extension Scaffold generieren
yo code
# Wähle: "New Extension (TypeScript)"
# Name: "ai-token-tracker"
```

### 2. Erste Implementation
**Beginne mit:** `src/core/tokenCounter.ts`
- Einfache Token-Zählung
- Basis Scope-Management
- Status Bar Integration

### 3. Testing Setup
- Unit Tests mit Jest
- Integration Tests
- Manual Testing Checklist

## 📋 Development Checklist

### Must-Have Features (MVP)
- [ ] Token-Zählung für aktuelle Datei
- [ ] Status Bar Anzeige
- [ ] Basis-Warnungen
- [ ] Copilot Integration

### Nice-to-Have Features
- [ ] Dashboard mit Diagrammen
- [ ] Multi-Provider Support
- [ ] Export Funktionen
- [ ] Advanced Analytics

## 💡 Entwicklungs-Tipps

### Modularität
- Jedes Modul hat eine klare Verantwortlichkeit
- Interfaces für alle externen Abhängigkeiten
- Dependency Injection verwenden
- Unit-testbare Module

### Performance
- Lazy Loading für UI-Module
- Debouncing für Token-Updates
- Caching für berechnete Werte
- Efficient Event Handling

### Benutzerfreundlichkeit
- Intuitive Visualisierung
- Klare Warnungen
- Einfache Konfiguration
- Hilfetexte und Dokumentation

---

**Nächster Schritt:** Beginne mit Phase 1.1 - Extension Setup!
**Fokus:** Modulare Architektur von Anfang an implementieren.