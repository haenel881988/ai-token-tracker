/**
 * GitHub Copilot Chat Integration - Automatische Token-Konsolidierung
 * 
 * Diese Klasse sorgt dafür, dass nach jeder Copilot-Änderung automatisch
 * die Token-Berechnung getriggert wird und dem Chat-Agenten präsentiert wird.
 */

import * as vscode from 'vscode';
import { RealtimeTokenMonitor } from './realtimeMonitor';
import { ScopeManager } from './scopeManager';
import { TokenCounter } from './tokenCounter';

export interface CopilotTokenSummary {
    currentFile: {
        path: string;
        tokens: number;
        percentage: number;
    };
    totalScope: {
        tokens: number;
        maxTokens: number;
        percentage: number;
    };
    recommendation: {
        action: 'continue' | 'split' | 'new_chat' | 'optimize';
        reason: string;
        urgency: 'low' | 'medium' | 'high' | 'critical';
    };
    models: {
        current: string;
        suggested: string;
        tokenLimit: number;
    };
}

export class CopilotAutoConsolidator {
    private monitor: RealtimeTokenMonitor;
    private isEnabled: boolean = true;
    private lastConsolidation: Date = new Date(0);
    private consolidationQueue: Set<string> = new Set();

    constructor(
        private scopeManager: ScopeManager,
        private tokenCounter: TokenCounter
    ) {
        this.monitor = new RealtimeTokenMonitor(scopeManager, tokenCounter);
        this.setupAutomaticTriggers();
    }

    /**
     * Setup automatische Trigger für Copilot-Events
     */
    private setupAutomaticTriggers(): void {
        // 1. Nach Text-Änderungen
        vscode.workspace.onDidChangeTextDocument((event) => {
            if (this.shouldTriggerConsolidation(event)) {
                this.queueConsolidation(event.document.uri.fsPath);
            }
        });

        // 2. Nach Datei-Speicherung
        vscode.workspace.onDidSaveTextDocument((document) => {
            this.queueConsolidation(document.uri.fsPath);
        });

        // 3. Bei Fokus-Wechsel
        vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor) {
                this.queueConsolidation(editor.document.uri.fsPath);
            }
        });

        // 4. Nach Copilot-Completions
        this.setupCopilotHooks();

        // 5. Periodische Konsolidierung
        setInterval(() => {
            this.processConsolidationQueue();
        }, 3000); // Alle 3 Sekunden
    }

    /**
     * Setup spezielle Hooks für GitHub Copilot Events
     */
    private setupCopilotHooks(): void {
        // Lausche auf Copilot Extension Events
        try {
            // Hook für Copilot Chat Nachrichten
            vscode.commands.registerCommand('aiTokenTracker.onCopilotChatMessage', () => {
                this.triggerImmediateConsolidation();
            });

            // Hook für Copilot Completions
            vscode.commands.registerCommand('aiTokenTracker.onCopilotCompletion', () => {
                this.triggerImmediateConsolidation();
            });

            // Überwache Copilot Chat Panel
            this.monitorCopilotChatPanel();

        } catch (error) {
            console.log('Copilot hooks setup failed:', error);
        }
    }

    /**
     * Überwacht das Copilot Chat Panel auf Aktivität
     */
    private monitorCopilotChatPanel(): void {
        // Überwache Terminal-Änderungen (Copilot Chat verwendet Terminals)
        vscode.window.onDidChangeTerminalState((terminal) => {
            if (this.isCopilotTerminal(terminal)) {
                this.triggerImmediateConsolidation();
            }
        });

        // Überwache neue Terminals (Copilot Chat)
        vscode.window.onDidOpenTerminal((terminal) => {
            if (this.isCopilotTerminal(terminal)) {
                this.triggerImmediateConsolidation();
            }
        });
    }

    /**
     * Prüft ob Terminal ein Copilot Chat Terminal ist
     */
    private isCopilotTerminal(terminal: vscode.Terminal): boolean {
        const name = terminal.name.toLowerCase();
        return name.includes('copilot') || 
               name.includes('chat') || 
               name.includes('github'); // GitHub Copilot Terminals
    }

    /**
     * Entscheidet ob eine Konsolidierung getriggert werden soll
     */
    private shouldTriggerConsolidation(event: vscode.TextDocumentChangeEvent): boolean {
        // Ignoriere triviale Änderungen
        if (event.contentChanges.length === 0) return false;
        
        // Ignoriere sehr kleine Änderungen (weniger als 10 Zeichen)
        const totalChanges = event.contentChanges.reduce((sum, change) => sum + change.text.length, 0);
        if (totalChanges < 10) return false;

        // Ignoriere Git-Dateien
        const filePath = event.document.uri.fsPath;
        if (filePath.includes('COMMIT_EDITMSG') || filePath.includes('.git')) {
            return false;
        }

        // Trigger bei Code-Dateien
        const extension = filePath.split('.').pop()?.toLowerCase();
        const codeExtensions = ['ts', 'js', 'py', 'java', 'cs', 'cpp', 'c', 'php', 'rb', 'go', 'rs'];
        return codeExtensions.includes(extension || '');
    }

    /**
     * Fügt Datei zur Konsolidierungs-Queue hinzu
     */
    private queueConsolidation(filePath: string): void {
        this.consolidationQueue.add(filePath);
    }

    /**
     * Sofortige Konsolidierung triggern
     */
    private triggerImmediateConsolidation(): void {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            this.performConsolidation(editor.document.uri.fsPath);
        }
    }

    /**
     * Verarbeitet die Konsolidierungs-Queue
     */
    private async processConsolidationQueue(): Promise<void> {
        if (this.consolidationQueue.size === 0) return;

        // Konsolidiere nur die zuletzt geänderte Datei
        const filePaths = Array.from(this.consolidationQueue);
        this.consolidationQueue.clear();

        for (const filePath of filePaths) {
            await this.performConsolidation(filePath);
        }
    }

    /**
     * Führt die eigentliche Token-Konsolidierung durch
     */
    private async performConsolidation(filePath: string): Promise<void> {
        try {
            // Rate-Limiting: Max 1x pro 2 Sekunden
            const now = new Date();
            if (now.getTime() - this.lastConsolidation.getTime() < 2000) {
                return;
            }
            this.lastConsolidation = now;

            // Token-Daten sammeln
            const tokenSummary = await this.generateTokenSummary(filePath);
            
            // An Copilot Chat weiterleiten
            await this.sendTokenSummaryToCopilot(tokenSummary);

            // Status Bar aktualisieren
            this.updateStatusBar(tokenSummary);

            // Notifications bei kritischen Zuständen
            this.handleCriticalStates(tokenSummary);

        } catch (error) {
            console.error('Token consolidation failed:', error);
        }
    }

    /**
     * Generiert zusammenfassende Token-Daten
     */
    private async generateTokenSummary(filePath: string): Promise<CopilotTokenSummary> {
        const realtimeData = this.monitor.getCurrentRealtimeData();
        
        if (!realtimeData) {
            throw new Error('Keine Token-Daten verfügbar');
        }
        
        return {
            currentFile: {
                path: filePath,
                tokens: realtimeData.currentTokens,
                percentage: realtimeData.percentage
            },
            totalScope: {
                tokens: realtimeData.currentTokens,
                maxTokens: realtimeData.maxTokens,
                percentage: realtimeData.percentage
            },
            recommendation: {
                action: this.determineRecommendedAction(realtimeData.percentage),
                reason: realtimeData.chatRecommendation.reason,
                urgency: realtimeData.chatRecommendation.urgency
            },
            models: {
                current: realtimeData.model.name,
                suggested: this.suggestOptimalModel(realtimeData.currentTokens),
                tokenLimit: realtimeData.model.maxTokens
            }
        };
    }

    /**
     * Bestimmt empfohlene Aktion basierend auf Token-Prozentsatz
     */
    private determineRecommendedAction(percentage: number): 'continue' | 'split' | 'new_chat' | 'optimize' {
        if (percentage >= 90) return 'new_chat';
        if (percentage >= 75) return 'split';
        if (percentage >= 50) return 'optimize';
        return 'continue';
    }

    /**
     * Schlägt optimales Modell vor
     */
    private suggestOptimalModel(currentTokens: number): string {
        if (currentTokens > 100000) return 'Gemini 2.5 Pro';
        if (currentTokens > 50000) return 'Claude Sonnet 4';
        if (currentTokens > 20000) return 'GPT-4o';
        return 'GPT-4.1';
    }

    /**
     * Sendet Token-Summary an Copilot Chat
     */
    private async sendTokenSummaryToCopilot(summary: CopilotTokenSummary): Promise<void> {
        // Erstelle formatierte Nachricht
        const message = this.formatTokenSummaryForCopilot(summary);

        // Verschiedene Methoden probieren, um Copilot zu erreichen
        await this.trySendToCopilotChat(message);
        await this.trySendToCopilotTerminal(message);
        await this.trySendToOutputChannel(message);
    }

    /**
     * Formatiert Token-Summary für Copilot Chat
     */
    private formatTokenSummaryForCopilot(summary: CopilotTokenSummary): string {
        const { currentFile, totalScope, recommendation, models } = summary;

        return `
🤖 **AI Token Tracker - Automatische Konsolidierung**

📊 **Aktuelle Token-Situation:**
• Datei: ${currentFile.path.split('\\').pop()}
• Tokens: ${currentFile.tokens.toLocaleString()} / ${models.tokenLimit.toLocaleString()}
• Auslastung: ${currentFile.percentage.toFixed(1)}%
• Modell: ${models.current}

${this.getRecommendationEmoji(recommendation.urgency)} **Empfehlung:**
• Aktion: ${recommendation.action.toUpperCase()}
• Grund: ${recommendation.reason}
• Dringlichkeit: ${recommendation.urgency.toUpperCase()}

${models.current !== models.suggested ? `💡 **Modell-Empfehlung:** Wechsel zu ${models.suggested} für bessere Performance` : ''}

---
*Diese Nachricht wurde automatisch nach Ihrer letzten Änderung generiert.*
        `.trim();
    }

    /**
     * Emoji für Empfehlungs-Dringlichkeit
     */
    private getRecommendationEmoji(urgency: string): string {
        switch (urgency) {
            case 'critical': return '🚨';
            case 'high': return '⚠️';
            case 'medium': return '💡';
            default: return '✅';
        }
    }

    /**
     * Versucht Nachricht an Copilot Chat zu senden
     */
    private async trySendToCopilotChat(message: string): Promise<void> {
        try {
            // Versuche Copilot Chat Command
            await vscode.commands.executeCommand('github.copilot.chat.focus');
            await vscode.commands.executeCommand('github.copilot.chat.sendMessage', message);
        } catch (error) {
            console.log('Direct Copilot chat failed:', error);
        }
    }

    /**
     * Versucht Nachricht an Copilot Terminal zu senden
     */
    private async trySendToCopilotTerminal(message: string): Promise<void> {
        try {
            const terminals = vscode.window.terminals;
            const copilotTerminal = terminals.find(t => this.isCopilotTerminal(t));
            
            if (copilotTerminal) {
                copilotTerminal.sendText(`# ${message.replace(/\n/g, '\n# ')}`);
            }
        } catch (error) {
            console.log('Copilot terminal failed:', error);
        }
    }

    /**
     * Sendet an Output Channel als Fallback
     */
    private async trySendToOutputChannel(message: string): Promise<void> {
        const outputChannel = vscode.window.createOutputChannel('AI Token Tracker - Copilot Integration');
        outputChannel.appendLine(message);
        outputChannel.show(true);
    }

    /**
     * Aktualisiert Status Bar mit aktuellen Daten
     */
    private updateStatusBar(summary: CopilotTokenSummary): void {
        const percentage = summary.currentFile.percentage;
        const icon = percentage >= 90 ? '🚨' : percentage >= 75 ? '⚠️' : '🤖';
        
        vscode.commands.executeCommand('aiTokenTracker.updateStatusBar', {
            text: `${icon} ${percentage.toFixed(1)}%`,
            tooltip: this.formatTokenSummaryForCopilot(summary)
        });
    }

    /**
     * Behandelt kritische Token-Zustände
     */
    private handleCriticalStates(summary: CopilotTokenSummary): void {
        const { percentage } = summary.currentFile;
        const { urgency } = summary.recommendation;

        if (urgency === 'critical') {
            vscode.window.showErrorMessage(
                `🚨 Token-Limit kritisch: ${percentage.toFixed(1)}% - Neuer Chat erforderlich!`,
                'Neuen Chat starten'
            ).then(selection => {
                if (selection) {
                    vscode.commands.executeCommand('github.copilot.chat.newChat');
                }
            });
        } else if (urgency === 'high') {
            vscode.window.showWarningMessage(
                `⚠️ Token-Limit hoch: ${percentage.toFixed(1)}% - Chat-Split empfohlen`,
                'Optimieren'
            );
        }
    }

    /**
     * Aktiviert/Deaktiviert automatische Konsolidierung
     */
    public setEnabled(enabled: boolean): void {
        this.isEnabled = enabled;
        
        if (enabled) {
            vscode.window.showInformationMessage('🤖 Copilot Auto-Konsolidierung aktiviert');
        } else {
            vscode.window.showInformationMessage('⏸️ Copilot Auto-Konsolidierung deaktiviert');
        }
    }

    /**
     * Manueller Trigger für Konsolidierung
     */
    public async manualConsolidation(): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            await this.performConsolidation(editor.document.uri.fsPath);
            vscode.window.showInformationMessage('✅ Token-Konsolidierung durchgeführt');
        }
    }

    /**
     * Cleanup
     */
    public dispose(): void {
        this.monitor.dispose();
    }
}
