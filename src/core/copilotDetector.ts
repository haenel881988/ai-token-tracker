/**
 * GitHub Copilot Chat Detection - Automatische Erkennung von Modus und Modell
 * 
 * Diese Klasse erkennt automatisch welcher GitHub Copilot Chat Modus aktiv ist
 * und welches Modell verwendet wird, um die Token-Limits entsprechend anzupassen.
 */

import * as vscode from 'vscode';
import { AIModelConfig, AI_MODELS } from './modelConfig';

export interface CopilotChatState {
    mode: 'ask' | 'edit' | 'agent' | 'unknown';
    model: string;
    modelConfig: AIModelConfig;
    isActive: boolean;
    lastDetected: Date;
}

export class CopilotChatDetector {
    private currentState: CopilotChatState;
    private detectionInterval: NodeJS.Timeout | undefined;
    private statusChangeListeners: Array<(state: CopilotChatState) => void> = [];

    constructor() {
        this.currentState = {
            mode: 'unknown',
            model: 'gpt-4o',
            modelConfig: AI_MODELS['gpt-4o'],
            isActive: false,
            lastDetected: new Date()
        };

        this.startDetection();
    }

    /**
     * Startet kontinuierliche Erkennung
     */
    private startDetection(): void {
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
    private async detectCurrentState(): Promise<void> {
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
    private async detectActiveModel(): Promise<string> {
        try {
            // Methode 1: Prüfe GitHub Copilot Settings
            const copilotConfig = vscode.workspace.getConfiguration('github.copilot.chat');
            const selectedModel = copilotConfig.get<string>('model');
            
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

        } catch (error) {
            console.warn('Konnte aktives Modell nicht erkennen:', error);
            return 'gpt-4o';
        }
    }

    /**
     * Mappt GitHub Copilot Modell-Namen zu unseren Bezeichnungen
     */
    private mapCopilotModelToOur(copilotModel: string): string {
        const modelMappings: Record<string, string> = {
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
    private async analyzeActiveChatPanels(): Promise<string | null> {
        try {
            // Prüfe ob Chat-Panel geöffnet ist
            const activeEditor = vscode.window.activeTextEditor;
            if (!activeEditor) return null;

            // Analysiere Chat-Commands im Command Palette
            const recentCommands = await this.getRecentChatCommands();
            
            for (const command of recentCommands) {
                const model = this.extractModelFromCommand(command);
                if (model) return model;
            }

            return null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Holt zuletzt verwendetes Modell aus Extension Storage
     */
    private async getLastUsedModel(): Promise<string | null> {
        try {
            // Prüfe VS Code Settings für zuletzt verwendetes Modell
            const config = vscode.workspace.getConfiguration('aiTokenTracker');
            return config.get<string>('lastDetectedModel') || null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Erkennt den Chat-Modus (Ask, Edit, Agent)
     */
    private async detectChatMode(): Promise<'ask' | 'edit' | 'agent' | 'unknown'> {
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
            const lastMode = config.get<string>('lastDetectedMode');
            
            if (lastMode && ['ask', 'edit', 'agent'].includes(lastMode)) {
                return lastMode as 'ask' | 'edit' | 'agent';
            }

            return 'ask'; // Standard-Modus

        } catch (error) {
            return 'unknown';
        }
    }

    /**
     * Holt aktive Copilot Commands
     */
    private async getActiveCopilotCommands(): Promise<string[]> {
        try {
            // Simuliere Command-Analyse
            // In echter Implementierung würde hier die VS Code API verwendet
            return [];
        } catch (error) {
            return [];
        }
    }

    /**
     * Holt kürzliche Chat-Commands
     */
    private async getRecentChatCommands(): Promise<string[]> {
        // Placeholder für echte Command-Historie
        return [];
    }

    /**
     * Extrahiert Modell aus Command-String
     */
    private extractModelFromCommand(command: string): string | null {
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
                if (/gpt-?4\.?1/i.test(command)) return 'gpt-4.1';
                if (/gpt-?4o/i.test(command)) return 'gpt-4o';
                if (/claude.*sonnet.*4/i.test(command)) return 'claude-sonnet-4';
                if (/claude.*sonnet.*3\.7/i.test(command)) return 'claude-sonnet-3.7';
                if (/claude.*sonnet.*3\.5/i.test(command)) return 'claude-sonnet-3.5';
                if (/gemini.*2\.5.*pro/i.test(command)) return 'gemini-2.5-pro';
                if (/o4.*mini/i.test(command)) return 'o4-mini-preview';
            }
        }

        return null;
    }

    /**
     * Gibt Modell-Konfiguration zurück
     */
    private getModelConfig(modelKey: string): AIModelConfig {
        return AI_MODELS[modelKey] || AI_MODELS['gpt-4o'];
    }

    /**
     * Prüft ob sich der State geändert hat
     */
    private hasStateChanged(prev: CopilotChatState, current: CopilotChatState): boolean {
        return prev.mode !== current.mode || 
               prev.model !== current.model || 
               prev.isActive !== current.isActive;
    }

    /**
     * Benachrichtigt über State-Änderungen
     */
    private notifyStateChange(): void {
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
    private async saveCurrentState(): Promise<void> {
        try {
            const config = vscode.workspace.getConfiguration('aiTokenTracker');
            await config.update('lastDetectedModel', this.currentState.model, vscode.ConfigurationTarget.Global);
            await config.update('lastDetectedMode', this.currentState.mode, vscode.ConfigurationTarget.Global);
        } catch (error) {
            console.warn('Konnte State nicht speichern:', error);
        }
    }

    /**
     * Zeigt Benachrichtigung bei wichtigen Änderungen
     */
    private showStateChangeNotification(): void {
        const { mode, model, modelConfig } = this.currentState;
        
        const message = `🔄 AI-Modell erkannt: ${modelConfig.name} (${mode.toUpperCase()}-Modus)`;
        const tokenInfo = `${modelConfig.maxTokens.toLocaleString()} Tokens verfügbar`;
        
        vscode.window.showInformationMessage(`${message} - ${tokenInfo}`);
    }

    /**
     * Registriert Listener für State-Änderungen
     */
    onStateChange(callback: (state: CopilotChatState) => void): void {
        this.statusChangeListeners.push(callback);
    }

    /**
     * Gibt aktuellen State zurück
     */
    getCurrentState(): CopilotChatState {
        return { ...this.currentState };
    }

    /**
     * Erzwingt neue Erkennung
     */
    async forceDetection(): Promise<CopilotChatState> {
        await this.detectCurrentState();
        return this.getCurrentState();
    }

    /**
     * Cleanup
     */
    dispose(): void {
        if (this.detectionInterval) {
            clearInterval(this.detectionInterval);
        }
        this.statusChangeListeners.length = 0;
    }
}
