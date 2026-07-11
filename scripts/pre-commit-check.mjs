import fs from 'fs';
import { execSync } from 'child_process';

// Pegar arquivos cacheados no git para commit
const output = execSync('git diff --cached --name-only', { encoding: 'utf-8' });
const files = output.split('\n').filter(Boolean);

let hasError = false;

const BAD_WORDS = [
  { regex: /TODO\b/, message: 'TODO comments are not allowed before go-live.' },
  { regex: /FIXME\b/, message: 'FIXME comments are not allowed before go-live.' },
  { regex: /console\.log/, message: 'console.log is not allowed in production.' },
  { regex: /:\s*any\b/, message: 'Using explicit "any" type is not allowed.' },
];

files.forEach(file => {
  // Ignorar arquivos apagados, binários, ou fora de src/app/packages
  if (!fs.existsSync(file)) return;
  if (!file.match(/\.(ts|tsx|js|jsx)$/)) return;
  // Ignore este próprio script e pastas de build/node_modules
  if (file.includes('scripts/') || file.includes('node_modules')) return;

  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Ignorar linhas de comentário com eslint-disable
    if (line.includes('eslint-disable-next-line')) return;

    BAD_WORDS.forEach(rule => {
      if (rule.regex.test(line)) {
        console.error(`\x1b[31m[ERROR]\x1b[0m ${file}:${index + 1} -> ${rule.message}`);
        hasError = true;
      }
    });
  });
});

if (hasError) {
  console.error('\n\x1b[31m========================================================\x1b[0m');
  console.error('\x1b[31m 🚨 PROIBIDO MERGE NA MASTER COM CÓDIGO TEMPORÁRIO! 🚨\x1b[0m');
  console.error('\x1b[31m========================================================\x1b[0m');
  console.error('Por favor, resolva os problemas apontados acima antes de fazer o commit.');
  process.exit(1);
}
