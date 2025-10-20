// Simple secret scanner to block commits containing obvious secrets in staged files
// Matches common credential patterns; extend as needed

const fs = require('fs');
const path = require('path');

// Patterns: add more as needed
const PATTERNS = [
  /(BEGIN PRIVATE KEY|END PRIVATE KEY)/i,
  /AKIA[0-9A-Z]{16}/, // AWS access key id
  /secret[_-]?key\s*[:=]\s*['\"][A-Za-z0-9\/_+=-]{16,}['\"]/i,
  /api[_-]?key\s*[:=]\s*['\"][A-Za-z0-9\/_+=-]{16,}['\"]/i,
  /firebase.*service.*account/i,
  /google.*service.*account/i,
  /"private_key"\s*:\s*"-----BEGIN/,
];

function readStdin() {
  return new Promise(resolve => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => (data += chunk));
    process.stdin.on('end', () => resolve(data.trim()));
  });
}

(async () => {
  try {
    const args = process.argv.slice(2);
    let files = args;

    // If no args, try reading from lint-staged via stdin list
    if (files.length === 0 && !process.stdin.isTTY) {
      const input = await readStdin();
      if (input) files = input.split(/\r?\n/).filter(Boolean);
    }

    if (files.length === 0) process.exit(0);

    const offenders = [];
    for (const file of files) {
      if (!fs.existsSync(file)) continue;
      const stat = fs.statSync(file);
      if (!stat.isFile()) continue;
      const sizeMb = stat.size / (1024 * 1024);
      if (sizeMb > 50) {
        offenders.push({ file, reason: `File too large (${sizeMb.toFixed(1)} MB)` });
        continue;
      }
      const text = fs.readFileSync(file, 'utf8');
      for (const pattern of PATTERNS) {
        if (pattern.test(text)) {
          offenders.push({ file, reason: `Secret pattern detected: ${pattern}` });
          break;
        }
      }
    }

    if (offenders.length > 0) {
      console.error('\nSecret scan failed. The following files are blocked:');
      for (const o of offenders) {
        console.error(` - ${o.file}: ${o.reason}`);
      }
      console.error('\nRemove secrets or large files from the commit.');
      process.exit(1);
    }

    process.exit(0);
  } catch (err) {
    console.error('Secret scan error:', err);
    process.exit(1);
  }
})();
