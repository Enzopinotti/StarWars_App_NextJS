import React, { useState, useEffect } from 'react';
import CharacterList from './CharacterList';
import Pagination from '../Pagination';
import { capitalizeFirstLetter, mapGender } from '../../utils';

const CharacterListContainer = ({ eyeColorFilter, genderFilter, onColorsAndGendersReady }) => {
  const [characters, setCharacters] = useState([]);
  const [allCharacters, setAllCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Inicializa con 1 por defecto
  const [totalCount, setTotalCount] = useState(0);
  const [eyeColors, setEyeColors] = useState(new Set());
  const [genders, setGenders] = useState(new Set());

  useEffect(() => {
    const storedPage = localStorage.getItem('currentPage');
    if (storedPage) {
      setCurrentPage(parseInt(storedPage));
    }
    fetchAllCharacters();
  }, []);

  useEffect(() => {
    if (!loading) {
      const uniqueEyeColors = [...eyeColors];
      const uniqueGenders = [...genders];
      onColorsAndGendersReady(uniqueEyeColors, uniqueGenders);
    }
  }, [loading, eyeColors, genders]);

  const fetchAllCharacters = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`https://swapi.dev/api/people/?page=${page}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const newCharacters = data.results.map(character => ({
        ...character,
        name: capitalizeFirstLetter(character.name),
        eye_color: capitalizeFirstLetter(character.eye_color),
        gender: mapGender(character.gender)
      }));
      setAllCharacters(prev => [...prev, ...newCharacters]);
      newCharacters.forEach(char => {
        eyeColors.add(char.eye_color);
        genders.add(char.gender);
      });

      if (data.next) {
        fetchAllCharacters(page + 1);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [eyeColorFilter, genderFilter, allCharacters]);

  const applyFilters = () => {
    const filtered = allCharacters.filter(char => {
      return (!eyeColorFilter || char.eye_color === eyeColorFilter) &&
             (!genderFilter || char.gender === genderFilter);
    });
    setCharacters(filtered);
    setTotalCount(filtered.length);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    localStorage.setItem('currentPage', newPage.toString());
  };

  if (error) return <div>Error: {error}</div>;
  if (loading && characters.length === 0) return <div className="h-screen flex justify-center items-center">Loading...</div>;

  return (
    <>
      <CharacterList characters={characters.slice((currentPage - 1) * 10, currentPage * 10)} />
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
