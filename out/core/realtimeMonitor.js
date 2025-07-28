"use strict";
/**
 * Echtzeit Token Monitor - Kontinuierliche Token-Überwachung
 *
 * Diese Klasse überwacht Token-Verbrauch in Echtzeit und gibt
 * automatische Empfehlungen für optimale AI-Performance.
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
exports.RealtimeTokenMonitor = void 0;
const vscode = __importStar(require("vscode"));
const modelConfig_1 = require("./modelConfig");
class RealtimeTokenMonitor {
    constructor(scopeManager, tokenCounter) {
        this.scopeManager = scopeManager;
        this.tokenCounter = tokenCounter;
        this.chatStartTime = new Date();
        this.lastRecommendationTime = new Date(0);
        this.currentModel = modelConfig_1.ModelDetector.detectCurrentModel();
        this.startRealtimeMonitoring();
    }
    /**
     * Startet kontinuierliche Echtzeit-Überwachung
     */
    startRealtimeMonitoring() {
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
    updateRealtimeData() {
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
        const chatRecommendation = modelConfig_1.ChatRecommendationEngine.shouldRecommendNewChat(fileTokens, this.currentModel, chatAge, fileComplexity);
        // Kosten schätzen
        const estimatedCost = this.calculateEstimatedCost(fileTokens);
        const realtimeData = {
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
    calculateFileComplexity(content) {
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
    calculateEstimatedCost(tokens) {
        const costPer1k = this.currentModel.costPer1kTokens;
        return (tokens / 1000) * costPer1k;
    }
    /**
     * Behandelt automatische Empfehlungen
     */
    handleAutomaticRecommendations(data) {
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
    showChatRecommendation(recommendation, data) {
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
    getRecommendationActions(urgency) {
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
    async showRecommendationNotification(message, actions, urgency) {
        let choice;
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
    async handleRecommendationChoice(choice) {
        if (choice.includes('neue Session') || choice.includes('neuen Chat')) {
            // Neue Session starten
            const newScope = this.scopeManager.createSessionScope();
            this.scopeManager.switchToScope(newScope.id);
            this.chatStartTime = new Date();
            vscode.window.showInformationMessage(`✅ Neue Session "${newScope.name}" gestartet! Frischer Token-Zähler aktiv.`);
        }
        else if (choice.includes('erinnern')) {
            // Später erinnern (5 Minuten)
            setTimeout(() => {
                this.lastRecommendationTime = new Date(0); // Reset für erneute Empfehlung
            }, 5 * 60 * 1000);
        }
    }
    /**
     * Event: Datei wurde gewechselt
     */
    onFileChanged() {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            const filePath = activeEditor.document.uri.fsPath;
            this.scopeManager.switchToFileScope(filePath);
        }
    }
    /**
     * Event: Text wurde geändert
     */
    onTextChanged(event) {
        // Debounced Update nach Text-Änderung
        setTimeout(() => {
            this.updateRealtimeData();
        }, 1000);
    }
    /**
     * Gibt aktuelle Echtzeit-Daten zurück
     */
    getCurrentRealtimeData() {
        return this.updateRealtimeData();
    }
    /**
     * Wechselt AI-Modell
     */
    switchModel(modelKey) {
        const newModel = require('./modelConfig').AI_MODELS[modelKey];
        if (newModel) {
            this.currentModel = newModel;
            vscode.window.showInformationMessage(`🔄 Gewechselt zu ${newModel.name}`);
        }
    }
    /**
     * Cleanup
     */
    dispose() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }
    }
}
exports.RealtimeTokenMonitor = RealtimeTokenMonitor;
//# sourceMappingURL=realtimeMonitor.js.map