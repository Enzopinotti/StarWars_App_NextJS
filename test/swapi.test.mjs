import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getFilms,
  getPeoplePage,
  requestSwapiJson,
  SwapiError,
  SWAPI_ERROR_CODES,
} from '../src/lib/swapi.mjs';

const BASE_URL = 'https://example.test/api/';

function response(status, payload, { jsonError = null } = {}) {
  return {
    status,
    ok: status >= 200 && status < 300,
    async json() {
      if (jsonError) throw jsonError;
      return payload;
    },
  };
}

function expectCode(code) {
  return (error) => {
    assert.ok(error instanceof SwapiError);
    assert.equal(error.code, code);
    return true;
  };
}

test('successful people page returns validated data', async () => {
  let requestedUrl = null;
  const payload = {
    count: 1,
    next: null,
    previous: null,
    results: [{ name: 'Luke Skywalker' }],
  };

  const result = await getPeoplePage(1, {
    baseUrl: BASE_URL,
    fetchImpl: async (url) => {
      requestedUrl = url;
      return response(200, payload);
    },
  });

  assert.equal(requestedUrl, 'https://example.test/api/people/?page=1');
  assert.equal(result.count, 1);
  assert.equal(result.results[0].name, 'Luke Skywalker');
});

test('404 is classified as not_found', async () => {
  await assert.rejects(
    requestSwapiJson('people/404/', {
      baseUrl: BASE_URL,
      fetchImpl: async () => response(404, {}),
    }),
    expectCode(SWAPI_ERROR_CODES.NOT_FOUND),
  );
});

test('429 is classified as rate_limited', async () => {
  await assert.rejects(
    requestSwapiJson('films/', {
      baseUrl: BASE_URL,
      fetchImpl: async () => response(429, {}),
    }),
    expectCode(SWAPI_ERROR_CODES.RATE_LIMITED),
  );
});

test('5xx is classified as upstream', async () => {
  await assert.rejects(
    requestSwapiJson('films/', {
      baseUrl: BASE_URL,
      fetchImpl: async () => response(503, {}),
    }),
    expectCode(SWAPI_ERROR_CODES.UPSTREAM),
  );
});

test('network failure is classified without leaking transport details', async () => {
  await assert.rejects(
    requestSwapiJson('films/', {
      baseUrl: BASE_URL,
      fetchImpl: async () => {
        throw new TypeError('socket exploded with private details');
      },
    }),
    (error) => {
      assert.equal(error.code, SWAPI_ERROR_CODES.NETWORK);
      assert.equal(error.message, 'Star Wars data source is unavailable.');
      assert.ok(!error.message.includes('socket'));
      return true;
    },
  );
});

test('timeout abort is classified as timeout', async () => {
  const hangingFetch = async (_url, { signal }) =>
    new Promise((_resolve, reject) => {
      const abort = () => {
        const error = new Error('aborted');
        error.name = 'AbortError';
        reject(error);
      };

      if (signal.aborted) {
        abort();
        return;
      }

      signal.addEventListener('abort', abort, { once: true });
    });

  await assert.rejects(
    requestSwapiJson('films/', {
      baseUrl: BASE_URL,
      fetchImpl: hangingFetch,
      timeoutMs: 10,
    }),
    expectCode(SWAPI_ERROR_CODES.TIMEOUT),
  );
});

test('invalid JSON is classified as malformed', async () => {
  await assert.rejects(
    requestSwapiJson('films/', {
      baseUrl: BASE_URL,
      fetchImpl: async () =>
        response(200, null, { jsonError: new SyntaxError('bad json') }),
    }),
    expectCode(SWAPI_ERROR_CODES.MALFORMED),
  );
});

test('invalid domain payload is classified as malformed', async () => {
  await assert.rejects(
    getFilms({
      baseUrl: BASE_URL,
      fetchImpl: async () => response(200, { unexpected: true }),
    }),
    expectCode(SWAPI_ERROR_CODES.MALFORMED),
  );
});

test('absolute resource URLs cannot escape the configured SWAPI origin', async () => {
  await assert.rejects(
    requestSwapiJson('https://attacker.example/people/1/', {
      baseUrl: BASE_URL,
      fetchImpl: async () => response(200, {}),
    }),
    expectCode(SWAPI_ERROR_CODES.MALFORMED),
  );
});
