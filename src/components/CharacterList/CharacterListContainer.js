import React, { useState, useEffect } from 'react';
import CharacterList from './CharacterList';
import { capitalizeFirstLetter, mapGender } from '../../utils'; // Asegúrate de ajustar la ruta de importación según sea necesario

const CharacterListContainer = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://swapi.dev/api/people');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
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
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (loading) return <div>Loading...</div>;

  return <CharacterList characters={characters} />;
};

export default CharacterListContainer;