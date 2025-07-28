"use strict";
/**
 * AI Model Configuration - Exakte Token-Limits pro Modell
 *
 * Diese Datei definiert die genauen Token-Limits für verschiedene AI-Modelle
 * und deren spezifische Eigenschaften für optimales Token-Management.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRecommendationEngine = exports.ModelDetector = exports.DEFAULT_MODEL = exports.AI_MODELS = void 0;
/**
 * Definierte AI-Modelle mit exakten Spezifikationen
 */
exports.AI_MODELS = {
    // OpenAI GPT Models
    'gpt-4o': {
        name: 'GPT-4o',
        provider: 'openai',
        maxTokens: 128000,
        inputTokens: 128000,
        outputTokens: 4096,
        contextWindow: 128000,
        costPer1kTokens: 0.005,
        warningThreshold: 0.75,
        criticalThreshold: 0.90,
        recommendedSplit: 32000
    },
    'gpt-4o-mini': {
        name: 'GPT-4o Mini',
        provider: 'openai',
        maxTokens: 128000,
        inputTokens: 128000,
        outputTokens: 16384,
        contextWindow: 128000,
        costPer1kTokens: 0.00015,
        warningThreshold: 0.75,
        criticalThreshold: 0.90,
        recommendedSplit: 32000
    },
    'gpt-4-turbo': {
        name: 'GPT-4 Turbo',
        provider: 'openai',
        maxTokens: 128000,
        inputTokens: 128000,
        outputTokens: 4096,
        contextWindow: 128000,
        costPer1kTokens: 0.01,
        warningThreshold: 0.75,
        criticalThreshold: 0.90,
        recommendedSplit: 32000
    },
    'gpt-4': {
        name: 'GPT-4',
        provider: 'openai',
        maxTokens: 8192,
        inputTokens: 8192,
        outputTokens: 8192,
        contextWindow: 8192,
        costPer1kTokens: 0.03,
        warningThreshold: 0.70,
        criticalThreshold: 0.85,
        recommendedSplit: 2000
    },
    'gpt-3.5-turbo': {
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        maxTokens: 16385,
        inputTokens: 16385,
        outputTokens: 4096,
        contextWindow: 16385,
        costPer1kTokens: 0.0015,
        warningThreshold: 0.75,
        criticalThreshold: 0.90,
        recommendedSplit: 4000
    },
    // Anthropic Claude Models  
    'claude-3-5-sonnet': {
        name: 'Claude 3.5 Sonnet',
        provider: 'anthropic',
        maxTokens: 200000,
        inputTokens: 200000,
        outputTokens: 8192,
        contextWindow: 200000,
        costPer1kTokens: 0.003,
        warningThreshold: 0.80,
        criticalThreshold: 0.92,
        recommendedSplit: 50000
    },
    'claude-3-opus': {
        name: 'Claude 3 Opus',
        provider: 'anthropic',
        maxTokens: 200000,
        inputTokens: 200000,
        outputTokens: 4096,
        contextWindow: 200000,
        costPer1kTokens: 0.015,
        warningThreshold: 0.80,
        criticalThreshold: 0.92,
        recommendedSplit: 50000
    },
    'claude-3-haiku': {
        name: 'Claude 3 Haiku',
        provider: 'anthropic',
        maxTokens: 200000,
        inputTokens: 200000,
        outputTokens: 4096,
        contextWindow: 200000,
        costPer1kTokens: 0.00025,
        warningThreshold: 0.80,
        criticalThreshold: 0.92,
        recommendedSplit: 50000
    },
    // GitHub Copilot (verwendet GPT-4 Backend)
    'github-copilot': {
        name: 'GitHub Copilot',
        provider: 'github',
        maxTokens: 8192, // Konservative Schätzung
        inputTokens: 8192,
        outputTokens: 2048,
        contextWindow: 8192,
        costPer1kTokens: 0, // Flat-Rate
        warningThreshold: 0.70,
        criticalThreshold: 0.85,
        recommendedSplit: 2000
    },
    // Platzhalter für weitere Modelle
    'gpt-4.1-placeholder': {
        name: 'GPT-4.1 (Placeholder)',
        provider: 'openai',
        maxTokens: 200000, // PLACEHOLDER - Exakte Werte folgen
        inputTokens: 200000,
        outputTokens: 8192,
        contextWindow: 200000,
        costPer1kTokens: 0.01, // PLACEHOLDER
        warningThreshold: 0.75,
        criticalThreshold: 0.90,
        recommendedSplit: 50000
    },
    'gemini-pro': {
        name: 'Gemini Pro',
        provider: 'google',
        maxTokens: 32768, // PLACEHOLDER
        inputTokens: 32768,
        outputTokens: 8192,
        contextWindow: 32768,
        costPer1kTokens: 0.001, // PLACEHOLDER
        warningThreshold: 0.75,
        criticalThreshold: 0.90,
        recommendedSplit: 8000
    }
};
/**
 * Standard-Modell falls keines erkannt wird
 */
exports.DEFAULT_MODEL = exports.AI_MODELS['gpt-4'];
/**
 * Automatische Modell-Erkennung basierend auf Kontext
 */
class ModelDetector {
    /**
     * Versucht das aktuelle AI-Modell zu erkennen
     */
    static detectCurrentModel() {
        // TODO: Echte Modell-Erkennung implementieren
        // - VS Code Extensions API abfragen
        // - GitHub Copilot Settings prüfen
        // - OpenAI API Headers analysieren
        // Für jetzt: Intelligente Schätzung
        return this.getIntelligentDefault();
    }
    /**
     * Intelligente Standard-Auswahl basierend auf verfügbaren Tools
     */
    static getIntelligentDefault() {
        // Prüfe auf GitHub Copilot
        if (this.isGitHubCopilotActive()) {
            return exports.AI_MODELS['github-copilot'];
        }
        // Prüfe auf andere Extensions
        // TODO: Weitere Provider-Detection
        // Fallback auf GPT-4o Mini (günstig + gut)
        return exports.AI_MODELS['gpt-4o-mini'];
    }
    /**
     * Prüft ob GitHub Copilot aktiv ist
     */
    static isGitHubCopilotActive() {
        // TODO: Echte Copilot-Detection
        return true; // Placeholder
    }
}
exports.ModelDetector = ModelDetector;
/**
 * Chat-Empfehlungsengine
 */
class ChatRecommendationEngine {
    /**
     * Berechnet ob ein neuer Chat empfohlen wird
     */
    static shouldRecommendNewChat(currentTokens, model, chatAge, fileComplexity) {
        const percentage = (currentTokens / model.maxTokens) * 100;
        // Kritisch: Sofort neuen Chat starten
        if (percentage >= model.criticalThreshold * 100) {
            return {
                shouldStart: true,
                reason: '🚨 Token-Limit kritisch erreicht! Halluzination-Gefahr!',
                urgency: 'critical'
            };
        }
        // Hoch: Stark empfohlen
        if (percentage >= model.warningThreshold * 100) {
            return {
                shouldStart: true,
                reason: '⚠️ Token-Limit erreicht. Neuer Chat für optimale Performance.',
                urgency: 'high'
            };
        }
        // Medium: Bei komplexen Dateien früher empfehlen
        if (percentage >= 50 && fileComplexity > 0.7) {
            return {
                shouldStart: true,
                reason: '💡 Komplexe Datei + moderate Token-Nutzung. Frischer Chat empfohlen.',
                urgency: 'medium'
            };
        }
        // Niedrig: Bei langen Chat-Sessions
        if (chatAge > 60 && percentage >= 30) {
            return {
                shouldStart: true,
                reason: '🔄 Lange Chat-Session. Frischer Start für bessere Ergebnisse.',
                urgency: 'low'
            };
        }
        return {
            shouldStart: false,
            reason: '✅ Token-Verbrauch im optimalen Bereich.',
            urgency: 'low'
        };
    }
}
exports.ChatRecommendationEngine = ChatRecommendationEngine;
//# sourceMappingURL=modelConfig.js.map