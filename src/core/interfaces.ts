/**
 * Token Scope Interface - Zentrale Datenstruktur für Scope-Management
 */
export interface TokenScope {
    id: string;
    name: string;
    type: 'file' | 'project' | 'session' | 'custom';
    maxTokens: number;
    currentTokens: number;
    warningThreshold: number;
    files?: string[];
    startTime: Date;
    endTime?: Date;
    isActive: boolean;
}

/**
 * Token Usage Statistiken
 */
export interface TokenUsage {
    current: number;
    max: number;
    percentage: number;
    remaining: number;
    warningTriggered: boolean;
}

/**
 * Scope Konfiguration für Erstellung neuer Scopes
 */
export interface ScopeConfig {
    name: string;
    type: TokenScope['type'];
    maxTokens?: number;
    warningThreshold?: number;
    files?: string[];
}

/**
 * Token Counter Interface
 */
export interface ITokenCounter {
    countTokens(text: string): number;
    trackUsage(scope: string, tokens: number): void;
    getCurrentUsage(scope: string): TokenUsage;
    getTokenHistory(scopeId: string): number[];
    clearHistory(scopeId: string): void;
}

/**
 * Scope Manager Interface
 */
export interface IScopeManager {
    createScope(config: ScopeConfig): TokenScope;
    getActiveScopes(): TokenScope[];
    updateScope(id: string, update: Partial<TokenScope>): void;
    deleteScope(id: string): void;
    getCurrentScope(): TokenScope | undefined;
    switchToScope(scopeId: string): void;
}

/**
 * Configuration Manager Interface
 */
export interface IConfigManager {
    get<T>(key: string, defaultValue: T): T;
    set(key: string, value: any): void;
    onDidChange(callback: (key: string, value: any) => void): void;
}

/**
 * AI Provider Interface
 */
export interface IAIProvider {
    name: string;
    isAvailable(): boolean;
    getTokenCount(text: string): number;
    getMaxTokens(): number;
}
