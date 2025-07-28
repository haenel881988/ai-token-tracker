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
exports.ConfigManager = void 0;
const vscode = __importStar(require("vscode"));
/**
 * Configuration Manager - Zentrale Konfigurationsverwaltung
 *
 * Diese Klasse verwaltet alle Extension-Einstellungen und bietet
 * einen einheitlichen Zugriff auf VS Code Settings.
 */
class ConfigManager {
    constructor() {
        this.configSection = 'aiTokenTracker';
        this.changeListeners = [];
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
    get(key, defaultValue) {
        const config = vscode.workspace.getConfiguration(this.configSection);
        return config.get(key, defaultValue);
    }
    /**
     * Setzt einen Konfigurationswert
     */
    async set(key, value) {
        const config = vscode.workspace.getConfiguration(this.configSection);
        await config.update(key, value, vscode.ConfigurationTarget.Global);
    }
    /**
     * Registriert einen Listener für Konfigurationsänderungen
     */
    onDidChange(callback) {
        this.changeListeners.push(callback);
    }
    /**
     * Benachrichtigt alle Listener über Änderungen
     */
    notifyListeners() {
        const config = vscode.workspace.getConfiguration(this.configSection);
        for (const listener of this.changeListeners) {
            // Vereinfacht: Benachrichtige über alle möglichen Änderungen
            listener('any', config);
        }
    }
    /**
     * Gibt alle aktuellen Einstellungen zurück
     */
    getAllSettings() {
        return vscode.workspace.getConfiguration(this.configSection);
    }
    /**
     * Standard-Konfigurationswerte
     */
    getDefaults() {
        return {
            defaultMaxTokens: 64000,
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
    async resetToDefaults() {
        const defaults = this.getDefaults();
        const config = vscode.workspace.getConfiguration(this.configSection);
        for (const [key, value] of Object.entries(defaults)) {
            await config.update(key, value, vscode.ConfigurationTarget.Global);
        }
    }
    /**
     * Validiert die aktuelle Konfiguration
     */
    validateConfig() {
        const errors = [];
        const maxTokens = this.get('defaultMaxTokens', 64000);
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
exports.ConfigManager = ConfigManager;
//# sourceMappingURL=configManager.js.map