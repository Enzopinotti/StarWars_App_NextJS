import React, { Suspense, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import BubbleFilter from '@/components/BubbleFilter';
import { CharacterListContainer, CharacterFilter } from '../../components/LazyComponents';
import FilterIcon from '../../components/FilterIcon';
import { getPeoplePage } from '../../lib/swapi.mjs';
import { normalizeString } from '../../utils';

export async function getServerSideProps(context) {
  try {
    const data = await getPeoplePage(1);

    return {
      props: {
        initialCharacters: data.results,
        totalCount: data.count,
        currentPage: 1,
        hasNextPage: Boolean(data.next),
        hasPreviousPage: false,
        upstreamError: false,
      },
    };
  } catch {
    context.res.statusCode = 503;

    return {
      props: {
        initialCharacters: [],
        totalCount: 0,
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        upstreamError: true,
      },
    };
  }
}

const CharactersPage = ({
  initialCharacters,
  totalCount,
  currentPage: initialPage,
  hasNextPage,
  hasPreviousPage,
  upstreamError,
}) => {
  const { t } = useTranslation();
  const [currentCharacters, setCurrentCharacters] = useState(initialCharacters);
  const [eyeColors, setEyeColors] = useState(
    new Set(initialCharacters.map((character) => character.eye_color)),
  );
  const [genders, setGenders] = useState(
    new Set(initialCharacters.map((character) => character.gender)),
  );
  const [showFilters, setShowFilters] = useState(false);
  const [eyeColorFilter, setEyeColorFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [additionalLoadError, setAdditionalLoadError] = useState(false);

  const fetchAdditionalData = useCallback(async () => {
    if (!hasNextPage || currentPage !== 1) return;

    let nextPageIndex = 2;
    let morePagesAvailable = hasNextPage;

    try {
      while (morePagesAvailable) {
        const data = await getPeoplePage(nextPageIndex);

        setCurrentCharacters((previous) => [...previous, ...data.results]);
        setEyeColors(
          (previous) =>
            new Set([
              ...Array.from(previous),
              ...data.results.map((character) => character.eye_color),
            ]),
        );
        setGenders(
          (previous) =>
            new Set([
              ...Array.from(previous),
              ...data.results.map((character) => character.gender),
            ]),
        );

        morePagesAvailable = Boolean(data.next);
        nextPageIndex += 1;
      }
    } catch {
      setAdditionalLoadError(true);
    }
  }, [currentPage, hasNextPage]);

  useEffect(() => {
    fetchAdditionalData();
  }, [fetchAdditionalData]);

  if (upstreamError) {
    return (
      <>
        <Head>
          <title>Characters | Star Wars</title>
        </Head>
        <div className="h-screen flex justify-center items-center">
          <p className="text-white font-orbitron">{t('dataSourceError')}</p>
        </div>
      </>
    );
  }

  const handleFilterChange = (type, value) => {
    const normalizedValue = normalizeString(value);
    if (type === 'eyeColor') {
      setEyeColorFilter(normalizedValue);
    } else if (type === 'gender') {
      setGenderFilter(normalizedValue);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const clearFilter = (type) => {
    if (type === 'eyeColor') {
      setEyeColorFilter('');
    } else if (type === 'gender') {
      setGenderFilter('');
    }
  };

  const toggleFilters = () => setShowFilters((previous) => !previous);

  return (
    <>
      <Head>
        <title>Characters | Star Wars</title>
      </Head>
      <FilterIcon onClick={toggleFilters} />
      {showFilters && (
        <Suspense fallback={<div>{t('loadingFilters')}</div>}>
          <CharacterFilter
            eyeColorFilter={eyeColorFilter}
            genderFilter={genderFilter}
            eyeColors={Array.from(eyeColors)}
            genders={Array.from(genders)}
            onFilterChange={handleFilterChange}
          />
        </Suspense>
      )}
      <div className="flex space-x-4 p-4">
        {eyeColorFilter && (
          <BubbleFilter
            label={t(`eye_color_${eyeColorFilter}`)}
            onRemove={() => clearFilter('eyeColor')}
          />
        )}
        {genderFilter && (
          <BubbleFilter
            label={t(`gender_${genderFilter}`)}
            onRemove={() => clearFilter('gender')}
          />
        )}
      </div>
      {additionalLoadError && (
        <p className="text-white text-center font-robotoMono px-4">
          {t('additionalDataError')}
        </p>
      )}
      <Suspense fallback={<div>{t('loading')}</div>}>
        <CharacterListContainer
          characters={currentCharacters}
          totalCount={totalCount}
          currentPage={currentPage}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          eyeColorFilter={eyeColorFilter}
          genderFilter={genderFilter}
          onPageChange={handlePageChange}
          setCurrentPage={setCurrentPage}
        />
      </Suspense>
    </>
  );
};

export default CharactersPage;
