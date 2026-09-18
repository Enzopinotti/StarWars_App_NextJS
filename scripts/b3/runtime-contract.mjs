import http from 'node:http';
import { spawn } from 'node:child_process';

const MOCK_PORT = 4310;
const APP_PORT = 3211;
const MOCK_ORIGIN = `http://127.0.0.1:${MOCK_PORT}`;
const APP_ORIGIN = `http://127.0.0.1:${APP_PORT}`;

let mode = 'success';

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

const film = {
  title: 'A New Hope',
  episode_id: 4,
  director: 'George Lucas',
  characters: [character.url],
  url: `${MOCK_ORIGIN}/api/films/1/`,
};

function writeJson(res, status, payload) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(payload));
}

const mock = http.createServer(async (req, res) => {
  const url = new URL(req.url, MOCK_ORIGIN);

  if (mode === 'slow') {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  if (mode === 'upstream') {
    writeJson(res, 500, { detail: 'private mock upstream failure' });
    return;
  }

  if (mode === 'rate_limited') {
    writeJson(res, 429, { detail: 'rate limit' });
    return;
  }

  if (mode === 'malformed') {
    writeJson(res, 200, { unexpected: true });
    return;
  }

  if (
    mode === 'not_found' &&
    (/^\/api\/people\/\d+\/$/.test(url.pathname) ||
      /^\/api\/films\/\d+\/$/.test(url.pathname))
  ) {
    writeJson(res, 404, { detail: 'not found' });
    return;
  }

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
    writeJson(res, 200, { results: [film] });
    return;
  }

  if (/^\/api\/films\/\d+\/$/.test(url.pathname)) {
    writeJson(res, 200, film);
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

await listen(mock, MOCK_PORT);

const next = spawn(
  process.execPath,
  ['node_modules/next/dist/bin/next', 'start', '-p', String(APP_PORT)],
  {
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: '1',
      SWAPI_BASE_URL: `${MOCK_ORIGIN}/api/`,
      SWAPI_TIMEOUT_MS: '150',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  },
);

next.stdout.pipe(process.stdout);
next.stderr.pipe(process.stderr);

try {
  await waitForNext();

  mode = 'success';

  const characters = await request('/characters');
  assert(characters.status === 200, 'characters success route must return 200');
  assert(
    (await characters.text()).includes('Luke Skywalker'),
    'characters success route must render mock data',
  );

  const films = await request('/films');
  assert(films.status === 200, 'films success route must return 200');
  assert(
    (await films.text()).includes('A New Hope'),
    'films success route must render mock data',
  );

  const characterDetail = await request('/characters/1');
  assert(characterDetail.status === 200, 'character detail must return 200');
  assert(
    (await characterDetail.text()).includes('Luke Skywalker'),
    'character detail must render mock data',
  );

  const filmDetail = await request('/films/1');
  assert(filmDetail.status === 200, 'film detail must return 200');
  assert(
    (await filmDetail.text()).includes('Luke Skywalker'),
    'film detail must render character data',
  );

  mode = 'not_found';
  assert(
    (await request('/characters/999')).status === 404,
    'missing character must map to 404',
  );
  assert(
    (await request('/films/999')).status === 404,
    'missing film must map to 404',
  );

  mode = 'upstream';
  const upstreamCharacters = await request('/characters');
  assert(
    upstreamCharacters.status === 503,
    'people upstream 5xx must map to 503',
  );
  const upstreamBody = await upstreamCharacters.text();
  assert(
    upstreamBody.includes('Star Wars data is temporarily unavailable.'),
    'upstream failure must render the generic public error',
  );
  assert(
    !upstreamBody.includes('private mock upstream failure'),
    'upstream internals must not leak to rendered HTML',
  );

  mode = 'rate_limited';
  assert(
    (await request('/films')).status === 503,
    'rate limit must map to 503',
  );

  mode = 'malformed';
  assert(
    (await request('/characters')).status === 503,
    'malformed upstream payload must map to 503',
  );

  mode = 'slow';
  const started = Date.now();
  const slow = await request('/films');
  const elapsed = Date.now() - started;
  assert(slow.status === 503, 'upstream timeout must map to 503');
  assert(elapsed < 2000, `timeout contract took too long: ${elapsed}ms`);

  console.log('B3 production SWAPI route contract passed.');
  console.log('success-routes=4');
  console.log('not-found=404');
  console.log('upstream/rate-limit/malformed/timeout=503');
  console.log(`timeout-elapsed-ms=${elapsed}`);
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
