import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { CharacterListContainer, CharacterFilter } from '../../components/LazyComponents';
import FilterIcon from '../../components/FilterIcon';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import BubbleFilter from '@/components/BubbleFilter';
import { normalizeString } from '../../utils';
import fetch from 'node-fetch';

async function fetchPageData(page) {
  const response = await fetch(`https://swapi.dev/api/people/?page=${page}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
}

export async function getServerSideProps(context) {
  const data = await fetchPageData(1);
  return {
    props: {
      initialCharacters: data.results,
      totalCount: data.count,
      currentPage: 1,
      hasNextPage: Boolean(data.next),
      hasPreviousPage: false,
    },
  };
}

const CharactersPage = ({ initialCharacters, totalCount, currentPage: initialPage, hasNextPage, hasPreviousPage }) => {
  const { t } = useTranslation();
  const [currentCharacters, setCurrentCharacters] = useState(initialCharacters);
  const [eyeColors, setEyeColors] = useState(new Set(initialCharacters.map(char => char.eye_color)));
  const [genders, setGenders] = useState(new Set(initialCharacters.map(char => char.gender)));
  const [showFilters, setShowFilters] = useState(false);
  const [eyeColorFilter, setEyeColorFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(initialPage);



  const fetchAdditionalData = useCallback(async () => {
    if (!hasNextPage || currentPage !== 1) return;
    let nextPageIndex = 2;
    let morePagesAvailable = hasNextPage;
    while (morePagesAvailable) {
      const data = await fetchPageData(nextPageIndex);
      setCurrentCharacters(prevChars => [...prevChars, ...data.results]);
      setEyeColors(prevColors => new Set([...Array.from(prevColors), ...data.results.map(char => char.eye_color)]));
      setGenders(prevGenders => new Set([...Array.from(prevGenders), ...data.results.map(char => char.gender)]));
      morePagesAvailable = Boolean(data.next);
      nextPageIndex += 1;
    }
  }, [hasNextPage]);

  useEffect(() => {
    fetchAdditionalData();
  }, [initialPage, fetchAdditionalData]);

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

  const clearFilter = type => {
    if (type === 'eyeColor') {
      setEyeColorFilter('');
    } else if (type === 'gender') {
      setGenderFilter('');
    }
  };

  const toggleFilters = () => setShowFilters(!showFilters);

  return (
    <>
      <Head>
        <title>Characters | Star Wars</title>
      </Head>
      <FilterIcon onClick={toggleFilters} />
      {showFilters && (
        <Suspense fallback={<div>Loading filters...</div>}>
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
        {eyeColorFilter && <BubbleFilter label={t(`eye_color_${eyeColorFilter}`)} onRemove={() => clearFilter('eyeColor')} />}
        {genderFilter && <BubbleFilter label={t(`gender_${genderFilter}`)} onRemove={() => clearFilter('gender')} />}
      </div>
      <Suspense fallback={<div>Loading...</div>}>
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