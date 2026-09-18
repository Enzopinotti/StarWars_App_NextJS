import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const failures = [];
const read = (path) => fs.readFileSync(path, 'utf8');

function expect(condition, message) {
  if (!condition) failures.push(message);
}

const pkg = JSON.parse(read('package.json'));

expect(pkg.private === true, 'package.json must remain private=true');
expect(
  pkg.packageManager === 'npm@11.19.0',
  'packageManager must pin npm@11.19.0',
);
expect(
  pkg.engines?.node === '>=24.20.0 <25',
  'Node engine must stay on verified Node 24',
);
expect(
  pkg.engines?.npm === '>=11.19.0 <12',
  'npm engine must stay on verified npm 11',
);
expect(read('.nvmrc').trim() === 'v24.20.0', '.nvmrc must pin v24.20.0');
expect(
  read('.npmrc').split(/\r?\n/).includes('engine-strict=true'),
  '.npmrc must enforce engine-strict=true',
);

for (const [scriptName, forbidden] of [
  ['lint', '--fix'],
  ['format:check', '--write'],
  ['quality', '--fix'],
  ['quality', '--write'],
]) {
  const script = pkg.scripts?.[scriptName] ?? '';
  expect(
    !script.includes(forbidden),
    `${scriptName} must remain read-only and cannot contain ${forbidden}`,
  );
}

const tracked = execFileSync('git', ['ls-files'], {
  encoding: 'utf8',
})
  .split(/\r?\n/)
  .filter(Boolean);

for (const forbiddenPrefix of ['.next/', 'node_modules/', 'out/', 'coverage/']) {
  expect(
    !tracked.some((path) => path.startsWith(forbiddenPrefix)),
    `tracked generated path found: ${forbiddenPrefix}`,
  );
}

expect(fs.existsSync('package-lock.json'), 'npm package-lock.json must remain present');
expect(fs.existsSync('.eslintrc.json'), 'ESLint config must remain explicit');

const postcssConfigs = ['postcss.config.js', 'postcss.config.mjs'].filter((p) =>
  fs.existsSync(p),
);
expect(
  postcssConfigs.length === 2,
  'B1 expects the two historical PostCSS configs to remain visible until B2 selects authority',
);

if (failures.length) {
  console.error('B1 hygiene contract failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('B1 hygiene contract passed.');
console.log('Known B2 config debt: postcss.config.js + postcss.config.mjs both present.');
