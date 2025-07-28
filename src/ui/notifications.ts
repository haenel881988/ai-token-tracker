import * as vscode from 'vscode';
import { ScopeManager } from '../core/scopeManager';

/**
 * Notification Manager - Intelligente Benachrichtigungen für Token-Überwachung
 * 
 * Diese Klasse verwaltet alle Benachrichtigungen und Warnungen im Zusammenhang
 * mit Token-Verbrauch und hilft dabei, Halluzinationen zu verhindern.
 */
export class NotificationManager {
    private warningShown: Set<string> = new Set();
    private lastNotificationTime: Map<string, number> = new Map();

    constructor(private scopeManager: ScopeManager) {
        // Überwache Scope-Änderungen für automatische Benachrichtigungen
        this.startMonitoring();
    }

    /**
     * Zeigt eine Token-Warnung für einen Scope
     */
    showTokenWarning(scopeId: string, currentTokens: number, maxTokens: number): void {
        // Verhindere Spam von Warnungen
        if (this.warningShown.has(scopeId)) {
            return;
        }

        const percentage = (currentTokens / maxTokens) * 100;
        const remaining = maxTokens - currentTokens;

        let message: string = '';
        let actions: string[] = [];

        if (percentage >= 95) {
            message = `🚨 KRITISCH: ${Math.round(percentage)}% Token verbraucht in "${scopeId}"! AI-Halluzinationen drohen!`;
            actions = ['Scope zurücksetzen', 'Neue Session starten', 'Ignorieren'];
        } else if (percentage >= 90) {
            message = `⚠️ WARNUNG: ${Math.round(percentage)}% Token verbraucht. Nur noch ${remaining} Tokens übrig!`;
            actions = ['Scope zurücksetzen', 'Warnung ignorieren'];
        } else if (percentage >= 80) {
            message = `💡 INFO: ${Math.round(percentage)}% Token verbraucht. Bald könnte eine Zusammenfassung nötig sein.`;
            actions = ['Verstanden'];
        }

        if (message) {
            this.showNotificationWithActions(message, actions, scopeId);
            this.warningShown.add(scopeId);
        }
    }

    /**
     * Zeigt eine Benachrichtigung mit Aktionen
     */
    private async showNotificationWithActions(message: string, actions: string[], scopeId: string): Promise<void> {
        const choice = await vscode.window.showWarningMessage(message, ...actions);
        
        if (choice) {
            await this.handleNotificationAction(choice, scopeId);
        }
    }

    /**
     * Behandelt Benutzeraktionen aus Benachrichtigungen
     */
    private async handleNotificationAction(action: string, scopeId: string): Promise<void> {
        switch (action) {
            case 'Scope zurücksetzen':
                this.resetScope(scopeId);
                break;
            
            case 'Neue Session starten':
                this.startNewSession();
                break;
            
            case 'Warnung ignorieren':
                this.ignoreWarning(scopeId);
                break;
            
            case 'Verstanden':
                // Keine weitere Aktion nötig
                break;
        }
    }

    /**
     * Setzt einen Scope zurück
     */
    private resetScope(scopeId: string): void {
        const scope = this.scopeManager.getActiveScopes().find(s => s.id === scopeId);
        if (scope) {
            this.scopeManager.updateScope(scopeId, { currentTokens: 0 });
            this.warningShown.delete(scopeId);
            
            vscode.window.showInformationMessage(
                `Scope "${scope.name}" wurde zurückgesetzt. Token-Zähler steht auf 0.`
            );
        }
    }

    /**
     * Startet eine neue Session
     */
    private startNewSession(): void {
        const newScope = this.scopeManager.createSessionScope();
        this.scopeManager.switchToScope(newScope.id);
        
        vscode.window.showInformationMessage(
            `Neue Session "${newScope.name}" wurde gestartet. Frischer Token-Zähler aktiv!`
        );
    }

    /**
     * Ignoriert Warnungen für einen Scope
     */
    private ignoreWarning(scopeId: string): void {
        this.warningShown.add(scopeId);
        
        vscode.window.showInformationMessage(
            'Warnung wird für diesen Scope ignoriert. Sei vorsichtig mit hohem Token-Verbrauch!'
        );
    }

    /**
     * Zeigt eine Erfolgsmeldung
     */
    showSuccess(message: string): void {
        vscode.window.showInformationMessage(`✅ ${message}`);
    }

    /**
     * Zeigt eine allgemeine Information
     */
    showInfo(message: string): void {
        vscode.window.showInformationMessage(`💡 ${message}`);
    }

    /**
     * Zeigt einen Fehler
     */
    showError(message: string): void {
        vscode.window.showErrorMessage(`❌ ${message}`);
    }

    /**
     * Zeigt Tipps zur Token-Optimierung
     */
    showOptimizationTip(): void {
        const tips = [
            "Verwende kürzere, präzisere Prompts um Tokens zu sparen.",
            "Teile große Dateien in kleinere Scopes auf.",
            "Starte regelmäßig neue Sessions für komplexe Aufgaben.",
            "Lösche unnötige Kommentare vor AI-Interaktionen.",
            "Nutze Custom Scopes für verschiedene Features."
        ];
        
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        
        vscode.window.showInformationMessage(
            `💡 Token-Tipp: ${randomTip}`,
            'Mehr Tipps'
        ).then(choice => {
            if (choice === 'Mehr Tipps') {
                vscode.commands.executeCommand('aiTokenTracker.showDashboard');
            }
        });
    }

    /**
     * Startet die Überwachung für automatische Benachrichtigungen
     */
    private startMonitoring(): void {
        // Prüfe alle 10 Sekunden auf Token-Überschreitungen
        setInterval(() => {
            this.checkAllScopes();
        }, 10000);
    }

    /**
     * Prüft alle aktiven Scopes auf Token-Überschreitungen
     */
    private checkAllScopes(): void {
        const activeScopes = this.scopeManager.getActiveScopes();
        
        for (const scope of activeScopes) {
            const percentage = (scope.currentTokens / scope.maxTokens) * 100;
            
            if (percentage >= 80 && !this.warningShown.has(scope.id)) {
                this.showTokenWarning(scope.id, scope.currentTokens, scope.maxTokens);
            }
        }
    }

    /**
     * Setzt Warnungen für einen Scope zurück
     */
    resetWarnings(scopeId: string): void {
        this.warningShown.delete(scopeId);
        this.lastNotificationTime.delete(scopeId);
    }

    /**
     * Setzt alle Warnungen zurück
     */
    resetAllWarnings(): void {
        this.warningShown.clear();
        this.lastNotificationTime.clear();
    }
}
