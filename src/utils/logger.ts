/**
 * Logger - Zentrale Logging-Funktionalität
 * 
 * Diese Klasse bietet strukturiertes Logging für die gesamte Extension
 * und hilft beim Debugging und bei der Fehlersuche.
 */
export class Logger {
    private context: string;

    constructor(context: string) {
        this.context = context;
    }

    /**
     * Loggt eine Info-Nachricht
     */
    info(message: string, ...args: any[]): void {
        this.log('INFO', message, ...args);
    }

    /**
     * Loggt eine Warn-Nachricht
     */
    warn(message: string, ...args: any[]): void {
        this.log('WARN', message, ...args);
    }

    /**
     * Loggt eine Error-Nachricht
     */
    error(message: string, error?: Error, ...args: any[]): void {
        const errorMessage = error ? `${message}: ${error.message}` : message;
        this.log('ERROR', errorMessage, ...args);
        
        if (error && error.stack) {
            this.log('ERROR', error.stack);
        }
    }

    /**
     * Loggt eine Debug-Nachricht
     */
    debug(message: string, ...args: any[]): void {
        this.log('DEBUG', message, ...args);
    }

    /**
     * Zentrale Log-Methode
     */
    private log(level: string, message: string, ...args: any[]): void {
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
    child(childContext: string): Logger {
        return new Logger(`${this.context}:${childContext}`);
    }
}
