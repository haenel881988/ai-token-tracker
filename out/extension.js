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
const realtimeMonitor_1 = require("./core/realtimeMonitor");
const copilotIntegration_1 = require("./core/copilotIntegration");
const projectSetupManager_1 = require("./core/projectSetupManager");
const complexityManager_1 = require("./core/complexityManager");
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
let realtimeMonitor;
let copilotAutoConsolidator;
let projectSetupManager;
let complexityManager;
let statusBarManager;
let notificationManager;
let logger;
function activate(context) {
    logger = new logger_1.Logger('AI Token Tracker');
    logger.info('Extension wird aktiviert...');
    // Workspace-Pfad ermitteln
    const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspacePath) {
        vscode.window.showErrorMessage('Kein Workspace-Ordner gefunden!');
        return;
    }
    // Project Setup Manager initialisieren und automatisches Setup ausführen
    projectSetupManager = new projectSetupManager_1.ProjectSetupManager(workspacePath);
    projectSetupManager.setupProjectStructure().catch(error => {
        console.error('Automatisches Setup fehlgeschlagen:', error);
    });
    // Complexity Manager initialisieren
    complexityManager = new complexityManager_1.ComplexityManager(workspacePath, tokenCounter);
    // Core Module initialisieren
    configManager = new configManager_1.ConfigManager();
    tokenCounter = new tokenCounter_1.TokenCounter();
    scopeManager = new scopeManager_1.ScopeManager(tokenCounter, configManager);
    // Echtzeit-Monitor starten
    realtimeMonitor = new realtimeMonitor_1.RealtimeTokenMonitor(scopeManager, tokenCounter);
    // Copilot Auto-Konsolidierung aktivieren
    copilotAutoConsolidator = new copilotIntegration_1.CopilotAutoConsolidator(scopeManager, tokenCounter);
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
    realtimeMonitor?.dispose();
    copilotAutoConsolidator?.dispose();
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
    // Copilot Auto-Konsolidierung ein/aus
    const toggleCopilotIntegration = vscode.commands.registerCommand('aiTokenTracker.toggleCopilotIntegration', async () => {
        const currentState = copilotAutoConsolidator ? 'aktiviert' : 'deaktiviert';
        const newState = currentState === 'aktiviert' ? 'deaktiviert' : 'aktiviert';
        if (copilotAutoConsolidator) {
            copilotAutoConsolidator.setEnabled(newState === 'aktiviert');
        }
        vscode.window.showInformationMessage(`🤖 Copilot Auto-Konsolidierung ${newState}`);
    });
    // Manuelle Copilot Konsolidierung
    const manualCopilotConsolidation = vscode.commands.registerCommand('aiTokenTracker.manualCopilotConsolidation', async () => {
        if (copilotAutoConsolidator) {
            await copilotAutoConsolidator.manualConsolidation();
        }
        else {
            vscode.window.showWarningMessage('Copilot Integration nicht verfügbar');
        }
    });
    // Projekt modularisieren
    const modularizeProject = vscode.commands.registerCommand('aiTokenTracker.modularizeProject', async () => {
        if (projectSetupManager) {
            await projectSetupManager.createModularizationWorkflow();
        }
        else {
            vscode.window.showWarningMessage('Project Setup Manager nicht verfügbar');
        }
    });
    // GitHub Setup erstellen
    const createGithubSetup = vscode.commands.registerCommand('aiTokenTracker.createGithubSetup', async () => {
        if (projectSetupManager) {
            await projectSetupManager.setupProjectStructure();
        }
        else {
            vscode.window.showWarningMessage('Project Setup Manager nicht verfügbar');
        }
    });
    // Komplexitäts-Analyse durchführen
    const analyzeComplexity = vscode.commands.registerCommand('aiTokenTracker.analyzeComplexity', async () => {
        if (complexityManager) {
            vscode.window.showInformationMessage('🔍 Starte Komplexitäts-Analyse...');
            const metrics = await complexityManager.analyzeProjectComplexity();
            const message = `📊 Analyse abgeschlossen!\n` +
                `Komplexität: ${(metrics.complexityScore * 100).toFixed(1)}%\n` +
                `Token-Hotspots: ${metrics.tokenHotspots.length}\n` +
                `Redundanzen: ${metrics.redundantContent.length}`;
            vscode.window.showInformationMessage(message, 'Report anzeigen').then(selection => {
                if (selection) {
                    // Report öffnen
                }
            });
        }
        else {
            vscode.window.showWarningMessage('Complexity Manager nicht verfügbar');
        }
    });
    // Duplikate finden
    const findDuplicates = vscode.commands.registerCommand('aiTokenTracker.findDuplicates', async () => {
        if (complexityManager) {
            vscode.window.showInformationMessage('🔍 Suche nach Duplikaten...');
            const metrics = await complexityManager.analyzeProjectComplexity();
            if (metrics.duplicateFiles.length > 0) {
                const message = `🔄 ${metrics.duplicateFiles.length} Duplikate gefunden!`;
                vscode.window.showWarningMessage(message, 'Details anzeigen');
            }
            else {
                vscode.window.showInformationMessage('✅ Keine Duplikate gefunden!');
            }
        }
    });
    context.subscriptions.push(showDashboard, resetCounters, createScope, toggleCopilotIntegration, manualCopilotConsolidation, modularizeProject, createGithubSetup, analyzeComplexity, findDuplicates);
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