import React from 'react';

const CharacterFilter = () => {
  return (
    <div className="p-4">
      <select className="p-2 rounded border">
        <option value="">Filter by Eye Color</option>
        {/* Opciones de colores de ojos */}
      </select>
      <select className="p-2 rounded border ml-2">
        <option value="">Filter by Gender</option>
        {/* Opciones de género */}
      </select>
    </div>
  );
};

export default CharacterFilter;