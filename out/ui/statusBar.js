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
exports.StatusBarManager = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
/**
 * Status Bar Manager - Zeigt Token-Informationen in der VS Code Status Bar
 *
 * Diese Klasse verwaltet die Anzeige von Token-Informationen in der
 * VS Code Status Bar und bietet schnellen Zugriff auf wichtige Metriken.
 */
class StatusBarManager {
    constructor(scopeManager) {
        this.scopeManager = scopeManager;
        // Erstelle Status Bar Item
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.statusBarItem.command = 'aiTokenTracker.showQuickPick';
        this.statusBarItem.show();
        // Registriere Quick Pick Command
        this.registerQuickPickCommand();
        // Starte automatische Updates
        this.startAutoUpdate();
        this.updateDisplay();
    }
    /**
     * Aktualisiert die Status Bar Anzeige
     */
    updateDisplay() {
        const currentScope = this.scopeManager.getCurrentScope();
        if (!currentScope) {
            this.statusBarItem.text = "$(graph) Token: --";
            this.statusBarItem.tooltip = "Kein aktiver Token-Scope";
            this.statusBarItem.backgroundColor = undefined;
            return;
        }
        const usage = currentScope.currentTokens;
        const max = currentScope.maxTokens;
        const percentage = max > 0 ? (usage / max) * 100 : 0;
        // Icon basierend auf Token-Status
        let icon = "$(graph)";
        let backgroundColor;
        if (percentage >= 90) {
            icon = "$(alert)";
            backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
        }
        else if (percentage >= 80) {
            icon = "$(warning)";
            backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        }
        else if (percentage >= 60) {
            icon = "$(info)";
        }
        // Formatiere Anzeige
        const displayText = `${icon} ${Math.round(usage)}/${max} (${Math.round(percentage)}%)`;
        this.statusBarItem.text = displayText;
        this.statusBarItem.backgroundColor = backgroundColor;
        this.statusBarItem.tooltip = this.createTooltip(currentScope);
    }
    /**
     * Erstellt einen detaillierten Tooltip mit kompletter Token-Kette
     */
    createTooltip(scope) {
        const usage = scope.currentTokens;
        const max = scope.maxTokens;
        const remaining = max - usage;
        const percentage = max > 0 ? (usage / max) * 100 : 0;
        // Aktuelle Datei-Info
        const activeEditor = vscode.window.activeTextEditor;
        const fileName = activeEditor ? path.basename(activeEditor.document.fileName) : 'Keine Datei';
        const fileLines = activeEditor ? activeEditor.document.lineCount : 0;
        const fileChars = activeEditor ? activeEditor.document.getText().length : 0;
        const estimatedFileTokens = Math.ceil(fileChars / 4);
        let tooltip = `🚀 AI Token Tracker - Detailansicht\n`;
        tooltip += `═══════════════════════════════════════\n\n`;
        // Scope Information
        tooltip += `📊 SCOPE: ${scope.name}\n`;
        tooltip += `📁 Typ: ${scope.type.toUpperCase()}\n`;
        tooltip += `⏰ Erstellt: ${scope.startTime.toLocaleTimeString()}\n\n`;
        // Token-Kette Aufschlüsselung
        tooltip += `🔗 TOKEN-KETTE AUFSCHLÜSSELUNG:\n`;
        tooltip += `─────────────────────────────────\n`;
        tooltip += `📄 Aktuelle Datei: ${fileName}\n`;
        tooltip += `   ├─ Zeilen: ${fileLines}\n`;
        tooltip += `   ├─ Zeichen: ${fileChars.toLocaleString()}\n`;
        tooltip += `   └─ Geschätzte Tokens: ~${estimatedFileTokens}\n\n`;
        // Chat-Historie Simulation
        const estimatedChatTokens = Math.ceil(usage * 0.3); // 30% für Chat
        const estimatedSummaryTokens = Math.ceil(usage * 0.1); // 10% für Zusammenfassungen
        const estimatedPromptTokens = usage - estimatedFileTokens - estimatedChatTokens - estimatedSummaryTokens;
        tooltip += `💬 Chat-Verlauf: ~${estimatedChatTokens} Tokens\n`;
        tooltip += `📝 AI-Zusammenfassungen: ~${estimatedSummaryTokens} Tokens\n`;
        tooltip += `🎯 Prompts & Anweisungen: ~${Math.max(0, estimatedPromptTokens)} Tokens\n`;
        tooltip += `📊 System-Overhead: ~200 Tokens\n\n`;
        // Status & Auslastung
        tooltip += `📈 STATUS & AUSLASTUNG:\n`;
        tooltip += `─────────────────────────\n`;
        tooltip += `✅ Verwendet: ${usage.toLocaleString()} Tokens\n`;
        tooltip += `🎯 Maximum: ${max.toLocaleString()} Tokens\n`;
        tooltip += `⚡ Verbleibend: ${remaining.toLocaleString()} Tokens\n`;
        tooltip += `📊 Auslastung: ${Math.round(percentage)}%\n\n`;
        // Fortschrittsbalken (ASCII)
        const barLength = 20;
        const filledLength = Math.round((percentage / 100) * barLength);
        const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
        tooltip += `📊 [${bar}] ${Math.round(percentage)}%\n\n`;
        // Warnungen & Status
        if (percentage >= 95) {
            tooltip += `🚨 KRITISCH: AI-Halluzinationen drohen!\n`;
            tooltip += `   → Sofort neuen Scope erstellen\n`;
            tooltip += `   → Chat-Verlauf zurücksetzen\n`;
            tooltip += `   → Datei in kleinere Teile aufteilen\n\n`;
        }
        else if (percentage >= 80) {
            tooltip += `⚠️ WARNUNG: Token-Limit fast erreicht!\n`;
            tooltip += `   → AI beginnt bald zu summarizen\n`;
            tooltip += `   → Überwache weitere Eingaben\n`;
            tooltip += `   → Plane Scope-Wechsel\n\n`;
        }
        else if (percentage >= 60) {
            tooltip += `💡 ACHTUNG: Mittlere Auslastung\n`;
            tooltip += `   → Token-Verbrauch überwachen\n`;
            tooltip += `   → Präzise Prompts verwenden\n\n`;
        }
        else if (percentage >= 30) {
            tooltip += `✅ GUT: Moderate Nutzung\n`;
            tooltip += `   → Optimaler Arbeitsbereich\n`;
            tooltip += `   → Weiter so!\n\n`;
        }
        else {
            tooltip += `🌟 PERFEKT: Niedriger Verbrauch\n`;
            tooltip += `   → Viel Spielraum vorhanden\n`;
            tooltip += `   → Ideal für komplexe Aufgaben\n\n`;
        }
        // Performance-Tipps
        tooltip += `💡 PERFORMANCE-TIPPS:\n`;
        tooltip += `─────────────────────────\n`;
        if (fileLines > 500) {
            tooltip += `📄 Große Datei (${fileLines} Zeilen)\n`;
            tooltip += `   → Aufteilen in kleinere Module\n`;
        }
        if (estimatedChatTokens > 1000) {
            tooltip += `💬 Langer Chat-Verlauf\n`;
            tooltip += `   → Neue Session starten\n`;
        }
        if (percentage > 50) {
            tooltip += `🎯 Kürzere, präzise Prompts verwenden\n`;
            tooltip += `🔄 Regelmäßig Scopes wechseln\n`;
        }
        tooltip += `\n🖱️ Klicken für Dashboard | Rechtsklick für Optionen`;
        return tooltip;
    }
    /**
     * Startet automatische Updates der Anzeige
     */
    startAutoUpdate() {
        this.updateInterval = setInterval(() => {
            this.updateDisplay();
        }, 2000); // Alle 2 Sekunden
    }
    /**
     * Zeigt eine kurze Status-Nachricht
     */
    showStatus(message, timeout = 3000) {
        const originalText = this.statusBarItem.text;
        this.statusBarItem.text = `$(info) ${message}`;
        setTimeout(() => {
            this.statusBarItem.text = originalText;
        }, timeout);
    }
    /**
     * Zeigt eine Warnung in der Status Bar
     */
    showWarning(message) {
        const originalText = this.statusBarItem.text;
        const originalBackground = this.statusBarItem.backgroundColor;
        this.statusBarItem.text = `$(alert) ${message}`;
        this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        setTimeout(() => {
            this.statusBarItem.text = originalText;
            this.statusBarItem.backgroundColor = originalBackground;
        }, 5000);
    }
    /**
     * Registriert das QuickPick-Command für erweiterte Optionen
     */
    registerQuickPickCommand() {
        vscode.commands.registerCommand('aiTokenTracker.showQuickPick', async () => {
            const currentScope = this.scopeManager.getCurrentScope();
            if (!currentScope) {
                vscode.window.showInformationMessage('Kein aktiver Token-Scope verfügbar');
                return;
            }
            const percentage = (currentScope.currentTokens / currentScope.maxTokens) * 100;
            const items = [
                {
                    label: '📊 Dashboard öffnen',
                    description: 'Detaillierte Token-Übersicht anzeigen',
                    detail: 'Vollständige Analytics und Verlauf'
                },
                {
                    label: '🔄 Scope zurücksetzen',
                    description: `${currentScope.name} auf 0 Tokens setzen`,
                    detail: 'Aktueller Verbrauch wird gelöscht'
                },
                {
                    label: '➕ Neuen Scope erstellen',
                    description: 'Frischen Token-Bereich anlegen',
                    detail: 'Für neue Aufgaben oder Features'
                },
                {
                    label: '🔀 Scope wechseln',
                    description: 'Zu anderem aktiven Scope wechseln',
                    detail: `${this.scopeManager.getActiveScopes().length} Scopes verfügbar`
                }
            ];
            // Zusätzliche Optionen basierend auf Token-Status
            if (percentage >= 75) {
                items.unshift({
                    label: '🚨 NOTFALL: Neue Session',
                    description: 'Sofort neue Session starten',
                    detail: 'Verhindert Halluzinationen!'
                });
            }
            if (percentage >= 50) {
                items.push({
                    label: '📝 Aufgabe aufteilen',
                    description: 'Task in Unter-Scopes aufteilen',
                    detail: 'Reduziert Token-Verbrauch'
                });
            }
            const selection = await vscode.window.showQuickPick(items, {
                placeHolder: `Token-Optionen (${Math.round(percentage)}% ausgelastet)`,
                title: `🚀 AI Token Tracker - ${currentScope.name}`
            });
            if (selection) {
                await this.handleQuickPickSelection(selection.label, currentScope);
            }
        });
    }
    /**
     * Behandelt QuickPick-Auswahl
     */
    async handleQuickPickSelection(label, scope) {
        switch (label) {
            case '📊 Dashboard öffnen':
                vscode.commands.executeCommand('aiTokenTracker.showDashboard');
                break;
            case '🔄 Scope zurücksetzen':
                this.scopeManager.updateScope(scope.id, { currentTokens: 0 });
                vscode.window.showInformationMessage(`✅ Scope "${scope.name}" zurückgesetzt`);
                break;
            case '➕ Neuen Scope erstellen':
                vscode.commands.executeCommand('aiTokenTracker.createScope');
                break;
            case '🔀 Scope wechseln':
                await this.showScopeSwitcher();
                break;
            case '🚨 NOTFALL: Neue Session':
                const newScope = this.scopeManager.createSessionScope();
                this.scopeManager.switchToScope(newScope.id);
                vscode.window.showInformationMessage(`🚨 Notfall-Session "${newScope.name}" gestartet!`);
                break;
            case '📝 Aufgabe aufteilen':
                await this.showTaskSplitter();
                break;
        }
        this.updateDisplay();
    }
    /**
     * Zeigt Scope-Wechsler
     */
    async showScopeSwitcher() {
        const scopes = this.scopeManager.getActiveScopes();
        const items = scopes.map(scope => ({
            label: `${this.getScopeIcon(scope.type)} ${scope.name}`,
            description: `${scope.currentTokens}/${scope.maxTokens} Tokens (${Math.round((scope.currentTokens / scope.maxTokens) * 100)}%)`,
            detail: `Erstellt: ${scope.startTime.toLocaleTimeString()}`,
            scope: scope
        }));
        const selection = await vscode.window.showQuickPick(items, {
            placeHolder: 'Scope zum Wechseln auswählen'
        });
        if (selection) {
            this.scopeManager.switchToScope(selection.scope.id);
            vscode.window.showInformationMessage(`🔀 Gewechselt zu "${selection.scope.name}"`);
        }
    }
    /**
     * Zeigt Task-Splitter für große Aufgaben
     */
    async showTaskSplitter() {
        const options = [
            'Feature in Module aufteilen',
            'Datei in kleinere Teile splitten',
            'Tests in separaten Scope verschieben',
            'Dokumentation auslagern'
        ];
        const selection = await vscode.window.showQuickPick(options, {
            placeHolder: 'Wie soll die Aufgabe aufgeteilt werden?'
        });
        if (selection) {
            const scopeName = await vscode.window.showInputBox({
                prompt: `Name für neuen "${selection}" Scope`,
                placeHolder: 'z.B. "Feature XY - Tests" oder "Module ABC"'
            });
            if (scopeName) {
                const newScope = this.scopeManager.createCustomScope(scopeName);
                vscode.window.showInformationMessage(`📝 Neuer Scope "${scopeName}" für Aufgabenteilung erstellt`);
            }
        }
    }
    /**
     * Gibt Icon für Scope-Typ zurück
     */
    getScopeIcon(type) {
        switch (type) {
            case 'file': return '📄';
            case 'project': return '📁';
            case 'session': return '⏰';
            case 'custom': return '🎯';
            default: return '📊';
        }
    }
    /**
     * Cleanup-Methode
     */
    dispose() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        this.statusBarItem.dispose();
    }
}
exports.StatusBarManager = StatusBarManager;
//# sourceMappingURL=statusBar.js.map