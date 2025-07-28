import * as path from 'path';
import { IScopeManager, TokenScope, ScopeConfig, ITokenCounter, IConfigManager } from './interfaces';

/**
 * Scope Manager - Herzstück der modularen Token-Verwaltung
 * 
 * Diese Klasse implementiert das zentrale Scope-Konzept der Extension.
 * Scopes ermöglichen es, Token-Verbrauch in verschiedenen Kontexten
 * separat zu verfolgen (Datei, Projekt, Session, Custom).
 */
export class ScopeManager implements IScopeManager {
    private scopes: Map<string, TokenScope> = new Map();
    private currentScopeId: string | undefined;
    private activeFileScope: string | undefined;

    constructor(
        private tokenCounter: ITokenCounter,
        private configManager: IConfigManager
    ) {
        // Auto-cleanup alter Scopes
        this.startCleanupTimer();
    }

    /**
     * Erstellt einen neuen Scope basierend auf Konfiguration
     */
    createScope(config: ScopeConfig): TokenScope {
        const id = this.generateScopeId(config.name, config.type);
        
        const scope: TokenScope = {
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
    createFileScope(filePath: string): TokenScope {
        const fileName = path.basename(filePath);
        const config: ScopeConfig = {
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
     * Erstellt einen Projekt-Scope
     */
    createProjectScope(projectPath: string): TokenScope {
        const projectName = path.basename(projectPath);
        const config: ScopeConfig = {
            name: `Projekt: ${projectName}`,
            type: 'project',
            files: [] // Wird dynamisch gefüllt
        };

        return this.createScope(config);
    }

    /**
     * Erstellt einen Session-Scope
     */
    createSessionScope(): TokenScope {
        const sessionName = `Session ${new Date().toLocaleTimeString()}`;
        const config: ScopeConfig = {
            name: sessionName,
            type: 'session'
        };

        return this.createScope(config);
    }

    /**
     * Erstellt einen benutzerdefinierten Scope
     */
    createCustomScope(name: string): TokenScope {
        const config: ScopeConfig = {
            name: name,
            type: 'custom'
        };

        return this.createScope(config);
    }

    /**
     * Wechselt zu einem Datei-Scope oder erstellt einen neuen
     */
    switchToFileScope(filePath: string): void {
        // Suche existierenden Datei-Scope
        const existingScope = this.findFileScopeByPath(filePath);
        
        if (existingScope) {
            this.switchToScope(existingScope.id);
            this.activeFileScope = existingScope.id;
        } else if (this.configManager.get('autoCreateScopes', true)) {
            this.createFileScope(filePath);
        }
    }

    /**
     * Sucht einen Datei-Scope anhand des Pfads
     */
    private findFileScopeByPath(filePath: string): TokenScope | undefined {
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
    getActiveScopes(): TokenScope[] {
        return Array.from(this.scopes.values()).filter(scope => scope.isActive);
    }

    /**
     * Aktualisiert einen Scope
     */
    updateScope(id: string, update: Partial<TokenScope>): void {
        const scope = this.scopes.get(id);
        if (scope) {
            Object.assign(scope, update);
            this.scopes.set(id, scope);
        }
    }

    /**
     * Aktualisiert Token-Anzahl für einen Scope
     */
    updateScopeTokens(scopeId: string, tokens: number): void {
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
    deleteScope(id: string): void {
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
    getCurrentScope(): TokenScope | undefined {
        return this.currentScopeId ? this.scopes.get(this.currentScopeId) : undefined;
    }

    /**
     * Wechselt zum angegebenen Scope
     */
    switchToScope(scopeId: string): void {
        if (this.scopes.has(scopeId)) {
            this.currentScopeId = scopeId;
        }
    }

    /**
     * Setzt alle Scopes zurück
     */
    resetAllScopes(): void {
        for (const scope of this.scopes.values()) {
            scope.currentTokens = 0;
            this.tokenCounter.clearHistory(scope.id);
        }
    }

    /**
     * Generiert eine eindeutige Scope-ID
     */
    private generateScopeId(name: string, type: string): string {
        const timestamp = Date.now();
        const cleanName = name.replace(/[^a-zA-Z0-9]/g, '_');
        return `${type}_${cleanName}_${timestamp}`;
    }

    /**
     * Löst eine Warnung aus, wenn Token-Limit erreicht wird
     */
    private triggerWarning(scope: TokenScope): void {
        // TODO: Integration mit NotificationManager
        console.warn(`Token-Warnung für Scope "${scope.name}": ${scope.currentTokens}/${scope.maxTokens} Tokens`);
    }

    /**
     * Startet einen Timer für automatisches Cleanup alter Scopes
     */
    private startCleanupTimer(): void {
        setInterval(() => {
            this.cleanupOldScopes();
        }, 60000); // Alle 60 Sekunden
    }

    /**
     * Entfernt alte, inaktive Scopes
     */
    private cleanupOldScopes(): void {
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
    dispose(): void {
        this.scopes.clear();
        this.currentScopeId = undefined;
        this.activeFileScope = undefined;
    }
}
