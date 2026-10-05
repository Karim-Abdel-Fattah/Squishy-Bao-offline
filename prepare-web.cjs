const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const output = path.join(root, 'www');
const files = ['index.html', 'app.js', 'auth.js', 'manifest.webmanifest', 'icon.svg', 'sw.js'];

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

for (const file of files) {
  fs.copyFileSync(path.join(root, file), path.join(output, file));
}