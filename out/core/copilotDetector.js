"use strict";
/**
 * GitHub Copilot Chat Detection - Automatische Erkennung von Modus und Modell
 *
 * Diese Klasse erkennt automatisch welcher GitHub Copilot Chat Modus aktiv ist
 * und welches Modell verwendet wird, um die Token-Limits entsprechend anzupassen.
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
exports.CopilotChatDetector = void 0;
const vscode = __importStar(require("vscode"));
const modelConfig_1 = require("./modelConfig");
class CopilotChatDetector {
    constructor() {
        this.statusChangeListeners = [];
        this.currentState = {
            mode: 'unknown',
            model: 'gpt-4o',
            modelConfig: modelConfig_1.AI_MODELS['gpt-4o'],
            isActive: false,
            lastDetected: new Date()
        };
        this.startDetection();
    }
    /**
     * Startet kontinuierliche Erkennung
     */
    startDetection() {
        // Initiale Erkennung
        this.detectCurrentState();
        // Überwache Extension-Änderungen
        vscode.extensions.onDidChange(() => {
            this.detectCurrentState();
        });
        // Überwache Workspace-Konfiguration
        vscode.workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration('github.copilot')) {
                this.detectCurrentState();
            }
        });
        // Kontinuierliche Überprüfung alle 10 Sekunden
        this.detectionInterval = setInterval(() => {
            this.detectCurrentState();
        }, 10000);
    }
    /**
     * Erkennt aktuellen GitHub Copilot Chat Status
     */
    async detectCurrentState() {
        const previousState = { ...this.currentState };
        // 1. Prüfe ob GitHub Copilot Chat Extension installiert und aktiv ist
        const copilotExtension = vscode.extensions.getExtension('GitHub.copilot-chat');
        const isActive = copilotExtension?.isActive || false;
        // 2. Erkenne aktuelles Modell
        const detectedModel = await this.detectActiveModel();
        // 3. Erkenne Chat-Modus
        const detectedMode = await this.detectChatMode();
        // 4. Update State
        this.currentState = {
            mode: detectedMode,
            model: detectedModel,
            modelConfig: this.getModelConfig(detectedModel),
            isActive,
            lastDetected: new Date()
        };
        // 5. Benachrichtige Listener wenn sich etwas geändert hat
        if (this.hasStateChanged(previousState, this.currentState)) {
            this.notifyStateChange();
        }
    }
    /**
     * Erkennt das aktive AI-Modell
     */
    async detectActiveModel() {
        try {
            // Methode 1: Prüfe GitHub Copilot Settings
            const copilotConfig = vscode.workspace.getConfiguration('github.copilot.chat');
            const selectedModel = copilotConfig.get('model');
            if (selectedModel) {
                return this.mapCopilotModelToOur(selectedModel);
            }
            // Methode 2: Analysiere aktive Chat-Panels
            const activeModel = await this.analyzeActiveChatPanels();
            if (activeModel) {
                return activeModel;
            }
            // Methode 3: Prüfe zuletzt verwendetes Modell aus Settings
            const lastUsedModel = await this.getLastUsedModel();
            if (lastUsedModel) {
                return lastUsedModel;
            }
            // Fallback: GPT-4o als Standard
            return 'gpt-4o';
        }
        catch (error) {
            console.warn('Konnte aktives Modell nicht erkennen:', error);
            return 'gpt-4o';
        }
    }
    /**
     * Mappt GitHub Copilot Modell-Namen zu unseren Bezeichnungen
     */
    mapCopilotModelToOur(copilotModel) {
        const modelMappings = {
            'gpt-4o': 'gpt-4o',
            'gpt-4.1': 'gpt-4.1',
            'gpt-4-turbo': 'gpt-4-turbo',
            'gpt-4': 'gpt-4',
            'claude-3.5-sonnet': 'claude-sonnet-3.5',
            'claude-3.7-sonnet': 'claude-sonnet-3.7',
            'claude-4-sonnet': 'claude-sonnet-4',
            'gemini-2.5-pro': 'gemini-2.5-pro',
            'o4-mini': 'o4-mini-preview',
            'copilot': 'github-copilot'
        };
        return modelMappings[copilotModel] || 'gpt-4o';
    }
    /**
     * Analysiert aktive Chat-Panels für Modell-Informationen
     */
    async analyzeActiveChatPanels() {
        try {
            // Prüfe ob Chat-Panel geöffnet ist
            const activeEditor = vscode.window.activeTextEditor;
            if (!activeEditor)
                return null;
            // Analysiere Chat-Commands im Command Palette
            const recentCommands = await this.getRecentChatCommands();
            for (const command of recentCommands) {
                const model = this.extractModelFromCommand(command);
                if (model)
                    return model;
            }
            return null;
        }
        catch (error) {
            return null;
        }
    }
    /**
     * Holt zuletzt verwendetes Modell aus Extension Storage
     */
    async getLastUsedModel() {
        try {
            // Prüfe VS Code Settings für zuletzt verwendetes Modell
            const config = vscode.workspace.getConfiguration('aiTokenTracker');
            return config.get('lastDetectedModel') || null;
        }
        catch (error) {
            return null;
        }
    }
    /**
     * Erkennt den Chat-Modus (Ask, Edit, Agent)
     */
    async detectChatMode() {
        try {
            // Methode 1: Analysiere aktive Commands
            const activeCommands = await this.getActiveCopilotCommands();
            for (const command of activeCommands) {
                if (command.includes('ask') || command.includes('question')) {
                    return 'ask';
                }
                if (command.includes('edit') || command.includes('fix') || command.includes('modify')) {
                    return 'edit';
                }
                if (command.includes('agent') || command.includes('terminal') || command.includes('workspace')) {
                    return 'agent';
                }
            }
            // Methode 2: Prüfe aktive Editor-Kontext
            const activeEditor = vscode.window.activeTextEditor;
            if (activeEditor) {
                const selection = activeEditor.selection;
                if (!selection.isEmpty) {
                    return 'edit'; // Text ausgewählt = wahrscheinlich Edit-Modus
                }
            }
            // Methode 3: Prüfe zuletzt verwendeten Modus
            const config = vscode.workspace.getConfiguration('aiTokenTracker');
            const lastMode = config.get('lastDetectedMode');
            if (lastMode && ['ask', 'edit', 'agent'].includes(lastMode)) {
                return lastMode;
            }
            return 'ask'; // Standard-Modus
        }
        catch (error) {
            return 'unknown';
        }
    }
    /**
     * Holt aktive Copilot Commands
     */
    async getActiveCopilotCommands() {
        try {
            // Simuliere Command-Analyse
            // In echter Implementierung würde hier die VS Code API verwendet
            return [];
        }
        catch (error) {
            return [];
        }
    }
    /**
     * Holt kürzliche Chat-Commands
     */
    async getRecentChatCommands() {
        // Placeholder für echte Command-Historie
        return [];
    }
    /**
     * Extrahiert Modell aus Command-String
     */
    extractModelFromCommand(command) {
        const patterns = [
            /gpt-?4\.?1/i,
            /gpt-?4o/i,
            /claude.*sonnet.*4/i,
            /claude.*sonnet.*3\.7/i,
            /claude.*sonnet.*3\.5/i,
            /gemini.*2\.5.*pro/i,
            /o4.*mini/i
        ];
        for (const pattern of patterns) {
            if (pattern.test(command)) {
                // Return entsprechendes Modell
                if (/gpt-?4\.?1/i.test(command))
                    return 'gpt-4.1';
                if (/gpt-?4o/i.test(command))
                    return 'gpt-4o';
                if (/claude.*sonnet.*4/i.test(command))
                    return 'claude-sonnet-4';
                if (/claude.*sonnet.*3\.7/i.test(command))
                    return 'claude-sonnet-3.7';
                if (/claude.*sonnet.*3\.5/i.test(command))
                    return 'claude-sonnet-3.5';
                if (/gemini.*2\.5.*pro/i.test(command))
                    return 'gemini-2.5-pro';
                if (/o4.*mini/i.test(command))
                    return 'o4-mini-preview';
            }
        }
        return null;
    }
    /**
     * Gibt Modell-Konfiguration zurück
     */
    getModelConfig(modelKey) {
        return modelConfig_1.AI_MODELS[modelKey] || modelConfig_1.AI_MODELS['gpt-4o'];
    }
    /**
     * Prüft ob sich der State geändert hat
     */
    hasStateChanged(prev, current) {
        return prev.mode !== current.mode ||
            prev.model !== current.model ||
            prev.isActive !== current.isActive;
    }
    /**
     * Benachrichtigt über State-Änderungen
     */
    notifyStateChange() {
        for (const listener of this.statusChangeListeners) {
            listener(this.currentState);
        }
        // Speichere aktuellen State für nächstes Mal
        this.saveCurrentState();
        // Zeige Benachrichtigung bei wichtigen Änderungen
        this.showStateChangeNotification();
    }
    /**
     * Speichert aktuellen State
     */
    async saveCurrentState() {
        try {
            const config = vscode.workspace.getConfiguration('aiTokenTracker');
            await config.update('lastDetectedModel', this.currentState.model, vscode.ConfigurationTarget.Global);
            await config.update('lastDetectedMode', this.currentState.mode, vscode.ConfigurationTarget.Global);
        }
        catch (error) {
            console.warn('Konnte State nicht speichern:', error);
        }
    }
    /**
     * Zeigt Benachrichtigung bei wichtigen Änderungen
     */
    showStateChangeNotification() {
        const { mode, model, modelConfig } = this.currentState;
        const message = `🔄 AI-Modell erkannt: ${modelConfig.name} (${mode.toUpperCase()}-Modus)`;
        const tokenInfo = `${modelConfig.maxTokens.toLocaleString()} Tokens verfügbar`;
        vscode.window.showInformationMessage(`${message} - ${tokenInfo}`);
    }
    /**
     * Registriert Listener für State-Änderungen
     */
    onStateChange(callback) {
        this.statusChangeListeners.push(callback);
    }
    /**
     * Gibt aktuellen State zurück
     */
    getCurrentState() {
        return { ...this.currentState };
    }
    /**
     * Erzwingt neue Erkennung
     */
    async forceDetection() {
        await this.detectCurrentState();
        return this.getCurrentState();
    }
    /**
     * Cleanup
     */
    dispose() {
        if (this.detectionInterval) {
            clearInterval(this.detectionInterval);
        }
        this.statusChangeListeners.length = 0;
    }
}
exports.CopilotChatDetector = CopilotChatDetector;
//# sourceMappingURL=copilotDetector.js.map