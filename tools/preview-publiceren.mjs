// Zet een nieuwe preview op GitHub Pages (branch gh-pages).
//   node tools/preview-publiceren.mjs
// Bouwt de site met 'niet indexeren', controleert het menu en pusht alleen de gebouwde bestanden.
// De echte website (asiankitchen.nl) wordt hier NIET door aangeraakt.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const URL = 'https://gwnquintenman.github.io/asian-kitchen-arena-website/';
const run = (cmd, args, cwd = ROOT) => execFileSync(cmd, args, { cwd, stdio: 'inherit' });
const lees = (cmd, args, cwd = ROOT) => execFileSync(cmd, args, { cwd, encoding: 'utf8' }).trim();

run(process.execPath, ['build.mjs', '--preview', '--out', '_preview', '--url', URL]);
run(process.execPath, ['tools/controleer-menu.mjs', '--map', '_preview']);

const remote = lees('git', ['remote', 'get-url', 'origin']);
const versie = lees('git', ['rev-parse', '--short', 'HEAD']);
const naam = lees('git', ['config', 'user.name']);
const mail = lees('git', ['config', 'user.email']);
const tmp = mkdtempSync(path.join(tmpdir(), 'ak-preview-'));
try {
  const map = path.join(ROOT, '_preview');
  writeFileSync(path.join(map, '.nojekyll'), '');
  run('git', ['init', '-q', '-b', 'gh-pages'], tmp);
  run('git', ['--work-tree', map, 'add', '-A'], tmp);
  run('git', ['-c', `user.name=${naam}`, '-c', `user.email=${mail}`, 'commit', '-q', '-m', `Preview van ${versie}`], tmp);
  run('git', ['push', '-q', '--force', remote, 'gh-pages'], tmp);
  console.log(`\nPreview bijgewerkt (${versie}). Over ongeveer een minuut zichtbaar op:\n${URL}`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
