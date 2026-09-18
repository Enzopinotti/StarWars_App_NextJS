import React, { Suspense, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import BubbleFilter from '@/components/BubbleFilter';
import { CharacterListContainer, CharacterFilter } from '../../components/LazyComponents';
import FilterIcon from '../../components/FilterIcon';
import { buildCharacterPageModel, normalizeFacet } from '../../lib/character-query.mjs';
import { getAllPeople } from '../../lib/swapi.mjs';

export async function getServerSideProps(context) {
  try {
    const characters = await getAllPeople();
    const pageModel = buildCharacterPageModel(characters, context.query);

    return {
      props: {
        ...pageModel,
        upstreamError: false,
      },
    };
  } catch {
    context.res.statusCode = 503;

    return {
      props: {
        characters: [],
        totalCount: 0,
        currentPage: 1,
        pageSize: 10,
        eyeColors: [],
        genders: [],
        eyeColorFilter: '',
        genderFilter: '',
        upstreamError: true,
      },
    };
  }
}

const CharactersPage = ({
  characters,
  totalCount,
  currentPage,
  pageSize,
  eyeColors,
  genders,
  eyeColorFilter,
  genderFilter,
  upstreamError,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);

  const pushCharacterQuery = (changes) => {
    const query = { ...router.query, ...changes };

    for (const [key, value] of Object.entries(query)) {
      if (value === '' || value == null) delete query[key];
    }

    void router.push(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { scroll: false },
    );
  };

  const handleFilterChange = (type, value) => {
    const normalizedValue = normalizeFacet(value);

    if (type === 'eyeColor') {
      pushCharacterQuery({ eyeColor: normalizedValue, page: '1' });
    } else if (type === 'gender') {
      pushCharacterQuery({ gender: normalizedValue, page: '1' });
    }
  };

  const clearFilter = (type) => {
    if (type === 'eyeColor') {
      pushCharacterQuery({ eyeColor: '', page: '1' });
    } else if (type === 'gender') {
      pushCharacterQuery({ gender: '', page: '1' });
    }
  };

  const handlePageChange = (page) => {
    if (Number.isInteger(page) && page > 0) {
      pushCharacterQuery({ page: String(page) });
    }
  };

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

  return (
    <>
      <Head>
        <title>Characters | Star Wars</title>
      </Head>
      <FilterIcon
        isOpen={showFilters}
        onClick={() => setShowFilters((previous) => !previous)}
      />
      <div id="character-filters" hidden={!showFilters}>
        <Suspense fallback={<div>{t('loadingFilters')}</div>}>
          <CharacterFilter
            eyeColors={eyeColors}
            genders={genders}
            onFilterChange={handleFilterChange}
          />
        </Suspense>
      </div>
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
      <Suspense fallback={<div>{t('loading')}</div>}>
        <CharacterListContainer
          characters={characters}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </Suspense>
    </>
  );
};

export default CharactersPage;
