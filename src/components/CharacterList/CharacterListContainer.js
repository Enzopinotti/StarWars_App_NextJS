import React from 'react';
import CharacterList from './CharacterList';
import Pagination from '../Pagination';

const CharacterListContainer = ({
  characters,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
}) => {
  return (
    <>
      <CharacterList characters={characters} />
      <Pagination
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default CharacterListContainer;
