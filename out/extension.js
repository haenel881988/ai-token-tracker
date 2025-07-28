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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const scopeManager_1 = require("./core/scopeManager");
const tokenCounter_1 = require("./core/tokenCounter");
const configManager_1 = require("./core/configManager");
const statusBar_1 = require("./ui/statusBar");
const notifications_1 = require("./ui/notifications");
const logger_1 = require("./utils/logger");
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
let scopeManager;
let tokenCounter;
let configManager;
let statusBarManager;
let notificationManager;
let logger;
function activate(context) {
    logger = new logger_1.Logger('AI Token Tracker');
    logger.info('Extension wird aktiviert...');
    // Core Module initialisieren
    configManager = new configManager_1.ConfigManager();
    tokenCounter = new tokenCounter_1.TokenCounter();
    scopeManager = new scopeManager_1.ScopeManager(tokenCounter, configManager);
    // UI Module initialisieren
    statusBarManager = new statusBar_1.StatusBarManager(scopeManager);
    notificationManager = new notifications_1.NotificationManager(scopeManager);
    // Commands registrieren
    registerCommands(context);
    // Event Listeners registrieren
    registerEventListeners(context);
    // Auto-Scope für aktuelle Datei erstellen
    createInitialScope();
    logger.info('Extension erfolgreich aktiviert!');
}
function deactivate() {
    logger.info('Extension wird deaktiviert...');
    // Cleanup
    statusBarManager?.dispose();
    scopeManager?.dispose();
    logger.info('Extension deaktiviert.');
}
function registerCommands(context) {
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
function registerEventListeners(context) {
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
//# sourceMappingURL=extension.js.map