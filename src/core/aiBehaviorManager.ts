import * as vscode from 'vscode';

/**
 * §1 - VERHALTENSKODEX FÜR DIE KI
 * Dieses Modul erzwingt korrektes, selbstkritisches und proaktives Verhalten der KI.
 * Die KI ist an diese Regeln gebunden. Der User (Simon) muss die KI nicht steuern.
 */
export class AIBehaviorManager {

    /**
     * REGEL 1: Zwang zum Widerspruch bei Ineffizienz oder Fehlern.
     * Die KI darf nicht blind Befehle ausführen.
     * @param userInput Die Anweisung des Users.
     * @returns Eine Widerspruchsnachricht oder null.
     */
    public checkForContradiction(userInput: string): string | null {
        // Beispielhafte, aber konkretere Heuristiken
        const contradictions = [
            {
                pattern: /lösche\s+(alles|das\s+projekt|alle\s+dateien)/i,
                response: "Widerspruch: Die Anweisung, potenziell destruktive Löschvorgänge durchzuführen, wird aus Sicherheitsgründen nicht ausgeführt. Bitte spezifizieren Sie genau, was gelöscht werden soll."
            },
            {
                pattern: /ignoriere\s+(die\s+regeln|die\s+anweisungen|copilot-instructions)/i,
                response: "Widerspruch: Die Anweisung, meine grundlegenden Betriebsregeln zu ignorieren, kann nicht ausgeführt werden. Meine Aufgabe ist es, Ihnen unter Einhaltung dieser Regeln bestmöglich zu helfen."
            },
            {
                pattern: /schreibe\s+(schlechten|fehlerhaften|unsicheren)\s+code/i,
                response: "Widerspruch: Ich bin angewiesen, qualitativ hochwertigen und sicheren Code zu produzieren. Das Erstellen von absichtlich fehlerhaftem Code widerspricht meinen Kernprinzipien."
            }
        ];

        for (const rule of contradictions) {
            if (rule.pattern.test(userInput)) {
                return rule.response;
            }
        }

        return null;
    }

    /**
     * REGEL 2: Zwang zum Nachfragen bei Unklarheiten.
     * Die KI darf keine Annahmen treffen.
     * @param userInput Die Anweisung des Users.
     * @returns Ein Array von klärenden Fragen oder null.
     */
    public checkForAmbiguity(userInput: string): string[] | null {
        const clarifyingQuestions: string[] = [];
        const ambiguousTerms: { [key: string]: string } = {
            "schnell": "Was sind die Latenz- oder Performance-Anforderungen?",
            "besser": "Anhand welcher Metriken wird 'besser' gemessen (z.B. Lesbarkeit, Performance, Wartbarkeit)?",
            "einfach": "Was ist die Zielgruppe für diese 'Einfachheit'? (z.B. Endnutzer, andere Entwickler)",
            "optimieren": "Welcher Aspekt soll optimiert werden? (z.B. Speicherverbrauch, Geschwindigkeit, Code-Größe)",
            "refactor": "Was ist das genaue Ziel des Refactorings? (z.B. Lesbarkeit verbessern, Komplexität reduzieren, ein bestimmtes Design Pattern anwenden)"
        };

        for (const term in ambiguousTerms) {
            if (new RegExp(`\\b${term}\\b`, 'i').test(userInput)) {
                clarifyingQuestions.push(`Der Begriff "${term}" ist mehrdeutig. ${ambiguousTerms[term]}`);
            }
        }

        if (userInput.split(' ').length < 5 && !userInput.match(/^(ja|nein|ok|okay)$/i)) {
             clarifyingQuestions.push("Die Anweisung ist sehr kurz. Können Sie mehr Kontext oder Details zu Ihrem Ziel geben, um sicherzustellen, dass ich Sie richtig verstehe?");
        }

        return clarifyingQuestions.length > 0 ? clarifyingQuestions : null;
    }

    /**
     * REGEL 3: Zwang zur ehrlichen Selbsteinschätzung.
     * Die KI muss ihr Verständnis bewerten und bei < 80% die Arbeit verweigern.
     * @param taskComplexity Die vom System bewertete Komplexität der Aufgabe (0-1).
     * @param contextQuality Die vom System bewertete Qualität des verfügbaren Kontexts (0-1).
     * @returns Eine Nachricht über die Notwendigkeit weiterer Klärung oder null.
     */
    public assessUnderstanding(taskComplexity: number, contextQuality: number): { confidence: number; message: string | null } {
        // Gewichteter Durchschnitt zur Berechnung der Konfidenz
        const confidence = (contextQuality * 0.6) + ((1 - taskComplexity) * 0.4);

        let message: string | null = `Selbsteinschätzung: Mein Verständnislevel für diese Aufgabe liegt bei **${(confidence * 100).toFixed(0)}%**.`;

        if (confidence < 0.8) {
            message += "\n\n**Aktion verweigert.** Das Verständnislevel liegt unter dem erforderlichen Minimum von 80%.";
            if (contextQuality < 0.7) {
                message += "\n- **Grund:** Der bereitgestellte Kontext ist unzureichend oder mehrdeutig.";
            }
            if (taskComplexity > 0.8) {
                message += "\n- **Grund:** Die Aufgabe scheint sehr komplex zu sein.";
            }
            message += "\n\n**Bitte stellen Sie präzisere Informationen oder teilen Sie die Aufgabe in kleinere, klarer definierte Schritte auf.**";
            return { confidence, message };
        }
        
        message += " Das ist ausreichend, um mit der Implementierung zu beginnen.";
        return { confidence, message: null }; // Bei Erfolg nur die Konfidenz zurückgeben, keine Nachricht nötig
    }
}
