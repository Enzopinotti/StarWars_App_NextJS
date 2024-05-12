import React, { useState, useEffect } from 'react';
import CharacterList from './CharacterList';
import Pagination from '../Pagination';
import { capitalizeFirstLetter, mapGender } from '../../utils';

const CharacterListContainer = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://swapi.dev/api/people/?page=${currentPage}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTotalCount(data.count);
        const mappedCharacters = data.results.map(character => ({
          ...character,
          name: capitalizeFirstLetter(character.name),
          eye_color: capitalizeFirstLetter(character.eye_color),
          gender: mapGender(character.gender)
        }));
        setCharacters(mappedCharacters);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (error) return <div>Error: {error}</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <>
      <CharacterList characters={characters} />
      <Pagination
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={10}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default CharacterListContainer;