import * as vscode from 'vscode';
import { ScopeManager } from './core/scopeManager';
import { TokenCounter } from './core/tokenCounter';
import { ConfigManager } from './core/configManager';
import { RealtimeTokenMonitor } from './core/realtimeMonitor';
import { CopilotAutoConsolidator } from './core/copilotIntegration';
import { ProjectSetupManager } from './core/projectSetupManager';
import { ComplexityManager } from './core/complexityManager';
import { AISelfRegulationEngine } from './core/aiSelfRegulationEngine';
import { AIBehaviorManager } from './core/aiBehaviorManager';
import { ContextAuditor } from './core/contextAuditor';
import { ProjectInventoryManager, ensureInstructionsRule } from './core/projectInventoryManager';
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
let realtimeMonitor: RealtimeTokenMonitor;
let copilotAutoConsolidator: CopilotAutoConsolidator;
let projectSetupManager: ProjectSetupManager;
let complexityManager: ComplexityManager;
let aiRegulationEngine: AISelfRegulationEngine;
let aiBehaviorManager: AIBehaviorManager;
let contextAuditor: ContextAuditor;
let statusBarManager: StatusBarManager;
let notificationManager: NotificationManager;
let projectInventoryManager: ProjectInventoryManager;
let logger: Logger;

export function activate(context: vscode.ExtensionContext) {
    logger = new Logger('AI Token Tracker');
    logger.info('Extension wird aktiviert...');

    // Workspace-Pfad ermitteln
    const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspacePath) {
        vscode.window.showErrorMessage('Kein Workspace-Ordner gefunden!');
        return;
    }

    // Project Setup Manager initialisieren und automatisches Setup ausführen
    projectSetupManager = new ProjectSetupManager(workspacePath);
    projectSetupManager.setupProjectStructure().catch(error => {
        console.error('Automatisches Setup fehlgeschlagen:', error);
    });

    // Complexity Manager initialisieren
    complexityManager = new ComplexityManager(workspacePath, tokenCounter);

    // AI Engines initialisieren
    aiRegulationEngine = new AISelfRegulationEngine();
    aiBehaviorManager = new AIBehaviorManager();
    contextAuditor = new ContextAuditor(tokenCounter, aiBehaviorManager, configManager);

    // Projekt-Inventarisierungsmodul initialisieren
    projectInventoryManager = new ProjectInventoryManager();

    // Core Module initialisieren
    configManager = new ConfigManager();
    tokenCounter = new TokenCounter();
    scopeManager = new ScopeManager(tokenCounter, configManager);
    
    // Echtzeit-Monitor starten
    realtimeMonitor = new RealtimeTokenMonitor(scopeManager, tokenCounter);
    
    // Copilot Auto-Konsolidierung aktivieren
    copilotAutoConsolidator = new CopilotAutoConsolidator(scopeManager, tokenCounter);
    
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
    realtimeMonitor?.dispose();
    copilotAutoConsolidator?.dispose();
    
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
        } else {
            vscode.window.showWarningMessage('Copilot Integration nicht verfügbar');
        }
    });

    // Projekt modularisieren
    const modularizeProject = vscode.commands.registerCommand('aiTokenTracker.modularizeProject', async () => {
        if (projectSetupManager) {
            await projectSetupManager.createModularizationWorkflow();
        } else {
            vscode.window.showWarningMessage('Project Setup Manager nicht verfügbar');
        }
    });

    // GitHub Setup erstellen
    const createGithubSetup = vscode.commands.registerCommand('aiTokenTracker.createGithubSetup', async () => {
        if (projectSetupManager) {
            await projectSetupManager.setupProjectStructure();
        } else {
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
        } else {
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
            } else {
                vscode.window.showInformationMessage('✅ Keine Duplikate gefunden!');
            }
        }
    });

    context.subscriptions.push(
        showDashboard, 
        resetCounters, 
        createScope, 
        toggleCopilotIntegration, 
        manualCopilotConsolidation,
        modularizeProject,
        createGithubSetup,
        analyzeComplexity,
        findDuplicates
        // Die alten Commands wurden hier entfernt
    );
}

function registerEventListeners(context: vscode.ExtensionContext) {
    // Datei-Änderungen überwachen
    const onDidChangeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor) {
            scopeManager.switchToFileScope(editor.document.uri.fsPath);
            statusBarManager.updateDisplay();
        }
    });

    // Text-Änderungen überwachen (für Token-Counting) - KEIN Automatismus mehr!
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
