"use strict";
/**
 * Project Setup Manager - Automatische Projekt-Struktur beim ersten Start
 *
 * Diese Klasse erstellt automatisch die notwendige .github-Struktur
 * und AI Token Tracker Anweisungen für optimale KI-Integration.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectSetupManager = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class ProjectSetupManager {
    constructor(workspacePath) {
        this.workspacePath = workspacePath;
    }
    /**
     * Automatisches Setup bei Extension-Aktivierung
     */
    async setupProjectStructure() {
        try {
            // 1. GitHub Struktur erstellen
            await this.setupGithubStructure();
            // 2. Copilot Instructions erstellen/erweitern
            await this.setupCopilotInstructions();
            // 3. AI Token Tracker Anleitung erstellen
            await this.createTokenTrackerGuide();
            // 4. User fragen ob Modularisierungs-Workflow gewünscht
            await this.offerModularizationWorkflow();
            vscode.window.showInformationMessage('🚀 AI Token Tracker Setup erfolgreich! GitHub-Struktur wurde erstellt.', 'Anleitung anzeigen').then(selection => {
                if (selection) {
                    this.showSetupGuide();
                }
            });
        }
        catch (error) {
            console.error('Project setup failed:', error);
            vscode.window.showErrorMessage('Setup fehlgeschlagen: ' + error);
        }
    }
    /**
     * Erstellt .github Verzeichnis-Struktur
     */
    async setupGithubStructure() {
        const githubPath = path.join(this.workspacePath, '.github');
        const aiTokenPath = path.join(githubPath, 'ai_token_tracker');
        // .github Verzeichnis erstellen
        if (!fs.existsSync(githubPath)) {
            fs.mkdirSync(githubPath, { recursive: true });
        }
        // ai_token_tracker Unterverzeichnis erstellen
        if (!fs.existsSync(aiTokenPath)) {
            fs.mkdirSync(aiTokenPath, { recursive: true });
        }
    }
    /**
     * Erstellt oder erweitert copilot-instructions.md
     */
    async setupCopilotInstructions() {
        const copilotFile = path.join(this.workspacePath, '.github', 'copilot-instructions.md');
        if (fs.existsSync(copilotFile)) {
            // Bestehende Datei erweitern
            await this.extendExistingCopilotInstructions(copilotFile);
        }
        else {
            // Neue Datei erstellen
            await this.createNewCopilotInstructions(copilotFile);
        }
    }
    /**
     * Erweitert bestehende Copilot-Instructions
     */
    async extendExistingCopilotInstructions(filePath) {
        const existingContent = fs.readFileSync(filePath, 'utf8');
        // Prüfen ob AI Token Tracker bereits erwähnt
        if (existingContent.includes('AI Token Tracker')) {
            return; // Bereits konfiguriert
        }
        const tokenTrackerSection = `

## 🤖 AI Token Tracker Integration

### **WICHTIG: Token-Überwachung verwenden**

Vor jeder Code-Änderung und bei komplexen Aufgaben:
1. **Token-Status prüfen**: Schaue auf die AI Token Tracker Anzeige
2. **Bei >75% Token-Auslastung**: Aufgabe automatisch splitten
3. **Anleitung befolgen**: Siehe \`.github/ai_token_tracker/token-tracker.md\`

### **Automatische Token-Optimierung:**
- Extension sendet automatisch Token-Updates an diesen Chat
- Bei kritischen Limits: Sofortiger Chat-Neustart empfohlen
- Scope-basierte Modularisierung verwenden

**Anleitung für optimale Token-Nutzung:**
📖 \`.github/ai_token_tracker/token-tracker.md\`
`;
        fs.writeFileSync(filePath, existingContent + tokenTrackerSection, 'utf8');
    }
    /**
     * Erstellt neue Copilot-Instructions
     */
    async createNewCopilotInstructions(filePath) {
        const content = `# GitHub Copilot Instructions

## 🤖 AI Token Tracker Integration

### **WICHTIG: Token-Management verwenden**

Diese Workspace verwendet den **AI Token Tracker** für optimale KI-Performance:

#### **Token-Überwachung:**
- 🟢 **0-50%**: Normale Entwicklung möglich
- 🟡 **50-75%**: Präzisere Prompts verwenden  
- 🟠 **75-90%**: Aufgaben automatisch splitten
- 🔴 **90%+**: Sofortiger Chat-Neustart

#### **Automatische Integration:**
Die Extension sendet automatisch Token-Updates an diesen Chat nach jeder Änderung.

#### **Vollständige Anleitung:**
📖 Siehe: \`.github/ai_token_tracker/token-tracker.md\`

---

## 📋 Entwicklungsrichtlinien

### Code-Qualität
- Modulare Architektur bevorzugen
- TypeScript Typisierung verwenden
- Umfassende Dokumentation

### Token-Optimierung  
- Scope-basierte Entwicklung
- Regelmäßige Token-Checks
- Proaktive Chat-Splits bei komplexen Aufgaben

---

*Diese Anweisungen wurden automatisch vom AI Token Tracker erstellt.*
`;
        fs.writeFileSync(filePath, content, 'utf8');
    }
    /**
     * Erstellt detaillierte Token-Tracker Anleitung
     */
    async createTokenTrackerGuide() {
        const guidePath = path.join(this.workspacePath, '.github', 'ai_token_tracker', 'token-tracker.md');
        const content = `# 🤖 AI Token Tracker - Anleitung für KI

## 🎯 Überblick
Diese Anleitung erklärt der KI, wie der AI Token Tracker optimal zu verwenden ist.

## 🔍 Token-Status verstehen

### Status Bar Anzeige
\`\`\`
[🤖 45.2%] ← Live Token-Anzeige klicken für Details
\`\`\`

### Tooltip-Information
- **Aktuelle Tokens**: z.B. 2,847 / 64,000
- **Auslastung**: Prozentuale Anzeige
- **AI-Modell**: Automatisch erkannt (GPT-4.1, GPT-4o, etc.)
- **Empfehlung**: Nächste Schritte

## 🚦 Token-Ampel-System

### 🟢 Grün (0-50%): CONTINUE
- Normale Entwicklung möglich
- Komplexe Refactorings erlaubt
- Umfassende Code-Generierung OK

### 🟡 Gelb (50-75%): OPTIMIZE
- **Aktion**: Präzisere Prompts verwenden
- **Strategie**: Weniger Kontext pro Request
- **Tipp**: Spezifische Fragen stellen

### 🟠 Orange (75-90%): SPLIT
- **Sofort**: Aufgabe in Sub-Tasks aufteilen
- **Automatisch**: Neue Scopes erstellen
- **Empfehlung**: Chat-Split vorbereiten
- **Limit**: Nur essentielle Code-Änderungen

### 🔴 Rot (90%+): NEW_CHAT
- **SOFORT**: Neuen Chat starten
- **KRITISCH**: Halluzination-Gefahr!
- **Aktion**: Task-Liste erstellen
- **Stopp**: Keine großen Änderungen mehr

## 🏗️ Modularisierungs-Workflow

### Automatische Scope-Erstellung
Bei 75% Token-Auslastung:
1. **Analyse**: Aktuelle Aufgabe bewerten
2. **Split**: In logische Sub-Tasks aufteilen
3. **Struktur**: Neue Verzeichnisse erstellen:
   \`\`\`
   docs/ai_token_tracker/scopes_ad/
   ├── 01_current_task/
   ├── 02_sub_task_a/
   ├── 03_sub_task_b/
   ├── 04_tests/
   └── 05_documentation/
   \`\`\`
4. **TODO**: Aufgabenliste generieren
5. **Focus**: Ersten Sub-Task starten

### Modularisierungs-Commands
\`\`\`bash
# Modularisierungs-Workflow starten
Ctrl+Shift+P → "AI Token Tracker: Projekt modularisieren"

# Scope-Management
Ctrl+Shift+P → "AI Token Tracker: Neuen Scope erstellen"
\`\`\`

## 📊 Brutto vs. Netto Tokens

### Token-Kette verstehen
- **Brutto-Tokens**: Alle Tokens im Chat (Verlauf + Anweisungen + Code)
- **Netto-Tokens**: Verfügbare Tokens für neue Eingaben
- **Overhead**: ~20-30% für Chat-Verlauf und System-Prompts

### Break-Even Point Algorithmus
\`\`\`typescript
// Intelligente Token-Berechnung
const nettoTokens = bruttoTokens * 0.7; // 30% Overhead
const complexityFactor = fileComplexity > 0.8 ? 0.6 : 0.8;
const effectiveLimit = nettoTokens * complexityFactor;

if (currentTokens > effectiveLimit) {
    // Chat-Split empfohlen
}
\`\`\`

## 🎯 SMART Prompt-Template

### Für optimale Token-Nutzung:
\`\`\`markdown
**Rolle**: [Spezifische Expertenrolle]
**Ziel**: [Konkretes, messbares Ziel]
**Kontext**: [Minimaler, relevanter Kontext]
**Aktion**: [Spezifische Aktion]
**Ergebnis**: [Erwartetes Format/Ergebnis]
**Constraints**: [Token-Limit, Zeit, Scope]
\`\`\`

### Beispiel:
\`\`\`markdown
**Rolle**: TypeScript Entwickler
**Ziel**: Token-Counter Klasse optimieren  
**Kontext**: AI Token Tracker Extension, tiktoken Library
**Aktion**: Refactor für bessere Performance
**Ergebnis**: Optimierte Klasse mit Tests
**Constraints**: Max 500 Tokens, fokus auf Core-Logik
\`\`\`

## 🔄 Automatische Integration

### Extension sendet automatisch:
- Token-Status nach jeder Änderung
- Empfehlungen bei kritischen Limits
- Modell-Switching Vorschläge
- Scope-Management Updates

### Chat-Nachrichten Format:
\`\`\`
🤖 **AI Token Tracker - Automatische Konsolidierung**

📊 **Aktuelle Token-Situation:**
• Datei: [filename]
• Tokens: [current] / [max]
• Auslastung: [percentage]%
• Modell: [model]

[🟢🟡🟠🔴] **Empfehlung:**
• Aktion: [CONTINUE|OPTIMIZE|SPLIT|NEW_CHAT]
• Grund: [specific reason]
• Dringlichkeit: [LOW|MEDIUM|HIGH|CRITICAL]
\`\`\`

## 🛠️ Troubleshooting

### Häufige Szenarien:
1. **Token-Anzeige fehlt**: Extension aktiviert? Status Bar sichtbar?
2. **Falsche Limits**: Modell-Erkennung prüfen, manuell wechseln
3. **Zu viele Nachrichten**: Rate-Limiting anpassen
4. **Chat-Integration**: Fallback-Methoden werden automatisch probiert

### Quick-Fixes:
\`\`\`bash
# Extension neu laden
Ctrl+Shift+P → "Developer: Reload Window"

# Manuelle Token-Berechnung
Ctrl+Shift+P → "AI Token Tracker: Manuelle Konsolidierung"
\`\`\`

---

## 🎯 Fazit für KI

**Verwende immer:**
1. ✅ Token-Status vor großen Änderungen prüfen
2. ✅ Bei 75%+ automatisch Aufgaben splitten  
3. ✅ SMART-Prompts für optimale Token-Nutzung
4. ✅ Scope-basierte Modularisierung befolgen
5. ✅ Bei 90%+ sofort neuen Chat starten

**Die Extension unterstützt dich automatisch - vertraue den Empfehlungen!** 🚀
`;
        fs.writeFileSync(guidePath, content, 'utf8');
    }
    /**
     * Bietet Modularisierungs-Workflow an
     */
    async offerModularizationWorkflow() {
        const choice = await vscode.window.showInformationMessage('🏗️ Möchten Sie den Modularisierungs-Workflow für Ihr Projekt erstellen?', 'Ja, Projekt analysieren', 'Später', 'Niemals');
        if (choice === 'Ja, Projekt analysieren') {
            await this.createModularizationWorkflow();
        }
    }
    /**
     * Erstellt vollständigen Modularisierungs-Workflow
     */
    async createModularizationWorkflow() {
        // 1. Projekt scannen
        const projectStructure = await this.scanProjectStructure();
        // 2. Scope-Verzeichnisse erstellen
        await this.createScopeDirectories();
        // 3. Todo-Listen generieren
        await this.generateModularizationTodos(projectStructure);
        vscode.window.showInformationMessage('📋 Modularisierungs-Workflow erstellt! Siehe docs/ai_token_tracker/scopes_ad/', 'Workflow anzeigen').then(selection => {
            if (selection) {
                this.openModularizationWorkflow();
            }
        });
    }
    /**
     * Scannt Projektstruktur für Modularisierung
     */
    async scanProjectStructure() {
        const structure = {
            totalFiles: 0,
            codeFiles: [],
            largeSections: [],
            complexityScore: 0,
            estimatedTokens: 0
        };
        // Rekursives Scannen implementieren
        await this.scanDirectory(this.workspacePath, structure);
        return structure;
    }
    /**
     * Rekursives Verzeichnis-Scanning
     */
    async scanDirectory(dirPath, structure) {
        const items = fs.readdirSync(dirPath);
        for (const item of items) {
            const fullPath = path.join(dirPath, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory() && !this.shouldIgnoreDirectory(item)) {
                await this.scanDirectory(fullPath, structure);
            }
            else if (stat.isFile() && this.isCodeFile(item)) {
                const fileInfo = await this.analyzeCodeFile(fullPath);
                structure.codeFiles.push(fileInfo);
                structure.totalFiles++;
                structure.estimatedTokens += fileInfo.tokens;
                if (fileInfo.tokens > 2000) {
                    structure.largeSections.push(fileInfo);
                }
            }
        }
    }
    /**
     * Analysiert Code-Datei für Token-Schätzung
     */
    async analyzeCodeFile(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        const tokens = Math.floor(content.length / 4); // Grobe Schätzung
        return {
            path: filePath,
            relativePath: path.relative(this.workspacePath, filePath),
            tokens,
            lines: content.split('\n').length,
            complexity: this.calculateComplexity(content),
            needsModularization: tokens > 2000
        };
    }
    /**
     * Berechnet Code-Komplexität (vereinfacht)
     */
    calculateComplexity(content) {
        const complexityIndicators = [
            /class\s+/g,
            /function\s+/g,
            /interface\s+/g,
            /if\s*\(/g,
            /for\s*\(/g,
            /while\s*\(/g,
            /switch\s*\(/g
        ];
        let complexity = 0;
        for (const pattern of complexityIndicators) {
            const matches = content.match(pattern);
            complexity += matches ? matches.length : 0;
        }
        return Math.min(complexity / 10, 1); // Normalisiert auf 0-1
    }
    /**
     * Erstellt Scope-Verzeichnisse
     */
    async createScopeDirectories() {
        const scopesPath = path.join(this.workspacePath, 'docs', 'ai_token_tracker', 'scopes_ad');
        const directories = [
            '00_project_overview',
            '01_core_modules',
            '02_ui_components',
            '03_data_models',
            '04_utilities',
            '05_tests',
            '06_documentation',
            '99_integration'
        ];
        // Hauptverzeichnis erstellen
        if (!fs.existsSync(scopesPath)) {
            fs.mkdirSync(scopesPath, { recursive: true });
        }
        // Sub-Verzeichnisse erstellen
        for (const dir of directories) {
            const dirPath = path.join(scopesPath, dir);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
        }
    }
    /**
     * Generiert Modularisierungs-Todos
     */
    async generateModularizationTodos(projectStructure) {
        const todosPath = path.join(this.workspacePath, 'docs', 'ai_token_tracker', 'scopes_ad', 'MASTER_TODO.md');
        const content = `# 🏗️ Projekt-Modularisierung - Master Todo

## 📊 Projekt-Analyse (Automatisch generiert)

### Übersicht
- **Gesamt-Dateien**: ${projectStructure.totalFiles}
- **Geschätzte Tokens**: ${projectStructure.estimatedTokens.toLocaleString()}
- **Große Dateien (>2k Tokens)**: ${projectStructure.largeSections.length}
- **Modularisierung empfohlen**: ${projectStructure.largeSections.length > 0 ? 'JA' : 'NEIN'}

### Token-Breakdown
\`\`\`
Token-Limit: 64,000 (GPT-4.1)
Aktuell: ${projectStructure.estimatedTokens.toLocaleString()}
Auslastung: ${((projectStructure.estimatedTokens / 64000) * 100).toFixed(1)}%
Status: ${projectStructure.estimatedTokens > 48000 ? '🔴 KRITISCH' : projectStructure.estimatedTokens > 32000 ? '🟡 WARNUNG' : '🟢 OK'}
\`\`\`

## 📋 Modularisierungs-Aufgaben

### Phase 1: Projekt-Mapping (PRIORITY: HIGH)
- [ ] **00_project_overview/**: Vollständige Projekt-Struktur dokumentieren
- [ ] **00_project_overview/architecture.md**: Aktuelle Architektur analysieren
- [ ] **00_project_overview/dependencies.md**: Abhängigkeiten kartieren
- [ ] **00_project_overview/token_hotspots.md**: Token-intensive Bereiche identifizieren

### Phase 2: Core-Module aufteilen (PRIORITY: HIGH)
${projectStructure.largeSections.map((file, index) => `- [ ] **01_core_modules/module_${index + 1}.md**: ${file.relativePath} modularisieren (${file.tokens} Tokens)`).join('\n')}

### Phase 3: UI-Komponenten (PRIORITY: MEDIUM)
- [ ] **02_ui_components/status_bar.md**: Status Bar Modularisierung
- [ ] **02_ui_components/notifications.md**: Notification System
- [ ] **02_ui_components/dashboard.md**: Dashboard Komponenten

### Phase 4: Datenmodelle (PRIORITY: MEDIUM) 
- [ ] **03_data_models/token_models.md**: Token-Datenstrukturen
- [ ] **03_data_models/scope_models.md**: Scope-Management Modelle
- [ ] **03_data_models/config_models.md**: Konfiguration-Modelle

### Phase 5: Utilities (PRIORITY: LOW)
- [ ] **04_utilities/helpers.md**: Helper-Funktionen extrahieren
- [ ] **04_utilities/constants.md**: Konstanten zentralisieren
- [ ] **04_utilities/validators.md**: Validierung-Logic

### Phase 6: Tests & Dokumentation (PRIORITY: LOW)
- [ ] **05_tests/unit_tests.md**: Unit-Test Strategie
- [ ] **05_tests/integration_tests.md**: Integration-Tests
- [ ] **06_documentation/api_docs.md**: API-Dokumentation
- [ ] **06_documentation/user_guide.md**: User-Guide

### Phase 7: Integration (PRIORITY: CRITICAL)
- [ ] **99_integration/merge_plan.md**: Merge-Strategie definieren
- [ ] **99_integration/testing_plan.md**: Integrationstest-Plan
- [ ] **99_integration/rollback_plan.md**: Rollback-Strategie

## 🎯 SMART-Kriterien pro Phase

### Phase 1: Projekt-Mapping
- **Specific**: Vollständige Dokumentation der aktuellen Struktur
- **Measurable**: 100% aller Dateien erfasst
- **Achievable**: 1-2 Tage Aufwand
- **Relevant**: Basis für alle weiteren Schritte
- **Time-bound**: Diese Woche abschließen

### Phase 2: Core-Module
- **Specific**: Große Dateien (>2k Tokens) aufteilen
- **Measurable**: Alle ${projectStructure.largeSections.length} Dateien unter 1k Tokens
- **Achievable**: Pro Datei 0.5-1 Tag
- **Relevant**: Größte Token-Ersparnis
- **Time-bound**: Nächste 2 Wochen

## 🚦 Token-Management Regeln

### Beim Arbeiten an Modulen:
1. **Vor Start**: Token-Status prüfen
2. **Bei 50%**: Fokus auf aktuelles Modul
3. **Bei 75%**: Sub-Module erstellen
4. **Bei 90%**: Sofort neuen Chat/Scope starten

### Automatische Scope-Erstellung:
\`\`\`
Bei Token-Überschreitung:
Phase_X/
├── current_work.md
├── sub_tasks/
│   ├── task_a.md
│   ├── task_b.md
│   └── task_c.md
└── completed/
    └── done_tasks.md
\`\`\`

---

**Next Steps**: Beginne mit Phase 1 - Projekt-Mapping
**Token-Ziel**: Unter 48,000 Tokens pro Scope (75% von 64k)
**Update-Frequenz**: Täglich nach größeren Änderungen

*Diese Todo-Liste wurde automatisch vom AI Token Tracker generiert.*
`;
        fs.writeFileSync(todosPath, content, 'utf8');
    }
    /**
     * Hilfsfunktionen
     */
    shouldIgnoreDirectory(name) {
        const ignoreList = ['.git', 'node_modules', '.vscode', 'out', 'dist', 'build'];
        return ignoreList.includes(name);
    }
    isCodeFile(filename) {
        const codeExtensions = ['.ts', '.js', '.py', '.java', '.cs', '.cpp', '.c', '.php', '.rb', '.go', '.rs'];
        return codeExtensions.some(ext => filename.endsWith(ext));
    }
    showSetupGuide() {
        const uri = vscode.Uri.file(path.join(this.workspacePath, '.github', 'ai_token_tracker', 'token-tracker.md'));
        vscode.window.showTextDocument(uri);
    }
    openModularizationWorkflow() {
        const uri = vscode.Uri.file(path.join(this.workspacePath, 'docs', 'ai_token_tracker', 'scopes_ad', 'MASTER_TODO.md'));
        vscode.window.showTextDocument(uri);
    }
}
exports.ProjectSetupManager = ProjectSetupManager;
//# sourceMappingURL=projectSetupManager.js.map