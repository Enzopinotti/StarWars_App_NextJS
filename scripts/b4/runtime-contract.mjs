import http from 'node:http';
import { spawn } from 'node:child_process';

const MOCK_PORT = 4311;
const APP_PORT = 3212;
const MOCK_ORIGIN = `http://127.0.0.1:${MOCK_PORT}`;
const APP_ORIGIN = `http://127.0.0.1:${APP_PORT}`;

let peoplePageRequests = 0;
let detailActive = 0;
let maxDetailActive = 0;
let detailRequests = 0;

function character(id) {
  return {
    name: `Character ${String(id).padStart(2, '0')}`,
    height: '172',
    mass: '77',
    hair_color: 'brown',
    skin_color: 'fair',
    eye_color: [12, 23].includes(id) ? 'blue' : 'brown',
    birth_year: '19BBY',
    gender: id % 2 === 0 ? 'female' : 'male',
    url: `${MOCK_ORIGIN}/api/people/${id}/`,
  };
}

const film = {
  title: 'A New Hope',
  episode_id: 4,
  director: 'George Lucas',
  characters: Array.from(
    { length: 8 },
    (_, index) => `${MOCK_ORIGIN}/api/people/${index + 1}/`,
  ),
  url: `${MOCK_ORIGIN}/api/films/1/`,
};

function writeJson(res, status, payload) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(payload));
}

const mock = http.createServer(async (req, res) => {
  const url = new URL(req.url, MOCK_ORIGIN);

  if (url.pathname === '/api/people/') {
    peoplePageRequests += 1;
    const page = Number(url.searchParams.get('page') || '1');
    const start = (page - 1) * 10 + 1;
    const remaining = Math.max(0, 25 - start + 1);
    const size = Math.min(10, remaining);

    writeJson(res, 200, {
      count: 25,
      next: page < 3 ? `${MOCK_ORIGIN}/api/people/?page=${page + 1}` : null,
      previous:
        page > 1 ? `${MOCK_ORIGIN}/api/people/?page=${page - 1}` : null,
      results: Array.from({ length: size }, (_, index) =>
        character(start + index),
      ),
    });
    return;
  }

  const personMatch = url.pathname.match(/^\/api\/people\/(\d+)\/$/);
  if (personMatch) {
    detailRequests += 1;
    detailActive += 1;
    maxDetailActive = Math.max(maxDetailActive, detailActive);
    await new Promise((resolve) => setTimeout(resolve, 40));
    detailActive -= 1;
    writeJson(res, 200, character(Number(personMatch[1])));
    return;
  }

  if (url.pathname === '/api/films/1/') {
    writeJson(res, 200, film);
    return;
  }

  if (url.pathname === '/api/films/') {
    writeJson(res, 200, { results: [film] });
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
      SWAPI_TIMEOUT_MS: '1000',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  },
);

next.stdout.pipe(process.stdout);
next.stderr.pipe(process.stderr);

try {
  await waitForNext();

  peoplePageRequests = 0;
  const firstPage = await request('/characters');
  const firstPageBody = await firstPage.text();
  assert(firstPage.status === 200, 'characters page 1 must return 200');
  assert(firstPageBody.includes('Character 01'), 'page 1 must render first character');
  assert(firstPageBody.includes('Character 10'), 'page 1 must render tenth character');
  assert(!firstPageBody.includes('Character 11'), 'page 1 must not serialize page 2 characters');
  assert(
    peoplePageRequests === 3,
    `character catalog should request 3 upstream pages, got ${peoplePageRequests}`,
  );

  peoplePageRequests = 0;
  const secondPage = await request('/characters?page=2');
  const secondPageBody = await secondPage.text();
  assert(secondPage.status === 200, 'characters page 2 must return 200');
  assert(secondPageBody.includes('Character 11'), 'page 2 must render its first character');
  assert(!secondPageBody.includes('Character 01'), 'page 2 must not serialize page 1 characters');
  assert(
    peoplePageRequests === 3,
    `page 2 should request the bounded 3-page catalog, got ${peoplePageRequests}`,
  );

  const filtered = await request('/characters?eyeColor=blue');
  const filteredBody = await filtered.text();
  assert(filtered.status === 200, 'filtered characters route must return 200');
  assert(filteredBody.includes('Character 12'), 'global filter must include page 2 match');
  assert(filteredBody.includes('Character 23'), 'global filter must include page 3 match');
  assert(!filteredBody.includes('Character 11'), 'global filter must exclude non-matches');

  const clamped = await request('/characters?page=99');
  const clampedBody = await clamped.text();
  assert(clamped.status === 200, 'oversized characters page must return 200');
  assert(clampedBody.includes('Character 21'), 'oversized page must clamp to final page');
  assert(!clampedBody.includes('Character 11'), 'clamped final page must not render page 2 data');

  const characterDetail = await request('/characters/1');
  const characterDetailBody = await characterDetail.text();
  assert(characterDetail.status === 200, 'character detail must return 200');
  assert(
    characterDetailBody.includes('<title>Character 01 | Star Wars</title>'),
    'character detail must render a valid document title',
  );

  detailRequests = 0;
  detailActive = 0;
  maxDetailActive = 0;
  const filmDetail = await request('/films/1');
  const filmDetailBody = await filmDetail.text();
  assert(filmDetail.status === 200, 'film detail must return 200');
  for (let id = 1; id <= 8; id += 1) {
    assert(
      filmDetailBody.includes(`Character ${String(id).padStart(2, '0')}`),
      `film detail must render character ${id}`,
    );
  }
  assert(detailRequests === 8, `film detail should request 8 unique characters, got ${detailRequests}`);
  assert(
    maxDetailActive <= 4,
    `film character fan-out exceeded concurrency 4: ${maxDetailActive}`,
  );
  assert(
    maxDetailActive > 1,
    `film character fan-out should retain useful concurrency: ${maxDetailActive}`,
  );

  console.log('B4 route/data runtime contract passed.');
  console.log('character-browser-page-size=10');
  console.log('character-upstream-pages-per-request=3');
  console.log('global-filter=preserved-server-side');
  console.log(`film-character-max-concurrency=${maxDetailActive}`);
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
