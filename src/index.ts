import * as fs from 'fs';
import * as readline from 'readline';
import { CommandHandler } from './CommandHandler';

// ─── Entry Point ─────────────────────────────────────────────────────

const handler = new CommandHandler();

/**
 * Process a single line and print the output (if any).
 */
function processLine(line: string): void {
  const output = handler.execute(line);
  if (output !== null) {
    console.log(output);
  }
}

const inputFile = process.argv[2];

if (inputFile) {
  // ─── File mode ───────────────────────────────────────────────────
  const contents = fs.readFileSync(inputFile, 'utf8');
  const lines = contents.split('\n');
  for (const line of lines) {
    processLine(line);
  }
} else {
  // ─── Interactive shell ───────────────────────────────────────────
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rl.on('line', (line: string) => {
    if (line.trim() === 'exit') {
      rl.close();
      return;
    }
    processLine(line);
  });
}
