import React, { useState } from 'react';
import CharacterListContainer from '../../components/CharacterList/CharacterListContainer';
import CharacterFilter from '../../components/CharacterFilter';
import FilterIcon from '../../components/FilterIcon';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import BubbleFilter from '@/components/BubbleFilter';

const CharactersPage = () => {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const [eyeColorFilter, setEyeColorFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [eyeColors, setEyeColors] = useState([]);
  const [genders, setGenders] = useState([]);

  const handleFilterChange = (type, value) => {
    if (type === 'eyeColor') {
      setEyeColorFilter(value);
    } else if (type === 'gender') {
      setGenderFilter(value);
    }
  };

  const clearFilter = (type) => {
    if (type === 'eyeColor') {
      setEyeColorFilter('');
    } else if (type === 'gender') {
      setGenderFilter('');
    }
  };

  const onColorsAndGendersReady = (colors, genders) => {
    setEyeColors(colors);
    setGenders(genders);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <>
      <Head>
        <title>{`Characters | Star Wars')}`}</title>
      </Head>
      <FilterIcon onClick={toggleFilters} />
      {showFilters && (
        <CharacterFilter
          eyeColorFilter={eyeColorFilter}
          genderFilter={genderFilter}
          eyeColors={eyeColors}
          genders={genders}
          onFilterChange={handleFilterChange}
        />
      )}
      <div className="flex space-x-4 p-4">
        {eyeColorFilter && <BubbleFilter label={t(`eye_color_${eyeColorFilter.toLowerCase()}`)} onRemove={() => clearFilter('eyeColor')} />}
        {genderFilter && <BubbleFilter label={t(`gender_${genderFilter.toLowerCase()}`)} onRemove={() => clearFilter('gender')} />}
      </div>
      <CharacterListContainer
        eyeColorFilter={eyeColorFilter}
        genderFilter={genderFilter}
        onColorsAndGendersReady={onColorsAndGendersReady}
      />
    </>
  );
};

export default CharactersPage;
