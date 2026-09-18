import { spawnSync } from 'node:child_process';

const MAX_DIFFERENT_FILES = 35;

const args = [
  '--no-install',
  'prettier',
  '--list-different',
  'src/**/*.{js,jsx,json,css}',
  '*.js',
  '*.mjs',
  '*.json',
];

const result = spawnSync(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  args,
  { encoding: 'utf8' },
);

if (![0, 1].includes(result.status ?? 1)) {
  console.error(result.stdout);
  console.error(result.stderr);
  console.error('Prettier debt probe failed unexpectedly.');
  process.exit(1);
}

const files = (result.stdout || '')
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean);

console.log(`Prettier baseline: different_files=${files.length}`);
console.log(`Allowed B1 ceiling: different_files<=${MAX_DIFFERENT_FILES}`);

if (files.length > MAX_DIFFERENT_FILES) {
  console.error('Formatting debt regressed above the B1 baseline.');
  for (const file of files) console.error(`- ${file}`);
  process.exit(1);
}
