import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCharacterPageModel } from '../src/lib/character-query.mjs';
import {
  getAllPeople,
  getCharactersByUrls,
} from '../src/lib/swapi.mjs';

const BASE_URL = 'https://example.test/api/';

function response(payload) {
  return {
    status: 200,
    ok: true,
    async json() {
      return payload;
    },
  };
}

function character(id, { eyeColor = 'brown', gender = 'male' } = {}) {
  return {
    name: `Character ${id}`,
    eye_color: eyeColor,
    gender,
    url: `${BASE_URL}people/${id}/`,
  };
}

test('character model filters globally but returns only one browser page', () => {
  const characters = Array.from({ length: 25 }, (_, index) =>
    character(index + 1, {
      eyeColor: [12, 23].includes(index + 1) ? 'blue' : 'brown',
      gender: (index + 1) % 2 === 0 ? 'female' : 'male',
    }),
  );

  const filtered = buildCharacterPageModel(characters, {
    eyeColor: 'blue',
    page: '1',
  });

  assert.equal(filtered.totalCount, 2);
  assert.deepEqual(
    filtered.characters.map((item) => item.name),
    ['Character 12', 'Character 23'],
  );
  assert.equal(filtered.characters.length, 2);
  assert.deepEqual(filtered.eyeColors, ['blue', 'brown']);
  assert.deepEqual(filtered.genders, ['female', 'male']);
});

test('character model clamps invalid and oversized page numbers', () => {
  const characters = Array.from({ length: 25 }, (_, index) =>
    character(index + 1),
  );

  assert.equal(
    buildCharacterPageModel(characters, { page: 'not-a-page' }).currentPage,
    1,
  );

  const lastPage = buildCharacterPageModel(characters, { page: '99' });
  assert.equal(lastPage.currentPage, 3);
  assert.equal(lastPage.characters.length, 5);
  assert.equal(lastPage.characters[0].name, 'Character 21');
});

test('people catalog fetch is bounded and requests each upstream page once', async () => {
  let active = 0;
  let maxActive = 0;
  const requestedPages = [];

  const fetchImpl = async (url) => {
    const page = Number(new URL(url).searchParams.get('page'));
    requestedPages.push(page);
    active += 1;
    maxActive = Math.max(maxActive, active);
    await new Promise((resolve) => setTimeout(resolve, 15));
    active -= 1;

    const start = (page - 1) * 10 + 1;
    const remaining = Math.max(0, 25 - start + 1);
    const size = Math.min(10, remaining);

    return response({
      count: 25,
      next: page < 3 ? `${BASE_URL}people/?page=${page + 1}` : null,
      previous: page > 1 ? `${BASE_URL}people/?page=${page - 1}` : null,
      results: Array.from({ length: size }, (_, index) =>
        character(start + index),
      ),
    });
  };

  const people = await getAllPeople({
    baseUrl: BASE_URL,
    fetchImpl,
    concurrency: 2,
  });

  assert.equal(people.length, 25);
  assert.deepEqual([...requestedPages].sort((a, b) => a - b), [1, 2, 3]);
  assert.ok(maxActive <= 2, `max people concurrency was ${maxActive}`);
});

test('film character fan-out is deduplicated, ordered and concurrency-limited', async () => {
  let active = 0;
  let maxActive = 0;
  const requestedIds = [];

  const fetchImpl = async (url) => {
    const match = new URL(url).pathname.match(/people\/(\d+)\/$/);
    const id = Number(match?.[1]);
    requestedIds.push(id);
    active += 1;
    maxActive = Math.max(maxActive, active);
    await new Promise((resolve) => setTimeout(resolve, 15));
    active -= 1;

    return response(character(id));
  };

  const urls = [
    `${BASE_URL}people/1/`,
    `${BASE_URL}people/2/`,
    `${BASE_URL}people/3/`,
    `${BASE_URL}people/1/`,
  ];
  const characters = await getCharactersByUrls(urls, {
    baseUrl: BASE_URL,
    fetchImpl,
    concurrency: 2,
  });

  assert.deepEqual(
    characters.map((item) => item.name),
    ['Character 1', 'Character 2', 'Character 3', 'Character 1'],
  );
  assert.deepEqual([...requestedIds].sort((a, b) => a - b), [1, 2, 3]);
  assert.ok(maxActive <= 2, `max film-character concurrency was ${maxActive}`);
});
