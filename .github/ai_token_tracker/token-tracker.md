# 🤖 AI Token Tracker - Anleitung für KI

## 🎯 Überblick
Diese Anleitung erklärt der KI, wie der AI Token Tracker optimal zu verwenden ist.

## 🔍 Token-Status verstehen

### Status Bar Anzeige
```
[🤖 45.2%] ← Live Token-Anzeige klicken für Details
```

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
   ```
   docs/ai_token_tracker/scopes_ad/
   ├── 01_current_task/
   ├── 02_sub_task_a/
   ├── 03_sub_task_b/
   ├── 04_tests/
   └── 05_documentation/
   ```
4. **TODO**: Aufgabenliste generieren
5. **Focus**: Ersten Sub-Task starten

### Modularisierungs-Commands
```bash
# Modularisierungs-Workflow starten
Ctrl+Shift+P → "AI Token Tracker: Projekt modularisieren"

# Scope-Management
Ctrl+Shift+P → "AI Token Tracker: Neuen Scope erstellen"
```

## 📊 Brutto vs. Netto Tokens

### Token-Kette verstehen
- **Brutto-Tokens**: Alle Tokens im Chat (Verlauf + Anweisungen + Code)
- **Netto-Tokens**: Verfügbare Tokens für neue Eingaben
- **Overhead**: ~20-30% für Chat-Verlauf und System-Prompts

### Break-Even Point Algorithmus
```typescript
// Intelligente Token-Berechnung
const nettoTokens = bruttoTokens * 0.7; // 30% Overhead
const complexityFactor = fileComplexity > 0.8 ? 0.6 : 0.8;
const effectiveLimit = nettoTokens * complexityFactor;

if (currentTokens > effectiveLimit) {
    // Chat-Split empfohlen
}
```

## 🎯 SMART Prompt-Template

### Für optimale Token-Nutzung:
```markdown
**Rolle**: [Spezifische Expertenrolle]
**Ziel**: [Konkretes, messbares Ziel]
**Kontext**: [Minimaler, relevanter Kontext]
**Aktion**: [Spezifische Aktion]
**Ergebnis**: [Erwartetes Format/Ergebnis]
**Constraints**: [Token-Limit, Zeit, Scope]
```

### Beispiel:
```markdown
**Rolle**: TypeScript Entwickler
**Ziel**: Token-Counter Klasse optimieren  
**Kontext**: AI Token Tracker Extension, tiktoken Library
**Aktion**: Refactor für bessere Performance
**Ergebnis**: Optimierte Klasse mit Tests
**Constraints**: Max 500 Tokens, fokus auf Core-Logik
```

## 🔄 Automatische Integration

### Extension sendet automatisch:
- Token-Status nach jeder Änderung
- Empfehlungen bei kritischen Limits
- Modell-Switching Vorschläge
- Scope-Management Updates

### Chat-Nachrichten Format:
```
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
```

## 🛠️ Troubleshooting

### Häufige Szenarien:
1. **Token-Anzeige fehlt**: Extension aktiviert? Status Bar sichtbar?
2. **Falsche Limits**: Modell-Erkennung prüfen, manuell wechseln
3. **Zu viele Nachrichten**: Rate-Limiting anpassen
4. **Chat-Integration**: Fallback-Methoden werden automatisch probiert

### Quick-Fixes:
```bash
# Extension neu laden
Ctrl+Shift+P → "Developer: Reload Window"

# Manuelle Token-Berechnung
Ctrl+Shift+P → "AI Token Tracker: Manuelle Konsolidierung"
```

---

## 🎯 Fazit für KI

**Verwende immer:**
1. ✅ Token-Status vor großen Änderungen prüfen
2. ✅ Bei 75%+ automatisch Aufgaben splitten  
3. ✅ SMART-Prompts für optimale Token-Nutzung
4. ✅ Scope-basierte Modularisierung befolgen
5. ✅ Bei 90%+ sofort neuen Chat starten

**Die Extension unterstützt dich automatisch - vertraue den Empfehlungen!** 🚀
