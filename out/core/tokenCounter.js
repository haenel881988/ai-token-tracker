"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenCounter = void 0;
/**
 * Token Counter - Zentrale Klasse für Token-Berechnung
 *
 * Diese Klasse implementiert die Token-Zählung für verschiedene Textinhalte.
 * Sie berücksichtigt sowohl den aktuellen Code als auch Chat-Verlauf und
 * Zusammenfassungen, die oft vergessen werden.
 */
class TokenCounter {
    constructor() {
        this.usageHistory = new Map();
    }
    /**
     * Zählt Tokens in einem gegebenen Text
     * Verwendet eine einfache Approximation: ~4 Zeichen = 1 Token
     * TODO: Integration mit tiktoken für genaue GPT-Token-Berechnung
     */
    countTokens(text) {
        if (!text)
            return 0;
        // Einfache Token-Approximation
        // Echte Implementierung würde tiktoken verwenden
        const words = text.split(/\s+/).filter(word => word.length > 0);
        const characters = text.length;
        // Approximation: Durchschnittlich 4 Zeichen pro Token
        const approximateTokens = Math.ceil(characters / 4);
        // Alternative: Wort-basierte Schätzung (1.3 Tokens pro Wort)
        const wordBasedTokens = Math.ceil(words.length * 1.3);
        // Nimm den höheren Wert für konservative Schätzung
        return Math.max(approximateTokens, wordBasedTokens);
    }
    /**
     * Verfolgt Token-Verbrauch für einen Scope
     */
    trackUsage(scopeId, tokens) {
        if (!this.usageHistory.has(scopeId)) {
            this.usageHistory.set(scopeId, []);
        }
        const history = this.usageHistory.get(scopeId);
        history.push(tokens);
        // Behalte nur die letzten 100 Messungen
        if (history.length > 100) {
            history.shift();
        }
    }
    /**
     * Gibt aktuelle Token-Usage für einen Scope zurück
     */
    getCurrentUsage(scopeId) {
        const history = this.usageHistory.get(scopeId) || [];
        const current = history.length > 0 ? history[history.length - 1] : 0;
        // TODO: maxTokens sollte aus Scope-Konfiguration kommen
        const max = 64000; // Copilot Chat Token-Limit
        const percentage = max > 0 ? (current / max) * 100 : 0;
        const remaining = Math.max(0, max - current);
        const warningTriggered = percentage >= 80; // 80% Warnschwelle
        return {
            current,
            max,
            percentage,
            remaining,
            warningTriggered
        };
    }
    /**
     * Berechnet Token für Chat-Verlauf und Zusammenfassungen
     * Dies ist ein kritischer Punkt, der oft übersehen wird!
     */
    calculateChatHistoryTokens(messages) {
        let totalTokens = 0;
        for (const message of messages) {
            totalTokens += this.countTokens(message);
        }
        // Zusätzliche Tokens für Zusammenfassungen schätzen
        // KI fasst regelmäßig Chat-Verlauf zusammen - das kostet auch Tokens!
        const summaryOverhead = Math.ceil(totalTokens * 0.1); // 10% Overhead
        return totalTokens + summaryOverhead;
    }
    /**
     * Erweiterte Token-Berechnung mit Kontext
     */
    calculateContextualTokens(prompt, fileContent, chatHistory) {
        const promptTokens = this.countTokens(prompt);
        const fileTokens = this.countTokens(fileContent);
        const chatTokens = this.calculateChatHistoryTokens(chatHistory);
        // System-Prompt und andere Overhead-Tokens
        const systemOverhead = 200; // Geschätzte System-Prompts
        return promptTokens + fileTokens + chatTokens + systemOverhead;
    }
    /**
     * Gibt Token-Verlauf für einen Scope zurück
     */
    getTokenHistory(scopeId) {
        return this.usageHistory.get(scopeId) || [];
    }
    /**
     * Löscht Token-Verlauf für einen Scope
     */
    clearHistory(scopeId) {
        this.usageHistory.delete(scopeId);
    }
}
exports.TokenCounter = TokenCounter;
//# sourceMappingURL=tokenCounter.js.map