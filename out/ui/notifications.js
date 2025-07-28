"use strict";
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
exports.NotificationManager = void 0;
const vscode = __importStar(require("vscode"));
/**
 * Notification Manager - Intelligente Benachrichtigungen für Token-Überwachung
 *
 * Diese Klasse verwaltet alle Benachrichtigungen und Warnungen im Zusammenhang
 * mit Token-Verbrauch und hilft dabei, Halluzinationen zu verhindern.
 */
class NotificationManager {
    constructor(scopeManager) {
        this.scopeManager = scopeManager;
        this.warningShown = new Set();
        this.lastNotificationTime = new Map();
        // Überwache Scope-Änderungen für automatische Benachrichtigungen
        this.startMonitoring();
    }
    /**
     * Zeigt eine Token-Warnung für einen Scope
     */
    showTokenWarning(scopeId, currentTokens, maxTokens) {
        // Verhindere Spam von Warnungen
        if (this.warningShown.has(scopeId)) {
            return;
        }
        const percentage = (currentTokens / maxTokens) * 100;
        const remaining = maxTokens - currentTokens;
        let message = '';
        let actions = [];
        if (percentage >= 95) {
            message = `🚨 KRITISCH: ${Math.round(percentage)}% Token verbraucht in "${scopeId}"! AI-Halluzinationen drohen!`;
            actions = ['Scope zurücksetzen', 'Neue Session starten', 'Ignorieren'];
        }
        else if (percentage >= 90) {
            message = `⚠️ WARNUNG: ${Math.round(percentage)}% Token verbraucht. Nur noch ${remaining} Tokens übrig!`;
            actions = ['Scope zurücksetzen', 'Warnung ignorieren'];
        }
        else if (percentage >= 80) {
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
    async showNotificationWithActions(message, actions, scopeId) {
        const choice = await vscode.window.showWarningMessage(message, ...actions);
        if (choice) {
            await this.handleNotificationAction(choice, scopeId);
        }
    }
    /**
     * Behandelt Benutzeraktionen aus Benachrichtigungen
     */
    async handleNotificationAction(action, scopeId) {
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
    resetScope(scopeId) {
        const scope = this.scopeManager.getActiveScopes().find(s => s.id === scopeId);
        if (scope) {
            this.scopeManager.updateScope(scopeId, { currentTokens: 0 });
            this.warningShown.delete(scopeId);
            vscode.window.showInformationMessage(`Scope "${scope.name}" wurde zurückgesetzt. Token-Zähler steht auf 0.`);
        }
    }
    /**
     * Startet eine neue Session
     */
    startNewSession() {
        const newScope = this.scopeManager.createSessionScope();
        this.scopeManager.switchToScope(newScope.id);
        vscode.window.showInformationMessage(`Neue Session "${newScope.name}" wurde gestartet. Frischer Token-Zähler aktiv!`);
    }
    /**
     * Ignoriert Warnungen für einen Scope
     */
    ignoreWarning(scopeId) {
        this.warningShown.add(scopeId);
        vscode.window.showInformationMessage('Warnung wird für diesen Scope ignoriert. Sei vorsichtig mit hohem Token-Verbrauch!');
    }
    /**
     * Zeigt eine Erfolgsmeldung
     */
    showSuccess(message) {
        vscode.window.showInformationMessage(`✅ ${message}`);
    }
    /**
     * Zeigt eine allgemeine Information
     */
    showInfo(message) {
        vscode.window.showInformationMessage(`💡 ${message}`);
    }
    /**
     * Zeigt einen Fehler
     */
    showError(message) {
        vscode.window.showErrorMessage(`❌ ${message}`);
    }
    /**
     * Zeigt Tipps zur Token-Optimierung
     */
    showOptimizationTip() {
        const tips = [
            "Verwende kürzere, präzisere Prompts um Tokens zu sparen.",
            "Teile große Dateien in kleinere Scopes auf.",
            "Starte regelmäßig neue Sessions für komplexe Aufgaben.",
            "Lösche unnötige Kommentare vor AI-Interaktionen.",
            "Nutze Custom Scopes für verschiedene Features."
        ];
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        vscode.window.showInformationMessage(`💡 Token-Tipp: ${randomTip}`, 'Mehr Tipps').then(choice => {
            if (choice === 'Mehr Tipps') {
                vscode.commands.executeCommand('aiTokenTracker.showDashboard');
            }
        });
    }
    /**
     * Startet die Überwachung für automatische Benachrichtigungen
     */
    startMonitoring() {
        // Prüfe alle 10 Sekunden auf Token-Überschreitungen
        setInterval(() => {
            this.checkAllScopes();
        }, 10000);
    }
    /**
     * Prüft alle aktiven Scopes auf Token-Überschreitungen
     */
    checkAllScopes() {
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
    resetWarnings(scopeId) {
        this.warningShown.delete(scopeId);
        this.lastNotificationTime.delete(scopeId);
    }
    /**
     * Setzt alle Warnungen zurück
     */
    resetAllWarnings() {
        this.warningShown.clear();
        this.lastNotificationTime.clear();
    }
}
exports.NotificationManager = NotificationManager;
//# sourceMappingURL=notifications.js.map