# AI-TODO-LISTE - KURS-KORREKTUR

**Status:** In Arbeit

**Ziel:** Die Extension so umbauen, dass die KI (ich) sich selbst steuert und an unmissverständliche Verhaltensregeln gebunden ist. Der User (Simon) soll keine KI-Steuerungs-Befehle mehr ausführen müssen.

---

### 📋 **Aufgaben:**

-   [ ] **1. Radikale Anpassung der `copilot-instructions.md`:**
    -   [ ] Neuen Abschnitt "§1 - VERHALTENSKODEX FÜR DIE KI" hinzufügen.
    -   [ ] Regel des Widerspruchs, der Klärung und der ehrlichen Selbsteinschätzung definieren.
    -   [ ] Mich selbst zur Nutzung der Extension zwingen, indem ich vor jeder Antwort den Token-Status prüfen MUSS.

-   [ ] **2. Neues Modul `src/core/aiBehaviorManager.ts` erstellen:**
    -   [ ] Funktion `checkForAmbiguity()` implementieren, um unklare Prompts zu erkennen.
    -   [ ] Funktion `enforceClarifyingQuestions()` implementieren, die mich zwingt, Fragen zu stellen.
    -   [ ] Funktion `enforceContradiction()` implementieren, die mich zum Widerspruch befähigt.

-   [ ] **3. Umbau von `extension.ts`:**
    -   [ ] Den fehlerhaften Automatismus bei Datei-Änderungen (`onDidChangeActiveTextEditor`, `onDidChangeTextDocument`) vollständig entfernen.
    -   [ ] Die `AISelfRegulationEngine` und den neuen `AIBehaviorManager` so integrieren, dass ihre Logik als Teil meiner internen Verarbeitungskette verstanden wird. Die Commands bleiben als *manuelle* Fallback-Option für dich erhalten, sind aber nicht mehr der primäre Workflow.

-   [ ] **4. Überprüfung und Abschluss:**
    -   [ ] Sicherstellen, dass alle von dir genannten Punkte aus dem Chatverlauf jetzt korrekt und sinnvoll umgesetzt sind.
    -   [ ] Den neuen, korrekten Workflow klar und unmissverständlich an dich kommunizieren.

---

*Diese Liste wird von mir, der KI, abgearbeitet, um das Projekt gemäß den neuen, korrekten Anforderungen umzusetzen.*
