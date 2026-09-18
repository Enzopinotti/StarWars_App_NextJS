import http from 'node:http';
import { spawn } from 'node:child_process';

const MOCK_PORT = 4312;
const APP_PORT = 3213;
const MOCK_ORIGIN = `http://127.0.0.1:${MOCK_PORT}`;
const APP_ORIGIN = `http://127.0.0.1:${APP_PORT}`;

const character = {
  name: 'Luke Skywalker',
  height: '172',
  mass: '77',
  hair_color: 'blond',
  skin_color: 'fair',
  eye_color: 'blue',
  birth_year: '19BBY',
  gender: 'male',
  url: `${MOCK_ORIGIN}/api/people/1/`,
};

function writeJson(res, status, payload) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(payload));
}

const mock = http.createServer((req, res) => {
  const url = new URL(req.url, MOCK_ORIGIN);

  if (url.pathname === '/api/people/' && url.searchParams.get('page') === '1') {
    writeJson(res, 200, {
      count: 1,
      next: null,
      previous: null,
      results: [character],
    });
    return;
  }

  if (/^\/api\/people\/\d+\/$/.test(url.pathname)) {
    writeJson(res, 200, character);
    return;
  }

  if (url.pathname === '/api/films/') {
    writeJson(res, 200, { results: [] });
    return;
  }

  writeJson(res, 404, { detail: 'mock route not found' });
});

function listen(server, port) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolve);
  });
}

function close(server) {
  return new Promise((resolve) => server.close(resolve));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function request(path) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    return await fetch(`${APP_ORIGIN}${path}`, {
      redirect: 'manual',
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

async function waitForNext() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await request('/');
      if (response.status === 200) return;
    } catch {
      // keep waiting
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error('Next production server did not become ready');
}

function assertNoNestedInteractive(html, label) {
  assert(
    !/<a\b[^>]*>\s*<button\b/is.test(html),
    `${label} must not render a button directly inside a link`,
  );
}

await listen(mock, MOCK_PORT);

const next = spawn(
  process.execPath,
  ['node_modules/next/dist/bin/next', 'start', '-p', String(APP_PORT)],
  {
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: '1',
      SWAPI_BASE_URL: `${MOCK_ORIGIN}/api/`,
      SWAPI_TIMEOUT_MS: '1000',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  },
);

next.stdout.pipe(process.stdout);
next.stderr.pipe(process.stderr);

try {
  await waitForNext();

  const home = await request('/');
  const homeBody = await home.text();
  assert(home.status === 200, 'home must return 200');
  assert(homeBody.includes('aria-roledescription="carousel"'), 'home must expose carousel semantics');
  assert(homeBody.includes('aria-label="Primary navigation"'), 'home must expose primary navigation');
  assert(homeBody.includes('aria-controls="mobile-navigation"'), 'menu must control the mobile navigation region');
  assert(homeBody.includes('hidden lg:flex'), 'desktop navigation must be CSS breakpoint controlled');
  assert(homeBody.includes('lg:hidden'), 'mobile controls must be CSS breakpoint controlled');
  assertNoNestedInteractive(homeBody, 'home');

  const spanish = await request('/es');
  const spanishBody = await spanish.text();
  assert(spanish.status === 200, 'Spanish home must return 200');
  assert(
    spanishBody.includes('aria-label="Navegación principal"'),
    'Spanish navigation accessible name must be localized',
  );
  assert(
    spanishBody.includes('aria-label="Diapositiva anterior"'),
    'Spanish carousel control accessible name must be localized',
  );

  const characters = await request('/characters');
  const charactersBody = await characters.text();
  assert(characters.status === 200, 'characters must return 200');
  assert(
    charactersBody.includes('aria-controls="character-filters"'),
    'filter toggle must reference the filter region',
  );
  assert(
    charactersBody.includes('id="character-filters"'),
    'filter region must exist even when collapsed',
  );
  assert(
    charactersBody.includes('aria-label="Character pagination"'),
    'pagination must expose an accessible name',
  );
  assert(
    charactersBody.includes('aria-current="page"'),
    'current pagination page must be exposed',
  );
  assertNoNestedInteractive(charactersBody, 'characters');

  console.log('B5 accessibility/responsive runtime contract passed.');
  console.log('responsive-authority=css-breakpoints');
  console.log('locales=EN/ES-accessible-names');
  console.log('interactive-nesting=clean');
} finally {
  next.kill('SIGTERM');
  await new Promise((resolve) => {
    const timer = setTimeout(resolve, 3000);
    next.once('exit', () => {
      clearTimeout(timer);
      resolve();
    });
  });
  await close(mock);
}
