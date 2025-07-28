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
exports.ScopeManager = void 0;
const path = __importStar(require("path"));
/**
 * Scope Manager - Herzstück der modularen Token-Verwaltung
 *
 * Diese Klasse implementiert das zentrale Scope-Konzept der Extension.
 * Scopes ermöglichen es, Token-Verbrauch in verschiedenen Kontexten
 * separat zu verfolgen (Datei, Projekt, Session, Custom).
 */
class ScopeManager {
    constructor(tokenCounter, configManager) {
        this.tokenCounter = tokenCounter;
        this.configManager = configManager;
        this.scopes = new Map();
        // Auto-cleanup alter Scopes
        this.startCleanupTimer();
    }
    /**
     * Erstellt einen neuen Scope basierend auf Konfiguration
     */
    createScope(config) {
        const id = this.generateScopeId(config.name, config.type);
        const scope = {
            id,
            name: config.name,
            type: config.type,
            maxTokens: config.maxTokens || this.configManager.get('defaultMaxTokens', 8000),
            currentTokens: 0,
            warningThreshold: config.warningThreshold || this.configManager.get('warningThreshold', 0.8),
            files: config.files || [],
            startTime: new Date(),
            isActive: true
        };
        this.scopes.set(id, scope);
        // Wenn es der erste Scope ist, mache ihn zum aktuellen
        if (!this.currentScopeId) {
            this.currentScopeId = id;
        }
        return scope;
    }
    /**
     * Erstellt einen Datei-spezifischen Scope
     */
    createFileScope(filePath) {
        // Filter für unerwünschte Dateien
        if (this.shouldIgnoreFile(filePath)) {
            return null; // Skip ignored files
        }
        const fileName = path.basename(filePath);
        const config = {
            name: `Datei: ${fileName}`,
            type: 'file',
            files: [filePath]
        };
        const scope = this.createScope(config);
        this.activeFileScope = scope.id;
        this.switchToScope(scope.id);
        return scope;
    }
    /**
     * Prüft ob eine Datei ignoriert werden soll
     */
    shouldIgnoreFile(filePath) {
        const ignoredPatterns = [
            'COMMIT_EDITMSG',
            'MERGE_MSG',
            'SQUASH_MSG',
            '.git/',
            'node_modules/',
            '.vscode/',
            'temp/',
            'tmp/',
            '.log',
            '.cache'
        ];
        const fileName = path.basename(filePath);
        const lowerPath = filePath.toLowerCase();
        return ignoredPatterns.some(pattern => fileName.includes(pattern) || lowerPath.includes(pattern.toLowerCase()));
    }
    /**
     * Erstellt einen Projekt-Scope
     */
    createProjectScope(projectPath) {
        const projectName = path.basename(projectPath);
        const config = {
            name: `Projekt: ${projectName}`,
            type: 'project',
            files: [] // Wird dynamisch gefüllt
        };
        return this.createScope(config);
    }
    /**
     * Erstellt einen Session-Scope
     */
    createSessionScope() {
        const sessionName = `Session ${new Date().toLocaleTimeString()}`;
        const config = {
            name: sessionName,
            type: 'session'
        };
        return this.createScope(config);
    }
    /**
     * Erstellt einen benutzerdefinierten Scope
     */
    createCustomScope(name) {
        const config = {
            name: name,
            type: 'custom'
        };
        return this.createScope(config);
    }
    /**
     * Wechselt zu einem Datei-Scope oder erstellt einen neuen
     */
    switchToFileScope(filePath) {
        // Suche existierenden Datei-Scope
        const existingScope = this.findFileScopeByPath(filePath);
        if (existingScope) {
            this.switchToScope(existingScope.id);
            this.activeFileScope = existingScope.id;
        }
        else if (this.configManager.get('autoCreateScopes', true)) {
            this.createFileScope(filePath);
        }
    }
    /**
     * Sucht einen Datei-Scope anhand des Pfads
     */
    findFileScopeByPath(filePath) {
        for (const scope of this.scopes.values()) {
            if (scope.type === 'file' && scope.files?.includes(filePath)) {
                return scope;
            }
        }
        return undefined;
    }
    /**
     * Gibt alle aktiven Scopes zurück
     */
    getActiveScopes() {
        return Array.from(this.scopes.values()).filter(scope => scope.isActive);
    }
    /**
     * Aktualisiert einen Scope
     */
    updateScope(id, update) {
        const scope = this.scopes.get(id);
        if (scope) {
            Object.assign(scope, update);
            this.scopes.set(id, scope);
        }
    }
    /**
     * Aktualisiert Token-Anzahl für einen Scope
     */
    updateScopeTokens(scopeId, tokens) {
        const scope = this.scopes.get(scopeId);
        if (scope) {
            scope.currentTokens = tokens;
            this.tokenCounter.trackUsage(scopeId, tokens);
            // Prüfe Warnschwelle
            const usage = this.tokenCounter.getCurrentUsage(scopeId);
            if (usage.warningTriggered) {
                this.triggerWarning(scope);
            }
        }
    }
    /**
     * Lösche einen Scope
     */
    deleteScope(id) {
        const scope = this.scopes.get(id);
        if (scope) {
            scope.isActive = false;
            scope.endTime = new Date();
            // Wenn es der aktuelle Scope war, wechsle zu einem anderen
            if (this.currentScopeId === id) {
                const otherScopes = this.getActiveScopes();
                this.currentScopeId = otherScopes.length > 0 ? otherScopes[0].id : undefined;
            }
            // Cleanup Token-Historie
            this.tokenCounter.clearHistory(id);
        }
    }
    /**
     * Gibt den aktuellen Scope zurück
     */
    getCurrentScope() {
        return this.currentScopeId ? this.scopes.get(this.currentScopeId) : undefined;
    }
    /**
     * Wechselt zum angegebenen Scope
     */
    switchToScope(scopeId) {
        if (this.scopes.has(scopeId)) {
            this.currentScopeId = scopeId;
        }
    }
    /**
     * Setzt alle Scopes zurück
     */
    resetAllScopes() {
        for (const scope of this.scopes.values()) {
            scope.currentTokens = 0;
            this.tokenCounter.clearHistory(scope.id);
        }
    }
    /**
     * Generiert eine eindeutige Scope-ID
     */
    generateScopeId(name, type) {
        const timestamp = Date.now();
        const cleanName = name.replace(/[^a-zA-Z0-9]/g, '_');
        return `${type}_${cleanName}_${timestamp}`;
    }
    /**
     * Löst eine Warnung aus, wenn Token-Limit erreicht wird
     */
    triggerWarning(scope) {
        // TODO: Integration mit NotificationManager
        console.warn(`Token-Warnung für Scope "${scope.name}": ${scope.currentTokens}/${scope.maxTokens} Tokens`);
    }
    /**
     * Startet einen Timer für automatisches Cleanup alter Scopes
     */
    startCleanupTimer() {
        setInterval(() => {
            this.cleanupOldScopes();
        }, 60000); // Alle 60 Sekunden
    }
    /**
     * Entfernt alte, inaktive Scopes
     */
    cleanupOldScopes() {
        const maxAge = 24 * 60 * 60 * 1000; // 24 Stunden
        const now = new Date().getTime();
        for (const [id, scope] of this.scopes.entries()) {
            if (!scope.isActive && scope.endTime) {
                const age = now - scope.endTime.getTime();
                if (age > maxAge) {
                    this.scopes.delete(id);
                    this.tokenCounter.clearHistory(id);
                }
            }
        }
    }
    /**
     * Cleanup-Methode für Extension-Deaktivierung
     */
    dispose() {
        this.scopes.clear();
        this.currentScopeId = undefined;
        this.activeFileScope = undefined;
    }
}
exports.ScopeManager = ScopeManager;
//# sourceMappingURL=scopeManager.js.map