import React, { useState, useEffect } from 'react';
import CharacterCard from '../CharacterCard';

const CharacterList = ({ characters }) => {
  const [visibleCharacters, setVisibleCharacters] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      // Determinar el número de columnas basado en el ancho de la ventana
      const width = window.innerWidth;
      let columns;
      if (width < 640) {
        columns = 1;
      } else if (width >= 640 && width < 768) {
        columns = 2;
      } else if (width >= 768) {
        columns = 3;
      } if (width >= 1024) {
        columns = 4;
      }

      // Calcular el máximo número de tarjetas para evitar filas incompletas
      const fullRows = Math.floor(characters.length / columns) * columns;
      setVisibleCharacters(characters.slice(0, fullRows));
    };

    handleResize(); // Llamar al ajustar en el montaje
    window.addEventListener('resize', handleResize); // Ajustar al cambiar tamaño

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [characters]); // Recalcular cuando la lista de personajes cambia

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6 p-12 mb-4">
      {visibleCharacters.map(character => (
        <CharacterCard key={character.url} character={character} />
      ))}
    </div>
  );
};

export default CharacterList;