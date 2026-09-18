export const SWAPI_ERROR_CODES = Object.freeze({
  NOT_FOUND: 'not_found',
  RATE_LIMITED: 'rate_limited',
  UPSTREAM: 'upstream',
  NETWORK: 'network',
  TIMEOUT: 'timeout',
  MALFORMED: 'malformed',
});

export class SwapiError extends Error {
  constructor(code, message, { status = null, cause = null } = {}) {
    super(message);
    this.name = 'SwapiError';
    this.code = code;
    this.status = status;
    if (cause) this.cause = cause;
  }
}

export function isSwapiError(error) {
  return error instanceof SwapiError;
}

const DEFAULT_BASE_URL = 'https://swapi.dev/api/';
const DEFAULT_TIMEOUT_MS = 5000;
const DEFAULT_PEOPLE_CONCURRENCY = 3;
const DEFAULT_CHARACTER_CONCURRENCY = 4;
const MAX_PEOPLE_PAGES = 20;

function readBaseUrl() {
  if (typeof window === 'undefined' && process.env.SWAPI_BASE_URL) {
    return process.env.SWAPI_BASE_URL;
  }

  return process.env.NEXT_PUBLIC_SWAPI_BASE_URL || DEFAULT_BASE_URL;
}

function readTimeoutMs() {
  const raw =
    typeof window === 'undefined' && process.env.SWAPI_TIMEOUT_MS
      ? process.env.SWAPI_TIMEOUT_MS
      : process.env.NEXT_PUBLIC_SWAPI_TIMEOUT_MS;
  const parsed = Number(raw);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TIMEOUT_MS;
}

function malformed(message, cause = null) {
  return new SwapiError(SWAPI_ERROR_CODES.MALFORMED, message, { cause });
}

function resolveSwapiUrl(resource, baseUrl) {
  let base;
  let url;

  try {
    base = new URL(baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);
    url = new URL(resource, base);
  } catch (error) {
    throw malformed('Star Wars data source configuration is invalid.', error);
  }

  if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) {
    throw malformed('Star Wars data source returned an unexpected resource URL.');
  }

  return url.toString();
}

function normalizeConcurrency(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, 10) : fallback;
}

async function mapWithConcurrency(items, mapper, concurrency) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index], index);
    }
  }

  const workerCount = Math.min(concurrency, items.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}

export async function requestSwapiJson(
  resource,
  {
    fetchImpl = globalThis.fetch,
    baseUrl = readBaseUrl(),
    timeoutMs = readTimeoutMs(),
  } = {},
) {
  if (typeof fetchImpl !== 'function') {
    throw new SwapiError(
      SWAPI_ERROR_CODES.NETWORK,
      'Star Wars data source is unavailable.',
    );
  }

  const url = resolveSwapiUrl(resource, baseUrl);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    response = await fetchImpl(url, {
      signal: controller.signal,
      headers: {
        accept: 'application/json',
      },
    });
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new SwapiError(
        SWAPI_ERROR_CODES.TIMEOUT,
        'Star Wars data source timed out.',
        { cause: error },
      );
    }

    throw new SwapiError(
      SWAPI_ERROR_CODES.NETWORK,
      'Star Wars data source is unavailable.',
      { cause: error },
    );
  } finally {
    clearTimeout(timer);
  }

  if (response.status === 404) {
    throw new SwapiError(
      SWAPI_ERROR_CODES.NOT_FOUND,
      'Star Wars resource was not found.',
      { status: 404 },
    );
  }

  if (response.status === 429) {
    throw new SwapiError(
      SWAPI_ERROR_CODES.RATE_LIMITED,
      'Star Wars data source rate limit was reached.',
      { status: 429 },
    );
  }

  if (!response.ok) {
    throw new SwapiError(
      SWAPI_ERROR_CODES.UPSTREAM,
      'Star Wars data source returned an unexpected response.',
      { status: response.status },
    );
  }

  let payload;
  try {
    payload = await response.json();
  } catch (error) {
    throw malformed('Star Wars data source returned invalid JSON.', error);
  }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw malformed('Star Wars data source returned an invalid payload.');
  }

  return payload;
}

function requireArray(value, label) {
  if (!Array.isArray(value)) {
    throw malformed(`Star Wars data source returned invalid ${label}.`);
  }
}

export async function getPeoplePage(page = 1, options = {}) {
  const payload = await requestSwapiJson(
    `people/?page=${encodeURIComponent(page)}`,
    options,
  );

  requireArray(payload.results, 'people results');
  if (!Number.isFinite(payload.count)) {
    throw malformed('Star Wars data source returned an invalid people count.');
  }

  return payload;
}

export async function getAllPeople(options = {}) {
  const {
    concurrency = DEFAULT_PEOPLE_CONCURRENCY,
    ...requestOptions
  } = options;
  const firstPage = await getPeoplePage(1, requestOptions);

  if (firstPage.count === 0) return [];
  if (firstPage.results.length === 0) {
    throw malformed('Star Wars data source returned an empty first people page.');
  }

  const totalPages = Math.ceil(firstPage.count / firstPage.results.length);
  if (totalPages > MAX_PEOPLE_PAGES) {
    throw malformed('Star Wars data source returned an unexpected people page count.');
  }

  const pageNumbers = Array.from(
    { length: Math.max(0, totalPages - 1) },
    (_, index) => index + 2,
  );
  const remainingPages = await mapWithConcurrency(
    pageNumbers,
    (page) => getPeoplePage(page, requestOptions),
    normalizeConcurrency(concurrency, DEFAULT_PEOPLE_CONCURRENCY),
  );

  return [firstPage, ...remainingPages].flatMap((page) => page.results);
}

export async function getPerson(id, options = {}) {
  const payload = await requestSwapiJson(
    `people/${encodeURIComponent(id)}/`,
    options,
  );

  if (typeof payload.name !== 'string' || typeof payload.url !== 'string') {
    throw malformed('Star Wars data source returned an invalid character.');
  }

  return payload;
}

export async function getFilms(options = {}) {
  const payload = await requestSwapiJson('films/', options);
  requireArray(payload.results, 'film results');

  return payload.results;
}

export async function getFilm(id, options = {}) {
  const payload = await requestSwapiJson(
    `films/${encodeURIComponent(id)}/`,
    options,
  );

  if (
    typeof payload.title !== 'string' ||
    !Number.isFinite(payload.episode_id)
  ) {
    throw malformed('Star Wars data source returned an invalid film.');
  }
  requireArray(payload.characters, 'film characters');

  return payload;
}

export async function getCharacterByUrl(url, options = {}) {
  return getPersonFromAbsoluteUrl(url, options);
}

export async function getCharactersByUrls(urls, options = {}) {
  requireArray(urls, 'film character URLs');

  const {
    concurrency = DEFAULT_CHARACTER_CONCURRENCY,
    ...requestOptions
  } = options;
  const uniqueUrls = [...new Set(urls)];
  const entries = await mapWithConcurrency(
    uniqueUrls,
    async (url) => [url, await getCharacterByUrl(url, requestOptions)],
    normalizeConcurrency(concurrency, DEFAULT_CHARACTER_CONCURRENCY),
  );
  const charactersByUrl = new Map(entries);

  return urls.map((url) => charactersByUrl.get(url));
}

async function getPersonFromAbsoluteUrl(url, options) {
  const payload = await requestSwapiJson(url, options);

  if (typeof payload.name !== 'string' || typeof payload.url !== 'string') {
    throw malformed('Star Wars data source returned an invalid character.');
  }

  return payload;
}
