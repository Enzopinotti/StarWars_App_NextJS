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
expect(fs.existsSync('eslint.config.mjs'), 'ESLint flat config must remain explicit');
expect(
  !fs.existsSync('.eslintrc.json'),
  'legacy .eslintrc.json must stay removed after the Next 16 ESLint migration',
);

expect(
  fs.existsSync('postcss.config.js'),
  'postcss.config.js must remain the maintained PostCSS authority',
);
expect(
  !fs.existsSync('postcss.config.mjs'),
  'duplicate postcss.config.mjs must stay removed after B2 authority selection',
);

const i18nSource = read('src/i18n/i18n.js');
expect(
  !i18nSource.includes('localhost:3000'),
  'maintained i18n source must not hardcode localhost:3000',
);
expect(
  !i18nSource.includes('i18next-http-backend'),
  'maintained i18n runtime must not depend on HTTP translation loading',
);

expect(
  fs.existsSync('src/lib/swapi.mjs'),
  'B3 requires one maintained SWAPI client boundary',
);

for (const pagePath of [
  'src/pages/characters/index.js',
  'src/pages/characters/[id].js',
  'src/pages/films/index.js',
  'src/pages/films/[id].js',
]) {
  const source = read(pagePath);
  expect(
    !source.includes('swapi.dev'),
    `${pagePath} must not hardcode the SWAPI origin`,
  );
  expect(
    !source.includes('fetch('),
    `${pagePath} must use the maintained SWAPI client instead of direct fetch`,
  );
}

expect(
  fs.existsSync('src/lib/character-query.mjs'),
  'B4 requires a server-side character pagination/filter model',
);

const charactersPage = read('src/pages/characters/index.js');
expect(
  !charactersPage.includes('useEffect'),
  'B4 characters route must not refill the browser by fetching all SWAPI pages',
);
expect(
  !charactersPage.includes('getPeoplePage'),
  'B4 characters route must use the bounded server-side catalog contract',
);

const filmDetail = read('src/pages/films/[id].js');
expect(
  filmDetail.includes('getCharactersByUrls'),
  'B4 film detail must use the bounded character fan-out helper',
);
expect(
  !filmDetail.includes('Promise.all('),
  'B4 film detail must not own an unbounded Promise.all character fan-out',
);


const b5Sources = {
  header: read('src/components/Layout/Header.js'),
  navbar: read('src/components/NavBar.js'),
  carousel: read('src/components/Carousel.js'),
  filterIcon: read('src/components/FilterIcon.js'),
  characterFilter: read('src/components/CharacterFilter.js'),
};

for (const [name, source] of Object.entries(b5Sources)) {
  if (['header', 'navbar', 'carousel'].includes(name)) {
    expect(
      !source.includes('useWindowSize') && !source.includes('window.innerWidth'),
      `B5 ${name} must not branch maintained markup on browser viewport reads`,
    );
  }
}

expect(
  !/<Link[^>]*>\s*<button/s.test(b5Sources.navbar),
  'B5 navigation links must not wrap buttons',
);
expect(
  b5Sources.filterIcon.includes('<button') &&
    b5Sources.filterIcon.includes('aria-controls="character-filters"'),
  'B5 filter toggle must be a labelled native button controlling the filter region',
);
expect(
  !/<li[^>]*onClick=/s.test(b5Sources.characterFilter),
  'B5 filter options must not use clickable list items',
);
expect(
  b5Sources.carousel.includes('aria-roledescription="carousel"') &&
    !b5Sources.carousel.includes('ButtonTransparent'),
  'B5 carousel must expose semantics and direct links without nested button controls',
);

if (failures.length) {
  console.error('B1 hygiene contract failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('B1 hygiene contract passed.');
console.log('B2 config/i18n hygiene contract passed.');
console.log('B3 SWAPI boundary hygiene contract passed.');
console.log('B4 route/data hygiene contract passed.');
console.log('B5 accessibility/responsive hygiene contract passed.');
