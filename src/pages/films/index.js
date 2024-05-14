import React, { useEffect, useState } from 'react';
import FilmCard from '../../components/FilmCard';

const FilmsPage = () => {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://swapi.dev/api/films/')
      .then(response => response.json())
      .then(data => {
        setFilms(data.results.sort((a, b) => a.episode_id - b.episode_id)); 
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="h-screen flex justify-center items-center">
      <p className="text-white font-orbitron">Cargando películas...</p>
    </div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10 p-8">
      {films.map(film => (
        <FilmCard key={film.episode_id} film={film} />
      ))}
    </div>
  );
};

export default FilmsPage;