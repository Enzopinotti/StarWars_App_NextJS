import fs from 'node:fs';

const failures = [];
const read = (path) => fs.readFileSync(path, 'utf8');
const expect = (condition, message) => {
  if (!condition) failures.push(message);
};

const pkg = JSON.parse(read('package.json'));
const lock = JSON.parse(read('package-lock.json'));
const root = lock.packages?.[''] ?? {};

const expectedRuntime = {
  i18next: '26.4.2',
  next: '16.3.5',
  react: '19.3.0',
  'react-dom': '19.3.0',
  'react-i18next': '17.0.14',
};

for (const [name, version] of Object.entries(expectedRuntime)) {
  expect(
    pkg.dependencies?.[name] === version,
    `B6 runtime dependency ${name} must stay pinned to ${version}`,
  );
  expect(
    lock.packages?.[`node_modules/${name}`]?.version === version,
    `B6 lockfile must resolve ${name}@${version}`,
  );
}

for (const removed of [
  'i18next-browser-languagedetector',
  'i18next-http-backend',
]) {
  expect(
    !pkg.dependencies?.[removed] && !pkg.devDependencies?.[removed],
    `B6 removed dependency must stay absent: ${removed}`,
  );
}

expect(
  pkg.devDependencies?.eslint === '9.39.5',
  'B6 ESLint must stay on the verified 9.39.5 peer-compatible line',
);
expect(
  pkg.devDependencies?.['eslint-config-next'] === '16.3.5',
  'B6 eslint-config-next must stay aligned with Next 16.3.5',
);
expect(
  !pkg.dependencies?.['tailwind-scrollbar'] &&
    pkg.devDependencies?.['tailwind-scrollbar'] === '^3.1.0',
  'B6 tailwind-scrollbar must remain build-only tooling',
);
expect(
  lock.packages?.['node_modules/tailwind-scrollbar']?.dev === true,
  'B6 lockfile must classify tailwind-scrollbar as dev-only',
);

expect(
  pkg.overrides?.['minimatch@3.1.5']?.['brace-expansion'] === '1.1.18',
  'B6 security override must stay scoped to minimatch@3.1.5',
);
expect(
  lock.packages?.['node_modules/brace-expansion']?.version === '1.1.18' &&
    lock.packages?.['node_modules/brace-expansion']?.dev === true,
  'B6 lockfile must resolve the scoped brace-expansion fix as dev-only',
);

expect(
  JSON.stringify(root.dependencies ?? {}) ===
    JSON.stringify(pkg.dependencies ?? {}),
  'B6 package-lock root runtime dependencies must match package.json',
);
expect(
  JSON.stringify(root.devDependencies ?? {}) ===
    JSON.stringify(pkg.devDependencies ?? {}),
  'B6 package-lock root devDependencies must match package.json',
);

expect(fs.existsSync('eslint.config.mjs'), 'B6 requires ESLint flat config');
expect(
  !fs.existsSync('.eslintrc.json'),
  'B6 legacy .eslintrc.json must stay removed',
);
expect(
  !read('next.config.mjs').includes('swcMinify'),
  'B6 Next 16 config must not retain removed swcMinify authority',
);

if (failures.length) {
  console.error('B6 dependency/framework contract failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('B6 dependency/framework contract passed.');
console.log('runtime=next@16.3.5 react@19.3.0');
console.log('i18n=i18next@26.4.2 react-i18next@17.0.14');
console.log('eslint=9.39.5 flat-config');
console.log('tailwind-scrollbar=dev-only');
console.log('brace-expansion=1.1.18 scoped-to-minimatch@3.1.5');
