import React from 'react';
import CharacterCard from '../CharacterCard';

const CharacterList = ({ characters }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 p-12">
      {characters.map(character => (
        <CharacterCard key={character.url} character={character} />
      ))}
    </div>
  );
};

export default CharacterList;