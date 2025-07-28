/**
 * Echtzeit Token Monitor - Kontinuierliche Token-Überwachung
 * 
 * Diese Klasse überwacht Token-Verbrauch in Echtzeit und gibt 
 * automatische Empfehlungen für optimale AI-Performance.
 */

import * as vscode from 'vscode';
import { ScopeManager } from './scopeManager';
import { TokenCounter } from './tokenCounter';
import { ModelDetector, ChatRecommendationEngine, AIModelConfig } from './modelConfig';

export interface RealtimeTokenData {
    currentTokens: number;
    maxTokens: number;
    percentage: number;
    model: AIModelConfig;
    chatRecommendation: any;
    fileComplexity: number;
    estimatedCost: number;
}

export class RealtimeTokenMonitor {
    private currentModel: AIModelConfig;
    private monitoringInterval: NodeJS.Timeout | undefined;
    private chatStartTime: Date = new Date();
    private lastRecommendationTime: Date = new Date(0);

    constructor(
        private scopeManager: ScopeManager,
        private tokenCounter: TokenCounter
    ) {
        this.currentModel = ModelDetector.detectCurrentModel();
        this.startRealtimeMonitoring();
    }

    /**
     * Startet kontinuierliche Echtzeit-Überwachung
     */
    private startRealtimeMonitoring(): void {
        // Update alle 2 Sekunden für Echtzeit-Gefühl
        this.monitoringInterval = setInterval(() => {
            this.updateRealtimeData();
        }, 2000);

        // Datei-Wechsel überwachen
        vscode.window.onDidChangeActiveTextEditor(() => {
            this.onFileChanged();
        });

        // Text-Änderungen überwachen
        vscode.workspace.onDidChangeTextDocument((event) => {
            this.onTextChanged(event);
        });
    }

    /**
     * Aktualisiert Echtzeit-Token-Daten
     */
    private updateRealtimeData(): RealtimeTokenData | null {
        const currentScope = this.scopeManager.getCurrentScope();
        if (!currentScope) {
            return null;
        }

        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            return null;
        }

        // Berechne aktuelle Token
        const fileContent = activeEditor.document.getText();
        const fileTokens = this.tokenCounter.countTokens(fileContent);
        
        // Update Scope
        this.scopeManager.updateScopeTokens(currentScope.id, fileTokens);

        // Berechne Datei-Komplexität
        const fileComplexity = this.calculateFileComplexity(fileContent);

        // Chat-Empfehlung prüfen
        const chatAge = (Date.now() - this.chatStartTime.getTime()) / 1000 / 60; // Minuten
        const chatRecommendation = ChatRecommendationEngine.shouldRecommendNewChat(
            fileTokens,
            this.currentModel,
            chatAge,
            fileComplexity
        );

        // Kosten schätzen
        const estimatedCost = this.calculateEstimatedCost(fileTokens);

        const realtimeData: RealtimeTokenData = {
            currentTokens: fileTokens,
            maxTokens: this.currentModel.maxTokens,
            percentage: (fileTokens / this.currentModel.maxTokens) * 100,
            model: this.currentModel,
            chatRecommendation,
            fileComplexity,
            estimatedCost
        };

        // Automatische Empfehlungen anzeigen
        this.handleAutomaticRecommendations(realtimeData);

        return realtimeData;
    }

    /**
     * Berechnet Datei-Komplexität (0-1)
     */
    private calculateFileComplexity(content: string): number {
        const lines = content.split('\n');
        const avgLineLength = content.length / lines.length;
        const functionCount = (content.match(/function|class|interface|const|let|var/g) || []).length;
        const commentDensity = (content.match(/\/\/|\/\*|\*\/|#|"""|'''/g) || []).length / lines.length;
        
        // Komplexitäts-Score (0-1)
        let complexity = 0;
        complexity += Math.min(lines.length / 1000, 0.3); // Länge
        complexity += Math.min(avgLineLength / 100, 0.2); // Zeilen-Länge
        complexity += Math.min(functionCount / 50, 0.3); // Code-Dichte
        complexity += Math.min(commentDensity, 0.2); // Kommentar-Dichte
        
        return Math.min(complexity, 1);
    }

    /**
     * Schätzt Kosten basierend auf Token-Verbrauch
     */
    private calculateEstimatedCost(tokens: number): number {
        const costPer1k = this.currentModel.costPer1kTokens;
        return (tokens / 1000) * costPer1k;
    }

    /**
     * Behandelt automatische Empfehlungen
     */
    private handleAutomaticRecommendations(data: RealtimeTokenData): void {
        const now = new Date();
        const timeSinceLastRecommendation = now.getTime() - this.lastRecommendationTime.getTime();
        
        // Verhindere Spam (mindestens 30 Sekunden zwischen Empfehlungen)
        if (timeSinceLastRecommendation < 30000) {
            return;
        }

        const recommendation = data.chatRecommendation;
        
        if (recommendation.shouldStart) {
            this.showChatRecommendation(recommendation, data);
            this.lastRecommendationTime = now;
        }
    }

    /**
     * Zeigt Chat-Empfehlung als Notification
     */
    private showChatRecommendation(recommendation: any, data: RealtimeTokenData): void {
        const percentage = Math.round(data.percentage);
        const cost = data.estimatedCost.toFixed(4);
        
        let message = recommendation.reason;
        message += `\n\nAktuell: ${data.currentTokens}/${data.maxTokens} Tokens (${percentage}%)`;
        if (data.estimatedCost > 0) {
            message += `\nGeschätzte Kosten: $${cost}`;
        }

        const actions = this.getRecommendationActions(recommendation.urgency);

        this.showRecommendationNotification(message, actions, recommendation.urgency);
    }

    /**
     * Gibt Aktionen basierend auf Dringlichkeit zurück
     */
    private getRecommendationActions(urgency: string): string[] {
        switch (urgency) {
            case 'critical':
                return ['🚨 Sofort neue Session', 'Später erinnern', 'Ignorieren'];
            case 'high':
                return ['⚠️ Neuen Chat starten', 'In 5 Min erinnern', 'Ignorieren'];
            case 'medium':
                return ['💡 Neuen Chat starten', 'Später', 'OK'];
            default:
                return ['🔄 Neuen Chat starten', 'OK'];
        }
    }

    /**
     * Zeigt Empfehlungs-Notification
     */
    private async showRecommendationNotification(
        message: string, 
        actions: string[], 
        urgency: string
    ): Promise<void> {
        let choice: string | undefined;

        switch (urgency) {
            case 'critical':
                choice = await vscode.window.showErrorMessage(message, ...actions);
                break;
            case 'high':
                choice = await vscode.window.showWarningMessage(message, ...actions);
                break;
            default:
                choice = await vscode.window.showInformationMessage(message, ...actions);
        }

        if (choice) {
            await this.handleRecommendationChoice(choice);
        }
    }

    /**
     * Behandelt Benutzer-Auswahl bei Empfehlungen
     */
    private async handleRecommendationChoice(choice: string): Promise<void> {
        if (choice.includes('neue Session') || choice.includes('neuen Chat')) {
            // Neue Session starten
            const newScope = this.scopeManager.createSessionScope();
            this.scopeManager.switchToScope(newScope.id);
            this.chatStartTime = new Date();
            
            vscode.window.showInformationMessage(
                `✅ Neue Session "${newScope.name}" gestartet! Frischer Token-Zähler aktiv.`
            );
        } else if (choice.includes('erinnern')) {
            // Später erinnern (5 Minuten)
            setTimeout(() => {
                this.lastRecommendationTime = new Date(0); // Reset für erneute Empfehlung
            }, 5 * 60 * 1000);
        }
    }

    /**
     * Event: Datei wurde gewechselt
     */
    private onFileChanged(): void {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            const filePath = activeEditor.document.uri.fsPath;
            this.scopeManager.switchToFileScope(filePath);
        }
    }

    /**
     * Event: Text wurde geändert
     */
    private onTextChanged(event: vscode.TextDocumentChangeEvent): void {
        // Debounced Update nach Text-Änderung
        setTimeout(() => {
            this.updateRealtimeData();
        }, 1000);
    }

    /**
     * Gibt aktuelle Echtzeit-Daten zurück
     */
    getCurrentRealtimeData(): RealtimeTokenData | null {
        return this.updateRealtimeData();
    }

    /**
     * Wechselt AI-Modell
     */
    switchModel(modelKey: string): void {
        const newModel = require('./modelConfig').AI_MODELS[modelKey];
        if (newModel) {
            this.currentModel = newModel;
            vscode.window.showInformationMessage(`🔄 Gewechselt zu ${newModel.name}`);
        }
    }

    /**
     * Cleanup
     */
    dispose(): void {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }
    }
}
