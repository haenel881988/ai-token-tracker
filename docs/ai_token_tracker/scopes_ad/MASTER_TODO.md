# 🏗️ Projekt-Modularisierung - Master Todo

## 📊 Projekt-Analyse (Automatisch generiert)

### Übersicht
- **Gesamt-Dateien**: 15 TypeScript-Dateien
- **Geschätzte Tokens**: 42,000 Tokens (grobe Schätzung)
- **Token-Limit**: 64,000 (GPT-4.1)
- **Auslastung**: 65.6%
- **Status**: 🟡 WARNUNG - Modularisierung empfohlen

### Token-Breakdown nach Modulen
```
src/core/                    ~24,000 Tokens (57%)
├── extension.ts             ~3,200 Tokens
├── tokenCounter.ts          ~4,800 Tokens  
├── scopeManager.ts          ~5,200 Tokens
├── realtimeMonitor.ts       ~4,200 Tokens
├── copilotIntegration.ts    ~6,600 Tokens  ← KRITISCH!
└── projectSetupManager.ts   ~6,200 Tokens  ← KRITISCH!

src/ui/                      ~8,000 Tokens (19%)
├── statusBar.ts             ~4,200 Tokens
└── notifications.ts         ~3,800 Tokens

docs/ & .github/             ~10,000 Tokens (24%)
```

## 🚨 **KRITISCHE DATEIEN (>5k Tokens):**
1. **copilotIntegration.ts** - 6,600 Tokens → SOFORT AUFTEILEN
2. **projectSetupManager.ts** - 6,200 Tokens → SOFORT AUFTEILEN  
3. **scopeManager.ts** - 5,200 Tokens → PRIORITÄT HOCH

## 📋 Modularisierungs-Aufgaben

### 🔴 **PHASE 1: KRITISCHE AUFSPALTUNG (SOFORT)**

#### copilotIntegration.ts → Aufteilen in:
- [ ] **01_core_modules/copilot_core.md**
  - CopilotAutoConsolidator Basis-Klasse
  - Event-Triggering Logic
  - Rate-Limiting System
  
- [ ] **01_core_modules/copilot_messaging.md**
  - Chat-Nachrichten Formatierung
  - Multi-Channel Integration
  - Fallback-Mechanismen
  
- [ ] **01_core_modules/copilot_recommendations.md**
  - Empfehlungs-Engine
  - Token-Summary Generation
  - Action-Determination Logic

#### projectSetupManager.ts → Aufteilen in:
- [ ] **01_core_modules/setup_core.md**
  - ProjectSetupManager Basis
  - GitHub-Struktur Creation
  
- [ ] **01_core_modules/setup_modularization.md**
  - Modularisierungs-Workflow
  - Project-Scanning Logic
  
- [ ] **01_core_modules/setup_templates.md**
  - Template-Generation
  - File-Content Creation

### 🟡 **PHASE 2: SCOPE-OPTIMIERUNG (DIESE WOCHE)**

#### Core-Module strukturieren:
- [ ] **00_project_overview/current_architecture.md**
  - Vollständige Projekt-Dokumentation
  - Token-Hotspot Mapping
  - Abhängigkeits-Analyse

- [ ] **01_core_modules/token_management.md**
  - TokenCounter + ScopeManager Integration
  - RealtimeMonitor Optimierung

- [ ] **02_ui_components/status_display.md**
  - StatusBar + Notifications Vereinigung
  - UI-Event Handling

### 🟢 **PHASE 3: FINE-TUNING (NÄCHSTE WOCHE)**

#### Weitere Optimierungen:
- [ ] **01_core_modules/config_management.md**
  - ConfigManager Erweiterung
  - Model-Configuration Logic
  
- [ ] **02_ui_components/webview_dashboard.md**
  - Dashboard-Implementierung
  - Interactive Components

## 🎯 **SMART-Aufgaben-Definition**

### Phase 1 Task: copilotIntegration.ts aufteilen

**Rolle**: Senior TypeScript Refactoring Engineer
**Ziel**: copilotIntegration.ts von 6,600 auf 3x ~2,200 Tokens aufteilen
**Kontext**: VS Code Extension, Copilot Chat API Integration
**Aktion**: 
1. Klasse in 3 logische Module aufteilen
2. Interfaces extrahieren
3. Dependency Injection implementieren
**Ergebnis**: 3 separate Dateien mit klaren Verantwortlichkeiten
**Constraints**: 
- Max 2,500 Tokens pro Datei
- Keine Breaking Changes
- Vollständige Test-Coverage

### Phase 1 Task: projectSetupManager.ts aufteilen

**Rolle**: DevOps & Setup Automation Engineer  
**Ziel**: projectSetupManager.ts von 6,200 auf 3x ~2,000 Tokens aufteilen
**Kontext**: Project-Setup, File-Generation, Template-System
**Aktion**:
1. Setup-Logic von Template-Logic trennen
2. File-Operations in separate Utility verschieben
3. Modularization-Workflow extrahieren
**Ergebnis**: Modulare Setup-Pipeline mit klarer Trennung
**Constraints**:
- Max 2,000 Tokens pro Modul
- Wiederverwendbare Komponenten
- Konfigurierbare Templates

## 🔄 **Automatische Token-Überwachung**

### Bei 75% Auslastung pro Scope:
```
Aktueller Scope: 01_core_modules/
Tokens: 15,200 / 20,000 (76%)
Aktion: AUTOMATISCHES SUB-SCOPING

Erstelle:
01_core_modules/
├── current_work.md
├── sub_tasks/
│   ├── copilot_core.md
│   ├── copilot_messaging.md  
│   └── copilot_recommendations.md
└── completed/
    └── analysis.md
```

### Chat-Split Trigger:
- **Bei 48,000 Tokens** (75% von 64k) → Neuer Chat
- **Bei 57,600 Tokens** (90% von 64k) → SOFORTIGER Chat-Wechsel

## 📊 **Token-Schätzungen nach Modularisierung**

### Vor Modularisierung:
```
Größte Datei: 6,600 Tokens (copilotIntegration.ts)
Durchschnitt: 2,800 Tokens pro Datei
Kritische Dateien: 3 (>5k Tokens)
```

### Nach Modularisierung (Ziel):
```
Größte Datei: <2,500 Tokens
Durchschnitt: <2,000 Tokens pro Datei  
Kritische Dateien: 0
Gesamt-Token-Ersparnis: ~20% durch bessere Strukturierung
```

## 🚀 **Nächste Schritte (SOFORT)**

### Heute starten:
1. ✅ **copilotIntegration.ts analysieren**
2. ✅ **Aufspaltungs-Plan erstellen**
3. ✅ **Erste Sub-Module extrahieren**

### Diese Woche abschließen:
4. ✅ **projectSetupManager.ts modularisieren**
5. ✅ **Token-Tests durchführen**
6. ✅ **Integration-Tests aktualisieren**

---

## 🎯 **Erfolg-Kriterien**

✅ **Alle Dateien unter 2,500 Tokens**
✅ **Keine Funktionalitäts-Verluste**  
✅ **Verbesserte Code-Struktur**
✅ **Bessere Token-Effizienz**
✅ **Einfachere Wartung**

**Status**: 🟡 In Arbeit - Phase 1 kritische Aufspaltung gestartet
**Update**: Täglich nach größeren Änderungen

*Diese Modularisierungs-Roadmap wurde automatisch vom AI Token Tracker basierend auf der aktuellen Projekt-Struktur generiert.*
