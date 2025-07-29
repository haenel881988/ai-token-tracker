import { TokenCounter } from './tokenCounter';
import { AIBehaviorManager } from './aiBehaviorManager';
import { ConfigManager } from './configManager';

/**
 * Context Auditor - Analysiert Chat-Kontext für automatische KI-Selbstregulierung
 * 
 * Diese Klasse wird von der KI (Chat-Gehirn) verwendet, um den aktuellen
 * Chat-Verlauf zu analysieren und Risiken für Token-Überlauf zu bewerten.
 * 
 * Ziel: Vollautomatische Blindheits-Prävention ohne User-Interaktion.
 */

export interface ContextAuditResult {
    tokenCount: number;
    maxTokens: number;
    usagePercentage: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    status: 'ok' | 'warning' | 'critical';
    recommendation: string;
    behaviorChecks: {
        contradiction?: string;
        ambiguities?: string[];
        understanding: {
            confidence: number;
            message?: string;
        };
    };
    shouldSplitTask: boolean;
    shouldStartNewChat: boolean;
}

export class ContextAuditor {
    private tokenCounter: TokenCounter;
    private behaviorManager: AIBehaviorManager;
    private configManager: ConfigManager;

    constructor(tokenCounter: TokenCounter, behaviorManager: AIBehaviorManager, configManager: ConfigManager) {
        this.tokenCounter = tokenCounter;
        this.behaviorManager = behaviorManager;
        this.configManager = configManager;
    }

    /**
     * Analysiert den Chat-Kontext und gibt eine vollständige Risikobewertung zurück.
     * Diese Methode wird automatisch von der KI aufgerufen, bevor sie Aktionen durchführt.
     * 
     * @param chatContext Der vollständige Chat-Verlauf als String
     * @param currentTask Die aktuelle Aufgabe (optional, für bessere Kontextbewertung)
     * @returns Vollständige Audit-Ergebnisse mit Handlungsempfehlungen
     */
    public analyze(chatContext: string, currentTask?: string): ContextAuditResult {
        // Token-Analyse
        const tokenCount = this.tokenCounter.countTokens(chatContext);
        const maxTokens = this.configManager.get('maxTokensPerChat', 64000);
        const usagePercentage = (tokenCount / maxTokens) * 100;

        // Risiko-Level bestimmen
        let riskLevel: 'low' | 'medium' | 'high' | 'critical';
        let status: 'ok' | 'warning' | 'critical';
        let recommendation: string;
        let shouldSplitTask = false;
        let shouldStartNewChat = false;

        if (usagePercentage >= 95) {
            riskLevel = 'critical';
            status = 'critical';
            recommendation = 'SOFORTIGER STOPP: Chat-Neustart zwingend erforderlich. KI-Halluzinationen extrem wahrscheinlich.';
            shouldStartNewChat = true;
            shouldSplitTask = true;
        } else if (usagePercentage >= 85) {
            riskLevel = 'critical';
            status = 'critical';
            recommendation = 'KRITISCH: Aktuelle Aufgabe beenden und neuen Chat starten. Keine komplexen Operationen mehr.';
            shouldStartNewChat = true;
            shouldSplitTask = true;
        } else if (usagePercentage >= 75) {
            riskLevel = 'high';
            status = 'warning';
            recommendation = 'WARNUNG: Aufgabe in kleinere Teile splitten. Nach aktueller Aufgabe neuen Chat starten.';
            shouldSplitTask = true;
        } else if (usagePercentage >= 60) {
            riskLevel = 'medium';
            status = 'warning';
            recommendation = 'ACHTUNG: Token-Verbrauch überwachen. Komplexe Aufgaben vermeiden.';
        } else {
            riskLevel = 'low';
            status = 'ok';
            recommendation = 'Kontextgröße unbedenklich. Normale Operationen möglich.';
        }

        // Verhaltens-Checks durchführen
        const contradiction = this.behaviorManager.checkForContradiction(chatContext);
        const ambiguities = this.behaviorManager.checkForAmbiguity(chatContext);
        
        // Verständnis-Check (Komplexität basierend auf Token-Count und Aufgabenbeschreibung)
        const taskComplexity = currentTask ? this.assessTaskComplexity(currentTask) : 0.5;
        const contextQuality = Math.max(0.1, 1 - (usagePercentage / 100)); // Je höher Token-Count, desto schlechter Context-Quality
        const understanding = this.behaviorManager.assessUnderstanding(taskComplexity, contextQuality);

        return {
            tokenCount,
            maxTokens,
            usagePercentage,
            riskLevel,
            status,
            recommendation,
            behaviorChecks: {
                contradiction: contradiction || undefined,
                ambiguities: ambiguities && ambiguities.length > 0 ? ambiguities : undefined,
                understanding: {
                    confidence: understanding.confidence,
                    message: understanding.message || undefined
                }
            },
            shouldSplitTask,
            shouldStartNewChat
        };
    }

    /**
     * Erstellt einen formatierten Report für interne KI-Entscheidungen
     */
    public generateInternalReport(result: ContextAuditResult): string {
        let report = `🤖 KI-INTERNE KONTEXT-ANALYSE\n`;
        report += `=====================================\n`;
        report += `Token-Status: ${result.tokenCount}/${result.maxTokens} (${result.usagePercentage.toFixed(1)}%)\n`;
        report += `Risiko-Level: ${result.riskLevel.toUpperCase()}\n`;
        report += `Status: ${result.status.toUpperCase()}\n`;
        report += `Empfehlung: ${result.recommendation}\n\n`;

        if (result.behaviorChecks.contradiction) {
            report += `⚠️  WIDERSPRUCH: ${result.behaviorChecks.contradiction}\n`;
        }

        if (result.behaviorChecks.ambiguities) {
            report += `❓ MEHRDEUTIGKEITEN:\n`;
            result.behaviorChecks.ambiguities.forEach(q => {
                report += `   - ${q}\n`;
            });
        }

        if (result.behaviorChecks.understanding.message) {
            report += `🧠 VERSTÄNDNIS: ${result.behaviorChecks.understanding.message}\n`;
        }

        report += `\n🚨 AKTIONS-FLAGS:\n`;
        report += `   Aufgabe splitten: ${result.shouldSplitTask ? 'JA' : 'NEIN'}\n`;
        report += `   Neuer Chat nötig: ${result.shouldStartNewChat ? 'JA' : 'NEIN'}\n`;

        return report;
    }

    /**
     * Erstellt einen minimalen Report für den User (nur bei kritischen Zuständen)
     */
    public generateUserReport(result: ContextAuditResult): string | null {
        if (result.status === 'critical') {
            return `🔴 **TOKEN-WARNUNG**: Chat-Verlauf hat ${result.usagePercentage.toFixed(0)}% der empfohlenen Limits erreicht. ${result.recommendation}`;
        }
        if (result.status === 'warning' && result.usagePercentage > 80) {
            return `🟠 **HINWEIS**: Token-Auslastung bei ${result.usagePercentage.toFixed(0)}%. Es wird empfohlen, nach dieser Aufgabe einen neuen Chat zu starten.`;
        }
        return null; // Kein Report nötig bei unkritischen Zuständen
    }

    /**
     * Bewertet die Komplexität einer Aufgabe basierend auf Keywords und Länge
     */
    private assessTaskComplexity(task: string): number {
        const complexKeywords = [
            'refactor', 'implement', 'create', 'build', 'design', 'architect',
            'optimize', 'analyze', 'debug', 'fix', 'integrate', 'migrate'
        ];
        
        const simpleKeywords = [
            'show', 'display', 'list', 'print', 'copy', 'move', 'delete'
        ];

        let complexity = 0.5; // Basis-Komplexität

        // Keyword-basierte Bewertung
        const taskLower = task.toLowerCase();
        complexKeywords.forEach(keyword => {
            if (taskLower.includes(keyword)) {
                complexity += 0.1;
            }
        });

        simpleKeywords.forEach(keyword => {
            if (taskLower.includes(keyword)) {
                complexity -= 0.1;
            }
        });

        // Längen-basierte Bewertung
        if (task.length > 200) complexity += 0.2;
        if (task.length > 500) complexity += 0.2;

        return Math.max(0.1, Math.min(1.0, complexity));
    }
}
