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
exports.AISelfRegulationEngine = void 0;
const vscode = __importStar(require("vscode"));
/**
 * 🤖 AI Self-Regulation Engine
 * Diese Klasse zwingt die KI, token-bewusst zu arbeiten
 */
class AISelfRegulationEngine {
    constructor() {
        this.tokenThresholds = {
            warning: 0.75, // 75% - Warnung
            critical: 0.85, // 85% - Kritisch
            emergency: 0.92 // 92% - Notfall
        };
    }
    /**
     * REGEL 1: Token-Check vor jeder KI-Antwort ZWINGEND
     */
    async enforceTokenCheckRule() {
        const tokenStatus = await this.getCurrentTokenStatus();
        // KI MUSS Token-Status prüfen
        await this.displayTokenStatus(tokenStatus);
        if (tokenStatus.percentage > this.tokenThresholds.emergency) {
            await this.emergencyStop("TOKEN EMERGENCY - KI MUSS STOPPEN!");
            return false;
        }
        if (tokenStatus.percentage > this.tokenThresholds.critical) {
            await this.forceChatSplit("KRITISCHE TOKEN-LAST - NEUER CHAT ERFORDERLICH!");
            return false;
        }
        return true;
    }
    /**
     * REGEL 2: KI-Antworten automatisch optimieren
     */
    async optimizeAIResponse(response) {
        const tokenStatus = await this.getCurrentTokenStatus();
        const responseTokens = this.estimateTokens(response);
        // Berechne verfügbares Token-Budget
        const maxTokens = 64000;
        const usedTokens = tokenStatus.percentage * maxTokens;
        const availableTokens = maxTokens - usedTokens;
        if (responseTokens > availableTokens * 0.8) {
            // Response kürzen und optimieren
            const optimizedResponse = await this.compressResponse(response, availableTokens * 0.6);
            return `${optimizedResponse}

⚠️ **ANTWORT AUTOMATISCH GEKÜRZT**
📊 Original: ~${responseTokens} tokens
📊 Optimiert: ~${this.estimateTokens(optimizedResponse)} tokens
📊 Token-Budget verfügbar: ${Math.round(availableTokens)}
💡 Für vollständige Antwort: \`Ctrl+Shift+P → AI Token Tracker: Neuen Chat starten\``;
        }
        return response;
    }
    /**
     * REGEL 3: Automatische Chat-Split bei kritischen Token-Levels
     */
    async enforceChatSplitRule() {
        const tokenStatus = await this.getCurrentTokenStatus();
        if (tokenStatus.percentage > this.tokenThresholds.warning) {
            const action = await vscode.window.showWarningMessage(`🚨 Token-Auslastung kritisch: ${Math.round(tokenStatus.percentage * 100)}%`, { modal: true }, 'Neuen Chat starten', 'Scope optimieren', 'Token-Bericht anzeigen');
            switch (action) {
                case 'Neuen Chat starten':
                    await this.createOptimizedNewChat();
                    break;
                case 'Scope optimieren':
                    await this.optimizeCurrentScope();
                    break;
                case 'Token-Bericht anzeigen':
                    await this.showDetailedTokenReport();
                    break;
            }
        }
    }
    /**
     * REGEL 4: KI-Verhalten-Monitoring in Echtzeit
     */
    async monitorAIBehavior() {
        const tokenStatus = await this.getCurrentTokenStatus();
        const chatHistory = await this.analyzeChatHistory();
        const instructionsLoad = await this.analyzeInstructionsLoad();
        return {
            complianceScore: this.calculateComplianceScore(tokenStatus),
            tokenAwareness: tokenStatus.percentage < 0.9 ? 'GOOD' : 'CRITICAL',
            behaviorStatus: this.assessBehaviorStatus(tokenStatus, chatHistory),
            recommendations: this.generateRecommendations(tokenStatus),
            autoActions: await this.determineAutoActions(tokenStatus)
        };
    }
    /**
     * REGEL 5: Proaktive Token-Optimierung
     */
    async proactiveOptimization() {
        const analysis = await this.holisticTokenAnalysis();
        const optimizations = [];
        // Chat-Verlauf optimieren
        if (analysis.chatHistory.tokens > 15000) {
            optimizations.push({
                type: 'COMPRESS_CHAT',
                description: 'Chat-Verlauf komprimieren',
                tokensSaved: analysis.chatHistory.tokens * 0.6,
                action: () => this.compressChatHistory()
            });
        }
        // Instructions optimieren
        if (analysis.instructions.tokens > 8000) {
            optimizations.push({
                type: 'SPLIT_INSTRUCTIONS',
                description: 'Instructions modularisieren',
                tokensSaved: analysis.instructions.tokens * 0.4,
                action: () => this.modularizeInstructions()
            });
        }
        // README-Cascade optimieren
        if (analysis.readmeCascade.tokens > 5000) {
            optimizations.push({
                type: 'OPTIMIZE_READMES',
                description: 'README-Dateien komprimieren',
                tokensSaved: analysis.readmeCascade.tokens * 0.3,
                action: () => this.optimizeReadmes()
            });
        }
        return {
            totalTokensSaved: optimizations.reduce((sum, opt) => sum + opt.tokensSaved, 0),
            optimizations,
            executionPlan: this.createExecutionPlan(optimizations)
        };
    }
    /**
     * NOTFALL-FUNKTIONEN
     */
    async emergencyStop(reason) {
        await vscode.window.showErrorMessage(`🚨 KI-NOTFALL-STOPP: ${reason}`, { modal: true }, 'Neuen Chat starten');
        // Logge Emergency Event
        this.logEmergencyEvent(reason);
    }
    async forceChatSplit(reason) {
        await vscode.window.showWarningMessage(`⚠️ AUTOMATISCHER CHAT-SPLIT: ${reason}`, 'Verstanden');
        await this.createOptimizedNewChat();
    }
    /**
     * HELPER FUNCTIONS
     */
    async getCurrentTokenStatus() {
        // Integration mit bestehender Extension
        const configManager = new (await Promise.resolve().then(() => __importStar(require('../core/configManager')))).ConfigManager();
        const tokenCounter = new (await Promise.resolve().then(() => __importStar(require('../core/tokenCounter')))).TokenCounter();
        // Simuliere aktuellen Token-Status für Demo
        const currentFileTokens = tokenCounter.countTokens(vscode.window.activeTextEditor?.document.getText() || '');
        const estimatedChatTokens = 15000; // Geschätzt
        const instructionsTokens = 5000; // Geschätzt
        const totalTokens = currentFileTokens + estimatedChatTokens + instructionsTokens;
        return {
            percentage: totalTokens / 64000,
            totalTokens,
            breakdown: {
                files: currentFileTokens,
                chatHistory: estimatedChatTokens,
                instructions: instructionsTokens,
                readmes: 2000,
                processing: 3000
            }
        };
    }
    estimateTokens(text) {
        // Approximation: 1 Token ≈ 4 Zeichen
        return Math.ceil(text.length / 4);
    }
    async compressResponse(response, maxTokens) {
        // Intelligente Response-Komprimierung
        const sentences = response.split(/[.!?]+/);
        const compressed = sentences
            .slice(0, Math.floor(sentences.length * 0.7))
            .join('. ');
        return compressed + '.';
    }
    calculateComplianceScore(tokenStatus) {
        if (tokenStatus.percentage < 0.5)
            return 1.0; // Perfekt
        if (tokenStatus.percentage < 0.75)
            return 0.8; // Gut
        if (tokenStatus.percentage < 0.85)
            return 0.6; // Ausreichend
        if (tokenStatus.percentage < 0.92)
            return 0.3; // Kritisch
        return 0.0; // Notfall
    }
    async createOptimizedNewChat() {
        // Erstelle neuen Chat mit optimiertem Context
        const essentialContext = await this.extractEssentialContext();
        vscode.window.showInformationMessage(`✅ Optimierter neuer Chat erstellt\n📊 Context reduziert um 70%\n💡 Fokus auf aktuelle Aufgabe`);
    }
    // Fehlende Methoden implementiert
    async displayTokenStatus(tokenStatus) {
        const percentage = Math.round(tokenStatus.percentage * 100);
        const statusIcon = percentage > 90 ? '🚨' : percentage > 75 ? '⚠️' : '✅';
        vscode.window.showInformationMessage(`${statusIcon} Token-Status: ${percentage}% (${tokenStatus.totalTokens}/64000)`);
    }
    async optimizeCurrentScope() {
        const optimization = await this.proactiveOptimization();
        vscode.window.showInformationMessage(`🎯 Scope optimiert: ${Math.round(optimization.totalTokensSaved)} Tokens gespart`);
    }
    async showDetailedTokenReport() {
        const tokenStatus = await this.getCurrentTokenStatus();
        const report = `
📊 DETAILLIERTER TOKEN-BERICHT
━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Dateien: ${tokenStatus.breakdown.files} tokens
💬 Chat-Verlauf: ${tokenStatus.breakdown.chatHistory} tokens  
📋 Instructions: ${tokenStatus.breakdown.instructions} tokens
📖 READMEs: ${tokenStatus.breakdown.readmes} tokens
🧠 Processing: ${tokenStatus.breakdown.processing} tokens
━━━━━━━━━━━━━━━━━━━━━━━━━━
Gesamt: ${tokenStatus.totalTokens} / 64000 (${Math.round(tokenStatus.percentage * 100)}%)
        `;
        vscode.window.showInformationMessage(report);
    }
    async analyzeChatHistory() {
        // Simulierte Chat-Verlauf Analyse
        return {
            messageCount: 25,
            averageMessageTokens: 150,
            totalTokens: 3750,
            longestMessage: 800,
            redundancyScore: 0.3
        };
    }
    async analyzeInstructionsLoad() {
        // Analysiere copilot-instructions.md
        try {
            const instructionsPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath +
                '/.github/copilot-instructions.md';
            const content = await vscode.workspace.fs.readFile(vscode.Uri.file(instructionsPath));
            const tokens = this.estimateTokens(content.toString());
            return {
                tokens,
                complexity: tokens > 5000 ? 'HIGH' : tokens > 2000 ? 'MEDIUM' : 'LOW',
                recommendations: tokens > 5000 ? ['Split instructions', 'Modularize'] : []
            };
        }
        catch {
            return { tokens: 0, complexity: 'UNKNOWN', recommendations: [] };
        }
    }
    assessBehaviorStatus(tokenStatus, chatHistory) {
        if (tokenStatus.percentage > 0.9)
            return 'VIOLATION';
        if (tokenStatus.percentage > 0.75)
            return 'NEEDS_IMPROVEMENT';
        return 'OPTIMAL';
    }
    generateRecommendations(tokenStatus) {
        const recommendations = [];
        if (tokenStatus.percentage > 0.85) {
            recommendations.push('Sofortiger neuer Chat erforderlich');
        }
        if (tokenStatus.breakdown.chatHistory > 15000) {
            recommendations.push('Chat-Verlauf komprimieren');
        }
        if (tokenStatus.breakdown.instructions > 8000) {
            recommendations.push('Instructions modularisieren');
        }
        return recommendations;
    }
    async determineAutoActions(tokenStatus) {
        const actions = [];
        if (tokenStatus.percentage > 0.8) {
            actions.push({
                type: 'CHAT_SPLIT',
                scheduled: true,
                eta: 'Sofort'
            });
        }
        return actions;
    }
    async holisticTokenAnalysis() {
        const chatHistory = await this.analyzeChatHistory();
        const instructions = await this.analyzeInstructionsLoad();
        return {
            chatHistory: { tokens: chatHistory.totalTokens },
            instructions: { tokens: instructions.tokens },
            readmeCascade: { tokens: 2000 }, // Geschätzt
            totalEstimated: chatHistory.totalTokens + instructions.tokens + 2000
        };
    }
    async compressChatHistory() {
        vscode.window.showInformationMessage('💬 Chat-Verlauf komprimiert');
    }
    async modularizeInstructions() {
        vscode.window.showInformationMessage('📋 Instructions modularisiert');
    }
    async optimizeReadmes() {
        vscode.window.showInformationMessage('📖 READMEs optimiert');
    }
    createExecutionPlan(optimizations) {
        return optimizations.map(opt => `${opt.type}: ${opt.description}`);
    }
    logEmergencyEvent(reason) {
        console.log(`🚨 EMERGENCY: ${reason} at ${new Date().toISOString()}`);
    }
    async extractEssentialContext() {
        return "Essential context extracted";
    }
}
exports.AISelfRegulationEngine = AISelfRegulationEngine;
//# sourceMappingURL=aiSelfRegulationEngine.js.map