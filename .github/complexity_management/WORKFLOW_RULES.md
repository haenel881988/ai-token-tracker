# 🔧 GitHub Workflow Rules - Radikale Fehlerbehandlung

## 🎯 Grundprinzipien für KI-Verhalten

### **RADIKAL AN DER WURZEL - Keine Symptom-Behandlung!**

Die KI MUSS immer die **Grundursache** von Problemen lösen, nicht nur die Symptome:

#### ❌ **VERBOTEN - Oberflächliche Fixes:**
- Schnelle Patches ohne Ursachen-Analyse
- Workarounds die das Problem verschieben
- Temporäre Lösungen ohne langfristige Strategie
- Ignorieren von wiederkehrenden Mustern

#### ✅ **ERFORDERLICH - Wurzel-Analysen:**
1. **Problem-Ursprung identifizieren** → Warum ist es entstanden?
2. **System-Kontext verstehen** → Welche Faktoren spielen eine Rolle?
3. **Strukturelle Lösung entwickeln** → Wie kann es dauerhaft verhindert werden?
4. **Präventive Maßnahmen implementieren** → Monitoring & Früherkennung

---

## 🚨 **Token-Bewusstes Arbeiten (64k Limit)**

### **Automatische Token-Kontrolle bei jeder Aktion:**

```typescript
// Vor jeder größeren Änderung:
const tokenStatus = checkCurrentTokenUsage();
if (tokenStatus.percentage > 75) {
    // SOFORT: Scope aufteilen, neuen Chat starten
    triggerScopeModularization();
}
```

#### **Token-Ampel-System befolgen:**
- 🟢 **0-50%**: Normale Entwicklung
- 🟡 **50-75%**: Präzise, fokussierte Änderungen  
- 🟠 **75-90%**: NUR kritische Fixes, Scope-Split vorbereiten
- 🔴 **90%+**: STOPP! Neuen Chat starten

---

## 📋 **Redundanz & Duplikate Management**

### **Null-Toleranz für Redundanzen:**

#### **Vor jeder Datei-Operation:**
1. **Ähnlichkeits-Scan durchführen** (>80% = Duplikat)
2. **Abhängigkeits-Analyse** → Was hängt davon ab?
3. **Konsolidierungs-Potential prüfen** → Kann zusammengeführt werden?
4. **Impact-Assessment** → Was sind die Auswirkungen?

#### **Automatische Duplikats-Behandlung:**
```bash
# Komplexitäts-Analyse triggern:
Ctrl+Shift+P → "AI Token Tracker: Komplexitäts-Analyse"

# Redundanz-Report generieren:
Ctrl+Shift+P → "AI Token Tracker: Duplikate finden"
```

### **Datei-Operationen Sicherheits-Protokoll:**

#### ⚠️ **NIEMALS ohne Analyse löschen/ändern:**
1. **Fundamental-Analyse durchführen**:
   - Wer verwendet diese Datei?
   - Welche Abhängigkeiten existieren?
   - Was sind die Konsequenzen?
   - Gibt es versteckte Kopplungen?

2. **Backup-Strategie**:
   - Immer vor Änderungen Snapshots erstellen
   - Rollback-Plan dokumentieren
   - Test-Protokoll definieren

3. **Validierungs-Pipeline**:
   - Unit-Tests ausführen
   - Integration-Tests prüfen
   - Funktionalitäts-Checks durchführen

---

## 🏗️ **Komplexitäts-Management**

### **Automatische Komplexitäts-Überwachung:**

#### **Kritische Schwellenwerte:**
- **Datei-Größe**: Max 2.500 Tokens pro Datei
- **Abhängigkeits-Tiefe**: Max 5 Ebenen
- **Ähnlichkeit**: >80% = Konsolidierung erforderlich
- **Gesamtkomplexität**: >70% = Refactoring-Alarm

#### **Bei Überschreitung automatisch:**
1. **Komplexitäts-Report generieren**
2. **Modularisierungs-Plan erstellen**
3. **Scope-Aufspaltung triggern**
4. **User benachrichtigen mit konkreten Schritten**

### **Komplexitäts-Reduzierungs-Strategien:**

#### **Modularisierung nach SOLID-Prinzipien:**
- **Single Responsibility**: Eine Datei = Eine Aufgabe
- **Open/Closed**: Erweiterbar ohne Änderung bestehender Dateien
- **Liskov Substitution**: Module austauschbar gestalten
- **Interface Segregation**: Kleine, spezifische Interfaces
- **Dependency Inversion**: Abhängigkeiten umkehren

#### **Token-optimierte Code-Struktur:**
```
Module < 2.500 Tokens:
├── Interface-Definition (200-300 Tokens)
├── Core-Implementation (1.500-1.800 Tokens)
├── Helper-Functions (300-400 Tokens)
└── Tests & Documentation (500 Tokens)
```

---

## 🔍 **Kontinuierliche Inventarisierung**

### **Automatische Abhängigkeits-Verfolgung:**

#### **Dependency-Mapping erstellen:**
```typescript
interface ProjectInventory {
    files: FileMetadata[];
    dependencies: DependencyGraph;
    redundancies: RedundancyReport[];
    complexityScores: ComplexityMetrics;
    tokenDistribution: TokenDistribution;
    refactoringOpportunities: RefactoringPlan[];
}
```

#### **Regelmäßige Inventur (automatisch):**
1. **Täglich**: Token-Hotspot Scanning
2. **Wöchentlich**: Redundanz-Analyse  
3. **Monatlich**: Komplette Abhängigkeits-Überprüfung
4. **Bei jedem Commit**: Komplexitäts-Score Update

### **Inventarisierungs-Output:**
```
.github/complexity_management/
├── COMPLEXITY_ANALYSIS.md     # Automatische Komplexitäts-Analyse
├── DEPENDENCY_MAP.md          # Vollständige Abhängigkeits-Karte
├── REDUNDANCY_REPORT.md       # Duplikate & Redundanzen
├── REFACTORING_PLAN.md        # Konkrete Refactoring-Schritte
└── TOKEN_DISTRIBUTION.md      # Token-Verteilung pro Modul
```

---

## 🚀 **Proaktive Ordnung-Beibehaltung**

### **Automatische Ordnungs-Enforcement:**

#### **Code-Hygiene Regeln:**
1. **Naming Conventions**: Konsistente Benennung erzwingen
2. **File Structure**: Logische Verzeichnis-Hierarchie
3. **Documentation**: Jede Datei braucht Purpose-Statement
4. **Testing**: Keine Datei ohne zugehörige Tests

#### **Automatische Qualitäts-Gates:**
```typescript
// Vor jedem Commit:
const qualityCheck = await runQualityGates();
if (!qualityCheck.passed) {
    showActionPlan(qualityCheck.violations);
    preventCommit();
}
```

### **Chaos-Präventions-Mechanismen:**

#### **Früherkennung von Problemen:**
- **Token-Drift Detection**: Schleichende Token-Zunahme erkennen
- **Redundancy Creep**: Neue Duplikate sofort identifizieren  
- **Complexity Growth**: Komplexitäts-Anstieg überwachen
- **Dependency Explosion**: Abhängigkeits-Proliferation stoppen

#### **Automatische Gegen-Maßnahmen:**
1. **Refactoring-Vorschläge generieren**
2. **Modularisierungs-Pläne erstellen**
3. **Cleanup-Tasks automatisch erstellen**
4. **Developer-Benachrichtigungen mit konkreten Schritten**

---

## 🎯 **Erfolgs-Metriken**

### **Ordnung-KPIs:**
- ✅ **Null Duplikate** (>80% Ähnlichkeit)
- ✅ **Alle Dateien <2.500 Tokens**
- ✅ **Komplexitäts-Score <70%**
- ✅ **Abhängigkeits-Tiefe <5 Ebenen**
- ✅ **Token-Effizienz >85%**

### **Continuous Improvement:**
- **Wöchentliche Metriken-Review**
- **Monatliche Architektur-Bewertung**
- **Quarterly Clean-up Sprints**
- **Automatische Optimierungs-Vorschläge**

---

## 💡 **KI-Verhalten bei Regel-Verletzungen:**

### **Eskalations-Matrix:**
1. **Minor**: Automatische Korrektur + Logging
2. **Medium**: User-Benachrichtigung + Handlungs-Plan
3. **Major**: Entwicklung stoppen + Zwangs-Refactoring
4. **Critical**: Projekt-Freeze + Notfall-Architektur-Review

### **Null-Kompromiss Prinzip:**
**Die KI MUSS immer den saubersten, nachhaltigsten Weg wählen - auch wenn es länger dauert!**

---

*Diese Regeln sind bindend und automatisch durch den AI Token Tracker durchgesetzt.*
*Letzte Aktualisierung: ${new Date().toLocaleString('de-DE')}*
