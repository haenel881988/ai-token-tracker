"use strict";
/**
 * Complexity Manager - Intelligente Komplexitäts-Überwachung
 *
 * Diese Klasse überwacht die Projekt-Komplexität und triggert automatisch
 * Vereinfachungs-Maßnahmen wenn Token/Komplexitäts-Limits erreicht werden.
 */
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
exports.ComplexityManager = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class ComplexityManager {
    constructor(workspacePath, tokenCounter) {
        this.workspacePath = workspacePath;
        this.tokenCounter = tokenCounter;
        this.thresholds = {
            maxTokensPerFile: 2500, // Max Tokens pro Datei
            maxTotalTokens: 64000, // Wie gewünscht: 64k Limit
            maxDependencyDepth: 5, // Max Abhängigkeits-Tiefe
            maxSimilarityThreshold: 0.8, // 80% Ähnlichkeit = Duplikat
            complexityWarningLevel: 0.7, // 70% Komplexität
            complexityCriticalLevel: 0.9 // 90% Komplexität
        };
    }
    /**
     * Hauptanalyse: Komplette Projekt-Komplexitäts-Bewertung
     */
    async analyzeProjectComplexity() {
        console.log('🔍 Starte umfassende Projekt-Komplexitäts-Analyse...');
        const metrics = {
            totalFiles: 0,
            duplicateFiles: [],
            redundantContent: [],
            dependencyChain: new Map(),
            complexityScore: 0,
            tokenHotspots: [],
            recommendations: []
        };
        // 1. Alle Dateien scannen und Token-Hotspots identifizieren
        await this.scanForTokenHotspots(metrics);
        // 2. Duplikate und Redundanzen finden
        await this.findDuplicatesAndRedundancies(metrics);
        // 3. Abhängigkeits-Ketten analysieren
        await this.analyzeDependencyChains(metrics);
        // 4. Gesamt-Komplexitäts-Score berechnen
        this.calculateComplexityScore(metrics);
        // 5. Empfehlungen generieren
        this.generateRecommendations(metrics);
        // 6. Kritische Situationen automatisch behandeln
        await this.handleCriticalComplexity(metrics);
        return metrics;
    }
    /**
     * Scannt nach Token-intensiven Dateien
     */
    async scanForTokenHotspots(metrics) {
        const files = await this.getAllProjectFiles();
        for (const filePath of files) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const tokens = this.tokenCounter.countTokens(content);
                const complexity = this.calculateFileComplexity(content, filePath);
                metrics.totalFiles++;
                if (tokens > this.thresholds.maxTokensPerFile) {
                    metrics.tokenHotspots.push({
                        file: path.relative(this.workspacePath, filePath),
                        tokens,
                        complexity
                    });
                }
            }
            catch (error) {
                console.error(`Fehler beim Scannen von ${filePath}:`, error);
            }
        }
        // Sortieren nach Token-Anzahl (höchste zuerst)
        metrics.tokenHotspots.sort((a, b) => b.tokens - a.tokens);
    }
    /**
     * Findet Duplikate und redundante Inhalte
     */
    async findDuplicatesAndRedundancies(metrics) {
        const files = await this.getAllProjectFiles();
        const fileContents = new Map();
        // Alle Datei-Inhalte laden
        for (const filePath of files) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                fileContents.set(filePath, content);
            }
            catch (error) {
                console.error(`Fehler beim Laden von ${filePath}:`, error);
            }
        }
        // Paarweise Ähnlichkeit prüfen
        const fileList = Array.from(fileContents.keys());
        for (let i = 0; i < fileList.length; i++) {
            for (let j = i + 1; j < fileList.length; j++) {
                const file1 = fileList[i];
                const file2 = fileList[j];
                const content1 = fileContents.get(file1);
                const content2 = fileContents.get(file2);
                const similarity = this.calculateSimilarity(content1, content2);
                if (similarity > this.thresholds.maxSimilarityThreshold) {
                    metrics.redundantContent.push({
                        file1: path.relative(this.workspacePath, file1),
                        file2: path.relative(this.workspacePath, file2),
                        similarity
                    });
                    // Als Duplikat markieren
                    const relFile1 = path.relative(this.workspacePath, file1);
                    const relFile2 = path.relative(this.workspacePath, file2);
                    if (!metrics.duplicateFiles.includes(relFile1)) {
                        metrics.duplicateFiles.push(relFile1);
                    }
                    if (!metrics.duplicateFiles.includes(relFile2)) {
                        metrics.duplicateFiles.push(relFile2);
                    }
                }
            }
        }
    }
    /**
     * Analysiert Abhängigkeits-Ketten
     */
    async analyzeDependencyChains(metrics) {
        const files = await this.getAllProjectFiles();
        for (const filePath of files) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const dependencies = this.extractDependencies(content);
                const relativePath = path.relative(this.workspacePath, filePath);
                metrics.dependencyChain.set(relativePath, dependencies);
            }
            catch (error) {
                console.error(`Fehler bei Abhängigkeits-Analyse von ${filePath}:`, error);
            }
        }
    }
    /**
     * Berechnet Gesamt-Komplexitäts-Score
     */
    calculateComplexityScore(metrics) {
        let score = 0;
        // Token-Hotspots (40% der Bewertung)
        const tokenScore = Math.min(metrics.tokenHotspots.length / 10, 1) * 0.4;
        score += tokenScore;
        // Redundanzen (30% der Bewertung)
        const redundancyScore = Math.min(metrics.redundantContent.length / 5, 1) * 0.3;
        score += redundancyScore;
        // Abhängigkeits-Komplexität (20% der Bewertung)
        let maxDepth = 0;
        for (const deps of metrics.dependencyChain.values()) {
            maxDepth = Math.max(maxDepth, deps.length);
        }
        const dependencyScore = Math.min(maxDepth / this.thresholds.maxDependencyDepth, 1) * 0.2;
        score += dependencyScore;
        // Datei-Anzahl (10% der Bewertung)
        const fileCountScore = Math.min(metrics.totalFiles / 50, 1) * 0.1;
        score += fileCountScore;
        metrics.complexityScore = score;
    }
    /**
     * Generiert konkrete Empfehlungen
     */
    generateRecommendations(metrics) {
        const recommendations = [];
        // Token-Hotspot Empfehlungen
        if (metrics.tokenHotspots.length > 0) {
            recommendations.push(`🔥 ${metrics.tokenHotspots.length} Token-Hotspots gefunden - Sofortige Aufspaltung erforderlich!`);
            for (const hotspot of metrics.tokenHotspots.slice(0, 3)) {
                recommendations.push(`   📄 ${hotspot.file}: ${hotspot.tokens} Tokens → Aufteilen in ${Math.ceil(hotspot.tokens / 2000)} Module`);
            }
        }
        // Redundanz-Empfehlungen
        if (metrics.redundantContent.length > 0) {
            recommendations.push(`🔄 ${metrics.redundantContent.length} Redundanzen gefunden - Konsolidierung nötig!`);
            for (const redundancy of metrics.redundantContent.slice(0, 3)) {
                recommendations.push(`   📋 ${redundancy.file1} ↔ ${redundancy.file2}: ${(redundancy.similarity * 100).toFixed(1)}% ähnlich → Zusammenführen`);
            }
        }
        // Komplexitäts-Empfehlungen
        if (metrics.complexityScore > this.thresholds.complexityWarningLevel) {
            if (metrics.complexityScore > this.thresholds.complexityCriticalLevel) {
                recommendations.push(`🚨 KRITISCHE KOMPLEXITÄT (${(metrics.complexityScore * 100).toFixed(1)}%) - Sofortiges Refactoring erforderlich!`);
            }
            else {
                recommendations.push(`⚠️ HOHE KOMPLEXITÄT (${(metrics.complexityScore * 100).toFixed(1)}%) - Refactoring empfohlen`);
            }
        }
        // Token-Limit Empfehlungen
        const totalEstimatedTokens = metrics.tokenHotspots.reduce((sum, h) => sum + h.tokens, 0);
        if (totalEstimatedTokens > this.thresholds.maxTotalTokens * 0.8) {
            recommendations.push(`📊 Token-Limit bei ${((totalEstimatedTokens / this.thresholds.maxTotalTokens) * 100).toFixed(1)}% - Scope-Aufspaltung nötig!`);
        }
        metrics.recommendations = recommendations;
    }
    /**
     * Behandelt kritische Komplexitäts-Situationen automatisch
     */
    async handleCriticalComplexity(metrics) {
        if (metrics.complexityScore > this.thresholds.complexityCriticalLevel) {
            // Automatische Scope-Aufspaltung triggern
            await this.createComplexityManagementStructure(metrics);
            // User warnen
            vscode.window.showErrorMessage(`🚨 Kritische Projekt-Komplexität erkannt! Automatische Refactoring-Struktur erstellt.`, 'Analyse anzeigen').then(selection => {
                if (selection) {
                    this.showComplexityReport(metrics);
                }
            });
        }
    }
    /**
     * Erstellt Komplexitäts-Management Struktur
     */
    async createComplexityManagementStructure(metrics) {
        const complexityPath = path.join(this.workspacePath, '.github', 'complexity_management');
        // Verzeichnis erstellen
        if (!fs.existsSync(complexityPath)) {
            fs.mkdirSync(complexityPath, { recursive: true });
        }
        // Analyse-Report erstellen
        await this.createComplexityReport(complexityPath, metrics);
        // Refactoring-Plan erstellen
        await this.createRefactoringPlan(complexityPath, metrics);
        // Dependency-Map erstellen
        await this.createDependencyMap(complexityPath, metrics);
    }
    /**
     * Hilfsfunktionen
     */
    async getAllProjectFiles() {
        const files = [];
        const extensions = ['.ts', '.js', '.md', '.json', '.yml', '.yaml'];
        const scanDir = (dir) => {
            const items = fs.readdirSync(dir);
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory() && !this.shouldIgnoreDirectory(item)) {
                    scanDir(fullPath);
                }
                else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
                    files.push(fullPath);
                }
            }
        };
        scanDir(this.workspacePath);
        return files;
    }
    shouldIgnoreDirectory(name) {
        const ignoreList = ['.git', 'node_modules', '.vscode', 'out', 'dist', 'build', '.next'];
        return ignoreList.includes(name);
    }
    calculateFileComplexity(content, filePath) {
        // Vereinfachte Komplexitäts-Berechnung
        const indicators = [
            /class\s+/g, /function\s+/g, /interface\s+/g,
            /if\s*\(/g, /for\s*\(/g, /while\s*\(/g,
            /import\s+/g, /require\s*\(/g
        ];
        let complexity = 0;
        for (const pattern of indicators) {
            const matches = content.match(pattern);
            complexity += matches ? matches.length : 0;
        }
        // Datei-Größe berücksichtigen
        const sizeMultiplier = Math.min(content.length / 10000, 2);
        return Math.min((complexity * sizeMultiplier) / 50, 1); // Normalisiert auf 0-1
    }
    calculateSimilarity(content1, content2) {
        // Vereinfachte Ähnlichkeits-Berechnung (Jaccard-Index)
        const words1 = new Set(content1.toLowerCase().split(/\s+/));
        const words2 = new Set(content2.toLowerCase().split(/\s+/));
        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);
        return intersection.size / union.size;
    }
    extractDependencies(content) {
        const dependencies = [];
        // Import statements extrahieren
        const importRegex = /import.*?from\s+['"](.+?)['"]/g;
        const requireRegex = /require\s*\(\s*['"](.+?)['"]\s*\)/g;
        let match;
        while ((match = importRegex.exec(content)) !== null) {
            dependencies.push(match[1]);
        }
        while ((match = requireRegex.exec(content)) !== null) {
            dependencies.push(match[1]);
        }
        return dependencies.filter(dep => !dep.startsWith('.') && !dep.startsWith('/')); // Nur externe Dependencies
    }
    async createComplexityReport(complexityPath, metrics) {
        const reportPath = path.join(complexityPath, 'COMPLEXITY_ANALYSIS.md');
        const content = `# 🔍 Automatische Komplexitäts-Analyse

## 📊 Kritische Metriken

### Gesamt-Komplexität: ${(metrics.complexityScore * 100).toFixed(1)}%
${metrics.complexityScore > 0.9 ? '🚨 KRITISCH' : metrics.complexityScore > 0.7 ? '⚠️ HOCH' : '🟢 OK'}

### Token-Hotspots (>${this.thresholds.maxTokensPerFile} Tokens)
${metrics.tokenHotspots.map(h => `- 📄 ${h.file}: ${h.tokens} Tokens (${(h.complexity * 100).toFixed(1)}% Komplexität)`).join('\n')}

### Redundanzen (>${(this.thresholds.maxSimilarityThreshold * 100).toFixed(0)}% Ähnlichkeit)
${metrics.redundantContent.map(r => `- 🔄 ${r.file1} ↔ ${r.file2}: ${(r.similarity * 100).toFixed(1)}% ähnlich`).join('\n')}

### Duplikate
${metrics.duplicateFiles.map(f => `- 📋 ${f}`).join('\n')}

## 🎯 Empfehlungen
${metrics.recommendations.map(r => `- ${r}`).join('\n')}

---
*Automatisch generiert am ${new Date().toLocaleString('de-DE')}*
`;
        fs.writeFileSync(reportPath, content, 'utf8');
    }
    async createRefactoringPlan(complexityPath, metrics) {
        // Implementation für Refactoring-Plan
    }
    async createDependencyMap(complexityPath, metrics) {
        // Implementation für Dependency-Map
    }
    showComplexityReport(metrics) {
        const reportPath = path.join(this.workspacePath, '.github', 'complexity_management', 'COMPLEXITY_ANALYSIS.md');
        const uri = vscode.Uri.file(reportPath);
        vscode.window.showTextDocument(uri);
    }
}
exports.ComplexityManager = ComplexityManager;
//# sourceMappingURL=complexityManager.js.map