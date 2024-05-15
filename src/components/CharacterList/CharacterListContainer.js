import React, { useEffect, useState } from 'react';
import CharacterList from './CharacterList';
import Pagination from '../Pagination';
import { normalizeString } from '@/utils';

const CharacterListContainer = ({ characters, totalCount, currentPage, hasNextPage, hasPreviousPage, eyeColorFilter, genderFilter, onPageChange, setCurrentPage }) => {
  const [filteredCharacters, setFilteredCharacters] = useState([]);

  useEffect(() => {
    const applyFilters = () => {
      return characters.filter(character => {
        const normalizedEyeColor = normalizeString(character.eye_color);
        const normalizedGender = normalizeString(character.gender);
        return (!eyeColorFilter || normalizedEyeColor === eyeColorFilter) &&
               (!genderFilter || normalizedGender === genderFilter);
      });
    };
    setFilteredCharacters(applyFilters());
    setCurrentPage(1);
  }, [characters, eyeColorFilter, genderFilter]);

  return (
    <>
      <CharacterList
        characters={filteredCharacters.slice((currentPage - 1) * 10, currentPage * 10)}
        isFiltering={!!eyeColorFilter || !!genderFilter}
        totalCount={filteredCharacters.length}
        pageSize={10}
        currentPage={currentPage}
      />
      <Pagination
        currentPage={currentPage}
        totalCount={filteredCharacters.length}
        pageSize={10}
        onPageChange={onPageChange}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
      />
    </>
  );
};

export default CharacterListContainer;