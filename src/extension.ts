import * as vscode from 'vscode';
import { ScopeManager } from './core/scopeManager';
import { TokenCounter } from './core/tokenCounter';
import { ConfigManager } from './core/configManager';
import { StatusBarManager } from './ui/statusBar';
import { NotificationManager } from './ui/notifications';
import { Logger } from './utils/logger';

/**
 * AI Token Tracker Extension - Main Entry Point
 * 
 * Diese Extension fungiert als "Kilometerzähler für Tokens" und hilft Entwicklern,
 * Token-Verbrauch zu überwachen, bevor AI-Halluzinationen auftreten.
 * 
 * Zentrale Features:
 * - Scope-basiertes Token-Tracking
 * - Modulare Architektur
 * - Multi-Provider Support
 * - Echtzeit-Überwachung
 */

let scopeManager: ScopeManager;
let tokenCounter: TokenCounter;
let configManager: ConfigManager;
let statusBarManager: StatusBarManager;
let notificationManager: NotificationManager;
let logger: Logger;

export function activate(context: vscode.ExtensionContext) {
    logger = new Logger('AI Token Tracker');
    logger.info('Extension wird aktiviert...');

    // Core Module initialisieren
    configManager = new ConfigManager();
    tokenCounter = new TokenCounter();
    scopeManager = new ScopeManager(tokenCounter, configManager);
    
    // UI Module initialisieren
    statusBarManager = new StatusBarManager(scopeManager);
    notificationManager = new NotificationManager(scopeManager);

    // Commands registrieren
    registerCommands(context);

    // Event Listeners registrieren
    registerEventListeners(context);

    // Auto-Scope für aktuelle Datei erstellen
    createInitialScope();

    logger.info('Extension erfolgreich aktiviert!');
}

export function deactivate() {
    logger.info('Extension wird deaktiviert...');
    
    // Cleanup
    statusBarManager?.dispose();
    scopeManager?.dispose();
    
    logger.info('Extension deaktiviert.');
}

function registerCommands(context: vscode.ExtensionContext) {
    // Dashboard öffnen
    const showDashboard = vscode.commands.registerCommand('aiTokenTracker.showDashboard', () => {
        // TODO: Webview Dashboard implementieren
        vscode.window.showInformationMessage('Dashboard wird bald verfügbar sein!');
    });

    // Token Zähler zurücksetzen
    const resetCounters = vscode.commands.registerCommand('aiTokenTracker.resetCounters', () => {
        scopeManager.resetAllScopes();
        vscode.window.showInformationMessage('Alle Token-Zähler wurden zurückgesetzt.');
    });

    // Neuen Scope erstellen
    const createScope = vscode.commands.registerCommand('aiTokenTracker.createScope', async () => {
        const scopeName = await vscode.window.showInputBox({
            prompt: 'Name für den neuen Scope eingeben',
            placeHolder: 'z.B. "Feature XY" oder "Bug Fix #123"'
        });

        if (scopeName) {
            const scope = scopeManager.createCustomScope(scopeName);
            vscode.window.showInformationMessage(`Scope "${scopeName}" wurde erstellt.`);
        }
    });

    context.subscriptions.push(showDashboard, resetCounters, createScope);
}

function registerEventListeners(context: vscode.ExtensionContext) {
    // Datei-Änderungen überwachen
    const onDidChangeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor) {
            scopeManager.switchToFileScope(editor.document.uri.fsPath);
            statusBarManager.updateDisplay();
        }
    });

    // Text-Änderungen überwachen (für Token-Counting)
    const onDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.document === vscode.window.activeTextEditor?.document) {
            // Debounced Token-Update
            setTimeout(() => {
                const currentScope = scopeManager.getCurrentScope();
                if (currentScope) {
                    const tokens = tokenCounter.countTokens(event.document.getText());
                    scopeManager.updateScopeTokens(currentScope.id, tokens);
                    statusBarManager.updateDisplay();
                }
            }, 500);
        }
    });

    context.subscriptions.push(onDidChangeActiveTextEditor, onDidChangeTextDocument);
}

function createInitialScope() {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor && configManager.get('autoCreateScopes', true)) {
        scopeManager.createFileScope(activeEditor.document.uri.fsPath);
        statusBarManager.updateDisplay();
    }
}
