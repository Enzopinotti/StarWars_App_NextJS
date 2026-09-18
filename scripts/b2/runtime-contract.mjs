import { spawn } from 'node:child_process';
import fs from 'node:fs';

const PORT = 3210;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const serverLogPath = 'b2-server.log';
const serverLog = fs.createWriteStream(serverLogPath, { flags: 'w' });

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function fetchWithTimeout(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    return await fetch(`${ORIGIN}${path}`, {
      redirect: 'manual',
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetchWithTimeout('/');
      if (response.status < 500) return;
    } catch {
      // keep waiting for next start
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error('next start did not become ready on port 3210');
}

const server = spawn(
  process.platform === 'win32' ? 'npm.cmd' : 'npm',
  ['start', '--', '-p', String(PORT)],
  {
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  },
);
server.stdout.pipe(serverLog);
server.stderr.pipe(serverLog);

try {
  await waitForServer();

  const expected = [
    ['/', 200],
    ['/en', 200],
    ['/es', 200],
    ['/en/films', 200],
    ['/es/films', 200],
    ['/en/characters', 200],
    ['/es/characters', 200],
  ];

  for (const [path, status] of expected) {
    const response = await fetchWithTimeout(path);
    assert(
      response.status === status,
      `${path} expected HTTP ${status}, received ${response.status}`,
    );
  }

  const enHome = await (await fetchWithTimeout('/en')).text();
  const esHome = await (await fetchWithTimeout('/es')).text();

  assert(
    enHome.includes('EXPLORE') || enHome.includes('LEARN'),
    'English route did not render an English translation marker',
  );
  assert(
    esHome.includes('EXPLORA') || esHome.includes('APRENDE'),
    'Spanish route did not render a Spanish translation marker',
  );

  const headerResponse = await fetchWithTimeout('/en');
  assert(
    headerResponse.headers.get('x-frame-options') === 'DENY',
    'X-Frame-Options must remain DENY',
  );
  assert(
    headerResponse.headers.get('x-content-type-options') === 'nosniff',
    'X-Content-Type-Options must remain nosniff',
  );
  assert(
    headerResponse.headers.get('x-xss-protection') === null,
    'obsolete X-XSS-Protection header must stay removed',
  );

  const enLocale = await fetchWithTimeout('/locales/en/translation.json');
  const esLocale = await fetchWithTimeout('/locales/es/translation.json');
  assert(enLocale.status === 200, 'English locale JSON must remain available');
  assert(esLocale.status === 200, 'Spanish locale JSON must remain available');

  const unknownLocale = await fetchWithTimeout('/fr');
  assert(
    unknownLocale.status === 404,
    `unsupported locale route /fr must be a defined 404, received ${unknownLocale.status}`,
  );

  const nextFiles = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = `${dir}/${entry.name}`;
      if (entry.isDirectory()) walk(full);
      else nextFiles.push(full);
    }
  }
  walk('.next');

  const hardcoded = nextFiles.some((file) => {
    try {
      return fs.readFileSync(file).includes('http://localhost:3000//locales/');
    } catch {
      return false;
    }
  });
  assert(
    !hardcoded,
    'production output must not contain the historical localhost translation authority',
  );

  console.log('B2 runtime/i18n contract passed.');
  console.log('origin=' + ORIGIN);
  console.log('locales=en,es');
  console.log('unsupported-locale=/fr -> 404');
  console.log('security-headers=maintained');
} finally {
  server.kill('SIGTERM');
  await new Promise((resolve) => {
    const timer = setTimeout(resolve, 3000);
    server.once('exit', () => {
      clearTimeout(timer);
      resolve();
    });
  });
  serverLog.end();
}
