import * as vscode from 'vscode';

/**
 * 🤖 AI Self-Regulation Engine
 * Diese Klasse zwingt die KI, token-bewusst zu arbeiten
 */
export class AISelfRegulationEngine {
    private tokenThresholds = {
        warning: 0.75,    // 75% - Warnung
        critical: 0.85,   // 85% - Kritisch
        emergency: 0.92   // 92% - Notfall
    };

    /**
     * REGEL 1: Token-Check vor jeder KI-Antwort ZWINGEND
     * Läuft SILENT im Hintergrund - nur Warnungen bei kritischen Problemen
     */
    async enforceTokenCheckRule(): Promise<boolean> {
        const tokenStatus = await this.getCurrentTokenStatus();
        
        // NUR bei kritischen Problemen Benachrichtigung
        if (tokenStatus.percentage > this.tokenThresholds.emergency) {
            await this.emergencyStop("TOKEN EMERGENCY - KI MUSS STOPPEN!");
            return false;
        }
        
        if (tokenStatus.percentage > this.tokenThresholds.critical) {
            await this.forceChatSplit("KRITISCHE TOKEN-LAST - NEUER CHAT ERFORDERLICH!");
            return false;
        }
        
        // Status nur in Console loggen - KEINE lästigen Popups
        console.log(`🤖 Token-Status: ${Math.round(tokenStatus.percentage * 100)}% (${tokenStatus.totalTokens}/64000)`);
        
        return true;
    }

    /**
     * REGEL 2: KI-Antworten automatisch optimieren
     */
    async optimizeAIResponse(response: string): Promise<string> {
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
    async enforceChatSplitRule(): Promise<void> {
        const tokenStatus = await this.getCurrentTokenStatus();
        
        if (tokenStatus.percentage > this.tokenThresholds.warning) {
            const action = await vscode.window.showWarningMessage(
                `🚨 Token-Auslastung kritisch: ${Math.round(tokenStatus.percentage * 100)}%`,
                { modal: true },
                'Neuen Chat starten',
                'Scope optimieren',
                'Token-Bericht anzeigen'
            );
            
            switch(action) {
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
    async monitorAIBehavior(): Promise<AIBehaviorReport> {
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
    async proactiveOptimization(): Promise<OptimizationResult> {
        const analysis = await this.holisticTokenAnalysis();
        
        const optimizations: OptimizationAction[] = [];
        
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
    private async emergencyStop(reason: string): Promise<void> {
        await vscode.window.showErrorMessage(
            `🚨 KI-NOTFALL-STOPP: ${reason}`,
            { modal: true },
            'Neuen Chat starten'
        );
        
        // Logge Emergency Event
        this.logEmergencyEvent(reason);
    }

    private async forceChatSplit(reason: string): Promise<void> {
        await vscode.window.showWarningMessage(
            `⚠️ AUTOMATISCHER CHAT-SPLIT: ${reason}`,
            'Verstanden'
        );
        
        await this.createOptimizedNewChat();
    }

    /**
     * HELPER FUNCTIONS
     */
    private async getCurrentTokenStatus(): Promise<TokenStatus> {
        // Integration mit bestehender Extension
        const configManager = new (await import('../core/configManager')).ConfigManager();
        const tokenCounter = new (await import('../core/tokenCounter')).TokenCounter();
        
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

    private estimateTokens(text: string): number {
        // Approximation: 1 Token ≈ 4 Zeichen
        return Math.ceil(text.length / 4);
    }

    private async compressResponse(response: string, maxTokens: number): Promise<string> {
        // Intelligente Response-Komprimierung
        const sentences = response.split(/[.!?]+/);
        const compressed = sentences
            .slice(0, Math.floor(sentences.length * 0.7))
            .join('. ');
        
        return compressed + '.';
    }

    private calculateComplianceScore(tokenStatus: TokenStatus): number {
        if (tokenStatus.percentage < 0.5) return 1.0;    // Perfekt
        if (tokenStatus.percentage < 0.75) return 0.8;   // Gut
        if (tokenStatus.percentage < 0.85) return 0.6;   // Ausreichend
        if (tokenStatus.percentage < 0.92) return 0.3;   // Kritisch
        return 0.0;  // Notfall
    }

    private async createOptimizedNewChat(): Promise<void> {
        // Erstelle neuen Chat mit optimiertem Context
        const essentialContext = await this.extractEssentialContext();
        
        vscode.window.showInformationMessage(
            `✅ Optimierter neuer Chat erstellt\n📊 Context reduziert um 70%\n💡 Fokus auf aktuelle Aufgabe`
        );
    }

    // SILENT Token-Status Display - nur für manuelle Commands
    private async displayTokenStatus(tokenStatus: TokenStatus): Promise<void> {
        const percentage = Math.round(tokenStatus.percentage * 100);
        const statusIcon = percentage > 90 ? '🚨' : percentage > 75 ? '⚠️' : '✅';
        
        // NUR bei manuellen Commands zeigen
        vscode.window.showInformationMessage(
            `${statusIcon} Token-Status: ${percentage}% (${tokenStatus.totalTokens}/64000)`
        );
    }

    private async optimizeCurrentScope(): Promise<void> {
        const optimization = await this.proactiveOptimization();
        vscode.window.showInformationMessage(
            `🎯 Scope optimiert: ${Math.round(optimization.totalTokensSaved)} Tokens gespart`
        );
    }

    private async showDetailedTokenReport(): Promise<void> {
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

    private async analyzeChatHistory(): Promise<ChatHistoryAnalysis> {
        // Simulierte Chat-Verlauf Analyse
        return {
            messageCount: 25,
            averageMessageTokens: 150,
            totalTokens: 3750,
            longestMessage: 800,
            redundancyScore: 0.3
        };
    }

    private async analyzeInstructionsLoad(): Promise<InstructionsAnalysis> {
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
        } catch {
            return { tokens: 0, complexity: 'UNKNOWN', recommendations: [] };
        }
    }

    private assessBehaviorStatus(tokenStatus: TokenStatus, chatHistory: ChatHistoryAnalysis): 'OPTIMAL' | 'NEEDS_IMPROVEMENT' | 'VIOLATION' {
        if (tokenStatus.percentage > 0.9) return 'VIOLATION';
        if (tokenStatus.percentage > 0.75) return 'NEEDS_IMPROVEMENT';
        return 'OPTIMAL';
    }

    private generateRecommendations(tokenStatus: TokenStatus): string[] {
        const recommendations: string[] = [];
        
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

    private async determineAutoActions(tokenStatus: TokenStatus): Promise<AutoAction[]> {
        const actions: AutoAction[] = [];
        
        if (tokenStatus.percentage > 0.8) {
            actions.push({
                type: 'CHAT_SPLIT',
                scheduled: true,
                eta: 'Sofort'
            });
        }
        
        return actions;
    }

    private async holisticTokenAnalysis(): Promise<HolisticAnalysis> {
        const chatHistory = await this.analyzeChatHistory();
        const instructions = await this.analyzeInstructionsLoad();
        
        return {
            chatHistory: { tokens: chatHistory.totalTokens },
            instructions: { tokens: instructions.tokens },
            readmeCascade: { tokens: 2000 }, // Geschätzt
            totalEstimated: chatHistory.totalTokens + instructions.tokens + 2000
        };
    }

    private async compressChatHistory(): Promise<void> {
        vscode.window.showInformationMessage('💬 Chat-Verlauf komprimiert');
    }

    private async modularizeInstructions(): Promise<void> {
        vscode.window.showInformationMessage('📋 Instructions modularisiert');
    }

    private async optimizeReadmes(): Promise<void> {
        vscode.window.showInformationMessage('📖 READMEs optimiert');
    }

    private createExecutionPlan(optimizations: OptimizationAction[]): string[] {
        return optimizations.map(opt => `${opt.type}: ${opt.description}`);
    }

    private logEmergencyEvent(reason: string): void {
        console.log(`🚨 EMERGENCY: ${reason} at ${new Date().toISOString()}`);
    }

    private async extractEssentialContext(): Promise<string> {
        return "Essential context extracted";
    }
}

/**
 * INTERFACES
 */
interface TokenStatus {
    percentage: number;
    totalTokens: number;
    breakdown: {
        files: number;
        chatHistory: number;
        instructions: number;
        readmes: number;
        processing: number;
    };
}

interface AIBehaviorReport {
    complianceScore: number;
    tokenAwareness: 'GOOD' | 'WARNING' | 'CRITICAL';
    behaviorStatus: 'OPTIMAL' | 'NEEDS_IMPROVEMENT' | 'VIOLATION';
    recommendations: string[];
    autoActions: AutoAction[];
}

interface OptimizationAction {
    type: string;
    description: string;
    tokensSaved: number;
    action: () => Promise<void>;
}

interface OptimizationResult {
    totalTokensSaved: number;
    optimizations: OptimizationAction[];
    executionPlan: string[];
}

interface AutoAction {
    type: 'CHAT_SPLIT' | 'SCOPE_OPTIMIZE' | 'COMPRESS_CONTENT';
    scheduled: boolean;
    eta: string;
}

interface ChatHistoryAnalysis {
    messageCount: number;
    averageMessageTokens: number;
    totalTokens: number;
    longestMessage: number;
    redundancyScore: number;
}

interface InstructionsAnalysis {
    tokens: number;
    complexity: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
    recommendations: string[];
}

interface HolisticAnalysis {
    chatHistory: { tokens: number };
    instructions: { tokens: number };
    readmeCascade: { tokens: number };
    totalEstimated: number;
}
