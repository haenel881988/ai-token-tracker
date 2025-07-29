import * as vscode from 'vscode';
import * as fs from 'fs/promises';

export class ProjectInventoryManager {
    async runInventory(): Promise<void> {
        const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (!workspacePath) return;
        const files = await vscode.workspace.findFiles('**/*.{ts,js,md,json}', '**/node_modules/**');
        const inventory: string[] = [];
        for (const file of files) {
            const stat = await vscode.workspace.fs.stat(file);
            inventory.push(`${file.fsPath} (${stat.size} bytes)`);
        }
        const report = [
            '# 📦 Projekt-Inventarisierung',
            `Datum: ${new Date().toLocaleString('de-DE')}`,
            '---',
            ...inventory
        ].join('\n');
        const outPath = workspacePath + '/.github/complexity_management/PROJECT_INVENTORY.md';
        await fs.writeFile(outPath, report, 'utf8');
    }
}

export async function ensureInstructionsRule(): Promise<void> {
    const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspacePath) return;
    const instructionsPath = workspacePath + '/.github/copilot-instructions.md';
    try {
        let content = '';
        try {
            content = (await fs.readFile(instructionsPath, 'utf8')) as string;
        } catch {
            content = '';
        }
        if (!content.includes('KI MUSS vor jeder Aktion den AI Token Tracker ausführen!')) {
            content += '\n\nKI MUSS vor jeder Aktion den AI Token Tracker ausführen!';
            await fs.writeFile(instructionsPath, content, 'utf8');
        }
    } catch (err) {
        // Fehler ignorieren
    }
}
