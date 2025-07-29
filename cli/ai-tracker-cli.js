#!/usr/bin/env node

/**
 * AI Token Tracker CLI - Standalone Tool für Chat-Kontext-Analyse
 * 
 * Dieses CLI-Tool kann von der KI über das Terminal aufgerufen werden,
 * um Chat-Verläufe zu analysieren und Token-Risiken zu bewerten.
 * 
 * Verwendung:
 *   npx ai-tracker-cli <path-to-chat-file>
 *   node cli/ai-tracker-cli.js <path-to-chat-file>
 */

const fs = require('fs');
const path = require('path');

// Einfache Token-Zählung (approximiert GPT-4 Tokenizer)
function countTokens(text) {
    // Grobe Schätzung: ~4 Zeichen pro Token für deutsche/englische Texte
    // Für Copilot-Chats mit Code: ~3.5 Zeichen pro Token
    const chars = text.length;
    const avgCharsPerToken = 3.5;
    return Math.ceil(chars / avgCharsPerToken);
}

function analyzeRisk(tokenCount, maxTokens = 64000) {
    const usagePercentage = (tokenCount / maxTokens) * 100;
    
    let riskLevel, status, recommendation;
    
    if (usagePercentage >= 95) {
        riskLevel = 'critical';
        status = 'critical';
        recommendation = 'IMMEDIATE_STOP';
    } else if (usagePercentage >= 85) {
        riskLevel = 'critical';
        status = 'critical';
        recommendation = 'NEW_CHAT_REQUIRED';
    } else if (usagePercentage >= 75) {
        riskLevel = 'high';
        status = 'warning';
        recommendation = 'SPLIT_TASK';
    } else if (usagePercentage >= 60) {
        riskLevel = 'medium';
        status = 'warning';
        recommendation = 'MONITOR_USAGE';
    } else {
        riskLevel = 'low';
        status = 'ok';
        recommendation = 'CONTINUE_NORMAL';
    }
    
    return {
        tokenCount,
        maxTokens,
        usagePercentage: Math.round(usagePercentage * 10) / 10,
        riskLevel,
        status,
        recommendation,
        shouldSplitTask: usagePercentage >= 75,
        shouldStartNewChat: usagePercentage >= 85
    };
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.error('❌ Fehler: Keine Datei angegeben.');
        console.error('Verwendung: node ai-tracker-cli.js <chat-file.md>');
        process.exit(1);
    }
    
    const filePath = args[0];
    
    if (!fs.existsSync(filePath)) {
        console.error(`❌ Fehler: Datei '${filePath}' nicht gefunden.`);
        process.exit(1);
    }
    
    try {
        const chatContent = fs.readFileSync(filePath, 'utf8');
        const analysis = analyzeRisk(countTokens(chatContent));
        
        // JSON-Output für programmatische Verwendung
        if (args.includes('--json')) {
            console.log(JSON.stringify(analysis, null, 2));
            return;
        }
        
        // Human-readable Output
        console.log('🤖 AI Token Tracker - Chat-Analyse');
        console.log('=====================================');
        console.log(`📁 Datei: ${path.basename(filePath)}`);
        console.log(`🔢 Tokens: ${analysis.tokenCount.toLocaleString()}`);
        console.log(`📊 Auslastung: ${analysis.usagePercentage}%`);
        console.log(`⚠️  Risiko: ${analysis.riskLevel.toUpperCase()}`);
        console.log(`📋 Status: ${analysis.status.toUpperCase()}`);
        console.log(`💡 Empfehlung: ${analysis.recommendation}`);
        
        if (analysis.shouldStartNewChat) {
            console.log('');
            console.log('🚨 KRITISCH: Neuer Chat erforderlich!');
        } else if (analysis.shouldSplitTask) {
            console.log('');
            console.log('⚠️  WARNUNG: Aufgabe aufteilen empfohlen!');
        }
        
        // Exit-Code für automatische Skripte
        if (analysis.status === 'critical') {
            process.exit(2); // Critical
        } else if (analysis.status === 'warning') {
            process.exit(1); // Warning
        } else {
            process.exit(0); // OK
        }
        
    } catch (error) {
        console.error(`❌ Fehler beim Lesen der Datei: ${error.message}`);
        process.exit(1);
    }
}

// Nur ausführen wenn direkt aufgerufen (nicht wenn als Modul importiert)
if (require.main === module) {
    main();
}

module.exports = { countTokens, analyzeRisk };
