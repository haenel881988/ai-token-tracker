"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
/**
 * Logger - Zentrale Logging-Funktionalität
 *
 * Diese Klasse bietet strukturiertes Logging für die gesamte Extension
 * und hilft beim Debugging und bei der Fehlersuche.
 */
class Logger {
    constructor(context) {
        this.context = context;
    }
    /**
     * Loggt eine Info-Nachricht
     */
    info(message, ...args) {
        this.log('INFO', message, ...args);
    }
    /**
     * Loggt eine Warn-Nachricht
     */
    warn(message, ...args) {
        this.log('WARN', message, ...args);
    }
    /**
     * Loggt eine Error-Nachricht
     */
    error(message, error, ...args) {
        const errorMessage = error ? `${message}: ${error.message}` : message;
        this.log('ERROR', errorMessage, ...args);
        if (error && error.stack) {
            this.log('ERROR', error.stack);
        }
    }
    /**
     * Loggt eine Debug-Nachricht
     */
    debug(message, ...args) {
        this.log('DEBUG', message, ...args);
    }
    /**
     * Zentrale Log-Methode
     */
    log(level, message, ...args) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level}] [${this.context}] ${message}`;
        // In VS Code Extension wird console.log in die Output-Console geschrieben
        switch (level) {
            case 'ERROR':
                if (typeof console !== 'undefined' && console.error) {
                    console.error(logMessage, ...args);
                }
                break;
            case 'WARN':
                if (typeof console !== 'undefined' && console.warn) {
                    console.warn(logMessage, ...args);
                }
                break;
            case 'DEBUG':
                if (typeof console !== 'undefined' && console.debug) {
                    console.debug(logMessage, ...args);
                }
                break;
            default:
                if (typeof console !== 'undefined' && console.log) {
                    console.log(logMessage, ...args);
                }
        }
    }
    /**
     * Erstellt einen Child-Logger mit erweiterten Kontext
     */
    child(childContext) {
        return new Logger(`${this.context}:${childContext}`);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map