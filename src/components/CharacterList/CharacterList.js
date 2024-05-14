import React, { useEffect, useState } from 'react';
import CharacterCard from '../CharacterCard';

const CharacterList = ({ characters, isFiltering, totalCount, pageSize, currentPage }) => {
  const [visibleCharacters, setVisibleCharacters] = useState(characters);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let columns;
      if (width < 640) {
        columns = 1;
      } else if (width >= 640 && width < 768) {
        columns = 2;
      } else if (width >= 768 && width < 1024) {
        columns = 3;
      } else {
        columns = 4;
      }

      const isLastPage = currentPage * pageSize >= totalCount;
      const fullRowsCount = (isFiltering || isLastPage) ? characters.length : Math.floor(characters.length / columns) * columns;
      setVisibleCharacters(characters.slice(0, fullRowsCount));
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [characters, isFiltering, totalCount, pageSize, currentPage]);  

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6 p-12 mb-4">
      {visibleCharacters.map(character => (
        <CharacterCard key={character.url} character={character} />
      ))}
    </div>
  );
};

export default CharacterList;