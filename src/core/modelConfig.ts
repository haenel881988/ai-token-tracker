/**
 * AI Model Configuration - Exakte Token-Limits pro Modell
 * 
 * Diese Datei definiert die genauen Token-Limits für verschiedene AI-Modelle
 * und deren spezifische Eigenschaften für optimales Token-Management.
 */

export interface AIModelConfig {
    name: string;
    provider: string;
    maxTokens: number;
    inputTokens: number;
    outputTokens: number;
    contextWindow: number;
    costPer1kTokens: number;
    warningThreshold: number;
    criticalThreshold: number;
    recommendedSplit: number;
}

/**
 * Definierte AI-Modelle mit exakten Spezifikationen
 */
export const AI_MODELS: Record<string, AIModelConfig> = {
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
    'gpt-4.1': {
        name: 'GPT-4.1',
        provider: 'openai',
        maxTokens: 64000, // Exakte Werte wie gewünscht
        inputTokens: 64000,
        outputTokens: 8192,
        contextWindow: 64000,
        costPer1kTokens: 0.015, // Geschätzt
        warningThreshold: 0.75,
        criticalThreshold: 0.90,
        recommendedSplit: 16000
    },

    'claude-sonnet-3.5': {
        name: 'Claude Sonnet 3.5',
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

    'claude-sonnet-3.7': {
        name: 'Claude Sonnet 3.7',
        provider: 'anthropic',
        maxTokens: 200000,
        inputTokens: 200000,
        outputTokens: 8192,
        contextWindow: 200000,
        costPer1kTokens: 0.0025, // Verbesserte Version
        warningThreshold: 0.80,
        criticalThreshold: 0.92,
        recommendedSplit: 50000
    },

    'claude-sonnet-4': {
        name: 'Claude Sonnet 4',
        provider: 'anthropic',
        maxTokens: 200000, // Wie gewünscht
        inputTokens: 200000,
        outputTokens: 16384, // Höhere Output-Kapazität
        contextWindow: 200000,
        costPer1kTokens: 0.005, // Premium-Modell
        warningThreshold: 0.80,
        criticalThreshold: 0.92,
        recommendedSplit: 50000
    },

    'gemini-2.5-pro': {
        name: 'Gemini 2.5 Pro',
        provider: 'google',
        maxTokens: 1000000, // 1 Million Tokens!
        inputTokens: 1000000,
        outputTokens: 32768,
        contextWindow: 1000000,
        costPer1kTokens: 0.002, // Günstig für große Kontexte
        warningThreshold: 0.85, // Höher wegen großem Kontext
        criticalThreshold: 0.95,
        recommendedSplit: 250000 // 250k Chunks
    },

    'o4-mini-preview': {
        name: 'o4-mini (Preview)',
        provider: 'openai',
        maxTokens: 32000, // Preview-Limit
        inputTokens: 32000,
        outputTokens: 4096,
        contextWindow: 32000,
        costPer1kTokens: 0.001, // Günstig für Tests
        warningThreshold: 0.75,
        criticalThreshold: 0.90,
        recommendedSplit: 8000
    },

    'gpt-4.1-placeholder': {
        name: 'GPT-4.1 (Legacy)',
        provider: 'openai',
        maxTokens: 64000, // Updated zu den exakten Werten
        inputTokens: 64000,
        outputTokens: 8192,
        contextWindow: 64000,
        costPer1kTokens: 0.015,
        warningThreshold: 0.75,
        criticalThreshold: 0.90,
        recommendedSplit: 16000
    },

    'gemini-pro': {
        name: 'Gemini Pro (Legacy)',
        provider: 'google',
        maxTokens: 32768,
        inputTokens: 32768,
        outputTokens: 8192,
        contextWindow: 32768,
        costPer1kTokens: 0.001,
        warningThreshold: 0.75,
        criticalThreshold: 0.90,
        recommendedSplit: 8000
    }
};

/**
 * Standard-Modell falls keines erkannt wird
 */
export const DEFAULT_MODEL: AIModelConfig = AI_MODELS['gpt-4'];

/**
 * Automatische Modell-Erkennung basierend auf Kontext
 */
export class ModelDetector {
    /**
     * Versucht das aktuelle AI-Modell zu erkennen
     */
    static detectCurrentModel(): AIModelConfig {
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
    private static getIntelligentDefault(): AIModelConfig {
        // Prüfe auf GitHub Copilot
        if (this.isGitHubCopilotActive()) {
            return AI_MODELS['github-copilot'];
        }

        // Prüfe auf andere Extensions
        // TODO: Weitere Provider-Detection

        // Fallback auf GPT-4o Mini (günstig + gut)
        return AI_MODELS['gpt-4o-mini'];
    }

    /**
     * Prüft ob GitHub Copilot aktiv ist
     */
    private static isGitHubCopilotActive(): boolean {
        // TODO: Echte Copilot-Detection
        return true; // Placeholder
    }
}

/**
 * Chat-Empfehlungsengine
 */
export class ChatRecommendationEngine {
    /**
     * Berechnet ob ein neuer Chat empfohlen wird
     */
    static shouldRecommendNewChat(
        currentTokens: number, 
        model: AIModelConfig,
        chatAge: number,
        fileComplexity: number
    ): {
        shouldStart: boolean;
        reason: string;
        urgency: 'low' | 'medium' | 'high' | 'critical';
    } {
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
