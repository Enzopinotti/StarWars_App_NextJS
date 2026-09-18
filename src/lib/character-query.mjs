const DEFAULT_PAGE_SIZE = 10;

function firstQueryValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

export function normalizeFacet(value) {
  return String(firstQueryValue(value) ?? '')
    .trim()
    .toLowerCase()
    .replace(/,\s*/g, '_')
    .replace(/\s+/g, '_');
}

function parsePage(value) {
  const parsed = Number.parseInt(String(firstQueryValue(value) ?? '1'), 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function uniqueSorted(values) {
  return [...new Set(values.filter((value) => typeof value === 'string' && value))]
    .sort((left, right) => left.localeCompare(right));
}

export function buildCharacterPageModel(
  characters,
  query = {},
  pageSize = DEFAULT_PAGE_SIZE,
) {
  if (!Array.isArray(characters)) {
    throw new TypeError('characters must be an array');
  }

  const safePageSize =
    Number.isInteger(pageSize) && pageSize > 0 ? pageSize : DEFAULT_PAGE_SIZE;
  const eyeColorFilter = normalizeFacet(query.eyeColor);
  const genderFilter = normalizeFacet(query.gender);

  const filteredCharacters = characters.filter((character) => {
    const eyeColor = normalizeFacet(character?.eye_color);
    const gender = normalizeFacet(character?.gender);

    return (
      (!eyeColorFilter || eyeColor === eyeColorFilter) &&
      (!genderFilter || gender === genderFilter)
    );
  });

  const pageCount = Math.max(
    1,
    Math.ceil(filteredCharacters.length / safePageSize),
  );
  const currentPage = Math.min(parsePage(query.page), pageCount);
  const offset = (currentPage - 1) * safePageSize;

  return {
    characters: filteredCharacters.slice(offset, offset + safePageSize),
    totalCount: filteredCharacters.length,
    currentPage,
    pageSize: safePageSize,
    eyeColors: uniqueSorted(characters.map((character) => character?.eye_color)),
    genders: uniqueSorted(characters.map((character) => character?.gender)),
    eyeColorFilter,
    genderFilter,
  };
}
