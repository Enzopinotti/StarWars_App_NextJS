import Link from 'next/link';
import React from 'react';

const SimpleCharacterCard = ({ character }) => {
  const characterId = character.url.match(/people\/(\d+)\//)?.[1];

  if (!characterId) return null;

  return (
    <div className="text-white rounded-3xl shadow-xl bg-gradient-to-t from-black-opacity-80 to-transparent m-5">
      <Link href={`/characters/${characterId}`}>
        <img
          src="/images/generic/img_generic_character.jpeg"
          alt={character.name}
          className="w-full object-cover rounded-tr-3xl rounded-tl-3xl"
        />
        <h3 className="text-center font-robotoMono text-xl p-4">
          {character.name}
        </h3>
      </Link>
    </div>
  );
};

export default SimpleCharacterCard;
