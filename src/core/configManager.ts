import * as vscode from 'vscode';
import { IConfigManager } from './interfaces';

/**
 * Configuration Manager - Zentrale Konfigurationsverwaltung
 * 
 * Diese Klasse verwaltet alle Extension-Einstellungen und bietet
 * einen einheitlichen Zugriff auf VS Code Settings.
 */
export class ConfigManager implements IConfigManager {
    private readonly configSection = 'aiTokenTracker';
    private changeListeners: Array<(key: string, value: any) => void> = [];

    constructor() {
        // Überwache Konfigurationsänderungen
        vscode.workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration(this.configSection)) {
                this.notifyListeners();
            }
        });
    }

    /**
     * Ruft einen Konfigurationswert ab
     */
    get<T>(key: string, defaultValue: T): T {
        const config = vscode.workspace.getConfiguration(this.configSection);
        return config.get<T>(key, defaultValue);
    }

    /**
     * Setzt einen Konfigurationswert
     */
    async set(key: string, value: any): Promise<void> {
        const config = vscode.workspace.getConfiguration(this.configSection);
        await config.update(key, value, vscode.ConfigurationTarget.Global);
    }

    /**
     * Registriert einen Listener für Konfigurationsänderungen
     */
    onDidChange(callback: (key: string, value: any) => void): void {
        this.changeListeners.push(callback);
    }

    /**
     * Benachrichtigt alle Listener über Änderungen
     */
    private notifyListeners(): void {
        const config = vscode.workspace.getConfiguration(this.configSection);
        for (const listener of this.changeListeners) {
            // Vereinfacht: Benachrichtige über alle möglichen Änderungen
            listener('any', config);
        }
    }

    /**
     * Gibt alle aktuellen Einstellungen zurück
     */
    getAllSettings(): any {
        return vscode.workspace.getConfiguration(this.configSection);
    }

    /**
     * Standard-Konfigurationswerte
     */
    getDefaults() {
        return {
            defaultMaxTokens: 8000,
            warningThreshold: 0.8,
            enabledProviders: ['copilot', 'openai'],
            autoCreateScopes: true,
            scopeTypes: ['file', 'project', 'session'],
            showStatusBar: true,
            enableNotifications: true,
            debugMode: false
        };
    }

    /**
     * Zurücksetzen auf Standardwerte
     */
    async resetToDefaults(): Promise<void> {
        const defaults = this.getDefaults();
        const config = vscode.workspace.getConfiguration(this.configSection);
        
        for (const [key, value] of Object.entries(defaults)) {
            await config.update(key, value, vscode.ConfigurationTarget.Global);
        }
    }

    /**
     * Validiert die aktuelle Konfiguration
     */
    validateConfig(): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];
        
        const maxTokens = this.get('defaultMaxTokens', 8000);
        if (maxTokens <= 0) {
            errors.push('defaultMaxTokens muss größer als 0 sein');
        }
        
        const threshold = this.get('warningThreshold', 0.8);
        if (threshold < 0 || threshold > 1) {
            errors.push('warningThreshold muss zwischen 0 und 1 liegen');
        }
        
        const providers = this.get('enabledProviders', []);
        if (!Array.isArray(providers) || providers.length === 0) {
            errors.push('Mindestens ein Provider muss aktiviert sein');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}
