import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';

const SimpleCharacterCard = ({ character }) => {
  const { t } = useTranslation();
  const characterId = character.url.match(/people\/(\d+)\//)[1];

  let genderKey = `gender_${character.gender.toLowerCase().replace('n/a', 'indefinido')}`;
  let eyeColorKey = `eye_color_${character.eye_color.toLowerCase().replace(/ /g, '_').replace('n/a', 'unknown')}`;

  return (
    <div className="text-white rounded-3xl shadow-xl bg-gradient-to-t from-black-opacity-80 to-transparent m-5">
      <Link href={`/characters/${characterId}`} passHref>
        <img src="/images/generic/img_generic_character.jpeg" alt={t(genderKey)} className="w-full object-cover rounded-tr-3xl rounded-tl-3xl" />
        <h3 className="text-center font-robotoMono text-xl p-4">{character.name}</h3>
      </Link>
    </div>
  );
};

export default SimpleCharacterCard;