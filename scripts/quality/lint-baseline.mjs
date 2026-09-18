import { spawnSync } from 'node:child_process';

const MAX_ERRORS = 0;
const MAX_WARNINGS = 15;

const result = spawnSync(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['--no-install', 'eslint', 'src/**/*.{js,jsx}', '--format', 'json'],
  { encoding: 'utf8' },
);

let reports;
try {
  reports = JSON.parse(result.stdout || '[]');
} catch {
  console.error(result.stdout);
  console.error(result.stderr);
  console.error('Unable to parse ESLint JSON output.');
  process.exit(1);
}

const errors = reports.reduce((sum, report) => sum + report.errorCount, 0);
const warnings = reports.reduce((sum, report) => sum + report.warningCount, 0);

console.log(`ESLint baseline: errors=${errors}, warnings=${warnings}`);
console.log(`Allowed B1 ceiling: errors<=${MAX_ERRORS}, warnings<=${MAX_WARNINGS}`);

if (errors > MAX_ERRORS || warnings > MAX_WARNINGS) {
  console.error('ESLint debt regressed above the B1 baseline.');
  process.exit(1);
}
