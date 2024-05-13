import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonFilter from './ButtonFilter';

const CharacterFilter = ({ onFilterChange, eyeColorFilter, genderFilter, eyeColors, genders }) => {
  const { t } = useTranslation();
  const [isOpenEyeColor, setIsOpenEyeColor] = useState(false);
  const [isOpenGender, setIsOpenGender] = useState(false);

  const translatedEyeColors = eyeColors.map(color => ({
    key: color,
    label: t(`eye_color_${color.toLowerCase().replace(/, /g, '_').replace(/ /g, '_')}`)
  }));

  const translatedGenders = genders.map(gender => ({
    key: gender,
    label: t(`gender_${gender.toLowerCase()}`)
  }));

  if (eyeColors.length === 0 && genders.length === 0) {
    return (
      <div className="flex justify-center items-center p-4 navbar-gradient rounded-lg shadow h-20">
        <p className='text-white font-orbitron pulse-animation'>Cargando filtros...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-around p-4 navbar-gradient rounded-lg shadow">
      <ButtonFilter
        icon="vision"
        label={t('eyeColor')}
        isOpen={isOpenEyeColor}
        toggleDropdown={() => setIsOpenEyeColor(!isOpenEyeColor)}
      >
        <ul className="py-1">
          {translatedEyeColors.length > 0 ? translatedEyeColors.map(({ key, label }) => (
            <li key={key}
                className="px-4 py-2 text-white hover:bg-gray-600 cursor-pointer"
                onClick={() => { onFilterChange('eyeColor', key); setIsOpenEyeColor(false); }}
            >
              {label}
            </li>
          )) : <li className="px-4 py-2 text-white">Sin opciones</li>}
        </ul>
      </ButtonFilter>

      <ButtonFilter
        icon="gender"
        label={t('gender')}
        isOpen={isOpenGender}
        toggleDropdown={() => setIsOpenGender(!isOpenGender)}
      >
        <ul className="py-1">
          {translatedGenders.length > 0 ? translatedGenders.map(({ key, label }) => (
            <li key={key}
                className="px-4 py-2 text-white hover:bg-gray-600 cursor-pointer"
                onClick={() => { onFilterChange('gender', key); setIsOpenGender(false); }}
            >
              {label}
            </li>
          )) : <li className="px-4 py-2 text-white">Sin opciones</li>}
        </ul>
      </ButtonFilter>
    </div>
  );
};

export default CharacterFilter;